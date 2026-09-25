"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const SERVICE_CARDS = [
  {
    title: "Car Cleaning",
    subtitle: "Exterior washing & detailing",
    image: "/aquaforceforautocare/images/use-cases/1.webp",
  },
  {
    title: "Bike Cleaning",
    subtitle: "Two-wheeler wash & degreasing",
    image: "/aquaforceforautocare/images/use-cases/2.webp",
  },
  {
    title: "Home Cleaning",
    subtitle: "Balcony, tiles & patio wash",
    image: "/aquaforceforautocare/images/use-cases/3.1.webp",
  },
  {
    title: "Office Cleaning",
    subtitle: "Glass panels & commercial entryways",
    image: "/aquaforceforautocare/images/use-cases/4.1.webp",
  },
  {
    title: "Society Cleaning",
    subtitle: "Paved driveways & shared spaces",
    image: "/aquaforceforautocare/images/use-cases/5.webp",
  },
  {
    title: "Doorstep Detailing",
    subtitle: "Portable on-site equipment setup",
    image: "/aquaforceforautocare/images/Remainig%20images/12.webp",
  },
];

export default function ProfessionalCleaning() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="why-section" className="py-10 sm:py-16 lg:py-[72px] bg-white w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
        {/* Top Eyebrow Badge */}
        <ScrollReveal direction="up" className="flex justify-start mb-3 sm:mb-4">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-800 bg-white shadow-2xs select-none">
            WHY AQUAFORCE 1400?
          </div>
        </ScrollReveal>

        {/* Section Heading & Copy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start text-left">
          {/* Left Column: Heading */}
          <ScrollReveal direction="right" delay={0.05} className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-medium font-montserrat text-[#0F1729] leading-[1.14] tracking-tight">
              Your Equipment.
              <br />
              Your Services. Your
              <br />
              Business.
            </h2>
          </ScrollReveal>

          {/* Right Column: Paragraphs */}
          <ScrollReveal
            direction="left"
            delay={0.1}
            className="lg:col-span-6 font-open-sans text-[#333340] text-sm xs:text-[15px] sm:text-[16px] lg:text-[17px] font-normal leading-relaxed space-y-4 pt-1"
          >
            <p>
              Why AquaForce for Your Business? Lower initial equipment investment, multiple cleaning services, less equipment to carry, faster setup at customer locations, portable doorstep operation, and the opportunity to serve more customer categories.
            </p>
            <p>
              Your Equipment. Your Services. Your Business. One AquaForce setup helps you serve car, bike, home, office, and society cleaning customers from one versatile system.
            </p>
          </ScrollReveal>
        </div>

        {/* Carousel Header Controls (Desktop Nav Arrows) */}
        <div className="flex items-center justify-end gap-2 mt-8 sm:mt-10 mb-3">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Bottom Horizontal Image Cards Layout */}
        <ScrollReveal direction="up" delay={0.15}>
          <div
            ref={scrollContainerRef}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4 pt-1"
          >
            {SERVICE_CARDS.map((card) => (
              <div
                key={card.title}
                className="w-[195px] xs:w-[215px] sm:w-[243px] h-[200px] xs:h-[220px] sm:h-[245px] shrink-0 snap-start relative rounded-[16px] overflow-hidden shadow-xs hover:shadow-md border border-slate-200/80 group transition-all cursor-pointer"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 215px, 243px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay for clear label contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-4">
                  <h3 className="text-white text-sm sm:text-[15px] font-bold font-montserrat tracking-tight leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/80 text-[10.5px] sm:text-[11px] font-open-sans mt-0.5 line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
