"use client";

import React, { useState, useEffect, useRef } from "react";
import { User } from "pixelarticons/react";
import Image from "next/image";

export default function InteractiveAvatar() {
  const [mousePos, setMousePos] = useState({
    leftX: 62.5,
    leftY: 92.5,
    rightX: 137.5,
    rightY: 92.5,
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();

      const eyeL_x = rect.left + rect.width * (62.5 / 200);
      const eyeL_y = rect.top + rect.height * (92.5 / 200);
      const eyeR_x = rect.left + rect.width * (137.5 / 200);
      const eyeR_y = rect.top + rect.height * (92.5 / 200);

      const maxOffset = 6;

      const angleL = Math.atan2(e.clientY - eyeL_y, e.clientX - eyeL_x);
      const pupilLX = 62.5 + Math.cos(angleL) * maxOffset;
      const pupilLY = 92.5 + Math.sin(angleL) * maxOffset;

      const angleR = Math.atan2(e.clientY - eyeR_y, e.clientX - eyeR_x);
      const pupilRX = 137.5 + Math.cos(angleR) * maxOffset;
      const pupilRY = 92.5 + Math.sin(angleR) * maxOffset;

      setMousePos({
        leftX: pupilLX,
        leftY: pupilLY,
        rightX: pupilRX,
        rightY: pupilRY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-retro-yellow/30 relative h-full">
      {/* Coin-flip container */}
      <div
        className="relative w-44 h-44"
        style={{ perspective: "700px" }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {/* Inner flipper */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ── SISI DEPAN: Pixel SVG Avatar ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="w-full h-full bg-white border-3 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
          >
            <svg ref={svgRef} className="w-full h-full" viewBox="0 0 200 200">
              {/* Kepala */}
              <circle cx="100" cy="100" r="85" fill="#FDE047" stroke="black" strokeWidth="5" />

              {/* Frame Kacamata Retro */}
              <rect x="35" y="70" width="55" height="45" rx="10" fill="none" stroke="black" strokeWidth="6" />
              <rect x="110" y="70" width="55" height="45" rx="10" fill="none" stroke="black" strokeWidth="6" />
              <line x1="90" y1="90" x2="110" y2="90" stroke="black" strokeWidth="6" />

              {/* MATA KIRI */}
              <ellipse cx="62.5" cy="92.5" rx="18" ry="14" fill="white" stroke="black" strokeWidth="3" />
              <circle cx={mousePos.leftX} cy={mousePos.leftY} r="7" fill="black" />

              {/* MATA KANAN */}
              <ellipse cx="137.5" cy="92.5" rx="18" ry="14" fill="white" stroke="black" strokeWidth="3" />
              <circle cx={mousePos.rightX} cy={mousePos.rightY} r="7" fill="black" />

              {/* Pipi Merah */}
              <circle cx="45" cy="125" r="10" fill="#F472B6" opacity="0.8" />
              <circle cx="155" cy="125" r="10" fill="#F472B6" opacity="0.8" />

              {/* Senyum */}
              <path d="M 75 130 Q 100 155 125 130" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>

          {/* ── SISI BELAKANG: Foto Asli ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="w-full h-full bg-retro-orange border-3 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
          >
            <Image
              src="/jackqqq_avatar.png"
              alt="Foto Dzaky"
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback jika foto belum diupload: tampilkan initials
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Fallback: initials jika foto belum ada */}
            <span
              className="font-pixel text-white text-2xl select-none pointer-events-none"
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}
            >
              JQ
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center font-mono text-[11px] font-bold text-black border-2 border-black bg-white py-1 px-3 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5">
        <User className="w-3.5 h-3.5 text-black" />
        <span>{isFlipped ? "Halo!" : "Hover untuk lihat wajah asli!"}</span>
      </div>
    </div>
  );
}