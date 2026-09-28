"use client";

import Image from "next/image";
import { Zap, Briefcase, Droplet, Clock, BatteryCharging, Layers } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const SPECS = [
  {
    icon: Zap,
    label: "POWER",
    value: "Cordless",
  },
  {
    icon: Briefcase,
    label: "MOBILITY",
    value: "Portable",
  },
  {
    icon: Droplet,
    label: "WATER VOLUME",
    value: "18L Water Tank",
  },
  {
    icon: Clock,
    label: "BATTERY LIFE",
    value: "3 Hours Runtime",
  },
  {
    icon: BatteryCharging,
    label: "CHARGE TIME",
    value: "90 Min Charging",
  },
  {
    icon: Layers,
    label: "ORGANISATION",
    value: "Professional Setup",
  },
];

export default function DoorstepProfessionals() {
  return (
    <section className="relative w-full min-h-[760px] xs:min-h-[840px] sm:min-h-[540px] sm:aspect-[16/10] md:aspect-[16/9] flex items-center overflow-hidden bg-black py-0 sm:py-12 lg:py-16">
      {/* Background Rider Image */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
        {/* Mobile Background Image */}
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/aquaforceforgigworkers/images/doorstep-rider-bg-mobile.webp"
            alt="Cleaning professional riding motorcycle with Aquaforce gear"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle top & bottom gradients for contrast matching reference screenshot */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[380px] bg-gradient-to-t from-black/95 via-black/75 via-45% to-transparent pointer-events-none" />
        </div>

        {/* Desktop Background Image */}
        <div className="hidden sm:block relative w-full h-full sm:translate-x-[12%] md:translate-x-[15%] lg:translate-x-[18%] sm:scale-[1.15] md:scale-[1.18] lg:scale-[1.22] origin-bottom">
          <Image
            src="/aquaforceforgigworkers/images/doorstep-rider-bg.webp"
            alt="Cleaning professional riding motorcycle with Aquaforce gear"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_center] sm:object-center"
          />
        </div>
        {/* Soft directional left gradient for desktop: dark behind text, completely transparent before the rider */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black via-black/80 via-35% to-transparent to-58% pointer-events-none" />
      </div>

      {/* ── MOBILE LAYOUT (Exactly matching media_1790592584990.png) ── */}
      <div className="sm:hidden relative z-10 w-full h-full min-h-[760px] xs:min-h-[840px] flex flex-col justify-between items-center px-4 py-8 xs:py-10 text-center">
        {/* Top Heading Block */}
        <ScrollReveal direction="down" className="w-full flex flex-col items-center max-w-[340px] xs:max-w-[380px]">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-sky-400/40 bg-black/60 backdrop-blur-md font-open-sans text-[10px] xs:text-[11px] font-bold tracking-[0.16em] uppercase text-white shadow-xs select-none">
            BUILT FOR DOORSTEP PROFESSIONALS
          </div>

          {/* Headline */}
          <h2 className="text-[28px] xs:text-[32px] font-bold font-montserrat text-white tracking-tight leading-[1.18] mt-3 xs:mt-4">
            Made for Cleaning
            <br />
            Professionals on the
            <br />
            Move
          </h2>
        </ScrollReveal>

        {/* Bottom Specifications Grid */}
        <ScrollReveal direction="up" delay={0.1} className="w-full max-w-[340px] xs:max-w-[380px] mt-auto pt-6 pb-2">
          <div className="grid grid-cols-2 gap-x-6 xs:gap-x-10 gap-y-7 xs:gap-y-8 text-center">
            {SPECS.map((spec) => {
              const IconComponent = spec.icon;
              return (
                <div key={spec.label} className="flex flex-col items-center justify-center text-center">
                  <IconComponent className="w-6 h-6 text-white mb-2 stroke-[1.75]" />
                  <span className="text-[10px] xs:text-[11px] font-bold tracking-[0.18em] text-white/70 font-open-sans uppercase">
                    {spec.label}
                  </span>
                  <span className="text-base xs:text-lg font-bold text-white font-montserrat mt-0.5">
                    {spec.value}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      {/* ── DESKTOP LAYOUT (Preserved) ── */}
      <div className="hidden sm:flex relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="max-w-[520px] lg:max-w-[560px]">
          {/* Pill Badge */}
          <ScrollReveal direction="up">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-white shadow-xs mb-4 sm:mb-5 select-none">
              BUILT FOR DOORSTEP PROFESSIONALS
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-medium font-montserrat text-white tracking-tight leading-[1.14] mb-7 sm:mb-9 lg:mb-10">
              Made for Cleaning
              <br />
              Professionals on the Move
            </h2>
          </ScrollReveal>

          {/* 2-Column Specifications Grid with Icons */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 lg:gap-x-14 gap-y-5 sm:gap-y-7 max-w-[460px]">
              {SPECS.map((spec) => {
                const IconComponent = spec.icon;
                return (
                  <div key={spec.label} className="flex flex-col items-start">
                    <IconComponent className="w-5 h-5 text-white/90 mb-1.5 stroke-[1.75]" />
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-white/60 font-open-sans uppercase">
                      {spec.label}
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-white font-montserrat mt-0.5">
                      {spec.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
