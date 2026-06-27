"use client";

import React from "react";
import { Server, Terminal, Trophy, ArrowUp } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

export default function SystemFooter() {
  return (
    <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-24 pb-12">
      <div className="bg-black text-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(255,92,0,1)] overflow-hidden">
        
        {/* Top Bar Footer */}
        <div className="bg-neutral-900 px-4 py-2 border-b-2 border-neutral-800 flex items-center justify-between font-mono text-[10px] text-neutral-400">
          <div className="flex items-center gap-2">
            {/* Pixelarticons: HardDrive */}
            <Server className="text-retro-orange w-4 h-4 block" />
            <span>DISK_USAGE: 42.9% // PATH: /home/jackqqq/portfolio</span>
          </div>
          <span className="hidden sm:inline bg-retro-orange text-black font-bold px-1 rounded font-pixel text-[6px]">
            V1.0.0-STABLE
          </span>
        </div>

        {/* Konten Utama Footer */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-retro-orange font-syne text-xl font-black uppercase tracking-tight">
              {/* Pixelarticons: Command Terminal */}
              <Terminal className="text-retro-orange w-5 h-5 block" />
              <span>jq works // mochammad dzaky azzam</span>
            </div>
            <p className="font-mono text-xs text-neutral-400 leading-relaxed max-w-xl">
              Siswa Rekayasa Perangkat Lunak (RPL) SMK Telkom Malang. Berfokus pada arsitektur kode full-stack yang bersih, pengembangan sistem IoT interaktif, serta produksi media kreatif.
            </p>
            
            {/* Ticker Prestasi dengan Ikon Trofi Piksel */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded font-mono text-[10px] text-retro-yellow">
                <Trophy className="w-3.5 h-3.5 block mr-1" /> Finalis FIKSI 2026 (OrchiCare)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded font-mono text-[10px] text-retro-blue">
                <Trophy className="w-3.5 h-3.5 block mr-1" /> Drone Finalis ASEAN Malaysia
              </span>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col sm:items-end gap-4">
            <div className="font-mono text-xs text-left sm:text-right">
              <span className="text-neutral-500 block">DEVELOPER METRICS via WakaTime:</span>
              <span className="text-retro-lime font-bold">~48 hrs/week of active coding</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a 
                href="https://github.com/jackqqq" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSynthSound("triangle", 220, 0.08)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-600 rounded font-mono font-bold text-xs text-white flex items-center gap-2 transition-colors shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
              >
                {/* NES.css: Github Icon */}
                <i className="nes-icon github scale-75 block"></i> GitHub Profil
              </a>
              
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  playSynthSound("triangle", 220, 0.08);
                }}
                className="px-4 py-2 bg-retro-orange text-black font-syne font-black border-2 border-black rounded text-xs shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] transition-all flex items-center justify-center gap-1.5"
              >
                BOOT_TO_TOP <ArrowUp className="w-3.5 h-3.5 block" />
              </button>
            </div>
          </div>

        </div>

        <div className="bg-neutral-950 px-6 py-4 border-t border-neutral-800 text-center font-mono text-[11px] text-neutral-500">
          © {new Date().getFullYear()} JQ WORKS. ALL RIGHTS RESERVED. RUNNING ON NEXT.JS 16 & TAILWIND V4.
        </div>

      </div>
    </footer>
  );
}