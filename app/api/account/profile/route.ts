import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";
import { profileStore } from "@/lib/profileStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // 1. Check dedicated profile store first
    const savedProfile = await profileStore.getProfileByPhone(cleanPhone);
    if (savedProfile && (savedProfile.shippingAddress || savedProfile.fullName || savedProfile.email)) {
      return NextResponse.json({
        success: true,
        profile: savedProfile,
      });
    }

    // 2. Fallback to latest customer details from orders
    const orders = await orderStore.getOrdersByPhone(cleanPhone);
    if (orders.length > 0) {
      const latest = orders[0].customer;
      const mergedProfile = {
        fullName: savedProfile?.fullName || latest.fullName || "",
        phone: cleanPhone,
        email: savedProfile?.email || latest.email || "",
        shippingAddress: savedProfile?.shippingAddress || latest.shippingAddress || "",
        city: savedProfile?.city || latest.city || "",
        state: savedProfile?.state || latest.state || "",
        pincode: savedProfile?.pincode || latest.pincode || "",
        altPhone: savedProfile?.altPhone || latest.altPhone || "",
        gstNumber: savedProfile?.gstNumber || latest.gstNumber || "",
        customerType: savedProfile?.customerType || (latest as any).customerType || (savedProfile?.gstNumber || latest.gstNumber ? "commercial" : "retail"),
        companyName: savedProfile?.companyName || (latest as any).companyName || "",
        updatedAt: new Date().toISOString(),
      };

      // Persist to profile store so subsequent reads are instant
      await profileStore.saveProfile(cleanPhone, mergedProfile);

      return NextResponse.json({
        success: true,
        profile: mergedProfile,
      });
    }

    // 3. Return existing profile or blank template
    return NextResponse.json({
      success: true,
      profile: savedProfile || {
        fullName: "",
        phone: cleanPhone,
        email: "",
        shippingAddress: "",
        city: "",
        state: "",
        pincode: "",
        altPhone: "",
        gstNumber: "",
        customerType: "retail",
        companyName: "",
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/account/profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, fullName, email, shippingAddress, city, state, pincode, altPhone, gstNumber, customerType, companyName } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // 1. Save directly to dedicated profileStore
    const updatedProfile = await profileStore.saveProfile(cleanPhone, {
      fullName: fullName ? fullName.trim() : "",
      email: email ? email.trim() : "",
      shippingAddress: shippingAddress ? shippingAddress.trim() : "",
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",
      pincode: pincode ? pincode.trim() : "",
      altPhone: altPhone !== undefined ? altPhone.trim() : "",
      gstNumber: gstNumber !== undefined ? gstNumber.trim() : "",
      customerType: customerType || (gstNumber && gstNumber.trim() ? "commercial" : "retail"),
      companyName: companyName !== undefined ? companyName.trim() : "",
    });

    // 2. Update customer details across recent pending/processing orders if any
    try {
      const orders = await orderStore.getOrdersByPhone(cleanPhone);
      for (const order of orders) {
        if (
          order.orderStatus === "confirmed" ||
          order.orderStatus === "processing" ||
          order.orderStatus === "pending_payment"
        ) {
          await orderStore.updateOrder(order.id, {
            customer: {
              ...order.customer,
              ...(fullName ? { fullName: fullName.trim() } : {}),
              ...(email ? { email: email.trim() } : {}),
              ...(shippingAddress ? { shippingAddress: shippingAddress.trim() } : {}),
              ...(city ? { city: city.trim() } : {}),
              ...(state ? { state: state.trim() } : {}),
              ...(pincode ? { pincode: pincode.trim() } : {}),
              ...(altPhone !== undefined ? { altPhone: altPhone.trim() } : {}),
              ...(gstNumber !== undefined ? { gstNumber: gstNumber.trim() } : {}),
            },
          });
        }
      }
    } catch (orderErr) {
      console.warn("Could not update orders for profile change:", orderErr);
    }

    return NextResponse.json({
      success: true,
      message: "Customer profile and delivery details updated successfully!",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error in POST /api/account/profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
