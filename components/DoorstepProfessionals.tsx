"use client";

import Image from "next/image";
import { Zap, Briefcase, Droplets, Clock, BatteryCharging, Layers } from "lucide-react";
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
    icon: Droplets,
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
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-black py-16 sm:py-20 lg:py-24">
      {/* Background Rider Image */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
        <Image
          src="/aquaforceforautocare/images/doorstep-rider-bg.png"
          alt="Cleaning professional riding motorcycle with Aquaforce gear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-center"
        />
        {/* Dark directional gradients to ensure high contrast and text readability on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 via-50% to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-10 lg:px-[80px]">
        <div className="max-w-[580px]">
          {/* Pill Badge */}
          <ScrollReveal direction="up">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-white shadow-xs mb-5 select-none">
              BUILT FOR DOORSTEP PROFESSIONALS
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-medium font-montserrat text-white tracking-tight leading-[1.14] mb-10 sm:mb-12">
              Made for Cleaning
              <br />
              Professionals on the Move
            </h2>
          </ScrollReveal>

          {/* 2-Column Specifications Grid with Icons */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-7 sm:gap-y-9 max-w-[480px]">
              {SPECS.map((spec) => {
                const IconComponent = spec.icon;
                return (
                  <div key={spec.label} className="flex flex-col items-start">
                    <IconComponent className="w-5 h-5 text-white/90 mb-2 stroke-[1.75]" />
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-white/60 font-open-sans uppercase">
                      {spec.label}
                    </span>
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-white font-montserrat mt-0.5">
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
