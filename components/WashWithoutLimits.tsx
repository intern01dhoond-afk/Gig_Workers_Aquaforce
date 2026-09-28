"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import ScrollReveal, { ScrollRevealStagger, ScrollRevealItem } from "./ScrollReveal";

export default function WashWithoutLimits() {
  const { openModal } = useOrderModal();

  return (
    <section className="relative overflow-hidden bg-white w-full">
      {/* ========================================================= */}
      {/* MOBILE LAYOUT (< md) - Matches Exact Attached Design */}
      {/* ========================================================= */}
      <div className="md:hidden flex flex-col items-center text-center py-8 xs:py-10 px-3.5 xs:px-4 w-full">
        {/* Title & Subtitle */}
        <ScrollReveal direction="up">
          <h2 className="text-[#0e1726] font-montserrat text-2xl xs:text-[28px] sm:text-[32px] font-medium uppercase tracking-tight leading-[1.1]">
            WASH WITHOUT
            <br />
            LIMITS
          </h2>

          {/* Blue Accent Underline */}
          <div className="w-12 h-[2.5px] bg-[#0066cc] mx-auto mt-2 mb-2 rounded-full" />

          {/* Subtitle */}
          <p className="text-[#8892a0] font-open-sans text-[11px] xs:text-xs font-bold tracking-[0.2em] uppercase mb-4 xs:mb-6">
            AQUAFORCE® 1400
          </p>
        </ScrollReveal>

        {/* Two Images Side-by-Side (2 Columns) */}
        <ScrollReveal direction="zoom" delay={0.1} className="grid grid-cols-2 gap-2.5 xs:gap-3 w-full max-w-md mx-auto mb-5 xs:mb-6">
          {/* Left Portrait Image: Car Interior Vacuum / Detailing */}
          <div className="relative w-full h-[185px] xs:h-[215px] sm:h-[290px] rounded-[14px] xs:rounded-[18px] overflow-hidden shadow-sm">
            <Image
              src="/aquaforceforgigworkers/images/Remainig%20images/left.webp"
              alt="Aquaforce 1400 cordless vehicle detailing"
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Portrait Image: Car Exterior Washing */}
          <div className="relative w-full h-[185px] xs:h-[215px] sm:h-[290px] rounded-[14px] xs:rounded-[18px] overflow-hidden shadow-sm">
            <Image
              src="/aquaforceforgigworkers/images/Remainig%20images/right.webp"
              alt="Aquaforce 1400 outdoor car detailing"
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </ScrollReveal>

        {/* 5 Feature Badges with Flex Wrap */}
        <ScrollReveal direction="up" delay={0.15} className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 w-full max-w-xs font-open-sans">
          <span className="border-[1.5px] border-[#0e1726] rounded-[6px] px-2.5 xs:px-3 py-1 text-[#0e1726] text-[10px] xs:text-[11px] font-bold uppercase tracking-wider bg-transparent">
            NO SOCKET
          </span>
          <span className="border-[1.5px] border-[#0e1726] rounded-[6px] px-2.5 xs:px-3 py-1 text-[#0e1726] text-[10px] xs:text-[11px] font-bold uppercase tracking-wider bg-transparent">
            NO CABLES
          </span>
          <span className="border-[1.5px] border-[#0e1726] rounded-[6px] px-2.5 xs:px-3 py-1 text-[#0e1726] text-[10px] xs:text-[11px] font-bold uppercase tracking-wider bg-transparent">
            JUST FILL
          </span>
          <span className="border-[1.5px] border-[#0e1726] rounded-[6px] px-3 xs:px-4 py-1 text-[#0e1726] text-[10px] xs:text-[11px] font-bold uppercase tracking-wider bg-transparent">
            SWITCH ON
          </span>
          <span className="border-[1.5px] border-[#0e1726] rounded-[6px] px-3 xs:px-4 py-1 text-[#0e1726] text-[10px] xs:text-[11px] font-bold uppercase tracking-wider bg-transparent">
            WASH
          </span>
        </ScrollReveal>

        {/* CTA Action Button */}
        <ScrollReveal direction="up" delay={0.2}>
          <button
            onClick={openModal}
            className="mt-5 xs:mt-6 inline-flex items-center justify-center gap-2 bg-[#0066cc] hover:bg-[#0052b3] active:bg-[#004799] text-white text-xs font-black tracking-wider uppercase px-7 py-3 rounded-[6px] shadow-md transition-all active:scale-95 cursor-pointer font-montserrat group"
          >
            <span>BUY NOW</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
          </button>
        </ScrollReveal>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (>= md) - Full-Bleed 3-Column Banner */}
      {/* ========================================================= */}
      <div className="hidden md:grid grid-cols-12 w-full min-h-[460px] lg:min-h-[520px]">
        {/* Left Column Image (Edge-to-Edge) */}
        <ScrollReveal direction="right" className="md:col-span-4 relative h-full min-h-[340px] overflow-hidden">
          <Image
            src="/aquaforceforgigworkers/images/Remainig%20images/left.webp"
            alt="Aquaforce 1400 cordless vehicle detailing"
            fill
            priority
            quality={100}
            sizes="(max-width: 1024px) 50vw, 35vw"
            className="object-cover object-center"
          />
        </ScrollReveal>

        {/* Center Column: Clean White Card with Title, Subtitle, Badges & CTA */}
        <ScrollReveal direction="zoom" delay={0.1} className="md:col-span-4 bg-white flex flex-col items-center justify-center text-center px-6 sm:px-8 py-12 md:py-8 z-10 shadow-xs">
          {/* Main Title */}
          <h2 className="text-[#0e1726] font-montserrat text-3xl sm:text-4xl lg:text-[40px] font-medium uppercase tracking-tight leading-[1.08]">
            WASH WITHOUT
            <br />
            LIMITS
          </h2>

          {/* Blue Accent Underline */}
          <div className="w-14 h-[2px] bg-[#0066cc] my-3.5 rounded-full" />

          {/* Subtitle */}
          <p className="text-slate-500 font-open-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-6">
            AQUAFORCE® 1400
          </p>

          {/* 5 Feature Badges */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm font-open-sans">
            {/* Top Row Badges */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
              <span className="border border-slate-700/80 rounded-[6px] px-5 py-2 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-transparent">
                NO SOCKET
              </span>
              <span className="border border-slate-700/80 rounded-[6px] px-5 py-2 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-transparent">
                NO CABLES
              </span>
            </div>

            {/* Bottom Row Badges */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
              <span className="border border-slate-700/80 rounded-[6px] px-4 py-2 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-transparent">
                JUST FILL
              </span>
              <span className="border border-slate-700/80 rounded-[6px] px-4 py-2 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-transparent">
                SWITCH ON
              </span>
              <span className="border border-slate-700/80 rounded-[6px] px-5 py-2 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-transparent">
                WASH
              </span>
            </div>
          </div>

          {/* CTA Action Button */}
          <button
            onClick={openModal}
            className="mt-7 inline-flex items-center justify-center gap-2 bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-black tracking-wider uppercase px-7 py-3 rounded-[6px] shadow-md transition-all hover:scale-[1.03] active:scale-95 cursor-pointer font-montserrat group"
          >
            <span>BUY NOW</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
          </button>
        </ScrollReveal>

        {/* Right Column Image (Edge-to-Edge) */}
        <ScrollReveal direction="left" className="md:col-span-4 relative h-full min-h-[340px] overflow-hidden">
          <Image
            src="/aquaforceforgigworkers/images/Remainig%20images/right.webp"
            alt="Aquaforce 1400 outdoor car detailing"
            fill
            priority
            quality={100}
            sizes="(max-width: 1024px) 50vw, 35vw"
            className="object-cover object-center"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
