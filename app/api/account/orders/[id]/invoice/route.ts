import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";
import { createAndIssueRazorpayInvoice } from "@/lib/razorpayInvoice";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    const order = await orderStore.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // If order already has an issued Razorpay Invoice
    if (order.payment.invoiceUrl && order.payment.razorpayInvoiceId) {
      return NextResponse.json({
        success: true,
        invoiceId: order.payment.razorpayInvoiceId,
        invoiceUrl: order.payment.invoiceUrl,
      });
    }

    // If payment is captured and has a Razorpay payment ID, generate on-demand
    if (order.payment.status === "captured" && order.payment.razorpayPaymentId) {
      const result = await createAndIssueRazorpayInvoice(order, order.payment.razorpayPaymentId);
      if (result.success) {
        return NextResponse.json({
          success: true,
          invoiceId: result.invoiceId,
          invoiceUrl: result.invoiceUrl,
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "Razorpay invoice is not yet available for this order",
    });
  } catch (error: any) {
    console.error("Error in /api/account/orders/[id]/invoice:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve invoice" },
      { status: 500 }
    );
  }
}
