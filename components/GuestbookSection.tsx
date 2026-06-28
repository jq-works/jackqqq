"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { playSynthSound, playSpawnSound } from "@/lib/audio";
import { PenSquare, MapPin } from "pixelarticons/react";

// ==========================================
// INTERFACE & DATA TYPES
// ==========================================
interface NoteData {
  id: string;
  name: string;
  message: string;
  color: string;
  rotation: number;
  left: number;
  top: number;
}

interface DraggableNoteProps {
  note: NoteData;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

// ==========================================
// SUB-KOMPONEN: DRAGGABLE NOTE (INLINE RENDER)
// ==========================================
function DraggableNote({ note, constraintsRef }: DraggableNoteProps) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.05}
      dragMomentum={false}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
      style={{
        left: `${note.left}%`,
        top: `${note.top}%`,
        rotate: note.rotation,
      }}
      className={`absolute p-4 w-52 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${note.color} cursor-grab select-none font-mono text-xs text-black`}
    >
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-1.5 mb-2 shrink-0">
        <span className="font-black truncate max-w-[160px] tracking-tight">
          @{note.name}
        </span>
      </div>

      <p className="font-sans text-[11px] font-semibold leading-normal text-neutral-900 break-words line-clamp-4">
        {note.message}
      </p>

      <div className="mt-2.5 flex justify-between items-center text-[8px] font-bold opacity-40 uppercase tracking-widest">
        <span>STICKY_NOTE.LOG</span>
        <span>DRAG_ME</span>
      </div>
    </motion.div>
  );
}

const INITIAL_NOTES: NoteData[] = [
  {
    id: "note-1",
    name: "budi_dev",
    message: "Desain desktop web ini keren parah bro! Gak kaku sama sekali. 👍",
    color: "bg-retro-yellow",
    rotation: 3,
    left: 15,
    top: 20
  },
  {
    id: "note-2",
    name: "Shinta.K",
    message: "Sangat menyukai interaksi matanya yang bergerak! Kreatif.",
    color: "bg-retro-lime",
    rotation: -3,
    left: 55,
    top: 35
  }
];

// ==========================================
// KOMPONEN UTAMA: GUESTBOOK SECTION
// ==========================================
export default function GuestbookSection() {
  const deskRef = useRef<HTMLDivElement>(null);
  
  // State manajemen formulir input
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-retro-yellow");

  // State pangkalan data pesan lokal
  const [notes, setNotes] = useState<NoteData[]>([]);

  useEffect(() => {
    const loadNotes = () => {
      const saved = localStorage.getItem("jq_works_guestbook");
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          localStorage.setItem("jq_works_guestbook", JSON.stringify(INITIAL_NOTES));
          setNotes(INITIAL_NOTES);
        }
      } else {
        localStorage.setItem("jq_works_guestbook", JSON.stringify(INITIAL_NOTES));
        setNotes(INITIAL_NOTES);
      }
    };

    loadNotes();

    const handleStorageUpdate = () => {
      loadNotes();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("local-guestbook-update", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("local-guestbook-update", handleStorageUpdate);
    };
  }, []);

  const colors = [
    { class: "bg-retro-yellow" },
    { class: "bg-retro-pink" },
    { class: "bg-retro-lime" },
    { class: "bg-retro-blue" }
  ];

  // Handler eksekusi submit cetak catatan tempel baru
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Trigger ledakan selebrasi partikel konfeti digital
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    if (typeof playSpawnSound === "function") {
      playSpawnSound();
    }

    // Kalkulasi koordinat acak aman di dalam wilayah meja kerja fiksi
    const newNote: NoteData = {
      id: `spawned-note-${Date.now()}`,
      name: name,
      message: message,
      color: selectedColor,
      rotation: Math.floor(Math.random() * 8) - 4,
      left: Math.floor(Math.random() * 35) + 15,
      top: Math.floor(Math.random() * 40) + 20
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("jq_works_guestbook", JSON.stringify(updatedNotes));
    window.dispatchEvent(new Event("local-guestbook-update"));
    
    // Pembersihan isian formulir
    setName("");
    setMessage("");
  };

  return (
    <section id="guestbook" className="max-w-7xl mx-auto px-4 md:px-8 mt-20 select-none scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FORMULIR PANEL KONTROL INPUT (5 COLS) */}
        <div className="lg:col-span-5 bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-4 py-2.5 bg-retro-pink border-b-3 border-black flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-black" />
            <span className="font-mono font-bold text-xs text-black">guestbook_form.exe</span>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <p className="font-mono text-xs text-neutral-600 leading-relaxed mb-2">
              Isi papan tulis virtual milik **jackqqq**. Pesan Anda akan langsung dicetak dan ditempel di meja virtual sebelah kanan!
            </p>
            
            <div>
              <label className="block font-mono text-xs font-bold text-black uppercase mb-1">Nama Pengunjung / Institusi:</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., PT Maju Mundur (HRD)" 
                className="w-full px-3 py-2 bg-retro-bg border-3 border-black rounded font-mono text-sm focus:outline-none focus:bg-white placeholder:text-neutral-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-black uppercase mb-1">Pesan / Keperluan Projek:</label>
              <textarea 
                required 
                rows={3} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tertarik mengajak kolaborasi projek landing page bisnis..." 
                className="w-full px-3 py-2 bg-retro-bg border-3 border-black rounded font-sans text-sm focus:outline-none focus:bg-white placeholder:text-neutral-400"
              ></textarea>
            </div>

            {/* PANEL PEMILIH WARNA STRIP KERTAS */}
            <div>
              <label className="block font-mono text-xs font-bold text-black uppercase mb-1">Warna Kertas Catatan:</label>
              <div className="flex gap-3">
                {colors.map((clr) => (
                  <button
                    key={clr.class}
                    type="button"
                    onClick={() => {
                      setSelectedColor(clr.class);
                      if (typeof playSynthSound === "function") {
                        playSynthSound("triangle", 330, 0.05);
                      }
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${clr.class} ${
                      selectedColor === clr.class ? "ring-2 ring-offset-2 ring-black border-black" : "border-neutral-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 sm:py-3 bg-retro-orange text-black font-syne font-black border-3 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-xs xs:text-sm text-center leading-normal">
              TEMPELKAN SEKARANG! <MapPin className="w-4 h-4 inline-block align-middle ml-1.5 -mt-0.5 shrink-0" />
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: MEJA UTAMA KANVAS WORKSPACE PAPAN CATATAN (7 COLS) */}
        <div className="lg:col-span-7 bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px] overflow-hidden relative">
          <div className="px-4 py-2.5 bg-black text-white border-b-3 border-black flex justify-between items-center">
            <span className="font-mono font-bold text-xs">jackqqq_virtual_desk.board</span>
            <span className="bg-red-500 text-white font-pixel text-[6px] px-1.5 py-0.5 rounded border border-white">STIKER INTERAKTIF</span>
          </div>
          
          {/* Canvas Wilayah Batasan Gerak Seret Catatan */}
          <div ref={deskRef} className="relative flex-1 bg-[#EAE3DC] p-4 overflow-hidden retro-grid">
            <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none">
              <span className="font-syne text-5xl font-black text-black text-center tracking-tighter">MEJA KERJA<br />JACKQQQ</span>
            </div>

            {/* Rendering Catatan Secara Dinamis */}
            {notes.map((note) => (
              <DraggableNote 
                key={note.id} 
                note={note} 
                constraintsRef={deskRef} 
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}