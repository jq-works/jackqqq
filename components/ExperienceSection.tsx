"use client";

import React from "react";

interface TimelineItem {
  id: number;
  period: string;
  title: string;
  subTitle: string;
  description: string;
  badgeColor: string;
}

export default function ExperienceSection() {
  const historyData: TimelineItem[] = [
    {
      id: 1,
      period: "2024 - Sekarang",
      title: "Studio JQ Works — Lead Web Engineer",
      subTitle: "Mengembangkan antarmuka digital interaktif dan sistem CRUD",
      description: "Bertanggung jawab penuh atas kualitas kode frontend menggunakan Next.js dan Tailwind CSS, optimasi performa core-web-vitals, serta merancang sistem inventaris sekolah Sarpras Moklet.",
      badgeColor: "bg-retro-orange text-white"
    },
    {
      id: 2,
      period: "2024 - 2026",
      title: "OSIS SMK Telkom Malang — Koordinator Sie 9",
      subTitle: "Manajemen repositori Git organisasi & kepemimpinan tim",
      description: "Mengkoordinasikan proyek inovasi teknologi internal, mengelola repositori kolaboratif sekolah (osis-moklet-old), dan memimpin divisi multimedia untuk publikasi digital acara besar.",
      badgeColor: "bg-retro-yellow text-black"
    },
    {
      id: 3,
      period: "Kompetisi & Prestasi",
      title: "Finalis Kompetisi IoT & Creative Media (Nasional & ASEAN)",
      subTitle: "Ajang Penyaluran Bakat Rekayasa Teknologi",
      description: "Menjadi finalis di FIKSI 2026 dengan proyek OrchiCare (IoT & AI), Finalis Drone Piloting Steam Nexus di Malaysia tingkat ASEAN, serta Finalis Business Plan Competition (BPC) di ITS.",
      badgeColor: "bg-retro-pink text-white"
    }
  ];

  return (
    <section id="pengalaman" className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
      
      {/* OS Windows Frame Style for Timeline Box */}
      <div className="bg-white border-3 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header Bar Jendela */}
        <div className="px-4 py-3 bg-retro-yellow border-b-3 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="pixel-calendar text-black text-sm block"></i>
            <span className="font-mono font-bold text-sm text-black">jackqqq_employment_history.log</span>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-neutral-300 border-2 border-black rounded-full"></div>
            <div className="w-3 h-3 bg-neutral-300 border-2 border-black rounded-full"></div>
          </div>
        </div>
        
        {/* Area Isi Papan Linimasa */}
        <div className="p-6 md:p-8 bg-retro-bg/30">
          <div className="relative border-l-3 border-black pl-6 ml-4 space-y-12">
            
            {historyData.map((item) => (
              <div key={item.id} className="relative group">
                
                {/* Node Marker Asimetris Kotak Piksel */}
                <div className={`absolute -left-[37px] top-1.5 w-6 h-6 border-2 border-black rounded flex items-center justify-center font-pixel text-[8px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform ${item.badgeColor}`}>
                  {item.id}
                </div>
                
                {/* Konten Detail */}
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-black text-white border border-black rounded font-mono text-xs font-bold mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    {item.period}
                  </span>
                  <h4 className="font-syne text-xl font-bold text-black group-hover:text-retro-orange transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-mono text-xs text-neutral-500 mb-2 font-bold">
                    {item.subTitle}
                  </p>
                  <p className="font-sans text-sm font-medium text-neutral-700 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}