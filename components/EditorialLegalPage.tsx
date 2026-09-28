"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Menu, X, ChevronRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import Footer from "@/components/Footer";

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  navTitle?: string;
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

export interface EditorialLegalPageProps {
  pageTitle: string;
  metadataLabel?: string;
  lastUpdated: string;
  preamble: React.ReactNode;
  sections: LegalSection[];
  darkBreak?: DarkBreakSection;
}

export default function EditorialLegalPage({
  pageTitle,
  metadataLabel = "LEGAL DOCUMENT",
  lastUpdated,
  preamble,
  sections,
  darkBreak,
}: EditorialLegalPageProps) {
  const { openModal } = useOrderModal();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Combine sections for navigation
  const allNavItems: Array<{ id: string; number: string; title: string; navTitle?: string }> = darkBreak
    ? [
        ...sections,
        {
          id: darkBreak.id,
          number: darkBreak.number,
          title: darkBreak.title,
          navTitle: darkBreak.title,
        },
      ]
    : sections;

  // IntersectionObserver to track which section is currently active
  useEffect(() => {
    const sectionElements = allNavItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, [allNavItems]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setMobileNavOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeIndex = allNavItems.findIndex((item) => item.id === activeId);
  const currentSection = allNavItems[activeIndex >= 0 ? activeIndex : 0];

  return (
    <div className="min-h-screen bg-white text-black font-open-sans antialiased selection:bg-black selection:text-white">
      {/* 1. SLIM MINIMALIST STICKY HEADER */}
      <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          {/* PROMEC Logo */}
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

          {/* Mobile Menu Toggle */}
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

      {/* 2. HERO / PAGE INTRODUCTION (Massive Typography & Whitespace) */}
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

          {/* Introductory Preamble (Two-column Swiss Style) */}
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

      {/* 3. MOBILE STICKY SUB-HEADER (Compact Section Jump Bar) */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 py-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-neutral-400 font-semibold">{currentSection?.number || "01"}</span>
          <span className="text-neutral-300">/</span>
          <span className="text-black font-bold truncate">{currentSection?.title}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="text-black font-bold underline underline-offset-4 shrink-0 ml-3"
        >
          {mobileNavOpen ? "CLOSE" : "SECTIONS"}
        </button>
      </div>

      {/* Mobile Table of Contents Dropdown */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[112px] bottom-0 bg-white z-30 overflow-y-auto p-6 border-b border-black/10 flex flex-col gap-3">
          <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase mb-2">
            TABLE OF CONTENTS
          </div>
          {allNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`flex items-start gap-3 py-2 text-left text-sm transition-colors border-b border-neutral-100 ${
                activeId === item.id ? "text-black font-bold" : "text-neutral-500 hover:text-black"
              }`}
            >
              <span className="font-mono text-xs w-6 shrink-0 text-neutral-400 font-semibold">
                {item.number}
              </span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* 4. MAIN CONTENT AREA (Left Rail + Right Content Columns) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative items-start">
          {/* LEFT VERTICAL NAVIGATION RAIL (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar border-r border-black/10 py-10 pr-8">
            <div className="flex flex-col justify-between h-full">
              {/* Rail Navigation List */}
              <div className="space-y-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 pb-3 border-b border-black/10">
                  DOCUMENT SECTIONS
                </div>

                <nav className="space-y-1.5" aria-label="Legal document table of contents">
                  {allNavItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={`group w-full flex items-start gap-3 py-1.5 text-left text-[13px] transition-all cursor-pointer ${
                          isActive
                            ? "text-black font-bold translate-x-1"
                            : "text-neutral-500 hover:text-black font-normal"
                        }`}
                      >
                        <span
                          className={`font-mono text-[11px] shrink-0 w-5 transition-colors ${
                            isActive ? "text-black font-bold" : "text-neutral-400 group-hover:text-black"
                          }`}
                        >
                          {item.number}
                        </span>
                        <span className="leading-snug truncate">{item.navTitle || item.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Rail Bottom Details / Progress */}
              <div className="pt-8 border-t border-black/10 mt-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-3">
                  <span>
                    SECTION {(activeIndex >= 0 ? activeIndex + 1 : 1).toString().padStart(2, "0")} /{" "}
                    {allNavItems.length.toString().padStart(2, "0")}
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
                <div className="w-full bg-neutral-200 h-0.5 overflow-hidden">
                  <div
                    className="bg-black h-full transition-all duration-300 ease-out"
                    style={{
                      width: `${(((activeIndex >= 0 ? activeIndex : 0) + 1) / allNavItems.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT EDITORIAL CONTENT (Main Reading Area) */}
          <div className="lg:col-span-9 lg:pl-12 xl:pl-16">
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className={`py-14 sm:py-20 lg:py-24 ${idx > 0 ? "border-t border-black/10" : ""}`}
              >
                {/* Two-Column Editorial Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">
                  {/* Left Column: Oversized Number & Section Title */}
                  <div className="md:col-span-5 lg:col-span-5">
                    {/* Oversized Number (120-180px desktop) */}
                    <div className="text-6xl sm:text-7xl lg:text-[110px] xl:text-[130px] font-black text-neutral-200 select-none font-montserrat leading-none tracking-tighter -mb-2 lg:-mb-4">
                      {section.number}
                    </div>

                    {section.category && (
                      <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 mb-2">
                        {section.category}
                      </div>
                    )}

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-montserrat text-black tracking-tight leading-tight">
                      {section.title}
                    </h2>
                  </div>

                  {/* Right Column: Existing Legal Content (Comfortable Reading Width) */}
                  <div className="md:col-span-7 lg:col-span-7 max-w-2xl text-[15px] sm:text-[16px] text-neutral-700 font-open-sans leading-[1.8] space-y-4">
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* 5. DARK VISUAL BREAK (Full-Width Black Section Near End for Contact Us) */}
      {darkBreak && (
        <section
          id={darkBreak.id}
          className="w-full bg-black text-white py-20 sm:py-28 lg:py-32 border-t border-black px-4 sm:px-8 lg:px-12 mt-12"
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

      {/* 7. MINIMALIST FOOTER */}
      <Footer />
    </div>
  );
}
