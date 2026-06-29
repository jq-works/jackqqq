"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, File, Shield, Bookmark, Close, Search, MapPin } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import { supabase } from "@/lib/supabase";

const INITIAL_ACHIEVEMENTS = [
  {
    title: "Drone Piloting - Steam Nexus Malaysia",
    rank: "REGIONAL FINALIST (ASEAN)",
    year: "2025",
    id: "REC-A77",
    color: "bg-retro-yellow",
    tag: "MULTIMEDIA",
    type: "PRESTASI", // Ditandai sebagai Prestasi (Lomba/Kompetisi)
    image: "/cert1.jpg"
  },
  {
    title: "Ratu Film Festival - Radar Tulungagung",
    rank: "FESTIVAL FINALIST",
    year: "2025",
    id: "REC-M90",
    color: "bg-retro-pink",
    tag: "VIDEOGRAPHY",
    type: "PRESTASI", // Ditandai sebagai Prestasi
    image: "/cert2.jpg"
  },
  {
    title: "Business Plan Competition - ITS",
    rank: "NATIONAL FINALIST",
    year: "2026",
    id: "REC-B12",
    color: "bg-retro-lime",
    tag: "STARTUP_BPC",
    type: "PRESTASI", // Ditandai sebagai Prestasi
    image: "/cert3.jpg"
  },
  {
    title: "Google IT Support Professional Certificate",
    rank: "COMPLETED",
    year: "2024",
    id: "CERT-G11",
    color: "bg-retro-blue",
    tag: "IT_SUPPORT",
    type: "SERTIFIKASI", // Ditandai sebagai Sertifikasi
    image: "/cert4.jpg"
  },
  {
    title: "Responsive Web Design - freeCodeCamp",
    rank: "CERTIFIED",
    year: "2024",
    id: "CERT-F88",
    color: "bg-retro-orange",
    tag: "WEB_DEV",
    type: "SERTIFIKASI", // Ditandai sebagai Sertifikasi
    image: "/cert5.jpg"
  }
];

