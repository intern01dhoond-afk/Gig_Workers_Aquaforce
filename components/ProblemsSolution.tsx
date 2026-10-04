"use client";

import React from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

// =========================================================================
// SVG ICONS FROM public/aquaforce_problem_solution_icons_svg
// =========================================================================

// 1. Header Badges
function ProblemXIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="28" fill="#ef4444" />
      <path d="M22 22l20 20M42 22L22 42" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function SolutionCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="28" fill="#22c55e" />
      <path d="M19 33l9 9 18-20" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 2. Problem Icons (stroke="currentColor")
function MachineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <rect x="14" y="19" width="36" height="34" rx="5" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M20 19v-6h24v6M23 28h18M23 36h18M23 44h11" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M18 24h28l4 31H14l4-31z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M23 24v-5c0-6 4-10 9-10s9 4 9 10v5" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M32 18v15l10 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FatigueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="39" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M35 22l-7 13 9 5-5 12M31 28l11 6 8-6M29 36l-10 8M34 52h-9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 3. Solution Icons (stroke="currentColor")
function CubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M32 7l23 13v24L32 57 9 44V20L32 7z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M9 20l23 13 23-13M32 33v24" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M53 10C31 11 14 21 13 38c-1 10 6 16 15 15 17-2 25-19 25-43z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M13 51c9-14 19-22 33-29" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M36 5L12 35h17l-4 24 27-35H35l1-19z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function SmileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="24" cy="27" r="2.5" fill="currentColor" />
      <circle cx="40" cy="27" r="2.5" fill="currentColor" />
      <path d="M21 37c3 7 19 10 23 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 4. Bottom Pills Icons
function DropletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M32 7S16 25 16 38a16 16 0 0032 0C48 25 32 7 32 7z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M25 40c1 4 4 6 8 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function BucketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M15 24h34l-3 32H18l-3-32z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M21 24c0-9 5-14 11-14s11 5 11 14M12 24h40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function FoamCannonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M18 49c0-10 5-18 14-23l10-5 7 12-11 6c-6 3-8 7-8 10H18z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M42 21l5-7M50 25l8-2M48 16l3-6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function SprayGunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M12 20h30v10H27v8l9 9-8 8-13-13V30h-3V20z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M42 23h12M42 27h9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function PressureWasherIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M13 38c0-10 8-18 18-18h11v10H31c-5 0-8 3-8 8v10h-10V38z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M42 20l10-8M47 26l12-2M49 34l10 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// Problem points exactly matching mockup
const PROBLEM_POINTS = [
  {
    icon: MachineIcon,
    title: "Multiple machines to carry",
    desc: "Vacuum, pressure washer, water bucket, foam cannon and more.",
  },
  {
    icon: BagIcon,
    title: "Heavy and bulky bags",
    desc: "More weight to carry and load at every location.",
  },
  {
    icon: ClockIcon,
    title: "More setup time",
    desc: "Takes time to unload, assemble and connect everything.",
  },
  {
    icon: FatigueIcon,
    title: "Physically tiring",
    desc: "Frequent lifting and carrying leads to fatigue.",
  },
];

// Solution points exactly matching mockup
const SOLUTION_POINTS = [
  {
    icon: CubeIcon,
    title: "All essential equipment in one",
    desc: "Wet & Dry Vacuum, Pressure Washer, Foam Cannon and more – in a single unit.",
  },
  {
    icon: LeafIcon,
    title: "Compact & lightweight",
    desc: "Easier to carry and load at every location.",
  },
  {
    icon: LightningIcon,
    title: "Quick setup",
    desc: "Start cleaning in minutes.",
  },
  {
    icon: SmileIcon,
    title: "Less physical effort",
    desc: "Reduces weight, setup time and fatigue.",
  },
];

// Bottom feature pills exactly matching mockup
const BOTTOM_PILLS = [
  {
    icon: DropletIcon,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
    label: "Wet & Dry Vacuum",
  },
  {
    icon: BucketIcon,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    label: "15L Water Bucket",
  },
  {
    icon: FoamCannonIcon,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    label: "Foam Cannon",
  },
  {
    icon: SprayGunIcon,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
    label: "Spray Gun & Nozzles",
  },
  {
    icon: PressureWasherIcon,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
    label: "Cordless Pressure Washer",
  },
];

