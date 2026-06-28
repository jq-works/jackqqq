"use client";

import React, { useState, useEffect } from "react";
import { Volume, Volume3, Clock } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

export default function SystemHeader() {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    // Scroll listener untuk efek floating
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearInterval(timerId);
      window.removeEventListener("scroll", onScroll);
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
    <header className="sticky top-0 z-40 select-none transition-all duration-300"
      style={scrolled ? { paddingTop: "10px", paddingBottom: "10px", backgroundColor: "transparent" } : {}}
    >
      {/* Inner wrapper — menjadi floating box saat scroll */}
      <div
        className="transition-all duration-300"
        style={
          scrolled
            ? {
                maxWidth: "900px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                border: "3px solid #000000",
                borderRadius: "12px",
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }
            : {
                backgroundColor: "#ffffff",
                borderBottom: "3px solid #000000",
              }
        }
      >
        <div className="px-4 py-3 md:px-6 flex items-center justify-between gap-4 w-full h-16">

          {/* Brand Logo */}
          <a
            href="#"
            onClick={() => playSynthSound("triangle", 220, 0.08)}
            className="flex items-center group transition-all !no-underline hover:!no-underline text-black"
          >
            <span className="bg-retro-orange text-white px-3 py-1 font-mono font-bold text-base border-[3px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              [jq_works]
            </span>
          </a>

          {/* Blok Kontrol Kanan */}
          <div className="flex items-center gap-3 font-mono text-sm">

            {/* Jam Sistem */}
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-200 px-3 py-1 border-2 border-black rounded text-black font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="w-4 h-4 text-black block" />
              <span className="text-[13px] tracking-wide font-bold">{mounted ? time : "12:00:00 AM"}</span>
            </div>

            {/* Tombol Mute/Unmute */}
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

            {/* Proyek */}
            <a
              href="#proyek"
              onClick={() => playSynthSound("triangle", 220, 0.08)}
              style={{ backgroundColor: "#ffffff", color: "#000000", textDecoration: "none" }}
              className="px-4 py-1.5 font-bold border-[3px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Proyek
            </a>

            {/* Guestbook */}
            <a
              href="#guestbook"
              onClick={() => playSynthSound("triangle", 220, 0.08)}
              style={{ backgroundColor: "#A3E635", color: "#000000", textDecoration: "none" }}
              className="px-4 py-1.5 font-bold border-[3px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Guestbook
            </a>

          </div>
        </div>
      </div>
    </header>
  );
}