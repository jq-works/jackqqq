"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Plus, Trash, PenSquare, Close, MapPin } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import Image from "next/image";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // State CRUD & Edit Mode Switcher
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");
  const [year, setYear] = useState("2026");
  const [tag, setTag] = useState("");
  const [institution, setInstitution] = useState(""); // State Baru
  const [type, setType] = useState<"PRESTASI" | "SERTIFIKASI">("PRESTASI");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
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
      institution: institution.trim(), // Data Institusi
      type,
      image_url: images[0]
    };

    if (editingId) {
      // MODE UPDATE DATA
      const { error } = await supabase
        .from("achievements")
        .update(payload)
        .eq("id", editingId);

      if (!error) {
        alert("Log pencapaian berhasil diperbarui!");
        resetForm();
        fetchData();
      } else {
        alert("Gagal memperbarui: " + error.message);
      }
    } else {
      // MODE SIMPAN DATA BARU (Generate ID & Warna Acak Otomatis)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      payload.id_display = `JQ-${randomNum}`;

      const bgColors = ["bg-retro-orange", "bg-retro-yellow", "bg-retro-lime", "bg-retro-blue", "bg-retro-pink"];
      payload.color_class = bgColors[Math.floor(Math.random() * bgColors.length)];

      const { error } = await supabase.from("achievements").insert([payload]);

      if (!error) {
        alert(`Sukses tersimpan dengan ID: ${payload.id_display}`);
        resetForm();
        fetchData();
      } else {
        alert("Gagal menyimpan: " + error.message);
      }
    }
  }

  function startEdit(item: any) {
    setEditingId(item.id);
    setTitle(item.title);
    setRank(item.rank);
    setYear(item.year.toString());
    setTag(item.tag);
    setInstitution(item.institution || "");
    setType(item.type);
    setImages(item.images || (item.image_url ? [item.image_url] : []));
  }

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

  return (
    <div className="min-h-screen bg-[#F4F0EC] text-black p-6 md:p-12 font-mono text-xs select-none">
      
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between border-3 border-black bg-white p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-black text-[#FACC15] p-3 border-2 border-black rounded-lg">
            <Trophy className="w-8 h-8 block" />
          </div>
          <div>
            <h1 className="font-syne text-2xl font-black uppercase">
              {editingId ? "[MODE_EDIT] " : "[MODE_INPUT] "}ACHIEVEMENTS_MANAGER.SYS
            </h1>
            <p className="text-neutral-500">// EDITABLE_SYSTEM + INSTITUTION_COLUMN</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 self-stretch sm:self-center">
          <a href="/admin" className="px-3 py-1.5 border-2 border-black bg-white text-black font-bold rounded shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all uppercase text-[10px] flex items-center justify-center">
            💼 Kelola Proyek
          </a>
          <a href="/admin/achievements" className="px-3 py-1.5 border-2 border-black bg-black text-white font-bold rounded shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-neutral-800 transition-all uppercase text-[10px] flex items-center justify-center">
            🏆 Kelola Achievements
          </a>
          {editingId && (
            <button onClick={resetForm} className="bg-retro-pink border-2 border-black px-3 py-1.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-pink-400 transition-all uppercase text-[10px]">
              BATAL EDIT
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PANEL FORM CONTROL */}
        <section className="lg:col-span-1 bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-fit">
          <div className="bg-black text-white px-4 py-3 font-bold uppercase border-b-3 border-black">
            FORM_DATA_CONTROL
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4 font-bold">
            <div>
              <label className="block text-neutral-500 uppercase mb-1">JUDUL PRESTASI / SERTIFIKAT</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black" />
            </div>

            <div>
              <label className="block text-neutral-500 uppercase mb-1">LOKASI / INSTITUSI PENYELENGGARA</label>
              <input type="text" placeholder="Contoh: ITS / Radar Tulungagung / freeCodeCamp" value={institution} onChange={(e) => setInstitution(e.target.value)} required className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 uppercase mb-1">TAHUN</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black" />
              </div>
              <div>
                <label className="block text-neutral-500 uppercase mb-1">TAG BIDANG</label>
                <input type="text" placeholder="WEB_DEV" value={tag} onChange={(e) => setTag(e.target.value)} required className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black" />
              </div>
            </div>

            <div>
              <label className="block text-neutral-500 uppercase mb-1">STATUS / PERINGKAT (RANK)</label>
              <input type="text" placeholder="NATIONAL CHAMPION" value={rank} onChange={(e) => setRank(e.target.value)} required className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black" />
            </div>

            <div>
              <label className="block text-neutral-500 uppercase mb-1">JENIS ARSIP</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black font-bold">
                <option value="PRESTASI">PRESTASI (LOMBA)</option>
                <option value="SERTIFIKASI">SERTIFIKASI (KELULUSAN)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-500 uppercase mb-1">BUKTI MEDIA (MULTI UPLOAD)</label>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-1.5 border-2 border-black rounded bg-white text-[10px]" />
              
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

            <button type="submit" style={{ backgroundColor: editingId ? '#A3E635' : '#FACC15' }} className="w-full py-3 font-black uppercase border-2 border-black rounded shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black cursor-pointer">
              {editingId ? "EXECUTE_UPDATE.SYS" : "EXECUTE_SAVE.SYS"}
            </button>
          </form>
        </section>

        {/* MONITOR LOG DATABASE TABLE */}
        <section className="lg:col-span-2 bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-black text-white px-4 py-3 font-bold uppercase border-b-3 border-black">
            LIVE_STREAM_MONITOR
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-neutral-400 animate-pulse">// BUFFERING_RECORDS...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b-2 border-black">
                    <th className="p-4 font-black border-r-2 border-black">KODE ID</th>
                    <th className="p-4 font-black border-r-2 border-black">LOG DETAIL</th>
                    <th className="p-4 font-black text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((item) => (
                    <tr key={item.id} className="border-b-2 border-black hover:bg-neutral-50">
                      <td className="p-4 font-bold border-r-2 border-black align-middle bg-neutral-50">
                        <span>{item.id_display}</span>
                        <span className="block text-[9px] text-neutral-400 font-normal">Y: {item.year}</span>
                      </td>
                      <td className="p-4 border-r-2 border-black align-middle">
                        <span className="font-sans font-extrabold text-sm block uppercase text-black">{item.title}</span>
                        <span className="text-[10px] text-neutral-400 font-semibold mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 block shrink-0" /> Institusi: {item.institution || "-"}
                        </span>
                        <div className="flex gap-2 mt-1.5 items-center flex-wrap">
                          <span className={`px-1.5 py-0.2 text-[9px] border border-black font-bold uppercase text-white ${item.color_class}`}>{item.type}</span>
                          <span className="text-[10px] text-neutral-400">#{item.tag}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center align-middle">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => startEdit(item)} className="p-2 border-2 border-black rounded bg-white hover:bg-retro-lime transition-all shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            <PenSquare className="w-4 h-4 text-black block" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 border-2 border-black rounded bg-white hover:bg-retro-pink transition-all shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            <Trash className="w-4 h-4 text-black block" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}