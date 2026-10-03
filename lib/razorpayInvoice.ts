import Razorpay from "razorpay";
import { PromecOrder, orderStore } from "./orderStore";

export interface CreateInvoiceResult {
  success: boolean;
  invoiceId?: string;
  invoiceUrl?: string;
  error?: string;
}

/**
 * Creates and auto-issues an official "Paid" Razorpay GST Tax Invoice
 * linked directly to the captured Razorpay transaction ID.
 */
export async function createAndIssueRazorpayInvoice(
  order: PromecOrder,
  paymentId?: string
): Promise<CreateInvoiceResult> {
  try {
    const payId = paymentId || order.payment.razorpayPaymentId;
    if (!payId) {
      return { success: false, error: "Payment ID is missing" };
    }

    // If already generated, return cached invoice details
    if (order.payment.razorpayInvoiceId) {
      return {
        success: true,
        invoiceId: order.payment.razorpayInvoiceId,
        invoiceUrl: order.payment.invoiceUrl,
      };
    }

    const key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!key_id || !key_secret) {
      console.warn("[Razorpay Invoice] Credentials not configured on server.");
      return { success: false, error: "Razorpay credentials not configured" };
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const amountInPaise = order.payment.amountPaidInPaise || order.payment.amountRequiredInPaise;
    const customer = {
      ...(order.customer.fullName ? { name: order.customer.fullName } : {}),
      ...(order.customer.email ? { email: order.customer.email } : {}),
      ...(order.customer.phone ? { contact: order.customer.phone } : {}),
      billing_address: {
        line1: order.customer.shippingAddress || "Doorstep Address",
        city: order.customer.city || "City",
        state: order.customer.state || "State",
        postal_code: order.customer.pincode || "440016",
        country: "India",
      },
    };

    console.log(`[Razorpay Invoice] Creating invoice for order ${order.id}, payment ${payId}...`);

    // 1. Create a "Paid" invoice by binding the transaction ID
    const invoice: any = await (razorpay.invoices as any).create({
      type: "invoice",
      description: "PROMEC Aquaforce® 1400 PSI Cordless High-Pressure Washer",
      payment_id: payId,
      currency: "INR",
      customer: customer,
      line_items: [
        {
          name: `PROMEC Purchase - Order ID ${order.id}`,
          description: `AquaForce 1400 High-Pressure Washer - ${order.customer.customerType === "commercial" ? "Commercial B2B Package" : "Retail Unit"}`,
          amount: amountInPaise,
          currency: "INR",
          quantity: 1,
          hsn_code: "84243000",
        },
      ],
      email_notify: process.env.RAZORPAY_INVOICE_EMAIL_NOTIFY === "true" ? 1 : 0,
      sms_notify: 0,
      notes: {
        orderId: order.id,
        customerType: order.customer.customerType || "retail",
        ...(order.customer.gstNumber ? { gstNumber: order.customer.gstNumber } : {}),
      },
    });

    let invoiceId = invoice?.id;
    let invoiceUrl = invoice?.short_url;

    // 2. Issue the invoice immediately to dispatch official receipt via Razorpay
    if (invoiceId) {
      try {
        const issued: any = await (razorpay.invoices as any).issue(invoiceId);
        invoiceUrl = issued?.short_url || invoiceUrl;
        console.log(`[Razorpay Invoice] Auto-issued Paid Invoice: ${invoiceId} for payment ${payId}`);
      } catch (issueErr: any) {
        console.warn(`[Razorpay Invoice] Issue step note:`, issueErr?.message || issueErr);
      }

      const finalUrl = invoiceUrl || `https://rzp.io/i/${invoiceId}`;

      await orderStore.updateOrder(order.id, {
        payment: {
          ...order.payment,
          razorpayInvoiceId: invoiceId,
          invoiceUrl: finalUrl,
        },
      });

      return {
        success: true,
        invoiceId,
        invoiceUrl: finalUrl,
      };
    }

    return { success: false, error: "Failed to generate invoice from Razorpay" };
  } catch (err: any) {
    console.error("[Razorpay Invoice] Error generating Razorpay invoice:", err?.message || err);
    return { success: false, error: err?.message || "Failed to create invoice" };
  }
}
