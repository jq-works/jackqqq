"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { Briefcase, Search, ChevronLeft, ChevronRight } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";

const INITIAL_PROJECTS = [
  {
    title: "OrchiCare Inovasi IoT",
    category: "IoT & AI APP",
    description: "Sistem otomasi manajemen budidaya anggrek berbasis IoT dan AI Dashboard. Project inovasi kompetisi FIKSI untuk optimasi parameter kelembaban dan suhu secara realtime.",
    tags: ["Next.js", "Supabase", "IoT System", "Tailwind"],
    link: "https://github.com/jackqqq",
    colorClass: "bg-retro-orange",
    year: "2026",
    images: [
      "/projects/orchicare1.png",
      "/projects/orchicare2.png",
      "/projects/orchicare3.png"
    ]
  },
  {
    title: "Sarpras Moklet Apps",
    category: "FULL-STACK CRUD",
    description: "Aplikasi manajemen peminjaman fasilitas dan sarana prasarana sekolah. Sistem ini dirancang kokoh dengan arsitektur REST API untuk menyederhanakan birokrasi internal.",
    tags: ["React", "Express.js", "MySQL", "Ubuntu Server"],
    link: "https://github.com/jackqqq",
    colorClass: "bg-retro-blue",
    year: "2026",
    images: [
      "/projects/sarpras1.png",
      "/projects/sarpras2.png"
    ]
  },
  {
    title: "OneLens Media Stream",
    category: "MULTIMEDIA / FREELANCE",
    description: "Layanan infrastruktur live streaming profesional dan partner media event di wilayah Malang. Terintegrasi penuh dengan kendali multi-kamera dan dokumentasi drone udara.",
    tags: ["Live Production", "UI/UX Design", "Videography", "Drone Piloting"],
    link: "https://github.com/jackqqq",
    colorClass: "bg-retro-pink",
    year: "2026",
    images: [
      "/projects/onelens1.png",
      "/projects/onelens2.png"
    ]
  },
  {
    title: "EduPlay Game Portal",
    category: "WEB GAME / FRONTEND",
    description: "Platform portal game edukasi interaktif untuk anak sekolah dasar. Dibangun dengan framework HTML5 Canvas dan integrasi skor realtime.",
    tags: ["HTML5 Canvas", "JavaScript", "CSS Grid", "Local Storage"],
    link: "https://github.com/jackqqq",
    colorClass: "bg-retro-yellow",
    year: "2025",
    images: [
      "/projects/eduplay1.png",
      "/projects/eduplay2.png"
    ]
  },
  {
    title: "DMS Moklet Cloud",
    category: "CLOUD STORAGE / CRUD",
    description: "Layanan manajemen dokumen berbasis cloud untuk kebutuhan penyimpanan data guru dan administrasi sekolah yang aman dan terenkripsi.",
    tags: ["React", "AWS S3", "Node.js", "MongoDB"],
    link: "https://github.com/jackqqq",
    colorClass: "bg-retro-lime",
    year: "2025",
    images: [
      "/projects/dms1.png",
      "/projects/dms2.png"
    ]
  },
  {
    title: "Velocty Design Agency",
    category: "MULTIMEDIA / WEB",
    description: "Portofolio landing page agensi kreatif multimedia dengan animasi transisi halaman retro-cyberpunk untuk memukau klien korporat.",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "Figma"],
    link: "https://github.com/jackqqq",
    colorClass: "bg-retro-pink",
    year: "2026",
    images: [
      "/projects/velocty1.png",
      "/projects/velocty2.png"
    ]
  }
];

