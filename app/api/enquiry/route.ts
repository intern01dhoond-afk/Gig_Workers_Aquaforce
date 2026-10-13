import { NextResponse } from "next/server";

const INQUIRY_WHATSAPP_MESSAGE =
  "Hi, Thanks for showing interest in Promec's AquaForce Pressure Washer System! We've successfully received your inquiry. We're currently receiving a high number of inquiries from across India, and our team is working to connect with everyone as soon as possible. Thank you for your patience. Our team will contact you soon!";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      companyName,
      email,
      quantity,
      purchaseTimeline,
      customerType,
      otherDescription,
    } = body;

    // Mandatory fields: Name, Phone No, Quantity
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: "Name is mandatory" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Valid 10-digit Phone No is mandatory" },
        { status: 400 }
      );
    }

    if (!quantity || !String(quantity).trim()) {
      return NextResponse.json(
        { error: "Quantity selection is mandatory" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "medium",
    });

    const resolvedCustomerType =
      customerType === "Other" && otherDescription
        ? `Other: ${otherDescription.trim()}`
        : customerType || "N/A";

    const timelineVal =
      (purchaseTimeline && purchaseTimeline.trim()) || "Not specified";
    const customerTypeVal = resolvedCustomerType || "Not specified";

    // Formatted combined notes so Google Sheet columns are clear
    const notesSummary = `Plan to purchase: ${timelineVal} | Best describes: ${customerTypeVal}`;

    const payload = {
      // Legacy compatibility keys
      type: "ENQUIRY",
      inquiryType: "ENQUIRY",
      status: "New Enquiry",
      notes: notesSummary,
      requirements: notesSummary,
      notesSummary,

      // Standard contact details
      timestamp,
      fullName: fullName.trim(),
      name: fullName.trim(),
      phone: cleanPhone.slice(-10),
      companyName: (companyName && companyName.trim()) || "N/A",
      company: (companyName && companyName.trim()) || "N/A",
      email: (email && email.trim()) || "N/A",
      quantity: String(quantity).trim(),

      // Questionnaire fields
      purchaseTimeline: timelineVal,
      timeline: timelineVal,
      whenDoYouPlanToPurchase: timelineVal,
      planToPurchase: timelineVal,

      customerType: customerTypeVal,
      customerDescription: customerTypeVal,
      whatBestDescribesYou: customerTypeVal,
      segment: customerTypeVal,
      otherDescription: (otherDescription && otherDescription.trim()) || "N/A",
    };

    // 1. Forward to Google Sheets Webhook
    const webhookUrl =
      process.env.GOOGLE_SHEET_ENQUIRY_URL ||
      "https://script.google.com/macros/s/AKfycbwqSxRQx9i_hjH3FK1I7fsfTkP-3KDV6ER-qVTrOJWfOi5O8woxard3Cw5A6yh4Qt4a/exec";

    if (webhookUrl) {
      try {
        const sheetRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          redirect: "follow",
        });
        const text = await sheetRes.text();
        console.log("Google Sheets Inquiry logged successfully:", text);
      } catch (sheetError) {
        console.error("Failed to forward inquiry to Google Sheets:", sheetError);
      }
    } else {
      console.warn("GOOGLE_SHEET_ENQUIRY_URL is not configured. Inquiry data:", payload);
    }

    // 2. Automated WhatsApp Message via AiSensy
    const aisensyApiKey =
      process.env.AISENSY_API_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOTgxMTQzNjYwZTk1MGU3ZDJlYTM0MyIsIm5hbWUiOiJQcm9tZWMgSW5kaWEiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNmE5ODExNDM2NjBlOTUwZTdkMmVhMzNlIiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3ODg3NTYzNDV9._N2prpFIwKpOsYjSUsSoOtu79upNaa72J0bRtYxgQYQ";
    const aisensyCampaign =
      process.env.AISENSY_INQUIRY_CAMPAIGN_NAME || "inquiry_received_template";

    let whatsappSent = false;
    let whatsappStatusMsg = "";

    if (aisensyApiKey && cleanPhone) {
      const destination =
        cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

      // Try different param counts to match whichever template config is active in AiSensy
      const paramVariations: string[][] = [
        [],
        [fullName.trim()],
        [fullName.trim(), String(quantity).trim()],
      ];

      for (const params of paramVariations) {
        try {
          const aiRes = await fetch(
            "https://backend.aisensy.com/campaign/t1/api/v2",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                apiKey: aisensyApiKey,
                campaignName: aisensyCampaign,
                destination: destination,
                userName: fullName.trim(),
                templateParams: params,
                attributes: {
                  company: (companyName && companyName.trim()) || "N/A",
                  email: (email && email.trim()) || "N/A",
                  quantity: String(quantity).trim(),
                  timeline: timelineVal,
                  segment: customerTypeVal,
                  notes: notesSummary,
                  customMessage: INQUIRY_WHATSAPP_MESSAGE,
                },
                tags: ["Inquiry", "Website Form", "GigWorkers"],
              }),
            }
          );

          const resData = await aiRes.json().catch(() => ({}));
          console.log(`AiSensy response (params count ${params.length}):`, aiRes.status, resData);

          if (aiRes.ok) {
            whatsappSent = true;
            whatsappStatusMsg = "Delivered";
            break;
          }

          const errMsg = resData.message || resData.errorMessage || "";
          if (errMsg.includes("Template params does not match")) {
            whatsappStatusMsg = errMsg;
            continue; // Retry with next param variation
          }

          whatsappStatusMsg = errMsg || "Failed to trigger AiSensy campaign";
          break;
        } catch (aiErr: any) {
          console.error("Failed to send AiSensy WhatsApp notification:", aiErr);
          whatsappStatusMsg = aiErr?.message || "Network error";
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: payload,
      whatsapp: {
        message: INQUIRY_WHATSAPP_MESSAGE,
        sent: whatsappSent,
        status: whatsappStatusMsg,
      },
    });
  } catch (error: any) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
