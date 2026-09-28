"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Menu, X, ArrowDown } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import Footer from "@/components/Footer";

export interface DeckSection {
  id: string;
  number: string;
  title: string;
  category?: string;
  content: React.ReactNode;
}

export interface DarkBreakSection {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface ScrollDrivenEditorialDeckProps {
  pageTitle: string;
  metadataLabel?: string;
  lastUpdated: string;
  preamble: React.ReactNode;
  sections: DeckSection[];
  darkBreak?: DarkBreakSection;
}

export default function ScrollDrivenEditorialDeck({
  pageTitle,
  metadataLabel = "LEGAL DOCUMENT",
  lastUpdated,
  preamble,
  sections,
  darkBreak,
}: ScrollDrivenEditorialDeckProps) {
  const { openModal } = useOrderModal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // continuousPos goes from 0 to sections.length - 1
  const [continuousPos, setContinuousPos] = useState<number>(0);

  // Calculate current active index
  const activeIndex = Math.min(
    sections.length - 1,
    Math.max(0, Math.round(continuousPos))
  );

  // Smooth scroll handler
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = rect.top;
    const trackHeight = rect.height - window.innerHeight;

    if (trackHeight <= 0) return;

    // Scrolled distance inside the track
    const scrollInTrack = -trackTop;
    const progress = Math.max(0, Math.min(1, scrollInTrack / trackHeight));
    const pos = progress * (sections.length - 1);
    setContinuousPos(pos);
  }, [sections.length]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [handleScroll]);

  // Click navigation to scroll to specific section
  const scrollToSectionIndex = (index: number) => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.getBoundingClientRect().top + window.pageYOffset;
    const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
    const targetScroll = trackTop + (index / (sections.length - 1)) * trackHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
    setMobileTocOpen(false);
  };

  const scrollToDarkBreak = () => {
    if (darkBreak) {
      const el = document.getElementById(darkBreak.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Interpolation parameters
  // currentIndex is the primary base section
  const baseIndex = Math.floor(continuousPos);
  const nextIndex = Math.min(sections.length - 1, baseIndex + 1);
  const rawFraction = continuousPos - baseIndex;

  // Smoothing fraction:
  // fraction < 0.2 -> 0 (holding base)
  // fraction > 0.8 -> 1 (holding next)
  // 0.2 to 0.8 -> smooth transition (0 to 1)
  let transitionProgress = 0;
  if (rawFraction <= 0.2) {
    transitionProgress = 0;
  } else if (rawFraction >= 0.8) {
    transitionProgress = 1;
  } else {
    const t = (rawFraction - 0.2) / 0.6;
    // Cosine ease in-out
    transitionProgress = (1 - Math.cos(t * Math.PI)) / 2;
  }

  const isTransitioning = transitionProgress > 0 && transitionProgress < 1 && baseIndex !== nextIndex;

  // Base section styles
  const baseOpacity = isTransitioning ? 1 - transitionProgress : 1;
  const baseTranslateY = isTransitioning ? -transitionProgress * 45 : 0;
  const baseScale = isTransitioning ? 1 - transitionProgress * 0.03 : 1;

  // Next section styles
  const nextOpacity = isTransitioning ? transitionProgress : 0;
  const nextTranslateY = isTransitioning ? (1 - transitionProgress) * 45 : 45;
  const nextScale = isTransitioning ? 0.97 + transitionProgress * 0.03 : 0.97;

  // Current active section for display
  const currentSection = sections[activeIndex] || sections[0];

  return (
    <div className="min-h-screen bg-white text-black font-open-sans antialiased selection:bg-black selection:text-white">
      {/* 1. SLIM MINIMALIST STICKY HEADER */}
      <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="relative w-[130px] h-[30px] sm:w-[160px] sm:h-[34px] block shrink-0">
            <Image
              src="/aquaforceforgigworkers/images/promec-logo.svg"
              alt="PROMEC"
              fill
              sizes="(max-width: 640px) 130px, 160px"
              className="object-contain object-left"
              priority
            />
          </Link>
        </div>

        {/* Existing Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-xs uppercase tracking-[0.2em] font-medium text-white/70">
          <Link href="/#home" className="hover:text-white transition-colors py-1">
            Home
          </Link>
          <Link href="/#features" className="hover:text-white transition-colors py-1">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors py-1">
            How It Works
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openModal}
            className="bg-white hover:bg-neutral-200 text-black text-xs font-bold font-montserrat px-4 sm:px-6 py-2.5 rounded-none tracking-widest uppercase transition-all duration-200 cursor-pointer active:scale-95"
          >
            Buy Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white p-2"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-black border-b border-white/10 z-40 p-6 flex flex-col gap-4 text-sm font-montserrat uppercase tracking-wider text-white">
          <Link
            href="/#home"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/10 hover:text-white/80"
          >
            Home
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/10 hover:text-white/80"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-white/10 hover:text-white/80"
          >
            How It Works
          </Link>
        </div>
      )}

      {/* 2. HERO / PAGE INTRODUCTION */}
      <section className="pt-14 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 border-b border-black/10 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase mb-6 sm:mb-8">
            <span className="font-semibold text-black">{metadataLabel}</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full" />
            <span>LAST UPDATED: {lastUpdated}</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full hidden xs:inline-block" />
            <span className="hidden xs:inline-block text-neutral-400">AMEC MOBILITY PVT. LTD.</span>
          </div>

          {/* Oversized Page Title */}
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[120px] font-black tracking-tighter uppercase text-black font-montserrat leading-[0.9] mb-10 sm:mb-14">
            {pageTitle}
          </h1>

          {/* Thin 1px Horizontal Rule */}
          <div className="w-full h-px bg-black/10 mb-8 sm:mb-12" />

          {/* Introductory Preamble */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-start">
            <div className="lg:col-span-3 text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              [ 00 / INTRODUCTION ]
            </div>
            <div className="lg:col-span-9 max-w-3xl text-base sm:text-lg lg:text-xl text-neutral-800 font-open-sans leading-relaxed font-normal">
              {preamble}
            </div>
          </div>

          {/* Scroll Cue */}
          <div className="mt-10 pt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2 tracking-widest uppercase">
              <span>SCROLL DOWN TO EXPLORE INTERACTIVE SECTIONS</span>
              <ArrowDown size={14} className="animate-bounce text-black" />
            </div>
            <div className="hidden sm:block tracking-widest uppercase">
              {sections.length} INTERACTIVE SECTIONS
            </div>
          </div>
        </div>
      </section>

      {/* 3. MOBILE SUB-HEADER WITH TOC TOGGLE */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 py-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-black font-black text-sm">{currentSection.number}</span>
          <span className="text-neutral-300">/</span>
          <span className="text-black font-bold truncate">{currentSection.title}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
          className="text-black font-bold underline underline-offset-4 shrink-0 ml-3"
        >
          {mobileTocOpen ? "CLOSE" : "SECTIONS"}
        </button>
      </div>

      {/* Mobile TOC Drawer */}
      {mobileTocOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[112px] bottom-0 bg-white z-40 overflow-y-auto p-6 border-b border-black/10 flex flex-col gap-3">
          <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase mb-2">
            SELECT SECTION
          </div>
          {sections.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSectionIndex(idx)}
              className={`flex items-start gap-3 py-2 text-left text-sm transition-colors border-b border-neutral-100 ${
                activeIndex === idx ? "text-black font-bold" : "text-neutral-500 hover:text-black"
              }`}
            >
              <span className="font-mono text-xs w-6 shrink-0 text-black font-black">
                {item.number}
              </span>
              <span>{item.title}</span>
            </button>
          ))}
          {darkBreak && (
            <button
              type="button"
              onClick={scrollToDarkBreak}
              className="flex items-start gap-3 py-2 text-left text-sm text-neutral-500 hover:text-black"
            >
              <span className="font-mono text-xs w-6 shrink-0 text-black font-black">
                {darkBreak.number}
              </span>
              <span>{darkBreak.title}</span>
            </button>
          )}
        </div>
      )}

      {/* 4. PINNED SCROLL-DRIVEN EDITORIAL SECTION AREA */}
      {/* The outer track provides actual scroll runway (e.g. 11 sections * 110vh) */}
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ height: `${sections.length * 115}vh` }}
      >
        {/* Sticky viewport stage: stays fixed in screen while user scrolls through the track */}
        <div className="sticky top-16 sm:top-[72px] h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] w-full overflow-hidden bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full relative">
              {/* LEFT VERTICAL NAVIGATION RAIL (Desktop Sticky Rail) */}
              <aside className="hidden lg:flex lg:col-span-3 h-full flex-col justify-between border-r border-black/10 py-10 pr-8">
                <div className="space-y-6">
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 pb-3 border-b border-black/10">
                    SECTIONS RAIL
                  </div>

                  <nav className="space-y-1.5" aria-label="Sections navigation">
                    {sections.map((item, idx) => {
                      const isActive = activeIndex === idx;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSectionIndex(idx)}
                          className={`group w-full flex items-start gap-3 py-1.5 text-left text-[13px] transition-all cursor-pointer ${
                            isActive
                              ? "text-black font-bold translate-x-1.5"
                              : "text-neutral-400 hover:text-black font-normal"
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] shrink-0 w-5 transition-colors ${
                              isActive ? "text-black font-bold" : "text-neutral-400 group-hover:text-black"
                            }`}
                          >
                            {item.number}
                          </span>
                          <span className="leading-snug truncate">{item.title}</span>
                        </button>
                      );
                    })}

                    {darkBreak && (
                      <button
                        type="button"
                        onClick={scrollToDarkBreak}
                        className="group w-full flex items-start gap-3 py-1.5 text-left text-[13px] text-neutral-400 hover:text-black font-normal transition-all cursor-pointer"
                      >
                        <span className="font-mono text-[11px] shrink-0 w-5 text-neutral-400 group-hover:text-black">
                          {darkBreak.number}
                        </span>
                        <span className="leading-snug truncate">{darkBreak.title}</span>
                      </button>
                    )}
                  </nav>
                </div>

                {/* Progress / Status at bottom of rail */}
                <div className="pt-6 border-t border-black/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2.5">
                    <span className="font-semibold text-black">
                      {sections[activeIndex]?.number || "01"} / {sections.length.toString().padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={scrollToTop}
                      className="hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
                      title="Scroll to top"
                    >
                      <span>TOP</span>
                      <ArrowUp size={12} />
                    </button>
                  </div>
                  <div className="w-full bg-neutral-100 h-1 overflow-hidden">
                    <div
                      className="bg-black h-full transition-all duration-150 ease-out"
                      style={{
                        width: `${((activeIndex + 1) / sections.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </aside>

              {/* MAIN EDITORIAL SECTION STAGE (Center + Right Columns) */}
              <div className="lg:col-span-9 lg:pl-12 xl:pl-16 h-full relative flex items-center">
                {/* 1. Base Section (Currently active or exiting) */}
                <div
                  className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start absolute inset-x-0 my-auto transition-transform ease-out"
                  style={{
                    opacity: baseOpacity,
                    transform: `translateY(${baseTranslateY}px) scale(${baseScale})`,
                    pointerEvents: baseOpacity > 0.3 ? "auto" : "none",
                    visibility: baseOpacity <= 0 ? "hidden" : "visible",
                  }}
                >
                  {/* Left Column: Huge BLACK number & heading */}
                  <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-start">
                    {/* Very large BLACK section number as required */}
                    <div className="text-7xl sm:text-8xl lg:text-[120px] xl:text-[145px] font-black text-black select-none font-montserrat leading-none tracking-tight -mb-2 lg:-mb-4">
                      {sections[baseIndex].number}
                    </div>

                    {sections[baseIndex].category && (
                      <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 mb-2">
                        {sections[baseIndex].category}
                      </div>
                    )}

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-montserrat text-black tracking-tight leading-tight">
                      {sections[baseIndex].title}
                    </h2>
                  </div>

                  {/* Right Column: Legal content with comfortable reading height */}
                  <div className="md:col-span-7 lg:col-span-7 max-w-2xl max-h-[calc(100vh-220px)] overflow-y-auto pr-3 text-[15px] sm:text-[16px] text-neutral-700 font-open-sans leading-[1.8] space-y-4 no-scrollbar">
                    {sections[baseIndex].content}
                  </div>
                </div>

                {/* 2. Next Section (Transitioning in when user scrolls down) */}
                {isTransitioning && nextIndex !== baseIndex && (
                  <div
                    className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start absolute inset-x-0 my-auto transition-transform ease-out"
                    style={{
                      opacity: nextOpacity,
                      transform: `translateY(${nextTranslateY}px) scale(${nextScale})`,
                      pointerEvents: nextOpacity > 0.5 ? "auto" : "none",
                      visibility: nextOpacity <= 0 ? "hidden" : "visible",
                    }}
                  >
                    {/* Left Column: Next section number & title */}
                    <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-start">
                      <div className="text-7xl sm:text-8xl lg:text-[120px] xl:text-[145px] font-black text-black select-none font-montserrat leading-none tracking-tight -mb-2 lg:-mb-4">
                        {sections[nextIndex].number}
                      </div>

                      {sections[nextIndex].category && (
                        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 mb-2">
                          {sections[nextIndex].category}
                        </div>
                      )}

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-montserrat text-black tracking-tight leading-tight">
                        {sections[nextIndex].title}
                      </h2>
                    </div>

                    {/* Right Column: Next section legal content */}
                    <div className="md:col-span-7 lg:col-span-7 max-w-2xl max-h-[calc(100vh-220px)] overflow-y-auto pr-3 text-[15px] sm:text-[16px] text-neutral-700 font-open-sans leading-[1.8] space-y-4 no-scrollbar">
                      {sections[nextIndex].content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DARK VISUAL BREAK (Full-Width Black Section for Contact Us) */}
      {darkBreak && (
        <section
          id={darkBreak.id}
          className="w-full bg-black text-white py-20 sm:py-28 lg:py-32 border-t border-black px-4 sm:px-8 lg:px-12 relative z-20"
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column in Dark Section */}
              <div className="lg:col-span-5">
                <div className="text-6xl sm:text-8xl lg:text-[120px] font-black text-neutral-800 select-none font-montserrat leading-none tracking-tighter -mb-2">
                  {darkBreak.number}
                </div>
                <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 mb-3">
                  {darkBreak.subtitle || "OFFICIAL SUPPORT"}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-montserrat text-white tracking-tight">
                  {darkBreak.title}
                </h2>
              </div>

              {/* Right Column in Dark Section: Content */}
              <div className="lg:col-span-7 max-w-2xl text-[15px] sm:text-[16px] text-neutral-300 font-open-sans leading-[1.8] space-y-6">
                {darkBreak.content}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. POLICY QUICK LINKS (Minimalist Horizontal Bar) */}
      <section className="bg-neutral-900 border-t border-white/10 py-6 px-4 text-center">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono tracking-widest uppercase text-white/50">
          <Link
            href="/terms-of-service"
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <span>/</span>
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          <span>/</span>
          <Link
            href="/cancellation-policy"
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Cancellation Policy
          </Link>
          <span>/</span>
          <Link
            href="/refund-policy"
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Refund Policy
          </Link>
        </div>
      </section>

      {/* 7. FOOTER */}
      <Footer />
    </div>
  );
}
