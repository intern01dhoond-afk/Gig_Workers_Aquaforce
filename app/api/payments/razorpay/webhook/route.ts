import { NextResponse } from "next/server";
import crypto from "crypto";
import { orderStore } from "@/lib/orderStore";
import { executeOrderFulfillment } from "@/lib/fulfillment";
import { createAndIssueRazorpayInvoice } from "@/lib/razorpayInvoice";

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Rule: Webhook secret must be separate and explicit (no fallback to RAZORPAY_KEY_SECRET)
    if (!webhookSecret) {
      console.error(
        "[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured on server."
      );
      return NextResponse.json(
        { error: "Webhook secret is not configured on server" },
        { status: 500 }
      );
    }

    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

    // Verify webhook signature with dedicated webhook secret
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isValid =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );

    if (!isValid) {
      console.error("[Razorpay Webhook] Webhook signature verification failed.");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const event = payload.event;
    const eventId = payload.event_id || `${event}_${Date.now()}`;
    console.log(`[Razorpay Webhook] Received event '${event}' (${eventId})`);

    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    const refundEntity = payload.payload?.refund?.entity;

    const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
    let order = rzpOrderId ? await orderStore.getOrderByRazorpayOrderId(rzpOrderId) : null;

    if (!order && paymentEntity?.notes?.promecOrderId) {
      order = await orderStore.getOrderById(paymentEntity.notes.promecOrderId);
    }
    if (!order && paymentEntity?.notes?.razorpayOrderId) {
      order = await orderStore.getOrderByRazorpayOrderId(paymentEntity.notes.razorpayOrderId);
    }

    if (!order) {
      console.warn(`[Razorpay Webhook] Order with Razorpay ID ${rzpOrderId || "unknown"} not found.`);
      return NextResponse.json({ status: "ok" });
    }

    // Idempotency: skip if this webhook event was already recorded for this order
    const isNewEvent = await orderStore.recordWebhookEvent(order.id, eventId);
    if (!isNewEvent) {
      console.log(`[Razorpay Webhook] Event ${eventId} already processed. Skipping duplicate.`);
      return NextResponse.json({ status: "ok", message: "Duplicate event acknowledged" });
    }

    // Process event types
    switch (event) {
      case "payment.captured":
      case "order.paid": {
        const paymentAmount = paymentEntity?.amount;
        if (paymentAmount && Number(paymentAmount) < order.payment.amountRequiredInPaise) {
          console.warn(
            `[Razorpay Webhook] Received payment amount (${paymentAmount}) less than required (${order.payment.amountRequiredInPaise}). Underpayment flagged.`
          );
          return NextResponse.json({ status: "ok", message: "Underpayment flagged" });
        }

        const payId = paymentEntity?.id || order.payment.razorpayPaymentId;
        const method = paymentEntity?.method?.toUpperCase();

        // Extract subvention discount and net settlement if No-Cost EMI offer was applied
        const discountInPaise = Number(paymentEntity?.discount || 0);
        const discountInINR = Math.round(discountInPaise / 100);
        const grossAmountInINR = Math.round(order.payment.amountRequiredInPaise / 100);
        const netSettlementInINR = grossAmountInINR - discountInINR;

        await orderStore.updateOrder(order.id, {
          orderStatus: "confirmed",
          payment: {
            ...order.payment,
            status: "captured",
            mode: method || order.payment.mode,
            razorpayPaymentId: payId,
            amountPaidInPaise: order.payment.amountRequiredInPaise,
            capturedAt: new Date().toISOString(),
            ...(discountInINR > 0
              ? {
                  subventionDiscountInINR: discountInINR,
                  netSettlementInINR: netSettlementInINR,
                  isNoCostEmi: true,
                }
              : {}),
          },
        });

        // Auto-generate official Razorpay GST Tax Invoice
        try {
          await createAndIssueRazorpayInvoice(order, payId);
        } catch (invoiceErr) {
          console.error("[Razorpay Webhook] Auto invoice generation note:", invoiceErr);
        }

        // Trigger fulfillment idempotently (mutex prevents double execution if /verify already ran)
        await executeOrderFulfillment(order.id);
        break;
      }

      case "payment.failed": {
        const failureReason =
          paymentEntity?.error_description ||
          paymentEntity?.error_reason ||
          "Payment failed";

        await orderStore.updateOrder(order.id, {
          payment: {
            ...order.payment,
            status: "failed",
            failureReason,
          },
        });
        break;
      }

      case "refund.processed": {
        const refundAmount = refundEntity?.amount || 0;
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
            refundId: refundEntity?.id || `rfnd_${Date.now()}`,
            amountInPaise: refundAmount,
            status: "processed",
            refundedAt: new Date().toISOString(),
            reason: refundEntity?.notes?.reason || "Admin refund",
          },
        });
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event '${event}' acknowledged.`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("[Razorpay Webhook] Error processing webhook:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
