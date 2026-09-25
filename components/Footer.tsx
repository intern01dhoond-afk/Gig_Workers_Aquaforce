"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import ReturnPolicyModal from "./ReturnPolicyModal";
import ScrollReveal from "./ScrollReveal";

export default function Footer() {
  const { openModal } = useOrderModal();
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#0b0c0e] text-white py-10 xs:py-14 sm:py-20 border-t border-white/5 w-full">
        <ScrollReveal direction="up" className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-[80px] flex flex-col items-center text-center">
          {/* AMEC TECHNOLOGY Brand Logo */}
          <div className="flex items-center gap-2 group mb-6 sm:mb-8 select-none">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src="/aquaforceforautocare/logo_shield.webp"
                alt="AMEC Shield"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <div className="relative w-32 sm:w-36 h-4 sm:h-5">
              <Image
                src="/aquaforceforautocare/logo_amec_new.webp"
                alt="AMEC TECHNOLOGY"
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 text-xs xs:text-sm font-medium text-white/80">
            <Link href="/#home" className="hover:text-white transition-colors py-1 px-1">
              Home
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors py-1 px-1">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors py-1 px-1">
              How It Works
            </Link>
            <button
              type="button"
              onClick={() => setIsReturnPolicyOpen(true)}
              className="hover:text-white transition-colors cursor-pointer font-medium focus:outline-none py-1 px-1"
            >
              Return Policy
            </button>
            <button
              type="button"
              onClick={openModal}
              className="hover:text-white transition-colors cursor-pointer font-medium focus:outline-none py-1 px-1"
            >
              Shop Now
            </button>
          </nav>

        {/* Divider Line */}
        <div className="w-full h-px bg-white/10 my-8 sm:my-10" />

        {/* Bottom Bar: Copyright on Left, Social Icons in Middle, Policy Links on Right */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-xs text-white/50">
          {/* Left: Copyright */}
          <div className="text-center lg:text-left">
            &copy; 2026 PROMEC. All rights reserved @ AMEC MOBILITY PRIVATE LIMITED
          </div>

          {/* Middle: Social Media Icons in order: Facebook, Instagram, X, LinkedIn, YouTube */}
          <div className="flex items-center gap-4 text-white/60">
            <a
              href="https://www.facebook.com/promecindia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors duration-200"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/promec.india"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors duration-200"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://x.com/promecindia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="hover:text-white transition-colors duration-200"
            >
              <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/promecindia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors duration-200"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://www.youtube.com/@PROMECIndia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-white transition-colors duration-200"
            >
              <Youtube size={17} />
            </a>
          </div>

          {/* Right: Policy Links separated by pipes */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-2 text-xs text-white/50">
            <a href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/20 select-none">|</span>
            <a href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Use
            </a>
            <span className="text-white/20 select-none">|</span>
            <a href="/cancellation-policy" className="hover:text-white transition-colors">
              Cancelation Policy
            </a>
            <span className="text-white/20 select-none">|</span>
            <a href="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </ScrollReveal>
    </footer>
    <ReturnPolicyModal isOpen={isReturnPolicyOpen} onClose={() => setIsReturnPolicyOpen(false)} />
  </>
  );
}
