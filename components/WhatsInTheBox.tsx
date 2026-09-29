"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [userPaused, setUserPaused] = useState(false);

  // Autoplay video on mount and when scrolled into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      if (!userPaused) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              setIsPlaying(false);
            });
        }
      }
    };

    attemptPlay();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !userPaused && video.paused) {
            attemptPlay();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [userPaused]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setUserPaused(false);
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      setUserPaused(true);
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
    <section id="whats-in-the-box" className="w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Video Player Card (Aligned within bounds)    */}
          {/* ========================================================= */}
          <ScrollReveal direction="right" className="w-full lg:w-auto shrink-0 flex justify-center">
            <div
              className="relative w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[340px] lg:w-[325px] h-[400px] xs:h-[430px] sm:h-[450px] lg:h-[460px] rounded-[9px] border-[0.75px] border-[#E5E7EB] shadow-[0_3px_12px_rgba(0,0,0,0.08)] overflow-hidden bg-slate-950 group cursor-pointer select-none"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                preload="auto"
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

              {/* Play / Pause Overlay Button */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isPlaying
                    ? "opacity-0 group-hover:opacity-100 bg-black/20"
                    : "opacity-100 bg-black/40"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 pointer-events-none">
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
// Pixel-Matched Vector Icons (Exact SVGs from Figma)
// -------------------------------------------------------------

function MachineIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="20" height="14" rx="2" stroke="#005DA6" strokeWidth="1.6"/>
      <path d="M8 8C8 6.89543 8.89543 6 10 6H18C19.1046 6 20 6.89543 20 8V10H8V8Z" stroke="#005DA6" strokeWidth="1.6"/>
      <circle cx="14" cy="17" r="2" stroke="#005DA6" strokeWidth="1.6"/>
    </svg>
  );
}

function FoamCannonIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1126_21)">
        <rect x="8" y="10" width="12" height="14" rx="2" stroke="#005DA6" strokeWidth="1.6"/>
        <path d="M10 6C10 5.44772 10.4477 5 11 5H17C17.5523 5 18 5.44772 18 6V9C18 9.55228 17.5523 10 17 10H11C10.4477 10 10 9.55228 10 9V6Z" stroke="#005DA6" strokeWidth="1.6"/>
        <path d="M14.1992 4.2002V2.8002" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M12.8008 1.2002H17.2008" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1126_21">
          <rect width="28" height="28" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function SprayGunIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="18" height="6" rx="2" stroke="#005DA6" strokeWidth="1.6"/>
      <rect x="14" y="12" width="6" height="12" rx="2" stroke="#005DA6" strokeWidth="1.6"/>
      <rect x="9" y="12" width="5" height="4" rx="1" stroke="#005DA6" strokeWidth="1.6"/>
    </svg>
  );
}

function NozzlesIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4.25" cy="10.5" r="2.5" stroke="#005DA6" strokeWidth="1.6"/>
      <circle cx="10.75" cy="10.5" r="2.5" stroke="#005DA6" strokeWidth="1.6"/>
      <circle cx="17.25" cy="10.5" r="2.5" stroke="#005DA6" strokeWidth="1.6"/>
      <circle cx="23.75" cy="10.5" r="2.5" stroke="#005DA6" strokeWidth="1.6"/>
      <line x1="4.8" y1="17.2" x2="23.2" y2="17.2" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="5.05" y1="13.8" x2="5.05" y2="17.2" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="11.55" y1="13.8" x2="11.55" y2="17.2" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="18.05" y1="13.8" x2="18.05" y2="17.2" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="24.55" y1="13.8" x2="24.55" y2="17.2" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function HoseIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="13" r="5" stroke="#005DA6" strokeWidth="1.6"/>
      <circle cx="19" cy="13" r="5" stroke="#005DA6" strokeWidth="1.6"/>
      <line x1="3.2" y1="13.8" x2="1.8" y2="13.8" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="24.8" y1="12.2" x2="26.2" y2="12.2" stroke="#005DA6" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function BatteryChargerIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9004 4C21.005 4 21.9004 4.89543 21.9004 6V18C21.9004 19.1046 21.005 20 19.9004 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H19.9004Z" stroke="#005DA6" strokeWidth="1.6"/>
      <path d="M13.4504 7.72168L9.40039 13.1217H13.0004L12.5504 16.7217L16.6004 11.3217H13.0004L13.4504 7.72168Z" stroke="#005DA6" strokeWidth="0.771429" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25 9C25.5523 9 26 9.44772 26 10V14C26 14.5523 25.5523 15 25 15H23.1405C22.5882 15 22.1405 14.5523 22.1405 14V10C22.1405 9.44772 22.5882 9 23.1405 9H25Z" stroke="#005DA6" strokeWidth="1.6"/>
    </svg>
  );
}
