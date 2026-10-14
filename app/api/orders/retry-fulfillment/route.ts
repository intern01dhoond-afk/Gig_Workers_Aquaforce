import { NextResponse } from "next/server";
import { createDelhiveryShipment } from "@/lib/delhivery";
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
      product = "Cordless AquaForce® 1400 High-pressure Washer System",
      quantity = 1,
      amount = 44991,
      paymentMode = "Pre-paid",
      codAmount = 0,
      advanceAmount = 44991,
    } = body;

    let courier = "Delhivery";
    let waybill = "";
    let error = "";

    // 1. Primary: Delhivery
    try {
      const delhiveryRes = await createDelhiveryShipment({
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
        advanceAmount,
      });

      if (delhiveryRes.success && delhiveryRes.waybill) {
        waybill = String(delhiveryRes.waybill);
        courier = "Delhivery";
      } else {
        error = delhiveryRes.error || "Delhivery shipment creation failed";
      }
    } catch (delhiveryErr: any) {
      error = delhiveryErr.message || "Delhivery API call failed";
    }

    // 2. Fallback: Shiprocket
    if (!waybill) {
      try {
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

        if (shipmentResult.success && (shipmentResult.awbCode || shipmentResult.shipmentId)) {
          waybill = String(shipmentResult.awbCode || shipmentResult.shipmentId);
          courier = shipmentResult.courierName || "Shiprocket";
          error = "";
        } else {
          error = `Delhivery: ${error}; Shiprocket: ${shipmentResult.error}`;
        }
      } catch (shipErr: any) {
        error = `Delhivery: ${error}; Shiprocket fallback error: ${shipErr.message}`;
      }
    }

    // Update Google Sheet with Waybill if generated
    if (waybill) {
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
            courier,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (sheetErr: any) {
        console.warn("[Retry Fulfillment] Google Sheet waybill update warning:", sheetErr.message);
      }
    }

    return NextResponse.json({
      success: Boolean(waybill),
      courier,
      waybill,
      error: error || undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
