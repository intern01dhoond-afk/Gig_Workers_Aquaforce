import { IDisputeStore, PromecDispute, DisputeStatus } from "./disputeStore";
import { getSupabase } from "./supabase";

export class SupabaseDisputeStore implements IDisputeStore {
  private fallbackStore: IDisputeStore;

  constructor(fallbackStore: IDisputeStore) {
    this.fallbackStore = fallbackStore;
  }

  private mapRowToDispute(row: any): PromecDispute {
    if (row.raw_dispute) {
      return {
        ...row.raw_dispute,
        status: row.status || row.raw_dispute.status,
        updatedAt: row.updated_at || row.raw_dispute.updatedAt,
        timeline: row.timeline || row.raw_dispute.timeline || [],
      };
    }
    return {
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      orderId: row.order_id,
      customer: row.customer || {},
      type: row.type,
      reason: row.reason,
      reasonLabel: row.reason_label,
      description: row.description,
      preferredResolution: row.preferred_resolution,
      itemDetails: row.item_details || {},
      attachmentNames: row.attachment_names || row.media_urls || [],
      status: row.status,
      timeline: row.timeline || [],
      resolutionDetails: row.resolution_details || (row.replacement_waybill || row.resolution_notes ? {
        replacementWaybill: row.replacement_waybill,
        notes: row.resolution_notes,
      } : undefined),
    };
  }

  private mapDisputeToRow(dispute: PromecDispute) {
    const cleanPhone = (dispute.customer.phone || "").replace(/\D/g, "").slice(-10);
    return {
      id: dispute.id,
      created_at: dispute.createdAt,
      updated_at: dispute.updatedAt,
      order_id: dispute.orderId,
      customer_phone: cleanPhone,
      customer_name: dispute.customer.fullName,
      type: dispute.type,
      reason: dispute.reason,
      reason_label: dispute.reasonLabel,
      description: dispute.description,
      preferred_resolution: dispute.preferredResolution,
      status: dispute.status,
      customer: dispute.customer,
      item_details: dispute.itemDetails,
      attachment_names: dispute.attachmentNames || [],
      media_urls: dispute.attachmentNames || [],
      timeline: dispute.timeline || [],
      resolution_notes: dispute.resolutionDetails?.notes || null,
      assigned_to: null,
      replacement_waybill: dispute.resolutionDetails?.replacementWaybill || null,
      raw_dispute: dispute,
    };
  }

  async createDispute(dispute: PromecDispute): Promise<PromecDispute> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.createDispute(dispute);

    try {
      const row = this.mapDisputeToRow(dispute);
      const { data, error } = await supabase
        .from("promec_disputes")
        .upsert(row, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.error("[SupabaseDisputeStore] createDispute error:", error);
        return this.fallbackStore.createDispute(dispute);
      }
      return this.mapRowToDispute(data);
    } catch (err) {
      console.error("[SupabaseDisputeStore] createDispute exception:", err);
      return this.fallbackStore.createDispute(dispute);
    }
  }

  async getDisputeById(id: string): Promise<PromecDispute | null> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.getDisputeById(id);

    try {
      const { data, error } = await supabase
        .from("promec_disputes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return this.fallbackStore.getDisputeById(id);
      }
      return this.mapRowToDispute(data);
    } catch (err) {
      console.error("[SupabaseDisputeStore] getDisputeById exception:", err);
      return this.fallbackStore.getDisputeById(id);
    }
  }

  async getDisputesByPhone(phone: string): Promise<PromecDispute[]> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.getDisputesByPhone(phone);

    try {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const { data, error } = await supabase
        .from("promec_disputes")
        .select("*")
        .eq("customer_phone", cleanPhone)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return this.fallbackStore.getDisputesByPhone(phone);
      }
      return data.map((row) => this.mapRowToDispute(row));
    } catch (err) {
      console.error("[SupabaseDisputeStore] getDisputesByPhone exception:", err);
      return this.fallbackStore.getDisputesByPhone(phone);
    }
  }

  async getDisputesByOrderId(orderId: string): Promise<PromecDispute[]> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.getDisputesByOrderId(orderId);

    try {
      const { data, error } = await supabase
        .from("promec_disputes")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return this.fallbackStore.getDisputesByOrderId(orderId);
      }
      return data.map((row) => this.mapRowToDispute(row));
    } catch (err) {
      console.error("[SupabaseDisputeStore] getDisputesByOrderId exception:", err);
      return this.fallbackStore.getDisputesByOrderId(orderId);
    }
  }

  async updateDispute(id: string, patch: Partial<PromecDispute>): Promise<PromecDispute | null> {
    const supabase = getSupabase();
    if (!supabase) return this.fallbackStore.updateDispute(id, patch);

    try {
      const current = await this.getDisputeById(id);
      if (!current) {
        return this.fallbackStore.updateDispute(id, patch);
      }

      const merged: PromecDispute = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      };

      const row = this.mapDisputeToRow(merged);
      const { data, error } = await supabase
        .from("promec_disputes")
        .update(row)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[SupabaseDisputeStore] updateDispute error:", error);
        return this.fallbackStore.updateDispute(id, patch);
      }

      this.fallbackStore.updateDispute(id, patch).catch(() => {});
      return this.mapRowToDispute(data);
    } catch (err) {
      console.error("[SupabaseDisputeStore] updateDispute exception:", err);
      return this.fallbackStore.updateDispute(id, patch);
    }
  }

  async addStatusUpdate(
    id: string,
    status: DisputeStatus,
    note: string,
    author: string
  ): Promise<PromecDispute | null> {
    const current = await this.getDisputeById(id);
    if (!current) return null;

    const newTimeline = [
      ...(current.timeline || []),
      {
        timestamp: new Date().toISOString(),
        status,
        note,
        author,
      },
    ];

    return this.updateDispute(id, {
      status,
      timeline: newTimeline,
    });
  }
}
