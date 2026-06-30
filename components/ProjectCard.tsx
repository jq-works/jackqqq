"use client";

import React, { useState, useEffect } from "react";
import * as PixelIcons from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import { motion, AnimatePresence } from "framer-motion";

interface CustomLink {
  label: string;
  url: string;
  icon: string;
}

interface ProjectProps {
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  customLinks?: CustomLink[];
  colorClass?: string;
  year?: string;
  images?: string[];
}

function ProjectLinkIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const pascalName = name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const IconComponent =
    (PixelIcons as any)[pascalName] ||
    (PixelIcons as any)[name] ||
    PixelIcons.ExternalLink;
  return <IconComponent className={className} style={style} />;
}

export function ProjectCard({
  title,
  category,
  description,
  tags,
  githubUrl = "",
  liveUrl = "",
  customLinks = [],
  colorClass = "bg-retro-blue",
  year = "2026",
  images = [],
}: ProjectProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const hasImages = images && images.length > 0;

  const linksToRender = (customLinks && customLinks.length > 0)
    ? customLinks
    : [
        ...(githubUrl ? [{ label: "REPO_GIT", url: githubUrl, icon: "folder" }] : []),
        ...(liveUrl ? [{ label: "LIVE_SITE", url: liveUrl, icon: "external-link" }] : [])
      ].slice(0, 2);

  const tagColors = [
    "bg-retro-pink",
    "bg-retro-orange",
    "bg-retro-blue text-white",
    "bg-retro-lime",
    "bg-retro-yellow",
    "bg-purple-400 text-white"
  ];

  useEffect(() => {
    if (!hasImages || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [hasImages, images.length]);

  return (
    <article className="bg-white border-3 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 group flex flex-col justify-between h-full relative">
      <div>
        {/* TOP WINDOW BAR */}
        <div className={`flex items-center justify-between border-b-3 border-black p-3 relative min-h-[52px] ${colorClass} shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]`}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black inline-block"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-black inline-block"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black inline-block"></div>
            </div>
            <span className="font-mono text-xs font-black text-white uppercase truncate tracking-wider block">
              {title.toLowerCase().replace(/\s+/g, "_")}.sys
            </span>
          </div>
          <span className="bg-retro-yellow text-black border-2 border-black rounded-sm px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 max-w-[120px] truncate">
            {category}
          </span>
        </div>

        {/* PROJECT BODY */}
        <div className="p-6">
          <div className="w-full h-48 bg-retro-bg border-3 border-black rounded shadow-[inset_4px_4px_0px_rgba(0,0,0,0.15)] mb-5 overflow-hidden flex items-center justify-center relative retro-grid shrink-0">
            <AnimatePresence mode="wait">
              {hasImages ? (
                <motion.img
                  key={currentImgIdx}
                  src={images[currentImgIdx]}
                  alt={`${title} preview`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PixelIcons.Folder className="text-black w-12 h-12 opacity-30 block" />
              )}
            </AnimatePresence>
            
            {hasImages && images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                {images.map((_, idx) => (
                  <span key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIdx ? "w-3 bg-retro-lime" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            )}
          </div>

          <h3 className="font-syne text-2xl font-black mb-2.5 uppercase tracking-tight text-black group-hover:text-retro-orange transition-colors">
            {title}
          </h3>
          <p className="font-sans font-medium text-neutral-700 text-sm mb-5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* FOOTER AREA */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <span key={tag} className={`px-2.5 py-1 ${tagColors[idx % tagColors.length]} border-2 border-black rounded font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* FIX TAMPILAN CTA HORIZONTAL - WARNA DIPAKSA HITAM & KUNING SEPERTI image_50f039.png */}
        <div className="flex flex-row items-center justify-between border-t-2 border-black pt-4 mt-auto gap-4">
          <span className="font-mono text-[10px] font-black text-neutral-400 shrink-0">
            © {year} JQ_NODE
          </span>
          
          <div className="flex flex-row items-center gap-3">
            {linksToRender.map((link, idx) => (
              <a 
                key={idx}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => playSynthSound("triangle", 180 + idx * 40, 0.08)} 
                className={`px-3 py-1.5 border-2 border-black rounded-none font-mono font-black text-[11px] uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-1.5 text-black !text-black ${
                  idx === 1 ? "bg-[#facc15] hover:bg-[#fde047]" : "bg-white hover:bg-neutral-100"
                }`}
              >
                <ProjectLinkIcon name={link.icon} className="w-3.5 h-3.5 block text-black !text-black" style={{ color: '#000000' }} /> 
                <span className="text-black !text-black">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}