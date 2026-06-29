"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase } from "pixelarticons/react";
import { ProjectCard } from "./ProjectCard";

export default function ProjectSection() {
  const [listProyek, setListProyek] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  // State Pagination (Dibatasi 3 Proyek per Halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 3; 

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // 1. Fetch Kategori untuk Tombol Filter
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (catData) setCategories(catData);

      // 2. Fetch Seluruh Proyek
      const { data: projData, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // Di dalam components/ProjectSection.tsx bagian fetch data proyek:
if (projData) {
  const mappedData = projData.map((p) => ({
    title: p.title,
    category: p.category,
    description: p.description,
    tags: p.tags,
    githubUrl: p.github_url,
    liveUrl: p.link, // FIX: Ambil dari p.link sesuai skema Supabase kamu
    colorClass: p.color_class || "bg-retro-blue", 
    year: p.year,
    images: p.images || [], 
  }));
  setListProyek(mappedData);
}
      if (error) console.error("Error loading projects feed:", error.message);
      setLoading(false);
    }

    loadData();
  }, []);

  // Reset ke halaman 1 setiap kali user mengetik pencarian atau mengubah filter kategori
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Filter Data Gabungan (Kategori Kustom + Searchbar Teks)
  const filteredProjects = listProyek.filter((proyek) => {
    const matchesCategory = activeCategory === "ALL" || proyek.category.toUpperCase() === activeCategory.toUpperCase();
    const matchesSearch = 
      proyek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proyek.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proyek.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Logika Kalkulasi Halaman Aktif (3 Proyek Per Halaman)
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const indexOfLastProject = currentPage * PROJECTS_PER_PAGE;
  const indexOfFirstProject = indexOfLastProject - PROJECTS_PER_PAGE;
  
  // Hasil potongan data final untuk dirender ke grid
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section id="proyek" className="max-w-7xl mx-auto px-4 md:px-8 mt-24 select-none">
      
      {/* Header Etalase */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b-4 border-black pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-retro-blue text-white p-3 border-3 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Briefcase className="text-white w-6 h-6 block" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold block">// KARYA_TERPILIH</span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-black uppercase mt-0.5">ETALASE_PROJECT.EXE</h2>
          </div>
        </div>

        {/* Searchbar */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            className="w-full border-3 border-black p-2.5 rounded-none bg-white text-xs font-black placeholder:text-neutral-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
            placeholder="🔍 Cari proyek, stack tech, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-2.5 mb-12">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`px-4 py-2 border-2 border-black rounded-none font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
            activeCategory === "ALL" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"
          }`}
        >
          [ALL_NODES]
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 border-2 border-black rounded-none font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
              activeCategory === cat.name ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tampilan Etalase Grid */}
      {loading ? (
        <div className="text-center py-20 font-mono text-xs tracking-widest animate-pulse text-neutral-400">// CONNECTING_TO_DATABASE_NODE...</div>
      ) : (
        <>
          {/* Grid Layout (Tetap Maksimal 3 Card Per Baris/Halaman) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((proyek, index) => (
              <ProjectCard
                key={index}
                title={proyek.title}
                category={proyek.category}
                description={proyek.description}
                tags={proyek.tags}
                githubUrl={proyek.githubUrl}
                liveUrl={proyek.liveUrl}
                colorClass={proyek.colorClass}
                year={proyek.year}
                images={proyek.images}
              />
            ))}
          </div>

          {currentProjects.length === 0 && (
            <p className="text-center font-mono text-xs text-neutral-400 py-16">// DATA_ETALASE_TIDAK_DITEMUKAN_PADA_NODE_INI</p>
          )}

          {/* KONTROL NAVIGASI PAGINATION BRUTALIST */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16 font-mono">
              {/* Tombol PREV */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 border-3 border-black rounded-none font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  currentPage === 1
                    ? "bg-neutral-200 text-neutral-400 border-neutral-400 shadow-none cursor-not-allowed"
                    : "bg-white text-black hover:bg-neutral-100 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                }`}
              >
                ◀ PREV
              </button>

              {/* Status Halaman Tengah */}
              <div className="px-4 py-2 bg-black text-white border-3 border-black font-black text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                PAGE: {currentPage} / {totalPages}
              </div>

              {/* Tombol NEXT */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border-3 border-black rounded-none font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  currentPage === totalPages
                    ? "bg-neutral-200 text-neutral-400 border-neutral-400 shadow-none cursor-not-allowed"
                    : "bg-[#facc15] text-black hover:bg-[#fde047] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                }`}
              >
                NEXT ▶
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}