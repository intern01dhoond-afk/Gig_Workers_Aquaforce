import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { orderStore } from "@/lib/orderStore";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await props.params;
  try {
    // 1. Authorize via ADMIN_API_KEY
    const adminKey = process.env.ADMIN_API_KEY;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!adminKey || bearerToken !== adminKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing admin API key" },
        { status: 401 }
      );
    }

    const order = await orderStore.getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: `Order '${orderId}' not found` },
        { status: 404 }
      );
    }

    if (order.payment.status !== "captured" || !order.payment.razorpayPaymentId) {
      return NextResponse.json(
        {
          error: `Cannot refund order '${orderId}': payment is '${order.payment.status}' (payment ID: ${order.payment.razorpayPaymentId || "none"})`,
        },
        { status: 400 }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is acceptable; defaults to full refund
    }

    const refundAmountInPaise =
      Number(body.amountInPaise) || order.payment.amountPaidInPaise;
    const reason = body.reason || "Admin processed refund";

    // Initialize Razorpay SDK
    const key_id = (
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
    ).trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured on server" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    // Execute refund through Razorpay API
    const refund = await razorpay.payments.refund(
      order.payment.razorpayPaymentId,
      {
        amount: refundAmountInPaise,
        notes: {
          orderId: order.id,
          reason,
        },
      }
    );

    // Update order record
    await orderStore.updateOrder(order.id, {
      orderStatus: "refunded",
      payment: {
        ...order.payment,
        status: "refunded",
      },
      fulfillment: {
        ...order.fulfillment,
        status: "cancelled",
      },
      refund: {
        refundId: refund.id,
        amountInPaise: Number(refund.amount) || refundAmountInPaise,
        status: refund.status || "processed",
        refundedAt: new Date().toISOString(),
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amountRefunded: refund.amount,
      status: refund.status,
    });
  } catch (err: any) {
    console.error(`[Refund API] Error refunding order ${orderId}:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to process refund" },
      { status: 500 }
    );
  }
}
