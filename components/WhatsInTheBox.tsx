"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const BOX_ITEMS = [
  {
    icon: MachineIcon,
    title: "AquaForce 1400 PSI Machine",
    desc: "Powerful cordless pressure washer unit.",
  },
  {
    icon: FoamCannonIcon,
    title: "Foam Cannon",
    desc: "Pre-soak and lather with thick foam.",
  },
  {
    icon: SprayGunIcon,
    title: "High-Pressure Spray Gun",
    desc: "Ergonomic trigger gun for easy handling.",
  },
  {
    icon: NozzlesIcon,
    title: "4 Quick-Connect Nozzle Tips",
    desc: "Switch between spray patterns instantly.",
  },
  {
    icon: HoseIcon,
    title: "High-Pressure Hose",
    desc: "Durable hose with brass connectors.",
  },
  {
    icon: BatteryChargerIcon,
    title: "Battery Charger",
    desc: "Fast-charging adapter to keep you powered.",
  },
];

export default function WhatsInTheBox() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section id="whats-in-the-box" className="w-full bg-white py-14 sm:py-18 lg:py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12 lg:gap-14 xl:gap-16">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Video Player Card (Figma: card-freelance)    */}
          {/* ========================================================= */}
          <ScrollReveal direction="right" className="w-full lg:w-auto shrink-0 flex justify-center">
            <div
              className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[438px] sm:w-[438px] h-[480px] xs:h-[540px] sm:h-[620px] rounded-[9px] border-[0.75px] border-[#E5E7EB] shadow-[0_3px_12px_rgba(0,0,0,0.08)] overflow-hidden bg-slate-950 group cursor-pointer select-none"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                playsInline
                preload="metadata"
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover object-center"
              >
                <source
                  src="/aquaforceforgigworkers/yqbdeckv_wamidHBgMOTE3NTA2OTM5NzcxFQIAEhggQTUwMTYwOEE4ODY4RjU0NUNGNzgyNTY1MTk5MTQ4ODYA.mp4"
                  type="video/mp4"
                />
                <source
                  src="/yqbdeckv_wamidHBgMOTE3NTA2OTM5NzcxFQIAEhggQTUwMTYwOEE4ODY4RjU0NUNGNzgyNTY1MTk5MTQ4ODYA.mp4"
                  type="video/mp4"
                />
              </video>

              {/* Center Play Button Overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </div>
              </div>

              {/* Bottom Mute / Audio Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="absolute bottom-3.5 right-3.5 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </ScrollReveal>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Eyebrow + Heading + 6 Items Grid           */}
          {/* ========================================================= */}
          <ScrollReveal direction="left" className="w-full lg:max-w-[560px] xl:max-w-[600px] flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#0066cc]/50 font-montserrat text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#0F1729] bg-transparent mb-3.5 sm:mb-4 select-none">
              WHAT&apos;S INSIDE THE BOX?
            </div>

            {/* Main Heading (Exact Figma: Montserrat, 44px, 500 font-weight, 110% line-height, #0F1729, 508px width) */}
            <h2 className="text-[#0F1729] font-medium font-montserrat text-2xl xs:text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] tracking-tight max-w-[508px] mb-7 sm:mb-9 lg:mb-10">
              Everything You Need
              <br />
              to Get Started
            </h2>

            {/* 6 Grid Items: 2 Columns x 3 Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-10 xl:gap-x-12 gap-y-6 sm:gap-y-8 w-full max-w-[540px]">
              {BOX_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.title} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="mb-2 sm:mb-2.5 text-[#0066cc]">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
                    </div>
                    <h3 className="text-[#0F1729] font-bold font-montserrat text-[14.5px] sm:text-[15.5px] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[#4B5563] font-open-sans text-[12.5px] sm:text-[13px] leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Pixel-Matched Vector Icons (Matching Figma screenshots)
// -------------------------------------------------------------

function MachineIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="15" rx="2.5" />
      <path d="M8 6V4a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 4v2" />
      <circle cx="12" cy="13.5" r="2.75" />
      <path d="M12 11.5v2l1.25.75" />
    </svg>
  );
}

function FoamCannonIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2h4v3h-4z" />
      <path d="M12 5v3" />
      <path d="M8 8h8a1.5 1.5 0 0 1 1.5 1.5v.5a3 3 0 0 1-1 2.2V19a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-6.8a3 3 0 0 1-1-2.2v-.5A1.5 1.5 0 0 1 8 8z" />
      <path d="M9.5 14h5" />
    </svg>
  );
}

function SprayGunIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h13a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9l-3 8H2.5l2.5-8H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <path d="M17 9h4.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H17" />
      <path d="M8 13v3" />
    </svg>
  );
}

function NozzlesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4.5" cy="13.5" r="2.25" />
      <circle cx="9.5" cy="13.5" r="2.25" />
      <circle cx="14.5" cy="13.5" r="2.25" />
      <circle cx="19.5" cy="13.5" r="2.25" />
      <path d="M4.5 11.25V8.5" />
      <path d="M9.5 11.25V8.5" />
      <path d="M14.5 11.25V8.5" />
      <path d="M19.5 11.25V8.5" />
    </svg>
  );
}

function HoseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 12h2.5" />
      <path d="M20 12h2.5" />
      <path d="M18 8.5c2.76 0 4.5 1.57 4.5 3.5s-1.74 3.5-4.5 3.5c-3.1 0-5.05-3.5-6-3.5s-2.9 3.5-6 3.5C3.24 15.5 1.5 13.93 1.5 12s1.74-3.5 4.5-3.5c3.1 0 5.05 3.5 6 3.5s2.9-3.5 6-3.5z" />
    </svg>
  );
}

function BatteryChargerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="17" height="12" rx="2.5" />
      <path d="M22 10.5v3" />
      <path d="M11 9l-2.5 3.5h3L9 16" />
    </svg>
  );
}