export default function ProblemsSolution() {
  return (
    <section id="problems-solution" className="py-12 sm:py-16 lg:py-20 bg-white w-full overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-sky-600/40 font-montserrat text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-800 bg-white shadow-2xs mb-3 select-none">
            ADDRESSING CHALLENGES WITH
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold font-montserrat text-[#0F1729] tracking-tight">
            Problems &amp; Solution
          </h2>

          {/* Subtitle */}
          <div className="font-open-sans text-slate-600 text-[13.5px] sm:text-[15px] leading-relaxed max-w-2xl mx-auto mt-2.5">
            <p>From bulky setups to a compact, all-in-one cleaning solution.</p>
            <p>See how Aquaforce makes doorstep cleaning faster, easier and more efficient.</p>
          </div>
        </ScrollReveal>

        {/* 2-Column Comparison Layout with Center Gradient Block Arrow */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7 items-stretch max-w-[1320px] mx-auto">
          {/* ========================================================= */}
          {/* LEFT CARD: TRADITIONAL WASHING SETUP (PROBLEM)            */}
          {/* ========================================================= */}
          <ScrollReveal
            direction="up"
            delay={0.05}
            className="bg-[#FFF6F6] border border-[#FECDD3]/70 rounded-[24px] sm:rounded-[28px] p-4.5 sm:p-5.5 lg:p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(239,68,68,0.03)]"
          >
            {/* Header with Red Cross Circle */}
            <div className="flex items-start gap-3 mb-4 sm:mb-4.5">
              <ProblemXIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 shadow-xs mt-0.5" />
              <div>
                <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F1729] tracking-tight">
                  Traditional Washing Setup
                </h3>
                <p className="font-open-sans text-xs text-slate-500 mt-0.5">
                  Multiple machines, heavy bags and more effort at every customer location.
                </p>
              </div>
            </div>

            {/* Inner Content: Image on Left + 4 Items on Right */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-3 sm:gap-3.5 items-center flex-1">
              {/* Left Column: Traditional Equipment Image */}
              <div className="relative w-full aspect-[1389/1132] rounded-2xl overflow-hidden border border-rose-200/50 shadow-xs bg-slate-900">
                <Image
                  src="/aquaforceforgigworkers/images/professional-cleaning-equipment-van-setup.webp"
                  alt="Traditional Washing Setup with Multiple Machines and Heavy Bags"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center"
                />
              </div>

              {/* Right Column: 4 Problem Points */}
              <div className="flex flex-col justify-between gap-1.5 sm:gap-2">
                {PROBLEM_POINTS.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 rounded-xl bg-[#FFEAEA]/60 border border-[#FECDD3]/40 flex items-start gap-2.5 transition-colors hover:bg-[#FFEAEA]/85"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-rose-100 shadow-2xs flex items-center justify-center text-[#E53E3E] shrink-0 mt-0.5">
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-montserrat font-bold text-[11.5px] sm:text-[12px] text-[#0F1729] leading-tight">
                          {item.title}
                        </h4>
                        <p className="font-open-sans text-[10px] sm:text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* ========================================================= */}
          {/* CENTER GRADIENT TRANSITION ARROW (DESKTOP ONLY)          */}
          {/* Exact block arrow from reference mockup                   */}
          {/* ========================================================= */}
          <div className="hidden xl:flex absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
            <svg
              viewBox="0 0 52 32"
              className="w-10 h-6 sm:w-12 sm:h-7.5 drop-shadow-xs"
              fill="none"
            >
              <defs>
                <linearGradient id="centerBlockArrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
                  <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M0 11 H28 V3 L50 16 L28 29 V21 H0 Z"
                fill="url(#centerBlockArrowGrad)"
              />
            </svg>
          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: AQUAFORCE 1400 - ALL IN ONE (SOLUTION)        */}
          {/* ========================================================= */}
          <ScrollReveal
            direction="up"
            delay={0.1}
            className="bg-[#F1FAF5] border border-[#BBF7D0]/70 rounded-[24px] sm:rounded-[28px] p-4.5 sm:p-5.5 lg:p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(34,197,94,0.03)]"
          >
            <div>
              {/* Header with Green Checkmark Circle */}
              <div className="flex items-start gap-3 mb-4 sm:mb-4.5">
                <SolutionCheckIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 shadow-xs mt-0.5" />
                <div>
                  <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F1729] tracking-tight">
                    Aquaforce 1400 – All in One
                  </h3>
                  <p className="font-open-sans text-xs text-slate-500 mt-0.5">
                    A compact, portable system that combines everything you need for doorstep cleaning.
                  </p>
                </div>
              </div>

              {/* Inner Content: Image on Left + 4 Items on Right */}
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-3 sm:gap-3.5 items-center">
                {/* Left Column: Aquaforce Kit Image */}
                <div className="relative w-full aspect-[1536/1024] rounded-2xl overflow-hidden border border-emerald-200/50 shadow-xs bg-white flex items-center justify-center p-2">
                  <Image
                    src="/aquaforceforgigworkers/images/promec-aquaforce-1400-psi-kit.webp"
                    alt="PROMEC AquaForce 1400 PSI Kit All-in-One Setup"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-contain object-center"
                  />
                </div>

                {/* Right Column: 4 Solution Points */}
                <div className="flex flex-col justify-between gap-1.5 sm:gap-2">
                  {SOLUTION_POINTS.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className="p-2 sm:p-2.5 rounded-xl bg-[#E6F8EE]/60 border border-[#BBF7D0]/40 flex items-start gap-2.5 transition-colors hover:bg-[#E6F8EE]/85"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-emerald-100 shadow-2xs flex items-center justify-center text-[#16A34A] shrink-0 mt-0.5">
                          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-montserrat font-bold text-[11.5px] sm:text-[12px] text-[#0F1729] leading-tight">
                            {item.title}
                          </h4>
                          <p className="font-open-sans text-[10px] sm:text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom 5 Feature Pills Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 mt-3 pt-0.5">
              {BOTTOM_PILLS.map((pill, idx) => {
                const PillIcon = pill.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-1.5 sm:p-2 border border-slate-200/60 shadow-2xs flex items-center gap-1.5 select-none"
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md ${pill.iconBg} ${pill.iconColor} flex items-center justify-center shrink-0 border border-slate-100`}
                    >
                      <PillIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="font-open-sans text-[9.5px] sm:text-[10px] font-bold text-slate-800 leading-tight">
                      {pill.label}
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
