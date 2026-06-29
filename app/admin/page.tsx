"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Briefcase, Search, PenSquare, Trash } from "pixelarticons/react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // State Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // State Manajemen Kategori Kustom
  const [newCategoryName, setNewCategoryName] = useState("");

  // State CRUD Proyek & Edit Mode
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialData();
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
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (data) {
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].name);
      }
    }
  }

  // Tambah Kategori Kustom Baru
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    const formattedName = newCategoryName.trim().toUpperCase();
    const { error } = await supabase.from("categories").insert([{ name: formattedName }]);
    
    if (error) {
      alert("Gagal menambahkan kategori: " + error.message);
    } else {
      setNewCategoryName("");
      await fetchCategories();
      setSelectedCategory(formattedName);
    }
  }

  // Hapus Kategori Kustom
  async function handleDeleteCategory(id: number, name: string) {
    if (!confirm(`Hapus kategori "${name}"? Proyek dengan kategori ini tidak akan terhapus, tetapi kategorinya tetap tersimpan teks.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) await fetchCategories();
  }

  // List Pilihan Warna Header Acak (Brutalist Palette)
  const bgColors = ["bg-retro-blue", "bg-retro-orange", "bg-retro-pink", "bg-retro-purple", "bg-neutral-800"];

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
        console.error(err);
      }
    }
    setImages(uploadedUrls);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validasi input wajib teks utama
    if (!title.trim() || !description.trim()) {
      return alert("Mohon isi Judul Proyek dan Deskripsi!");
    }

    const finalCategory = selectedCategory || (categories.length > 0 ? categories[0].name : "GENERAL");
    const tagArray = tags.split(",").map((t) => t.trim()).filter((t) => t !== "");

    // FIX: Hanya menggunakan 5 variasi warna retro kustom dari variabel CSS portofoliomu
    const bgColors = [
      "bg-retro-orange", // #FF5C00
      "bg-retro-yellow", // #FACC15
      "bg-retro-lime",   // #A3E635
      "bg-retro-blue",   // #3B82F6
      "bg-retro-pink"    // #F472B6
    ];

    const payload: any = {
      title: title.trim(),
      category: finalCategory,
      description: description.trim(),
      tags: tagArray,
      github_url: githubUrl.trim() ? githubUrl.trim() : "", 
      link: liveUrl.trim() ? liveUrl.trim() : "", 
      is_featured: isFeatured,
      images: images,
      year: "2026"
    };

    if (editingId) {
      // MODE UPDATE PROYEK (Tetap mempertahankan warna lama agar tidak berubah saat edit)
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);
        
      if (error) {
        console.error(error);
        return alert("GAGAL UPDATE DATA: " + error.message);
      } else {
        alert("Proyek sukses diperbarui!");
      }
    } else {
      // MODE TAMBAH PROYEK BARU (Mengacak murni dari 5 palet warna di atas)
      const randomColorClass = bgColors[Math.floor(Math.random() * bgColors.length)];
      payload.color_class = randomColorClass;

      const { error } = await supabase
        .from("projects")
        .insert([payload]);
        
      if (error) {
        console.error(error);
        return alert("GAGAL SIMPAN DATA: " + error.message);
      } else {
        alert("Proyek baru berhasil disimpan!");
      }
    }

    resetForm();
    await fetchProjects();
  }

  function startEdit(p: any) {
  setEditingId(p.id);
  setTitle(p.title);
  setSelectedCategory(p.category || ""); // Menyinkronkan kategori proyek ke dropdown select
  setDescription(p.description);
  setTags(p.tags ? p.tags.join(", ") : "");
  setGithubUrl(p.github_url || "");
  setLiveUrl(p.live_url || "");
  setIsFeatured(p.is_featured);
  setImages(p.images || []);
}

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTags("");
    setGithubUrl("");
    setLiveUrl("");
    setIsFeatured(false);
    setImages([]);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus proyek ini?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      if (editingId === id) resetForm();
      fetchProjects();
    }
  }

  // Filter pencarian di dashboard admin
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F0EC] text-black p-6 md:p-12 font-mono text-xs select-none">
      
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between border-3 border-black bg-white p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-black text-[#FACC15] p-3 border-2 border-black rounded-lg">
            <Briefcase className="w-8 h-8 block text-[#FACC15]" />
          </div>
          <div>
            <h1 className="font-syne text-2xl font-black uppercase">
              {editingId ? "[MODE_EDIT] " : "[MODE_INPUT] "}PROJECTS_MANAGER.SYS
            </h1>
            <p className="text-neutral-500">// CUSTOM_CATEGORIES + SEARCHABLE_SYSTEM</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 self-stretch sm:self-center">
          <a href="/admin" className="px-3 py-1.5 border-2 border-black bg-black text-white font-bold rounded shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-neutral-800 transition-all uppercase text-[10px] flex items-center justify-center">
            💼 Kelola Proyek
          </a>
          <a href="/admin/achievements" className="px-3 py-1.5 border-2 border-black bg-white text-black font-bold rounded shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all uppercase text-[10px] flex items-center justify-center">
            🏆 Kelola Achievements
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PANEL KIRI: FORM PROYEK & ATUR KATEGORI */}
        <div className="space-y-6">
          
          {/* A. FORM INPUT PROYEK */}
          <div className="bg-white border-3 border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <span className="font-bold uppercase text-sm">FORM_INPUT_PROYEK</span>
              {editingId && (
                <button type="button" onClick={resetForm} className="bg-neutral-200 border-2 border-black px-2 py-0.5 rounded font-bold">BATAL</button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-bold">
              <div>
                <label className="block mb-1">JUDUL PROYEK</label>
                <input type="text" className="w-full border-2 border-black p-2 rounded bg-white" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              
              {/* DROPDOWN KATEGORI DARI DATABASE */}
              <div>
                <label className="block mb-1">KATEGORI (PILIH NODE)</label>
                <select className="w-full border-2 border-black p-2 rounded bg-white font-mono font-bold uppercase" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option value="GENERAL">GENERAL</option>}
                </select>
              </div>

              <div>
                <label className="block mb-1">DESKRIPSI</label>
                <textarea rows={3} className="w-full border-2 border-black p-2 rounded bg-white font-sans" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1">TAGS (Pisahkan dengan koma)</label>
                <input type="text" className="w-full border-2 border-black p-2 rounded bg-white" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1">REPO URL</label>
                <input type="text" className="w-full border-2 border-black p-2 rounded bg-white" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1">LIVE URL</label>
                <input type="text" className="w-full border-2 border-black p-2 rounded bg-white" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1">SCREENSHOTS</label>
                <input type="file" multiple accept="image/*" className="w-full border-2 border-black p-1 rounded bg-white text-[10px]" onChange={handleImageUpload} />
                {uploading && <p className="text-retro-orange mt-1 animate-pulse">Uploading...</p>}
                
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2 border border-black p-1.5 bg-neutral-100 rounded">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-video border border-black bg-white rounded overflow-hidden">
                        <Image src={img} width={100} height={60} className="w-full h-full object-cover" alt="" unoptimized />
                        <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-[8px]">X</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 py-1">
                <input type="checkbox" id="feat" className="accent-black w-4 h-4" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                <label htmlFor="feat" className="cursor-pointer">SET SEBAGAI FEATURED</label>
              </div>

              <button type="submit" className="w-full bg-retro-lime border-3 border-black p-2.5 font-black uppercase text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {editingId ? "UPDATE_DATA.SYS" : "SAVE_DATA.SYS"}
              </button>
            </form>
          </div>

          {/* B. PANEL MANAGEMENT KATEGORI KUSTOM */}
          <div className="bg-white border-3 border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-bold uppercase text-sm block mb-3 border-b-2 border-black pb-2">MANAGE_CATEGORIES</span>
            
            {/* Form Tambah Kategori */}
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input type="text" className="flex-1 border-2 border-black p-1.5 rounded bg-white font-bold uppercase placeholder:normal-case" placeholder="Nama kategori baru..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
              <button type="submit" className="bg-retro-blue text-white px-3 border-2 border-black font-black">+</button>
            </form>

            {/* List Kategori Saat Ini */}
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="flex justify-between items-center p-1.5 border border-black bg-neutral-50 rounded">
                  <span className="font-bold uppercase text-[10px]">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-red-500 font-bold px-1 hover:bg-red-100 rounded text-[9px]">HAPUS</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* PANEL KANAN: LIVE DATABASE FEED LOG + SEARCHBAR */}
        <section className="lg:col-span-2 bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Panel header */}
          <div className="bg-black text-white px-4 py-3 border-b-3 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="font-bold uppercase text-sm tracking-wide">LIVE_DATABASE_FEED.LOG</span>
            {/* SEARCHBAR DASHBOARD ADMIN */}
            <div className="w-full sm:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-neutral-400 block" />
              </div>
              <input
                type="text"
                className="w-full border-2 border-neutral-600 pl-8 pr-3 py-1.5 rounded bg-neutral-800 text-xs font-bold text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                placeholder="Cari judul / kategori log..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[680px] overflow-y-auto">
            {loading ? (
              <div className="py-16 text-center text-neutral-400 animate-pulse font-mono text-[11px]">
                // BUFFERING_RECORDS...
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3 border-2 border-black rounded-lg bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white transition-colors"
                >
                  {/* Left: image + info */}
                  <div className="flex gap-3 items-start w-full min-w-0">
                    <div className="w-20 h-14 bg-neutral-200 border-2 border-black rounded overflow-hidden shrink-0 flex items-center justify-center">
                      {p.images && p.images.length > 0 ? (
                        <Image src={p.images[0]} alt="Preview" width={80} height={56} unoptimized className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] text-neutral-400 font-bold">NO_IMG</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-sm uppercase leading-tight">{p.title}</span>
                        {p.is_featured && (
                          <span className="text-[8px] font-black uppercase bg-retro-yellow border border-black px-1.5 py-0.5 rounded text-black">⭐ FEATURED</span>
                        )}
                        <span className={`text-[8px] text-white px-1.5 py-0.5 rounded border border-black font-bold uppercase ${p.color_class || "bg-neutral-800"}`}>
                          {p.category}
                        </span>
                      </div>
                      <p className="text-neutral-500 font-sans text-xs line-clamp-1 mb-1.5">{p.description}</p>
                      {p.tags && p.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {p.tags.slice(0, 4).map((tag: string, i: number) => (
                            <span key={i} className="font-mono text-[8px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded uppercase">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => startEdit(p)}
                      className="p-2 border-2 border-black rounded bg-white hover:bg-retro-lime transition-all shadow-[2px_2px_0_rgba(0,0,0,1)]"
                      title="Edit"
                    >
                      <PenSquare className="w-4 h-4 text-black block" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 border-2 border-black rounded bg-white hover:bg-retro-pink transition-all shadow-[2px_2px_0_rgba(0,0,0,1)]"
                      title="Hapus"
                    >
                      <Trash className="w-4 h-4 text-black block" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="font-mono text-[10px] text-neutral-500 uppercase mb-2">ERROR 404: RECORDS_NOT_FOUND</span>
                <span className="font-mono text-xs text-neutral-400">Tidak ada proyek yang cocok dengan pencarian Anda.</span>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}