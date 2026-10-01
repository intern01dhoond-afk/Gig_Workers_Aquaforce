import { NextResponse } from "next/server";
import { ticketStore, SupportTicket, TicketCategory, TicketPriority } from "@/lib/ticketStore";

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
    const tickets = await ticketStore.getTicketsByPhone(cleanPhone);

    return NextResponse.json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (error: any) {
    console.error("Error in GET /api/account/support:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      phone,
      fullName,
      email,
      orderId,
      category = "technical_support",
      subject,
      message,
      priority = "normal",
      callbackRequested = false,
      preferredCallbackTime = "As soon as possible",
    } = body;

    if (!phone || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number, subject, and message are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const ticketId = `TCK-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const now = new Date().toISOString();

    const categoryLabels: Record<TicketCategory, string> = {
      order_tracking: "Order Tracking & Delivery",
      technical_support: "Technical & Machine Support",
      warranty_claim: "1-Year Warranty Claim",
      callback_request: "Direct Technician Callback",
      general_inquiry: "General Inquiry",
    };

    const newTicket: SupportTicket = {
      id: ticketId,
      createdAt: now,
      updatedAt: now,
      customerPhone: cleanPhone,
      customerName: fullName?.trim() || "Customer",
      customerEmail: email?.trim() || undefined,
      orderId: orderId?.trim() || undefined,
      category: category as TicketCategory,
      categoryLabel: categoryLabels[category as TicketCategory] || "Support Inquiry",
      subject: subject.trim(),
      priority: (priority as TicketPriority) || "normal",
      status: "open",
      callbackRequested: Boolean(callbackRequested),
      preferredCallbackTime: callbackRequested ? preferredCallbackTime : undefined,
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: "customer",
          senderName: fullName?.trim() || "Customer",
          text: message.trim(),
          timestamp: now,
        },
      ],
    };

    await ticketStore.createTicket(newTicket);

    return NextResponse.json({
      success: true,
      ticketId,
      ticket: newTicket,
      message: callbackRequested
        ? `Callback request received (${ticketId}). An AMEC technician will call you at +91 ${cleanPhone}.`
        : `Ticket ${ticketId} created. We'll update you via WhatsApp & SMS.`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/account/support:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
