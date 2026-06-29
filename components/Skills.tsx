"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  Computer, 
  Script, 
  Cpu, 
  Database, 
  GitBranch, 
  Terminal, 
  CloudServer, 
  Globe, 
  Video, 
  Camera 
} from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import ScrollReveal from "@/components/ScrollReveal";

interface HardSkill {
  name: string;
  colorClass: string;
  category: "DEVELOPMENT" | "TOOLS" | "MULTIMEDIA";
  icon: string;
}

const DEFAULT_HARD_SKILLS: HardSkill[] = [
  { name: "Next.js / React", colorClass: "bg-retro-orange", category: "DEVELOPMENT", icon: "computer" },
  { name: "Tailwind CSS", colorClass: "bg-retro-lime", category: "DEVELOPMENT", icon: "script" },
  { name: "Node.js / Express", colorClass: "bg-retro-pink", category: "DEVELOPMENT", icon: "cpu" },
  { name: "PHP / MySQL", colorClass: "bg-retro-yellow", category: "DEVELOPMENT", icon: "database" },
  { name: "Git / GitHub", colorClass: "bg-retro-blue", category: "TOOLS", icon: "gitbranch" },
  { name: "Postman / REST", colorClass: "bg-retro-lime", category: "TOOLS", icon: "terminal" },
  { name: "Vercel / Hosting", colorClass: "bg-retro-pink", category: "TOOLS", icon: "globe" },
  { name: "Linux Server", colorClass: "bg-retro-orange", category: "TOOLS", icon: "cloudserver" },
  { name: "Videography", colorClass: "bg-retro-yellow", category: "MULTIMEDIA", icon: "video" },
  { name: "Drone Piloting", colorClass: "bg-retro-lime", category: "MULTIMEDIA", icon: "camera" }
];

const DEFAULT_SOFT_SKILLS = [
  { title: "leadership.exe", description: "Mampu mengelola tim secara solid pada proyek riset, lomba, dan koordinasi operasional tim kreatif.", bgColor: "bg-retro-yellow" },
  { title: "coordination.cfg", description: "Mampu merancang alur kerja, riset model bisnis, serta melakukan negosiasi teknis dengan klien.", bgColor: "bg-retro-pink" },
  { title: "problem_solve.sys", description: "Paham cara mendiagnosis isu sistemik secara cepat untuk merumuskan integrasi solusi paling tepat guna.", bgColor: "bg-retro-lime" }
];

