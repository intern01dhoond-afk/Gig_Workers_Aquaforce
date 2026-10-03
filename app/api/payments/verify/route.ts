import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { orderStore } from "@/lib/orderStore";
import { executeOrderFulfillment } from "@/lib/fulfillment";
import { createAndIssueRazorpayInvoice } from "@/lib/razorpayInvoice";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const {
      orderId, // Promec internal order ID
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    const rzpOrderId = razorpayOrderId;

    if (!orderId && !rzpOrderId) {
      return NextResponse.json(
        {
          error: "Missing required order identifier: orderId or razorpayOrderId",
        },
        { status: 400 }
      );
    }

    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    const key_id = (
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
    ).trim();

    if (!key_secret || !key_id) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured on server" },
        { status: 500 }
      );
    }

    // 1. Locate Promec internal order
    let order = orderId ? await orderStore.getOrderById(orderId) : null;
    if (!order && rzpOrderId) {
      order = await orderStore.getOrderByRazorpayOrderId(rzpOrderId);
    }

    if (!order) {
      return NextResponse.json(
        { error: `Order record not found for Order ID: ${orderId || rzpOrderId}` },
        { status: 404 }
      );
    }

    const activeRzpOrderId = rzpOrderId || order.payment.razorpayOrderId;

    // Check if order was already confirmed (e.g. by Webhook)
    if (order.orderStatus === "confirmed" && order.payment.status === "captured") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentId: order.payment.razorpayPaymentId || "",
        waybill: order.fulfillment?.waybill || "",
        shipmentId: order.fulfillment?.shipmentId || "",
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // BRANCH A: Direct UPI Intent / Dynamic QR verification (polling via Razorpay API)
    if (!razorpaySignature || !razorpayPaymentId) {
      if (!activeRzpOrderId) {
        return NextResponse.json(
          { error: "Missing Razorpay order ID for status check" },
          { status: 400 }
        );
      }

      try {
        let capturedOrAuthPayment: any = null;

        if (razorpayPaymentId) {
          try {
            const directP: any = await razorpay.payments.fetch(razorpayPaymentId);
            if (
              directP &&
              directP.order_id === activeRzpOrderId &&
              (directP.status === "captured" || directP.status === "authorized")
            ) {
              capturedOrAuthPayment = directP;
            }
          } catch (e: any) {
            console.warn("[Payment Verify] Direct payment fetch warning:", e?.message);
          }
        }

        if (!capturedOrAuthPayment) {
          const paymentsResponse: any = await razorpay.orders.fetchPayments(activeRzpOrderId);
          const paymentsList = paymentsResponse?.items || [];
          capturedOrAuthPayment = paymentsList.find(
            (p: any) => p.status === "captured" || p.status === "authorized"
          );
        }

        if (!capturedOrAuthPayment && order.payment.qrCodeId) {
          try {
            const qrPayments: any = await (razorpay as any).qrCode.fetchAllPayments(order.payment.qrCodeId);
            const qrList = qrPayments?.items || [];
            capturedOrAuthPayment = qrList.find(
              (p: any) => p.status === "captured" || p.status === "authorized"
            );
          } catch (qrErr: any) {
            console.warn("[Payment Verify] qrCode fetchAllPayments warning:", qrErr?.message || qrErr);
          }
        }

        if (capturedOrAuthPayment) {
          let paymentDetails = capturedOrAuthPayment;

          // Verify expected payment amount
          if (paymentDetails.amount && Number(paymentDetails.amount) < order.payment.amountRequiredInPaise) {
            console.error("[Payment Verify] UPI payment amount mismatch:", {
              expected: order.payment.amountRequiredInPaise,
              received: paymentDetails.amount,
            });
            return NextResponse.json(
              { error: "Payment amount does not match expected order amount" },
              { status: 400 }
            );
          }

          if (paymentDetails.status === "authorized") {
            try {
              paymentDetails = await razorpay.payments.capture(
                paymentDetails.id,
                order.payment.amountRequiredInPaise,
                "INR"
              );
            } catch (capErr: any) {
              console.error("[Payment Verify] UPI Auto-capture error:", capErr);
            }
          }

          if (paymentDetails.status === "captured") {
            await orderStore.updateOrder(order.id, {
              orderStatus: "confirmed",
              payment: {
                ...order.payment,
                status: "captured",
                mode: paymentDetails.method?.toUpperCase() || "UPI",
                razorpayPaymentId: paymentDetails.id,
                amountPaidInPaise: order.payment.amountRequiredInPaise,
                capturedAt: new Date().toISOString(),
              },
            });

            // Auto-generate official Razorpay GST Tax Invoice
            try {
              await createAndIssueRazorpayInvoice(order, paymentDetails.id);
            } catch (invErr) {
              console.warn("[Payment Verify] Razorpay invoice creation note:", invErr);
            }

            const fulfillmentResult = await executeOrderFulfillment(order.id);
            return NextResponse.json({
              success: true,
              orderId: order.id,
              paymentId: paymentDetails.id,
              waybill: fulfillmentResult.waybill || order.fulfillment.waybill || "",
              shipmentId: fulfillmentResult.shipmentId || order.fulfillment.shipmentId || "",
            });
          }
        }
      } catch (fetchOrderErr: any) {
        console.warn("[Payment Verify] Polling Razorpay orders error:", fetchOrderErr.message);
      }

      return NextResponse.json({
        success: false,
        status: "pending",
        message: "Payment is pending completion in customer UPI app",
      });
    }

    // BRANCH B: Cryptographic HMAC SHA-256 Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${activeRzpOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isAuthentic =
      expectedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(razorpaySignature, "utf-8")
      );

    if (!isAuthentic) {
      console.error("[Payment Verify] Signature mismatch:", {
        expected: expectedSignature,
        received: razorpaySignature,
      });

      await orderStore.updateOrder(order.id, {
        payment: {
          ...order.payment,
          status: "failed",
          failureReason: "HMAC signature verification failed",
        },
      });

      return NextResponse.json(
        { success: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // 3. Double-check with Razorpay API (Contract Requirement)
    let paymentDetails: any;
    try {
      paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);
    } catch (fetchErr: any) {
      console.error("[Payment Verify] Failed to fetch payment from Razorpay API:", fetchErr);
      return NextResponse.json(
        { error: `Failed to retrieve payment from Razorpay: ${fetchErr.message}` },
        { status: 502 }
      );
    }

    if (paymentDetails.order_id !== activeRzpOrderId) {
      console.error("[Payment Verify] Payment order ID mismatch:", {
        expected: activeRzpOrderId,
        received: paymentDetails.order_id,
      });
      return NextResponse.json(
        { error: "Payment record does not match the referenced order" },
        { status: 400 }
      );
    }

    // Verify expected payment amount
    if (paymentDetails.amount && Number(paymentDetails.amount) < order.payment.amountRequiredInPaise) {
      console.error("[Payment Verify] Payment amount mismatch:", {
        expected: order.payment.amountRequiredInPaise,
        received: paymentDetails.amount,
      });
      return NextResponse.json(
        { error: "Payment amount does not match expected order amount" },
        { status: 400 }
      );
    }

    // Handle authorization vs captured
    if (paymentDetails.status === "authorized") {
      try {
        console.log(`[Payment Verify] Payment ${razorpayPaymentId} is authorized. Capturing...`);
        paymentDetails = await razorpay.payments.capture(
          razorpayPaymentId,
          order.payment.amountRequiredInPaise,
          "INR"
        );
      } catch (captureErr: any) {
        console.error("[Payment Verify] Capture failed:", captureErr);
        return NextResponse.json(
          { error: `Payment capture failed: ${captureErr.message}` },
          { status: 500 }
        );
      }
    }

    if (paymentDetails.status !== "captured") {
      return NextResponse.json(
        {
          error: `Payment is not in captured state. Current status: ${paymentDetails.status}`,
        },
        { status: 400 }
      );
    }

    // 4. Update Promec Order State (including subvention metrics if No-Cost EMI offer was applied)
    const discountInPaise = Number(paymentDetails?.discount || 0);
    const discountInINR = Math.round(discountInPaise / 100);
    const grossAmountInINR = Math.round(order.payment.amountRequiredInPaise / 100);
    const netSettlementInINR = grossAmountInINR - discountInINR;

    await orderStore.updateOrder(order.id, {
      orderStatus: "confirmed",
      payment: {
        ...order.payment,
        status: "captured",
        mode: paymentDetails.method?.toUpperCase() || order.payment.mode,
        razorpayPaymentId,
        razorpaySignature,
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
      await createAndIssueRazorpayInvoice(order, razorpayPaymentId);
    } catch (invErr) {
      console.warn("[Payment Verify] Razorpay invoice creation note:", invErr);
    }

    // 5. Run Idempotent Fulfillment Pipeline
    const fulfillmentResult = await executeOrderFulfillment(order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentId: razorpayPaymentId,
      waybill: fulfillmentResult.waybill || order.fulfillment.waybill || "",
      shipmentId: fulfillmentResult.shipmentId || order.fulfillment.shipmentId || "",
    });
  } catch (err: any) {
    console.error("[Payment Verify] Server error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during verification" },
      { status: 500 }
    );
  }
}
