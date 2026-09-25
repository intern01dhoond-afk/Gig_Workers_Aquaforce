import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, fullName, orderId, amount, product } = body;

    if (!phone) {
      return NextResponse.json({ error: "Missing mobile phone number" }, { status: 400 });
    }

    // Clean mobile number (strip non-digits, ensure 10 digits or 91 prefix)
    let cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const authKey = process.env.YOURBULKSMS_AUTH_KEY || "3236524f4d454338373214";
    const senderId = process.env.YOURBULKSMS_SENDER_ID || "PROMCC";
    const route = process.env.YOURBULKSMS_ROUTE || "2";
    const templateId = process.env.YOURBULKSMS_TEMPLATE_ID || "";

    const formattedAmount = Number(amount || 44991).toLocaleString("en-IN");
    const message = `Dear ${fullName || "Customer"}, your order #${orderId || ""} for ${product || "Aquaforce 1400"} (Rs.${formattedAmount}) has been confirmed! Thank you for choosing Promec India.`;

    if (!authKey) {
      console.warn("YOURBULKSMS_AUTH_KEY not set in .env.local. Logged SMS:", message);
      return NextResponse.json({
        success: false,
        message: "YOURBULKSMS_AUTH_KEY not configured in .env.local yet.",
        smsText: message,
      });
    }

    // Build YourBulkSMS HTTP Endpoint URL
    const url = new URL("http://control.yourbulksms.com/api/sendhttp.php");
    url.searchParams.append("authkey", authKey);
    url.searchParams.append("mobiles", cleanPhone);
    url.searchParams.append("message", message);
    url.searchParams.append("sender", senderId);
    url.searchParams.append("route", route);
    url.searchParams.append("country", "91");
    if (templateId) {
      url.searchParams.append("DLT_TE_ID", templateId);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    const responseText = await response.text();
    console.log("YourBulkSMS API Response:", responseText);

    return NextResponse.json({
      success: true,
      apiResponse: responseText,
    });
  } catch (error: any) {
    console.error("Failed to send SMS via YourBulkSMS:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send SMS" },
      { status: 500 }
    );
  }
}
