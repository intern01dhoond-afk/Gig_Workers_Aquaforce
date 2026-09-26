import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, phone, message } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone number is required" },
        { status: 400 }
      );
    }

    const signupsSheetUrl =
      process.env.GOOGLE_SHEET_SIGNUPS_URL ||
      "https://script.google.com/macros/s/AKfycbwqSxRQx9i_hjH3FK1I7fsfTkP-3KDV6ER-qVTrOJWfOi5O8woxard3Cw5A6yh4Qt4a/exec";

    const payload = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      fullName: fullName || "Newsletter Subscriber",
      phone: phone || "N/A",
      email: email || "N/A",
      source: message ? "Contact Form" : "Website Footer Newsletter",
      status: "Subscribed",
    };

    if (signupsSheetUrl) {
      try {
        await fetch(signupsSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Failed to forward contact/newsletter signup to Google Sheets:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
