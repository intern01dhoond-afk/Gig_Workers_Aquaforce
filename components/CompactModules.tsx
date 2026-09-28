import Image from "next/image";
import { Plus } from "lucide-react";
import ScrollReveal, { ScrollRevealStagger, ScrollRevealItem } from "./ScrollReveal";

const MODULES = [
  {
    iconSrc: "/aquaforceforgigworkers/images/icons/engineering-1.svg",
    title: "Lithium-Ion Battery pack",
    desc: "Intelligent thermal vents and quick-charge support protect cell longevity.",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/icons/engineering-2.svg",
    title: "Heavy-Duty DC Pump",
    desc: "Forged alloy pistons deliver stable maximum fluid flow and zero corrosion risk.",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/icons/engineering-3.svg",
    title: "Compact Water Tank Option",
    desc: "Mount the onboard tank directly or drop the hose in any external vessel.",
  },
  {
    iconSrc: "/aquaforceforgigworkers/images/icons/engineering-4.svg",
    title: "Dynamic Power Control",
    desc: "Manage motor speeds dynamically using the tactile dual-mode pressure trigger.",
  },
];

export default function CompactModules() {
  return (
    <section className="pt-6 sm:pt-12 lg:pt-16 pb-2 sm:pb-4 lg:pb-4 bg-white">
      <ScrollReveal direction="up" className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-900 bg-transparent mb-3 sm:mb-4">
          INTEGRATED ENGINEERING
        </div>

        {/* Section Heading & Subtitle */}
        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-medium font-montserrat text-[#0F1729] tracking-tight">
          Compact Dual-Module Design
        </h2>
        <p className="text-slate-600 font-open-sans max-w-xl mx-auto mt-2 sm:mt-3 text-xs xs:text-sm sm:text-base">
          It is engineered to work as one unified, ergonomic system
        </p>
      </ScrollReveal>

      {/* 4 Connected Cards: 2x2 on Mobile, 4-Col Grid on Desktop */}
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 lg:px-0 mt-6 sm:mt-16">
        <ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-6" staggerDelay={0.08}>
          {MODULES.map((m, idx) => (
            <ScrollRevealItem
              key={m.title}
              direction="zoom"
              className="relative flex flex-col h-full"
            >
              {/* Card Content */}
              <div className="h-full min-h-[175px] xs:min-h-[195px] sm:min-h-[250px] bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-3.5 xs:p-4.5 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-start">
                <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-2.5 xs:mb-3 sm:mb-5">
                  <Image
                    src={m.iconSrc}
                    alt={m.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[12.5px] xs:text-[13.5px] sm:text-[17px] font-bold font-montserrat text-slate-900 leading-snug">
                  {m.title}
                </h3>
                <p className="text-[10.5px] xs:text-[11.5px] sm:text-[13px] text-slate-500 font-open-sans mt-1.5 sm:mt-2.5 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* Connecting '+' Pill Badge visible on desktop */}
              {idx < MODULES.length - 1 && (
                <div className="hidden lg:flex absolute left-[calc(100%+12px)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white border border-slate-200/90 items-center justify-center text-slate-400 shadow-[0_2px_6px_rgba(0,0,0,0.06)] pointer-events-none">
                  <Plus size={14} className="text-slate-400" strokeWidth={2.5} />
                </div>
              )}
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
