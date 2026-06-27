"use client";

import React from "react";
import InteractiveAvatar from "@/components/InteractiveAvatar";
import ProjectSection from "@/components/ProjectSection";
import Marquee from "@/components/Marquee";
import GuestbookSection from "@/components/GuestbookSection";
import { Terminal, Zap, Message } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import ExperienceSection from "@/components/ExperienceSection";

export default function HomePage() {
  return (
    <main className="pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Main Welcome Box */}
        <section className="lg:col-span-8 bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-retro-orange border-b-3 border-black">
            <div className="flex items-center gap-2">
              {/* Pixelarticons: Terminal */}
              <Terminal className="text-white w-4 h-4 block" />
              <span className="font-mono font-bold text-sm text-white">welcome_message.txt</span>
            </div>
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 bg-red-500 border-2 border-black rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 border-2 border-black rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-retro-yellow border-2 border-black rounded font-pixel text-[8px] mb-6 rotate-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-retro-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-retro-lime"></span>
              </span>
              ACTIVE STATUS: FREELANCE OK
            </div>
            
            <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6 text-black">
              KAMI MEMBUAT PRODUK DIGITAL YANG <span className="underline decoration-retro-orange decoration-8">KLIK!</span>
            </h1>
            
            <p className="font-sans text-lg md:text-xl font-medium text-neutral-800 max-w-2xl mb-8 leading-relaxed">
              Halo! Saya <strong className="bg-retro-yellow px-1 border-2 border-black rounded font-mono font-bold">jackqqq</strong>, di balik bendera studio independen <strong className="text-retro-orange font-bold">jq works</strong>. Kami mendesain & mengembangkan website interaktif dengan performa kilat menggunakan teknologi Next.js & Tailwind CSS.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="#proyek" 
                onClick={() => playSynthSound("triangle", 220, 0.08)}
                className="px-6 py-3.5 font-syne font-black text-black bg-retro-orange border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] text-center w-full sm:w-auto flex items-center justify-center gap-2"
              >
                LIHAT PROJECT SAYA <Zap className="w-4 h-4" />
              </a>
              <a 
                href="#guestbook" 
                onClick={() => playSynthSound("triangle", 220, 0.08)}
                className="px-6 py-3.5 font-mono font-bold text-black bg-white border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] text-center w-full sm:w-auto flex items-center justify-center gap-2"
              >
                TINGGALKAN PESAN <Message className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Kolom Kanan: Avatar */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          <section className="bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden rotate-1 hover:rotate-0 transition-all duration-300">
            <div className="px-4 py-2 bg-retro-blue border-b-3 border-black flex justify-between items-center">
              <span className="font-mono font-bold text-xs text-white">jackqqq_avatar.png</span>
              <span className="bg-retro-lime text-black px-1.5 py-0.5 rounded text-[8px] border border-black font-pixel font-bold">LIVE</span>
            </div>
            <InteractiveAvatar />
          </section>

          <section className="bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden -rotate-1 hover:rotate-0 transition-all duration-300">
            <div className="px-4 py-2 bg-black border-b-3 border-black flex justify-between items-center text-white">
              <span className="font-mono text-xs font-bold">system_status.sys</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-2 text-black">
              <div className="flex justify-between border-b border-dashed border-neutral-300 pb-1">
                <span>ENGINE:</span>
                <span className="font-bold text-retro-orange">NEXT.JS 16</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-neutral-300 pb-1">
                <span>STYLING:</span>
                <span className="font-bold text-retro-blue">TAILWIND V4</span>
              </div>
              <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
                <span className="px-2 py-0.5 bg-retro-lime border border-black rounded text-[10px] font-bold">#REACT19</span>
                <span className="px-2 py-0.5 bg-retro-pink border border-black rounded text-[10px] font-bold">#NEO_BRUTALISM</span>
                <span className="px-2 py-0.5 bg-retro-yellow border border-black rounded text-[10px] font-bold">#RPL</span>
              </div>
            </div>
          </section>
        </div>

      </div>

      <ProjectSection />
      {/* Log Histori Pengalaman & Organisasi */}
      <ExperienceSection />
      <Marquee />
      <GuestbookSection />
    </main>
  );
}