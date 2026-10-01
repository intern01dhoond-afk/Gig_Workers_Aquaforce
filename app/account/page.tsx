"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  ShieldCheck,
  Phone,
  User,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  FileText,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Wrench,
  Search,
  Award,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Mail,
  Building2,
  Edit3,
  Lock,
  Headphones,
  CheckCircle,
} from "lucide-react";
import { PromecOrder } from "@/lib/orderStore";
import dynamic from "next/dynamic";
import { PromecDispute } from "@/lib/disputeStore";
import AccountLoginModal from "@/components/account/AccountLoginModal";

const OrderTrackingModal = dynamic(() => import("@/components/account/OrderTrackingModal"), { ssr: false });
const DisputeModal = dynamic(() => import("@/components/account/DisputeModal"), { ssr: false });
const InvoiceModal = dynamic(() => import("@/components/account/InvoiceModal"), { ssr: false });
const SupportModal = dynamic(() => import("@/components/account/SupportModal"), { ssr: false });
const WarrantyCardModal = dynamic(() => import("@/components/account/WarrantyCardModal"), { ssr: false });

type TabType = "orders" | "disputes" | "support" | "profile";

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId") || "";
  const queryTab = searchParams.get("tab") as TabType | null;

  // Auth state initialized synchronously from localStorage
  const [user, setUser] = useState<{ phone: string; fullName: string } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved =
          localStorage.getItem("aquaforce_user") ||
          localStorage.getItem("promec_verified_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.phone) {
            return {
              phone: parsed.phone,
              fullName: parsed.fullName || "Customer",
            };
          }
        }
      } catch (e) {}
    }
    return null;
  });
  const [authChecked, setAuthChecked] = useState(true);

  // Tab state (defaults to "profile", or "orders" if orderId is specified in URL)
  const [activeTab, setActiveTab] = useState<TabType>(
    queryTab || (queryOrderId ? "orders" : "profile")
  );

  // Data states
  const [orders, setOrders] = useState<PromecOrder[]>([]);
  const [disputes, setDisputes] = useState<PromecDispute[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<"all" | "in_transit" | "delivered" | "cod">("all");

  // Modals state
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<PromecOrder | null>(null);
  const [selectedOrderForDispute, setSelectedOrderForDispute] = useState<PromecOrder | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<PromecOrder | null>(null);
  const [selectedOrderForWarranty, setSelectedOrderForWarranty] = useState<PromecOrder | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Copy helper
  const [copiedId, setCopiedId] = useState("");
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(""), 2000);
  };

  // Sync tab with URL param if it changes
  useEffect(() => {
    if (queryTab && ["orders", "disputes", "support", "profile"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  // Check saved session on mount
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("aquaforce_user") ||
        localStorage.getItem("promec_verified_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.phone) {
          const userObj = {
            phone: parsed.phone,
            fullName: parsed.fullName || "Customer",
          };
          setUser(userObj);
          localStorage.setItem("aquaforce_user", JSON.stringify(userObj));
          localStorage.setItem("promec_verified_user", JSON.stringify(userObj));
        }
      }
    } catch (e) {
      console.warn("Could not read auth storage", e);
    }
    setAuthChecked(true);
  }, []);

  // Fetch customer orders and disputes whenever user changes
  useEffect(() => {
    if (user?.phone) {
      fetchCustomerData(user.phone);
    }
  }, [user?.phone]);

  // Handle URL query for auto-opening order
  useEffect(() => {
    if (queryOrderId && orders.length > 0) {
      setActiveTab("orders");
      const found = orders.find((o) => o.id === queryOrderId);
      if (found) {
        setSelectedOrderForTracking(found);
      }
    }
  }, [queryOrderId, orders]);

  const fetchCustomerData = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // 1. Instant Cache Hydration: Render cached orders & profile with 0ms delay
    try {
      const localAddress = localStorage.getItem(`aquaforce_saved_address_${cleanPhone}`);
      if (localAddress) {
        const parsedAddress = JSON.parse(localAddress);
        if (parsedAddress?.shippingAddress || parsedAddress?.fullName) {
          setProfile(parsedAddress);
          setProfileForm({
            fullName: parsedAddress.fullName || user?.fullName || "",
            email: parsedAddress.email || "",
            shippingAddress: parsedAddress.shippingAddress || "",
            city: parsedAddress.city || "",
            state: parsedAddress.state || "",
            pincode: parsedAddress.pincode || "",
            gstNumber: parsedAddress.gstNumber || "",
          });
        }
      }
      const cached = sessionStorage.getItem(`promec_cached_account_${cleanPhone}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed?.orders)) setOrders(parsed.orders);
        if (Array.isArray(parsed?.disputes)) setDisputes(parsed.disputes);
        if (parsed?.profile && (parsed.profile.shippingAddress || parsed.profile.fullName)) {
          setProfile(parsed.profile);
          setProfileForm({
            fullName: parsed.profile.fullName || user?.fullName || "",
            email: parsed.profile.email || "",
            shippingAddress: parsed.profile.shippingAddress || "",
            city: parsed.profile.city || "",
            state: parsed.profile.state || "",
            pincode: parsed.profile.pincode || "",
            gstNumber: parsed.profile.gstNumber || "",
          });
        }
      } else {
        setLoading(true);
      }
    } catch (e) {
      setLoading(true);
    }

    try {
      const [ordersRes, disputesRes, profileRes] = await Promise.all([
        fetch(`/aquaforceforgigworkers/api/account/orders?phone=${cleanPhone}`),
        fetch(`/aquaforceforgigworkers/api/account/disputes?phone=${cleanPhone}`),
        fetch(`/aquaforceforgigworkers/api/account/profile?phone=${cleanPhone}`),
      ]);

      const [ordersData, disputesData, profileData] = await Promise.all([
        ordersRes.json(),
        disputesRes.json(),
        profileRes.json(),
      ]);

      let newOrders = orders;
      let newDisputes = disputes;
      let newProfile = profile;

      if (ordersData.success && Array.isArray(ordersData.orders)) {
        newOrders = ordersData.orders;
        setOrders(newOrders);
      }

      if (disputesData.success && Array.isArray(disputesData.disputes)) {
        newDisputes = disputesData.disputes;
        setDisputes(newDisputes);
      }

      if (profileData.success && profileData.profile && (profileData.profile.shippingAddress || profileData.profile.fullName || profileData.profile.email)) {
        newProfile = profileData.profile;
        setProfile(newProfile);
        setProfileForm({
          fullName: profileData.profile.fullName || user?.fullName || "",
          email: profileData.profile.email || "",
          shippingAddress: profileData.profile.shippingAddress || "",
          city: profileData.profile.city || "",
          state: profileData.profile.state || "",
          pincode: profileData.profile.pincode || "",
          gstNumber: profileData.profile.gstNumber || "",
        });
        try {
          localStorage.setItem(`aquaforce_saved_address_${cleanPhone}`, JSON.stringify(newProfile));
        } catch (e) {}
      }

      // Persist to session cache for instant future loads
      try {
        sessionStorage.setItem(
          `promec_cached_account_${cleanPhone}`,
          JSON.stringify({ orders: newOrders, disputes: newDisputes, profile: newProfile })
        );
      } catch (e) {}
    } catch (err) {
      console.error("Failed to load customer account data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: { phone: string; fullName: string }) => {
    setUser(userData);
    try {
      localStorage.setItem("aquaforce_user", JSON.stringify(userData));
      localStorage.setItem("promec_verified_user", JSON.stringify(userData));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("aquaforce_auth_changed"));
      }
    } catch (e) {
      console.error("Failed to save auth to storage:", e);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("aquaforce_user");
      localStorage.removeItem("promec_verified_user");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("aquaforce_auth_changed"));
      }
    } catch (e) {
      console.error("Failed to clear auth from storage:", e);
    }
    setUser(null);
    setOrders([]);
    setDisputes([]);
    setProfile(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.phone) return;
    try {
      const cleanPhone = user.phone.replace(/\D/g, "").slice(-10);
      const updatedProfileObj = {
        fullName: profileForm.fullName.trim() || user.fullName || "Customer",
        phone: cleanPhone,
        email: profileForm.email.trim(),
        shippingAddress: profileForm.shippingAddress.trim(),
        city: profileForm.city.trim(),
        state: profileForm.state.trim(),
        pincode: profileForm.pincode.trim(),
        gstNumber: profileForm.gstNumber.trim(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
      setProfile(updatedProfileObj);
      setEditingProfile(false);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);

      // Persist to local caches immediately
      try {
        localStorage.setItem(`aquaforce_saved_address_${cleanPhone}`, JSON.stringify(updatedProfileObj));
        sessionStorage.setItem(
          `promec_cached_account_${cleanPhone}`,
          JSON.stringify({ orders, disputes, profile: updatedProfileObj })
        );
        if (profileForm.fullName.trim()) {
          const updatedUser = { ...user, fullName: profileForm.fullName.trim() };
          setUser(updatedUser);
          localStorage.setItem("aquaforce_user", JSON.stringify(updatedUser));
          localStorage.setItem("promec_verified_user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("aquaforce_auth_changed"));
        }
      } catch (e) {}

      const res = await fetch("/aquaforceforgigworkers/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          ...profileForm,
        }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setProfileForm({
          fullName: data.profile.fullName || profileForm.fullName,
          email: data.profile.email || "",
          shippingAddress: data.profile.shippingAddress || "",
          city: data.profile.city || "",
          state: data.profile.state || "",
          pincode: data.profile.pincode || "",
          gstNumber: data.profile.gstNumber || "",
        });
      }
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.fulfillment.waybill && o.fulfillment.waybill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.items[0]?.productName && o.items[0].productName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (orderFilter === "in_transit") {
      return o.orderStatus === "shipped" || Boolean(o.fulfillment.waybill);
    }
    if (orderFilter === "delivered") {
      return o.orderStatus === "delivered";
    }
    if (orderFilter === "cod") {
      return o.payment.method === "COD_ADVANCE";
    }
    return true;
  });

  // Not logged in -> Show login modal over clean portal backdrop
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center p-3 sm:p-4 font-open-sans relative">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <AccountLoginModal
            onSuccess={handleLoginSuccess}
            onClose={() => router.push("/")}
          />
        </div>
      </div>
    );
  }

  // Count metrics
  const totalOrdersCount = orders.length;
  const inTransitCount = orders.filter((o) => o.orderStatus === "shipped" || Boolean(o.fulfillment.waybill)).length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const openDisputesCount = disputes.filter((d) => d.status !== "resolved" && d.status !== "rejected").length;
  const displayName = profile?.fullName || user.fullName || "Customer";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-open-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-8 h-14 sm:h-16 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            title="Back to Store"
            aria-label="Back to Store"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200/90 shadow-xs hover:shadow-sm flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="mr-0.5" />
          </Link>
          <span className="text-sm sm:text-base font-bold font-montserrat text-[#0F1729]">
            My Account
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-[11px] sm:text-xs font-bold font-montserrat tracking-wider transition-all cursor-pointer"
          >
            <Phone size={12} className="shrink-0" />
            <span className="hidden sm:inline">VIP Support</span>
            <span className="sm:hidden">Help</span>
          </button>

          {/* Quick logout button on mobile header */}
          <button
            onClick={handleLogout}
            title="Log Out"
            className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-bold font-montserrat transition-all cursor-pointer"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* MOBILE NAVIGATION TABS (4 columns: Profile, Orders, Claims, Warranty) */}
        <div className="md:hidden mb-4">
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white text-[#0066cc] font-bold shadow-2xs"
                  : "text-slate-600 font-medium hover:text-slate-900"
              }`}
            >
              <User size={16} className="shrink-0" />
              <span className="text-[10px] font-montserrat mt-0.5 leading-tight truncate">
                Profile
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-white text-[#0066cc] font-bold shadow-2xs"
                  : "text-slate-600 font-medium hover:text-slate-900"
              }`}
            >
              <Package size={16} className="shrink-0" />
              <span className="text-[10px] font-montserrat mt-0.5 leading-tight truncate">
                Orders ({totalOrdersCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("disputes")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "disputes"
                  ? "bg-white text-[#0066cc] font-bold shadow-2xs"
                  : "text-slate-600 font-medium hover:text-slate-900"
              }`}
            >
              <RotateCcw size={16} className="shrink-0" />
              <span className="text-[10px] font-montserrat mt-0.5 leading-tight truncate">
                Claims ({disputes.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("support")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "support"
                  ? "bg-white text-[#0066cc] font-bold shadow-2xs"
                  : "text-slate-600 font-medium hover:text-slate-900"
              }`}
            >
              <ShieldCheck size={16} className="shrink-0" />
              <span className="text-[10px] font-montserrat mt-0.5 leading-tight truncate">
                Warranty
              </span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: LEFT SIDEBAR + MAIN CONTENT */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-start">
          {/* DESKTOP LEFT SIDEBAR */}
          <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 md:sticky md:top-20 bg-white border border-slate-200/90 rounded-2xl shadow-xs p-3.5 lg:p-4 min-h-[calc(100vh-110px)] max-h-[calc(100vh-110px)] justify-between">
            {/* User Mini Profile Header */}
            <div className="flex items-center gap-3 px-2 py-2 mb-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066cc] to-[#00408c] flex items-center justify-center text-white font-bold font-montserrat text-base shadow-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold font-montserrat text-slate-900 truncate">
                  {displayName}
                </div>
                <div className="text-[11px] font-open-sans text-slate-500 truncate">
                  +91 {user.phone}
                </div>
              </div>
            </div>

            {/* Vertical Navigation Links: Profile (first) -> Orders -> Claims & Replacements -> 1-Year Warranty & Help */}
            <nav className="space-y-1.5 flex-1">
              {/* 1. Profile (FIRST) */}
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold font-montserrat transition-all cursor-pointer text-left ${
                  activeTab === "profile"
                    ? "bg-[#0066cc] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                }`}
              >
                <User size={18} className="shrink-0" />
                <span className="truncate">Profile</span>
              </button>

              {/* 2. Orders */}
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold font-montserrat transition-all cursor-pointer text-left ${
                  activeTab === "orders"
                    ? "bg-[#0066cc] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Package size={18} className="shrink-0" />
                  <span className="truncate">Orders</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "orders"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {totalOrdersCount}
                </span>
              </button>

              {/* 3. Claims & Replacements (0) */}
              <button
                type="button"
                onClick={() => setActiveTab("disputes")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold font-montserrat transition-all cursor-pointer text-left ${
                  activeTab === "disputes"
                    ? "bg-[#0066cc] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <RotateCcw size={18} className="shrink-0" />
                  <span className="truncate">Claims & Replacements</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "disputes"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {disputes.length}
                </span>
              </button>

              {/* 4. 1-Year Warranty & Help */}
              <button
                type="button"
                onClick={() => setActiveTab("support")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold font-montserrat transition-all cursor-pointer text-left ${
                  activeTab === "support"
                    ? "bg-[#0066cc] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                }`}
              >
                <ShieldCheck size={18} className="shrink-0" />
                <span className="truncate">1-Year Warranty & Help</span>
              </button>
            </nav>

            {/* Bottom Left: Logout */}
            <div className="pt-3 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-montserrat text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-left group"
              >
                <LogOut size={17} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Right Column: Tab Content */}
          <div className="flex-1 min-w-0 w-full space-y-4 sm:space-y-6">

        {/* TAB 1: ORDERS & TRACKING DASHBOARD */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Orders Welcome & Stats Summary Banner (Compact and mobile-friendly) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-xs bg-gradient-to-br from-white via-sky-50/20 to-blue-50/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-xl font-bold font-montserrat text-[#0F1729]">
                      Welcome, {displayName}
                    </h1>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-open-sans mt-0.5">
                    Live Delhivery express tracking, 1-year warranty coverage & fast replacement claims.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 pt-1 sm:pt-0">
                  <button
                    onClick={() => {
                      setSelectedOrderForDispute(orders[0] || null);
                      setIsDisputeModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] sm:text-xs font-bold font-montserrat uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert size={13} className="shrink-0" />
                    <span>File Claim</span>
                  </button>

                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-[#0066cc] hover:bg-[#0052b3] text-white text-[11px] sm:text-xs font-bold font-montserrat uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={13} className="shrink-0" />
                    <span>Care Desk</span>
                  </button>
                </div>
              </div>

              {/* Responsive Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-100">
                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 sm:p-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider font-montserrat block truncate">
                    Total Orders
                  </span>
                  <span className="text-lg sm:text-2xl font-bold font-montserrat text-slate-900 mt-0.5 block">
                    {totalOrdersCount}
                  </span>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 sm:p-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider font-montserrat block truncate">
                    In Transit
                  </span>
                  <span className="text-lg sm:text-2xl font-bold font-montserrat text-[#0066cc] mt-0.5 block">
                    {inTransitCount}
                  </span>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 sm:p-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider font-montserrat block truncate">
                    Delivered
                  </span>
                  <span className="text-lg sm:text-2xl font-bold font-montserrat text-emerald-600 mt-0.5 block">
                    {deliveredCount}
                  </span>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 sm:p-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider font-montserrat block truncate">
                    Active Claims
                  </span>
                  <span className="text-lg sm:text-2xl font-bold font-montserrat text-amber-600 mt-0.5 block">
                    {openDisputesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white border border-slate-200/90 p-2 sm:p-2.5 rounded-xl shadow-2xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <button
                  onClick={() => setOrderFilter("all")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-montserrat transition-all cursor-pointer shrink-0 ${
                    orderFilter === "all"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter("in_transit")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-montserrat transition-all cursor-pointer shrink-0 ${
                    orderFilter === "in_transit"
                      ? "bg-[#0066cc] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  In Transit ({inTransitCount})
                </button>
                <button
                  onClick={() => setOrderFilter("delivered")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-montserrat transition-all cursor-pointer shrink-0 ${
                    orderFilter === "delivered"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Delivered ({deliveredCount})
                </button>
                <button
                  onClick={() => setOrderFilter("cod")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-montserrat transition-all cursor-pointer shrink-0 ${
                    orderFilter === "cod"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  COD Balance
                </button>
              </div>

              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Order ID or AWB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 font-open-sans focus:outline-none focus:border-[#0066cc] focus:bg-white"
                />
              </div>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-4 border-[#0066cc] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-open-sans">Fetching orders from cloud database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 text-center space-y-3.5 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-montserrat">No orders found</h3>
                  <p className="text-xs text-slate-500 font-open-sans max-w-sm mx-auto mt-1">
                    {orders.length === 0
                      ? `We haven't found any orders under +91 ${user.phone}. Place your first order or link an existing order.`
                      : "No orders match your search criteria."}
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-bold uppercase tracking-wider font-montserrat transition-all shadow-xs"
                >
                  <span>Order Aquaforce 1400 Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const item = order.items[0] || {
                    productName: "AquaforceÂ® 1400 PSI Tech",
                    variantName: "With Vacuum",
                    color: "Yellow",
                    totalAmountInINR: 37999,
                  };
                  const isCod = order.payment.method === "COD_ADVANCE";
                  const waybill = order.fulfillment.waybill;
                  const isYellow = item.color?.toLowerCase() === "yellow";
                  const productImg = isYellow
                    ? "/aquaforceforgigworkers/images/products/yellow/1.webp"
                    : "/aquaforceforgigworkers/images/products/blue/1.webp";

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3.5 sm:p-5 transition-all space-y-3.5 shadow-xs hover:shadow-md"
                    >
                      {/* Top Order Metadata Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs font-open-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat font-bold text-slate-900 tracking-wide text-xs sm:text-sm">
                            {order.id}
                          </span>
                          <button
                            onClick={() => handleCopy(order.id)}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
                            title="Copy Order ID"
                          >
                            {copiedId === order.id ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-montserrat ${
                              order.orderStatus === "delivered"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : order.orderStatus === "cancelled"
                                ? "bg-rose-50 border-rose-200 text-rose-700"
                                : "bg-sky-50 border-sky-200 text-[#0066cc]"
                            }`}
                          >
                            {order.orderStatus === "delivered"
                              ? "Delivered"
                              : waybill
                              ? "In-Transit"
                              : "Confirmed"}
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-montserrat bg-slate-100 border border-slate-200 text-slate-700">
                            {isCod ? "COD" : "Prepaid"}
                          </span>
                        </div>
                      </div>

                      {/* Product Content & Price Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <Image
                              src={productImg}
                              alt={item.productName}
                              fill
                              sizes="80px"
                              className="object-contain"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066cc] font-montserrat">
                              AquaforceÂ® 1400 PSI Tech
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-montserrat leading-snug">
                              {item.productName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 font-open-sans mt-0.5">
                              <span>Variant: <strong className="text-slate-900 font-montserrat">{item.variantName}</strong></span>
                              <span>â€¢</span>
                              <span>Color: <strong className="text-slate-900 font-montserrat">{item.color}</strong></span>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded-md w-fit font-medium font-open-sans mt-1">
                              <ShieldCheck size={11} className="text-amber-600 shrink-0" />
                              <span>1-Year Pan-India Warranty Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Financial Card */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 sm:text-right shrink-0 sm:min-w-[180px] text-xs font-open-sans">
                          <div className="flex sm:block justify-between items-center">
                            <span className="text-slate-500 text-[11px] font-open-sans">Total Order Value</span>
                            <span className="text-base sm:text-lg font-bold font-montserrat text-slate-900 block">
                              â‚¹{order.pricing.finalTotalInINR.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {isCod ? (
                            <div className="mt-1 pt-1 border-t border-slate-200 text-[11px] flex sm:block justify-between">
                              <span className="text-emerald-700 font-medium">
                                Paid: â‚¹{Math.round(order.payment.amountPaidInPaise / 100).toLocaleString("en-IN")}
                              </span>
                              <span className="text-amber-800 font-bold font-montserrat sm:block">
                                Due: â‚¹{Math.round(order.payment.amountDueInPaise / 100).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-emerald-700 font-medium text-[11px] block mt-0.5">
                              Full Amount Paid (Zero Balance)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shipment & Waybill Strip */}
                      <div className="bg-sky-50/60 border border-sky-100/90 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-open-sans text-slate-700">
                        <div className="flex items-center gap-2">
                          <Truck size={15} className="text-[#0066cc] shrink-0" />
                          <div className="truncate">
                            <span className="text-slate-600 font-open-sans">Courier: </span>
                            <strong className="text-slate-900 font-montserrat">Delhivery Express</strong>
                            {waybill && (
                              <span className="ml-1.5 font-montserrat font-bold text-[#0066cc] bg-white border border-sky-200 px-1.5 py-0.5 rounded text-[10px] tracking-wider">
                                AWB: {waybill}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-slate-500 font-open-sans text-[11px]">
                          Destination: <strong className="text-slate-800 font-montserrat">{order.customer.city}, {order.customer.state}</strong>
                        </div>
                      </div>

                      {/* Action Bar (Mobile-Optimized Grid) */}
                      <div className="space-y-1.5 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForTracking(order)}
                            className="w-full py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-bold font-montserrat uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Truck size={14} className="shrink-0" />
                            <span className="truncate">Live Tracking</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForDispute(order);
                              setIsDisputeModalOpen(true);
                            }}
                            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold font-montserrat uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw size={14} className="shrink-0" />
                            <span className="truncate">Claim / Replace</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="py-2 px-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-bold font-montserrat transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileText size={12} className="shrink-0" />
                            <span className="truncate">Invoice</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedOrderForWarranty(order)}
                            className="py-2 px-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200/80 text-[11px] font-bold font-montserrat transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Award size={12} className="shrink-0" />
                            <span className="truncate">Warranty</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsSupportModalOpen(true)}
                            className="py-2 px-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-bold font-montserrat transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <MessageSquare size={12} className="shrink-0" />
                            <span className="truncate">Support</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REPLACEMENTS & CLAIMS */}
        {activeTab === "disputes" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
              <div>
                <h3 className="text-base font-bold font-montserrat text-slate-900">
                  Self-Service Replacement & Claims Center
                </h3>
                <p className="text-xs text-slate-600 font-open-sans mt-0.5">
                  Doorstep replacements under AMEC 1-Year Pan-India Warranty.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForDispute(orders[0] || null);
                  setIsDisputeModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold font-montserrat uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <ShieldAlert size={14} />
                <span>File New Claim</span>
              </button>
            </div>

            {disputes.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-montserrat">
                  No Active Disputes or Claims
                </h4>
                <p className="text-xs text-slate-500 font-open-sans max-w-sm mx-auto leading-relaxed">
                  All your past orders are running smoothly. If you ever face damaged delivery, low pressure, or missing parts, file a claim here for 24h resolution.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {disputes.map((dispute) => {
                  const formattedDate = new Date(dispute.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <div
                      key={dispute.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat font-bold text-slate-900 tracking-wide text-xs sm:text-sm">
                            {dispute.id}
                          </span>
                          <span className="text-slate-300">â€¢</span>
                          <span className="text-slate-500 font-open-sans text-[11px]">{formattedDate}</span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-montserrat ${
                            dispute.status === "resolved"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : dispute.status === "approved" || dispute.status === "dispatched"
                              ? "bg-sky-50 border-sky-200 text-[#0066cc]"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          {dispute.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-rose-600 font-montserrat uppercase tracking-wider">
                            {dispute.reasonLabel}
                          </span>
                          <span className="text-slate-300">â€¢</span>
                          <span className="text-xs text-slate-700 font-semibold font-open-sans">
                            Requested: {dispute.preferredResolution.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-open-sans mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          &ldquo;{dispute.description}&rdquo;
                        </p>
                      </div>

                      {/* Escalation Button */}
                      <div className="flex items-center justify-end pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            const text = encodeURIComponent(
                              `Hello AMEC Team, I am following up on Case ID: ${dispute.id} (Order: ${dispute.orderId}). Registered phone: ${user.phone}.`
                            );
                            window.open(`https://wa.me/917387588963?text=${text}`, "_blank");
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold font-montserrat flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageSquare size={13} />
                          <span>Escalate on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WARRANTY & FAST SUPPORT */}
        {activeTab === "support" && (
          <div className="space-y-4">
            {/* Warranty Certificate Hero Card */}
            <div className="bg-gradient-to-br from-amber-50/90 via-amber-100/30 to-white border border-amber-200 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-montserrat">
                    Pan-India Guarantee
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold font-montserrat text-[#0F1729] mt-1">
                  1-Year Comprehensive Warranty
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-open-sans max-w-xl mt-1 leading-relaxed">
                  Your AquaforceÂ® 1400 is covered by AMEC Mobility Pvt Ltd. Full replacement coverage for high-pressure pump mechanism, motor, 25V battery cells, and circuit board.
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-open-sans">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold font-montserrat text-[11px]">
                    âœ“ Status: Active
                  </span>
                  <span className="text-slate-600 font-open-sans text-[11px]">
                    Coverage: 365 Days From Dispatch
                  </span>
                </div>
              </div>

              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedOrderForWarranty(orders[0])}
                  className="w-full md:w-auto px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 text-xs font-bold font-montserrat uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Award size={16} />
                  <span>View Warranty Certificate</span>
                </button>
              )}
            </div>

            {/* Fast Support Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare size={17} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-montserrat">
                  Instant WhatsApp VIP Chat
                </h4>
                <p className="text-xs text-slate-600 font-open-sans leading-relaxed">
                  Fastest response channel. Directly message Senior Engineers with photos or videos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Hello AMEC Team, I am customer ${displayName} (${user.phone}). Need technical help with Aquaforce 1400.`
                    );
                    window.open(`https://wa.me/917387588963?text=${text}`, "_blank");
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider font-montserrat transition-all cursor-pointer shadow-xs"
                >
                  Open WhatsApp Desk
                </button>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0066cc] flex items-center justify-center">
                  <Phone size={17} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-montserrat">
                  Direct Phone Support
                </h4>
                <p className="text-xs text-slate-600 font-open-sans leading-relaxed">
                  Speak directly to our Nagpur customer care desk. Available 9:30 AM to 7:30 PM IST.
                </p>
                <a
                  href="tel:+917387588963"
                  className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center text-xs font-bold uppercase tracking-wider font-montserrat transition-all cursor-pointer border border-slate-200"
                >
                  Call +91 7387588963
                </a>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Clock size={17} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-montserrat">
                  Request 30-Min Callback
                </h4>
                <p className="text-xs text-slate-600 font-open-sans leading-relaxed">
                  Busy right now? Schedule a call and our specialist will dial your number at your chosen time.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-bold uppercase tracking-wider font-montserrat transition-all cursor-pointer shadow-xs"
                >
                  Schedule Callback
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLETE REDESIGNED USER PROFILE & ADDRESS EXPERIENCE */}
        {activeTab === "profile" && (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* HERO PROFILE IDENTITY CARD */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs bg-gradient-to-br from-white via-sky-50/20 to-blue-50/15">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Large Stylish User Avatar */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0066cc] to-[#00408c] flex items-center justify-center text-white font-bold font-montserrat text-lg sm:text-2xl shadow-md shrink-0">
                    <span>{initials}</span>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-base sm:text-xl font-bold font-montserrat text-slate-900 leading-tight truncate">
                        {displayName}
                      </h2>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 font-montserrat shrink-0">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-open-sans mt-0.5 flex-wrap">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Phone size={11} className="text-[#0066cc] shrink-0" />
                        <span className="font-montserrat font-bold text-slate-900 whitespace-nowrap">+91 {user.phone}</span>
                      </div>
                      <span className="text-slate-300 hidden xs:inline">â€¢</span>
                      <span className="text-emerald-700 font-medium text-[11px] whitespace-nowrap">Verified</span>
                    </div>

                    <span className="block mt-0.5 text-[10px] sm:text-[11px] font-montserrat font-medium text-slate-500 truncate">
                      AMEC Aquaforce Owner
                    </span>
                  </div>
                </div>

                {!editingProfile && (
                  <button
                    type="button"
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-[#0066cc] hover:text-white text-slate-700 text-[11px] sm:text-xs font-bold font-montserrat transition-all cursor-pointer shrink-0 shadow-2xs"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* Ownership Summary Chips */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-montserrat block">
                    Orders
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-montserrat text-slate-900 mt-0.5 block">
                    {totalOrdersCount} Placed
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-montserrat block">
                    Warranty
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-montserrat text-emerald-600 mt-0.5 block">
                    1-Year Active
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-montserrat block">
                    Care Level
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-montserrat text-[#0066cc] mt-0.5 block">
                    VIP Priority
                  </span>
                </div>
              </div>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-open-sans animate-in fade-in duration-200">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span className="font-medium">Profile and shipping details updated successfully!</span>
              </div>
            )}

            {/* EDIT PROFILE FORM */}
            {editingProfile ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-montserrat text-slate-900">
                      Edit Profile & Delivery Address
                    </h3>
                    <p className="text-[11px] text-slate-500 font-open-sans">
                      Updates are linked to your registered mobile number (+91 {user.phone})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-montserrat font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs font-open-sans">
                  {/* Full Name & Locked Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 text-xs font-open-sans focus:outline-none focus:border-[#0066cc] focus:bg-white"
                          required
                          placeholder="Your complete legal name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px] flex items-center justify-between">
                        <span>Registered Phone</span>
                        <span className="text-[9px] text-emerald-600 font-bold lowercase flex items-center gap-0.5">
                          <Lock size={10} /> verified ID
                        </span>
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={`+91 ${user.phone}`}
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-500 text-xs font-montserrat font-medium cursor-not-allowed select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                      Email Address (For Tax Invoices & Order Updates)
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 text-xs font-open-sans focus:outline-none focus:border-[#0066cc] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                      Default Doorstep Shipping Address
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={profileForm.shippingAddress}
                        onChange={(e) => setProfileForm({ ...profileForm, shippingAddress: e.target.value })}
                        placeholder="House/Flat No., Building Name, Street, Landmark..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs font-open-sans focus:outline-none focus:border-[#0066cc] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* City, State, Pincode in 3 columns / mobile 2 cols */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs font-open-sans focus:outline-none focus:border-[#0066cc] focus:bg-white"
                        required
                        placeholder="e.g. Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                        State
                      </label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs font-open-sans focus:outline-none focus:border-[#0066cc] focus:bg-white"
                        required
                        placeholder="e.g. Maharashtra"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                        6-Digit Pincode
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs font-montserrat font-bold tracking-wider focus:outline-none focus:border-[#0066cc] focus:bg-white"
                        required
                        placeholder="e.g. 400001"
                      />
                    </div>
                  </div>

                  {/* Company GSTIN */}
                  <div>
                    <label className="block uppercase font-bold text-slate-500 font-montserrat mb-1 text-[10px]">
                      Company GSTIN (Optional - Claim 18% Input Tax Credit)
                    </label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. 27AAMCA1234F1Z8"
                        maxLength={15}
                        value={profileForm.gstNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, gstNumber: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 text-xs font-montserrat uppercase tracking-wider focus:outline-none focus:border-[#0066cc] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-montserrat cursor-pointer transition-colors text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-bold font-montserrat uppercase tracking-wider cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* CONTACT & PERSONAL INFO CARD */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-montserrat flex items-center gap-1.5">
                      <User size={13} className="text-[#0066cc]" />
                      Primary Account Details
                    </span>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="text-[11px] font-bold font-montserrat text-[#0066cc] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Full Name Row */}
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
                      <span className="text-slate-500 font-open-sans">Full Name</span>
                      <span className="font-montserrat font-semibold text-slate-900">
                        {profile?.fullName || user.fullName || "Customer"}
                      </span>
                    </div>

                    {/* Primary Mobile Row */}
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
                      <span className="text-slate-500 font-open-sans">Mobile Number</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-montserrat font-bold text-slate-900">+91 {user.phone}</span>
                        <span className="text-[10px] font-bold font-montserrat bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Email Row */}
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
                      <span className="text-slate-500 font-open-sans">Email Address</span>
                      {profile?.email ? (
                        <span className="font-open-sans text-slate-800">{profile.email}</span>
                      ) : (
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="text-[11px] font-montserrat font-medium text-[#0066cc] hover:underline cursor-pointer"
                        >
                          + Add for GST invoice
                        </button>
                      )}
                    </div>

                    {/* GSTIN Row */}
                    <div className="flex items-center justify-between py-1.5 text-xs">
                      <span className="text-slate-500 font-open-sans">Business GSTIN</span>
                      {profile?.gstNumber ? (
                        <span className="font-montserrat font-bold text-[#0066cc] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {profile.gstNumber}
                        </span>
                      ) : (
                        <button
                          onClick={() => setEditingProfile(true)}
                          className="text-[11px] font-montserrat font-medium text-slate-500 hover:text-[#0066cc] cursor-pointer"
                        >
                          + Add for 18% Input Credit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SAVED DELIVERY ADDRESS CARD */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-montserrat flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#0066cc]" />
                      Saved Delivery Address
                    </span>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="text-[11px] font-bold font-montserrat text-[#0066cc] hover:underline cursor-pointer"
                    >
                      {profile?.shippingAddress ? "Change" : "+ Add"}
                    </button>
                  </div>

                  {profile?.shippingAddress ? (
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0066cc] flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={15} />
                      </div>
                      <div className="text-xs leading-relaxed">
                        <div className="font-bold text-slate-900 font-montserrat">
                          {profile.fullName || displayName}
                        </div>
                        <div className="text-slate-700 font-open-sans mt-0.5">
                          {profile.shippingAddress}
                        </div>
                        <div className="text-slate-600 font-open-sans mt-0.5">
                          {profile.city}, {profile.state} -{" "}
                          <strong className="text-slate-900 font-montserrat">{profile.pincode}</strong>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold font-montserrat text-emerald-700">
                          <CheckCircle size={10} />
                          <span>Default Doorstep Address for Delhivery Couriers</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
                      <MapPin size={22} className="text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs text-slate-600 font-open-sans">
                        No default shipping address saved yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(true)}
                        className="mt-2 text-xs font-bold font-montserrat text-[#0066cc] hover:underline cursor-pointer"
                      >
                        + Add Doorstep Delivery Address
                      </button>
                    </div>
                  )}
                </div>

                {/* SERVICES & FAST ACTIONS HUB */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-montserrat block border-b border-slate-100 pb-2">
                    Customer Services & Ownership Hub
                  </span>

                  <div className="space-y-1.5">
                    {/* 1-Year Warranty Certificate Shortcut */}
                    <button
                      type="button"
                      onClick={() => {
                        if (orders.length > 0) {
                          setSelectedOrderForWarranty(orders[0]);
                        } else {
                          setActiveTab("support");
                        }
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                          <Award size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold font-montserrat text-slate-900 block group-hover:text-[#0066cc]">
                            Official 1-Year Warranty Certificate
                          </span>
                          <span className="text-[10px] text-slate-500 font-open-sans block">
                            Full AMEC coverage for motor, pump & 25V battery
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Tax Invoices Shortcut */}
                    <button
                      type="button"
                      onClick={() => {
                        if (orders.length > 0) {
                          setSelectedOrderForInvoice(orders[0]);
                        } else {
                          setActiveTab("orders");
                        }
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0066cc] flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold font-montserrat text-slate-900 block group-hover:text-[#0066cc]">
                            GST Tax Invoices
                          </span>
                          <span className="text-[10px] text-slate-500 font-open-sans block">
                            Download official billing invoices with 18% GST credit
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* File Replacement Claim Shortcut */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderForDispute(orders[0] || null);
                        setIsDisputeModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/50 border border-slate-100 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <ShieldAlert size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold font-montserrat text-slate-900 block group-hover:text-rose-600">
                            Doorstep Claim / Replacement
                          </span>
                          <span className="text-[10px] text-slate-500 font-open-sans block">
                            Fast 24-hour dispatch for damaged or missing parts
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* WhatsApp VIP Desk Shortcut */}
                    <button
                      type="button"
                      onClick={() => {
                        const text = encodeURIComponent(
                          `Hello AMEC Team, I am customer ${displayName} (+91 ${user.phone}). Need technical assistance with my Aquaforce 1400.`
                        );
                        window.open(`https://wa.me/917387588963?text=${text}`, "_blank");
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/50 border border-slate-100 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold font-montserrat text-slate-900 block group-hover:text-emerald-700">
                            WhatsApp VIP Concierge
                          </span>
                          <span className="text-[10px] text-slate-500 font-open-sans block">
                            Direct technical support with senior engineers
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>

                {/* ACCOUNT ACTIONS & LOGOUT CARD */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-open-sans">
                    <span>Current Session</span>
                    <span className="font-montserrat font-medium text-slate-700">
                      +91 {user.phone}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold font-montserrat uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <LogOut size={14} />
                    <span>Log Out of My Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-[11px] text-slate-500 font-open-sans mt-6 px-4">
        &copy; 2026 PROMEC INDIA â€¢ AMEC MOBILITY PRIVATE LIMITED â€¢ Nagpur, Maharashtra, India
      </footer>

      {/* Modals */}
      <OrderTrackingModal
        order={selectedOrderForTracking}
        isOpen={Boolean(selectedOrderForTracking)}
        onClose={() => setSelectedOrderForTracking(null)}
        onFileDispute={(ord) => {
          setSelectedOrderForDispute(ord);
          setIsDisputeModalOpen(true);
        }}
      />

      <DisputeModal
        orders={orders}
        preSelectedOrder={selectedOrderForDispute}
        customerPhone={user.phone}
        customerName={user.fullName || "Customer"}
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onDisputeCreated={(newDispute) => {
          setDisputes((prev) => [newDispute, ...prev]);
          setActiveTab("disputes");
        }}
      />

      <InvoiceModal
        order={selectedOrderForInvoice}
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
      />

      <WarrantyCardModal
        order={selectedOrderForWarranty}
        isOpen={Boolean(selectedOrderForWarranty)}
        onClose={() => setSelectedOrderForWarranty(null)}
      />

      <SupportModal
        orders={orders}
        customerPhone={user.phone}
        customerName={user.fullName || "Customer"}
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0066cc] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AccountDashboardContent />
    </Suspense>
  );
}
