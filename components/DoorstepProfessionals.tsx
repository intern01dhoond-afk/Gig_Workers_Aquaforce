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
    <section className="pt-10 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 lg:pb-16 bg-white w-full overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading & Specifications */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <ScrollReveal direction="up">
              {/* Pill Badge */}
              <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-slate-800 bg-white shadow-2xs mb-4 select-none">
                BUILT FOR DOORSTEP PROFESSIONALS
              </div>

              {/* Headline strictly 2 lines */}
              <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] xl:text-[42px] font-medium font-montserrat text-[#0F1729] tracking-tight leading-[1.18] mb-6 sm:mb-8">
                Made for Cleaning
                <br />
                <span className="inline-block sm:whitespace-nowrap">
                  Professionals on the Move
                </span>
              </h2>
            </ScrollReveal>

            {/* Specification Rows */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="w-full max-w-[360px] sm:max-w-[420px]">
                {SPECS.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`py-3 sm:py-3.5 flex flex-col ${
                      index < SPECS.length - 1 ? "border-b border-slate-200/80" : ""
                    }`}
                  >
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-slate-400 font-open-sans uppercase">
                      {spec.label}
                    </span>
                    <span className="text-[15px] sm:text-base lg:text-lg font-bold text-slate-900 font-montserrat mt-0.5">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Large Product Image with Reflection filling the right side */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end items-center">
            <ScrollReveal direction="fade" delay={0.15} className="w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[540px] lg:max-w-none h-[360px] xs:h-[440px] sm:h-[520px] md:h-[580px] lg:h-[640px] xl:h-[700px]">
                <Image
                  src="/aquaforceforautocare/images/doorstep-machine-cropped.png"
                  alt="Aquaforce 1400 - Made for Cleaning Professionals on the Move"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
