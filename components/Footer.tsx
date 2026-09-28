"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import ReturnPolicyModal from "./ReturnPolicyModal";

export default function Footer() {
  const { openModal } = useOrderModal();
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#0b0c0e] text-white pt-12 sm:pt-16 pb-8 sm:pb-10 w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center">
          {/* PROMEC Brand Logo */}
          <Link href="/#home" className="flex items-center justify-center group mb-6 sm:mb-7 select-none cursor-pointer">
            <div className="relative w-[130px] h-[24px] sm:w-[150px] sm:h-[28px]">
              <Image
                src="/aquaforceforgigworkers/images/promec-logo.svg"
                alt="PROMEC"
                fill
                sizes="(max-width: 640px) 130px, 150px"
                className="object-contain object-center"
              />
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 text-xs sm:text-[13px] font-medium font-montserrat text-white/80">
            <Link href="/#home" className="hover:text-white transition-colors py-1">
              Home
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors py-1">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors py-1">
              How It Works
            </Link>
            <button
              type="button"
              onClick={() => setIsReturnPolicyOpen(true)}
              className="hover:text-white transition-colors cursor-pointer font-medium focus:outline-none py-1"
            >
              Return Policy
            </button>
            <button
              type="button"
              onClick={openModal}
              className="hover:text-white transition-colors cursor-pointer font-medium focus:outline-none py-1"
            >
              Buy Now
            </button>
          </nav>

          {/* Contact Row (Email on Left, Phone on Right) */}
          <div className="w-full flex flex-col xs:flex-row items-center justify-between gap-3 text-xs sm:text-[13px] text-white/70 font-montserrat mt-8 sm:mt-10 mb-4 sm:mb-5">
            <a
              href="mailto:promec.india@gmail.com"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
              <span>promec.india@gmail.com</span>
            </a>

            <a
              href="tel:+917387588963"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
              <span>+91 7387588963</span>
            </a>
          </div>

          {/* Divider Line */}
          <div className="w-full h-px bg-white/10 mb-4 sm:mb-5" />

          {/* Bottom Bar: Copyright on Left, Social Icons in Middle, Policy Links on Right */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 text-[11px] sm:text-xs text-white/50 font-montserrat">
            {/* Left: Copyright */}
            <div className="text-center lg:text-left lg:flex-1">
              &copy; 2026 PROMEC. All rights reserved @ AMEC MOBILITY PRIVATE LIMITED
            </div>

            {/* Middle: Social Media Icons in order: Facebook, Instagram, X, LinkedIn, YouTube */}
            <div className="flex items-center justify-center gap-5 text-white/60 lg:flex-1">
              <a
                href="https://www.facebook.com/promecindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white transition-colors duration-200"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://www.instagram.com/promec.india"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors duration-200"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://x.com/promecindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-white transition-colors duration-200"
              >
                <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
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
                <Linkedin size={15} />
              </a>
              <a
                href="https://www.youtube.com/@PROMECIndia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-white transition-colors duration-200"
              >
                <Youtube size={16} />
              </a>
            </div>

            {/* Right: Policy Links separated by pipes */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-2 text-[11px] sm:text-xs text-white/50 lg:flex-1">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/20 select-none">|</span>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <span className="text-white/20 select-none">|</span>
              <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                Cancelation Policy
              </Link>
              <span className="text-white/20 select-none">|</span>
              <Link href="/refund-policy" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <ReturnPolicyModal isOpen={isReturnPolicyOpen} onClose={() => setIsReturnPolicyOpen(false)} />
    </>
  );
}
