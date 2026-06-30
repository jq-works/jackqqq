"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Briefcase, Search, PenSquare, Trash, Plus, Close } from "pixelarticons/react";
import { motion } from "framer-motion";
import { playSynthSound } from "@/lib/audio"; // Ensure this function exists or provide fallback

const retroSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 12,
  mass: 0.9,
};

const NAV_LINKS = [
  { href: "/admin", label: "🏠 Dashboard", active: false },
  { href: "/admin/projects", label: "💼 Kelola Proyek", active: true },
  { href: "/admin/achievements", label: "🏆 Kelola Achievements", active: false },
  { href: "/admin/guestbook", label: "📝 Kelola Guestbook", active: false },
];

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCatPanel, setShowCatPanel] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  interface CustomLink {
    label: string;
    url: string;
    icon: string;
  }

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const constraintsRef = useRef(null);

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    await fetchCategories();
    await fetchProjects();
    setLoading(false);
  }

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  }

  async function moveProject(index: number, direction: "up" | "down") {
    const newProjects = [...projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);

    const promises = newProjects.map((p, idx) =>
      supabase.from("projects").update({ sort_order: idx }).eq("id", p.id)
    );
    await Promise.all(promises);
    fetchProjects();
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (data) {
      setCategories(data);
      if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].name);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim().toUpperCase();
    const { error } = await supabase.from("categories").insert([{ name }]);
    if (error) alert("Gagal: " + error.message);
    else { setNewCategoryName(""); await fetchCategories(); setSelectedCategory(name); }
  }

  async function handleDeleteCategory(id: number, name: string) {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) await fetchCategories();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files.length) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const urls = [...images];
    const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "ml_default");
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd });
        const d = await res.json();
        if (d.secure_url) urls.push(d.secure_url);
      } catch (err) { console.error(err); }
    }
    setImages(urls);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return alert("Mohon isi Judul dan Deskripsi!");
    const cat = selectedCategory || (categories[0]?.name ?? "GENERAL");
    const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const palette = ["bg-retro-orange", "bg-retro-yellow", "bg-retro-lime", "bg-retro-blue", "bg-retro-pink"];

    const payload: any = {
      title: title.trim(), category: cat, description: description.trim(),
      tags: tagArr, 
      github_url: customLinks[0]?.url || "",
      link: customLinks[1]?.url || customLinks[0]?.url || "",
      custom_links: customLinks,
      is_featured: isFeatured, images, year: "2026",
    };
    
    if (typeof playSynthSound === "function") playSynthSound("triangle", 300, 0.1);

    if (editingId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingId);
      if (error) return alert("GAGAL UPDATE: " + error.message);
      alert("Proyek diperbarui!");
    } else {
      payload.color_class = palette[Math.floor(Math.random() * palette.length)];
      payload.sort_order = projects.length;
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) return alert("GAGAL SIMPAN: " + error.message);
      alert("Proyek baru tersimpan!");
    }

    closeModal();
    await fetchProjects();
  }

  function openAddModal() { resetForm(); setModalOpen(true); }
  function startEdit(p: any) {
    setEditingId(p.id); setTitle(p.title); setSelectedCategory(p.category || "");
    setDescription(p.description); setTags(p.tags ? p.tags.join(", ") : "");
    setGithubUrl(p.github_url || ""); setLiveUrl(p.live_url || p.link || "");
    setIsFeatured(p.is_featured); setImages(p.images || []);
    
    if (p.custom_links && p.custom_links.length > 0) {
      setCustomLinks(p.custom_links);
    } else {
      const converted: CustomLink[] = [];
      if (p.github_url) {
        converted.push({ label: "REPO_GIT", url: p.github_url, icon: "folder" });
      }
      if (p.link) {
        converted.push({ label: "LIVE_SITE", url: p.link, icon: "external-link" });
      }
      setCustomLinks(converted.slice(0, 2));
    }
    
    setModalOpen(true);
  }
  function closeModal() { setModalOpen(false); resetForm(); }
  function resetForm() {
    setEditingId(null); setTitle(""); setDescription(""); setTags("");
    setGithubUrl(""); setLiveUrl(""); setCustomLinks([]); setIsFeatured(false); setImages([]);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus proyek ini?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) { if (editingId === id) resetForm(); fetchProjects(); }
  }

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="bg-[var(--color-retro-blue)] px-4 py-2 border-b-[3px] border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-black bg-red-500" />
            <div className="w-3 h-3 rounded-full border-2 border-black bg-yellow-400" />
            <div className="w-3 h-3 rounded-full border-2 border-black bg-green-400" />
          </div>
          <span className="font-bold text-white text-[10px] tracking-widest uppercase">C:\PROJECTS_MANAGER.EXE</span>
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
            <div className="bg-black p-3 border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
              <Briefcase className="w-8 h-8 block text-[var(--color-retro-yellow)]" />
            </div>
            <div>
              <h1 className="font-syne text-2xl md:text-3xl font-black uppercase tracking-tight">Kelola Proyek</h1>
              <p className="text-neutral-500 font-bold mt-1">// CUSTOM_CATEGORIES + SEARCHABLE_SYSTEM</p>
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
            <Plus className="w-5 h-5 block" /> TAMBAH_PROYEK.NEW
          </button>
          <button onClick={() => setShowCatPanel((v) => !v)} className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-black border-[3px] border-black font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">
            {showCatPanel ? "▾" : "▸"} MANAGE_CATEGORIES
          </button>
          <div className="flex-1" />
          <div className="w-full sm:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-black block" />
            </div>
            <input
              type="text"
              className="w-full border-[3px] border-black pl-10 pr-4 py-3 rounded-lg bg-white text-xs font-bold placeholder:text-neutral-500 focus:outline-none shadow-[4px_4px_0_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all"
              placeholder="Cari judul / kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Category Panel */}
        {showCatPanel && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <span className="font-black uppercase text-sm block mb-4 border-b-[3px] border-black pb-2">MANAGE_CATEGORIES.SYS</span>
            <form onSubmit={handleAddCategory} className="flex gap-3 mb-5">
              <input
                type="text"
                className="flex-1 border-[3px] border-black p-3 rounded-lg bg-[var(--color-retro-bg)] font-bold uppercase placeholder:normal-case placeholder:text-neutral-400 focus:outline-none focus:bg-white"
                placeholder="Nama kategori baru..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="submit" className="bg-[var(--color-retro-blue)] text-white px-6 py-3 border-[3px] border-black font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">+ ADD</button>
            </form>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 bg-neutral-100 border-[3px] border-black rounded-full px-4 py-1.5 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  <span className="font-bold uppercase text-[10px]">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-white bg-[var(--color-retro-pink)] border border-black rounded-full w-4 h-4 flex items-center justify-center font-black text-[10px] hover:scale-110 transition-transform">×</button>
                </div>
              ))}
              {categories.length === 0 && <span className="text-neutral-400 font-bold uppercase text-[10px]">// Belum ada kategori</span>}
            </div>
          </motion.div>
        )}

        {/* Live Feed */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={retroSpring}
          className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          <div className="bg-black text-white px-5 py-3 flex items-center justify-between border-b-[3px] border-black">
            <span className="font-bold uppercase text-sm tracking-widest">LIVE_DATABASE_FEED.LOG</span>
            <span className="text-[var(--color-retro-yellow)] font-bold bg-neutral-800 px-2 py-1 rounded border border-black text-[10px]">{filteredProjects.length} RECORDS</span>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {loading ? (
              <div className="py-16 text-center text-neutral-400 animate-pulse font-bold uppercase tracking-widest">// BUFFERING_RECORDS...</div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((p, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...retroSpring, delay: i * 0.05 }}
                  key={p.id} 
                  className="p-4 border-[3px] border-black rounded-xl bg-[var(--color-retro-bg)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:bg-white transition-colors group"
                >
                  <div className="flex gap-4 items-start w-full min-w-0">
                    <div className="w-24 h-16 bg-neutral-200 border-[3px] border-black rounded-lg overflow-hidden shrink-0 flex items-center justify-center -rotate-1 group-hover:rotate-0 transition-transform">
                      {p.images?.length > 0
                        ? <Image src={p.images[0]} alt="Preview" width={96} height={64} unoptimized className="w-full h-full object-cover" />
                        : <span className="text-[10px] text-neutral-400 font-bold">NO_IMG</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-black text-base uppercase leading-tight font-syne">{p.title}</span>
                        {p.is_featured && <span className="text-[9px] font-black uppercase bg-[var(--color-retro-yellow)] border-2 border-black px-2 py-0.5 rounded-full text-black">⭐ FEATURED</span>}
                        <span className={`text-[9px] text-white px-2 py-0.5 rounded-full border-2 border-black font-bold uppercase ${p.color_class || "bg-black"}`}>{p.category}</span>
                      </div>
                      <p className="text-black font-sans font-bold text-xs line-clamp-1 mb-2">{p.description}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {p.tags.slice(0, 5).map((tag: string, idx: number) => (
                            <span key={idx} className="font-mono text-[9px] font-black text-black bg-white border-2 border-black px-2 py-0.5 rounded uppercase shadow-[1px_1px_0_rgba(0,0,0,1)]">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {/* Urutan Project */}
                    <div className="flex flex-col gap-1 mr-1">
                      <button 
                        onClick={() => moveProject(i, "up")} 
                        disabled={i === 0} 
                        className={`p-1 border-2 border-black rounded font-bold text-[8px] transition-all cursor-pointer ${
                          i === 0 
                            ? "bg-neutral-200 text-neutral-400 border-neutral-400 cursor-not-allowed shadow-none" 
                            : "bg-white hover:bg-neutral-100 active:translate-y-[-1px] shadow-[2px_2px_0_rgba(0,0,0,1)] active:shadow-none"
                        }`}
                        title="Geser ke Atas"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => moveProject(i, "down")} 
                        disabled={i === filteredProjects.length - 1} 
                        className={`p-1 border-2 border-black rounded font-bold text-[8px] transition-all cursor-pointer ${
                          i === filteredProjects.length - 1 
                            ? "bg-neutral-200 text-neutral-400 border-neutral-400 cursor-not-allowed shadow-none" 
                            : "bg-white hover:bg-neutral-100 active:translate-y-[1px] shadow-[2px_2px_0_rgba(0,0,0,1)] active:shadow-none"
                        }`}
                        title="Geser ke Bawah"
                      >
                        ▼
                      </button>
                    </div>

                    <button onClick={() => startEdit(p)} className="p-3 border-[3px] border-black rounded-lg bg-white hover:bg-[var(--color-retro-lime)] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer" title="Edit">
                      <PenSquare className="w-5 h-5 text-black block" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-3 border-[3px] border-black rounded-lg bg-white hover:bg-[var(--color-retro-pink)] hover:text-white transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer" title="Hapus">
                      <Trash className="w-5 h-5 block" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-[12px] text-black font-black bg-[var(--color-retro-pink)] border-2 border-black px-3 py-1 rounded uppercase mb-3 shadow-[2px_2px_0_rgba(0,0,0,1)] rotate-[-2deg]">ERROR 404: RECORDS_NOT_FOUND</span>
                <span className="text-xs text-neutral-500 font-bold uppercase">Tidak ada proyek yang cocok.</span>
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
            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="relative z-10 w-full max-w-2xl bg-white border-[3px] border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto"
          >
            {/* Modal Header (Window Drag Handle) */}
            <div className="bg-[var(--color-retro-blue)] text-white flex items-center justify-between px-5 py-3 border-b-[3px] border-black shrink-0 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                <div className="bg-black p-1.5 border-2 border-black rounded">
                  <Briefcase className="w-4 h-4 text-[var(--color-retro-yellow)] block" />
                </div>
                <span className="font-black uppercase text-xs tracking-widest">
                  {editingId ? "EDIT_PROYEK.EXE" : "INPUT_PROYEK.NEW"}
                </span>
              </div>
              <button onClick={closeModal} className="bg-[var(--color-retro-pink)] p-1.5 border-2 border-black rounded shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                <Close className="w-4 h-4 text-white block" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 flex-1 bg-[var(--color-retro-bg)]" style={{ scrollbarWidth: 'none' }}>
              <form onSubmit={handleSubmit} className="space-y-6 font-bold" id="project-form">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Judul Proyek *</label>
                    <input type="text" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" placeholder="Nama proyek..." value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Kategori</label>
                    <select className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-mono font-bold uppercase focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all appearance-none cursor-pointer" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      {categories.length === 0 && <option value="GENERAL">GENERAL</option>}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Deskripsi *</label>
                  <textarea rows={3} className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-sans font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all resize-none" placeholder="Deskripsi singkat proyek..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div>
                  <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Tags (pisahkan koma)</label>
                  <input type="text" className="w-full border-[3px] border-black p-3 rounded-lg bg-white font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,1)] focus:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all" placeholder="react, tailwind, supabase..." value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block uppercase text-[10px] font-black tracking-widest text-black">
                      Project Links (Maksimal 2)
                    </label>
                    {customLinks.length < 2 && (
                      <button
                        type="button"
                        onClick={() => setCustomLinks([...customLinks, { label: "", url: "", icon: "external-link" }])}
                        className="px-2.5 py-1 bg-[var(--color-retro-orange)] text-white border-2 border-black font-mono text-[9px] font-black uppercase rounded shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-orange-600 transition-all cursor-pointer"
                      >
                        + ADD_LINK
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {customLinks.map((link, idx) => (
                      <div key={idx} className="p-4 border-[3px] border-black bg-white rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] relative flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={() => setCustomLinks(customLinks.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 bg-[var(--color-retro-pink)] text-white border-2 border-black rounded w-5 h-5 flex items-center justify-center text-[10px] font-black hover:scale-110 transition-transform shadow-[1px_1px_0_rgba(0,0,0,1)] cursor-pointer"
                          title="Hapus Link"
                        >
                          ×
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-[9px] uppercase tracking-wider text-neutral-500">// NAMA_LINK (LABEL)</label>
                            <input
                              type="text"
                              required
                              placeholder="CONTOH: REPO_GIT, LIVE_SITE"
                              className="w-full border-2 border-black p-2 rounded bg-neutral-50 font-bold focus:outline-none focus:bg-white text-xs uppercase"
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...customLinks];
                                newLinks[idx].label = e.target.value;
                                setCustomLinks(newLinks);
                              }}
                            />
                          </div>

                          <div>
                            <label className="block mb-1 text-[9px] uppercase tracking-wider text-neutral-500">// TIPE_ICON (PIXELARTICONS)</label>
                            <div className="flex gap-2">
                              <select
                                className="flex-1 border-2 border-black p-2 rounded bg-neutral-50 font-mono font-bold focus:outline-none focus:bg-white text-xs cursor-pointer"
                                value={
                                  ["external-link", "folder", "git-branch", "link", "globe", "download", "play", "briefcase", "book-open", "file"].includes(link.icon)
                                    ? link.icon
                                    : "custom"
                                }
                                onChange={(e) => {
                                  const newLinks = [...customLinks];
                                  if (e.target.value === "custom") {
                                    newLinks[idx].icon = "";
                                  } else {
                                    newLinks[idx].icon = e.target.value;
                                  }
                                  setCustomLinks(newLinks);
                                }}
                              >
                                <option value="external-link">external-link (Live Site)</option>
                                <option value="folder">folder (Git Repo)</option>
                                <option value="git-branch">git-branch</option>
                                <option value="link">link (General)</option>
                                <option value="globe">globe</option>
                                <option value="download">download</option>
                                <option value="play">play</option>
                                <option value="briefcase">briefcase</option>
                                <option value="book-open">book-open</option>
                                <option value="file">file</option>
                                <option value="custom">[ Kustom Nama Icon... ]</option>
                              </select>

                              {!["external-link", "folder", "git-branch", "link", "globe", "download", "play", "briefcase", "book-open", "file"].includes(link.icon) && (
                                <input
                                  type="text"
                                  required
                                  placeholder="nama icon..."
                                  className="w-1/2 border-2 border-black p-2 rounded bg-neutral-50 font-bold focus:outline-none focus:bg-white text-xs"
                                  value={link.icon}
                                  onChange={(e) => {
                                    const newLinks = [...customLinks];
                                    newLinks[idx].icon = e.target.value;
                                    setCustomLinks(newLinks);
                                  }}
                                />
                              )}
                            </div>
                            <span className="text-[8px] text-neutral-400 mt-1 block">
                              * Lihat nama icon di{" "}
                              <a href="https://pixelarticons.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
                                pixelarticons.com
                              </a>
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 text-[9px] uppercase tracking-wider text-neutral-500">// URL_LINK</label>
                          <input
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full border-2 border-black p-2 rounded bg-neutral-50 font-bold focus:outline-none focus:bg-white text-xs"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...customLinks];
                              newLinks[idx].url = e.target.value;
                              setCustomLinks(newLinks);
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {customLinks.length === 0 && (
                      <div className="text-center py-6 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-400 font-mono text-[10px] uppercase">
                        // Belum ada link kustom. Klik + ADD_LINK untuk menambahkan.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 uppercase text-[10px] font-black tracking-widest text-black">Screenshots</label>
                  <label className="flex items-center justify-center gap-3 w-full border-[3px] border-dashed border-black p-5 rounded-lg bg-white cursor-pointer hover:bg-[var(--color-retro-yellow)] transition-colors group">
                    <div className="bg-black text-white p-2 border-2 border-black rounded group-hover:-rotate-6 transition-transform">
                      <Plus className="w-5 h-5 block" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      {uploading ? "UPLOADING..." : "KLIK UNTUK UPLOAD GAMBAR"}
                    </span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative aspect-video border-[3px] border-black rounded-lg overflow-hidden bg-white shadow-[2px_2px_0_rgba(0,0,0,1)] rotate-[-1deg]">
                          <Image src={img} width={100} height={60} className="w-full h-full object-cover" alt="" unoptimized />
                          <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-[var(--color-retro-pink)] border-2 border-black text-white rounded w-5 h-5 flex items-center justify-center text-[10px] font-black hover:scale-110 transition-transform">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label htmlFor="feat" className="flex items-center gap-4 cursor-pointer p-4 border-[3px] border-black rounded-lg bg-white hover:bg-[var(--color-retro-lime)] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  <div className="relative flex items-center justify-center w-6 h-6 border-2 border-black bg-white rounded">
                    <input type="checkbox" id="feat" className="peer absolute opacity-0 w-full h-full cursor-pointer" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                    <div className="w-3 h-3 bg-black hidden peer-checked:block" />
                  </div>
                  <span className="uppercase text-[11px] font-black tracking-widest text-black flex-1">Set sebagai Featured ⭐</span>
                </label>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 border-t-[3px] border-black bg-white px-6 py-4 flex gap-4 justify-end">
              <button type="button" onClick={closeModal} className="px-6 py-3 border-[3px] border-black bg-white font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">
                BATAL
              </button>
              <button type="submit" form="project-form" className="px-6 py-3 border-[3px] border-black bg-[var(--color-retro-lime)] font-black uppercase rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all">
                {editingId ? "✔ UPDATE_DATA.SYS" : "✔ SAVE_DATA.SYS"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
