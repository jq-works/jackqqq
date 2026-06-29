"use client";

import React, { useState, useEffect } from "react";
import { playSynthSound } from "@/lib/audio";
import { PenSquare, Video, BookOpen, Terminal, Briefcase } from "pixelarticons/react";
import ScrollReveal from "@/components/ScrollReveal";

const INITIAL_EXPERIENCES = [
  {
    id: "01",
    period: "2024 - SEKARANG",
    badge: "LATEST_VENTURE",
    title: "OneLens Media",
    role: "Founder & Broadcast Engineer",
    description: "Mendirikan dan mengelola operasional teknis OneLens Media. Menyediakan solusi live streaming multi-kamera profesional, rancangan jaringan broadcasting, serta dokumentasi udara menggunakan drone.",
    bgColor: "#F9F7F5",
    markerColor: "bg-retro-orange",
    icon: "video",
    bullets: [
      "LIVE STREAM INFRASTRUCTURE",
      "MULTI-CAM MIXER CONTROL",
      "DRONE MAPPING & LIPUTAN"
    ]
  },
  {
    id: "02",
    period: "2023 - SEKARANG",
    badge: "EDUCATION",
    title: "SMK Telkom Malang",
    role: "Jurusan Rekayasa Perangkat Lunak (RPL) — Expertise: Full-Stack Dev",
    description: "Menempuh pendidikan menengah kejuruan dengan spesialisasi rekayasa perangkat lunak. Mendalami pemrograman web dinamis, perancangan database relasional, serta pengembangan aplikasi modern.",
    bgColor: "#F4F0EC",
    markerColor: "bg-retro-blue",
    icon: "book",
    bulletsHeader: "ORGANISASI & EKSTRAKURIKULER:",
    cards: [
      {
        title: "OSIS Koordinator Sie 9",
        description: "Mengkoordinasikan proyek teknologi internal, repositori osis-moklet-old, serta memimpin publikasi multimedia divisi.",
        period: "2024 - 2026",
        bgColor: "bg-retro-yellow",
        icon: "pen"
      },
      {
        title: "Media Moklet Division",
        description: "Mendokumentasikan kegiatan internal sekolah, penyiaran streaming langsung resmi, serta mengoperasikan drone udara.",
        period: "2024 - 2026",
        bgColor: "bg-retro-pink",
        icon: "video"
      }
    ]
  }
];

