"use client";

import React from "react";
import { Folder, ExternalLink } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

interface ProjectProps {
  title: string;
  category: string;
  description: string;
  tags: string[];
  link: string;
  colorClass?: string;
  year?: string;
}

export default function ProjectCard({
  title,
  category,
  description,
  tags,
  link,
  colorClass = "bg-retro-blue",
  year = "2026",
}: ProjectProps) {
  return (
    <article className="bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 group">
      {/* OS Window Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${colorClass} border-b-3 border-black`}>
        <span className="font-mono font-bold text-xs text-white">{title.toLowerCase().replace(/\s+/g, "_")}.exe</span>
        <span className="bg-retro-yellow text-black border-2 border-black rounded px-1.5 py-0.5 font-pixel text-[6px] font-bold uppercase">
          {category}
        </span>
      </div>

      {/* Project Body */}
      <div className="p-6">
        {/* Placeholder Frame Vektor (Anti Gambar Rusak) */}
        <div className="w-full h-44 bg-retro-bg border-2 border-black rounded mb-5 overflow-hidden flex items-center justify-center relative retro-grid">
  {/* Pixelarticons: Folder */}
  <Folder className="text-black w-12 h-12 opacity-30 block" />
  <div className="absolute bottom-2 right-2 bg-black text-white font-pixel text-[6px] px-2 py-1 rounded">
    CASE_STUDY_LOADED
  </div>
</div>

        {/* Info Proyek */}
        <h3 className="font-syne text-2xl font-black mb-2 uppercase tracking-tight text-black group-hover:text-retro-orange transition-colors">
          {title}
        </h3>
        <p className="font-sans font-medium text-neutral-700 text-sm mb-5 leading-relaxed">
          {description}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-white border-2 border-black rounded font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t-2 border-black pt-4">
          <span className="font-mono text-xs font-bold text-neutral-400">© {year} JQ WORKS</span>
          <a
  href={link}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => playSynthSound("triangle", 220, 0.08)}
  className="px-4 py-2 bg-retro-lime border-3 border-black rounded font-mono font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] transition-all flex items-center gap-1.5"
>
  Jalankan Proyek {/* Pixelarticons: External Link / Open */}
  <ExternalLink className="w-3.5 h-3.5 block" />
</a>
        </div>
      </div>
    </article>
  );
}