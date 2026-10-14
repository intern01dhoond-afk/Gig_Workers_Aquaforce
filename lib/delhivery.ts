export const DELHIVERY_API_TOKEN = (
  process.env.DELHIVERY_API_TOKEN || "896739f8bbc9a0d080336cd9504af9fd22c324a3"
).trim();

export const DELHIVERY_PICKUP_LOCATION = (
  process.env.DELHIVERY_PICKUP_LOCATION || "AMEC MOBILITY B2C"
).trim();

export const DELHIVERY_PICKUP_ADDRESS = (
  process.env.DELHIVERY_PICKUP_ADDRESS ||
  "PLOT NO.5A, 3RD FLOOR Nagpur MIDC HINGNA BESIDE JAIKA TATA MOTORS SERVICE CENTRE"
).trim();

export const DELHIVERY_PICKUP_PINCODE = (
  process.env.DELHIVERY_PICKUP_PINCODE || "440016"
).trim();

export interface CreateShipmentOptions {
  orderId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  alternatePhone?: string;
  deliveryAddress?: string;
  shippingAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pin?: string;
  product?: string;
  productName?: string;
  quantity?: number | string;
  amount?: number | string;
  paymentMode?: string;
  codAmount?: number;
  advanceAmount?: number;
  customer?: any;
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
  const customerObj = options.customer || {};

  const fullName = (
    options.fullName ||
    options.name ||
    customerObj.fullName ||
    customerObj.name ||
    "Customer"
  ).trim();

  const rawPhone = String(
    options.phone ||
    customerObj.phone ||
    ""
  );
  const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);

  const rawAltPhone = String(
    options.altPhone ||
    options.alternatePhone ||
    customerObj.altPhone ||
    customerObj.alternatePhone ||
    ""
  );
  const cleanAltPhone = rawAltPhone.replace(/\D/g, "").slice(-10);
  const hasAltPhone = cleanAltPhone.length === 10 && cleanAltPhone !== cleanPhone;

  const rawAddress = (
    options.deliveryAddress ||
    options.shippingAddress ||
    options.address ||
    customerObj.shippingAddress ||
    customerObj.deliveryAddress ||
    customerObj.address ||
    ""
  ).trim();

  const resolvedAddress = hasAltPhone
    ? `${rawAddress} (Alt Phone: ${cleanAltPhone})`
    : rawAddress;

  const city = (
    options.city ||
    customerObj.city ||
    "Nagpur"
  ).trim();

  const state = (
    options.state ||
    customerObj.state ||
    "Maharashtra"
  ).trim();

  const rawPincode = String(
    options.pincode ||
    options.pin ||
    customerObj.pincode ||
    customerObj.pin ||
    ""
  ).replace(/\D/g, "").slice(0, 6);

  const returnPinNumber = Number(DELHIVERY_PICKUP_PINCODE.replace(/\D/g, "")) || 440016;

  const amount = options.amount || customerObj.amount || 37999;
  const paymentMode = options.paymentMode || "Pre-paid";
  const codAmount = options.codAmount;
  const isCod = paymentMode === "COD" || Number(codAmount) > 0;
  const resolvedCodAmount = isCod
    ? Math.round(Number(codAmount) || Number(amount) * 0.9)
    : 0;
  const resolvedPaymentMode = isCod ? "COD" : "Pre-paid";

  const orderId = options.orderId || `PROMEC_${Date.now()}`;
  const quantity = Math.max(1, Number(options.quantity) || 1);
  const product =
    options.product ||
    options.productName ||
    "Cordless AquaForce® 1400 High-pressure Washer System";

  const payload = {
    shipments: [
      {
        name: fullName,
        add: resolvedAddress,
        pin: rawPincode,
        city: city,
        state: state,
        country: "India",
        phone: cleanPhone,
        alt_phone: hasAltPhone ? cleanAltPhone : undefined,
        order: orderId,
        payment_mode: resolvedPaymentMode,
        return_add: DELHIVERY_PICKUP_ADDRESS,
        return_pin: returnPinNumber,
        return_city: "Nagpur",
        return_state: "Maharashtra",
        return_country: "India",
        products_desc: product.slice(0, 100),
        hsn_code: "84243000",
        cod_amount: resolvedCodAmount,
        order_date: new Date().toISOString(),
        total_amount: Math.round(Number(amount)),
        quantity: String(quantity),
        seller_name: "Promec India",
        weight: 18000 * quantity,
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
      pin: returnPinNumber,
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

    // Flatten nested remarks array if present
    let failureReason = "Failed to create shipment on Delhivery";
    if (Array.isArray(pkg?.remarks)) {
      const flat = pkg.remarks.flat();
      if (flat.length > 0 && typeof flat[0] === "string") {
        failureReason = flat.join("; ");
      }
    } else if (typeof pkg?.remarks === "string") {
      failureReason = pkg.remarks;
    } else if (data?.rmk) {
      failureReason = typeof data.rmk === "string" ? data.rmk : JSON.stringify(data.rmk);
    } else if (data?.error) {
      failureReason = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
    }

    if (failureReason.toLowerCase().includes("insufficient balance")) {
      console.error(
        "[Delhivery Error] Delhivery Prepaid Wallet balance is insufficient to create this shipment. Please recharge your Delhivery wallet on Delhivery One portal."
      );
    }

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
