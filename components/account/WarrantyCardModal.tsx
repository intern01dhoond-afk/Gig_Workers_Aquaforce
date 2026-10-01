"use client";

import Image from "next/image";
import { Award, ShieldCheck, X, CheckCircle2, Sparkles, Printer } from "lucide-react";
import { PromecOrder } from "@/lib/orderStore";

interface WarrantyCardModalProps {
  order: PromecOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WarrantyCardModal({
  order,
  isOpen,
  onClose,
}: WarrantyCardModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedPurchaseDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const expiryDate = new Date(order.createdAt);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const formattedExpiryDate = expiryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const certNumber = `WAR-${order.id.replace("PROMEC-ORD-", "")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-open-sans">
      <div className="relative w-full max-w-[620px] max-h-[92vh] bg-white border border-amber-300/80 rounded-2xl shadow-xl flex flex-col overflow-hidden text-slate-900 font-open-sans">
        {/* Controls Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-amber-100 bg-amber-50/60">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-montserrat">
              Official Warranty Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold font-montserrat rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer size={13} />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center relative print:text-black print:bg-white print:p-4 font-open-sans bg-gradient-to-b from-amber-50/30 via-white to-white">
          {/* Top Logo & Seal */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="bg-[#0b0c0e] px-3 py-1.5 rounded-lg flex items-center shadow-xs">
              <div className="relative w-[120px] h-[26px]">
                <Image
                  src="/aquaforceforgigworkers/images/promec-logo.svg"
                  alt="PROMEC"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-montserrat uppercase">
              <ShieldCheck size={14} />
              <span>Active • 365 Days</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-700 block font-montserrat">
              AMEC MOBILITY PRIVATE LIMITED
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-montserrat tracking-tight text-slate-900 mt-1">
              Certificate of Pan-India Warranty
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-open-sans">
              Certificate Ref: <strong className="font-montserrat font-bold text-slate-800 tracking-wide">{certNumber}</strong>
            </p>
          </div>

          {/* Machine & Owner Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-open-sans">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-montserrat">Registered Owner</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5 font-montserrat">{order.customer.fullName}</span>
              <span className="text-slate-500 font-open-sans text-[11px] font-medium">+91 {order.customer.phone}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-montserrat">Machine Model</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5 font-montserrat">
                Aquaforce® 1400 (100 Bar / 1400 PSI)
              </span>
              <span className="text-[#0066cc] text-[11px] font-montserrat block font-semibold">
                {order.items[0]?.variantName || "With Vacuum"} • {order.items[0]?.color || "Yellow"}
              </span>
            </div>

            <div className="border-t border-slate-200/80 pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-montserrat">Effective Date</span>
              <span className="font-bold text-slate-900 text-xs block mt-0.5 font-montserrat">{formattedPurchaseDate}</span>
            </div>

            <div className="border-t border-slate-200/80 pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-montserrat">Coverage Valid Until</span>
              <span className="font-bold text-amber-700 text-xs block mt-0.5 font-montserrat">{formattedExpiryDate}</span>
            </div>
          </div>

          {/* Protection Points */}
          <div className="text-left space-y-2.5 text-xs text-slate-700 font-open-sans">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-montserrat">
              Included Protections:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>100% Free High-Pressure Motor & Pump Mechanism Replacement</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>25V High-Discharge Lithium-ion Battery Cell Health Protection</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero Return Hassle: Direct doorstep courier dispatch of parts</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Priority WhatsApp video diagnostic access to Senior Engineers</span>
              </div>
            </div>
          </div>

          {/* Footer Seal */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-open-sans">
            <span>Linked Order: <strong className="font-montserrat font-bold text-slate-800 tracking-wide">{order.id}</strong></span>
            <span className="text-amber-700 font-bold font-montserrat flex items-center gap-1">
              <Sparkles size={12} />
              AMEC Mobility Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
