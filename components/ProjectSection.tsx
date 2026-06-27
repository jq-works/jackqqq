import React from "react";
import { FolderKanban } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Briefcase } from "pixelarticons/react";

export default function ProjectSection() {
  const listProyek = [
    {
      title: "OrchiCare Inovasi IoT",
      category: "IoT & AI APP",
      description: "Sistem otomasi manajemen budidaya anggrek berbasis IoT dan AI Dashboard. Project inovasi kompetisi FIKSI untuk optimasi parameter kelembaban dan suhu secara realtime.",
      tags: ["Next.js", "Supabase", "IoT System", "Tailwind"],
      link: "https://github.com/jackqqq",
      colorClass: "bg-retro-orange",
      year: "2026"
    },
    {
      title: "Sarpras Moklet Apps",
      category: "FULL-STACK CRUD",
      description: "Aplikasi manajemen peminjaman fasilitas dan sarana prasarana sekolah. Sistem ini dirancang kokoh dengan arsitektur REST API untuk menyederhanakan birokrasi internal.",
      tags: ["React", "Express.js", "MySQL", "Ubuntu Server"],
      link: "https://github.com/jackqqq",
      colorClass: "bg-retro-blue",
      year: "2026"
    },
    {
      title: "OneLens Media Stream",
      category: "MULTIMEDIA / FREELANCE",
      description: "Layanan infrastruktur live streaming profesional dan partner media event di wilayah Malang. Terintegrasi penuh dengan kendali multi-kamera dan dokumentasi drone udara.",
      tags: ["Live Production", "UI/UX Design", "Videography", "Drone Piloting"],
      link: "https://github.com/jackqqq",
      colorClass: "bg-retro-pink",
      year: "2026"
    }
  ];

  return (
    <section id="proyek" className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
      {/* Header Bagian Proyek */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-retro-blue text-white p-3 border-3 border-black rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
  {/* Pixelarticons: Briefcase / Showcase */}
  <Briefcase className="text-white w-6 h-6 block" />
</div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold block">
            KARYA TERPILIH
          </span>
          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-black uppercase mt-0.5">
            ETALASE_PROJECT.EXE
          </h2>
        </div>
      </div>

      {/* Bento-style Grid Responsif */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listProyek.map((proyek, index) => (
          <ProjectCard
            key={index}
            title={proyek.title}
            category={proyek.category}
            description={proyek.description}
            tags={proyek.tags}
            link={proyek.link}
            colorClass={proyek.colorClass}
            year={proyek.year}
          />
        ))}
      </div>
    </section>
  );
}