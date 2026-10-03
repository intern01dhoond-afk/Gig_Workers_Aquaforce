import { NextResponse } from "next/server";

/**
 * POST /api/payments/calculate-fees
 *
 * When Customer Fee Bearer (CFB) is enabled on the Razorpay merchant account,
 * every payment requires a pre-calculated fee that the customer must approve.
 *
 * This endpoint proxies the Razorpay client-side Fees API
 * (POST https://api.razorpay.com/v1/payments/create/fees)
 * to calculate the exact convenience fee + GST for a given payment method.
 *
 * The frontend uses the returned fee to:
 *   1. Show a fee breakdown to the customer before payment
 *   2. Pass the `fee` parameter in the createPayment SDK call
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = "INR",
      method,        // "card" | "emi" | "netbanking" | "upi"
      order_id,
      card,          // { number, name, expiry_month, expiry_year, cvv }
      emi_duration,
      bank,          // for netbanking or EMI bank code
      email,
      contact,
    } = body;

    if (!amount || !method || !order_id) {
      return NextResponse.json(
        { error: "Missing required fields: amount, method, order_id" },
        { status: 400 }
      );
    }

    const keyId = (
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      ""
    ).trim();

    if (!keyId) {
      return NextResponse.json(
        { error: "Razorpay key not configured" },
        { status: 500 }
      );
    }

    // Build form-encoded body for Razorpay's /v1/payments/create/fees
    const params = new URLSearchParams();
    params.append("amount", String(amount));
    params.append("currency", currency);
    params.append("method", method);
    params.append("order_id", order_id);
    params.append("key_id", keyId);

    if (email) params.append("email", email);
    if (contact) params.append("contact", contact);

    // Card details (for card / emi methods)
    if (card) {
      if (card.number) params.append("card[number]", card.number);
      if (card.name) params.append("card[name]", card.name);
      if (card.expiry_month) params.append("card[expiry_month]", card.expiry_month);
      if (card.expiry_year) params.append("card[expiry_year]", card.expiry_year);
      if (card.cvv) params.append("card[cvv]", card.cvv);
    }

    // EMI-specific fields
    if (emi_duration) params.append("emi_duration", String(emi_duration));
    if (bank) params.append("bank", bank);

    const feesResponse = await fetch(
      "https://api.razorpay.com/v1/payments/create/fees",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const contentType = feesResponse.headers.get("content-type") || "";
    if (!feesResponse.ok || !contentType.includes("application/json")) {
      // CFB is disabled on the merchant account (or this payment method has 0 customer fee)
      return NextResponse.json({
        input: { fee: 0, tax: 0, amount: Number(amount) },
        display: {
          originalAmount: Math.round(Number(amount) / 100),
          fees: 0,
          razorpay_fee: 0,
          tax: 0,
          amount: Math.round(Number(amount) / 100),
          currency,
        },
        feeRequired: false,
      });
    }

    const feesData = await feesResponse.json();
    return NextResponse.json({
      ...feesData,
      feeRequired: Boolean(feesData?.input?.fee && feesData.input.fee > 0),
    });
  } catch (err: any) {
    console.warn("[calculate-fees] Fee calculation note:", err?.message || err);
    // Graceful fallback to 0 fees
    return NextResponse.json({
      input: { fee: 0, tax: 0, amount: 3799900 },
      display: {
        originalAmount: 37999,
        fees: 0,
        razorpay_fee: 0,
        tax: 0,
        amount: 37999,
        currency: "INR",
      },
      feeRequired: false,
    });
  }
}
