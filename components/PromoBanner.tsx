"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";

export default function PromoBanner() {
  const { openModal } = useOrderModal();

  return (
    <section id="order" className="relative min-h-[460px] lg:min-h-[520px] flex items-center overflow-hidden bg-slate-900">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/aquaforceforautocare/images/banner-desktop-1.webp"
          alt="Aquaforce 1400 promotional launch offer"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft Left Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent lg:w-3/5" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[80px] w-full py-16 sm:py-20">
        <div className="max-w-lg">
          {/* Red Launch Badge */}
          <div className="inline-block bg-[#e53e3e] text-white font-montserrat text-[11px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded shadow-sm">
            PROMOTIONAL LAUNCH OFFER
          </div>

          {/* Subtitle */}
          <p className="text-white font-open-sans font-bold text-lg sm:text-xl mt-4">
            Get Aquaforce® 1400 at
          </p>

          {/* Huge 26% OFF Headline */}
          <h2 className="text-white font-montserrat text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none my-2 drop-shadow-md">
            26% OFF
          </h2>

          {/* Pricing Row */}
          <div className="text-white font-open-sans text-sm sm:text-base font-bold flex items-center gap-2 mt-3">
            <span className="text-white/65 font-normal">
              MRP: <span className="line-through">₹60,799</span>
            </span>
            <span className="text-white font-extrabold ml-1">
              Offer Price: ₹44,991
            </span>
          </div>

          {/* CTA Button */}
          <div className="mt-6 sm:mt-7">
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-[#0066cc] hover:bg-[#0052b3] text-white font-montserrat text-xs sm:text-sm font-black tracking-wider uppercase px-7 py-3.5 rounded-[4px] shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Micro Footer Note */}
          <p className="text-white/70 font-open-sans text-xs mt-3">
            Limited-period promotional offer.
          </p>
        </div>
      </div>
    </section>
  );
}
