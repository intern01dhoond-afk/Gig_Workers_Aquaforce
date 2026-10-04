"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GalleryItem {
  image: string;
  title?: string;
  desc?: string;
}

export interface ExpandableGalleryProps {
  images: (string | GalleryItem)[];
  className?: string;
}

export const ExpandableGallery: React.FC<ExpandableGalleryProps> = ({
  images,
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getItemData = (item: string | GalleryItem): GalleryItem => {
    if (typeof item === "string") {
      return { image: item };
    }
    return item;
  };

  // Only open fullscreen modal on desktop view (>= 768px)
  const openImage = (index: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const getFlexValue = (index: number) => {
    if (hoveredIndex === null) {
      return 1;
    }
    return hoveredIndex === index ? 3 : 0.6;
  };

  const selectedItem =
    selectedIndex !== null ? getItemData(images[selectedIndex]) : null;

  return (
    <div className={className}>
      {/* ========================================================= */}
      {/* MOBILE VIEW (< md): Horizontal Touch-Snap Scroll Slider  */}
      {/* ========================================================= */}
      <div className="block md:hidden w-full">
        {/* Horizontal Scroll Track */}
        <div
          className="flex gap-3 xs:gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 py-2 pb-3 scroll-pl-4 scroll-pr-4 no-scrollbar items-stretch select-none"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {images.map((rawItem, index) => {
            const item = getItemData(rawItem);

            return (
              <div
                key={index}
                className="relative shrink-0 w-[84vw] xs:w-[80vw] sm:w-[65vw] max-w-[340px] h-[390px] xs:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/90 bg-slate-950 snap-start flex flex-col justify-end select-none"
              >
                {/* Background Image - tap does not open modal */}
                <img
                  src={item.image}
                  alt={item.title || `Service ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Dark Vignette Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 via-40% to-transparent pointer-events-none" />

                {/* Bottom Content Area */}
                {item.title && (
                  <div className="relative z-10 p-4 xs:p-5 flex flex-col justify-end pointer-events-none">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-white font-montserrat font-bold text-lg xs:text-xl tracking-tight leading-snug drop-shadow-sm">
                        {item.title}
                      </h3>
                      <span className="text-white/60 text-xs font-mono shrink-0">
                        0{index + 1}
                      </span>
                    </div>

                    {item.desc && (
                      <p className="text-slate-200 font-open-sans text-xs xs:text-[13px] leading-relaxed mt-1.5 line-clamp-2 drop-shadow-xs">
                        {item.desc}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Spacer to preserve right margin on touch devices */}
          <div className="shrink-0 w-2 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP VIEW (>= md): Horizontal Expandable Gallery       */}
      {/* ========================================================= */}
      <div className="hidden md:flex gap-2 sm:gap-3.5 h-[420px] md:h-[460px] lg:h-[500px] w-full">
        {images.map((rawItem, index) => {
          const item = getItemData(rawItem);
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl shadow-md border border-slate-200/80 bg-slate-950 group"
              style={{ flex: 1 }}
              animate={{ flex: getFlexValue(index) }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openImage(index)}
            >
              <img
                src={item.image}
                alt={item.title || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
              />
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.05 : 0.35 }}
                transition={{ duration: 0.3 }}
              />

              {/* Title & Desc Overlay */}
              {item.title && (
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-col justify-end pointer-events-none transition-all duration-300">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-white font-montserrat font-bold text-xs xs:text-sm sm:text-base lg:text-lg tracking-tight drop-shadow truncate">
                      {item.title}
                    </span>
                    <span className="text-white/60 text-[10px] sm:text-xs font-mono shrink-0 hidden xs:inline">
                      0{index + 1}
                    </span>
                  </div>
                  {item.desc && (
                    <p
                      className={`text-slate-300 font-open-sans text-[11px] sm:text-xs lg:text-[13px] mt-1 line-clamp-2 transition-opacity duration-300 ${
                        isHovered
                          ? "opacity-100"
                          : "opacity-0 max-h-0 overflow-hidden sm:max-h-full sm:opacity-0"
                      }`}
                    >
                      {item.desc}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Expanded View Modal (Desktop only) */}
      <AnimatePresence>
        {selectedIndex !== null && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 hidden md:flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-sm"
            onClick={closeImage}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2.5 cursor-pointer"
              onClick={closeImage}
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                type="button"
                className="absolute left-3 sm:left-6 z-20 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2.5 cursor-pointer"
                onClick={goToPrev}
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image & Description Container */}
            <motion.div
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                src={selectedItem.image}
                alt={selectedItem.title || `Gallery image ${selectedIndex + 1}`}
                className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />

              {selectedItem.title && (
                <div className="mt-3.5 text-center max-w-xl px-4">
                  <h3 className="text-white font-montserrat font-bold text-base sm:text-xl">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.desc && (
                    <p className="text-slate-300 font-open-sans text-xs sm:text-sm mt-1">
                      {selectedItem.desc}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                className="absolute right-3 sm:right-6 z-20 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2.5 cursor-pointer"
                onClick={goToNext}
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableGallery;
