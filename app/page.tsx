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

          <div className="p-6 md:p-10">

            {/* Badge: AVAILABLE FOR FREELANCE */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded font-pixel text-[8px] mb-8 rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: "#FACC15" }}
            >
              {/* Dot status inline — bypass NES.css */}
              <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", flexShrink: 0 }}>
                <span
                  className="animate-ping"
                  style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "9999px", backgroundColor: "#A3E635", opacity: 0.75 }}
                />
                <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#A3E635" }} />
              </span>
              AVAILABLE FOR FREELANCE
            </div>

            {/* H1 Headline — Syne extrabold, uppercase, orange underline */}
            <h1 className="font-syne text-6xl font-extrabold tracking-tight leading-[1.1] text-black uppercase" style={{ marginBottom: "2.5rem" }}>
              CRAFTING DIGITAL
              <br />
              <span
                className="px-2 rounded"
                style={{ backgroundColor: "#FF5C00", color: "#ffffff" }}
              >
                PRODUCTS.
              </span>
            </h1>

            {/* Subtext */}
            <p className="font-sans text-base md:text-lg font-medium text-neutral-700 max-w-xl mb-8 leading-relaxed">
              Halo! Saya{" "}
              <strong
                className="font-mono font-bold border-2 border-black rounded px-1.5 py-0.5"
                style={{ backgroundColor: "#FACC15", color: "#000000" }}
              >
                Jackqqq
              </strong>
              , seorang{" "}
              <span className="font-bold text-black">Full-Stack Dev</span>{" "}
              &amp; Multimedia Specialist. Saya membangun web yang skalabel
              sekaligus visual yang{" "}
              <span
                className="font-bold"
                style={{ color: "#FF5C00" }}
              >
                berdampak nyata
              </span>{" "}
              melalui{" "}
              <strong className="font-syne font-extrabold text-black">JQ Works</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Primer: Retro Orange */}
              <a
                href="#proyek"
                onClick={() => playSynthSound("triangle", 220, 0.08)}
                style={{ backgroundColor: "#FF5C00", color: "#000000", textDecoration: "none" }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-syne font-black border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none w-full sm:w-auto text-sm tracking-wide"
              >
                LIHAT PROJECT SAYA <Zap className="w-4 h-4" />
              </a>

              {/* Sekunder: Putih bersih */}
              <a
                href="#guestbook"
                onClick={() => playSynthSound("triangle", 220, 0.08)}
                style={{ backgroundColor: "#ffffff", color: "#000000", textDecoration: "none" }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-mono font-bold border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none w-full sm:w-auto text-sm tracking-wide"
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
              <span className="font-mono text-xs font-bold">user_profile.sys</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-2 text-black">
              <div className="flex justify-between border-b border-dashed border-neutral-300 pb-1">
                <span>NAME:</span>
                <span className="font-bold text-retro-orange">MOCHAMMAD DZAKY AZZAM</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-neutral-300 pb-1">
                <span>MAIL:</span>
                <span className="font-bold text-retro-blue">jackq.works@gmail.com</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-neutral-300 pb-1">
                <span>PHONE:</span>
                <span className="font-bold text-retro-blue">+62 851-1123-2385</span>
              </div>
              <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
                <span className="px-2 py-0.5 bg-retro-lime border border-black rounded text-[10px] font-bold">#FULLSTACK</span>
                <span className="px-2 py-0.5 bg-retro-pink border border-black rounded text-[10px] font-bold">#MULTIMEDIA</span>
                <span className="px-2 py-0.5 bg-retro-yellow border border-black rounded text-[10px] font-bold">#QA</span>
                <span className="px-2 py-0.5 bg-retro-blue border border-black rounded text-[10px] font-bold">#MALANG</span>
              </div>

              {/* Social Media Buttons */}
              <div className="pt-3 border-t border-dashed border-neutral-300 mt-2 flex gap-2 justify-center">
                {/* GitHub */}
                <a
                  href="https://github.com/jq-works"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSynthSound("triangle", 330, 0.07)}
                  style={{ backgroundColor: "#1a1a1a", color: "#ffffff", textDecoration: "none" }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-[9px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  GITHUB
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/mdzakyazzam"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSynthSound("triangle", 330, 0.07)}
                  style={{ backgroundColor: "#0077B5", color: "#ffffff", textDecoration: "none" }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-[9px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LINKEDIN
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/jackqqqq_"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSynthSound("triangle", 330, 0.07)}
                  style={{ background: "linear-gradient(135deg, #E1306C, #833AB4)", color: "#ffffff", textDecoration: "none" }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-[9px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  INSTAGRAM
                </a>
              </div>
            </div>
          </section>
        </div>

      </div>
      <Marquee />

      <ProjectSection />
      {/* Log Histori Pengalaman & Organisasi */}
      <ExperienceSection />
      <GuestbookSection />
    </main>
  );
}