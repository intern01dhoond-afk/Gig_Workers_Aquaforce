"use client";

import React from "react";
import Image from "next/image";
import ScrollReveal, { ScrollRevealStagger, ScrollRevealItem } from "./ScrollReveal";

const PROBLEM_STATS = [
  {
    value: "8+",
    label: "Separate pieces of equipment needed per job",
  },
  {
    value: "2×",
    label: "More setup time at every customer location",
  },
  {
    value: "40%",
    label: "More fatigue from carrying heavy equipment bags",
  },
];

const SOLUTION_TAGS = [
  "Wet & Dry Vacuum",
  "15L Water Bucket",
  "Foam Cannon",
  "Spray Gun & Nozzles",
  "Cordless Pressure Washer",
];

export default function ProblemsSolution() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white w-full overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-800 bg-white shadow-2xs mb-3 sm:mb-4 select-none">
            ADDRESSING CHALLENGES WITH
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-medium font-montserrat text-[#0F1729] tracking-tight">
            Problems & Solution
          </h2>
        </ScrollReveal>

        {/* 2-Column Grid: Problem (Left) & Solution (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-stretch max-w-[1180px] mx-auto">
          {/* ========================================================= */}
          {/* LEFT COLUMN: PROBLEM */}
          {/* ========================================================= */}
          <ScrollReveal direction="right" delay={0.05} className="lg:pr-12 xl:pr-16 lg:border-r lg:border-slate-200/80 flex flex-col justify-between">
            <div>
              {/* Header with Red Indicator */}
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                <h3 className="font-montserrat font-bold text-lg text-[#0F1729]">
                  Problem
                </h3>
              </div>

              {/* Problem Description */}
              <p className="font-open-sans text-slate-600 text-[14px] sm:text-[15px] leading-relaxed mb-8 sm:mb-10">
                Traditional cleaning setups require multiple machines, extra equipment and heavy
                bags - creating more weight, more effort and more time at every customer
                location.
              </p>
            </div>

            {/* Metrics List */}
            <div className="space-y-6 sm:space-y-7">
              {PROBLEM_STATS.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl sm:text-5xl font-medium font-montserrat text-[#0F1729] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-open-sans text-slate-500 text-xs sm:text-[13px] mt-1.5">
                    {stat.label}
                  </div>
                  {index < PROBLEM_STATS.length - 1 && (
                    <div className="w-full h-px bg-slate-100 mt-6 sm:mt-7" />
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SOLUTION */}
          {/* ========================================================= */}
          <ScrollReveal direction="left" delay={0.1} className="lg:pl-12 xl:pl-16 flex flex-col items-center justify-between text-center pt-6 lg:pt-0">
            <div className="w-full flex flex-col items-center">
              {/* Header with Green Indicator (Aligned to left on desktop, centered on mobile) */}
              <div className="w-full flex items-center justify-start gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shrink-0" />
                <h3 className="font-montserrat font-bold text-lg text-[#0F1729]">
                  Solution
                </h3>
              </div>

              {/* Machine Graphic */}
              <div className="relative w-[240px] sm:w-[280px] h-[220px] sm:h-[260px] -my-2 sm:-my-3">
                <Image
                  src="/aquaforceforautocare/images/Remainig%20images/Product%20mockup%204Y.webp"
                  alt="AQUAFORCE 1400 Portable Pressure Washer System"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Machine Title */}
              <h4 className="font-montserrat font-bold text-2xl sm:text-3xl tracking-tight text-[#0F1729] mt-2">
                AQUAFORCE 1400
              </h4>

              {/* Solution Description */}
              <p className="font-open-sans text-slate-600 text-[14px] sm:text-[15px] leading-relaxed max-w-[480px] mx-auto mt-3 sm:mt-4 mb-7 sm:mb-8">
                AquaForce combines the essential equipment you need for doorstep
                cleaning into one compact, portable system - reducing weight, setup
                time and effort at every customer location.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-[480px] mx-auto">
              {SOLUTION_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-300/80 bg-white font-montserrat text-xs sm:text-[12.5px] font-medium text-slate-700 shadow-2xs select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
