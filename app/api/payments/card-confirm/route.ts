import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";
import { executeOrderFulfillment } from "@/lib/fulfillment";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const {
      orderId,
      razorpayOrderId,
      otp,
      last4,
      cardHolderName,
    } = body;

    if (!orderId && !razorpayOrderId) {
      return NextResponse.json(
        { error: "Missing required order identifier" },
        { status: 400 }
      );
    }

    // Locate internal Promec order
    let order = orderId ? await orderStore.getOrderById(orderId) : null;
    if (!order && razorpayOrderId) {
      order = await orderStore.getOrderByRazorpayOrderId(razorpayOrderId);
    }

    if (!order) {
      return NextResponse.json(
        { error: `Order record not found for: ${orderId || razorpayOrderId}` },
        { status: 404 }
      );
    }

    // Check if order was already confirmed
    if (order.orderStatus === "confirmed" && order.payment.status === "captured") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentId: order.payment.razorpayPaymentId || `pay_card_${Date.now()}`,
        waybill: order.fulfillment?.waybill || "",
        shipmentId: order.fulfillment?.shipmentId || "",
      });
    }

    const generatedPaymentId = `pay_card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Update order status to confirmed and payment to captured
    await orderStore.updateOrder(order.id, {
      orderStatus: "confirmed",
      payment: {
        ...order.payment,
        status: "captured",
        mode: "CARD",
        razorpayPaymentId: generatedPaymentId,
        amountPaidInPaise: order.payment.amountRequiredInPaise,
        capturedAt: new Date().toISOString(),
      },
    });

    // Execute automated fulfillment pipeline (Shiprocket, Waybill, Email notifications)
    const fulfillmentResult = await executeOrderFulfillment(order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentId: generatedPaymentId,
      waybill: fulfillmentResult.waybill || order.fulfillment.waybill || "",
      shipmentId: fulfillmentResult.shipmentId || order.fulfillment.shipmentId || "",
    });
  } catch (error: any) {
    console.error("[Card Confirm] Error confirming card payment:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to confirm card payment" },
      { status: 500 }
    );
  }
}
