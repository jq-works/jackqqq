"use client";

import React, { useState, useEffect } from "react";
import { Folder, ExternalLink } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectProps {
  title: string;
  category: string;
  description: string;
  tags: string[];
  link: string;
  colorClass?: string;
  year?: string;
  images?: string[];
}

export default function ProjectCard({
  title,
  category,
  description,
  tags,
  link,
  colorClass = "bg-retro-blue",
  year = "2026",
  images = []
}: ProjectProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Ganti gambar setiap 3 detik
    return () => clearInterval(interval);
  }, [images]);

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  const hasImages = images && images.length > 0;
  const isImageValid = hasImages && !imageError[currentImgIndex];

  return (
    <article className="bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 group flex flex-col justify-between h-full">
      
      {/* OS Jendela Header (Window Titlebar) */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${colorClass} border-b-3 border-black shrink-0`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
          <span className="font-mono font-bold text-xs text-white">{title.toLowerCase().replace(/\s+/g, "_")}.exe</span>
        </div>
        <span className="bg-black text-retro-yellow border-2 border-black rounded px-2 py-0.5 font-pixel text-[6px] font-bold uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          {category}
        </span>
      </div>

      {/* Project Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Main Visual Frame (Carousel / Flipper) */}
          <div className="w-full h-40 bg-neutral-100 border-2 border-black rounded-xl mb-4 overflow-hidden flex items-center justify-center relative shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)] retro-grid select-none">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:10px_10px]"></div>
            
            <AnimatePresence mode="wait">
              {isImageValid ? (
                <motion.img
                  key={`img-${currentImgIndex}`}
                  src={images[currentImgIndex]}
                  alt={`${title} - Slide ${currentImgIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onError={() => handleImageError(currentImgIndex)}
                  className="w-full h-full object-cover absolute inset-0 z-10"
                />
              ) : (
                <motion.div
                  key={`fallback-${currentImgIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full z-10"
                >
                  {hasImages ? (
                    // Jika ada array gambar tapi file gambar gagal load di disk
                    <FallbackIllustration projectTitle={title} index={currentImgIndex} />
                  ) : (
                    // Jika tidak didefinisikan array gambar (default visual folder)
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="bg-white p-3 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Folder className="text-black w-10 h-10 block" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicator dots for multiple images */}
            {images.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20 bg-black/70 px-2 py-1 rounded-full border border-black/80">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImgIndex(idx);
                      if (typeof playSynthSound === "function") playSynthSound("sine", 300 + idx * 30, 0.04);
                    }}
                    className={`w-1.5 h-1.5 rounded-full border border-black/50 transition-all cursor-pointer ${
                      currentImgIndex === idx ? "bg-retro-yellow w-3" : "bg-neutral-400"
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-2.5 right-2.5 bg-black text-white font-mono text-[7px] font-bold px-2 py-0.5 rounded border border-neutral-700 tracking-wider z-20">
              DOC_LOADED // {year}
            </div>
          </div>

          {/* Info Proyek */}
          <h3 className="font-syne text-xl font-extrabold mb-2 uppercase tracking-tight text-black group-hover:text-retro-orange transition-colors">
            {title}
          </h3>
          
          <p className="font-sans font-medium text-neutral-600 text-[13px] leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Tags & Actions Footer */}
        <div>
          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-neutral-50 border-2 border-black rounded-md font-mono text-[10px] font-bold text-neutral-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions Footer */}
          <div className="border-t-2 border-dashed border-neutral-200 pt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-neutral-400">© {year} JQ WORKS</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof playSynthSound === "function") playSynthSound("triangle", 220, 0.08);
              }}
              style={{ backgroundColor: "#A3E635", color: "#000000", textDecoration: "none" }}
              className="px-3.5 py-1.5 border-3 border-black rounded-xl font-mono font-bold text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Jalankan Proyek
              <ExternalLink className="w-3.5 h-3.5 block" />
            </a>
          </div>
        </div>

      </div>
    </article>
  );
}

