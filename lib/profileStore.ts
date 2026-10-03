import fs from "fs";
import path from "path";

export interface CustomerProfile {
  phone: string; // 10-digit clean phone
  fullName: string;
  email: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  altPhone?: string;
  gstNumber?: string;
  customerType?: "retail" | "commercial";
  companyName?: string;
  updatedAt: string;
}

class LocalFileProfileStore {
  private filePath: string;
  private memoryCache: Map<string, CustomerProfile> = new Map();
  private writeLock: Promise<void> = Promise.resolve();

  constructor() {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (e) {
        console.warn("Could not create data/ directory for profiles:", e);
      }
    }
    this.filePath = path.join(dataDir, "profiles.json");
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        if (raw.trim()) {
          const list: CustomerProfile[] = JSON.parse(raw);
          for (const p of list) {
            const cleanPhone = (p.phone || "").replace(/\D/g, "").slice(-10);
            if (cleanPhone) {
              this.memoryCache.set(cleanPhone, { ...p, phone: cleanPhone });
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to load profiles from data/profiles.json:", err);
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
        console.error("Failed to persist data/profiles.json:", err);
      }
    });
    return this.writeLock;
  }

  async getProfileByPhone(phone: string): Promise<CustomerProfile | null> {
    if (!phone) return null;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone) return null;

    // Check memory cache first
    const cached = this.memoryCache.get(cleanPhone);
    if (cached) return cached;

    // Reload from file in case another worker updated it
    this.loadFromFile();
    return this.memoryCache.get(cleanPhone) || null;
  }

  async saveProfile(
    phone: string,
    profileData: Partial<CustomerProfile>
  ): Promise<CustomerProfile> {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone) {
      throw new Error("Valid 10-digit phone number is required to save profile");
    }

    const existing = await this.getProfileByPhone(cleanPhone);
    const updated: CustomerProfile = {
      phone: cleanPhone,
      fullName: (profileData.fullName !== undefined ? profileData.fullName : existing?.fullName) || "",
      email: (profileData.email !== undefined ? profileData.email : existing?.email) || "",
      shippingAddress: (profileData.shippingAddress !== undefined ? profileData.shippingAddress : existing?.shippingAddress) || "",
      city: (profileData.city !== undefined ? profileData.city : existing?.city) || "",
      state: (profileData.state !== undefined ? profileData.state : existing?.state) || "",
      pincode: (profileData.pincode !== undefined ? profileData.pincode : existing?.pincode) || "",
      altPhone: profileData.altPhone !== undefined ? profileData.altPhone : existing?.altPhone || "",
      gstNumber: profileData.gstNumber !== undefined ? profileData.gstNumber : existing?.gstNumber || "",
      customerType: profileData.customerType !== undefined ? profileData.customerType : existing?.customerType || "retail",
      companyName: profileData.companyName !== undefined ? profileData.companyName : existing?.companyName || "",
      updatedAt: new Date().toISOString(),
    };

    this.memoryCache.set(cleanPhone, updated);
    await this.persist();
    return updated;
  }
}

export const profileStore = new LocalFileProfileStore();