export default function ExperienceSection() {
  const [listExperiences, setListExperiences] = useState<any[]>([]);

  useEffect(() => {
    const loadExperiences = () => {
      const saved = localStorage.getItem("jq_works_experiences");
      if (saved) {
        try {
          setListExperiences(JSON.parse(saved));
        } catch (e) {
          localStorage.setItem("jq_works_experiences", JSON.stringify(INITIAL_EXPERIENCES));
          setListExperiences(INITIAL_EXPERIENCES);
        }
      } else {
        localStorage.setItem("jq_works_experiences", JSON.stringify(INITIAL_EXPERIENCES));
        setListExperiences(INITIAL_EXPERIENCES);
      }
    };

    loadExperiences();

    const handleStorageUpdate = () => {
      loadExperiences();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("local-experiences-update", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("local-experiences-update", handleStorageUpdate);
    };
  }, []);

  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case "video":
        return <Video className="w-10 h-10 text-retro-pink transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />;
      case "book":
        return <BookOpen className="w-10 h-10 text-retro-blue transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />;
      case "code":
        return <Terminal className="w-10 h-10 text-retro-orange transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />;
      default:
        return <Briefcase className="w-10 h-10 text-retro-yellow transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />;
    }
  };

  const getSmallIconElement = (iconName: string) => {
    switch (iconName) {
      case "video":
        return <Video className="w-4 h-4 text-black block shrink-0" />;
      case "pen":
        return <PenSquare className="w-4 h-4 text-black block shrink-0" />;
      case "code":
        return <Terminal className="w-4 h-4 text-black block shrink-0" />;
      default:
        return <Briefcase className="w-4 h-4 text-black block shrink-0" />;
    }
  };

  return (
    <section id="pengalaman" className="max-w-7xl mx-auto px-4 md:px-8 mt-24 scroll-mt-24 select-none">
      
      {/* Section Title */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex items-center gap-3 sm:gap-4 mb-10">
          <div className="bg-retro-lime text-black p-3 border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="block text-black">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 font-bold block">// PORTFOLIO_JOURNEY</span>
            <h2 className="font-syne text-lg xs:text-xl sm:text-3xl md:text-4xl font-extrabold text-black uppercase mt-0.5 break-words">
              TIMELINE_
              <br className="sm:hidden" />
              EXPERIENCE.EXE
            </h2>
          </div>
        </div>
      </ScrollReveal>

      {/* OS Windows Frame Style for Timeline Box */}
      <div className="bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header Bar Jendela */}
        <div className="px-4 py-3 bg-retro-yellow border-b-3 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-black">jackqqq_employment_history.log</span>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-neutral-300 border-2 border-black rounded-full"></div>
            <div className="w-3 h-3 bg-neutral-300 border-2 border-black rounded-full"></div>
          </div>
        </div>
        
        {/* Area Isi Linimasa */}
        <div className="p-4 sm:p-10 bg-retro-bg/20">
          {listExperiences.length > 0 ? (
            <div className="relative border-l-4 border-black pl-5 sm:pl-8 ml-2.5 sm:ml-6 py-2 space-y-10">
              {listExperiences.map((exp, idx) => (
                <ScrollReveal key={idx} direction="left" delay={0.2 + idx * 0.15}>
                <div 
                  onClick={() => playSynthSound("square", 220 + idx * 60, 0.08)}
                  className="relative group cursor-pointer"
                >
                  {/* Node Marker Angka - Centered on Line */}
                  <div className={`absolute -left-[32px] sm:-left-[48px] top-2 w-7 h-7 sm:w-8 sm:h-8 ${exp.markerColor || "bg-retro-orange"} text-white border-3 border-black rounded-lg font-mono font-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform text-[10px] sm:text-xs`}>
                    {exp.id || `0${idx + 1}`}
                  </div>

                  {/* Panel Konten Utama */}
                  <div 
                    className="border-3 border-black rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all max-w-4xl"
                    style={{ backgroundColor: exp.bgColor || "#ffffff" }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className="px-2.5 py-0.5 bg-black text-white border border-black rounded font-mono text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                        {exp.period}
                      </span>
                      <span className="bg-neutral-900 text-retro-yellow border-2 border-black rounded px-2 py-0.5 font-pixel text-[6px] font-bold uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {exp.badge}
                      </span>
                    </div>

                    <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-black mb-1 group-hover:text-retro-orange transition-colors">
                      {exp.title}
                    </h3>
                    <p className="font-mono text-xs font-bold text-neutral-500 mb-4 uppercase">
                      {exp.role}
                    </p>

                    {/* Deskripsi Detail */}
                    <div className="space-y-4">
                      <p className="font-sans text-[13px] font-medium text-neutral-600 leading-relaxed">
                        {exp.description}
                      </p>
                      
                      {/* Bullets List (if any) */}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <div className="bg-neutral-900 border-2 border-black rounded-xl p-3.5 font-mono text-[10px] text-retro-lime space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {exp.bullets.map((bullet: string, bIdx: number) => (
                            <div key={bIdx}>&gt; [✔] {bullet.toUpperCase()}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Child Cards (if any, like organizations) */}
                    {exp.cards && exp.cards.length > 0 && (
                      <div className="space-y-4 mt-6 pt-6 border-t-2 border-dashed border-black/10">
                        <span className="font-mono text-[9px] font-black text-neutral-400 block uppercase tracking-widest">
                          {exp.bulletsHeader || "// INVOLVEMENT & ACTIVITIES:"}
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {exp.cards.map((card: any, cIdx: number) => (
                            <ScrollReveal key={cIdx} direction="scale" delay={0.3 + cIdx * 0.1}>
                            <div 
                              className={`${card.bgColor || "bg-retro-yellow"} border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform duration-250 flex flex-col justify-between ${
                                cIdx % 2 === 0 ? "-rotate-1 hover:rotate-0" : "rotate-1 hover:rotate-0"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  {getSmallIconElement(card.icon)}
                                  <h4 className="font-syne text-[11px] font-black uppercase text-black leading-tight">
                                    {card.title}
                                  </h4>
                                </div>
                                <p className="font-sans text-[10px] font-semibold text-neutral-800 leading-relaxed">
                                  {card.description}
                                </p>
                              </div>
                              <span className="font-mono text-[8px] font-bold text-neutral-500 border border-neutral-400 rounded bg-white/40 px-1.5 py-0.5 w-fit mt-3">
                                {card.period}
                              </span>
                            </div>
                            </ScrollReveal>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 font-bold">Tidak ada linimasa pengalaman.</div>
          )}
        </div>

      </div>
    </section>
  );
}