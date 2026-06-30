"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageText, Trash, Home } from "pixelarticons/react";
import { motion } from "framer-motion";
import { playSynthSound, playClick, playError } from "@/lib/audio";

export const retroSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 12,
  mass: 0.9,
};

const SQL_QUERY = `CREATE TABLE public.guestbook_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    color TEXT NOT NULL,
    rotation INTEGER NOT NULL,
    pos_x INTEGER NOT NULL,
    pos_y INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.guestbook_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select access" ON public.guestbook_notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.guestbook_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.guestbook_notes FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook_notes;`;

type NoteData = {
  id: string;
  name: string;
  message: string;
  color: string;
  created_at: string;
};

export default function AdminGuestbook() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guestbook_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      if (error.code === "PGRST205") {
        setErrorMsg("Tabel 'guestbook_notes' belum dibuat di database Supabase.");
      } else {
        setErrorMsg(error.message);
      }
    } else {
      setNotes(data || []);
      setErrorMsg(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan guestbook ini secara permanen?")) return;
    
    if (typeof playClick === "function") playClick("mid");
    
    const { error } = await supabase.from("guestbook_notes").delete().eq("id", id);
    
    if (error) {
      if (typeof playError === "function") playError();
      alert("Gagal menghapus pesan!");
    } else {
      if (typeof playSynthSound === "function") playSynthSound("triangle", 440, 0.1);
      fetchNotes();
    }
  };

  const navLinks = [
    { href: "/admin", label: "🏠 Dashboard", active: false },
    { href: "/admin/projects", label: "💼 Kelola Proyek", active: false },
    { href: "/admin/achievements", label: "🏆 Kelola Achievements", active: false },
    { href: "/admin/guestbook", label: "📝 Kelola Guestbook", active: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-retro-bg)] text-black p-6 md:p-12 font-mono text-xs select-none">
      
      {/* ── HEADER WINDOW OS STYLE ── */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={retroSpring}
        className="max-w-7xl mx-auto border-[3px] border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10 overflow-hidden"
      >
        <div className="bg-[var(--color-retro-pink)] px-4 py-2 border-b-[3px] border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-black bg-red-500" />
            <div className="w-3 h-3 rounded-full border-2 border-black bg-yellow-400" />
            <div className="w-3 h-3 rounded-full border-2 border-black bg-green-400" />
          </div>
          <span className="font-bold text-white text-[10px] tracking-widest uppercase">C:\GUESTBOOK_MANAGER.EXE</span>
          <button
            onClick={async () => {
              if (confirm("Keluar dari dashboard admin?")) {
                if (typeof playSynthSound === "function") playSynthSound("sine", 392.00, 0.12);
                await supabase.auth.signOut();
              }
            }}
            className="px-2 py-0.5 bg-[var(--color-retro-pink)] text-white font-bold text-[9px] uppercase border border-black rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-none transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            LOGOUT
          </button>
        </div>
        
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[2deg]">
              <MessageText className="w-8 h-8 block text-[var(--color-retro-pink)]" />
            </div>
            <div>
              <h1 className="font-syne text-2xl md:text-3xl font-black uppercase tracking-tight">Kelola Guestbook</h1>
              <p className="text-neutral-500 font-bold mt-1">// STICKY_NOTES_DATABASE</p>
            </div>
          </div>
          
          <nav className="flex gap-3 flex-wrap">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}
                className={`px-4 py-2 border-[3px] border-black font-bold rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase text-[10px] flex items-center justify-center
                  ${l.active ? "bg-[var(--color-retro-orange)] text-white" : "bg-white text-black hover:bg-neutral-100"}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto space-y-10">
        <div className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black text-white px-5 py-3 font-bold uppercase text-[10px] tracking-widest border-b-[3px] border-black flex justify-between items-center">
            <span>DAFTAR PESAN GUESTBOOK</span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-600">
              TOTAL: {notes.length}
            </span>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-20 text-center animate-pulse text-neutral-400 font-bold text-sm uppercase tracking-widest">// FETCHING_DATA...</div>
            ) : errorMsg ? (
              <div className="p-6 border-[3px] border-black bg-yellow-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                <h3 className="font-syne text-lg font-black uppercase text-red-600 mb-2">⚠️ ERROR: TABLE_NOT_FOUND</h3>
                <p className="font-mono text-xs font-bold mb-4">{errorMsg}</p>
                <div className="border-[2px] border-black bg-neutral-900 text-neutral-200 p-4 rounded-lg font-mono text-[10px] overflow-x-auto relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(SQL_QUERY);
                        alert("SQL disalin ke clipboard!");
                      }}
                      className="px-2 py-1 bg-white text-black font-bold border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-[9px]"
                    >
                      COPY
                    </button>
                  </div>
                  <pre className="whitespace-pre">{SQL_QUERY}</pre>
                </div>
                <p className="font-mono text-[10px] text-neutral-600 mt-4 font-bold">// Tips: Salin kode SQL di atas dan jalankan di SQL Editor pada Dashboard Supabase Anda, kemudian refresh halaman ini.</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="py-20 text-center text-neutral-400 font-bold text-sm uppercase tracking-widest">// NO_MESSAGES_FOUND</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note.id} className={`p-5 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${note.color} flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform`}>
                    <div className="flex justify-between items-start mb-3 border-b-2 border-black/20 pb-2">
                      <div>
                        <span className="font-black block uppercase tracking-tight truncate max-w-[150px] text-black">
                          @{note.name}
                        </span>
                        <span className="text-[9px] text-black/60 font-bold block mt-1">
                          {new Date(note.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        className="bg-white text-red-600 p-2 border-2 border-black rounded hover:bg-red-50 active:translate-x-[2px] active:translate-y-[2px] transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none shrink-0"
                        title="Hapus Pesan"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="font-sans text-xs font-semibold leading-relaxed text-neutral-900 break-words flex-1 whitespace-pre-wrap">
                      {note.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
