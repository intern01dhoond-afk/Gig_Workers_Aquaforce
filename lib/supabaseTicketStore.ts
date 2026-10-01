import { ITicketStore, SupportTicket, SupportMessage, TicketStatus } from "./ticketStore";
import { getSupabase } from "./supabase";

export class SupabaseTicketStore implements ITicketStore {
  private fallbackStore: ITicketStore;

  constructor(fallbackStore: ITicketStore) {
    this.fallbackStore = fallbackStore;
  }

  private mapRowToTicket(row: any): SupportTicket {
    if (row.raw_ticket) {
      return {
        ...row.raw_ticket,
        status: row.status || row.raw_ticket.status,
        updatedAt: row.updated_at || row.raw_ticket.updatedAt,
        messages: row.messages || row.raw_ticket.messages || [],
      };
    }
    return {
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      customerPhone: row.customer_phone,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      orderId: row.order_id,
      category: row.category,
      categoryLabel: row.category_label,
      subject: row.subject,
      priority: row.priority,
      status: row.status,
      callbackRequested: row.callback_requested,
      preferredCallbackTime: row.preferred_callback_time,
      messages: row.messages || [],
    };
  }

  private mapTicketToRow(ticket: SupportTicket) {
    const cleanPhone = (ticket.customerPhone || "").replace(/\D/g, "").slice(-10);
    return {
      id: ticket.id,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
      customer_phone: cleanPhone,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail || null,
      order_id: ticket.orderId || null,
      category: ticket.category,
      category_label: ticket.categoryLabel,
      subject: ticket.subject,
      priority: ticket.priority,
      status: ticket.status,
      callback_requested: Boolean(ticket.callbackRequested),
      preferred_callback_time: ticket.preferredCallbackTime || null,
      messages: ticket.messages || [],
      raw_ticket: ticket,
    };
  }

  async createTicket(ticket: SupportTicket): Promise<SupportTicket> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.createTicket(ticket);

    try {
      const row = this.mapTicketToRow(ticket);
      const { data, error } = await supabase
        .from("promec_support_tickets")
        .upsert(row, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.error("[SupabaseTicketStore] createTicket error:", error);
        return this.fallbackStore.createTicket(ticket);
      }
      return this.mapRowToTicket(data);
    } catch (err) {
      console.error("[SupabaseTicketStore] createTicket exception:", err);
      return this.fallbackStore.createTicket(ticket);
    }
  }

  async getTicketById(id: string): Promise<SupportTicket | null> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.getTicketById(id);

    try {
      const { data, error } = await supabase
        .from("promec_support_tickets")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return this.fallbackStore.getTicketById(id);
      }
      return this.mapRowToTicket(data);
    } catch (err) {
      console.error("[SupabaseTicketStore] getTicketById exception:", err);
      return this.fallbackStore.getTicketById(id);
    }
  }

  async getTicketsByPhone(phone: string): Promise<SupportTicket[]> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.getTicketsByPhone(phone);

    try {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const { data, error } = await supabase
        .from("promec_support_tickets")
        .select("*")
        .eq("customer_phone", cleanPhone)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return this.fallbackStore.getTicketsByPhone(phone);
      }
      return data.map((row) => this.mapRowToTicket(row));
    } catch (err) {
      console.error("[SupabaseTicketStore] getTicketsByPhone exception:", err);
      return this.fallbackStore.getTicketsByPhone(phone);
    }
  }

  async addMessage(
    ticketId: string,
    message: Omit<SupportMessage, "id" | "timestamp">
  ): Promise<SupportTicket | null> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.addMessage(ticketId, message);

    try {
      const current = await this.getTicketById(ticketId);
      if (!current) {
        return this.fallbackStore.addMessage(ticketId, message);
      }

      const newMessage: SupportMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...current.messages, newMessage];
      const { data, error } = await supabase
        .from("promec_support_tickets")
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
          status: message.sender === "customer" ? "in_progress" : current.status,
        })
        .eq("id", ticketId)
        .select()
        .single();

      if (error) {
        console.error("[SupabaseTicketStore] addMessage error:", error);
        return this.fallbackStore.addMessage(ticketId, message);
      }

      this.fallbackStore.addMessage(ticketId, message).catch(() => {});
      return this.mapRowToTicket(data);
    } catch (err) {
      console.error("[SupabaseTicketStore] addMessage exception:", err);
      return this.fallbackStore.addMessage(ticketId, message);
    }
  }

  async updateStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket | null> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.updateStatus(ticketId, status);

    try {
      const { data, error } = await supabase
        .from("promec_support_tickets")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId)
        .select()
        .single();

      if (error) {
        console.error("[SupabaseTicketStore] updateStatus error:", error);
        return this.fallbackStore.updateStatus(ticketId, status);
      }

      this.fallbackStore.updateStatus(ticketId, status).catch(() => {});
      return this.mapRowToTicket(data);
    } catch (err) {
      console.error("[SupabaseTicketStore] updateStatus exception:", err);
      return this.fallbackStore.updateStatus(ticketId, status);
    }
  }
}
