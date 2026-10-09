import { NextResponse } from "next/server";
import { createShiprocketShipment } from "@/lib/shiprocket";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId = `ORD_${Date.now()}`,
      fullName = "Customer",
      email = "customer@example.com",
      phone = "9999999999",
      altPhone = "",
      deliveryAddress = "",
      city = "",
      state = "",
      pincode = "",
      product = "Commercial Cordless AquaForce® 1400 High-pressure Washer System (COMMERCIAL PRO KIT)",
      quantity = 1,
      amount = 44991,
      paymentMode = "Pre-paid",
      codAmount = 0,
      advanceAmount = 44991,
    } = body;

    const shipmentResult = await createShiprocketShipment({
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
      paymentMode: paymentMode === "COD" ? "COD" : "Pre-paid",
      codAmount,
    });

    const waybill = String(shipmentResult.awbCode || shipmentResult.shipmentId || "");

    // Update Google Sheet with Waybill if generated
    if (shipmentResult.success && waybill) {
      try {
        const sheetUrl =
          process.env.GOOGLE_SHEET_PURCHASE_URL ||
          "https://script.google.com/macros/s/AKfycbwqSxRQx9i_hjH3FK1I7fsfTkP-3KDV6ER-qVTrOJWfOi5O8woxard3Cw5A6yh4Qt4a/exec";
        await fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "UPDATE_WAYBILL",
            orderId,
            waybill,
            courier: "Shiprocket",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (sheetErr: any) {
        console.warn("[Retry Fulfillment] Google Sheet waybill update warning:", sheetErr.message);
      }
    }

    return NextResponse.json({
      success: shipmentResult.success,
      courier: "Shiprocket",
      waybill,
      error: shipmentResult.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