export default function ProjectSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [listProyek, setListProyek] = useState<any[]>([]);

  useEffect(() => {
    const loadProjects = () => {
      const saved = localStorage.getItem("jq_works_projects");
      if (saved) {
        try {
          setListProyek(JSON.parse(saved));
        } catch (e) {
          localStorage.setItem("jq_works_projects", JSON.stringify(INITIAL_PROJECTS));
          setListProyek(INITIAL_PROJECTS);
        }
      } else {
        localStorage.setItem("jq_works_projects", JSON.stringify(INITIAL_PROJECTS));
        setListProyek(INITIAL_PROJECTS);
      }
    };

    loadProjects();

    const handleStorageUpdate = () => {
      loadProjects();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("local-projects-update", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("local-projects-update", handleStorageUpdate);
    };
  }, []);

  // Available categories for filtering
  const categories = ["ALL", "DEVELOPMENT", "MULTIMEDIA"];

  // Filter projects based on search query and category tab selection
  const filteredProyek = useMemo(() => {
    return listProyek.filter((proyek) => {
      const matchesSearch =
        proyek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proyek.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proyek.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCategory = true;
      if (selectedCategory !== "ALL") {
        if (selectedCategory === "DEVELOPMENT") {
          matchesCategory = proyek.category.toUpperCase().includes("CRUD") || proyek.category.toUpperCase().includes("GAME");
        } else if (selectedCategory === "IOT") {
          matchesCategory = proyek.category.toUpperCase().includes("IOT");
        } else if (selectedCategory === "MULTIMEDIA") {
          matchesCategory = proyek.category.toUpperCase().includes("MULTIMEDIA");
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Reset pagination if filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProyek.length / itemsPerPage));
  const paginatedProyek = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProyek.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProyek, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      if (typeof playSynthSound === "function") playSynthSound("sine", 200, 0.05);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      if (typeof playSynthSound === "function") playSynthSound("sine", 240, 0.05);
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <section id="proyek" className="max-w-7xl mx-auto px-4 md:px-8 mt-24 scroll-mt-24">
      {/* Header Bagian Proyek */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="bg-retro-blue text-white p-3 border-3 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <Briefcase className="text-white w-6 h-6 block" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold block">
              KARYA TERPILIH
            </span>
            <h2 className="font-syne text-lg xs:text-xl sm:text-3xl md:text-4xl font-extrabold text-black uppercase mt-0.5 break-words">
              ETALASE_
              <br className="sm:hidden" />
              PROJECT.EXE
            </h2>
          </div>
        </div>

        {/* Search Bar - Neo Brutalist style */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-neutral-400 block" />
          </div>
          <input
            type="text"
            placeholder="Cari project atau stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-3 border-black rounded-xl font-mono text-xs text-black focus:outline-none focus:bg-white bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
      </div>

      {/* Category Tabs / Filters */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (typeof playSynthSound === "function") playSynthSound("sine", 280, 0.04);
              setSelectedCategory(cat);
            }}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-mono text-[9px] sm:text-xs font-bold border-2 border-black rounded-lg transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Project Showcase */}
      {paginatedProyek.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProyek.map((proyek, index) => (
            <ProjectCard
              key={index}
              title={proyek.title}
              category={proyek.category}
              description={proyek.description}
              tags={proyek.tags}
              link={proyek.link}
              colorClass={proyek.colorClass}
              year={proyek.year}
              images={proyek.images}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <span className="font-pixel text-[10px] text-neutral-500 uppercase mb-2">ERR_NO_MATCHES</span>
          <span className="font-mono text-xs text-neutral-400">Tidak ada project yang sesuai dengan filter atau pencarian.</span>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12 font-mono">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center cursor-pointer ${
              currentPage === 1
                ? "bg-neutral-200 text-neutral-400 shadow-none translate-x-[3px] translate-y-[3px] cursor-not-allowed border-neutral-400"
                : "bg-white text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            }`}
          >
            <ChevronLeft className="w-5 h-5 block" />
          </button>

          <span className="text-xs font-bold bg-white border-3 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            HALAMAN {currentPage} DARI {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center cursor-pointer ${
              currentPage === totalPages
                ? "bg-neutral-200 text-neutral-400 shadow-none translate-x-[3px] translate-y-[3px] cursor-not-allowed border-neutral-400"
                : "bg-white text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            }`}
          >
            <ChevronRight className="w-5 h-5 block" />
          </button>
        </div>
      )}
    </section>
  );
}