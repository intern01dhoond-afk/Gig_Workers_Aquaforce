import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Delhivery Webhook Received:", JSON.stringify(payload, null, 2));

    const shipment = payload?.Shipment || payload;
    const awb = shipment?.AWB || shipment?.waybill || shipment?.wbn;
    const orderId = shipment?.Order || shipment?.order_id;
    const status = (shipment?.Status?.Status || shipment?.status || "").toString();
    const statusType = (shipment?.Status?.StatusType || "").toString();

    console.log(`Delhivery Status Update -> AWB: ${awb}, Order: ${orderId}, Status: ${status} (${statusType})`);

    if (orderId || awb) {
      let targetOrder = orderId ? await orderStore.getOrderById(orderId) : null;
      if (!targetOrder && awb) {
        const all = await orderStore.getAllOrders();
        targetOrder = all.find((o) => o.fulfillment?.waybill === awb) || null;
      }

      if (targetOrder) {
        const lower = status.toLowerCase();
        let newOrderStatus = targetOrder.orderStatus;
        if (lower.includes("delivered") || statusType.toLowerCase() === "dl") {
          newOrderStatus = "delivered";
        } else if (
          lower.includes("transit") ||
          lower.includes("dispatched") ||
          lower.includes("out for delivery") ||
          statusType.toLowerCase() === "ud"
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
      success: true,
      message: "Webhook processed successfully",
      awb,
      status,
    });
  } catch (error: any) {
    console.error("Delhivery Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process webhook" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "Delhivery Webhook Listener for Promec India",
    timestamp: new Date().toISOString(),
  });
}
