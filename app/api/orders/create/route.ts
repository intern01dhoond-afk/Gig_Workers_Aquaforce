import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { calculateOrderPricing } from "@/lib/pricing";
import { orderStore, PromecOrder } from "@/lib/orderStore";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const {
      customer,
      variantId,
      colorName,
      quantity,
      paymentMethod = "FULL_ONLINE",
      emiDetails,
      idempotencyKey,
    } = body;

    // Check client idempotency to prevent double order creation on rapid taps
    if (idempotencyKey) {
      const existingOrder = await orderStore.getByIdempotencyKey(idempotencyKey);
      if (existingOrder && existingOrder.payment.razorpayOrderId) {
        const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
        return NextResponse.json({
          orderId: existingOrder.id,
          razorpayOrderId: existingOrder.payment.razorpayOrderId,
          amount: existingOrder.payment.amountRequiredInPaise,
          currency: "INR",
          keyId,
          advanceAmount: Math.round(existingOrder.payment.amountRequiredInPaise / 100),
          codBalance: Math.round(existingOrder.payment.amountDueInPaise / 100),
        });
      }
    }

    // Validate customer fields
    if (
      !customer ||
      !customer.fullName?.trim() ||
      !customer.phone?.trim() ||
      !customer.deliveryAddress?.trim() ||
      !customer.city?.trim() ||
      !customer.state?.trim() ||
      !customer.pincode?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required customer checkout fields (name, phone, address, city, state, pincode)" },
        { status: 400 }
      );
    }

    // Normalize payment method
    let resolvedMethod: "FULL_ONLINE" | "COD_ADVANCE" | "EMI" = "FULL_ONLINE";
    if (paymentMethod === "10_PERCENT_COD" || paymentMethod === "COD_ADVANCE") {
      resolvedMethod = "COD_ADVANCE";
    } else if (paymentMethod === "EMI") {
      resolvedMethod = "EMI";
    }

    // Server-side authoritative price calculation
    const pricingResult = calculateOrderPricing({
      productId: "aquaforce-1400",
      variantId: variantId || "with-vacuum",
      colorName: colorName || "Yellow",
      quantity: Number(quantity) || 1,
      paymentMethod: resolvedMethod,
    });

    if (!pricingResult.success) {
      return NextResponse.json({ error: pricingResult.error }, { status: 400 });
    }

    const { data: pricing } = pricingResult;

    // Razorpay Credentials
    const key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!key_id || !key_secret) {
      console.error("Razorpay credentials missing: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set.");
      return NextResponse.json(
        { error: "Razorpay payment credentials are not configured on server" },
        { status: 500 }
      );
    }

    // Unique internal Promec Order ID
    const promecOrderId = `PROMEC-ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Initialize Razorpay SDK
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Create order with Razorpay Orders API
    const rzpOrder = await razorpay.orders.create({
      amount: pricing.amountRequiredInPaise, // in paise
      currency: "INR",
      receipt: promecOrderId.substring(0, 40),
      notes: {
        promecOrderId,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        variantName: pricing.variant.name,
        color: pricing.color.name,
        paymentMethod: resolvedMethod,
        ...(emiDetails?.bank
          ? {
              emiBank: String(emiDetails.bank),
              emiTenure: `${emiDetails.tenure} Months`,
              emiMonthlyAmount: `₹${emiDetails.monthlyAmount}`,
            }
          : {}),
      },
    });

    // Generate dynamic UPI QR Code and Intent URL via Razorpay QR Code API
    let qrCodeUrl = "";
    let upiIntentUrl = "";
    let qrCodeId = "";

    try {
      const qrResponse: any = await (razorpay as any).qrCode.create({
        type: "upi_qr",
        name: "AMEC Aquaforce",
        usage: "single_use",
        fixed_amount: true,
        payment_amount: pricing.amountRequiredInPaise,
        description: `Order ${promecOrderId}`,
        notes: {
          promecOrderId,
          razorpayOrderId: rzpOrder.id,
        },
      });

      if (qrResponse) {
        qrCodeId = qrResponse.id || "";
        qrCodeUrl = qrResponse.image_url || "";
        upiIntentUrl = qrResponse.image_content || "";
      }
    } catch (qrErr: any) {
      console.warn("[Orders Create] Razorpay QR Code creation note:", qrErr?.message || qrErr);
    }

    // Construct persistent Promec Order record
    const newOrder: PromecOrder = {
      id: promecOrderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idempotencyKey: idempotencyKey || undefined,
      orderStatus: "pending_payment",
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || "",
        shippingAddress: customer.deliveryAddress.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        altPhone: customer.altPhone?.trim() || undefined,
        gstNumber: customer.gstNumber?.trim() || undefined,
      },
      items: [
        {
          productId: pricing.product.id,
          productName: pricing.product.name,
          variantId: pricing.variant.id,
          variantName: pricing.variant.name,
          color: pricing.color.name,
          quantity: pricing.quantity,
          unitPriceInINR: pricing.unitPriceInINR,
          unitMrpInINR: pricing.unitMrpInINR,
          totalAmountInINR: pricing.subtotalInINR,
        },
      ],
      pricing: {
        subtotalInINR: pricing.subtotalInINR,
        discountInINR: pricing.discountInINR,
        shippingFeeInINR: pricing.shippingFeeInINR,
        handlingFeeInINR: pricing.handlingFeeInINR,
        codFeeInINR: pricing.codFeeInINR,
        finalTotalInINR: pricing.finalTotalInINR,
        currency: "INR",
      },
      payment: {
        method: resolvedMethod,
        provider: "RAZORPAY",
        status: "pending",
        razorpayOrderId: rzpOrder.id,
        qrCodeId: qrCodeId || undefined,
        amountRequiredInPaise: pricing.amountRequiredInPaise,
        amountPaidInPaise: 0,
        amountDueInPaise: pricing.amountDueInPaise,
        ...(emiDetails ? { emiDetails } : {}),
      },
      fulfillment: {
        status: "pending",
      },
      processedWebhookEvents: [],
    };

    await orderStore.createOrder(newOrder);

    return NextResponse.json({
      id: rzpOrder.id,
      orderId: promecOrderId,
      razorpayOrderId: rzpOrder.id,
      amount: pricing.amountRequiredInPaise,
      currency: "INR",
      keyId: key_id,
      advanceAmount: pricing.advanceAmountInINR,
      codBalance: pricing.codBalanceInINR,
      emiDetails: emiDetails || null,
      qrCodeId: qrCodeId || undefined,
      qrCodeUrl,
      upiIntentUrl,
    });
  } catch (err: any) {
    console.error("Order creation endpoint error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
