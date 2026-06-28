"use client";

import React from "react";
import { FaInstagram, FaTiktok, FaGithub, FaLinkedin } from "react-icons/fa6";
import { playSynthSound } from "@/lib/audio";

export default function SocialMedia() {
  const socialChannels = [
    {
      name: "INSTAGRAM",
      handle: "@dzakyazzam_",
      profileName: "Mochammad Dzaky Azzam",
      actionText: "OPEN_FEED ↗",
      url: "https://instagram.com/dzakyazzam_",
      frontBg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
      backBg: "bg-white text-black",
      badgeStyle: "bg-black text-white border-transparent",
      icon: <FaInstagram size={48} className="text-white" />
    },
    {
      name: "TIKTOK",
      handle: "@one_lens",
      profileName: "OneLens Media",
      actionText: "WATCH_CLIPS ↗",
      url: "https://tiktok.com",
      frontBg: "bg-[#000000] text-white border-2 border-neutral-900",
      backBg: "bg-white text-black",
      badgeStyle: "bg-[#00f2fe] text-black border-black",
      icon: <FaTiktok size={44} className="text-white" />
    },
    {
      name: "GITHUB",
      handle: "@JQWorks",
      profileName: "JQ Works Open Source",
      actionText: "VIEW_CODE ↗",
      url: "https://github.com",
      frontBg: "bg-[#24292e] text-white",
      backBg: "bg-white text-black",
      badgeStyle: "bg-[#24292e] text-white border-black",
      icon: <FaGithub size={48} className="text-white" />
    },
    {
      name: "LINKEDIN",
      handle: "Mochammad Dzaky Azzam",
      profileName: "Professional Network",
      actionText: "CONNECT ↗",
      url: "https://linkedin.com",
      frontBg: "bg-[#0077b5] text-white",
      backBg: "bg-white text-black",
      badgeStyle: "bg-[#0077b5] text-white border-black",
      icon: <FaLinkedin size={48} className="text-white" />
    }
  ];

  return (
    <section id="social-hub" className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-16 select-none">
      
      {/* GRID CONFIGURATION: OTOMATIS MENJADI 4 KOLOM DI DESKTOP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialChannels.map((platform, idx) => (
          <div
            key={idx}
            onMouseEnter={() => playSynthSound("sine", 400 + idx * 40, 0.05)}
            className="w-full h-48 [perspective:1000px] group cursor-pointer"
          >
            {/* CONTAINER UTAMA KARTU YANG BERPUTAR */}
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              
              {/* ==================== SISI DEPAN (FRONT CARD) ==================== */}
              <div className={`${platform.frontBg} absolute inset-0 w-full h-full [backface-visibility:hidden] border-[4px] border-black rounded-[24px] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-5`}>
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                
                <div className="scale-100 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {platform.icon}
                </div>
                <span className="font-syne text-xs font-black tracking-widest uppercase mt-4 relative z-10">
                  {platform.name}
                </span>
              </div>

              {/* ==================== SISI BELAKANG (BACK CARD) ==================== */}
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSynthSound("square", 600, 0.1)}
                className={`${platform.backBg} absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] border-[4px] border-black rounded-[24px] shadow-[[-5px_5px_0px_0px_rgba(0,0,0,1)]] p-5 flex flex-col justify-between !no-underline`}
              >
                {/* Header Atas Sisi Belakang */}
                <div className="flex items-center justify-between w-full border-b-2 border-dashed border-neutral-300 pb-2">
                  <span className="font-pixel text-[8px] text-neutral-400 tracking-wider">// SYSTEM_NET</span>
                  <span className={`font-mono text-[9px] font-black px-2 py-0.5 rounded-md border border-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${platform.badgeStyle}`}>
                    {platform.actionText}
                  </span>
                </div>

                {/* Konten Utama Nama Profil & Username */}
                <div className="space-y-0.5 flex-1 flex flex-col justify-center">
                  <h4 className="font-syne text-sm font-black uppercase text-black leading-tight tracking-tight line-clamp-2">
                    {platform.profileName}
                  </h4>
                  <p className="font-mono text-[11px] font-bold text-retro-orange bg-retro-orange/10 px-2 py-0.5 rounded border border-retro-orange/30 w-fit truncate max-w-full">
                    {platform.handle}
                  </p>
                </div>

                {/* Footer Indikator Kecil */}
                <div className="font-mono text-[9px] font-bold text-neutral-400 uppercase pt-2 border-t border-neutral-100 flex justify-between items-center">
                  <span>ROUTING.LOG</span>
                  <span className="text-black text-[10px]">REDIRECT ↗</span>
                </div>
              </a>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}