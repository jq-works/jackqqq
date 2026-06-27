"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { retroSpring } from "@/lib/animations";
import { Close } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

interface DesktopWindowProps {
  title: string;
  children: React.ReactNode;
  colorClass?: string;
  defaultX?: number;
  defaultY?: number;
}

export default function DesktopWindow({
  title,
  children,
  colorClass = "bg-retro-blue",
  defaultX = 0,
  defaultY = 0,
}: DesktopWindowProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={constraintsRef} className="relative w-full h-[450px] border-3 border-dashed border-black/20 rounded-xl p-4 overflow-hidden retro-grid bg-white/30">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        initial={{ x: defaultX, y: defaultY }}
        transition={retroSpring}
        className="absolute w-full max-w-sm bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-20 select-none"
      >
        <div className={`px-4 py-2.5 ${colorClass} text-white border-b-3 border-black flex justify-between items-center cursor-grab active:cursor-grabbing`}>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold">{title}</span>
          </div>
          <button 
            onClick={() => playSynthSound("triangle", 220, 0.08)}
            className="w-5 h-5 bg-retro-orange border-2 border-black rounded flex items-center justify-center text-black hover:bg-red-500 active:translate-y-[1px] transition-colors"
          >
            {/* Pixelarticons: Close / Close-box */}
            <Close className="text-black w-3.5 h-3.5 block" />
          </button>
        </div>
        
        <div className="p-5 text-black font-sans text-sm bg-white">
          {children}
        </div>
      </motion.div>
    </div>
  );
}