import Image from "next/image";
import { ScrollRevealStagger, ScrollRevealItem } from "./ScrollReveal";

export default function StatsBar() {
  return (
    <section className="bg-[#f8f9fb] border-y border-slate-200/70 py-4 sm:py-7 lg:py-8 w-full">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-[80px]">
        <ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 items-center" staggerDelay={0.1}>
          {/* Stat 1: Battery */}
          <ScrollRevealItem className="flex flex-col items-center justify-center text-center px-2.5 sm:px-4 py-3 sm:py-2 border-r border-b lg:border-b-0 border-slate-200/80">
            {/* Battery Icon - Aquaforce ( below sale (1).svg */}
            <div className="h-10 sm:h-12 flex items-center justify-center mb-1">
              <Image
                src="/aquaforceforgigworkers/images/icons/icon-1.svg"
                alt="Aquaforce Battery 3 Hours Continuous Use"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              BATTERY
            </span>
            <span className="font-montserrat text-xl sm:text-3xl lg:text-[32px] font-black text-[#111827] my-0.5 tracking-tight leading-tight">
              3 HRS
            </span>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              CONTINUOUS USE
            </span>
          </ScrollRevealItem>

          {/* Stat 2: Pressure */}
          <ScrollRevealItem className="flex flex-col items-center justify-center text-center px-2.5 sm:px-4 py-3 sm:py-2 border-b lg:border-b-0 lg:border-r border-slate-200/80">
            {/* High Pressure Pump Icon - Aquaforce ( below sale (11).svg */}
            <div className="h-10 sm:h-12 flex items-center justify-center mb-1">
              <Image
                src="/aquaforceforgigworkers/images/icons/icon-11.svg"
                alt="Aquaforce High Pressure Pump"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              PRESSURE
            </span>
            <span className="font-montserrat text-xl sm:text-3xl lg:text-[32px] font-black text-[#111827] my-0.5 tracking-tight leading-tight">
              HIGH
            </span>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              PRESSURE PUMP
            </span>
          </ScrollRevealItem>

          {/* Stat 3: Power */}
          <ScrollRevealItem className="flex flex-col items-center justify-center text-center px-2.5 sm:px-4 py-3 sm:py-2 border-r border-slate-200/80">
            {/* No Sockets Needed Icon - Aquaforce ( below sale (12.svg */}
            <div className="h-10 sm:h-12 flex items-center justify-center mb-1">
              <Image
                src="/aquaforceforgigworkers/images/icons/icon-12.svg"
                alt="Aquaforce No Sockets Needed"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              POWER
            </span>
            <span className="font-montserrat text-xl sm:text-3xl lg:text-[32px] font-black text-[#111827] my-0.5 tracking-tight leading-tight">
              NO
            </span>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              SOCKETS NEEDED
            </span>
          </ScrollRevealItem>

          {/* Stat 4: Cordless */}
          <ScrollRevealItem className="flex flex-col items-center justify-center text-center px-2.5 sm:px-4 py-3 sm:py-2">
            {/* Cordless & Portable Icon - Aquaforce ( below sale (13.svg */}
            <div className="h-10 sm:h-12 flex items-center justify-center mb-1">
              <Image
                src="/aquaforceforgigworkers/images/icons/icon-13.svg"
                alt="Aquaforce Cordless 100% Wireless"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              CORDLESS
            </span>
            <span className="font-montserrat text-xl sm:text-3xl lg:text-[32px] font-black text-[#111827] my-0.5 tracking-tight leading-tight">
              100%
            </span>
            <span className="font-open-sans text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] leading-tight">
              WIRELESS
            </span>
          </ScrollRevealItem>
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
