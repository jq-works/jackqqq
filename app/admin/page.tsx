"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, Trophy, Home } from "pixelarticons/react";
import { motion } from "framer-motion";
import { playSynthSound } from "@/lib/audio";

export const retroSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 12,
  mass: 0.9,
};

type StatsData = {
  totalProjects: number;
  featuredProjects: number;
  totalAchievements: number;
  prestasi: number;
  sertifikasi: number;
  categories: { name: string; count: number }[];
  recentProjects: any[];
  recentAchievements: any[];
};

export default function AdminHome() {
  const [stats, setStats] = useState<StatsData>({
    totalProjects: 0,
    featuredProjects: 0,
    totalAchievements: 0,
    prestasi: 0,
    sertifikasi: 0,
    categories: [],
    recentProjects: [],
    recentAchievements: [],
  });
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    setLoading(true);

    const [projRes, achRes, catRes, recentProjRes, recentAchRes] = await Promise.all([
      supabase.from("projects").select("id, is_featured, category"),
      supabase.from("achievements").select("id, type"),
      supabase.from("categories").select("name"),
      supabase.from("projects").select("id, title, category, color_class, is_featured, images").order("created_at", { ascending: false }).limit(5),
      supabase.from("achievements").select("id, title, type, institution, color_class, year").order("created_at", { ascending: false }).limit(5),
    ]);

    const projects = projRes.data || [];
    const achievements = achRes.data || [];
    const categories = catRes.data || [];

    // Build category breakdown
    const catCounts: Record<string, number> = {};
    categories.forEach((c: any) => { catCounts[c.name] = 0; });
    projects.forEach((p: any) => {
      if (catCounts[p.category] !== undefined) catCounts[p.category]++;
      else catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(catCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setStats({
      totalProjects: projects.length,
      featuredProjects: projects.filter((p: any) => p.is_featured).length,
      totalAchievements: achievements.length,
      prestasi: achievements.filter((a: any) => a.type === "PRESTASI").length,
      sertifikasi: achievements.filter((a: any) => a.type === "SERTIFIKASI").length,
      categories: categoryBreakdown,
      recentProjects: recentProjRes.data || [],
      recentAchievements: recentAchRes.data || [],
    });
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const navLinks = [
    { href: "/admin", label: "🏠 Dashboard", active: true },
    { href: "/admin/projects", label: "💼 Kelola Proyek", active: false },
    { href: "/admin/achievements", label: "🏆 Kelola Achievements", active: false },
    { href: "/admin/guestbook", label: "📝 Kelola Guestbook", active: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-retro-bg)] text-black p-6 md:p-12 font-mono text-xs select-none">
      
      {/* ── HEADER WINDOW OS STYLE ── */}
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
          <span className="font-bold text-white text-[10px] tracking-widest uppercase">C:\ADMIN_DASHBOARD.EXE</span>
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
              <Home className="w-8 h-8 block text-[var(--color-retro-yellow)]" />
            </div>
            <div>
              <h1 className="font-syne text-2xl md:text-3xl font-black uppercase tracking-tight">System Overview</h1>
              <p className="text-neutral-500 font-bold mt-1">// WEBSITE_ANALYTICS</p>
            </div>
          </div>
          
          <nav className="flex gap-3 flex-wrap">
            {navLinks.map((l) => (
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

      <main className="max-w-7xl mx-auto space-y-10">

        {loading ? (
          <div className="py-24 text-center animate-pulse text-neutral-400 font-bold text-sm uppercase tracking-widest">// LOADING_SYSTEM_STATS...</div>
        ) : (
          <>
            {/* ── STAT CARDS ── */}
            <motion.section 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { label: "TOTAL PROYEK", value: stats.totalProjects, sub: `${stats.featuredProjects} featured`, bg: "bg-[var(--color-retro-blue)]", text: "text-white", rotate: "rotate-1" },
                { label: "KATEGORI AKTIF", value: stats.categories.length, sub: "kategori unik", bg: "bg-[var(--color-retro-orange)]", text: "text-white", rotate: "-rotate-1" },
                { label: "ACHIEVEMENTS", value: stats.totalAchievements, sub: `${stats.prestasi} prestasi`, bg: "bg-[var(--color-retro-lime)]", text: "text-black", rotate: "rotate-2" },
                { label: "SERTIFIKASI", value: stats.sertifikasi, sub: "sertifikat kelulusan", bg: "bg-[var(--color-retro-pink)]", text: "text-white", rotate: "-rotate-2" },
              ].map((card, i) => (
                <motion.div 
                  key={card.label} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: retroSpring }
                  }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-transform`}
                >
                  <div className={`${card.bg} ${card.text} px-4 py-3 font-black text-[10px] uppercase tracking-widest border-b-[3px] border-black flex justify-between items-center`}>
                    {card.label}
                    <div className="w-2 h-2 rounded-full border border-black bg-white opacity-50" />
                  </div>
                  <div className="px-5 py-6 relative">
                    <span className="font-syne text-5xl font-black">{card.value}</span>
                    <p className="text-black font-bold text-[10px] mt-2 uppercase bg-neutral-200 inline-block px-2 py-1 rounded border border-black">{card.sub}</p>
                    {/* Decorative Sticker */}
                    <div className={`absolute top-4 right-4 text-3xl opacity-20 ${card.rotate}`}>*</div>
                  </div>
                </motion.div>
              ))}
            </motion.section>

            {/* ── QUICK LINKS ── */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={retroSpring}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <a href="/admin/projects" className="group bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex items-center gap-6 active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                <div className="bg-[var(--color-retro-yellow)] p-4 border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-3 transition-transform">
                  <Briefcase className="w-8 h-8 text-black block" />
                </div>
                <div className="flex-1">
                  <span className="font-black text-lg uppercase block tracking-tight font-syne">Kelola Proyek</span>
                  <span className="text-neutral-600 font-bold mt-1 block uppercase text-[10px]">{stats.totalProjects} data · Tambah & Edit</span>
                </div>
                <div className="bg-black text-white p-2 rounded-full border-2 border-black group-hover:scale-110 transition-transform">
                  <span className="font-black">→</span>
                </div>
              </a>
              
              <a href="/admin/achievements" className="group bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex items-center gap-6 active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                <div className="bg-[var(--color-retro-lime)] p-4 border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-3 transition-transform">
                  <Trophy className="w-8 h-8 text-black block" />
                </div>
                <div className="flex-1">
                  <span className="font-black text-lg uppercase block tracking-tight font-syne">Kelola Achievements</span>
                  <span className="text-neutral-600 font-bold mt-1 block uppercase text-[10px]">{stats.totalAchievements} data · Tambah & Edit</span>
                </div>
                <div className="bg-black text-white p-2 rounded-full border-2 border-black group-hover:scale-110 transition-transform">
                  <span className="font-black">→</span>
                </div>
              </a>
            </motion.section>

            {/* ── BOTTOM GRID ── */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={retroSpring}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Category breakdown */}
              <div className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                <div className="bg-black text-white px-5 py-3 font-bold uppercase text-[10px] tracking-widest border-b-[3px] border-black">
                  CATEGORY_BREAKDOWN.LOG
                </div>
                <div className="p-6 space-y-4 flex-1">
                  {stats.categories.length > 0 ? stats.categories.map((cat, i) => {
                    const pct = stats.totalProjects > 0 ? Math.round((cat.count / stats.totalProjects) * 100) : 0;
                    return (
                      <div key={cat.name} className="relative">
                        <div className="flex justify-between mb-2">
                          <span className="font-black uppercase text-[11px]">{cat.name}</span>
                          <span className="font-bold text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded border border-black">{cat.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-neutral-100 border-[2px] border-black rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                            className="h-full bg-[var(--color-retro-orange)] border-r-2 border-black"
                          />
                        </div>
                      </div>
                    );
                  }) : <p className="text-neutral-400 font-bold uppercase text-[10px]">// No categories yet</p>}
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                <div className="bg-black text-white px-5 py-3 font-bold uppercase text-[10px] tracking-widest border-b-[3px] border-black flex justify-between items-center">
                  <span>RECENT_PROJECTS</span>
                  <a href="/admin/projects" className="text-[10px] text-[var(--color-retro-yellow)] hover:underline">LIHAT SEMUA →</a>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  {stats.recentProjects.map((p) => (
                    <div key={p.id} className="group flex items-center gap-3 p-3 bg-[var(--color-retro-bg)] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-colors">
                      <div className={`w-3 h-3 rounded-full border-2 border-black ${p.color_class ? p.color_class.replace("bg-[var(--color-", "bg-").replace(")]", "") : "bg-retro-blue"}`} />
                      <span className="font-black uppercase text-[10px] truncate flex-1">{p.title}</span>
                      {p.is_featured && <span className="text-lg" title="Featured">⭐</span>}
                      <span className="text-[9px] bg-white border-2 border-black px-1.5 py-0.5 rounded font-bold uppercase shrink-0">{p.category}</span>
                    </div>
                  ))}
                  {stats.recentProjects.length === 0 && (
                    <p className="text-neutral-400 font-bold uppercase p-2 text-[10px]">// No projects yet</p>
                  )}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                <div className="bg-black text-white px-5 py-3 font-bold uppercase text-[10px] tracking-widest border-b-[3px] border-black flex justify-between items-center">
                  <span>RECENT_ACHIEVEMENTS</span>
                  <a href="/admin/achievements" className="text-[10px] text-[var(--color-retro-yellow)] hover:underline">LIHAT SEMUA →</a>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  {stats.recentAchievements.map((a) => (
                    <div key={a.id} className="group flex items-center gap-3 p-3 bg-[var(--color-retro-bg)] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-colors">
                      <div className={`w-3 h-3 rounded-full border-2 border-black ${a.color_class ? a.color_class.replace("bg-[var(--color-", "bg-").replace(")]", "") : "bg-retro-pink"}`} />
                      <span className="font-black uppercase text-[10px] truncate flex-1">{a.title}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 border-2 border-black rounded text-black shrink-0 ${a.type === "PRESTASI" ? "bg-[var(--color-retro-lime)]" : "bg-[var(--color-retro-pink)]"}`}>
                        {a.type === "PRESTASI" ? "🏆 PRES" : "📜 SERT"}
                      </span>
                    </div>
                  ))}
                  {stats.recentAchievements.length === 0 && (
                    <p className="text-neutral-400 font-bold uppercase p-2 text-[10px]">// No achievements yet</p>
                  )}
                </div>
              </div>

            </motion.section>
          </>
        )}
      </main>
    </div>
  );
}