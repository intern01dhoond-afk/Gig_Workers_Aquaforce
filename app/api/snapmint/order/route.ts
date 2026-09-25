import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      amount,
      fullName,
      email,
      phone,
      deliveryAddress,
      city,
      state,
      pincode,
      product,
      emiTenure = 3,
    } = body;

    if (!fullName || !phone || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required order information" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
    const resolvedOrderId = orderId || `SNM_${Date.now()}`;
    const orderValue = Math.round(Number(amount) || 44991);

    const merchantId = process.env.SNAPMINT_MERCHANT_ID;
    const merchantKey = process.env.SNAPMINT_MERCHANT_KEY;
    const isProd = process.env.SNAPMINT_ENV === "production";
    const baseUrl = isProd ? "https://api.snapmint.com" : "https://qa.snapmint.com";

    // Split name into first and last
    const nameParts = (fullName || "Customer").trim().split(" ");
    const firstName = nameParts[0] || "Valued";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    if (merchantId && merchantKey) {
      // Direct Snapmint API integration with SHA-512 Checksum
      // Standard Snapmint Checksum: merchant_key|order_id|order_value|full_name|email
      const checkSumStr = `${merchantKey}|${resolvedOrderId}|${orderValue}|${fullName}|${email || "contact@promectools.in"}`;
      const checksum = crypto.createHash("sha512").update(checkSumStr).digest("hex");

      const snapmintPayload = {
        merchant_id: merchantId,
        order_id: resolvedOrderId,
        order_value: orderValue,
        full_name: fullName,
        email: email || "contact@promectools.in",
        phone_number: cleanPhone,
        billing_first_name: firstName,
        billing_last_name: lastName,
        billing_address_line1: deliveryAddress || "Address",
        billing_city: city || "City",
        billing_state: state || "State",
        billing_zip: pincode || "000000",
        shipping_first_name: firstName,
        shipping_last_name: lastName,
        shipping_address_line1: deliveryAddress || "Address",
        shipping_city: city || "City",
        shipping_state: state || "State",
        shipping_zip: pincode || "000000",
        products: [
          {
            sku: "AQUAFORCE-1400",
            name: product || "Aquaforce 1400 Cordless High-Pressure Washer",
            quantity: 1,
            unit_price: orderValue,
          },
        ],
        checksum,
      };

      return NextResponse.json({
        success: true,
        mode: "direct_snapmint",
        actionUrl: `${baseUrl}/v1/public/online_orders`,
        payload: snapmintPayload,
        orderId: resolvedOrderId,
      });
    }

    // If Snapmint dedicated direct keys are pending, use Razorpay's Cardless EMI & Affordability
    return NextResponse.json({
      success: true,
      mode: "razorpay_emi",
      orderId: resolvedOrderId,
      amount: orderValue,
      tenure: emiTenure,
      notes: {
        method: "SNAPMINT_CARDLESS_EMI",
        provider: "Snapmint / Razorpay Affordability",
        tenure: `${emiTenure} Months`,
        monthlyEmi: Math.round(orderValue / Number(emiTenure)),
      },
    });
  } catch (error: any) {
    console.error("Snapmint Order API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initiate Snapmint EMI" },
      { status: 500 }
    );
  }
}
