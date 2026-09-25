"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useOrderModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "top-3 sm:top-4 px-3 sm:px-6 md:px-8 pointer-events-none"
          : "top-0 px-4 sm:px-8 lg:px-12 pointer-events-auto bg-gradient-to-b from-black/50 via-black/20 to-transparent"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-300 ease-in-out flex items-center justify-between pointer-events-auto ${
          scrolled
            ? "max-w-[1240px] w-full h-[54px] sm:h-[62px] px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl bg-black/95 backdrop-blur-md border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
            : "max-w-[1440px] w-full h-[64px] sm:h-[76px] lg:h-[82px] bg-transparent border-b border-transparent shadow-none"
        }`}
      >
        {/* PROMEC Brand Logo */}
        <a href="#home" className="flex items-center group shrink-0 select-none cursor-pointer">
          <div
            className={`relative transition-all duration-300 shrink-0 ${
              scrolled
                ? "w-[125px] h-[26px] sm:w-[155px] sm:h-[32px] lg:w-[185px] lg:h-[36px]"
                : "w-[135px] h-[28px] sm:w-[170px] sm:h-[34px] lg:w-[200px] lg:h-[40px]"
            }`}
          >
            <Image
              src="/aquaforceforautocare/images/promec-logo.svg"
              alt="PROMEC"
              fill
              priority
              sizes="(max-width: 640px) 135px, (max-width: 1024px) 170px, 200px"
              className="object-contain object-left"
            />
          </div>
        </a>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-11">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14.5px] lg:text-[16px] font-semibold text-white/90 hover:text-white transition-colors tracking-normal drop-shadow-sm hover:drop-shadow"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Shop Now Action Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={openModal}
            className="bg-white hover:bg-slate-100 text-[#0f172a] text-xs font-bold tracking-wider uppercase px-5 lg:px-6 py-2 sm:py-2.5 rounded-[6px] shadow-sm transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer font-montserrat"
          >
            SHOP NOW
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-white p-2 -mr-1 hover:bg-white/10 rounded-lg focus:outline-none transition-colors cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu with Backdrop */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40 transition-opacity pointer-events-auto"
            onClick={() => setOpen(false)}
          />
          <div
            className={`md:hidden fixed left-4 right-4 z-50 bg-black/95 border border-white/20 p-5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto ${
              scrolled ? "top-[72px]" : "top-[70px]"
            }`}
          >
            <nav className="flex flex-col gap-2 max-w-[1440px] mx-auto">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[16px] font-semibold text-white/90 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  openModal();
                }}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-[#0066cc] hover:bg-[#0052b3] active:bg-[#004799] text-white text-xs font-bold tracking-wider uppercase px-5 py-3.5 rounded-[8px] shadow-lg shadow-blue-600/30 cursor-pointer active:scale-98 transition-all font-montserrat"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
