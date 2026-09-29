"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SaleTicker from "@/components/SaleTicker";
import StatsBar from "@/components/StatsBar";
import ProfessionalCleaning from "@/components/ProfessionalCleaning";
import ProblemsSolution from "@/components/ProblemsSolution";
import EngineeredPerformance from "@/components/EngineeredPerformance";
import FourSteps from "@/components/FourSteps";
import UseCase from "@/components/UseCase";
import DoorstepProfessionals from "@/components/DoorstepProfessionals";
import ComparisonTable from "@/components/ComparisonTable";
import CompactModules from "@/components/CompactModules";
import WhatsInTheBox from "@/components/WhatsInTheBox";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import MobileStickyBuyBar from "@/components/MobileStickyBuyBar";

export default function Home() {
  useEffect(() => {
    // Ensure the page always opens at the Hero section (top) on load
    if (typeof window !== "undefined" && !window.location.hash) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main>
      <Header />
      <Hero />
      <SaleTicker />
      <StatsBar />
      <ProfessionalCleaning />
      <ProblemsSolution />
      <EngineeredPerformance />
      <FourSteps />
      <UseCase />
      <DoorstepProfessionals />
      <ComparisonTable />
      <CompactModules />
      <WhatsInTheBox />
      <Testimonials />
      <CTABanner />
      <Footer />
      <MobileStickyBuyBar />
    </main>
  );
}
