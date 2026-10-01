import { NextResponse } from "next/server";
import { ticketStore } from "@/lib/ticketStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, text, senderName = "Customer" } = body;

    if (!ticketId || !text?.trim()) {
      return NextResponse.json(
        { success: false, error: "Ticket ID and reply message text are required" },
        { status: 400 }
      );
    }

    const updated = await ticketStore.addMessage(ticketId, {
      sender: "customer",
      senderName,
      text: text.trim(),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket: updated,
    });
  } catch (error: any) {
    console.error("Error in POST /api/account/support/reply:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to post message" },
      { status: 500 }
    );
  }
}
