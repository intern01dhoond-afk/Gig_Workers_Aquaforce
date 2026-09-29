"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import ScrollReveal from "./ScrollReveal";

export default function CTABanner() {
  const { openModal } = useOrderModal();

  return (
    <section className="relative w-full h-[620px] xs:h-[660px] sm:h-[480px] md:h-[520px] lg:h-[550px] min-h-[620px] xs:min-h-[660px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[550px] overflow-hidden flex items-end sm:items-center">
      {/* Mobile Background Image */}
      <div className="sm:hidden absolute inset-0 z-0">
        <Image
          src="/aquaforceforgigworkers/images/cta-banner-bg-mobile.webp"
          alt="Aquaforce Delivery Rider on Road"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Soft bottom contrast gradient for crystal clear text readability over asphalt */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-30% to-transparent pointer-events-none" />
      </div>

      {/* Desktop Background Image */}
      <div className="hidden sm:block absolute inset-0 z-0">
        <Image
          src="/aquaforceforgigworkers/images/cta-banner-bg.webp"
          alt="Aquaforce Delivery Rider on Road"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] lg:object-center"
        />
        {/* Dark gradient overlay on left for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-35% to-transparent to-55% pointer-events-none" />
      </div>

      {/* Content Container aligned within standard page max-width */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pb-8 xs:pb-10 sm:pb-0 py-0 sm:py-8 md:py-10 flex flex-col justify-end sm:justify-center items-center sm:items-start text-center sm:text-left">
        <ScrollReveal direction="up" className="w-full max-w-[340px] sm:max-w-[560px] lg:max-w-[680px] flex flex-col items-center sm:items-start">
          <h2 className="text-white font-bold font-montserrat text-3xl xs:text-4xl sm:text-[40px] md:text-[46px] lg:text-[52px] xl:text-[56px] tracking-tight leading-[1.08] text-center sm:text-left">
            <span className="block whitespace-nowrap">Your Services.</span>
            <span className="block whitespace-nowrap">Your Business.</span>
          </h2>

          <p className="text-white/90 text-[13px] xs:text-[14px] sm:text-base lg:text-[17px] font-normal font-montserrat mt-3 sm:mt-4 leading-relaxed max-w-[480px] text-center sm:text-left">
            Start your doorstep cleaning business with AquaForce
            <br className="hidden sm:inline" /> by Promec.
          </p>

          <button
            type="button"
            onClick={openModal}
            className="w-full sm:w-auto mt-6 sm:mt-7 inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0066cc] font-montserrat text-xs sm:text-[13px] font-bold tracking-wider uppercase px-7 sm:px-8 py-3 sm:py-3.5 rounded-[6px] shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4 text-[#0066cc] stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
