import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getPromecPayLaterOfferIds } from "@/lib/razorpayOffers";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { amount, receipt, notes, offers, offer_id, offerId } = body;

    const key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 500 }
      );
    }

    if (notes?.quantity && Number(notes.quantity) > 10) {
      return NextResponse.json(
        { error: "Maximum cart value limit is 10 devices per order." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Resolve No-Cost EMI Subvention Offers ('Promec India PayLater')
    const configuredOffers = getPromecPayLaterOfferIds();
    const applicableOffers: string[] = [];

    if (Array.isArray(offers) && offers.length > 0) {
      applicableOffers.push(...offers.map((o: any) => String(o)).filter(Boolean));
    } else if (offer_id || offerId) {
      applicableOffers.push(String(offer_id || offerId));
    }

    for (const off of configuredOffers) {
      if (!applicableOffers.includes(off)) {
        applicableOffers.push(off);
      }
    }

    const options: any = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
      ...(applicableOffers.length > 0 ? { offers: applicableOffers } : {}),
    };

    let order: any;
    try {
      order = await razorpay.orders.create(options);
    } catch (orderCreateErr: any) {
      if (
        applicableOffers.length > 0 &&
        (orderCreateErr?.message?.toLowerCase().includes("offer") ||
          orderCreateErr?.error?.description?.toLowerCase().includes("offer") ||
          orderCreateErr?.statusCode === 400)
      ) {
        console.warn(
          "[Razorpay Orders API] Failed to apply offer_id payload in /api/razorpay/order, retrying without offers:",
          orderCreateErr?.message || orderCreateErr?.error?.description
        );
        const fallbackOptions = { ...options };
        delete fallbackOptions.offers;
        order = await razorpay.orders.create(fallbackOptions);
      } else {
        throw orderCreateErr;
      }
    }

    return NextResponse.json({
      ...order,
      offers: applicableOffers,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
