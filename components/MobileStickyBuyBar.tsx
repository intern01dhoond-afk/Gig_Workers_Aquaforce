"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";

export default function MobileStickyBuyBar() {
  const { openModal, isOpen } = useOrderModal();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when user scrolls down from top fold (> 220px)
      if (window.scrollY > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Avoid overlaying modal when open
  if (isOpen) return null;

  return (
    <aside
      aria-label="Sticky mobile purchase bar"
      style={{
        paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom, 0px))",
      }}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-4 pt-3 transition-[transform,opacity] duration-300 ease-in-out sm:hidden ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Downward solid background extension to block any bounce or viewport gap */}
      <div className="absolute top-full left-0 right-0 h-48 bg-white pointer-events-none" />

      <div className="flex items-center justify-between gap-3 max-w-md mx-auto relative z-10">
        {/* Left: Price and Discount */}
        <div className="flex items-center gap-2 font-open-sans">
          <span className="text-[18px] xs:text-[20px] font-bold font-montserrat text-[#0F1729] tracking-tight leading-none">
            ₹44,991
          </span>
          <span className="text-[12px] xs:text-[13px] text-slate-400 line-through font-medium leading-none">
            ₹60,799
          </span>
          <span className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded leading-none">
            26% OFF
          </span>
        </div>

        {/* Right: Buy Now CTA Button */}
        <button
          type="button"
          onClick={openModal}
          className="bg-[#0066CC] hover:bg-[#0055b3] active:bg-[#004799] text-white font-montserrat text-xs xs:text-sm font-bold px-4 xs:px-5 py-2.5 xs:py-3 rounded-[10px] shadow-md shadow-blue-600/25 inline-flex items-center gap-1.5 uppercase tracking-wide shrink-0 transition-all active:scale-95 cursor-pointer"
        >
          <span>SHOP NOW</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
}
