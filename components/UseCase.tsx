"use client";

import React from "react";
import { ExpandableGallery } from "@/components/ui/gallery-animation";

const USE_CASES = [
  {
    image: "/aquaforceforgigworkers/images/use-cases/1.webp",
    title: "Car Cleaning",
    desc: "Exterior washing + interior vacuuming",
  },
  {
    image: "/aquaforceforgigworkers/images/use-cases/2.webp",
    title: "Bike Cleaning",
    desc: "Complete bike wash + deep chain degreasing",
  },
  {
    image: "/aquaforceforgigworkers/images/use-cases/3.1.webp",
    title: "Home Cleaning",
    desc: "Balcony, floor tiles, windows & outdoor furniture deep cleaning",
  },
  {
    image: "/aquaforceforgigworkers/images/use-cases/4.1.webp",
    title: "Office Cleaning",
    desc: "Commercial entryways, glass panels, carpets & floor washing",
  },
  {
    image: "/aquaforceforgigworkers/images/use-cases/5.webp",
    title: "Society Cleaning",
    desc: "Parking bays, paved driveways, clubhouses & shared amenities",
  },
];

export default function UseCase() {
  return (
    <section
      id="use-cases"
      className="relative w-full py-12 xs:py-14 sm:py-16 lg:py-20 bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem]"
    >
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-[80px]">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto shrink-0 mb-6 sm:mb-8 lg:mb-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-900 bg-white shadow-xs mb-2.5 sm:mb-3">
            UNRESTRICTED UTILITY
          </div>

          {/* Section Title */}
          <h2 className="text-[#0F1729] font-montserrat text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight leading-[1.15] max-w-[680px] mx-auto">
            One Setup. Multiple Services
          </h2>

          {/* Subtitle */}
          <p className="text-[#333340] font-open-sans text-xs xs:text-sm sm:text-base lg:text-[17px] font-normal leading-relaxed mt-1.5 sm:mt-2 max-w-[800px] mx-auto">
            Whether detailing high-end supercars or prepping mountain bikes, the Aquaforce fits the mold.
          </p>
        </div>

        {/* Expandable Gallery Component */}
        <div className="w-full max-w-[1200px] mx-auto">
          <ExpandableGallery images={USE_CASES} />
        </div>
      </div>
    </section>
  );
}
