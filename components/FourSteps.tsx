import Image from "next/image";
import ScrollReveal, { ScrollRevealStagger, ScrollRevealItem } from "./ScrollReveal";

const STEPS = [
  {
    n: "01",
    title: "Fill Water",
    desc: "Submerge the filter hose in any clean water bucket",
    imgSrc: "/aquaforceforgigworkers/images/steps/1.webp",
  },
  {
    n: "02",
    title: "Connect Hose",
    desc: "Click the quick connector into the coupling securely",
    imgSrc: "/aquaforceforgigworkers/images/steps/2.webp",
  },
  {
    n: "03",
    title: "Switch ON",
    desc: "Press the trigger lock to start the pressure pump.",
    imgSrc: "/aquaforceforgigworkers/images/steps/3.webp",
  },
  {
    n: "04",
    title: "Start Washing",
    desc: "Select your spray angle and sweep away the grit.",
    imgSrc: "/aquaforceforgigworkers/images/steps/4.webp",
  },
];

export default function FourSteps() {
  return (
    <section
      id="how-it-works"
      className="relative w-full min-h-[700px] xs:min-h-[780px] sm:min-h-[880px] lg:min-h-[1000px] flex flex-col justify-between pt-10 xs:pt-12 sm:pt-16 pb-6 xs:pb-8 sm:pb-10 lg:pb-12 bg-black overflow-hidden"
    >
      {/* Mobile Cinematic Background Image */}
      <div className="sm:hidden absolute inset-0 z-0">
        <Image
          src="/aquaforceforgigworkers/images/Remainig%20images/mobile%20banner%207.1.webp"
          alt="Aquaforce 4 Steps to Pristine Clean mobile background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
        {/* Gradient mask: stronger at bottom for card readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/50" />
      </div>

      {/* Desktop Cinematic Background Image */}
      <div className="hidden sm:block absolute inset-0 z-0">
        <Image
          src="/aquaforceforgigworkers/images/Remainig%20images/four-steps-desktop.webp"
          alt="Aquaforce on workshop workbench 4 Steps to Pristine Clean"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        {/* Gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
      </div>

      {/* Top Heading */}
      <ScrollReveal direction="down" className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-white">
          <span className="block font-open-sans text-xs xs:text-sm sm:text-lg lg:text-xl font-bold tracking-[0.22em] uppercase text-white/90 mb-1 drop-shadow">
            4 STEPS TO
          </span>
          <span className="block font-montserrat-alternates text-3xl xs:text-4xl sm:text-5xl lg:text-[67.23px] font-medium text-white tracking-normal drop-shadow-md leading-tight">
            Pristine Clean
          </span>
        </h2>
      </ScrollReveal>

      {/* Bottom 4-Step Image Cards — horizontal scroll on mobile, 4-col grid on desktop */}
      <ScrollReveal
        direction="up"
        delay={0.1}
        className="relative z-10 w-full max-w-[1440px] mx-auto sm:px-8 lg:px-[77px] mt-auto"
      >
        {/* ── Mobile: horizontal scroll ── */}
        <div className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pl-4 pr-4 pb-2 no-scrollbar">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="flex-none w-[45%] snap-start flex flex-col"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={step.imgSrc}
                  alt={step.title}
                  fill
                  sizes="45vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Title & Description */}
              <div className="mt-2.5">
                <h3 className="font-montserrat text-sm xs:text-base font-bold text-white leading-snug">
                  {step.title}
                </h3>
                <p className="font-open-sans text-[11px] xs:text-xs text-white/75 leading-snug mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: 4-col grid ── */}
        <ScrollRevealStagger
          className="hidden sm:grid sm:grid-cols-4 gap-5 lg:gap-7 max-w-[960px] mx-auto"
          staggerDelay={0.08}
        >
          {STEPS.map((step) => (
            <ScrollRevealItem key={step.n} className="flex flex-col">
              {/* Image Thumbnail */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={step.imgSrc}
                  alt={step.title}
                  fill
                  sizes="25vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Title & Description */}
              <div className="mt-3">
                <h3 className="font-open-sans text-base lg:text-[20px] font-bold text-white leading-snug">
                  {step.title}
                </h3>
                <p className="font-open-sans text-[13px] lg:text-sm text-white/70 leading-relaxed mt-1">
                  {step.desc}
                </p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </ScrollReveal>
    </section>
  );
}
