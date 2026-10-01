"use client";

import { useState } from "react";
import { X, Phone, MessageSquare, Mail, Clock, CheckCircle2, ChevronDown, Wrench, ShieldCheck, Send } from "lucide-react";
import { PromecOrder } from "@/lib/orderStore";
import { TicketCategory } from "@/lib/ticketStore";

interface SupportModalProps {
  orders: PromecOrder[];
  customerPhone: string;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: any) => void;
}

export default function SupportModal({
  orders,
  customerPhone,
  customerName,
  isOpen,
  onClose,
  onTicketCreated,
}: SupportModalProps) {
  const [activeTab, setActiveTab] = useState<"quick" | "callback" | "faq">("quick");
  const [category, setCategory] = useState<TicketCategory>("callback_request");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [preferredTime, setPreferredTime] = useState("Immediate (Within 30 mins)");
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "");
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");

  if (!isOpen) return null;

  const latestOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello AMEC Aquaforce Support Team,\nMy Name: ${customerName}\nPhone: ${customerPhone}\n${
        latestOrder ? `Order ID: ${latestOrder.id}\n` : ""
      }I need assistance with my Aquaforce Cordless Washer.`
    );
    window.open(`https://wa.me/917387588963?text=${text}`, "_blank");
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/aquaforceforgigworkers/api/account/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: customerPhone,
          fullName: customerName,
          orderId: selectedOrderId || latestOrder?.id,
          category,
          subject,
          message,
          priority: "high",
          callbackRequested: true,
          preferredCallbackTime: preferredTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedMessage(
          `Technician callback requested (#${data.ticketId}). An AMEC specialist will call you on +91 ${customerPhone} within the requested time.`
        );
        if (onTicketCreated) onTicketCreated(data.ticket);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-open-sans">
      <div className="relative w-full max-w-[620px] max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 font-open-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066cc]">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-montserrat text-[#0F1729]">
                Customer Care & Concierge
              </h3>
              <p className="text-xs text-slate-500 font-open-sans">
                Direct hotline & instant resolution desk for Aquaforce owners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-5 pt-2 gap-2 text-xs font-semibold font-montserrat">
          <button
            onClick={() => { setActiveTab("quick"); setSubmittedMessage(""); }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "quick"
                ? "border-[#0066cc] text-[#0066cc] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Fast Channels
          </button>
          <button
            onClick={() => { setActiveTab("callback"); setSubmittedMessage(""); }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "callback"
                ? "border-[#0066cc] text-[#0066cc] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Request Technician Call
          </button>
          <button
            onClick={() => { setActiveTab("faq"); setSubmittedMessage(""); }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "faq"
                ? "border-[#0066cc] text-[#0066cc] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            1-Min Quick Fixes
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm bg-white font-open-sans">
          {activeTab === "quick" && (
            <div className="space-y-4">
              {/* WhatsApp VIP Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="text-sm font-bold text-slate-900 font-montserrat">
                      WhatsApp VIP Concierge
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-open-sans">
                    Chat directly with an AMEC technical expert. Average response under 3 minutes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa51] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 font-montserrat shadow-md shadow-emerald-500/20"
                >
                  <MessageSquare size={15} />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

              {/* Direct Helpline */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-montserrat">
                    Direct Voice Helpline
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-open-sans">
                    Mon - Sat (9:30 AM – 7:30 PM IST)
                  </p>
                  <span className="text-base font-bold font-montserrat text-[#0066cc] mt-1 block tracking-wide">
                    +91 7387588963
                  </span>
                </div>
                <a
                  href="tel:+917387588963"
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 font-montserrat border border-slate-200 shadow-2xs"
                >
                  <Phone size={15} />
                  <span>Call Support Now</span>
                </a>
              </div>

              {/* Direct Email */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-montserrat">
                    Official Care Email
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-open-sans">
                    For corporate, GST invoicing, or detailed claims
                  </p>
                  <span className="text-xs font-montserrat font-medium text-slate-700 mt-1 block">
                    promec.india@gmail.com
                  </span>
                </div>
                <a
                  href={`mailto:promec.india@gmail.com?subject=AMEC Care Support Request - Phone: ${customerPhone}`}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 font-montserrat border border-slate-200 shadow-2xs"
                >
                  <Mail size={15} />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === "callback" && (
            <div>
              {submittedMessage ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 size={30} />
                  </div>
                  <h4 className="text-lg font-bold font-montserrat text-[#0F1729]">
                    Callback Scheduled!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-open-sans">
                    {submittedMessage}
                  </p>
                  <button
                    onClick={() => setSubmittedMessage("")}
                    className="px-4 py-2 bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-bold font-montserrat rounded-lg cursor-pointer shadow-xs"
                  >
                    Request Another Callback
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-4 font-open-sans">
                  <p className="text-xs text-slate-600 leading-relaxed font-open-sans">
                    Prefer talking directly to our lead technician? We will call your registered number <strong className="text-slate-900 font-montserrat">+91 {customerPhone}</strong> at your chosen time.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-montserrat">
                        Topic of Assistance
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TicketCategory)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066cc] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-open-sans shadow-2xs"
                      >
                        <option value="technical_support">Machine & Pressure Diagnostic</option>
                        <option value="warranty_claim">Warranty & Part Replacement</option>
                        <option value="order_tracking">Delivery & Courier Assistance</option>
                        <option value="general_inquiry">General Help / Usage Tips</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-montserrat">
                        Preferred Time Slot
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066cc] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-open-sans shadow-2xs"
                      >
                        <option value="Immediate (Within 30 mins)">Immediate (Within 30 mins)</option>
                        <option value="Today Afternoon (2:00 PM – 5:00 PM)">Today Afternoon (2:00 PM – 5:00 PM)</option>
                        <option value="Today Evening (5:00 PM – 8:00 PM)">Today Evening (5:00 PM – 8:00 PM)</option>
                        <option value="Tomorrow Morning (10:00 AM – 1:00 PM)">Tomorrow Morning (10:00 AM – 1:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-montserrat">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Need assistance setting up foam cannon or priming pump"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066cc] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-open-sans shadow-2xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-montserrat">
                      Brief Note
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what you would like the technician to prepare before calling you..."
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0066cc] rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none leading-relaxed font-open-sans shadow-2xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#0066cc] hover:bg-[#0052b3] text-white font-bold font-montserrat uppercase tracking-wider text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Scheduling Call...</span>
                    ) : (
                      <>
                        <Clock size={14} />
                        <span>Schedule Priority Callback</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-3 font-open-sans">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2 font-montserrat">
                  <Wrench size={14} className="text-[#0066cc]" />
                  Washer not building high pressure? (Air Lock Bleeding)
                </h5>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-open-sans">
                  When first using the machine with a bucket hose, air may get trapped in the intake. Remove the nozzle tip, submerge the filter fully in water, and hold the trigger down for 10-15 seconds until a solid water stream flows. Then click the nozzle back on!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2 font-montserrat">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Smart Battery Charger LED Indicators
                </h5>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-open-sans">
                  <strong>Solid RED:</strong> Battery pack is charging.<br />
                  <strong>Solid GREEN:</strong> Fully charged & ready for up to 45 mins of continuous high-pressure washing.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2 font-montserrat">
                  <MessageSquare size={14} className="text-amber-600" />
                  Snow Foam Cannon Dilution Ratio
                </h5>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-open-sans">
                  For thick, shaving-cream-like foam, mix 100ml car wash shampoo with 400ml warm water inside the foam bottle. Turn the top dial clockwise for maximum foam thickness.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
