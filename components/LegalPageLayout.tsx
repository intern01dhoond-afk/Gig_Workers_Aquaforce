"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { useOrderModal } from "@/context/OrderModalContext";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
  title: string;
  badge?: string;
  intro: string;
  children: React.ReactNode;
  lastUpdated?: string;
}

export default function LegalPageLayout({
  title,
  badge = "Official Policy",
  intro,
  children,
  lastUpdated = "March 2026",
}: LegalPageLayoutProps) {
  const { openModal } = useOrderModal();

  return (
    <div className="min-h-screen bg-[#0b0c0e] flex flex-col justify-between text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0b0c0e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 sm:py-4">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4">
          {/* Logo & Back */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden xs:inline">Back to Home</span>
            </Link>

            <div className="h-4 w-px bg-white/20 hidden xs:block" />

            <Link href="/" className="relative w-[125px] h-[28px] sm:w-[155px] sm:h-[32px] block">
              <Image
                src="/aquaforceforgigworkers/images/promec-logo.svg"
                alt="PROMEC"
                fill
                sizes="(max-width: 640px) 125px, 155px"
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 bg-[#005a9c] hover:bg-[#004b82] text-white text-xs sm:text-sm font-bold font-montserrat px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag size={14} className="shrink-0" />
            <span>Buy Now</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Document Header Hero */}
        <div className="text-center max-w-[740px] mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-400 mb-4 font-montserrat">
            <ShieldCheck size={14} />
            <span>{badge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-montserrat text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-open-sans leading-relaxed">
            {intro}
          </p>
          <div className="mt-4 text-xs text-slate-400 font-open-sans">
            Effective Date: <span className="text-white/80 font-medium">{lastUpdated}</span>
          </div>
        </div>

        {/* Policy Document Content Card */}
        <div className="bg-white text-slate-800 rounded-[20px] sm:rounded-[24px] shadow-2xl p-6 sm:p-10 lg:p-12 border border-slate-100 font-open-sans text-sm sm:text-[15px] leading-relaxed">
          {children}

          {/* Contact Box at the end of the document */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-base sm:text-lg font-bold font-montserrat text-slate-900 mb-3">
              Need Assistance?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5">
              For any queries, requests or clarifications regarding this policy, feel free to reach out to our team:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:promec.india@gmail.com"
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#005a9c] hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#005a9c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Email Us</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#005a9c] transition-colors break-all">
                    promec.india@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="tel:+917387588963"
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Call / WhatsApp</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    +91 73875 88963
                  </div>
                </div>
              </a>
            </div>

            <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-normal">
                <strong className="font-semibold text-slate-900 block">PROMEC Head Office</strong>
                13A, Plot No. 5A, beside Tata Motors Service Centre, M.I.D.C, MIDC, Hingna, Digdoh, Maharashtra 440016
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links to Other Policies */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-white/60 font-medium">
          <Link href="/terms-and-conditions" className="hover:text-white underline underline-offset-4 transition-colors">
            Terms &amp; Conditions
          </Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-white underline underline-offset-4 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/cancellation-policy" className="hover:text-white underline underline-offset-4 transition-colors">
            Cancellation Policy
          </Link>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
