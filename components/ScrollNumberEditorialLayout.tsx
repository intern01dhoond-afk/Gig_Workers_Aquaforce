"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Menu, X, ArrowDown } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import Footer from "@/components/Footer";

export interface PolicySection {
  id: string;
  number: string;
  title: string;
  category?: string;
  content: React.ReactNode;
}

export interface ScrollNumberEditorialLayoutProps {
  pageTitle: string;
  metadataLabel?: string;
  lastUpdated: string;
  preamble: React.ReactNode;
  sections: PolicySection[];
}

export default function ScrollNumberEditorialLayout({
  pageTitle,
  metadataLabel = "LEGAL DOCUMENT",
  lastUpdated,
  preamble,
  sections,
}: ScrollNumberEditorialLayoutProps) {
  const { openModal } = useOrderModal();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Mobile menu & TOC state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Active section index for TOC sidebar and mobile bar
  const [displayActiveIndex, setDisplayActiveIndex] = useState(0);

  // Real-time scroll listener for active section tracking
  const handleScroll = useCallback(() => {
    if (sections.length === 0) return;

    // Focus point in viewport for section headings (around sticky number top)
    const targetY = 140;

    const tops: number[] = [];
    for (let i = 0; i < sections.length; i++) {
      const el = sectionRefs.current[i];
      if (el) {
        tops.push(el.getBoundingClientRect().top);
      } else {
        tops.push(99999);
      }
    }

    let activeIdx = 0;
    for (let i = 0; i < tops.length; i++) {
      if (tops[i] <= targetY) {
        activeIdx = i;
      } else {
        break;
      }
    }

    setDisplayActiveIndex((prev) => (prev !== activeIdx ? activeIdx : prev));
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

  // Click navigation to scroll smoothly to a section
  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index];
    if (el) {
      const targetY = 96; // sticky top (top-24)
      const elementTop =
        el.getBoundingClientRect().top + window.pageYOffset - targetY;
      window.scrollTo({
        top: Math.max(0, elementTop),
        behavior: "smooth",
      });
      setMobileTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSection = sections[displayActiveIndex] || sections[0];

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
        </div>
      </section>

      {/* 3. MOBILE STICKY SUB-BAR (Current Section) */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 truncate">
          <span className="font-mono text-xs w-6 shrink-0 text-black font-black">
            {sections[displayActiveIndex]?.number}
          </span>
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
            TABLE OF CONTENTS
          </div>
          {sections.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(idx)}
              className={`flex items-start gap-3 py-2 text-left text-sm transition-colors border-b border-neutral-100 ${
                displayActiveIndex === idx ? "text-black font-bold" : "text-neutral-500 hover:text-black"
              }`}
            >
              <span className="font-mono text-xs w-6 shrink-0 text-black font-black">
                {item.number}
              </span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* 4. MAIN EDITORIAL CONTENT GRID WITH STICKY SCROLL-DRIVEN NUMBER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative items-start">
          {/* COLUMN 1: LEFT VERTICAL NAVIGATION RAIL (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar border-r border-black/10 py-10 pr-6">
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 pb-3 border-b border-black/10">
                  DOCUMENT SECTIONS
                </div>

                <nav className="space-y-1" aria-label="Legal sections navigation">
                  {sections.map((item, idx) => {
                    const isActive = displayActiveIndex === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(idx)}
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
                </nav>
              </div>

              {/* Rail Bottom Progress */}
              <div className="pt-6 border-t border-black/10">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2.5">
                  <span className="font-semibold text-black">
                    {sections[displayActiveIndex]?.number || "01"} / {sections.length.toString().padStart(2, "0")}
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
                      width: `${((displayActiveIndex + 1) / sections.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2 & 3: ALL DOCUMENT SECTIONS WITH STICKY COLLIDING NUMBERS */}
          <div className="col-span-12 lg:col-span-9 pb-36">
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[idx] = el;
                }}
                className="relative min-h-[380px] lg:min-h-[460px]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-9 gap-0">
                  {/* SUB-COLUMN 1: STICKY LARGE BLACK NUMBER (Stretches to section height; sticks inside until pushed by next section) */}
                  <div className="hidden lg:block lg:col-span-3 relative self-stretch pb-6 sm:pb-8">
                    <div className="sticky top-24 pl-8 xl:pl-10 pr-6 pt-6 sm:pt-8 select-none">
                      <div className="text-7xl lg:text-[110px] xl:text-[125px] font-black text-black font-montserrat leading-none tracking-tight select-none">
                        {section.number}
                      </div>
                    </div>
                  </div>

                  {/* SUB-COLUMN 2: SECTION LEGAL CONTENT */}
                  <div className="col-span-12 lg:col-span-6 lg:pl-6 xl:pl-10 pt-6 sm:pt-8 pb-16 sm:pb-24">
                    {/* Mobile number indicator */}
                    <div className="lg:hidden text-5xl sm:text-6xl font-black text-black font-montserrat leading-none mb-3">
                      {section.number}
                    </div>

                    {/* Horizontal divider rule for sections (matching Image 2) */}
                    {idx > 0 && (
                      <div className="border-t-2 border-black mb-6 sm:mb-8" />
                    )}

                    {section.category && (
                      <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 mb-2">
                        [ {section.number} / {section.category} ]
                      </div>
                    )}

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-montserrat text-black tracking-tight leading-tight mb-6">
                      {section.title}
                    </h2>

                    <div className="max-w-2xl text-[15px] sm:text-[16px] text-neutral-700 font-open-sans leading-[1.8] space-y-4">
                      {section.content}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
