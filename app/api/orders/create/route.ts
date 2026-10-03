import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { calculateOrderPricing } from "@/lib/pricing";
import { orderStore, PromecOrder } from "@/lib/orderStore";
import { profileStore } from "@/lib/profileStore";
import { getPromecPayLaterOfferIds } from "@/lib/razorpayOffers";

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

    // Server-side authoritative price calculation (completely ignores any client price overrides)
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

    // Razorpay No-Cost EMI Subvention Offers ('Promec India PayLater')
    const configuredOffers = getPromecPayLaterOfferIds();
    const applicableOffers: string[] = [];

    // 1. Explicit offers passed in request body
    if (Array.isArray(body.offers) && body.offers.length > 0) {
      applicableOffers.push(...body.offers.map((o: any) => String(o)).filter(Boolean));
    } else if (body.offerId || body.offer_id) {
      applicableOffers.push(String(body.offerId || body.offer_id));
    }

    // 2. Global / Environment 'Promec India PayLater' offers (applied for EMI or when configured)
    if (resolvedMethod === "EMI" || configuredOffers.length > 0) {
      for (const offId of configuredOffers) {
        if (!applicableOffers.includes(offId)) {
          applicableOffers.push(offId);
        }
      }
    }

    // 3. Fallback to specific tenure env vars if present
    if (resolvedMethod === "EMI" && emiDetails) {
      if (emiDetails.tenure === 3 && process.env.RZP_OFFER_NO_COST_3M && !applicableOffers.includes(process.env.RZP_OFFER_NO_COST_3M)) {
        applicableOffers.push(process.env.RZP_OFFER_NO_COST_3M);
      } else if (emiDetails.tenure === 6 && process.env.RZP_OFFER_NO_COST_6M && !applicableOffers.includes(process.env.RZP_OFFER_NO_COST_6M)) {
        applicableOffers.push(process.env.RZP_OFFER_NO_COST_6M);
      }
    }

    // Create order with Razorpay Orders API (passes offers array into payload)
    const orderOptions: any = {
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
        ...(applicableOffers.length > 0 ? { offersAttached: applicableOffers.join(", ") } : {}),
        ...(emiDetails?.bank
          ? {
              emiBank: String(emiDetails.bank),
              emiTenure: `${emiDetails.tenure} Months`,
              emiMonthlyAmount: `₹${emiDetails.monthlyAmount}`,
            }
          : {}),
      },
      ...(applicableOffers.length > 0 ? { offers: applicableOffers } : {}),
    };

    let rzpOrder: any;
    try {
      rzpOrder = await razorpay.orders.create(orderOptions);
    } catch (orderCreateErr: any) {
      // If Razorpay returns an offer validation error, log descriptive warning and retry gracefully without offers
      if (
        applicableOffers.length > 0 &&
        (orderCreateErr?.message?.toLowerCase().includes("offer") ||
          orderCreateErr?.error?.description?.toLowerCase().includes("offer") ||
          orderCreateErr?.statusCode === 400)
      ) {
        console.warn(
          "[Razorpay Orders API] Failed to apply offer_id payload, retrying order without offers:",
          orderCreateErr?.message || orderCreateErr?.error?.description
        );
        const fallbackOptions = { ...orderOptions };
        delete fallbackOptions.offers;
        rzpOrder = await razorpay.orders.create(fallbackOptions);
      } else {
        throw orderCreateErr;
      }
    }

    // Generate instant, non-blocking standard merchant UPI Intent URL
    const upiAmount = Math.round(pricing.amountRequiredInPaise / 100);
    const upiIntentUrl = `upi://pay?pa=amectechnology.rzp@rxairtel&pn=AMECTECHNOLOGY&mc=5013&tr=${promecOrderId}&am=${upiAmount}&cu=INR&tn=AMEC%20Aquaforce%20${promecOrderId}`;
    const qrCodeUrl = "";
    const qrCodeId = "";

    const resolvedCustomerType = customer.customerType || (customer.gstNumber?.trim() ? "commercial" : "retail");
    const cleanCustomerPhone = customer.phone.replace(/\D/g, "").slice(-10);

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
        customerType: resolvedCustomerType,
        companyName: customer.companyName?.trim() || undefined,
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

    // Save or update customer profile with selected customerType
    try {
      await profileStore.saveProfile(cleanCustomerPhone, {
        fullName: customer.fullName.trim(),
        email: customer.email?.trim() || "",
        shippingAddress: customer.deliveryAddress.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        altPhone: customer.altPhone?.trim() || "",
        gstNumber: customer.gstNumber?.trim() || "",
        customerType: resolvedCustomerType,
        companyName: customer.companyName?.trim() || "",
      });
    } catch (profileErr) {
      console.warn("Could not auto-save profile on order create:", profileErr);
    }

    return NextResponse.json({
      id: rzpOrder.id,
      orderId: promecOrderId,
      razorpayOrderId: rzpOrder.id,
      amount: pricing.amountRequiredInPaise,
      currency: "INR",
      keyId: key_id,
      offers: applicableOffers,
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
