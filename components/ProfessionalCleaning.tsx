import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function ProfessionalCleaning() {
  return (
    <section id="why-section" className="py-10 sm:py-16 lg:py-[80px] bg-white w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
        {/* Top Eyebrow Badge */}
        <ScrollReveal direction="up" className="flex justify-center lg:justify-start mb-3 sm:mb-5">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-900 bg-transparent">
            WHY AQUAFORCE 1400?
          </div>
        </ScrollReveal>

        {/* Section Heading & Copy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-start text-center lg:text-left">
          <ScrollReveal direction="right" delay={0.05} className="lg:col-span-6 max-w-[611px] mx-auto lg:mx-0">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[48px] font-medium font-montserrat text-[#0F1729] leading-[1.18] lg:leading-[1.1] tracking-tight">
              <span className="sm:hidden">Professional Cleaning.<br />No Power Socket Needed.</span>
              <span className="hidden sm:inline lg:hidden">Professional Cleaning. No Power Socket Needed.</span>
              <span className="hidden lg:inline">
                Professional Cleaning.
                <br />
                No Power Socket
                <br />
                Needed.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1} className="lg:col-span-6 max-w-[649px] font-open-sans text-[#333340] text-sm xs:text-[15px] sm:text-lg lg:text-[20px] font-normal leading-relaxed space-y-3 sm:space-y-5 pt-1 mx-auto lg:mx-0">
            <p>
              Traditional cleaning jobs depend on power access, making it difficult for gig workers to clean vehicles in open areas, parking lots or societies.
            </p>
            <p>
              AquaForce 1400 changes that. Its integrated lithium-ion battery powers the pressure pump, allowing you to carry the machine wherever the job takes you and start cleaning without depending on a power socket.
            </p>
          </ScrollReveal>
        </div>

        {/* Bottom Image Cards */}
        <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 mt-8 sm:mt-12 w-full">
          {/* Left Wide Card (1st image) */}
          <ScrollReveal direction="zoom" delay={0.05} className="w-full lg:w-[940px] h-[210px] xs:h-[250px] sm:h-[300px] lg:h-[364px] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md shrink-0">
            {/* Mobile View */}
            <Image
              src="/aquaforceforautocare/images/Remainig%20images/12%20Mobile.webp"
              alt="Car detailing with high pressure water spray outdoors"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 940px"
              className="object-cover lg:hidden"
            />
            {/* Desktop View */}
            <Image
              src="/aquaforceforautocare/images/Remainig%20images/12.webp"
              alt="Car detailing with high pressure water spray outdoors"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 940px"
              className="object-cover hidden lg:block"
            />
          </ScrollReveal>

          {/* Right Card (2nd image) */}
          <ScrollReveal direction="zoom" delay={0.15} className="w-full lg:w-[324px] h-[210px] xs:h-[250px] sm:h-[300px] lg:h-[364px] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md shrink-0">
            {/* Mobile View */}
            <Image
              src="/aquaforceforautocare/images/Remainig%20images/Moto%20mobile.webp"
              alt="Aquaforce motorcycle washing cordless power"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 324px"
              className="object-cover object-center lg:hidden"
            />
            {/* Desktop View */}
            <Image
              src="/aquaforceforautocare/images/use-cases/2.webp"
              alt="Aquaforce motorcycle washing cordless power"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 324px"
              className="object-cover object-center hidden lg:block"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
