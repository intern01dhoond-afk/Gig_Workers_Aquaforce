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
    <section className="relative w-full aspect-[4/5] xs:aspect-[1/1] sm:aspect-[16/10] md:aspect-[16/9] min-h-[540px] flex items-center overflow-hidden bg-black py-8 sm:py-12 lg:py-16">
      {/* Background Rider Image */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
        {/* Mobile Background Image */}
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/aquaforceforautocare/images/doorstep-rider-bg-mobile.webp"
            alt="Cleaning professional riding motorcycle with Aquaforce gear"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle gradient to ensure legibility on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 via-50% to-black/30" />
        </div>

        {/* Desktop Background Image */}
        <div className="hidden sm:block relative w-full h-full sm:translate-x-[12%] md:translate-x-[15%] lg:translate-x-[18%] sm:scale-[1.15] md:scale-[1.18] lg:scale-[1.22] origin-bottom">
          <Image
            src="/aquaforceforautocare/images/doorstep-rider-bg.webp"
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

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
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
