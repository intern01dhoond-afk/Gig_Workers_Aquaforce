import Image from "next/image";
import ScrollReveal, { ScrollRevealStagger, ScrollRevealItem } from "./ScrollReveal";
import PerformanceVideoPlayer from "./PerformanceVideoPlayer";

const FEATURES_LEFT = [
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-01 Powerful Battery Operation.svg",
    title: "Powerful Battery Operation",
    desc: "High-voltage lithium cells deliver constant output throughout every wash cycle",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-02 3 Hours Continuous Use.svg",
    title: "3 Hours Continuous Use",
    desc: "Extended runtime for multiple vehicle cleaning sessions",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-03 No Power Socket Required.svg",
    title: "No Power Socket Required",
    desc: "Complete operational freedom anywhere without relying on external power sources",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-04 Cordless & Portable.svg",
    title: "Cordless & Portable",
    desc: "Zero cables, lightweight chassis for easy maneuvering",
  },
];

const FEATURES_RIGHT = [
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-05 Built-In Pressure Pump.svg",
    title: "Built-In Pressure Pump",
    desc: "Precision engineering delivers 1400 PSI directly from an integrated internal pump",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-06 Vehicle Optimised.svg",
    title: "Vehicle Optimised",
    desc: "Precision nozzle for targeted cleaning on wheels, panels, and tight crevices",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-07 Zero Power Reliance.svg",
    title: "Zero Power Reliance",
    desc: "Operates fully independent of electrical outlets, extension cords, or generators",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/Engineered/Precision engineering-08 Compact & Easy to Carry.svg",
    title: "Compact & Easy to Carry",
    desc: "Dual-module design fits in any vehicle trunk for easy transport and storage",
  },
];

// 2-Column Mobile Features ordered strictly as shown in screenshot
const MOBILE_FEATURE_PAIRS = [
  [FEATURES_LEFT[0], FEATURES_LEFT[1]], // Powerful Battery | 3 Hours Continuous Use
  [FEATURES_LEFT[2], FEATURES_LEFT[3]], // No Power Socket | Cordless & Portable
  [FEATURES_RIGHT[0], FEATURES_RIGHT[1]], // Built-In Pressure Pump | Vehicle Optimised
  [FEATURES_RIGHT[2], FEATURES_RIGHT[3]], // Zero Power Reliance | Compact & Easy to Carry
];

export default function EngineeredPerformance() {
  return (
    <section
      id="features"
      className="pt-10 sm:pt-14 pb-8 sm:pb-10 bg-gradient-to-b from-[#bcdbf5] via-[#dcebf9] to-[#c2def6] relative overflow-hidden"
    >
      {/* Top Header */}
      <ScrollReveal direction="up" className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center px-4 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-900 bg-transparent mb-3">
          PRECISION ENGINEERING
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium font-montserrat text-[#0F1729] tracking-tight">
          Engineered For Ultimate Performance
        </h2>
        <p className="text-slate-600 font-open-sans max-w-xl mx-auto mt-2 text-sm sm:text-base leading-relaxed">
          Explore the mechanical innovations that make cordless high-pressure
          cleaning a reality.
        </p>
      </ScrollReveal>

      {/* ========================================================= */}
      {/* MOBILE LAYOUT (< lg): Video Player + 2-Column Grid */}
      {/* ========================================================= */}
      <div className="lg:hidden max-w-[560px] mx-auto px-3.5 sm:px-6 mt-4 sm:mt-6 flex flex-col items-center">
        {/* Center Video Player */}
        <ScrollReveal direction="zoom" className="relative flex flex-col items-center justify-center my-2 w-full">
          <PerformanceVideoPlayer />
        </ScrollReveal>

        {/* 2-Column Features Grid Styled as Crisp Modern Cards */}
        <ScrollRevealStagger className="w-full grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4 mt-6 text-left" staggerDelay={0.08}>
          {MOBILE_FEATURE_PAIRS.flat().map((item) => (
            <ScrollRevealItem
              key={item.title}
              className="flex flex-col items-start bg-white/50 backdrop-blur-xs border border-white/80 rounded-[12px] p-3 xs:p-3.5 shadow-[0_2px_8px_rgba(15,40,75,0.05)] hover:bg-white/70 transition-colors"
            >
              {/* Icon in Accent Badge */}
              <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-[8px] bg-sky-600/10 flex items-center justify-center mb-2 shrink-0 p-1">
                <Image
                  src={item.iconSrc}
                  alt={item.title}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Title */}
              <h3 className="text-[12px] xs:text-[13px] sm:text-[14.5px] font-bold font-montserrat text-[#0F1729] leading-tight">
                {item.title}
              </h3>
              {/* Description */}
              <p className="text-[10.5px] xs:text-[11px] sm:text-[12px] text-slate-600 font-open-sans mt-1 leading-snug font-normal">
                {item.desc}
              </p>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (>= lg): 3-Column Layout */}
      {/* ========================================================= */}
      <div className="hidden lg:grid max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[80px] grid-cols-12 gap-4 items-center mt-8">
        {/* Left Column (4 Features) */}
        <ScrollReveal direction="right" delay={0.1} className="col-span-3 flex flex-col gap-10 text-right">
          {FEATURES_LEFT.map((item) => (
            <div key={item.title} className="flex flex-row-reverse items-start gap-4">
              <div className="w-8 h-8 lg:w-9 lg:h-9 shrink-0 relative mt-0.5">
                <Image
                  src={item.iconSrc}
                  alt={item.title}
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-[15px] font-bold font-montserrat text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 font-open-sans mt-1 leading-relaxed max-w-[260px] ml-auto">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </ScrollReveal>

        {/* Center Column: Video Player with Glow */}
        <ScrollReveal direction="zoom" className="col-span-6 flex items-center justify-center relative px-2">
          <PerformanceVideoPlayer />
        </ScrollReveal>

        {/* Right Column (4 Features) */}
        <ScrollReveal direction="left" delay={0.1} className="col-span-3 flex flex-col gap-10 text-left">
          {FEATURES_RIGHT.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-8 h-8 lg:w-9 lg:h-9 shrink-0 relative mt-0.5">
                <Image
                  src={item.iconSrc}
                  alt={item.title}
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-[15px] font-bold font-montserrat text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 font-open-sans mt-1 leading-relaxed max-w-[260px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
