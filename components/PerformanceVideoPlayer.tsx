"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface PerformanceVideoPlayerProps {
  className?: string;
  videoSrc?: string;
}

export default function PerformanceVideoPlayer({
  className = "",
}: PerformanceVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState<0 | 1>(0); // 0 = Video, 1 = Product Image
  const [transitionState, setTransitionState] = useState<{
    isTransitioning: boolean;
    from: 0 | 1;
    to: 0 | 1;
  } | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Touch Swipe State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Unidirectional slide transition: always slides from right to left
  const switchSlide = useCallback(
    (target: 0 | 1) => {
      if (transitionState?.isTransitioning) return;
      if (target === activeSlide) return;

      const fromSlide = activeSlide;
      setTransitionState({
        isTransitioning: true,
        from: fromSlide,
        to: target,
      });
      setActiveSlide(target);

      // If returning to Video, reset and auto-play
      if (target === 0 && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    },
    [activeSlide, transitionState]
  );

  // Reset transition state after animation completes (650ms)
  useEffect(() => {
    if (!transitionState?.isTransitioning) return;
    const timer = setTimeout(() => {
      setTransitionState(null);
    }, 650);
    return () => clearTimeout(timer);
  }, [transitionState]);

  // Initial autoplay attempt
  useEffect(() => {
    if (activeSlide === 0) {
      const video = videoRef.current;
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeSlide]);

  // When video completes, auto-slide to Product Image from right to left
  const handleVideoEnded = () => {
    setIsPlaying(false);
    switchSlide(1);
  };

  // When on Product Image, auto-slide back to Video after 6 seconds from right to left
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeSlide === 1 && !transitionState?.isTransitioning) {
      timer = setTimeout(() => {
        switchSlide(0);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [activeSlide, transitionState, switchSlide]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Touch Swipe Handlers (always slide right-to-left)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) > 40) {
      // Swiping advances the slide in the right-to-left direction
      switchSlide(activeSlide === 0 ? 1 : 0);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Scoped CSS for strict right-to-left sliding animations */}
      <style>{`
        @keyframes slideOutToLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .anim-slide-out-left {
          animation: slideOutToLeft 650ms cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }
        .anim-slide-in-right {
          animation: slideInFromRight 650ms cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }
      `}</style>

      {/* Glow / Spotlight Background */}
      <div className="relative w-full flex flex-col items-center">
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] bg-white/80 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Outer Card Container / Viewport */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-[560px] lg:max-w-[580px] aspect-[16/10] sm:aspect-[4/3] flex items-center justify-center overflow-hidden rounded-[20px] sm:rounded-[24px]"
        >
          {/* Slide 0: Video Player Card */}
          <div
            className={`absolute inset-0 w-full h-full will-change-transform ${
              transitionState?.isTransitioning
                ? transitionState.from === 0
                  ? "anim-slide-out-left z-10 pointer-events-none"
                  : transitionState.to === 0
                  ? "anim-slide-in-right z-20 pointer-events-auto"
                  : "hidden"
                : activeSlide === 0
                ? "translate-x-0 z-10 pointer-events-auto"
                : "translate-x-full pointer-events-none invisible -z-10"
            }`}
          >
            <div className="w-full h-full bg-black rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/80 shadow-sm relative">
              <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnded}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer block"
              >
                <source
                  src="/aquaforceforgigworkers/ASMR_PROMEC_LAPTOP_compressed.mp4"
                  type="video/mp4"
                />
                <source src="/ASMR_PROMEC_LAPTOP_compressed.mp4" type="video/mp4" />
                <source
                  src="/aquaforceforgigworkers/ASMR%20PROMEC%20LAPTOP.mp4"
                  type="video/mp4"
                />
                <source src="/ASMR%20PROMEC%20LAPTOP.mp4" type="video/mp4" />
              </video>

              {/* Mute/Unmute Button (Video Slide Only) */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white transition-all transform hover:scale-105 active:scale-95 shadow-md border border-white/10 cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-20 flex items-center justify-between text-white pointer-events-none">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs transition-colors text-white cursor-pointer shrink-0 pointer-events-auto"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Toggle Fullscreen"
                  className="p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs transition-colors text-white cursor-pointer shrink-0 pointer-events-auto"
                >
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 1: Product Image (Clean, Transparent Background, Centered) */}
          <div
            onClick={() => switchSlide(0)}
            title="Click to watch video"
            className={`absolute inset-0 w-full h-full will-change-transform flex items-center justify-center bg-transparent cursor-pointer select-none ${
              transitionState?.isTransitioning
                ? transitionState.from === 1
                  ? "anim-slide-out-left z-10 pointer-events-none"
                  : transitionState.to === 1
                  ? "anim-slide-in-right z-20 pointer-events-auto"
                  : "hidden"
                : activeSlide === 1
                ? "translate-x-0 z-10 pointer-events-auto"
                : "translate-x-full pointer-events-none invisible -z-10"
            }`}
          >
            <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6">
              <img
                src="/aquaforceforgigworkers/images/Remainig%20images/features%20image.webp"
                alt="Aquaforce 1400 PSI TECH portable high pressure washer machine"
                className="w-full h-full max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        {/* WATCH THE CLEANING IN ACTION Divider */}
        <div className="flex items-center justify-center gap-3 mt-4 sm:mt-5 w-full max-w-[420px] px-4">
          <div className="h-[1px] bg-slate-400/60 flex-1" />
          <span className="text-[10px] sm:text-[11px] font-bold font-montserrat tracking-[0.18em] text-slate-700 uppercase whitespace-nowrap">
            WATCH THE CLEANING IN ACTION
          </span>
          <div className="h-[1px] bg-slate-400/60 flex-1" />
        </div>
      </div>
    </div>
  );
}