export default function Skills() {
  const [hardSkills, setHardSkills] = useState<HardSkill[]>([]);
  const [softSkills, setSoftSkills] = useState<any[]>([]);

  useEffect(() => {
    const loadSkills = () => {
      // Hard skills
      const savedHard = localStorage.getItem("jq_works_skills_hard");
      if (savedHard) {
        try {
          setHardSkills(JSON.parse(savedHard));
        } catch (e) {
          localStorage.setItem("jq_works_skills_hard", JSON.stringify(DEFAULT_HARD_SKILLS));
          setHardSkills(DEFAULT_HARD_SKILLS);
        }
      } else {
        localStorage.setItem("jq_works_skills_hard", JSON.stringify(DEFAULT_HARD_SKILLS));
        setHardSkills(DEFAULT_HARD_SKILLS);
      }

      // Soft skills
      const savedSoft = localStorage.getItem("jq_works_skills_soft");
      if (savedSoft) {
        try {
          setSoftSkills(JSON.parse(savedSoft));
        } catch (e) {
          localStorage.setItem("jq_works_skills_soft", JSON.stringify(DEFAULT_SOFT_SKILLS));
          setSoftSkills(DEFAULT_SOFT_SKILLS);
        }
      } else {
        localStorage.setItem("jq_works_skills_soft", JSON.stringify(DEFAULT_SOFT_SKILLS));
        setSoftSkills(DEFAULT_SOFT_SKILLS);
      }
    };

    loadSkills();

    const handleStorageUpdate = () => {
      loadSkills();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("local-skills-update", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("local-skills-update", handleStorageUpdate);
    };
  }, []);

  const getHardSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "computer": return Computer;
      case "script": return Script;
      case "cpu": return Cpu;
      case "database": return Database;
      case "gitbranch": return GitBranch;
      case "terminal": return Terminal;
      case "cloudserver": return CloudServer;
      case "globe": return Globe;
      case "video": return Video;
      case "camera": return Camera;
      default: return Computer;
    }
  };

  const devSkills = hardSkills.filter(s => s.category === "DEVELOPMENT");
  const toolSkills = hardSkills.filter(s => s.category === "TOOLS");
  const multiSkills = hardSkills.filter(s => s.category === "MULTIMEDIA");

  const renderSkillCard = (skill: HardSkill, soundFreq: number, delayIdx: number) => {
    const Icon = getHardSkillIcon(skill.icon);
    
    return (
      <ScrollReveal direction="up" delay={0.1 + delayIdx * 0.05} key={skill.name}>
        <div 
          onClick={() => playSynthSound("sine", soundFreq, 0.05)}
          className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex flex-col h-[76px] group"
        >
          {/* Mock Floppy Disk Metal Slider / Color Bar */}
          <div className="h-4 bg-neutral-900 border-b-2 border-black flex justify-between items-center px-2 shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-600 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-neutral-700 rounded-sm"></div>
            </div>
            <div className={`w-4 h-full ${skill.colorClass} border-l border-black`}></div>
          </div>

          {/* Sticker Label Area */}
          <div className="p-2.5 flex-1 flex items-center justify-between gap-3 bg-[#FBFBFA]">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-black text-neutral-400 leading-none mb-1 uppercase tracking-wide">
                SYSTEM_FILE
              </span>
              <span className="font-syne text-xs font-black text-black leading-tight uppercase truncate max-w-[120px] sm:max-w-none">
                {skill.name}
              </span>
            </div>
            
            {/* Skill Icon */}
            <div className={`p-1.5 border-2 border-black rounded-lg ${skill.colorClass} text-black shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-4 h-4 block" />
            </div>
          </div>
        </div>
      </ScrollReveal>
    );
  };

  return (
    <section id="keahlian" className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24 select-none scroll-mt-24">
      
      {/* Title Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex items-center gap-3 sm:gap-4 mb-10">
          <div className="bg-retro-yellow text-black p-3 border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="block text-black">
              <path d="M2 6h4M10 6h12M2 12h10M16 12h6M2 18h16M22 18h2M6 4v4h4V4H6zm10 6v4h4v-4h-4zm2 6v4h4v-4h-4z"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 font-bold block">// SYSTEM_CAPABILITIES</span>
            <h2 className="font-syne text-lg xs:text-xl sm:text-3xl md:text-4xl font-extrabold text-black uppercase mt-0.5 break-words">
              SKILLS_&amp;_
              <br className="sm:hidden" />
              CAPABILITIES.EXE
            </h2>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Technical Stack (Hard Skills) */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-retro-orange border-b-3 border-black shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
                <span className="font-mono font-bold text-xs text-white">technical_stack.cfg</span>
              </div>
              <span className="bg-white text-black px-2 py-0.5 rounded border border-black font-pixel text-[6px] font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                HARD_SKILLS
              </span>
            </div>
            
            {/* Body */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6 bg-[#F9F7F5]">
              
              {/* Development Group */}
              <div>
                <h4 className="font-mono text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">// DEVELOPMENT</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {devSkills.map((skill, idx) => renderSkillCard(skill, 440 + idx * 20, idx))}
                </div>
              </div>

              {/* Tools & Platform Group */}
              <div>
                <h4 className="font-mono text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">// TOOLS &amp; PLATFORMS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {toolSkills.map((skill, idx) => renderSkillCard(skill, 494 + idx * 20, idx))}
                </div>
              </div>

              {/* Multimedia Group */}
              <div>
                <h4 className="font-mono text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">// MULTIMEDIA PRODUCTION</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {multiSkills.map((skill, idx) => renderSkillCard(skill, 523 + idx * 20, idx))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Core Capabilities (Soft Skills) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-retro-blue border-b-3 border-black shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
                <span className="font-mono font-bold text-xs text-white">core_capabilities.log</span>
              </div>
              <span className="bg-retro-lime text-black px-2 py-0.5 rounded border border-black font-pixel text-[6px] font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                SOFT_SKILLS
              </span>
            </div>
            
            {/* Body - Stack of Sticky Notes */}
            <div className="p-6 space-y-6 bg-[#FAF8F5] flex-1 flex flex-col justify-center">
              {softSkills.map((soft, sIdx) => (
                <ScrollReveal key={sIdx} direction="scale" delay={0.2 + (sIdx * 0.1)}>
                  <div 
                    onClick={() => playSynthSound("triangle", 293 + sIdx * 30, 0.12)}
                    className={`relative p-5 border-3 border-black rounded-xl ${soft.bgColor || "bg-retro-yellow"} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[${sIdx % 2 === 0 ? "-1deg" : "1.5deg"}] hover:rotate-0 transition-all cursor-pointer flex gap-3.5 items-start`}
                  >
                    {/* Tape decoration */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/50 border border-black/10 rotate-[2deg] shadow-[1px_1px_0px_rgba(0,0,0,0.05)]"></div>
                    
                    <div className="mt-1 bg-white border-2 border-black p-0.5 rounded flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <Check className="w-3.5 h-3.5 text-black block" />
                    </div>
                    <div>
                      <h4 className="font-syne text-xs font-black uppercase text-black mb-1.5 tracking-wider">{soft.title}</h4>
                      <p className="font-sans text-[11px] font-bold text-neutral-800 leading-relaxed">
                        {soft.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}