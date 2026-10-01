import fs from "fs";
import path from "path";

export interface SupportMessage {
  id: string;
  sender: "customer" | "support";
  senderName: string;
  text: string;
  timestamp: string;
}

export type TicketCategory =
  | "order_tracking"
  | "technical_support"
  | "warranty_claim"
  | "callback_request"
  | "general_inquiry";

export type TicketPriority = "normal" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string; // e.g. "TCK-89240"
  createdAt: string;
  updatedAt: string;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  orderId?: string;
  category: TicketCategory;
  categoryLabel: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  callbackRequested?: boolean;
  preferredCallbackTime?: string;
  messages: SupportMessage[];
}

export interface ITicketStore {
  createTicket(ticket: SupportTicket): Promise<SupportTicket>;
  getTicketById(id: string): Promise<SupportTicket | null>;
  getTicketsByPhone(phone: string): Promise<SupportTicket[]>;
  addMessage(
    ticketId: string,
    message: Omit<SupportMessage, "id" | "timestamp">
  ): Promise<SupportTicket | null>;
  updateStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket | null>;
}

class LocalFileTicketStore implements ITicketStore {
  private filePath: string;
  private memoryCache: Map<string, SupportTicket> = new Map();
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
    this.filePath = path.join(dataDir, "support_tickets.json");
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const list: SupportTicket[] = JSON.parse(raw);
        for (const t of list) {
          this.memoryCache.set(t.id, t);
        }
      }
    } catch (err) {
      console.error("Failed to load tickets from data/support_tickets.json:", err);
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
        console.error("Failed to persist data/support_tickets.json:", err);
      }
    });
    return this.writeLock;
  }

  async createTicket(ticket: SupportTicket): Promise<SupportTicket> {
    this.memoryCache.set(ticket.id, ticket);
    await this.persist();
    return ticket;
  }

  async getTicketById(id: string): Promise<SupportTicket | null> {
    if (!id) return null;
    return this.memoryCache.get(id) || null;
  }

  async getTicketsByPhone(phone: string): Promise<SupportTicket[]> {
    if (!phone) return [];
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone) return [];

    const matches: SupportTicket[] = [];
    for (const t of this.memoryCache.values()) {
      const tPhone = (t.customerPhone || "").replace(/\D/g, "").slice(-10);
      if (tPhone === cleanPhone) {
        matches.push(t);
      }
    }
    return matches.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async addMessage(
    ticketId: string,
    message: Omit<SupportMessage, "id" | "timestamp">
  ): Promise<SupportTicket | null> {
    const existing = this.memoryCache.get(ticketId);
    if (!existing) return null;

    const fullMessage: SupportMessage = {
      ...message,
      id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    existing.messages.push(fullMessage);
    existing.updatedAt = new Date().toISOString();
    if (message.sender === "customer" && existing.status === "resolved") {
      existing.status = "open";
    }

    this.memoryCache.set(ticketId, existing);
    await this.persist();
    return existing;
  }

  async updateStatus(ticketId: string, status: TicketStatus): Promise<SupportTicket | null> {
    const existing = this.memoryCache.get(ticketId);
    if (!existing) return null;

    existing.status = status;
    existing.updatedAt = new Date().toISOString();

    this.memoryCache.set(ticketId, existing);
    await this.persist();
    return existing;
  }
}

import { SupabaseTicketStore } from "./supabaseTicketStore";
const localTicketStore = new LocalFileTicketStore();
export const ticketStore: ITicketStore = new SupabaseTicketStore(localTicketStore);
