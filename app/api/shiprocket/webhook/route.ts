import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";

export async function POST(req: Request) {
  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      // Empty or urlencoded payload
    }

    console.log("Shiprocket Webhook Received:", JSON.stringify(payload, null, 2));

    const orderId = payload?.order_id || payload?.channel_order_id;
    const awb = payload?.awb || payload?.awb_code;
    const currentStatus = (payload?.current_status || payload?.status || "").toString();

    if (orderId || awb) {
      console.log(
        `Shiprocket Webhook Event -> Order: ${orderId}, AWB: ${awb}, Status: ${currentStatus}`
      );

      let targetOrder = orderId ? await orderStore.getOrderById(orderId) : null;
      if (!targetOrder && awb) {
        const all = await orderStore.getAllOrders();
        targetOrder = all.find((o) => o.fulfillment?.waybill === awb) || null;
      }

      if (targetOrder) {
        const lower = currentStatus.toLowerCase();
        let newOrderStatus = targetOrder.orderStatus;
        if (lower.includes("delivered")) {
          newOrderStatus = "delivered";
        } else if (
          lower.includes("transit") ||
          lower.includes("shipped") ||
          lower.includes("out for delivery") ||
          lower.includes("pickup")
        ) {
          newOrderStatus = "shipped";
        }

        await orderStore.updateOrder(targetOrder.id, {
          orderStatus: newOrderStatus,
          fulfillment: {
            ...targetOrder.fulfillment,
            status: newOrderStatus === "delivered" ? "completed" : "processing",
          },
        });
      }
    }

    return NextResponse.json({
      status: "ok",
      received: true,
      service: "Shiprocket Webhook Listener for Promec India",
    });
  } catch (error: any) {
    console.error("Shiprocket Webhook Error:", error);
    return NextResponse.json({ status: "ok" });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Shiprocket Webhook Endpoint",
  });
}
