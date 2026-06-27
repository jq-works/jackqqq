"use client";

import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import DraggableNote from "./DraggableNote";
import { playSynthSound, playSpawnSound } from "@/lib/audio";
import { PenSquare, MapPin } from "pixelarticons/react";

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

export default function GuestbookSection() {
  const deskRef = useRef<HTMLDivElement>(null);
  
  // State untuk form input
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("heart");
  const [selectedColor, setSelectedColor] = useState("bg-retro-yellow");

  // State awal daftar pesan (Pre-seeded mock notes)
  const [notes, setNotes] = useState<NoteData[]>([
    {
      id: "note-1",
      name: "budi_dev",
      message: "Desain desktop web ini keren parah bro! Gak kaku sama sekali. 👍",
      sticker: "heart",
      color: "bg-retro-yellow",
      rotation: 3,
      left: 15,
      top: 20
    },
    {
      id: "note-2",
      name: "Shinta.K",
      message: "Sangat menyukai interaksi matanya yang bergerak! Kreatif.",
      sticker: "star",
      color: "bg-retro-lime",
      rotation: -3,
      left: 55,
      top: 35
    }
  ]);

  const stickers = [
  { label: "heart", element: <i className="nes-icon heart scale-75 block"></i> },
  { label: "star", element: <i className="nes-icon star scale-75 block"></i> },
  { label: "coin", element: <i className="nes-icon coin scale-75 block"></i> },
  { label: "like", element: <i className="nes-icon like scale-75 block"></i> },
  { label: "trophy", element: <i className="nes-icon trophy scale-75 block"></i> }
];

  const colors = [
    { class: "bg-retro-yellow", hex: "#FACC15" },
    { class: "bg-retro-pink", hex: "#F472B6" },
    { class: "bg-retro-lime", hex: "#A3E635" },
    { class: "bg-retro-blue", hex: "#3B82F6" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Trigger Canvas Confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Play retro spawn sound
    playSpawnSound();

    // Kalkulasi koordinat acak di dalam area meja virtual
    const newNote: NoteData = {
      id: `spawned-note-${Date.now()}`,
      name: name,
      message: message,
      sticker: selectedSticker,
      color: selectedColor,
      rotation: Math.floor(Math.random() * 8) - 4, // Derajat kemiringan acak -4 sampai 4
      left: Math.floor(Math.random() * 35) + 15,    // Koordinat X acak aman
      top: Math.floor(Math.random() * 40) + 20      // Koordinat Y acak aman
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    
    // Reset form field
    setName("");
    setMessage("");
  };

  return (
    <section id="guestbook" className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Formulir Input (5 Kolon) */}
        <div className="lg:col-span-5 bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-4 py-2.5 bg-retro-pink border-b-3 border-black flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-black" />
            <span className="font-mono font-bold text-xs text-black">guestbook_form.exe</span>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="font-mono text-xs text-neutral-600 leading-relaxed mb-2">
              Isi papan tulis virtual milik **jackqqq**. Pesan Anda akan langsung dicetak sebagai sticker dan ditempel di meja virtual sebelah kanan!
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
                rows={2} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tertarik mengajak kolaborasi projek landing page bisnis..." 
                className="w-full px-3 py-2 bg-retro-bg border-3 border-black rounded font-sans text-sm focus:outline-none focus:bg-white placeholder:text-neutral-400"
              ></textarea>
            </div>

            {/* Pemilih Stiker Emoji */}
            <div>
              <label className="block font-mono text-xs font-bold text-black uppercase mb-1">Pilih Ikon Stiker:</label>
              <div className="grid grid-cols-5 gap-2">
                {stickers.map((stk) => (
                  <button
                    key={stk.label}
                    type="button"
                    onClick={() => {
                      setSelectedSticker(stk.label);
                      playSynthSound("triangle", 440, 0.05);
                    }}
                    className={`p-2 border-2 rounded text-lg hover:scale-110 active:scale-95 transition-transform flex justify-center items-center ${
                      selectedSticker === stk.label ? "border-black bg-retro-yellow" : "border-neutral-300 bg-white"
                    }`}
                  >
                    {stk.element}
                  </button>
                ))}
              </div>
            </div>

            {/* Pemilih Warna Kertas */}
            <div>
              <label className="block font-mono text-xs font-bold text-black uppercase mb-1">Warna Kertas Catatan:</label>
              <div className="flex gap-3">
                {colors.map((clr) => (
                  <button
                    key={clr.class}
                    type="button"
                    onClick={() => {
                      setSelectedColor(clr.class);
                      playSynthSound("triangle", 330, 0.05);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${clr.class} ${
                      selectedColor === clr.class ? "ring-2 ring-offset-2 ring-black border-black" : "border-neutral-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-retro-orange text-black font-syne font-black border-3 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5">
              TEMPELKAN SEKARANG! <MapPin className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Meja Papan Catatan Tempel (7 Kolon) */}
        <div className="lg:col-span-7 bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px] overflow-hidden relative">
          <div className="px-4 py-2.5 bg-black text-white border-b-3 border-black flex justify-between items-center">
            <span className="font-mono font-bold text-xs">jackqqq_virtual_desk.board</span>
            <span className="bg-red-500 text-white font-pixel text-[6px] px-1.5 py-0.5 rounded border border-white">STIKER INTERAKTIF</span>
          </div>
          
          {/* Canvas Batasan Drag */}
          <div ref={deskRef} className="relative flex-1 bg-[#EAE3DC] p-4 overflow-hidden retro-grid">
            <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none">
              <span className="font-syne text-5xl font-black text-black text-center tracking-tighter">MEJA KERJA<br />JACKQQQ</span>
            </div>

            {/* Render Catatan secara Dinamis */}
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