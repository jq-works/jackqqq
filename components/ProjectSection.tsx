"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, Search, Folder } from "pixelarticons/react";
import { ProjectCard } from "./ProjectCard";

function ProjectCardSkeleton() {
  return (
    <article className="bg-white border-3 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col justify-between h-full relative animate-pulse select-none">
      <div>
        {/* TOP WINDOW BAR */}
        <div className="flex items-center justify-between border-b-3 border-black p-3 bg-neutral-300 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-black inline-block"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-black inline-block"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-black inline-block"></div>
            </div>
            <div className="h-3.5 w-24 bg-neutral-400 border border-black rounded-sm"></div>
          </div>
          <div className="bg-neutral-400 border-2 border-black rounded-sm w-16 h-5"></div>
        </div>

        {/* PROJECT BODY */}
        <div className="p-6">
          <div className="w-full h-48 bg-neutral-200 border-3 border-black rounded shadow-[inset_4px_4px_0px_rgba(0,0,0,0.15)] mb-5 overflow-hidden flex items-center justify-center relative retro-grid shrink-0">
            <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <Folder className="w-6 h-6 text-black opacity-30 animate-pulse" />
            </div>
          </div>

          <div className="h-6 w-3/4 bg-neutral-300 border-2 border-black rounded-sm mb-4"></div>
          <div className="space-y-2 mb-5">
            <div className="h-3.5 w-full bg-neutral-200 border border-black/10 rounded-sm"></div>
            <div className="h-3.5 w-5/6 bg-neutral-200 border border-black/10 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* FOOTER AREA */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="h-6 w-16 bg-neutral-200 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="h-6 w-14 bg-neutral-200 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        <div className="flex flex-row items-center justify-between border-t-2 border-black pt-4 mt-auto gap-4">
          <div className="h-3.5 w-16 bg-neutral-300 rounded-sm"></div>
          <div className="flex flex-row items-center gap-3">
            <div className="w-20 h-7 bg-neutral-200 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="w-20 h-7 bg-neutral-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>
        </div>
      </div>
    </article>
  );
}

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
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      // Di dalam components/ProjectSection.tsx bagian fetch data proyek:
if (projData) {
  const mappedData = projData.map((p, index) => ({
    title: p.title,
    category: p.category,
    description: p.description,
    tags: p.tags,
    githubUrl: p.github_url,
    liveUrl: p.link,
    customLinks: p.custom_links || [],
    colorClass: p.color_class 
      ? p.color_class.replace("bg-[var(--color-", "bg-").replace(")]", "") 
      : ["bg-retro-orange", "bg-retro-yellow", "bg-retro-lime", "bg-retro-blue", "bg-retro-pink"][index % 5], 
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
    <section id="proyek" className="max-w-7xl mx-auto px-4 md:px-8 mt-24 select-none scroll-mt-24">
      
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-black block" />
          </div>
          <input
            type="text"
            className="w-full border-[3px] border-black pl-9 pr-2.5 py-2.5 rounded-none bg-white text-xs font-black placeholder:text-neutral-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
            placeholder="Cari proyek, stack tech, atau deskripsi..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
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
                customLinks={proyek.customLinks}
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
                className={`px-5 py-2 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                  currentPage === 1
                    ? "bg-neutral-200 text-neutral-400 border-[3px] border-neutral-400 cursor-not-allowed"
                    : "bg-white text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                ◀ PREV
              </button>

              {/* Status Halaman Tengah */}
              <div className="px-5 py-2 bg-black text-white border-[3px] border-black font-black text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                PAGE: {currentPage} / {totalPages}
              </div>

              {/* Tombol NEXT */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-5 py-2 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                  currentPage === totalPages
                    ? "bg-neutral-200 text-neutral-400 border-[3px] border-neutral-400 cursor-not-allowed"
                    : "bg-white text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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