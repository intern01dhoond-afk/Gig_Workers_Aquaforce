"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import ScrollReveal from "./ScrollReveal";

export default function CTABanner() {
  const { openModal } = useOrderModal();

  return (
    <section className="w-full bg-white flex flex-col items-center self-stretch py-6 sm:py-12 lg:py-16 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="w-full max-w-[1440px] mx-auto flex justify-center">
        {/* Rounded CTA Card */}
        <ScrollReveal
          direction="zoom"
          duration={0.7}
          className="relative w-full max-w-[1280px] rounded-[22px] sm:rounded-[24px] overflow-hidden shadow-[0_20px_45px_-12px_rgba(15,23,42,0.22)]"
        >
          {/* ========================================================= */}
          {/* MOBILE VIEW (sm:hidden): Clean Portrait Card with Content */}
          {/* ========================================================= */}
          <div className="sm:hidden relative w-full aspect-[3/4] max-w-[420px] mx-auto overflow-hidden flex flex-col justify-end p-5 xs:p-6 pb-5 xs:pb-6 rounded-[22px]">
            {/* Background Yellow Machine Graphic */}
            <Image
              src="/aquaforceforautocare/images/mobile-banner-2-y.0.webp"
              alt="Aquaforce 1400 Portable Pressure Washer"
              fill
              priority
              quality={100}
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover object-top z-0"
            />

            {/* Soft Blue Vignette to seamlessly blend with content */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#02173f]/95 via-[#02173f]/35 to-transparent z-0 pointer-events-none" />

            {/* Mobile Card Content */}
            <div className="relative z-10 w-full flex flex-col items-start text-left">
              <h2 className="text-[20px] xs:text-[22px] font-bold font-montserrat text-white leading-[1.2] tracking-tight drop-shadow-sm">
                Ready to Make Vehicle
                <br />
                Washing Easier?
              </h2>

              <p className="text-white/90 text-xs xs:text-[13px] font-normal font-open-sans mt-1.5 drop-shadow-xs">
                Go Cordless. Go Portable. Go Aquaforce®.
              </p>

              <button
                type="button"
                onClick={openModal}
                className="mt-4 w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0062ff] font-montserrat text-xs xs:text-[13px] font-extrabold uppercase tracking-wider py-3.5 rounded-[10px] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 text-[#0062ff] stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEW (hidden sm:flex): Wide Landscape Banner */}
          {/* ========================================================= */}
          <div className="hidden sm:flex relative w-full min-h-[300px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] items-center">
            {/* Desktop Background Image */}
            <Image
              src="/aquaforceforautocare/images/pressure-washer-banner-5b.webp"
              alt="Aquaforce 1400 Portable Pressure Washer"
              fill
              priority
              quality={100}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center z-0"
            />

            {/* Desktop Card Content (Positioned on the Right Side) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-start p-8 md:p-10 lg:p-12 sm:pl-[48%] md:pl-[50%] lg:pl-[52%] lg:pr-10 xl:pl-[52%]">
              <h2 className="text-2xl md:text-3xl lg:text-[36px] xl:text-[40px] font-bold font-montserrat text-white leading-[1.18] tracking-tight drop-shadow-sm">
                Ready to Make Vehicle
                <br />
                Washing Easier?
              </h2>

              <p className="text-white/90 text-sm md:text-base lg:text-[16px] font-normal font-open-sans mt-2.5 sm:mt-3 drop-shadow-xs">
                Go Cordless. Go Portable. Go Aquaforce®.
              </p>

              <button
                type="button"
                onClick={openModal}
                className="mt-5 lg:mt-7 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0062ff] font-montserrat text-xs sm:text-sm font-bold tracking-wider uppercase px-7 py-3.5 rounded-[8px] shadow-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 text-[#0062ff] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
