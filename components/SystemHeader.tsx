"use client";

import React, { useState, useEffect } from "react";
import { Volume, Volume3, Clock } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

export default function SystemHeader() {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) {
      setSoundEnabled(saved === "true");
    } else {
      setSoundEnabled(false);
    }

    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000);

    // Scroll listener for floating effect and progress bar calculation
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearInterval(timerId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem("soundEnabled", String(nextState));
    if (nextState) {
      setTimeout(() => {
        playSynthSound("triangle", 220, 0.08);
      }, 50);
    }
  };

  return (
    <header className={`sticky top-0 z-40 select-none w-full transition-all duration-300 ease-in-out ${
      scrolled ? "pt-3 pb-1 bg-transparent px-4" : "pt-0 pb-0 bg-white"
    }`}>
      {/* Scroll Progress Bar at the absolute top of the screen */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-[#E5E7EB] z-50 border-b-2 border-black overflow-hidden">
        <div
          className="h-full bg-[#FF5C00] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Floating container with smooth transitions */}
      <div
        className={`mx-auto w-full transition-all duration-300 ease-in-out bg-white border-3 ${
          scrolled
            ? "max-w-5xl border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4"
            : "max-w-full border-transparent border-b-black rounded-none shadow-none px-4 md:px-8"
        }`}
      >
        <div className="flex items-center justify-between gap-4 w-full h-16">

          {/* Brand Logo */}
          <a
            href="#"
            onClick={() => playSynthSound("triangle", 220, 0.08)}
            className="flex items-center group transition-all !no-underline hover:!no-underline text-black shrink-0"
          >
            <span className="bg-retro-orange text-white px-3 py-1 font-mono font-bold text-base border-[3px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              [JQ_Works]
            </span>
          </a>

          {/* Right Control Block */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-sm shrink-0">
            
            {/* Desktop Navigation Container - Hidden on mobile/tablet (< md) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Proyek Button (Retro Yellow) */}
              <a
                href="#proyek"
                onClick={() => playSynthSound("triangle", 200, 0.05)}
                style={{ backgroundColor: "#FACC15", color: "#000000", textDecoration: "none" }}
                className="px-3.5 py-1.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-1.5deg] hover:rotate-0 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
              >
                Proyek
              </a>

              {/* Tentang Button (Retro Pink) */}
              <a
                href="#tentang-saya"
                onClick={() => playSynthSound("triangle", 180, 0.05)}
                style={{ backgroundColor: "#F472B6", color: "#000000", textDecoration: "none" }}
                className="px-3.5 py-1.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[1.5deg] hover:rotate-0 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
              >
                Tentang
              </a>

              {/* Keahlian Button (Retro Blue - Text White) */}
              <a
                href="#keahlian"
                onClick={() => playSynthSound("triangle", 190, 0.05)}
                style={{ backgroundColor: "#3B82F6", color: "#ffffff", textDecoration: "none" }}
                className="px-3.5 py-1.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] hover:rotate-0 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
              >
                Keahlian
              </a>

              {/* Prestasi Button (Retro Orange - Text White) */}
              <a
                href="#prestasi"
                onClick={() => playSynthSound("triangle", 210, 0.05)}
                style={{ backgroundColor: "#FF5C00", color: "#ffffff", textDecoration: "none" }}
                className="px-3.5 py-1.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[2.5deg] hover:rotate-0 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
              >
                Prestasi
              </a>
            </div>

            {/* Vertical separator */}
            <div className="hidden sm:block w-[1.5px] h-5 bg-neutral-300"></div>

            {/* System Clock */}
            <div className="hidden xl:flex items-center gap-1.5 bg-neutral-200 px-3 py-1 border-2 border-black rounded text-black font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="w-4 h-4 text-black block" />
              <span className="text-[12px] tracking-wide font-bold">{mounted ? time : "12:00:00 AM"}</span>
            </div>

            {/* Mute/Unmute Button */}
            <button
              id="sound-toggle"
              onClick={toggleSound}
              className="w-9 h-9 bg-retro-yellow border-[3px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer transition-all"
              title={soundEnabled ? "Mute Audio" : "Unmute Audio"}
            >
              {soundEnabled ? (
                <Volume className="w-5 h-5 text-black block" />
              ) : (
                <Volume3 className="w-5 h-5 text-black block" />
              )}
            </button>

            {/* Guestbook Link - Desktop only */}
            <a
              href="#guestbook"
              onClick={() => playSynthSound("triangle", 220, 0.08)}
              style={{ backgroundColor: "#A3E635", color: "#000000", textDecoration: "none" }}
              className="hidden md:inline-block px-4 py-1.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
            >
              Guestbook
            </a>

            {/* Hamburger Button - Mobile only (< md) */}
            <button
              onClick={() => {
                setDrawerOpen(!drawerOpen);
                playSynthSound("triangle", 300, 0.08);
              }}
              className="md:hidden w-9 h-9 bg-retro-lime border-[3px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center cursor-pointer transition-all shrink-0"
              title="Navigasi Menu"
            >
              {drawerOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="block text-black">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="block text-black">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Panel */}
      {drawerOpen && (
        <div className="absolute top-[76px] inset-x-4 md:hidden bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 z-50 flex flex-col gap-3 animate-fade-in">
          
          <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-300 pb-2 mb-1">
            <span className="font-mono text-[10px] text-neutral-400 font-bold">// SYSTEM_MENU.MNU</span>
            <span className="font-pixel text-[6px] bg-black text-white px-1.5 py-0.5 rounded border border-white">SELECT_ROUTE</span>
          </div>

          <a
            href="#proyek"
            onClick={() => {
              setDrawerOpen(false);
              playSynthSound("triangle", 200, 0.05);
            }}
            className="w-full text-center py-2.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer block"
            style={{ backgroundColor: "#FACC15", color: "#000000", textDecoration: "none" }}
          >
            Proyek
          </a>

          <a
            href="#tentang-saya"
            onClick={() => {
              setDrawerOpen(false);
              playSynthSound("triangle", 180, 0.05);
            }}
            className="w-full text-center py-2.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer block"
            style={{ backgroundColor: "#F472B6", color: "#000000", textDecoration: "none" }}
          >
            Tentang Saya
          </a>

          <a
            href="#keahlian"
            onClick={() => {
              setDrawerOpen(false);
              playSynthSound("triangle", 190, 0.05);
            }}
            className="w-full text-center py-2.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer block"
            style={{ backgroundColor: "#3B82F6", color: "#ffffff", textDecoration: "none" }}
          >
            Keahlian
          </a>

          <a
            href="#prestasi"
            onClick={() => {
              setDrawerOpen(false);
              playSynthSound("triangle", 210, 0.05);
            }}
            className="w-full text-center py-2.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer block"
            style={{ backgroundColor: "#FF5C00", color: "#ffffff", textDecoration: "none" }}
          >
            Prestasi
          </a>

          <a
            href="#guestbook"
            onClick={() => {
              setDrawerOpen(false);
              playSynthSound("triangle", 220, 0.08);
            }}
            className="w-full text-center py-2.5 font-mono font-bold uppercase tracking-wider text-xs border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer block"
            style={{ backgroundColor: "#A3E635", color: "#000000", textDecoration: "none" }}
          >
            Buku Tamu (Guestbook)
          </a>

        </div>
      )}
    </header>
  );
}