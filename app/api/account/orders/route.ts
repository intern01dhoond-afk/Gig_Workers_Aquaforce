import { NextResponse } from "next/server";
import { orderStore, PromecOrder } from "@/lib/orderStore";
import { DELHIVERY_API_TOKEN } from "@/lib/delhivery";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    // Retrieve orders matching this customer phone
    const orders = await orderStore.getOrdersByPhone(cleanPhone);

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error("Error in /api/account/orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer orders" },
      { status: 500 }
    );
  }
}