export default function Achievements() {
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // State for all certificates viewer modal
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Tab/filter state: "ALL", "PRESTASI", "SERTIFIKASI"
  const [filterType, setFilterType] = useState<"ALL" | "PRESTASI" | "SERTIFIKASI">("ALL");

  const [listPencapaian, setListPencapaian] = useState<any[]>([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          ...item,
          id: item.id_display || `JQ-${item.id}`,
          color: item.color_class || "bg-retro-yellow",
          image: item.image_url || (item.images && item.images[0]) || "/placeholder.jpg"
        }));
        setListPencapaian(mapped);
      } else {
        setListPencapaian(INITIAL_ACHIEVEMENTS);
      }
    };

    loadAchievements();

    const handleStorageUpdate = () => {
      loadAchievements();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("local-achievements-update", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("local-achievements-update", handleStorageUpdate);
    };
  }, []);

  // We duplicate the list so the infinite marquee has enough items to loop seamlessly.
  const marqueeItems = listPencapaian.length > 0 ? [...listPencapaian, ...listPencapaian, ...listPencapaian, ...listPencapaian] : [];

  // Filter list based on search and selected filterType
  const filteredPencapaian = listPencapaian.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <section id="prestasi" className="mt-20 md:mt-28 mb-12 select-none overflow-hidden w-full scroll-mt-24">
      
      {/* HEADER SECTION - Constrained width */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-12">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="bg-black text-retro-lime p-2.5 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(163,230,53,1)] shrink-0">
            <Trophy className="w-7 h-7 text-retro-lime block" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[9px] font-black tracking-widest text-neutral-500 block">// DECLASSIFIED_RECORDS</span>
            <h2 className="font-syne text-base xs:text-lg sm:text-3xl font-black text-black uppercase leading-none mt-0.5 break-words">
              CORE_
              <br className="sm:hidden" />
              ACHIEVEMENTS.LOG
            </h2>
          </div>
        </div>
        <div className="font-mono text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1.5 rounded-md w-fit uppercase">
          SECURE_ACCESS_GRANTED // OK
        </div>
      </div>

      {/* INFINITE MARQUEE DRAWER CONTAINER */}
      <div 
        className="relative w-full py-4 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          className="flex gap-8 w-max px-4"
          animate={{ x: isPaused ? undefined : [0, -1200] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {marqueeItems.map((item, idx) => {
            const rotations = [-1, 1, -1.5, 0.5];
            const currentRotation = rotations[idx % rotations.length];

            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => {
                  if (typeof playSynthSound === "function") playSynthSound("sine", 350 + (idx % 3) * 60, 0.05);
                  setSelectedCert(item);
                }}
                style={{ transform: `rotate(${currentRotation}deg)` }}
                className="w-80 shrink-0 relative group cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:rotate-0"
              >
                <div className="absolute inset-0 bg-black border-[3px] border-black rounded-2xl translate-x-[6px] translate-y-[6px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-white border-[3px] border-black rounded-2xl translate-x-[3px] translate-y-[3px] pointer-events-none opacity-60"></div>

                <div className="relative bg-white border-[3px] border-black rounded-2xl p-6 flex flex-col justify-between h-64 overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-3 bg-neutral-900 border-b-2 border-black flex">
                    <div className={`w-1/3 h-full ${item.color} border-r border-black`}></div>
                    <div className="w-1/3 h-full bg-neutral-800 border-r border-black"></div>
                  </div>

                  <div className="pt-2 flex items-start justify-between w-full font-mono text-[9px] font-black text-neutral-400 uppercase">
                    <span className="flex items-center gap-1">
                      <File className="w-3 h-3 text-neutral-500 block" /> 
                      ID: {item.id}
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded border border-neutral-700 font-extrabold tracking-wider">
                      {item.year}
                    </span>
                  </div>

                  <div className="my-auto space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Bookmark className="w-3.5 h-3.5 text-neutral-700 block shrink-0" />
                      <span className="font-mono text-[8px] font-black text-retro-orange tracking-wide bg-retro-orange/10 px-1.5 py-0.5 rounded border border-retro-orange/20 uppercase mr-1">
                        {item.tag}
                      </span>
                      <span className="font-mono text-[8px] font-black text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-300 uppercase">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-syne text-base font-extrabold text-black leading-tight uppercase tracking-tight group-hover:text-retro-blue transition-colors duration-200">
                      {item.title}
                    </h3>
                    {item.institution && (
                      <p className="font-mono text-[9px] font-bold text-neutral-400 uppercase mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400 block shrink-0" /> {item.institution}
                      </p>
                    )}
                  </div>

                  <div className="border-t-2 border-dashed border-neutral-200 pt-3 flex items-center justify-between w-full font-mono">
                    <div>
                      <span className="text-[7px] font-black block text-neutral-400 tracking-widest uppercase leading-none">STATUS_RESULT</span>
                      <span className="text-[11px] font-black text-black tracking-tighter uppercase mt-1 block">
                        {item.rank}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center shrink-0 group-hover:bg-retro-lime group-hover:border-black transition-colors duration-300">
                      <Shield className="w-4 h-4 text-neutral-400 group-hover:text-black block" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* VIEW ALL BUTTON */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 flex justify-center">
        <button
          onClick={() => {
            if (typeof playSynthSound === "function") playSynthSound("triangle", 220, 0.08);
            setShowAllModal(true);
          }}
          style={{ backgroundColor: "#FACC15", color: "#000000" }}
          className="px-6 py-3 font-mono font-bold text-xs uppercase border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4 text-black block" />
          Tampilkan Semua Dokumen & Filter
        </button>
      </div>

      {/* MODAL: VIEW ALL DOSSERS WITH SEARCH & FILTER */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAllModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-[4px] border-black rounded-2xl max-w-7xl w-full h-[92vh] overflow-hidden flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-black border-b-[3px] border-black flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-retro-yellow block" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">ALL_ARCHIVE_EXPLORER.EXE</span>
                </div>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="bg-white border border-black p-1 rounded hover:bg-retro-pink transition-colors text-black"
                >
                  <Close className="w-4 h-4 block" />
                </button>
              </div>

              {/* Search and Filters Bar */}
              <div className="p-6 border-b-2 border-dashed border-neutral-300 bg-neutral-50 flex flex-col md:flex-row gap-4 shrink-0">
                {/* Search input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-neutral-400 block" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama, status, tag, atau ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border-2 border-black rounded-lg font-mono text-xs text-black focus:outline-none focus:bg-white bg-white"
                  />
                </div>

                {/* Filter tags (PRESTASI / SERTIFIKASI) */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase mr-1">JENIS:</span>
                  {(["ALL", "PRESTASI", "SERTIFIKASI"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        if (typeof playSynthSound === "function") playSynthSound("sine", 280, 0.04);
                        setFilterType(type);
                      }}
                      className={`px-3 py-1.5 font-mono text-[9px] font-bold border-2 border-black rounded transition-all cursor-pointer ${
                        filterType === type
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-neutral-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid content (Scrollable) */}
              <div className="p-6 overflow-y-auto flex-1 bg-[#F4F0EC]">
                {filteredPencapaian.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredPencapaian.map((item, idx) => (
                      <div
                        key={`${item.id}-modal-${idx}`}
                        onClick={() => {
                          if (typeof playSynthSound === "function") playSynthSound("sine", 350 + (idx % 3) * 60, 0.05);
                          setSelectedCert(item);
                        }}
                        className="relative group cursor-pointer transition-transform duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      >
                        <div className="absolute inset-0 bg-black border-2 border-black rounded-xl translate-x-[4px] translate-y-[4px] pointer-events-none"></div>
                        
                        <div className="relative bg-white border-2 border-black rounded-xl p-4 flex flex-col justify-between h-[340px] overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-2 bg-neutral-900 border-b border-black flex">
                            <div className={`w-1/3 h-full ${item.color} border-r border-black`}></div>
                            <div className="w-1/3 h-full bg-neutral-800 border-r border-black"></div>
                          </div>

                          {/* Image Thumbnail */}
                          <div className="w-full h-32 mt-2 relative bg-neutral-900 border border-black rounded overflow-hidden flex items-center justify-center shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">// NO_IMAGE</span>
                            )}
                          </div>

                          <div className="pt-2.5 flex items-start justify-between w-full font-mono text-[10px] font-bold text-neutral-400 uppercase">
                            <span>ID: {item.id}</span>
                            <span className="bg-black text-white px-2 py-0.5 rounded font-extrabold text-[9px]">
                              {item.year}
                            </span>
                          </div>

                          <div className="my-1.5 space-y-1.5 flex-1 flex flex-col justify-center">
                            <div className="flex gap-1.5 items-center flex-wrap">
                              <span className="font-mono text-[9px] font-black text-retro-orange tracking-wide bg-retro-orange/10 px-1.5 py-0.5 rounded border border-retro-orange/20 uppercase">
                                {item.tag}
                              </span>
                              <span className="font-mono text-[9px] font-black text-neutral-500 border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 rounded uppercase">
                                {item.type}
                              </span>
                            </div>
                            <h3 className="font-syne text-[13px] font-black text-black leading-tight uppercase group-hover:text-retro-blue line-clamp-2">
                              {item.title}
                            </h3>
                            {item.institution && (
                               <p className="font-mono text-[9px] font-semibold text-neutral-400 uppercase mt-0.5 flex items-center gap-1 truncate">
                                 <MapPin className="w-3 h-3 text-neutral-400 block shrink-0" /> {item.institution}
                               </p>
                             )}
                          </div>

                          <div className="border-t border-dashed border-neutral-200 pt-2 flex items-center justify-between w-full font-mono">
                            <div>
                              <span className="text-[11px] font-black text-black tracking-tighter uppercase block">
                                {item.rank}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="font-pixel text-[10px] text-neutral-500 uppercase mb-2">ERROR 404: RECORDS_NOT_FOUND</span>
                    <span className="font-mono text-xs text-neutral-400">Tidak ada dokumen yang cocok dengan filter atau pencarian Anda.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white p-4 border-[4px] border-black rounded-2xl max-w-3xl w-full relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute -top-3 -right-3 bg-white border-2 border-black p-1 rounded-full hover:bg-retro-pink transition-colors z-10"
                onClick={() => setSelectedCert(null)}
              >
                <Close className="w-6 h-6" />
              </button>
              
              <div className="overflow-y-auto flex-1 space-y-4 pr-1">
                <div className="w-full max-h-[65vh] relative bg-neutral-950 border-2 border-black rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={selectedCert.image} 
                    alt={selectedCert.title} 
                    className="max-w-full max-h-[65vh] object-contain"
                  />
                </div>
                <div className="p-1 bg-white">
                  <h3 className="font-syne font-black text-base md:text-lg uppercase text-black leading-tight">
                    {selectedCert.title}
                  </h3>
                  <p className="font-mono text-[10px] font-bold text-neutral-500 uppercase mt-1">
                    {selectedCert.rank} // {selectedCert.year}
                  </p>
                  {selectedCert.institution && (
                     <p className="font-mono text-[9px] font-black text-retro-orange uppercase mt-1.5 flex items-center gap-1">
                       <MapPin className="w-3 h-3 text-retro-orange block shrink-0" /> Penyelenggara: {selectedCert.institution}
                     </p>
                   )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}