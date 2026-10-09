export const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || "";
export const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || "";
export const SHIPROCKET_PICKUP_LOCATION =
  process.env.SHIPROCKET_PICKUP_LOCATION || "primary_warehouse";
export const SHIPROCKET_PICKUP_PINCODE =
  process.env.SHIPROCKET_PICKUP_PINCODE || "440016";

// Token caching in memory
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obtain Shiprocket API JWT Bearer Token
 */
export async function getShiprocketToken(): Promise<string> {
  const now = Date.now();
  // Return cached token if still valid (tokens are valid for 10 days)
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      cachedToken = data.token;
      // Cache token for 7 days (7 * 24 * 60 * 60 * 1000 ms)
      tokenExpiresAt = now + 7 * 24 * 60 * 60 * 1000;
      return data.token;
    }

    throw new Error(
      data.message || data.error || `Shiprocket Auth Failed (${res.status})`
    );
  } catch (err: any) {
    console.error("Shiprocket Auth Login Error:", err);
    throw new Error(err.message || "Failed to authenticate with Shiprocket");
  }
}

export interface CreateShiprocketShipmentOptions {
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

export interface CreateShiprocketShipmentResult {
  success: boolean;
  orderId?: string | number;
  shipmentId?: string | number;
  awbCode?: string;
  courierName?: string;
  error?: string;
  raw?: any;
}

/**
 * Create Adhoc Order in Shiprocket
 */
export async function createShiprocketShipment(
  options: CreateShiprocketShipmentOptions
): Promise<CreateShiprocketShipmentResult> {
  const {
    orderId,
    fullName,
    email,
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

  try {
    const token = await getShiprocketToken();
    const isCod = paymentMode === "COD" || Number(codAmount) > 0;
    const resolvedCodAmount = isCod
      ? Math.round(Number(codAmount) || Number(amount) * 0.9)
      : 0;

    const hasAltPhone =
      altPhone && altPhone !== "N/A" && altPhone.trim().length > 0;

    const formattedDate = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 16);

    const payload = {
      order_id: orderId || `ORD_${Date.now()}`,
      order_date: formattedDate,
      pickup_location: SHIPROCKET_PICKUP_LOCATION,
      channel_id: process.env.SHIPROCKET_CHANNEL_ID || "12211988",
      comment: "Next.js Custom E-commerce Order",
      billing_customer_name: fullName || "Valued Customer",
      billing_last_name: "",
      billing_address: deliveryAddress,
      billing_address_2: hasAltPhone ? `Alt Phone: ${altPhone}` : "",
      billing_city: city,
      billing_pincode: pincode,
      billing_state: state,
      billing_country: "India",
      billing_email: email || "orders@promectools.in",
      billing_phone: phone,
      shipping_is_billing: true,
      order_items: [
        {
          name: product || "Commercial Cordless AquaForce® 1400 High-pressure Washer System (COMMERCIAL PRO KIT)",
          sku: "AMEC-AQUAFORCE-1400",
          units: Math.max(1, Number(quantity) || 1),
          selling_price: Math.round(Number(amount) || 37999),
          discount: 0,
          tax: 0,
          hsn: "84243000",
        },
      ],
      payment_method: isCod ? "COD" : "Prepaid",
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: isCod ? resolvedCodAmount : Math.round(Number(amount) || 37999),
      length: 60,
      breadth: 41,
      height: 41,
      weight: 8.5 * Math.max(1, Number(quantity) || 1),
    };

    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: JSON.stringify(payload),
      }
    );

    const resText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(resText);
    } catch {
      console.warn("Shiprocket response was non-JSON:", res.status, resText);
    }
    console.log("Shiprocket Order Create Response:", JSON.stringify(data, null, 2));

    if (res.ok && (data.order_id || data.shipment_id)) {
      return {
        success: true,
        orderId: data.order_id,
        shipmentId: data.shipment_id,
        awbCode: data.awb_code || data.shipment_id ? String(data.shipment_id) : undefined,
        courierName: data.courier_name || "Shiprocket Express",
        raw: data,
      };
    }

    const errorMsg =
      data.message ||
      (Array.isArray(data.errors) ? data.errors.join(", ") : null) ||
      "Failed to create order on Shiprocket";

    return {
      success: false,
      error: errorMsg,
      raw: data,
    };
  } catch (err: any) {
    console.error("Shiprocket Create Order API Error:", err);
    return {
      success: false,
      error: err.message || "Failed to communicate with Shiprocket API",
    };
  }
}

/**
 * Check Pincode Serviceability via Shiprocket
 */
export async function checkShiprocketServiceability(
  pincode: string,
  isCod: boolean = true
) {
  try {
    const token = await getShiprocketToken();
    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${SHIPROCKET_PICKUP_PINCODE}&delivery_postcode=${pincode}&weight=8.5&cod=${
      isCod ? 1 : 0
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.status === 200 && data.data) {
      const companies = data.data.available_courier_companies || [];
      const serviceable = companies.length > 0;
      const codAvailable = companies.some(
        (c: any) => c.cod === 1 || c.is_cod === 1
      );

      return {
        success: true,
        serviceable,
        cod: codAvailable,
        couriersCount: companies.length,
        raw: data,
      };
    }

    return {
      success: false,
      serviceable: false,
      cod: false,
      error: data.message || "Serviceability check failed",
    };
  } catch (err: any) {
    console.error("Shiprocket Serviceability API Error:", err);
    return {
      success: false,
      serviceable: true, // Graceful fallback
      cod: true,
      error: err.message,
    };
  }
}
