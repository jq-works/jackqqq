"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Plus, Trash, PenSquare, Close, MapPin, Search } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import Image from "next/image";
import { motion } from "framer-motion";

const retroSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 12,
  mass: 0.9,
};

const NAV_LINKS = [
  { href: "/admin", label: "🏠 Dashboard", active: false },
  { href: "/admin/projects", label: "💼 Kelola Proyek", active: false },
  { href: "/admin/achievements", label: "🏆 Kelola Achievements", active: true },
  { href: "/admin/guestbook", label: "📝 Kelola Guestbook", active: false },
];

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  
  // State CRUD & Edit Mode Switcher
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");
  const [year, setYear] = useState("2026");
  const [tag, setTag] = useState("");
  const [institution, setInstitution] = useState(""); 
  const [type, setType] = useState<"PRESTASI" | "SERTIFIKASI">("PRESTASI");
  const [images, setImages] = useState<string[]>([]);

  const constraintsRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAchievements(data);
    if (error) console.error("Error fetching nodes:", error.message);
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls = [...images];

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const UPLOAD_PRESET = "ml_default"; 

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await response.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error("Cloudinary error:", err);
      }
    }
    setImages(uploadedUrls);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !rank.trim() || !tag.trim() || !institution.trim()) {
      return alert("Mohon lengkapi formulir wajib!");
    }
    if (images.length === 0) return alert("Mohon upload minimal 1 gambar bukti!");

    if (typeof playSynthSound === "function") playSynthSound("triangle", 300, 0.1);

    const payload: any = {
      title: title.trim(),
      rank: rank.toUpperCase().trim(),
      year: parseInt(year),
      tag: tag.toUpperCase().trim(),
      institution: institution.trim(), 
      type,
      image_url: images[0]
    };

    if (editingId) {
      const { error } = await supabase
        .from("achievements")
        .update(payload)
        .eq("id", editingId);

      if (!error) {
        alert("Log pencapaian berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui: " + error.message);
      }
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      payload.id_display = `JQ-${randomNum}`;

      const bgColors = ["bg-retro-orange", "bg-retro-yellow", "bg-retro-lime", "bg-retro-blue", "bg-retro-pink"];
      payload.color_class = bgColors[Math.floor(Math.random() * bgColors.length)];

      const { error } = await supabase.from("achievements").insert([payload]);

      if (!error) {
        alert(`Sukses tersimpan dengan ID: ${payload.id_display}`);
      } else {
        alert("Gagal menyimpan: " + error.message);
      }
    }
    
    closeModal();
    fetchData();
  }

  function openAddModal() { resetForm(); setModalOpen(true); }

  function startEdit(item: any) {
    setEditingId(item.id);
    setTitle(item.title);
    setRank(item.rank);
    setYear(item.year.toString());
    setTag(item.tag);
    setInstitution(item.institution || "");
    setType(item.type);
    setImages(item.images || (item.image_url ? [item.image_url] : []));
    setModalOpen(true);
  }

  function closeModal() { setModalOpen(false); resetForm(); }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setRank("");
    setYear("2026");
    setTag("");
    setInstitution("");
    setImages([]);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus arsip ini dari database secara permanen?")) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (!error) {
      if (editingId === id) resetForm();
      fetchData();
    }
  }

  const filteredAchievements = achievements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id_display?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-retro-bg)] text-black p-6 md:p-12 font-mono text-xs select-none relative overflow-x-hidden">
      
      {/* ── HEADER ── */}
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
          <span className="font-bold text-white text-[10px] tracking-widest uppercase">C:\ACHIEVEMENTS_MANAGER.EXE</span>
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
              <Trophy className="w-8 h-8 block text-[var(--color-retro-yellow)]" />
            </div>
            <div>
              <h1 className="font-syne text-2xl md:text-3xl font-black uppercase tracking-tight">Kelola Achievements</h1>
              <p className="text-neutral-500 font-bold mt-1">// AWARDS_AND_CERTIFICATIONS</p>
            </div>
          </div>
          
          <nav className="flex gap-3 flex-wrap">
            {NAV_LINKS.map((l) => (
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

      <main className="max-w-7xl mx-auto space-y-8 relative">
        
        {/* Toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={retroSpring}
          className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
        >
          <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-retro-lime)] text-black border-[3px] border-black font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">
            <Plus className="w-5 h-5 block" /> TAMBAH_DATA.NEW
          </button>
          <div className="flex-1" />
          <div className="w-full sm:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-black block" />
            </div>
            <input
              type="text"
              className="w-full border-[3px] border-black pl-10 pr-4 py-3 rounded-lg bg-white text-xs font-bold placeholder:text-neutral-500 focus:outline-none shadow-[4px_4px_0_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all"
              placeholder="Cari ID / judul / institusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Live Feed */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={retroSpring}
          className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          <div className="bg-black text-white px-5 py-3 flex items-center justify-between border-b-[3px] border-black">
            <span className="font-bold uppercase text-sm tracking-widest">LIVE_STREAM_MONITOR.LOG</span>
            <span className="text-[var(--color-retro-yellow)] font-bold bg-neutral-800 px-2 py-1 rounded border border-black text-[10px]">{filteredAchievements.length} RECORDS</span>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {loading ? (
              <div className="py-16 text-center text-neutral-400 animate-pulse font-bold uppercase tracking-widest">// BUFFERING_RECORDS...</div>
            ) : filteredAchievements.length > 0 ? (
              filteredAchievements.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...retroSpring, delay: i * 0.05 }}
                  key={item.id} 
                  className="p-4 border-[3px] border-black rounded-xl bg-[var(--color-retro-bg)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:bg-white transition-colors group"
                >
                  <div className="flex gap-4 items-start w-full min-w-0">
                    <div className="w-16 h-16 bg-neutral-200 border-[3px] border-black rounded-lg overflow-hidden shrink-0 flex items-center justify-center rotate-2 group-hover:-rotate-1 transition-transform">
                      {item.image_url 
                        ? <Image src={item.image_url} alt="Preview" width={64} height={64} unoptimized className="w-full h-full object-cover" />
                        : <span className="text-[10px] text-neutral-400 font-bold">NO_IMG</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-bold text-[10px] bg-white px-1.5 py-0.5 border-2 border-black rounded uppercase tracking-widest">{item.id_display}</span>
                        <span className={`text-[9px] text-black px-2 py-0.5 rounded-full border-2 border-black font-black uppercase ${item.type === "PRESTASI" ? "bg-[var(--color-retro-lime)]" : "bg-[var(--color-retro-pink)]"}`}>{item.type}</span>
                        <span className={`w-3 h-3 rounded-full border-2 border-black ${item.color_class}`} />
                      </div>
                      <span className="font-black text-lg uppercase leading-tight font-syne block mb-1.5 truncate">{item.title}</span>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-black font-bold text-[10px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 block" /> {item.institution || "-"}
                        </span>
                        <span className="text-black font-bold text-[10px] bg-white border border-black px-1.5 rounded uppercase">RANK: {item.rank}</span>
                        <span className="text-neutral-500 font-bold text-[10px] uppercase">#{item.tag}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center self-start md:self-center font-black text-4xl text-neutral-200 group-hover:text-black transition-colors font-syne">
                      '{item.year.toString().slice(-2)}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 shrink-0 self-end md:self-center w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t-2 md:border-t-0 border-black md:border-transparent">
                    <button onClick={() => startEdit(item)} className="flex-1 md:flex-none flex justify-center items-center p-3 border-[3px] border-black rounded-lg bg-white hover:bg-[var(--color-retro-yellow)] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)]" title="Edit">
                      <PenSquare className="w-5 h-5 text-black block" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 md:flex-none flex justify-center items-center p-3 border-[3px] border-black rounded-lg bg-white hover:bg-[var(--color-retro-pink)] hover:text-white transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)]" title="Hapus">
                      <Trash className="w-5 h-5 block" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-[12px] text-black font-black bg-[var(--color-retro-pink)] border-2 border-black px-3 py-1 rounded uppercase mb-3 shadow-[2px_2px_0_rgba(0,0,0,1)] rotate-[-2deg]">ERROR 404: RECORDS_NOT_FOUND</span>
                <span className="text-xs text-neutral-500 font-bold uppercase">Tidak ada achievement yang cocok.</span>
              </div>
            )}
          </div>
        </motion.section>
      </main>

      {/* ═══════ MODAL (DRAGGABLE WINDOW) ═══════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none" ref={constraintsRef}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={closeModal} />
          
          <motion.div 
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            initial={{ scale: 0.9, opacity: 0, rotate: 2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="relative z-10 w-full max-w-xl bg-white border-[3px] border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto"
          >
            {/* Modal Header */}
            <div className="bg-[var(--color-retro-pink)] text-white flex items-center justify-between px-5 py-3 border-b-[3px] border-black shrink-0 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                <div className="bg-black p-1.5 border-2 border-black rounded">
                  <Trophy className="w-4 h-4 text-[var(--color-retro-yellow)] block" />
                </div>
                <span className="font-black uppercase text-xs tracking-widest">
                  {editingId ? "EDIT_ACHIEVEMENT.EXE" : "INPUT_ACHIEVEMENT.NEW"}
                </span>
              </div>
              <button onClick={closeModal} className="bg-[var(--color-retro-blue)] p-1.5 border-2 border-black rounded shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                <Close className="w-4 h-4 text-white block" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 flex-1 bg-[var(--color-retro-bg)]" style={{ scrollbarWidth: 'none' }}>
              <form onSubmit={handleSubmit} className="space-y-6 font-bold" id="achievement-form">

                <div>
                  <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Judul Prestasi / Sertifikat *</label>
                  <input type="text" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" placeholder="Nama pencapaian..." value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                
                <div>
                  <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Lokasi / Institusi Penyelenggara *</label>
                  <input type="text" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" placeholder="Contoh: ITS / Google / freeCodeCamp" value={institution} onChange={(e) => setInstitution(e.target.value)} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Tahun *</label>
                    <input type="number" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-mono font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" value={year} onChange={(e) => setYear(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Tag Bidang *</label>
                    <input type="text" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-bold uppercase focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" placeholder="WEB_DEV" value={tag} onChange={(e) => setTag(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Status / Rank *</label>
                    <input type="text" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-bold uppercase focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" placeholder="NATIONAL CHAMPION" value={rank} onChange={(e) => setRank(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Jenis Arsip *</label>
                    <select className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-mono font-bold uppercase focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all appearance-none cursor-pointer" value={type} onChange={(e) => setType(e.target.value as any)} required>
                      <option value="PRESTASI">PRESTASI (LOMBA)</option>
                      <option value="SERTIFIKASI">SERTIFIKASI (KELULUSAN)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Bukti Media *</label>
                  <label className="flex items-center justify-center gap-3 w-full border-[3px] border-dashed border-black p-4 rounded-lg bg-white cursor-pointer hover:bg-[var(--color-retro-yellow)] transition-colors group">
                    <div className="bg-black text-white p-2 border-2 border-black rounded group-hover:rotate-6 transition-transform">
                      <Plus className="w-4 h-4 block" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      {uploading ? "UPLOADING..." : "UPLOAD GAMBAR (WAJIB)"}
                    </span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative aspect-video border-[3px] border-black rounded-lg overflow-hidden bg-white shadow-[2px_2px_0_rgba(0,0,0,1)] rotate-[1deg]">
                          <Image src={img} width={100} height={60} className="w-full h-full object-cover" alt="" unoptimized />
                          <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-[var(--color-retro-pink)] border-2 border-black text-white rounded w-5 h-5 flex items-center justify-center text-[10px] font-black hover:scale-110 transition-transform">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 border-t-[3px] border-black bg-white px-6 py-4 flex gap-4 justify-end">
              <button type="button" onClick={closeModal} className="px-6 py-3 border-[3px] border-black bg-white font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">
                BATAL
              </button>
              <button type="submit" form="achievement-form" className="px-6 py-3 border-[3px] border-black bg-[var(--color-retro-lime)] font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">
                {editingId ? "✔ UPDATE_DATA.SYS" : "✔ SAVE_DATA.SYS"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}