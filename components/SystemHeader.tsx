"use client";

import React, { useState, useEffect } from "react";
import { Computer, Volume3, Volume, Clock } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

export default function SystemHeader() {
  const [time, setTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) {
      setSoundEnabled(saved === "true");
    } else {
      localStorage.setItem("soundEnabled", "true");
    }

    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString("id-ID", options));
    };

    updateClock();
    const timerId = setInterval(updateClock, 1000);
    return () => clearInterval(timerId);
  }, []);

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem("soundEnabled", String(newVal));
    if (newVal) {
      playSynthSound("triangle", 220, 0.08);
    }
  };

  return (
    <header className="w-full bg-white border-b-3 border-black sticky top-0 z-50 px-4 md:px-8 py-2.5 flex items-center justify-between shadow-[0_2px_0_0_rgba(0,0,0,1)]">
      
      {/* Sisi Kiri: Branding Khas Retro OS */}
      <div className="flex items-center gap-6">
        <a 
          href="#" 
          onClick={() => playSynthSound("triangle", 220, 0.08)}
          className="flex items-center gap-2 group"
        >
          <div className="bg-retro-orange p-1 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
            {/* Pixelarticons: Device Laptop / Gadget */}
            <Computer className="text-white w-4 h-4 block" />
          </div>
          <span className="font-pixel text-[11px] font-bold text-black tracking-wider">
            jq_works.sys
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-4 font-mono text-xs font-bold">
          <a 
            href="#proyek" 
            onClick={() => playSynthSound("triangle", 220, 0.08)}
            className="px-2 py-1 border-2 border-transparent hover:border-black hover:bg-retro-yellow rounded transition-all"
          >
            [Etalase_Karya]
          </a>
          <a 
            href="#guestbook" 
            onClick={() => playSynthSound("triangle", 220, 0.08)}
            className="px-2 py-1 border-2 border-transparent hover:border-black hover:bg-retro-pink rounded transition-all"
          >
            [Buku_Tamu]
          </a>
        </nav>
      </div>

      {/* Sisi Kanan: Utilitas Sistem */}
      <div className="flex items-center gap-4">
        
        <button
          onClick={toggleSound}
          className={`px-2.5 py-1 border-2 border-black rounded font-mono text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all ${
            soundEnabled ? "bg-retro-lime text-black" : "bg-neutral-200 text-neutral-500"
          }`}
        >
          {soundEnabled ? (
            <>
              {/* Pixelarticons: Volume Loud */}
              <Volume3 className="text-black w-4 h-4 block" />
              <span>AUDIO: ON</span>
            </>
          ) : (
            <>
              {/* Pixelarticons: Volume X / Mute */}
              <Volume className="w-4 h-4 block" />
              <span>AUDIO: MUTED</span>
            </>
          )}
        </button>

        {/* Kotak Jam Digital Sistem */}
        <div className="px-3 py-1 bg-black text-retro-lime border-2 border-black rounded font-mono text-xs font-bold tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          {/* Pixelarticons: Clock */}
          <Clock className="text-retro-lime w-4 h-4 block" />
          <span>{time || "00:00:00"}</span>
        </div>

      </div>
    </header>
  );
}