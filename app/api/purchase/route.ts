import { NextResponse } from "next/server";
import { createShiprocketShipment } from "@/lib/shiprocket";

const processedOrdersCache = new Map<string, number>();

function isDuplicate(id: string): boolean {
  if (!id) return false;
  const now = Date.now();
  for (const [key, exp] of processedOrdersCache.entries()) {
    if (now > exp) processedOrdersCache.delete(key);
  }
  if (processedOrdersCache.has(id)) return true;
  processedOrdersCache.set(id, now + 15 * 60 * 1000); // 15-minute deduplication window
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      paymentId,
      fullName,
      email,
      phone,
      altPhone,
      deliveryAddress,
      city,
      state,
      pincode,
      gstNumber,
      product,
      quantity,
      amount,
      status,
      paymentMethod,
      advanceAmount,
      codBalance,
      waybill,
    } = body;

    const dedupKey = orderId || paymentId;
    if (dedupKey && isDuplicate(dedupKey)) {
      console.warn(`Duplicate purchase event ignored for Order/Payment ID: ${dedupKey}`);
      return NextResponse.json({
        success: true,
        message: "Duplicate purchase record ignored",
      });
    }

    if (!fullName || !phone || !deliveryAddress || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "Missing required order checkout fields" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "medium",
    });

    const isCodOrder = paymentMethod === "10_PERCENT_COD" || Number(codBalance) > 0;
    const resolvedStatus = status || (isCodOrder ? "10% Advance Paid - COD Balance Pending" : "Paid & Confirmed");

    // Auto-create Shiprocket shipment if waybill was not already created by client
    let resolvedWaybill = (waybill && waybill !== "AUTO_GENERATED") ? waybill : "";

    if (!resolvedWaybill) {
      try {
        console.log(`Auto-creating Shiprocket shipment for order ${orderId || "new"}...`);
        const shipResult = await createShiprocketShipment({
          orderId: orderId || `ORD_${Date.now()}`,
          fullName,
          email,
          phone,
          altPhone,
          deliveryAddress,
          city,
          state,
          pincode,
          product: product || "Commercial Cordless AquaForce® 1400 High-pressure Washer System (COMMERCIAL PRO KIT)",
          quantity: quantity || 1,
          amount: amount || 44991,
          paymentMode: isCodOrder ? "COD" : "Pre-paid",
          codAmount: isCodOrder ? (Number(codBalance) || (Number(amount) - Math.floor(Number(amount) * 0.1) + 149)) : 0,
        });

        if (shipResult.success && (shipResult.awbCode || shipResult.shipmentId)) {
          resolvedWaybill = String(shipResult.awbCode || shipResult.shipmentId);
          console.log(`Auto-created Shiprocket shipment successfully! Waybill/ShipmentId: ${resolvedWaybill}`);
        } else {
          console.warn("Auto-creation of Shiprocket shipment failed:", shipResult.error);
        }
      } catch (shipErr) {
        console.error("Error auto-creating Shiprocket shipment in /api/purchase:", shipErr);
      }
    }

    const payload = {
      type: "PURCHASE",
      timestamp,
      orderId: orderId || `ORD_${Date.now()}`,
      paymentId: paymentId || "PENDING",
      paymentMethod: paymentMethod || (isCodOrder ? "10% Cash on Delivery" : "Full Online Payment"),
      advanceAmount: Number(advanceAmount) || (isCodOrder ? Math.floor(Number(amount) * 0.1) : Number(amount)),
      codBalance: isCodOrder ? (Number(codBalance) || (Number(amount) - Math.floor(Number(amount) * 0.1) + 149)) : 0,
      waybill: resolvedWaybill || "AUTO_GENERATED",
      shiprocketWaybill: resolvedWaybill || "AUTO_GENERATED",
      fullName,
      email: email || "N/A",
      phone,
      altPhone: altPhone || "N/A",
      alternatePhone: altPhone || "N/A",
      alt_phone: altPhone || "N/A",
      alternate_phone: altPhone || "N/A",
      altMobile: altPhone || "N/A",
      alternateMobile: altPhone || "N/A",
      secondaryPhone: altPhone || "N/A",
      phoneWithAlt: altPhone && altPhone !== "N/A" ? `${phone} / ${altPhone}` : phone,
      deliveryAddress,
      city,
      state,
      pincode,
      gstNumber: gstNumber || "N/A",
      product: product || "Aquaforce 1400",
      quantity: Number(quantity) || 1,
      amount: Number(amount) || 44991,
      status: resolvedStatus,
    };

    const webhookUrl =
      process.env.GOOGLE_SHEET_PURCHASE_URL ||
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
        console.log("Google Sheets Purchase logged successfully:", text);
      } catch (sheetError) {
        console.error("Failed to forward purchase to Google Sheets:", sheetError);
      }
    } else {
      console.warn("GOOGLE_SHEET_PURCHASE_URL is not configured. Purchase data logged:", payload);
    }

    // AiSensy WhatsApp Notification Trigger
    const aisensyApiKey =
      process.env.AISENSY_API_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOTgxMTQzNjYwZTk1MGU3ZDJlYTM0MyIsIm5hbWUiOiJQcm9tZWMgSW5kaWEiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNmE5ODExNDM2NjBlOTUwZTdkMmVhMzNlIiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3ODg3NTYzNDV9._N2prpFIwKpOsYjSUsSoOtu79upNaa72J0bRtYxgQYQ";
    const aisensyCampaign = process.env.AISENSY_CAMPAIGN_NAME || "order_confirmation_2";

    if (aisensyApiKey && phone) {
      const formattedPhone = phone.replace(/\D/g, "");
      const destination = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;

      // Calculate estimated delivery date (4-6 business days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const fullAddress = `${deliveryAddress}, ${city}, ${state} - ${pincode}`;

      try {
        const aiRes = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: aisensyApiKey,
            campaignName: aisensyCampaign,
            destination: destination,
            userName: fullName,
            templateParams: [
              fullName,                                    // {1} - Name
              payload.product,                             // {2} - Product
              String(payload.quantity),                     // {3} - Quantity
              payload.orderId,                             // {4} - Order ID
              fullAddress,                                 // {5} - Delivery Address
              estimatedDelivery,                           // {6} - Estimated Delivery Date
            ],
            media: {
              url: "https://files.catbox.moe/jpksbs.png",
              filename: "Promec Tools WhatsApp Template Image.png",
            },
          }),
        });
        const resText = await aiRes.text();
        console.log("AiSensy WhatsApp notification response:", aiRes.status, resText);
      } catch (aiErr) {
        console.error("Failed to send AiSensy WhatsApp notification:", aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: payload,
      waybill: resolvedWaybill,
    });
  } catch (error: any) {
    console.error("Purchase API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process purchase record" },
      { status: 500 }
    );
  }
}
