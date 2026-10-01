import fs from "fs";
import path from "path";

export interface DisputeStatusUpdate {
  timestamp: string;
  status: DisputeStatus;
  note: string;
  author: string; // e.g. "AMEC Care Team", "System", "Quality Inspector"
}

export type DisputeType =
  | "replacement"
  | "dispute"
  | "return_refund"
  | "service_request";

export type DisputeStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "dispatched"
  | "resolved"
  | "rejected";

export type DisputeReason =
  | "DAMAGED_IN_TRANSIT"
  | "PRESSURE_PUMP_ISSUE"
  | "MISSING_ACCESSORIES"
  | "WRONG_ITEM_COLOR"
  | "BATTERY_CHARGER_ISSUE"
  | "COURIER_DELAY_DELIVERY"
  | "PERFORMANCE_DEFECT"
  | "OTHER";

export type PreferredResolution =
  | "express_replacement"
  | "send_missing_parts"
  | "technician_call"
  | "refund";

export interface PromecDispute {
  id: string; // e.g. "PROMEC-REP-1729000000-XYZ"
  createdAt: string;
  updatedAt: string;
  orderId: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    shippingAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  type: DisputeType;
  reason: DisputeReason;
  reasonLabel: string;
  description: string;
  preferredResolution: PreferredResolution;
  itemDetails: {
    productName: string;
    variantName?: string;
    color?: string;
  };
  attachmentNames?: string[];
  status: DisputeStatus;
  timeline: DisputeStatusUpdate[];
  resolutionDetails?: {
    replacementWaybill?: string;
    courierName?: string;
    dispatchDate?: string;
    notes?: string;
  };
}

export interface IDisputeStore {
  createDispute(dispute: PromecDispute): Promise<PromecDispute>;
  getDisputeById(id: string): Promise<PromecDispute | null>;
  getDisputesByPhone(phone: string): Promise<PromecDispute[]>;
  getDisputesByOrderId(orderId: string): Promise<PromecDispute[]>;
  updateDispute(id: string, patch: Partial<PromecDispute>): Promise<PromecDispute | null>;
  addStatusUpdate(
    id: string,
    status: DisputeStatus,
    note: string,
    author: string
  ): Promise<PromecDispute | null>;
}

class LocalFileDisputeStore implements IDisputeStore {
  private filePath: string;
  private memoryCache: Map<string, PromecDispute> = new Map();
  private writeLock: Promise<void> = Promise.resolve();

  constructor() {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (e) {
        console.warn("Could not create data/ directory:", e);
      }
    }
    this.filePath = path.join(dataDir, "disputes.json");
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const list: PromecDispute[] = JSON.parse(raw);
        for (const item of list) {
          this.memoryCache.set(item.id, item);
        }
      }
    } catch (err) {
      console.error("Failed to load disputes from data/disputes.json:", err);
    }
  }

  private async persist(): Promise<void> {
    this.writeLock = this.writeLock.then(async () => {
      try {
        const list = Array.from(this.memoryCache.values());
        const tempPath = `${this.filePath}.tmp.${Date.now()}`;
        await fs.promises.writeFile(tempPath, JSON.stringify(list, null, 2), "utf-8");
        await fs.promises.rename(tempPath, this.filePath);
      } catch (err) {
        console.error("Failed to persist data/disputes.json:", err);
      }
    });
    return this.writeLock;
  }

  async createDispute(dispute: PromecDispute): Promise<PromecDispute> {
    this.memoryCache.set(dispute.id, dispute);
    await this.persist();
    return dispute;
  }

  async getDisputeById(id: string): Promise<PromecDispute | null> {
    if (!id) return null;
    return this.memoryCache.get(id) || null;
  }

  async getDisputesByPhone(phone: string): Promise<PromecDispute[]> {
    if (!phone) return [];
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone) return [];

    const matches: PromecDispute[] = [];
    for (const d of this.memoryCache.values()) {
      const dPhone = (d.customer?.phone || "").replace(/\D/g, "").slice(-10);
      if (dPhone === cleanPhone) {
        matches.push(d);
      }
    }
    return matches.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDisputesByOrderId(orderId: string): Promise<PromecDispute[]> {
    if (!orderId) return [];
    const matches: PromecDispute[] = [];
    for (const d of this.memoryCache.values()) {
      if (d.orderId.toLowerCase() === orderId.toLowerCase()) {
        matches.push(d);
      }
    }
    return matches.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateDispute(id: string, patch: Partial<PromecDispute>): Promise<PromecDispute | null> {
    const existing = this.memoryCache.get(id);
    if (!existing) return null;

    const updated: PromecDispute = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this.memoryCache.set(id, updated);
    await this.persist();
    return updated;
  }

  async addStatusUpdate(
    id: string,
    status: DisputeStatus,
    note: string,
    author: string
  ): Promise<PromecDispute | null> {
    const existing = this.memoryCache.get(id);
    if (!existing) return null;

    const newUpdate: DisputeStatusUpdate = {
      timestamp: new Date().toISOString(),
      status,
      note,
      author,
    };

    existing.status = status;
    existing.timeline = [...(existing.timeline || []), newUpdate];
    existing.updatedAt = new Date().toISOString();

    this.memoryCache.set(id, existing);
    await this.persist();
    return existing;
  }
}

import { SupabaseDisputeStore } from "./supabaseDisputeStore";
const localDisputeStore = new LocalFileDisputeStore();
export const disputeStore: IDisputeStore = new SupabaseDisputeStore(localDisputeStore);
