"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [isHiding, setIsHiding] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;
    let isCancelled = false;

    // Lock scroll during preloading
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Run once from left to right for 850ms, then immediately reveal the page
    const sweepDuration = 850;

    hideTimer = setTimeout(() => {
      if (isCancelled) return;
      setIsHiding(true);

      // Unlock scroll as soon as the smooth fade-out begins
      document.documentElement.style.overflow = originalHtmlOverflow || "";
      document.body.style.overflow = originalBodyOverflow || "";

      finishTimer = setTimeout(() => {
        if (isCancelled) return;
        setIsFinished(true);
      }, 400);
    }, sweepDuration);

    return () => {
      isCancelled = true;
      clearTimeout(hideTimer);
      clearTimeout(finishTimer);
      document.documentElement.style.overflow = originalHtmlOverflow || "";
      document.body.style.overflow = originalBodyOverflow || "";
    };
  }, []);

  if (isFinished) return null;

  return (
    <div
      id="promec-preloader"
      aria-hidden={isHiding}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 99999,
        backgroundColor: "#000000",
        userSelect: "none",
        transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isHiding ? 0 : 1,
        pointerEvents: isHiding ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial ambient backdrop glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "360px",
          height: "360px",
          borderRadius: "9999px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />

      {/* PROMEC Logo - strictly centered at 50% / 50% for ZERO layout shift */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="47 227 430 40"
          width="240"
          height="22"
          style={{
            width: "min(240px, 75vw)",
            height: "auto",
            aspectRatio: "430 / 40",
            filter: "drop-shadow(0 2px 16px rgba(255, 255, 255, 0.12))",
            display: "block",
          }}
          role="img"
          aria-label="PROMEC"
        >
          <rect fill="#ffffff" x="47.81" y="227.93" width="228.12" height="38.73" />
          <path fill="#ffffff" d="m332.64,236.2h-.85l-15.53,12.79c-.46.23-.7.56-1.3.09-1.01-.79-16.06-12.88-16.06-12.88h-12.1l24.53,19.32s1.04,1.01,2.18.1c11.04-8.74,17.13-13.56,18.26-14.45.15-.11.31-.24.46-.35.06-.04.39,0,.39.12v.25c.04,2.72.02,17.19.02,17.19h8.53v-22.18h-8.53,0Z" />
          <path fill="#ffffff" d="m408.83,235.95h-39.29s-4.78.42-4.78,4.8v17.68h44.07v-4.15h-35.52v-5.86h35.52v-3.61h-35.52v-2.52s.08-2.3,2.29-2.3h33.23v-4.04Z" />
          <path fill="#ffffff" d="m475.71,235.95h-38.3s-4.93.12-4.93,5.04v17.44h43.23v-4.27h-34.7v-10.89s.05-3.33,3.25-3.33h31.44v-3.99h0Z" />
          <g>
            <path fill="#11100e" d="m213.69,235.95s-4.93.12-4.93,5.04v17.45h54.37v-22.48h-49.44Zm3.6,18.31v-11s.05-3.33,3.26-3.33h34.03l.02,14.33h-37.3Z" />
            <path fill="#11100e" d="m105.04,237.03c-1.82-.7-4.21-1.04-6-1.04h-39.4v22.55h8.54v-10.11h30.86c2.1,0,4.22-.34,6-1.03,1.76-.68,2.62-2,2.62-3.52v-2.89c0-1.54-.87-3.27-2.62-3.95Zm-5.91,6.01c0,.69-.37,1.12-1.1,1.37-.72.26-2.08.4-4.06.4h-25.78v-4.82s25.78,0,25.78,0c1.99,0,3.34.13,4.06.4.74.27,1.1.72,1.1,1.37v1.29Z" />
            <path fill="#11100e" d="m131.32,248.43v-3.62h34.33c1.95,0,3.31-.13,4.06-.38.74-.25,1.11-.72,1.11-1.4v-1.27c.01-.65-.35-1.1-1.09-1.37-.72-.27-2.07-.4-4.06-.4h-34.33v-4s39.38,0,39.38,0c3.88,0,4.98.47,5.99,1.04s2.64,1.81,2.64,3.34v3.95c0,1.52-1.59,2.81-2.64,3.3-1.06.5-2.09.81-5.99.81h-6.42l20.81,10.02h-14.54l-19.85-10.02h-10.86s-8.54,0-8.54,0Z" />
          </g>
        </svg>
      </div>

      {/* Moving Progress Bar Track & Runner - anchored exactly 22px below center */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% + 22px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(180px, 55vw)",
          height: "2px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          className="animate-preloader-slide"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "40%",
            backgroundColor: "#ffffff",
            borderRadius: "9999px",
            boxShadow: "0 0 12px 2px rgba(255, 255, 255, 0.95)",
            animation: "preloader-slide 0.85s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        />
      </div>
    </div>
  );
}
