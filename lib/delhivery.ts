export const DELHIVERY_API_TOKEN =
  process.env.DELHIVERY_API_TOKEN || "896739f8bbc9a0d080336cd9504af9fd22c324a3";

export const DELHIVERY_PICKUP_LOCATION =
  process.env.DELHIVERY_PICKUP_LOCATION || "AMEC MOBILITY B2C";

export const DELHIVERY_PICKUP_ADDRESS =
  process.env.DELHIVERY_PICKUP_ADDRESS ||
  "PLOT NO.5A, 3RD FLOOR Nagpur MIDC HINGNA BESIDE JAIKA TATA MOTORS SERVICE CENTRE";

export const DELHIVERY_PICKUP_PINCODE =
  process.env.DELHIVERY_PICKUP_PINCODE || "440016";

export interface CreateShipmentOptions {
  orderId: string;
  fullName: string;
  email?: string;
  phone: string;
  altPhone?: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  product?: string;
  quantity?: number | string;
  amount?: number | string;
  paymentMode?: string;
  codAmount?: number;
  advanceAmount?: number;
}

export interface CreateShipmentResult {
  success: boolean;
  waybill?: string;
  error?: string;
  raw?: any;
}

export async function createDelhiveryShipment(
  options: CreateShipmentOptions
): Promise<CreateShipmentResult> {
  const {
    orderId,
    fullName,
    phone,
    altPhone,
    deliveryAddress,
    city,
    state,
    pincode,
    product,
    quantity,
    amount,
    paymentMode,
    codAmount,
  } = options;

  const isCod = paymentMode === "COD" || Number(codAmount) > 0;
  const resolvedCodAmount = isCod
    ? Math.round(Number(codAmount) || Number(amount) * 0.9)
    : 0;
  const resolvedPaymentMode = isCod ? "COD" : "Pre-paid";

  const hasAltPhone =
    altPhone && altPhone !== "N/A" && altPhone.trim().length > 0;
  const resolvedAddress = hasAltPhone
    ? `${deliveryAddress} (Alt Phone: ${altPhone})`
    : deliveryAddress;

  const payload = {
    shipments: [
      {
        name: fullName,
        add: resolvedAddress,
        pin: pincode,
        city: city,
        state: state,
        country: "India",
        phone: phone,
        alt_phone: hasAltPhone ? altPhone : undefined,
        order: orderId || `ORD_${Date.now()}`,
        payment_mode: resolvedPaymentMode,
        return_add: DELHIVERY_PICKUP_ADDRESS,
        return_pin: DELHIVERY_PICKUP_PINCODE,
        return_city: "Nagpur",
        return_state: "Maharashtra",
        return_country: "India",
        products_desc: product || "Cordless AquaForce® 1400 High-pressure Washer System (COMMERCIAL PRO KIT)",
        hsn_code: "84243000",
        cod_amount: resolvedCodAmount,
        order_date: new Date().toISOString(),
        total_amount: Number(amount) || 37999,
        quantity: String(quantity || 1),
        seller_name: "Promec India",
        weight: 18000 * Math.max(1, Number(quantity) || 1),
        shipment_length: 60,
        shipment_width: 41,
        shipment_height: 41,
        length: 60,
        width: 41,
        height: 41,
      },
    ],
    pickup_location: {
      name: DELHIVERY_PICKUP_LOCATION,
      add: DELHIVERY_PICKUP_ADDRESS,
      city: "Nagpur",
      state: "Maharashtra",
      pin: DELHIVERY_PICKUP_PINCODE,
    },
  };

  const formData = new URLSearchParams();
  formData.append("format", "json");
  formData.append("data", JSON.stringify(payload));

  try {
    const res = await fetch("https://track.delhivery.com/api/cmu/create.json", {
      method: "POST",
      headers: {
        Authorization: `Token ${DELHIVERY_API_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await res.json();
    console.log("Delhivery CMU Create Response:", JSON.stringify(data, null, 2));

    const pkg = data?.packages?.[0];
    const isPackageFailed = pkg?.status === "Fail" || !pkg?.waybill;

    if (data?.success && !isPackageFailed && pkg?.waybill) {
      return {
        success: true,
        waybill: pkg.waybill,
        raw: data,
      };
    }

    const failureReason =
      pkg?.remarks?.[0] ||
      data?.rmk ||
      data?.error ||
      "Failed to create shipment on Delhivery (check wallet balance or address)";

    return {
      success: false,
      error: failureReason,
      raw: data,
    };
  } catch (err: any) {
    console.error("Delhivery API network/call error:", err);
    return {
      success: false,
      error: err.message || "Failed to contact Delhivery API",
    };
  }
}
