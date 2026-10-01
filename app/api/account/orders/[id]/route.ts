import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orderStore";
import { DELHIVERY_API_TOKEN } from "@/lib/delhivery";

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

    let trackingData: any = null;
    const waybill = order.fulfillment.waybill;

    if (waybill && DELHIVERY_API_TOKEN) {
      try {
        const url = `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}&token=${DELHIVERY_API_TOKEN}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const data = await res.json();
          const pkg = data?.ShipmentData?.[0]?.Shipment;
          if (pkg) {
            trackingData = {
              status: pkg.Status?.Status || "In Transit",
              statusDateTime: pkg.Status?.StatusDateTime || "",
              destination: pkg.Destination || order.customer.city,
              origin: pkg.Origin || "Nagpur Main Hub",
              expectedDeliveryDate: pkg.ExpectedDeliveryDate || "",
              scans: pkg.Scans || [],
              waybill: pkg.AWB || waybill,
              orderType: pkg.OrderType || (order.payment.method === "COD_ADVANCE" ? "COD" : "Prepaid"),
            };
          }
        }
      } catch (trackErr) {
        console.warn(`Delhivery tracking lookup failed for order ${id}:`, trackErr);
      }
    }

    return NextResponse.json({
      success: true,
      order,
      tracking: trackingData,
    });
  } catch (error: any) {
    console.error("Error in /api/account/orders/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
