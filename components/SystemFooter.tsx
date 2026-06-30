"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Heart } from "pixelarticons/react";
import { playSynthSound } from "@/lib/audio";
import { supabase } from "@/lib/supabase";

export default function SystemFooter() {
  const [systemLoad, setSystemLoad] = useState(12);
  
  // 1. STATE MANAGEMENT UNTUK PERSISTENT LIKE SYSTEM
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128); // Base count awal jika db belum termuat

  // Efek fluktuasi RAM/CPU tiruan untuk menghidupkan suasana OS
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(Math.floor(Math.random() * 15) + 8);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch total likes & status user
  useEffect(() => {
    let isMounted = true;

    async function fetchLikesData() {
      // 1. Ambil total likes
      const { count, error } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Gagal memuat data likes dari Supabase:", error.message);
      } else if (count !== null && isMounted) {
        setLikeCount(count);
      }

      // 2. Cek apakah user ini sudah pernah me-like website
      const savedLikeId = localStorage.getItem("portfolio_like_id");
      if (savedLikeId) {
        const { data, error: fetchErr } = await supabase
          .from("likes")
          .select("id")
          .eq("id", savedLikeId)
          .maybeSingle();

        if (isMounted) {
          if (data) {
            setHasLiked(true);
          } else {
            // Jika ID di local storage tidak ada di db (misal db di-reset)
            localStorage.removeItem("portfolio_like_id");
            setHasLiked(false);
          }
        }
      }
    }

    fetchLikesData();

    // Supabase Realtime Subscription untuk update like count instan
    const channel = supabase
      .channel("realtime_likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        async () => {
          const { count, error } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true });
          if (!error && count !== null && isMounted) {
            setLikeCount(count);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSystemClick = (type: string) => {
    if (type === "reboot") {
      playSynthSound("square", 180, 0.3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      playSynthSound("sine", 660, 0.08);
    }
  };

  // 2. HANDLER KLIK TOMBOL LIKE PORTFOLIO
  const handleLikeClick = async () => {
    if (!hasLiked) {
      // Masukkan like baru ke database
      const { data, error } = await supabase
        .from("likes")
        .insert([{}])
        .select();

      if (error) {
        console.error("Gagal mengirim like ke Supabase:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const newLikeId = data[0].id;
        localStorage.setItem("portfolio_like_id", newLikeId);
        setHasLiked(true);
        setLikeCount((prev) => prev + 1);

        // Efek akord naik retro gembira
        playSynthSound("sine", 523.25, 0.06); 
        setTimeout(() => playSynthSound("sine", 659.25, 0.06), 60); 
        setTimeout(() => playSynthSound("sine", 783.99, 0.12), 120); 
      }
    } else {
      const savedLikeId = localStorage.getItem("portfolio_like_id");
      if (savedLikeId) {
        // Hapus like dari database
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("id", savedLikeId);

        if (error) {
          console.error("Gagal menghapus like dari Supabase:", error.message);
          return;
        }

        localStorage.removeItem("portfolio_like_id");
        setHasLiked(false);
        setLikeCount((prev) => prev - 1);
        playSynthSound("sine", 392.00, 0.12); // Nada turun pembatalan
      }
    }
  };

  return (
    <footer className="w-full bg-neutral-200 border-t-[3px] border-black select-none shrink-0 mt-auto z-40">
      
      {/* ATAS: MARQUEE STATUS SINKRONISASI (TICKER TAPE RETRO) */}
      <div className="bg-black text-retro-lime py-1.5 border-b-2 border-black font-mono text-[10px] overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>[SYSTEM_STATUS: STABLE]</span>
          <span>// CORE_LOAD: {systemLoad}%</span>
          <span>// FULL-STACK SYSTEM ENGAGED</span>
          <span>// MULTIMEDIA MODULE: ACTIVE</span>
          <span>// PORTFOLIO VERSION 16.2.9 READY</span>
          <span>// MALANG, INDONESIA 2026</span>
        </div>
        <div className="animate-marquee whitespace-nowrap flex gap-8" aria-hidden={true}>
          <span>[SYSTEM_STATUS: STABLE]</span>
          <span>// CORE_LOAD: {systemLoad}%</span>
          <span>// FULL-STACK SYSTEM ENGAGED</span>
          <span>// MULTIMEDIA MODULE: ACTIVE</span>
          <span>// PORTFOLIO VERSION 16.2.9 READY</span>
          <span>// MALANG, INDONESIA 2026</span>
        </div>
      </div>

      {/* BAWAH: OLD-SCHOOL WINDOWS TASKBAR SIMULATION */}
      <div className="px-4 py-2.5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        
        {/* SISI KIRI: TOMBOL START / REBOOT UTAMA */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={() => handleSystemClick("reboot")}
            className="px-3 py-1 bg-retro-orange text-white border-[2.5px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center gap-1.5 font-bold transition-all"
          >
            {/* Ikon Reboot Menggunakan SVG Pixel Art Murni */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="block text-white">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73"/>
            </svg>
            <span>SYS_REBOOT</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-neutral-500 text-[11px] border-l-2 border-neutral-400 pl-3">
            <Terminal className="w-3.5 h-3.5 text-neutral-600 block"/>
            <span>Ready for commands...</span>
          </div>
        </div>

        {/* SISI TENGAH: COPYRIGHT DATA HAK CIPTA */}
        <div className="text-center font-bold text-black text-[11px] sm:text-xs">
          © 2026{" "}
          <span className="bg-retro-yellow px-1.5 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            JQ Works
          </span>{" "}
          // ALL RIGHTS RESERVED.
        </div>

        {/* SISI KANAN: STATUS TRAY BAR (WIDGET KECIL) */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          
          {/* PERBAIKAN 1: MENGUBAH RAM MENJADI TOMBOL LIKE WEBPAGE INTERAKTIF */}
          <button 
            onClick={handleLikeClick}
            className={`flex items-center gap-2 px-3 py-1 border-2 border-black rounded cursor-pointer transition-all active:translate-y-[1px] font-bold text-[11px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              hasLiked ? "bg-retro-pink text-white" : "bg-white text-black hover:bg-neutral-50"
            }`}
            title={hasLiked ? "Kamu menyukai website ini!" : "Sukai website ini"}
          >
            <Heart className={`w-4 h-4 block ${hasLiked ? "text-white fill-current animate-bounce" : "text-retro-pink"}`}/>
            <span>LIKE: <span className="underline">{likeCount}</span></span>
          </button>

          {/* LIKE button remains as the sole widget in this block */}

        </div>

      </div>

    </footer>
  );
}