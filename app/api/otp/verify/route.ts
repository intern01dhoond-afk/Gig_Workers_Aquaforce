import { NextResponse } from "next/server";
import { verifyOtpToken } from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp, fullName, token } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
    const result = verifyOtpToken(cleanPhone, String(otp), token);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid OTP" },
        { status: 400 }
      );
    }

    const customerName = (fullName || "").trim() || "Customer";

    // Record verified signup lead into the Signups Google Sheet
    const signupsSheetUrl =
      process.env.GOOGLE_SHEET_SIGNUPS_URL ||
      "https://script.google.com/macros/s/AKfycbwqSxRQx9i_hjH3FK1I7fsfTkP-3KDV6ER-qVTrOJWfOi5O8woxard3Cw5A6yh4Qt4a/exec";

    if (signupsSheetUrl) {
      try {
        console.log(`Forwarding verified signup to Google Sheet: ${customerName} (${cleanPhone})`);
        const sheetRes = await fetch(signupsSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            fullName: customerName,
            phone: cleanPhone,
            source: "Website Buy Now (OTP Verified)",
            status: "Verified Lead",
          }),
        });

        const sheetText = await sheetRes.text();
        console.log("Google Sheets Signup Log Response:", sheetRes.status, sheetText);
      } catch (sheetErr) {
        console.error("Failed to log verified signup to Google Sheets:", sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      phone: cleanPhone,
      fullName: customerName,
      message: "Mobile number verified successfully!",
    });
  } catch (error: any) {
    console.error("Error in /api/otp/verify:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