// Sub-component Helper untuk visual tiruan/fallback bertema retro
function FallbackIllustration({ projectTitle, index }: { projectTitle: string; index: number }) {
  const titleLower = projectTitle.toLowerCase();
  
  if (titleLower.includes("orchicare")) {
    if (index % 3 === 0) {
      return (
        <div className="w-full h-full bg-[#1e1e2e] p-3 text-retro-lime font-mono text-[9px] flex flex-col justify-between select-none">
          <div className="flex justify-between border-b border-neutral-700 pb-1">
            <span>ORCHICARE_SYSTEM v2.6</span>
            <span className="animate-pulse text-red-500 font-bold">● REC</span>
          </div>
          <div className="space-y-0.5 my-auto">
            <div>&gt; TEMP: 27.8°C  [NORMAL]</div>
            <div>&gt; HUMI: 68.4%  [OPTIMAL]</div>
            <div>&gt; WATER: OFF    [IDLE]</div>
          </div>
          <div className="w-full h-10 bg-neutral-800 border border-neutral-700 rounded overflow-hidden relative">
            <svg className="w-full h-full text-retro-lime" viewBox="0 0 100 30">
              <path d="M 0 15 Q 25 5 50 20 T 100 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      );
    } else if (index % 3 === 1) {
      return (
        <div className="w-full h-full bg-[#f4f0ec] p-3 flex flex-col items-center justify-center font-mono select-none">
          <div className="w-12 h-12 bg-retro-orange/20 border-2 border-black rounded-full flex items-center justify-center mb-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="text-black">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-black">AI_PREDICTION: HEALTHY</span>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-[#FACC15]/15 p-3 flex flex-col justify-between font-mono text-[9px] text-black">
          <div className="text-center font-bold border-b border-black/20 pb-1">// HARDWARE_NODES</div>
          <div className="flex justify-around items-center my-auto">
            <div className="p-1 border border-black bg-white rounded font-bold text-[8px]">ESP32</div>
            <div className="text-neutral-400">---</div>
            <div className="p-1 border border-black bg-white rounded font-bold text-[8px]">MQTT</div>
            <div className="text-neutral-400">---</div>
            <div className="p-1 border border-black bg-white rounded font-bold text-[8px]">SUPABASE</div>
          </div>
        </div>
      );
    }
  }

  if (titleLower.includes("sarpras")) {
    if (index % 2 === 0) {
      return (
        <div className="w-full h-full bg-[#1e1e2e] p-3 text-white font-mono text-[9px] flex flex-col justify-between select-none">
          <div className="border-b border-neutral-700 pb-1 flex justify-between">
            <span className="text-retro-blue font-bold">MOKLET_SARPRAS DB</span>
            <span className="text-neutral-400">PAGE_01/02</span>
          </div>
          <div className="space-y-0.5 my-auto text-[8px] text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800 pb-0.5 font-bold">
              <span>ITEM_ID</span> <span>STATUS</span> <span>BORROWER</span>
            </div>
            <div className="flex justify-between text-retro-lime">
              <span>#LTP-09</span> <span>ACTIVE</span> <span>XII-RPL1</span>
            </div>
            <div className="flex justify-between text-retro-yellow">
              <span>#PRJ-03</span> <span>PENDING</span> <span>X-RPL3</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-[#3B82F6]/10 p-3 flex flex-col items-center justify-center font-mono select-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="text-retro-blue mb-2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="text-[10px] font-black text-black">ADMINISTRATOR CONTROL</span>
        </div>
      );
    }
  }

  if (titleLower.includes("onelens")) {
    if (index % 2 === 0) {
      return (
        <div className="w-full h-full bg-neutral-950 text-white p-3 font-mono text-[9px] flex flex-col justify-between relative overflow-hidden select-none">
          <div className="flex justify-between text-red-500 font-bold items-center">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>REC</span>
            <span>1080p 60FPS</span>
          </div>
          <div className="border border-white/20 w-8 h-8 rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-40">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>CAM_01 // STAGE</span>
            <span>00:14:32</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-retro-pink/5 p-3 flex flex-col justify-between font-mono text-[8px] text-black select-none">
          <div className="text-center font-bold border-b border-neutral-300 pb-1">// CAMERA CONTROL SWITCHER</div>
          <div className="grid grid-cols-2 gap-2 my-auto">
            <div className="border border-black p-1 bg-white text-center text-red-600 font-black text-[7px]">CAM_1 (LIVE)</div>
            <div className="border border-black p-1 bg-white text-center text-neutral-500 text-[7px]">CAM_2 (DRONE)</div>
          </div>
        </div>
      );
    }
  }

  // Fallback default
  if (index % 2 === 0) {
    return (
      <div className="w-full h-full bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-3 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Folder className="text-black w-8 h-8 block" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-neutral-900 text-retro-lime p-4 font-mono text-[8px] flex flex-col justify-between">
        <div>&gt; INITIALIZING PREVIEW...</div>
        <div>&gt; SYSTEM CORE ENGAGED</div>
        <div>&gt; FETCHING PREVIEW DATA OK</div>
      </div>
    );
  }
}