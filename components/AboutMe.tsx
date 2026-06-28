"use client";

import React from "react";
import { User, Terminal, Camera, Trophy, Zap } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

export default function AboutMe() {
  return (
    <section id="tentang-saya" className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24 select-none scroll-mt-24">
      
      {/* OS Windows Style Container untuk About Me */}
      <div className="bg-white border-[3px] border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* OS Top Bar Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-retro-blue border-b-[3px] border-black">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-white block" />
            <span className="font-mono font-bold text-sm text-white">about_me.sys</span>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-neutral-300 border-2 border-black rounded-full"></div>
            <div className="w-3 h-3 bg-neutral-300 border-2 border-black rounded-full"></div>
          </div>
        </div>

        {/* Isi Utama Konten */}
        <div className="p-6 md:p-8 bg-white">
          
          {/* Deskripsi Profil Utama */}
          <div className="mb-8 border-b-2 border-dashed border-neutral-300 pb-6">
            <h2 className="font-syne text-3xl font-black text-black uppercase mb-4 tracking-tight">
              SIAPA SAYA?
            </h2>
            <p className="font-sans text-base md:text-lg font-medium text-neutral-800 leading-relaxed">
              Halo! Saya <span className="inline-block"><strong className="inline-block bg-retro-yellow px-1.5 py-0.5 border-2 border-black rounded font-mono font-bold whitespace-nowrap">Mochammad Dzaky Azzam</strong>,</span> seorang Full-Stack Developer dan Multimedia Specialist yang berbasis di Malang. Saya fokus membangun aplikasi web modern yang cepat serta mengemas kebutuhan visual kreatif secara utuh melalui <span className="text-retro-orange font-bold">JQ Works</span>.
            </p>
          </div>

          {/* Sub-judul Aktivitas */}
          <h3 className="font-syne text-xl font-black text-black uppercase mb-6 tracking-wide flex items-center gap-2">
            <Zap className="w-5 h-5 block" /> YANG SAYA LAKUKAN:
          </h3>

          {/* Grid Layanan / Keahlian (Bento Grid Mini) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Kartu 1: Web Development (Menggunakan Terminal) */}
            <div 
              onClick={() => playSynthSound("square", 330, 0.1)}
              className="bg-white border-[3px] border-black rounded-lg p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 bg-retro-orange text-white border-2 border-black rounded flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Terminal className="w-5 h-5 block" />
              </div>
              <h4 className="font-syne text-lg font-bold uppercase mb-2 group-hover:text-retro-orange transition-colors">
                Web Development
              </h4>
              <p className="font-sans text-xs md:text-sm font-medium text-neutral-600 leading-relaxed">
                Terbiasa membangun arsitektur web dari backend hingga front-end yang interaktif menggunakan React, Next.js, Tailwind CSS, Express, dan PHP/MySQL.
              </p>
            </div>

            {/* Kartu 2: Multimedia & Visual */}
            <div 
              onClick={() => playSynthSound("square", 440, 0.1)}
              className="bg-white border-[3px] border-black rounded-lg p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 bg-retro-yellow text-black border-2 border-black rounded flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Camera className="w-5 h-5 block" />
              </div>
              <h4 className="font-syne text-lg font-bold uppercase mb-2 group-hover:text-retro-orange transition-colors">
                Multimedia & Visual
              </h4>
              <p className="font-sans text-xs md:text-sm font-medium text-neutral-600 leading-relaxed">
                Memiliki keahlian dalam videografi dan drone piloting untuk menghasilkan aset konten visual yang memikat.
              </p>
            </div>

            {/* Kartu 3: Project Experience */}
            <div 
              onClick={() => playSynthSound("square", 554, 0.1)}
              className="bg-white border-[3px] border-black rounded-lg p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 bg-retro-lime text-black border-2 border-black rounded flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-5 h-5 block" />
              </div>
              <h4 className="font-syne text-lg font-bold uppercase mb-2 group-hover:text-retro-orange transition-colors">
                Project Experience
              </h4>
              <p className="font-sans text-xs md:text-sm font-medium text-neutral-600 leading-relaxed">
                Pendiri <strong className="text-black font-bold">OneLens Media</strong>, sebuah startup yang menyediakan layanan professional live streaming sebagai media partner untuk berbagai event.
              </p>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}