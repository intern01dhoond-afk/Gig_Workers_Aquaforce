"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const SPECS = [
  { label: "POWER", value: "Cordless" },
  { label: "MOBILITY", value: "Portable" },
  { label: "WATER VOLUME", value: "18L Water Tank" },
  { label: "BATTERY LIFE", value: "3 Hours Runtime" },
  { label: "CHARGE TIME", value: "90 Min Charging" },
  { label: "ORGANISATION", value: "Professional Setup" },
];

export default function DoorstepProfessionals() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & Specifications */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            <ScrollReveal direction="up">
              {/* Pill Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-slate-800 bg-white shadow-2xs mb-4">
                BUILT FOR DOORSTEP PROFESSIONALS
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-medium font-montserrat text-[#0F1729] tracking-tight leading-[1.16] mb-6 sm:mb-8">
                Made for Cleaning
                <br />
                Professionals on the Move
              </h2>
            </ScrollReveal>

            {/* Specification Rows */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="w-full max-w-md">
                {SPECS.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`py-3 sm:py-3.5 flex flex-col ${
                      index < SPECS.length - 1 ? "border-b border-slate-200/70" : ""
                    }`}
                  >
                    <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-slate-400 font-open-sans uppercase">
                      {spec.label}
                    </span>
                    <span className="text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 font-montserrat mt-0.5">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Product Image with Reflection */}
          <div className="lg:col-span-7 xl:col-span-7 flex justify-center items-center">
            <ScrollReveal direction="fade" delay={0.15} className="w-full">
              <div className="relative w-full h-[280px] xs:h-[340px] sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[600px]">
                <Image
                  src="/aquaforceforautocare/images/doorstep-professionals.png"
                  alt="Aquaforce 1400 - Made for Cleaning Professionals on the Move"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain object-center lg:object-right"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
