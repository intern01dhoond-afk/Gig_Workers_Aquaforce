"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import ScrollReveal from "./ScrollReveal";

export default function CTABanner() {
  const { openModal } = useOrderModal();

  return (
    <section className="relative w-full h-[580px] xs:h-[640px] sm:h-[440px] min-h-[580px] xs:min-h-[640px] sm:min-h-[440px] overflow-hidden flex items-end sm:items-center">
      {/* Mobile Background Image */}
      <div className="sm:hidden absolute inset-0 z-0">
        <Image
          src="/aquaforceforgigworkers/images/cta-banner-bg-mobile.webp"
          alt="Aquaforce Delivery Rider on Road"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Soft bottom contrast gradient for crystal clear text readability over asphalt */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-45% to-transparent pointer-events-none" />
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 via-45% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Content Container aligned within standard page max-width */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pb-8 xs:pb-10 sm:pb-0 py-0 sm:py-16 md:py-20 flex flex-col justify-end sm:justify-center items-center sm:items-start text-center sm:text-left">
        <ScrollReveal direction="up" className="w-full max-w-[380px] sm:max-w-[560px] lg:max-w-[620px] flex flex-col items-center sm:items-start">
          <h2 className="text-3xl xs:text-[34px] sm:text-4xl md:text-5xl lg:text-[54px] font-bold font-montserrat text-white tracking-tight leading-[1.12]">
            Your Services. Your
            <br />
            Business.
          </h2>

          <p className="text-white/95 text-xs xs:text-sm sm:text-base lg:text-lg font-normal font-montserrat mt-2.5 sm:mt-4 leading-relaxed max-w-[320px] xs:max-w-[360px] sm:max-w-[480px]">
            Start your doorstep cleaning business with AquaForce by Promec.
          </p>

          <button
            type="button"
            onClick={openModal}
            className="w-full sm:w-auto mt-5 sm:mt-8 inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0062ff] font-montserrat text-xs xs:text-sm font-bold tracking-wider uppercase px-8 py-3.5 sm:py-3.5 rounded-[8px] shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4 text-[#0062ff] stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
