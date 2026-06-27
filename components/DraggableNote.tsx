"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "pixelarticons/react";

interface NoteData {
  id: string;
  name: string;
  message: string;
  sticker: string;
  color: string;
  rotation: number;
  left: number;
  top: number;
}

interface DraggableNoteProps {
  note: NoteData;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

export default function DraggableNote({ note, constraintsRef }: DraggableNoteProps) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      initial={{ 
        x: `${note.left}%`, 
        y: `${note.top}%`, 
        scale: 0.5, 
        rotate: note.rotation 
      }}
      animate={{ scale: 1, rotate: note.rotation }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      className={`absolute p-3 w-44 rounded border-2 border-black ${note.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] select-none cursor-grab active:cursor-grabbing hover:z-30 transition-shadow`}
      style={{ left: 0, top: 0 }}
    >
      {/* Header Stiker Pin */}
      <div className="flex items-center justify-between border-b border-dashed border-black pb-1 mb-1 font-mono text-[10px] font-bold">
        <span className="flex items-center gap-0.5">
          <MapPin className="w-3 h-3 text-black" />
          @{note.name.substring(0, 12)}
        </span>
        <span>
          {(() => {
            switch (note.sticker) {
              case "heart":
                return <i className="nes-icon heart scale-75 block"></i>;
              case "star":
                return <i className="nes-icon star scale-75 block"></i>;
              case "coin":
                return <i className="nes-icon coin scale-75 block"></i>;
              case "like":
                return <i className="nes-icon like scale-75 block"></i>;
              case "trophy":
                return <i className="nes-icon trophy scale-75 block"></i>;
              default:
                return <span>{note.sticker}</span>;
            }
          })()}
        </span>
      </div>
      
      {/* Isi Pesan */}
      <p className="font-sans text-xs font-semibold leading-tight text-neutral-800 break-words">
        {note.message}
      </p>
    </motion.div>
  );
}