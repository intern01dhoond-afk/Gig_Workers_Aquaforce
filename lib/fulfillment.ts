import { PromecOrder, orderStore } from "./orderStore";
import { createShiprocketShipment } from "./shiprocket";
import nodemailer from "nodemailer";

export interface FulfillmentResult {
  success: boolean;
  skipped?: boolean;
  waybill?: string;
  shipmentId?: string;
  error?: string;
}

export async function executeOrderFulfillment(
  orderId: string
): Promise<FulfillmentResult> {
  const order = await orderStore.getOrderById(orderId);
  if (!order) {
    return { success: false, error: `Order ${orderId} not found.` };
  }

  // Idempotency Mutex Lock
  const lockAcquired = await orderStore.claimFulfillmentLock(orderId);
  if (!lockAcquired) {
    console.log(
      `[Fulfillment] Lock could not be acquired for order ${orderId}. Current status: ${order.fulfillment.status}`
    );
    return {
      success: true,
      skipped: true,
      waybill: order.fulfillment.waybill,
      shipmentId: order.fulfillment.shipmentId,
    };
  }

  console.log(`[Fulfillment] Starting fulfillment pipeline for order ${orderId}...`);

  const isCod = order.payment.method === "COD_ADVANCE";
  const primaryItem = order.items[0] || {
    productName: "Cordless AquaForce® 1400 High-pressure Washer System (COMMERCIAL PRO KIT)",
    color: "Yellow",
    quantity: 1,
  };

  let resolvedWaybill = "";
  let resolvedShipmentId = "";
  let googleSheetSuccess = false;
  let emailSuccess = false;
  let smsSuccess = false;

  // 1. Shiprocket Shipment
  try {
    const shipResult = await createShiprocketShipment({
      orderId: order.id,
      fullName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone,
      altPhone: order.customer.altPhone,
      deliveryAddress: order.customer.shippingAddress,
      city: order.customer.city,
      state: order.customer.state,
      pincode: order.customer.pincode,
      product: `${primaryItem.productName} (${primaryItem.color})`,
      quantity: primaryItem.quantity,
      amount: order.pricing.finalTotalInINR,
      paymentMode: isCod ? "COD" : "Pre-paid",
      codAmount: isCod ? Math.round(order.payment.amountDueInPaise / 100) : 0,
      advanceAmount: Math.round(order.payment.amountPaidInPaise / 100),
    });

    if (shipResult.success) {
      resolvedWaybill = String(shipResult.awbCode || shipResult.shipmentId || "");
      resolvedShipmentId = String(shipResult.shipmentId || "");
      console.log(`[Fulfillment] Shiprocket shipment created. Waybill: ${resolvedWaybill}`);
    } else {
      console.warn(`[Fulfillment] Shiprocket shipment creation returned error:`, shipResult.error);
    }
  } catch (shipErr: any) {
    console.error("[Fulfillment] Shiprocket creation exception:", shipErr.message);
  }

  // 2. Google Sheets Webhook Log
  try {
    const sheetUrl =
      process.env.GOOGLE_SHEET_PURCHASE_URL ||
      "https://script.google.com/macros/s/AKfycbwqSxRQx9i_hjH3FK1I7fsfTkP-3KDV6ER-qVTrOJWfOi5O8woxard3Cw5A6yh4Qt4a/exec";

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "medium",
    });

    const sheetPayload = {
      type: "PURCHASE",
      timestamp,
      orderId: order.id,
      paymentId: order.payment.razorpayPaymentId || "N/A",
      paymentMethod:
        order.payment.method === "COD_ADVANCE"
          ? "10% Cash on Delivery"
          : order.payment.method === "EMI"
          ? "No Cost EMI"
          : "Full Online Payment",
      advanceAmount: Math.round(order.payment.amountPaidInPaise / 100),
      codBalance: Math.round(order.payment.amountDueInPaise / 100),
      waybill: resolvedWaybill || "PENDING",
      shiprocketWaybill: resolvedWaybill || "PENDING",
      fullName: order.customer.fullName,
      email: order.customer.email || "N/A",
      phone: order.customer.phone,
      altPhone: order.customer.altPhone || "N/A",
      deliveryAddress: order.customer.shippingAddress,
      city: order.customer.city,
      state: order.customer.state,
      pincode: order.customer.pincode,
      gstNumber: order.customer.gstNumber || "N/A",
      product: `${primaryItem.productName} (${primaryItem.color})`,
      quantity: primaryItem.quantity,
      amount: order.pricing.finalTotalInINR,
      status: isCod ? "10% Advance Paid - COD Balance Pending" : "Paid & Confirmed",
    };

    const sheetRes = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheetPayload),
      redirect: "follow",
    });
    if (sheetRes.ok) {
      googleSheetSuccess = true;
      console.log("[Fulfillment] Google Sheets logged successfully.");
    }
  } catch (sheetErr: any) {
    console.error("[Fulfillment] Google Sheets logging failed:", sheetErr.message);
  }

  // 3. AiSensy WhatsApp Notification
  const aisensyApiKey = process.env.AISENSY_API_KEY;
  const aisensyCampaign = process.env.AISENSY_CAMPAIGN_NAME || "order_confirmation_2";

  if (aisensyApiKey && order.customer.phone) {
    try {
      const cleanPhone = order.customer.phone.replace(/\D/g, "");
      const destination = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const fullAddress = `${order.customer.shippingAddress}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;

      await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: aisensyApiKey,
          campaignName: aisensyCampaign,
          destination,
          userName: order.customer.fullName,
          templateParams: [
            order.customer.fullName,
            `${primaryItem.productName} (${primaryItem.color})`,
            String(primaryItem.quantity),
            order.id,
            fullAddress,
            estimatedDelivery,
          ],
          media: {
            url: "https://files.catbox.moe/jpksbs.png",
            filename: "Promec Tools WhatsApp Template Image.png",
          },
        }),
      });
      console.log("[Fulfillment] AiSensy WhatsApp notification dispatched.");
    } catch (waErr: any) {
      console.error("[Fulfillment] AiSensy WhatsApp failed:", waErr.message);
    }
  }

  // 4. Nodemailer Confirmation Email
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass && order.customer.email) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const formattedAmount = order.pricing.finalTotalInINR.toLocaleString("en-IN");
      const mailOptions = {
        from: `"Promec India" <${smtpUser}>`,
        to: order.customer.email,
        subject: `Order Confirmed: ${primaryItem.productName} [#${order.id}]`,
        text: `Dear ${order.customer.fullName},\n\nYour order #${order.id} for ${primaryItem.productName} (Rs.${formattedAmount}) has been confirmed!\n\nDelivery Address: ${order.customer.shippingAddress}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}\nWaybill/Tracking: ${resolvedWaybill || "Processing"}\n\nThank you for choosing Promec India.`,
      };

      await transporter.sendMail(mailOptions);
      emailSuccess = true;
      console.log("[Fulfillment] Confirmation email sent successfully.");
    } catch (emailErr: any) {
      console.error("[Fulfillment] Email sending failed:", emailErr.message);
    }
  }

  // 5. YourBulkSMS
  const smsAuthKey = process.env.YOURBULKSMS_AUTH_KEY;
  if (smsAuthKey && order.customer.phone) {
    try {
      let cleanPhone = order.customer.phone.replace(/\D/g, "");
      if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
      const senderId = process.env.YOURBULKSMS_SENDER_ID || "PROMCC";
      const route = process.env.YOURBULKSMS_ROUTE || "2";
      const templateId = process.env.YOURBULKSMS_TEMPLATE_ID || "";
      const formattedAmount = order.pricing.finalTotalInINR.toLocaleString("en-IN");

      const message = `Dear ${order.customer.fullName}, your order #${order.id} for ${primaryItem.productName} (Rs.${formattedAmount}) has been confirmed! Thank you for choosing Promec India.`;

      const smsUrl = new URL("http://control.yourbulksms.com/api/sendhttp.php");
      smsUrl.searchParams.append("authkey", smsAuthKey);
      smsUrl.searchParams.append("mobiles", cleanPhone);
      smsUrl.searchParams.append("message", message);
      smsUrl.searchParams.append("sender", senderId);
      smsUrl.searchParams.append("route", route);
      smsUrl.searchParams.append("country", "91");
      if (templateId) smsUrl.searchParams.append("DLT_TE_ID", templateId);

      await fetch(smsUrl.toString(), { method: "GET" });
      smsSuccess = true;
      console.log("[Fulfillment] YourBulkSMS notification sent.");
    } catch (smsErr: any) {
      console.error("[Fulfillment] SMS sending failed:", smsErr.message);
    }
  }

  // 6. Complete Fulfillment in Order Store
  await orderStore.completeFulfillment(orderId, {
    waybill: resolvedWaybill,
    shipmentId: resolvedShipmentId,
    googleSheetSynced: googleSheetSuccess,
    emailSent: emailSuccess,
    smsSent: smsSuccess,
  });

  console.log(`[Fulfillment] Fulfillment pipeline completed for order ${orderId}.`);

  return {
    success: true,
    waybill: resolvedWaybill,
    shipmentId: resolvedShipmentId,
  };
}
