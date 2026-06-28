"use client";

import React, { useState, useEffect } from "react";
import { playSynthSound } from "@/lib/audio";
import { Trophy, File, Close, Search } from "pixelarticons/react";

// Tanda Tanya / Help SVG
const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="w-4 h-4 block">
    <path d="M9 10a3 3 0 1 1 4.5 2.6M12 17h.01"/>
  </svg>
);

// Plus SVG
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="w-4 h-4 block">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Edit SVG
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="w-4 h-4 block">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

// Trash/Delete SVG
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="w-4 h-4 block">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
  </svg>
);

// Arrow Left SVG
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="w-4 h-4 block">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function AdminPage() {
  const [passkey, setPasskey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Analytics states
  const [stats, setStats] = useState({
    visitors: 0,
    likes: 0,
    comments: 0,
    projects: 0,
    achievements: 0,
    experiences: 0,
    skills: 0
  });

  // Tab state: "projects" | "achievements" | "experiences" | "skills" | "guestbook"
  const [activeTab, setActiveTab] = useState<"projects" | "achievements" | "experiences" | "skills" | "guestbook">("projects");
  
  // Skills Sub-Tab state
  const [skillsTab, setSkillsTab] = useState<"hard" | "soft">("hard");

  // Core list stores
  const [projects, setProjects] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [hardSkills, setHardSkills] = useState<any[]>([]);
  const [softSkills, setSoftSkills] = useState<any[]>([]);
  const [guestbook, setGuestbook] = useState<any[]>([]);

  // Dialog Editor Modal states
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const [isAchModalOpen, setIsAchModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);

  const [isHardSkillModalOpen, setIsHardSkillModalOpen] = useState(false);
  const [editingHardSkill, setEditingHardSkill] = useState<any | null>(null);

  const [isSoftSkillModalOpen, setIsSoftSkillModalOpen] = useState(false);
  const [editingSoftSkill, setEditingSoftSkill] = useState<any | null>(null);

  // Form states
  const [projForm, setProjForm] = useState({
    title: "", category: "", description: "", tags: "", link: "", colorClass: "bg-retro-blue", year: "", images: ""
  });

  const [achForm, setAchForm] = useState({
    title: "", rank: "", year: "", id: "", color: "bg-retro-yellow", tag: "", type: "PRESTASI", image: ""
  });

  const [expForm, setExpForm] = useState({
    id: "", period: "", badge: "", title: "", role: "", description: "", bgColor: "#ffffff", markerColor: "bg-retro-orange", icon: "briefcase", bullets: "", bulletsHeader: "",
    // Card 1
    card1_title: "", card1_desc: "", card1_period: "", card1_bg: "bg-retro-yellow", card1_icon: "pen",
    // Card 2
    card2_title: "", card2_desc: "", card2_period: "", card2_bg: "bg-retro-pink", card2_icon: "video"
  });

  const [hardSkillForm, setHardSkillForm] = useState({
    name: "", colorClass: "bg-retro-orange", category: "DEVELOPMENT", icon: "computer"
  });

  const [softSkillForm, setSoftSkillForm] = useState({
    title: "", description: "", bgColor: "bg-retro-yellow"
  });

  // Verify auth session
  useEffect(() => {
    const auth = sessionStorage.getItem("jq_admin_auth");
    if (auth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  // Load datasets
  const loadAdminData = () => {
    const visitors = parseInt(localStorage.getItem("jq_works_visitors") || "0", 10);
    const likes = parseInt(localStorage.getItem("jq_works_likes") || "128", 10);
    
    const guestbookSaved = localStorage.getItem("jq_works_guestbook");
    const guestbookList = guestbookSaved ? JSON.parse(guestbookSaved) : [];
    setGuestbook(guestbookList);

    const projSaved = localStorage.getItem("jq_works_projects");
    const projList = projSaved ? JSON.parse(projSaved) : [];
    setProjects(projList);

    const achSaved = localStorage.getItem("jq_works_achievements");
    const achList = achSaved ? JSON.parse(achSaved) : [];
    setAchievements(achList);

    const expSaved = localStorage.getItem("jq_works_experiences");
    const expList = expSaved ? JSON.parse(expSaved) : [];
    setExperiences(expList);

    const hardSaved = localStorage.getItem("jq_works_skills_hard");
    const hardList = hardSaved ? JSON.parse(hardSaved) : [];
    setHardSkills(hardList);

    const softSaved = localStorage.getItem("jq_works_skills_soft");
    const softList = softSaved ? JSON.parse(softSaved) : [];
    setSoftSkills(softList);

    setStats({
      visitors,
      likes,
      comments: guestbookList.length,
      projects: projList.length,
      achievements: achList.length,
      experiences: expList.length,
      skills: hardList.length + softList.length
    });
  };

  useEffect(() => {
    if (!isAuthorized) return;
    loadAdminData();

    window.addEventListener("local-projects-update", loadAdminData);
    window.addEventListener("local-achievements-update", loadAdminData);
    window.addEventListener("local-experiences-update", loadAdminData);
    window.addEventListener("local-skills-update", loadAdminData);
    window.addEventListener("local-guestbook-update", loadAdminData);

    return () => {
      window.removeEventListener("local-projects-update", loadAdminData);
      window.removeEventListener("local-achievements-update", loadAdminData);
      window.removeEventListener("local-experiences-update", loadAdminData);
      window.removeEventListener("local-skills-update", loadAdminData);
      window.removeEventListener("local-guestbook-update", loadAdminData);
    };
  }, [isAuthorized]);

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === "jackqqq2026" || passkey === "admin123") {
      playSynthSound("sine", 600, 0.15);
      sessionStorage.setItem("jq_admin_auth", "true");
      setIsAuthorized(true);
      setLoginError("");
    } else {
      playSynthSound("sawtooth", 120, 0.3);
      setLoginError("ACCESS DENIED. INVALID ACCESS KEY.");
    }
  };

  const handleLogout = () => {
    playSynthSound("triangle", 150, 0.1);
    sessionStorage.removeItem("jq_admin_auth");
    setIsAuthorized(false);
    setPasskey("");
  };

  // Projects CRUD Actions
  const openAddProject = () => {
    playSynthSound("sine", 320, 0.05);
    setEditingProject(null);
    setProjForm({
      title: "", category: "", description: "", tags: "", link: "https://github.com/jackqqq", colorClass: "bg-retro-blue", year: new Date().getFullYear().toString(), images: ""
    });
    setIsProjModalOpen(true);
  };

  const openEditProject = (proj: any, idx: number) => {
    playSynthSound("sine", 340, 0.05);
    setEditingProject({ ...proj, index: idx });
    setProjForm({
      title: proj.title, category: proj.category, description: proj.description, tags: proj.tags ? proj.tags.join(", ") : "", link: proj.link, colorClass: proj.colorClass || "bg-retro-blue", year: proj.year || "2026", images: proj.images ? proj.images.join(", ") : ""
    });
    setIsProjModalOpen(true);
  };

  const handleProjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...projects];
    const tagsArr = projForm.tags.split(",").map(t => t.trim()).filter(Boolean);
    const imgArr = projForm.images.split(",").map(i => i.trim()).filter(Boolean);
    const data = {
      title: projForm.title, category: projForm.category, description: projForm.description, tags: tagsArr, link: projForm.link, colorClass: projForm.colorClass, year: projForm.year, images: imgArr.length > 0 ? imgArr : ["/projects/default.png"]
    };
    if (editingProject !== null) updated[editingProject.index] = data;
    else updated.push(data);

    localStorage.setItem("jq_works_projects", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-projects-update"));
    setIsProjModalOpen(false);
    playSynthSound("sine", 580, 0.1);
  };

  const handleDeleteProject = (index: number) => {
    if (!confirm("Hapus proyek ini?")) return;
    playSynthSound("sawtooth", 200, 0.1);
    const updated = projects.filter((_, idx) => idx !== index);
    localStorage.setItem("jq_works_projects", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-projects-update"));
  };

  // Achievements CRUD Actions
  const openAddAchievement = () => {
    playSynthSound("sine", 320, 0.05);
    setEditingAchievement(null);
    setAchForm({
      title: "", rank: "", year: new Date().getFullYear().toString(), id: "REC-A" + Math.floor(10 + Math.random() * 90), color: "bg-retro-yellow", tag: "", type: "PRESTASI", image: ""
    });
    setIsAchModalOpen(true);
  };

  const openEditAchievement = (ach: any, idx: number) => {
    playSynthSound("sine", 340, 0.05);
    setEditingAchievement({ ...ach, index: idx });
    setAchForm({
      title: ach.title, rank: ach.rank, year: ach.year, id: ach.id, color: ach.color || "bg-retro-yellow", tag: ach.tag, type: ach.type || "PRESTASI", image: ach.image || ""
    });
    setIsAchModalOpen(true);
  };

  const handleAchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...achievements];
    const data = {
      title: achForm.title, rank: achForm.rank, year: achForm.year, id: achForm.id, color: achForm.color, tag: achForm.tag, type: achForm.type, image: achForm.image || "/cert-default.jpg"
    };
    if (editingAchievement !== null) updated[editingAchievement.index] = data;
    else updated.push(data);

    localStorage.setItem("jq_works_achievements", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-achievements-update"));
    setIsAchModalOpen(false);
    playSynthSound("sine", 580, 0.1);
  };

  const handleDeleteAchievement = (index: number) => {
    if (!confirm("Hapus prestasi ini?")) return;
    playSynthSound("sawtooth", 200, 0.1);
    const updated = achievements.filter((_, idx) => idx !== index);
    localStorage.setItem("jq_works_achievements", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-achievements-update"));
  };

  // Experiences CRUD Actions
  const openAddExperience = () => {
    playSynthSound("sine", 320, 0.05);
    setEditingExperience(null);
    setExpForm({
      id: "0" + (experiences.length + 1), period: "2026 - SEKARANG", badge: "WORK", title: "", role: "", description: "", bgColor: "#ffffff", markerColor: "bg-retro-orange", icon: "briefcase", bullets: "", bulletsHeader: "",
      card1_title: "", card1_desc: "", card1_period: "", card1_bg: "bg-retro-yellow", card1_icon: "pen",
      card2_title: "", card2_desc: "", card2_period: "", card2_bg: "bg-retro-pink", card2_icon: "video"
    });
    setIsExpModalOpen(true);
  };

  const openEditExperience = (exp: any, idx: number) => {
    playSynthSound("sine", 340, 0.05);
    setEditingExperience({ ...exp, index: idx });
    const c1 = exp.cards && exp.cards[0] ? exp.cards[0] : {};
    const c2 = exp.cards && exp.cards[1] ? exp.cards[1] : {};
    setExpForm({
      id: exp.id, period: exp.period, badge: exp.badge, title: exp.title, role: exp.role, description: exp.description, bgColor: exp.bgColor || "#ffffff", markerColor: exp.markerColor || "bg-retro-orange", icon: exp.icon || "briefcase", bullets: exp.bullets ? exp.bullets.join(", ") : "", bulletsHeader: exp.bulletsHeader || "",
      card1_title: c1.title || "", card1_desc: c1.description || "", card1_period: c1.period || "", card1_bg: c1.bgColor || "bg-retro-yellow", card1_icon: c1.icon || "pen",
      card2_title: c2.title || "", card2_desc: c2.description || "", card2_period: c2.period || "", card2_bg: c2.bgColor || "bg-retro-pink", card2_icon: c2.icon || "video"
    });
    setIsExpModalOpen(true);
  };

  const handleExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...experiences];
    const bArr = expForm.bullets.split(",").map(b => b.trim()).filter(Boolean);
    const childCards = [];
    if (expForm.card1_title) {
      childCards.push({
        title: expForm.card1_title, description: expForm.card1_desc, period: expForm.card1_period, bgColor: expForm.card1_bg, icon: expForm.card1_icon
      });
    }
    if (expForm.card2_title) {
      childCards.push({
        title: expForm.card2_title, description: expForm.card2_desc, period: expForm.card2_period, bgColor: expForm.card2_bg, icon: expForm.card2_icon
      });
    }

    const data = {
      id: expForm.id, period: expForm.period, badge: expForm.badge, title: expForm.title, role: expForm.role, description: expForm.description, bgColor: expForm.bgColor, markerColor: expForm.markerColor, icon: expForm.icon,
      bullets: bArr,
      bulletsHeader: expForm.bulletsHeader,
      cards: childCards.length > 0 ? childCards : undefined
    };

    if (editingExperience !== null) updated[editingExperience.index] = data;
    else updated.push(data);

    localStorage.setItem("jq_works_experiences", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-experiences-update"));
    setIsExpModalOpen(false);
    playSynthSound("sine", 580, 0.1);
  };

  const handleDeleteExperience = (index: number) => {
    if (!confirm("Hapus data pengalaman ini?")) return;
    playSynthSound("sawtooth", 200, 0.1);
    const updated = experiences.filter((_, idx) => idx !== index);
    localStorage.setItem("jq_works_experiences", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-experiences-update"));
  };

  // Hard Skills Actions
  const openAddHardSkill = () => {
    playSynthSound("sine", 320, 0.05);
    setEditingHardSkill(null);
    setHardSkillForm({ name: "", colorClass: "bg-retro-orange", category: "DEVELOPMENT", icon: "computer" });
    setIsHardSkillModalOpen(true);
  };

  const openEditHardSkill = (skill: any, idx: number) => {
    playSynthSound("sine", 340, 0.05);
    setEditingHardSkill({ ...skill, index: idx });
    setHardSkillForm({ name: skill.name, colorClass: skill.colorClass || "bg-retro-orange", category: skill.category || "DEVELOPMENT", icon: skill.icon || "computer" });
    setIsHardSkillModalOpen(true);
  };

  const handleHardSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...hardSkills];
    const data = { ...hardSkillForm };
    if (editingHardSkill !== null) updated[editingHardSkill.index] = data;
    else updated.push(data);

    localStorage.setItem("jq_works_skills_hard", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-skills-update"));
    setIsHardSkillModalOpen(false);
    playSynthSound("sine", 580, 0.1);
  };

  const handleDeleteHardSkill = (index: number) => {
    if (!confirm("Hapus keahlian ini?")) return;
    playSynthSound("sawtooth", 200, 0.1);
    const updated = hardSkills.filter((_, idx) => idx !== index);
    localStorage.setItem("jq_works_skills_hard", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-skills-update"));
  };

  // Soft Skills Actions
  const openAddSoftSkill = () => {
    playSynthSound("sine", 320, 0.05);
    setEditingSoftSkill(null);
    setSoftSkillForm({ title: "", description: "", bgColor: "bg-retro-yellow" });
    setIsSoftSkillModalOpen(true);
  };

  const openEditSoftSkill = (skill: any, idx: number) => {
    playSynthSound("sine", 340, 0.05);
    setEditingSoftSkill({ ...skill, index: idx });
    setSoftSkillForm({ title: skill.title, description: skill.description, bgColor: skill.bgColor || "bg-retro-yellow" });
    setIsSoftSkillModalOpen(true);
  };

  const handleSoftSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...softSkills];
    const data = { ...softSkillForm };
    if (editingSoftSkill !== null) updated[editingSoftSkill.index] = data;
    else updated.push(data);

    localStorage.setItem("jq_works_skills_soft", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-skills-update"));
    setIsSoftSkillModalOpen(false);
    playSynthSound("sine", 580, 0.1);
  };

  const handleDeleteSoftSkill = (index: number) => {
    if (!confirm("Hapus kemampuan ini?")) return;
    playSynthSound("sawtooth", 200, 0.1);
    const updated = softSkills.filter((_, idx) => idx !== index);
    localStorage.setItem("jq_works_skills_soft", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-skills-update"));
  };

  // Guestbook Moderator Action
  const handleDeleteComment = (index: number) => {
    if (!confirm("Hapus pesan buku tamu ini secara permanen?")) return;
    playSynthSound("sawtooth", 200, 0.1);
    const updated = guestbook.filter((_, idx) => idx !== index);
    localStorage.setItem("jq_works_guestbook", JSON.stringify(updated));
    window.dispatchEvent(new Event("local-guestbook-update"));
  };


  // ──────────────────────────────────────────────────────────────────────────
  // RENDER LOGIN SCREEN (RETRO OS WINDOW STYLE - SESUAI DESIGN.MD)
  // ──────────────────────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <main className="min-h-screen w-full bg-[#F4F0EC] flex flex-col items-center justify-center p-6 select-none font-mono text-black relative overflow-hidden">
        {/* Decorative Grid Lines Background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        {/* Floating Decorative Retro Stickers (Rules of design.md) */}
        <div className="absolute top-10 left-10 p-3 bg-retro-yellow border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] -rotate-6 text-[8px] font-bold hidden md:block">
          SECURE_SYS_V1.0
        </div>

        {/* Main Retro OS Window Dialog Box */}
        <div className="w-full max-w-md mx-auto bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-10 transition-all">
          
          {/* OS Window Top Bar Header */}
          <div className="px-4 py-2.5 bg-[#3B82F6] text-white border-b-[3px] border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-white border border-black rounded-full block animate-pulse"></span>
              <span className="font-bold text-xs uppercase tracking-wider">admin_auth_gateway.sys</span>
            </div>
            <a 
              href="/"
              onClick={() => playSynthSound("sawtooth", 160, 0.05)}
              className="w-5 h-5 bg-white text-black border-2 border-black rounded flex items-center justify-center text-[10px] font-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:translate-y-[0.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer !no-underline"
              title="Close and exit"
            >
              ×
            </a>
          </div>

          {/* Dialog Contents */}
          <div className="p-6 space-y-6">
            
            {/* Simple Heading Title */}
            <div className="text-center select-none pb-2 border-b-2 border-dashed border-neutral-200">
              <h2 className="font-syne text-2xl font-black tracking-tight text-black uppercase">
                ADMIN ACCESS_
              </h2>
              <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                // SYSTEM CONTROL SECURITY CONSOLE
              </div>
            </div>

            {/* Simulated Server Info log */}
            <div className="bg-[#F4F0EC] border-2 border-black rounded-xl p-3 text-[10px] leading-relaxed space-y-1 font-bold">
              <div>HOST: jackqqq_personal_desktop</div>
              <div>AUTH: MOCK_LOCALSTORE_ENGINE_2026</div>
              <div>USER: MOCHAMMAD_DZAKY_AZZAM</div>
            </div>

            {loginError && (
              <div className="text-red-500 font-bold border-2 border-red-500 bg-red-50 p-2.5 rounded-lg text-[11px] text-center shadow-[2px_2px_0px_rgba(239,68,68,0.25)] animate-pulse">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-600">
                  ENTER ACCESS PASSKEY:
                </label>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="[••••••••••••]"
                  className="w-full bg-[#F4F0EC] border-[3px] border-black rounded-xl px-4 py-2.5 text-black placeholder-neutral-400 font-bold text-center tracking-widest focus:outline-none focus:bg-white transition-all text-sm"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                style={{ backgroundColor: "#A3E635" }}
                className="w-full text-black border-[3px] border-black rounded-xl font-bold py-2.5 text-xs tracking-wider uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                EXECUTE_AUTHORIZATION.EXE
              </button>
            </form>

            <div className="text-center pt-2">
              <a 
                href="/" 
                onClick={() => playSynthSound("triangle", 220, 0.05)}
                className="text-xs text-neutral-500 hover:text-black font-bold uppercase underline decoration-dashed transition-colors"
              >
                &lt; Back to System Desktop
              </a>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER DASHBOARD CONTROL PANEL
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-retro-bg py-10 px-4 md:px-8 select-none font-mono text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER BAR */}
        <div className="bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-retro-orange border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Trophy className="w-6 h-6 text-white block" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">// JQ_SYSTEM_DASHBOARD</h1>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Logged in as Administrator (Mochammad Dzaky Azzam)
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="/"
              onClick={() => playSynthSound("triangle", 220, 0.05)}
              className="px-4 py-2 bg-white text-black border-3 border-black rounded-xl font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer !no-underline"
            >
              <ArrowLeftIcon />
              Lihat Web
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-retro-orange text-white border-3 border-black rounded-xl font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between" style={{ borderLeftColor: "#FF5C00", borderLeftWidth: "8px" }}>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">// VISITORS_COUNT</span>
            <div className="my-2">
              <span className="text-3xl font-black">{stats.visitors}</span>
              <span className="text-xs text-neutral-500 font-bold ml-1">SESSIONS</span>
            </div>
            <div className="w-full bg-neutral-100 h-2 border border-black rounded overflow-hidden">
              <div className="bg-retro-orange h-full" style={{ width: `${Math.min(100, stats.visitors * 3)}%` }} />
            </div>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between" style={{ borderLeftColor: "#F472B6", borderLeftWidth: "8px" }}>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">// PAGE_LIKES</span>
            <div className="my-2">
              <span className="text-3xl font-black">{stats.likes}</span>
              <span className="text-xs text-neutral-500 font-bold ml-1">VOTES</span>
            </div>
            <div className="w-full bg-neutral-100 h-2 border border-black rounded overflow-hidden">
              <div className="bg-retro-pink h-full" style={{ width: `${Math.min(100, stats.likes / 2)}%` }} />
            </div>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between" style={{ borderLeftColor: "#A3E635", borderLeftWidth: "8px" }}>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">// GUESTBOOK_POSTS</span>
            <div className="my-2">
              <span className="text-3xl font-black">{stats.comments}</span>
              <span className="text-xs text-neutral-500 font-bold ml-1">ENTRIES</span>
            </div>
            <div className="w-full bg-neutral-100 h-2 border border-black rounded overflow-hidden">
              <div className="bg-retro-lime h-full" style={{ width: `${Math.min(100, stats.comments * 8)}%` }} />
            </div>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between" style={{ borderLeftColor: "#3B82F6", borderLeftWidth: "8px" }}>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">// PORTFOLIO_ITEMS</span>
            <div className="my-2">
              <span className="text-3xl font-black">{stats.projects + stats.achievements + stats.experiences + stats.skills}</span>
              <span className="text-xs text-neutral-500 font-bold ml-1">TOTAL</span>
            </div>
            <div className="text-[8px] text-neutral-400 font-bold uppercase">
              {stats.projects} Proj // {stats.achievements} Ach // {stats.experiences} Exp // {stats.skills} Skills
            </div>
          </div>

        </div>

        {/* TABS CONTAINER */}
        <div className="bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          
          {/* Tab buttons bar */}
          <div className="flex flex-wrap border-b-3 border-black bg-neutral-100 text-xs">
            <button
              onClick={() => { playSynthSound("sine", 280, 0.05); setActiveTab("projects"); }}
              style={{ backgroundColor: activeTab === "projects" ? "#ffffff" : "#F4F0EC", color: "#000000" }}
              className="px-5 py-3 border-r-3 border-b-3 md:border-b-0 border-black font-bold uppercase cursor-pointer"
            >
              Proyek ({projects.length})
            </button>
            <button
              onClick={() => { playSynthSound("sine", 300, 0.05); setActiveTab("achievements"); }}
              style={{ backgroundColor: activeTab === "achievements" ? "#ffffff" : "#F4F0EC", color: "#000000" }}
              className="px-5 py-3 border-r-3 border-b-3 md:border-b-0 border-black font-bold uppercase cursor-pointer"
            >
              Prestasi ({achievements.length})
            </button>
            <button
              onClick={() => { playSynthSound("sine", 320, 0.05); setActiveTab("experiences"); }}
              style={{ backgroundColor: activeTab === "experiences" ? "#ffffff" : "#F4F0EC", color: "#000000" }}
              className="px-5 py-3 border-r-3 border-b-3 md:border-b-0 border-black font-bold uppercase cursor-pointer"
            >
              Linimasa Pengalaman ({experiences.length})
            </button>
            <button
              onClick={() => { playSynthSound("sine", 340, 0.05); setActiveTab("skills"); }}
              style={{ backgroundColor: activeTab === "skills" ? "#ffffff" : "#F4F0EC", color: "#000000" }}
              className="px-5 py-3 border-r-3 border-b-3 md:border-b-0 border-black font-bold uppercase cursor-pointer"
            >
              Keahlian &amp; Skills ({hardSkills.length + softSkills.length})
            </button>
            <button
              onClick={() => { playSynthSound("sine", 360, 0.05); setActiveTab("guestbook"); }}
              style={{ backgroundColor: activeTab === "guestbook" ? "#ffffff" : "#F4F0EC", color: "#000000" }}
              className="px-5 py-3 border-b-3 md:border-b-0 border-black font-bold uppercase cursor-pointer"
            >
              Buku Tamu ({guestbook.length})
            </button>
          </div>

          <div className="p-6">
            
            {/* TABS 1: PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-300 pb-3">
                  <div className="text-xs text-neutral-500 font-bold uppercase">// KELOLA PROYEK PORTFOLIO</div>
                  <button
                    onClick={openAddProject}
                    style={{ backgroundColor: "#A3E635" }}
                    className="px-4 py-2 text-black border-3 border-black rounded-xl font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusIcon /> Tambah Proyek
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black font-bold text-xs text-neutral-600">
                        <th className="py-2.5 px-3">JUDUL</th>
                        <th className="py-2.5 px-3">KATEGORI</th>
                        <th className="py-2.5 px-3">TAHUN</th>
                        <th className="py-2.5 px-3">TAGS</th>
                        <th className="py-2.5 px-3 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((proj, idx) => (
                        <tr key={idx} className="border-b border-neutral-200 text-xs hover:bg-neutral-50">
                          <td className="py-3 px-3 font-bold">{proj.title}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 border border-black bg-neutral-100 rounded text-[9px] font-bold uppercase">{proj.category}</span>
                          </td>
                          <td className="py-3 px-3">{proj.year}</td>
                          <td className="py-3 px-3 max-w-[200px] truncate text-neutral-500">{proj.tags ? proj.tags.join(", ") : ""}</td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => openEditProject(proj, idx)} style={{ backgroundColor: "#FACC15" }} className="p-1.5 border-2 border-black rounded cursor-pointer"><EditIcon /></button>
                            <button onClick={() => handleDeleteProject(idx)} style={{ backgroundColor: "#FF5C00" }} className="p-1.5 border-2 border-black text-white rounded cursor-pointer"><TrashIcon /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 2: ACHIEVEMENTS */}
            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-300 pb-3">
                  <div className="text-xs text-neutral-500 font-bold uppercase">// KELOLA PRESTASI &amp; SERTIFIKASI</div>
                  <button
                    onClick={openAddAchievement}
                    style={{ backgroundColor: "#A3E635" }}
                    className="px-4 py-2 text-black border-3 border-black rounded-xl font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusIcon /> Tambah Prestasi
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black font-bold text-xs text-neutral-600">
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">JUDUL PRESTASI</th>
                        <th className="py-2.5 px-3">STATUS/PERINGKAT</th>
                        <th className="py-2.5 px-3">TAHUN</th>
                        <th className="py-2.5 px-3">TIPE</th>
                        <th className="py-2.5 px-3 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achievements.map((ach, idx) => (
                        <tr key={idx} className="border-b border-neutral-200 text-xs hover:bg-neutral-50">
                          <td className="py-3 px-3 font-mono text-neutral-400">{ach.id}</td>
                          <td className="py-3 px-3 font-bold">{ach.title}</td>
                          <td className="py-3 px-3 text-retro-orange font-bold uppercase">{ach.rank}</td>
                          <td className="py-3 px-3">{ach.year}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 border border-black rounded text-[9px] font-bold uppercase ${
                              ach.type === "PRESTASI" ? "bg-retro-pink text-black" : "bg-retro-blue text-white"
                            }`}>{ach.type}</span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => openEditAchievement(ach, idx)} style={{ backgroundColor: "#FACC15" }} className="p-1.5 border-2 border-black rounded cursor-pointer"><EditIcon /></button>
                            <button onClick={() => handleDeleteAchievement(idx)} style={{ backgroundColor: "#FF5C00" }} className="p-1.5 border-2 border-black text-white rounded cursor-pointer"><TrashIcon /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 3: EXPERIENCES (TIMELINE) */}
            {activeTab === "experiences" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-300 pb-3">
                  <div className="text-xs text-neutral-500 font-bold uppercase">// KELOLA LINIMASA PENGALAMAN</div>
                  <button
                    onClick={openAddExperience}
                    style={{ backgroundColor: "#A3E635" }}
                    className="px-4 py-2 text-black border-3 border-black rounded-xl font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusIcon /> Tambah Pengalaman
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black font-bold text-xs text-neutral-600">
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">INSTITUSI / PERUSAHAAN</th>
                        <th className="py-2.5 px-3">PERAN (ROLE)</th>
                        <th className="py-2.5 px-3">DURASI</th>
                        <th className="py-2.5 px-3">BULLETS/CARDS</th>
                        <th className="py-2.5 px-3 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiences.map((exp, idx) => (
                        <tr key={idx} className="border-b border-neutral-200 text-xs hover:bg-neutral-50">
                          <td className="py-3 px-3 font-mono font-bold text-neutral-500">{exp.id}</td>
                          <td className="py-3 px-3 font-bold">{exp.title}</td>
                          <td className="py-3 px-3">{exp.role}</td>
                          <td className="py-3 px-3">{exp.period}</td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] text-neutral-400 font-bold">
                              {exp.bullets ? `${exp.bullets.length} B` : "0 B"} / {exp.cards ? `${exp.cards.length} C` : "0 C"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => openEditExperience(exp, idx)} style={{ backgroundColor: "#FACC15" }} className="p-1.5 border-2 border-black rounded cursor-pointer"><EditIcon /></button>
                            <button onClick={() => handleDeleteExperience(idx)} style={{ backgroundColor: "#FF5C00" }} className="p-1.5 border-2 border-black text-white rounded cursor-pointer"><TrashIcon /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 4: SKILLS */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                
                {/* Sub-tab selection bar */}
                <div className="flex border-b border-neutral-200 gap-3 pb-2 text-xs">
                  <button
                    onClick={() => { playSynthSound("sine", 200, 0.05); setSkillsTab("hard"); }}
                    className={`pb-1 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                      skillsTab === "hard" ? "border-retro-orange text-retro-orange" : "border-transparent text-neutral-400"
                    }`}
                  >
                    Hard Skills (Technical Stack) ({hardSkills.length})
                  </button>
                  <button
                    onClick={() => { playSynthSound("sine", 220, 0.05); setSkillsTab("soft"); }}
                    className={`pb-1 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                      skillsTab === "soft" ? "border-retro-orange text-retro-orange" : "border-transparent text-neutral-400"
                    }`}
                  >
                    Soft Skills (Core Capabilities) ({softSkills.length})
                  </button>
                </div>

                {skillsTab === "hard" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-dashed border-neutral-300 pb-2">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">// DAFTAR HARD SKILLS (FLOPPY STACK)</span>
                      <button
                        onClick={openAddHardSkill}
                        style={{ backgroundColor: "#A3E635" }}
                        className="px-3 py-1.5 text-black border-2 border-black rounded-lg font-bold text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <PlusIcon /> Tambah Hard Skill
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black font-bold text-[10px] text-neutral-500">
                            <th className="py-2 px-3">NAMA SKILL</th>
                            <th className="py-2 px-3">KATEGORI UTAMA</th>
                            <th className="py-2 px-3">IKON</th>
                            <th className="py-2 px-3">WARNA WIDGET</th>
                            <th className="py-2 px-3 text-right">AKSI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hardSkills.map((skill, idx) => (
                            <tr key={idx} className="border-b border-neutral-200 text-xs hover:bg-neutral-50">
                              <td className="py-2 px-3 font-bold">{skill.name}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 border border-neutral-400 rounded text-[9px] bg-neutral-50 font-bold">{skill.category}</span>
                              </td>
                              <td className="py-2 px-3 font-mono text-neutral-400">{skill.icon}</td>
                              <td className="py-2 px-3 font-mono">
                                <span className={`px-2 py-0.5 border border-black rounded text-[9px] font-bold ${skill.colorClass}`}>{skill.colorClass}</span>
                              </td>
                              <td className="py-2 px-3 text-right space-x-2">
                                <button onClick={() => openEditHardSkill(skill, idx)} style={{ backgroundColor: "#FACC15" }} className="p-1 border border-black rounded cursor-pointer"><EditIcon /></button>
                                <button onClick={() => handleDeleteHardSkill(idx)} style={{ backgroundColor: "#FF5C00" }} className="p-1 border border-black text-white rounded cursor-pointer"><TrashIcon /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-dashed border-neutral-300 pb-2">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">// DAFTAR SOFT SKILLS (POST-IT STICKERS)</span>
                      <button
                        onClick={openAddSoftSkill}
                        style={{ backgroundColor: "#A3E635" }}
                        className="px-3 py-1.5 text-black border-2 border-black rounded-lg font-bold text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <PlusIcon /> Tambah Soft Skill
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black font-bold text-[10px] text-neutral-500">
                            <th className="py-2 px-3">JUDUL FILE (.SYS / .LOG)</th>
                            <th className="py-2 px-3">DESKRIPSI CAPABILITY</th>
                            <th className="py-2 px-3">WARNA STICKY</th>
                            <th className="py-2 px-3 text-right">AKSI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {softSkills.map((skill, idx) => (
                            <tr key={idx} className="border-b border-neutral-200 text-xs hover:bg-neutral-50">
                              <td className="py-2.5 px-3 font-bold text-retro-orange">{skill.title}</td>
                              <td className="py-2.5 px-3 max-w-[280px] truncate">{skill.description}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 border border-black rounded text-[9px] font-bold ${skill.bgColor}`}>{skill.bgColor}</span>
                              </td>
                              <td className="py-2.5 px-3 text-right space-x-2">
                                <button onClick={() => openEditSoftSkill(skill, idx)} style={{ backgroundColor: "#FACC15" }} className="p-1 border border-black rounded cursor-pointer"><EditIcon /></button>
                                <button onClick={() => handleDeleteSoftSkill(idx)} style={{ backgroundColor: "#FF5C00" }} className="p-1 border border-black text-white rounded cursor-pointer"><TrashIcon /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TABS 5: GUESTBOOK MODERATOR */}
            {activeTab === "guestbook" && (
              <div className="space-y-6">
                <div className="border-b-2 border-dashed border-neutral-300 pb-3">
                  <div className="text-xs text-neutral-500 font-bold uppercase">// MODERASI PESAN BUKU TAMU VIRTUAL DESK</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black font-bold text-xs text-neutral-600">
                        <th className="py-2.5 px-3">USERNAME</th>
                        <th className="py-2.5 px-3">PESAN (MESSAGE)</th>
                        <th className="py-2.5 px-3">WARNA KERTAS</th>
                        <th className="py-2.5 px-3 text-right">AKSI MODERATOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guestbook.map((note, idx) => (
                        <tr key={idx} className="border-b border-neutral-200 text-xs hover:bg-neutral-50">
                          <td className="py-3 px-3 font-bold text-retro-blue">@{note.name}</td>
                          <td className="py-3 px-3 max-w-sm truncate">{note.message}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 border border-black rounded text-[9px] font-bold ${note.color}`}>{note.color}</span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteComment(idx)}
                              style={{ backgroundColor: "#FF5C00" }}
                              className="px-3 py-1 border-2 border-black text-white rounded font-bold text-[10px] uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px] cursor-pointer flex items-center gap-1.5 ml-auto"
                            >
                              <TrashIcon /> Moderasi Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
         MODAL FORM DIALOG: PROJECT EDITOR
         ────────────────────────────────────────────────────────────────────────── */}
      {isProjModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-2xl w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-2.5 bg-retro-orange border-b-3 border-black text-white">
              <span className="font-bold text-xs uppercase">{editingProject ? "⚙️ EDIT_PROJECT.EXE" : "➕ ADD_PROJECT.EXE"}</span>
              <button onClick={() => { playSynthSound("sawtooth", 160, 0.05); setIsProjModalOpen(false); }} className="bg-white text-black border-2 border-black p-0.5 rounded cursor-pointer"><Close className="w-4 h-4 block" /></button>
            </div>
            <form onSubmit={handleProjSubmit} className="p-5 space-y-4 text-xs leading-relaxed overflow-y-auto max-h-[75vh]">
              <div className="space-y-1">
                <label className="block font-bold">JUDUL PROYEK:</label>
                <input type="text" required placeholder="OrchiCare Inovasi IoT" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">KATEGORI:</label>
                  <input type="text" required placeholder="IoT & AI APP" value={projForm.category} onChange={(e) => setProjForm({ ...projForm, category: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">TAHUN:</label>
                  <input type="text" required placeholder="2026" value={projForm.year} onChange={(e) => setProjForm({ ...projForm, year: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block font-bold">DESKRIPSI PROYEK:</label>
                <textarea required rows={3} placeholder="Deskripsikan fitur..." value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none resize-none" />
              </div>
              <div className="space-y-1">
                <label className="block font-bold">TAGS (PISAH DENGAN KOMA):</label>
                <input type="text" placeholder="React, Next.js, IoT" value={projForm.tags} onChange={(e) => setProjForm({ ...projForm, tags: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block font-bold">URL TAUTAN / GITHUB:</label>
                <input type="url" required value={projForm.link} onChange={(e) => setProjForm({ ...projForm, link: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">TEMA WARNA WINDOW:</label>
                  <select value={projForm.colorClass} onChange={(e) => setProjForm({ ...projForm, colorClass: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black bg-white focus:outline-none">
                    <option value="bg-retro-orange">Retro Orange (FIKSI)</option>
                    <option value="bg-retro-blue">Retro Blue</option>
                    <option value="bg-retro-pink">Retro Pink</option>
                    <option value="bg-retro-yellow">Retro Yellow</option>
                    <option value="bg-retro-lime">Retro Lime</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">FOTO CAROUSEL (KOMA):</label>
                  <input type="text" placeholder="/projects/img1.png, /projects/img2.png" value={projForm.images} onChange={(e) => setProjForm({ ...projForm, images: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#A3E635] text-black border-2 border-black rounded font-bold py-2.5 text-xs uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer">SIMPAN_PROYEK.EXE</button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
         MODAL FORM DIALOG: ACHIEVEMENT EDITOR
         ────────────────────────────────────────────────────────────────────────── */}
      {isAchModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-2xl w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-2.5 bg-retro-pink border-b-3 border-black text-white">
              <span className="font-bold text-xs uppercase">{editingAchievement ? "⚙️ EDIT_ACHIEVEMENT.EXE" : "➕ ADD_ACHIEVEMENT.EXE"}</span>
              <button onClick={() => { playSynthSound("sawtooth", 160, 0.05); setIsAchModalOpen(false); }} className="bg-white text-black border-2 border-black p-0.5 rounded cursor-pointer"><Close className="w-4 h-4 block" /></button>
            </div>
            <form onSubmit={handleAchSubmit} className="p-5 space-y-4 text-xs leading-relaxed overflow-y-auto max-h-[75vh]">
              <div className="space-y-1">
                <label className="block font-bold">NAMA PRESTASI / SERTIFIKAT:</label>
                <input type="text" required placeholder="Google IT Support Certificate" value={achForm.title} onChange={(e) => setAchForm({ ...achForm, title: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">STATUS / PERINGKAT:</label>
                  <input type="text" required placeholder="COMPLETED / 1ST PLACE" value={achForm.rank} onChange={(e) => setAchForm({ ...achForm, rank: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">TAHUN:</label>
                  <input type="text" required placeholder="2026" value={achForm.year} onChange={(e) => setAchForm({ ...achForm, year: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">ID SERTIFIKAT:</label>
                  <input type="text" required placeholder="CERT-G11" value={achForm.id} onChange={(e) => setAchForm({ ...achForm, id: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">TAG BIDANG:</label>
                  <input type="text" required placeholder="IT_SUPPORT" value={achForm.tag} onChange={(e) => setAchForm({ ...achForm, tag: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">TIPE PRESTASI:</label>
                  <select value={achForm.type} onChange={(e) => setAchForm({ ...achForm, type: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black bg-white focus:outline-none">
                    <option value="PRESTASI">PRESTASI (KOMPETISI)</option>
                    <option value="SERTIFIKASI">SERTIFIKASI PROFESSIONAL</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">WARNA WIDGET:</label>
                  <select value={achForm.color} onChange={(e) => setAchForm({ ...achForm, color: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black bg-white focus:outline-none">
                    <option value="bg-retro-yellow">Retro Yellow</option>
                    <option value="bg-retro-pink">Retro Pink</option>
                    <option value="bg-retro-lime">Retro Lime</option>
                    <option value="bg-retro-blue">Retro Blue</option>
                    <option value="bg-retro-orange">Retro Orange</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block font-bold">GAMBAR SERTIFIKAT (PATH):</label>
                <input type="text" placeholder="/cert1.jpg" value={achForm.image} onChange={(e) => setAchForm({ ...achForm, image: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-[#F472B6] text-black border-2 border-black rounded font-bold py-2.5 text-xs uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer">SIMPAN_PRESTASI.EXE</button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
         MODAL FORM DIALOG: TIMELINE EXPERIENCE EDITOR
         ────────────────────────────────────────────────────────────────────────── */}
      {isExpModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-2xl w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-2.5 bg-retro-lime border-b-3 border-black text-black">
              <span className="font-bold text-xs uppercase">{editingExperience ? "⚙️ EDIT_EXPERIENCE.EXE" : "➕ ADD_EXPERIENCE.EXE"}</span>
              <button onClick={() => { playSynthSound("sawtooth", 160, 0.05); setIsExpModalOpen(false); }} className="bg-white text-black border-2 border-black p-0.5 rounded cursor-pointer"><Close className="w-4 h-4 block" /></button>
            </div>
            <form onSubmit={handleExpSubmit} className="p-5 space-y-4 text-xs leading-relaxed overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-1">
                  <label className="block font-bold">NO. NODE ID:</label>
                  <input type="text" required placeholder="01" value={expForm.id} onChange={(e) => setExpForm({ ...expForm, id: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="block font-bold">DURASI WAKTU:</label>
                  <input type="text" required placeholder="2024 - SEKARANG" value={expForm.period} onChange={(e) => setExpForm({ ...expForm, period: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">INSTITUSI / INSTANSI:</label>
                  <input type="text" required placeholder="OneLens Media / SMK Telkom" value={expForm.title} onChange={(e) => setExpForm({ ...expForm, title: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">BADGE UTAMA:</label>
                  <input type="text" required placeholder="LATEST_VENTURE / EDUCATION" value={expForm.badge} onChange={(e) => setExpForm({ ...expForm, badge: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">JABATAN (ROLE):</label>
                <input type="text" required placeholder="Founder / Siswa RPL" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="block font-bold">DESKRIPSI UTAMA:</label>
                <textarea required rows={2} placeholder="Ceritakan detail peran Anda..." value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="block font-bold">BG WINDOW PANEL:</label>
                  <input type="text" required placeholder="#F9F7F5" value={expForm.bgColor} onChange={(e) => setExpForm({ ...expForm, bgColor: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">WARNA MARKER NODE:</label>
                  <select value={expForm.markerColor} onChange={(e) => setExpForm({ ...expForm, markerColor: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black bg-white focus:outline-none">
                    <option value="bg-retro-orange">Retro Orange</option>
                    <option value="bg-retro-blue">Retro Blue</option>
                    <option value="bg-retro-pink">Retro Pink</option>
                    <option value="bg-retro-yellow">Retro Yellow</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">IKON BESAR PANEL:</label>
                  <select value={expForm.icon} onChange={(e) => setExpForm({ ...expForm, icon: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black bg-white focus:outline-none">
                    <option value="video">Video Camera</option>
                    <option value="book">Open Book</option>
                    <option value="code">Code Terminal</option>
                    <option value="briefcase">Briefcase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">CONSOLE BULLETS (PISAH DENGAN KOMA):</label>
                <input type="text" placeholder="BULLET 1, BULLET 2" value={expForm.bullets} onChange={(e) => setExpForm({ ...expForm, bullets: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
              </div>

              {/* Child Cards Editor */}
              <div className="border-t-2 border-dashed border-neutral-300 pt-3 space-y-3">
                <div className="space-y-1">
                  <label className="block font-bold">JUDUL SUB-DOKUMEN KARTU (MISAL: ORGANISASI):</label>
                  <input type="text" placeholder="ORGANISASI & EKSTRAKURIKULER:" value={expForm.bulletsHeader} onChange={(e) => setExpForm({ ...expForm, bulletsHeader: e.target.value })} className="w-full border-2 border-black rounded p-2 text-black focus:outline-none" />
                </div>

                {/* Card 1 */}
                <div className="p-3 bg-neutral-50 border border-black rounded-lg space-y-2">
                  <span className="font-bold text-[9px] text-neutral-400 block">// DATA SUB-KARTU 1 (OPSIONAL)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Judul (e.g. OSIS)" value={expForm.card1_title} onChange={(e) => setExpForm({ ...expForm, card1_title: e.target.value })} className="col-span-2 border border-black rounded p-1 bg-white" />
                    <input type="text" placeholder="Durasi (2024)" value={expForm.card1_period} onChange={(e) => setExpForm({ ...expForm, card1_period: e.target.value })} className="col-span-1 border border-black rounded p-1 bg-white" />
                  </div>
                  <input type="text" placeholder="Deskripsi peranan sub-kartu..." value={expForm.card1_desc} onChange={(e) => setExpForm({ ...expForm, card1_desc: e.target.value })} className="w-full border border-black rounded p-1 bg-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={expForm.card1_bg} onChange={(e) => setExpForm({ ...expForm, card1_bg: e.target.value })} className="border border-black rounded p-1 bg-white">
                      <option value="bg-retro-yellow">Kuning</option>
                      <option value="bg-retro-pink">Merah Muda</option>
                      <option value="bg-retro-lime">Lime</option>
                      <option value="bg-retro-blue">Biru</option>
                    </select>
                    <select value={expForm.card1_icon} onChange={(e) => setExpForm({ ...expForm, card1_icon: e.target.value })} className="border border-black rounded p-1 bg-white">
                      <option value="pen">Pensil (OSIS)</option>
                      <option value="video">Kamera (Media)</option>
                      <option value="code">Code</option>
                      <option value="trophy">Trophy</option>
                    </select>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-3 bg-neutral-50 border border-black rounded-lg space-y-2">
                  <span className="font-bold text-[9px] text-neutral-400 block">// DATA SUB-KARTU 2 (OPSIONAL)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Judul" value={expForm.card2_title} onChange={(e) => setExpForm({ ...expForm, card2_title: e.target.value })} className="col-span-2 border border-black rounded p-1 bg-white" />
                    <input type="text" placeholder="Durasi" value={expForm.card2_period} onChange={(e) => setExpForm({ ...expForm, card2_period: e.target.value })} className="col-span-1 border border-black rounded p-1 bg-white" />
                  </div>
                  <input type="text" placeholder="Deskripsi peranan sub-kartu..." value={expForm.card2_desc} onChange={(e) => setExpForm({ ...expForm, card2_desc: e.target.value })} className="w-full border border-black rounded p-1 bg-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={expForm.card2_bg} onChange={(e) => setExpForm({ ...expForm, card2_bg: e.target.value })} className="border border-black rounded p-1 bg-white">
                      <option value="bg-retro-pink">Merah Muda</option>
                      <option value="bg-retro-yellow">Kuning</option>
                      <option value="bg-retro-lime">Lime</option>
                      <option value="bg-retro-blue">Biru</option>
                    </select>
                    <select value={expForm.card2_icon} onChange={(e) => setExpForm({ ...expForm, card2_icon: e.target.value })} className="border border-black rounded p-1 bg-white">
                      <option value="video">Kamera (Media)</option>
                      <option value="pen">Pensil (OSIS)</option>
                      <option value="code">Code</option>
                      <option value="trophy">Trophy</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#A3E635] text-black border-2 border-black rounded font-bold py-2.5 text-xs uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer">SIMPAN_PENGALAMAN.EXE</button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
         MODAL FORM DIALOG: HARD SKILL EDITOR
         ────────────────────────────────────────────────────────────────────────── */}
      {isHardSkillModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-2xl w-full max-w-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-retro-orange border-b-3 border-black text-white">
              <span className="font-bold text-xs uppercase">{editingHardSkill ? "⚙️ EDIT_HARD_SKILL.EXE" : "➕ ADD_HARD_SKILL.EXE"}</span>
              <button onClick={() => setIsHardSkillModalOpen(false)} className="bg-white text-black border border-black p-0.5 rounded cursor-pointer"><Close className="w-3.5 h-3.5 block" /></button>
            </div>
            <form onSubmit={handleHardSkillSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-bold">NAMA TEKNOLOGI / SKILL:</label>
                <input type="text" required placeholder="E.g., Next.js / React" value={hardSkillForm.name} onChange={(e) => setHardSkillForm({ ...hardSkillForm, name: e.target.value })} className="w-full border-2 border-black rounded p-1.5 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block font-bold">KELOMPOK KATEGORI:</label>
                <select value={hardSkillForm.category} onChange={(e) => setHardSkillForm({ ...hardSkillForm, category: e.target.value as any })} className="w-full border-2 border-black rounded p-1.5 bg-white focus:outline-none">
                  <option value="DEVELOPMENT">DEVELOPMENT (BAHASA/FRAMEWORK)</option>
                  <option value="TOOLS">TOOLS &amp; PLATFORMS (TOOLS)</option>
                  <option value="MULTIMEDIA">MULTIMEDIA PRODUCTION</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold">IKON KARTU FLOPPY:</label>
                  <select value={hardSkillForm.icon} onChange={(e) => setHardSkillForm({ ...hardSkillForm, icon: e.target.value })} className="w-full border-2 border-black rounded p-1.5 bg-white focus:outline-none">
                    <option value="computer">Computer</option>
                    <option value="script">Script Document</option>
                    <option value="cpu">CPU Processor</option>
                    <option value="database">Database</option>
                    <option value="gitbranch">Git Branch</option>
                    <option value="terminal">CLI Terminal</option>
                    <option value="cloudserver">Cloud Server</option>
                    <option value="globe">Globe Website</option>
                    <option value="video">Video Cam</option>
                    <option value="camera">Photo Camera</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">WARNA SLIDER KARTU:</label>
                  <select value={hardSkillForm.colorClass} onChange={(e) => setHardSkillForm({ ...hardSkillForm, colorClass: e.target.value })} className="w-full border-2 border-black rounded p-1.5 bg-white focus:outline-none">
                    <option value="bg-retro-orange">Orange</option>
                    <option value="bg-retro-lime">Lime Green</option>
                    <option value="bg-retro-pink">Pink</option>
                    <option value="bg-retro-yellow">Yellow</option>
                    <option value="bg-retro-blue">Blue</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#A3E635] text-black border-2 border-black rounded font-bold py-2 text-xs uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] cursor-pointer mt-2">SIMPAN_HARDSKILL.EXE</button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
         MODAL FORM DIALOG: SOFT SKILL EDITOR
         ────────────────────────────────────────────────────────────────────────── */}
      {isSoftSkillModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-2xl w-full max-w-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-retro-blue border-b-3 border-black text-white">
              <span className="font-bold text-xs uppercase">{editingSoftSkill ? "⚙️ EDIT_SOFT_SKILL.EXE" : "➕ ADD_SOFT_SKILL.EXE"}</span>
              <button onClick={() => setIsSoftSkillModalOpen(false)} className="bg-white text-black border border-black p-0.5 rounded cursor-pointer"><Close className="w-3.5 h-3.5 block" /></button>
            </div>
            <form onSubmit={handleSoftSkillSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-bold">NAMA KEMAMPUAN (.SYS / .LOG):</label>
                <input type="text" required placeholder="E.g., leadership.exe" value={softSkillForm.title} onChange={(e) => setSoftSkillForm({ ...softSkillForm, title: e.target.value })} className="w-full border-2 border-black rounded p-1.5 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block font-bold">DESKRIPSI HABILITAS:</label>
                <textarea required rows={3} placeholder="Ceritakan bagaimana Anda mengaplikasikan kemampuan ini..." value={softSkillForm.description} onChange={(e) => setSoftSkillForm({ ...softSkillForm, description: e.target.value })} className="w-full border-2 border-black rounded p-1.5 focus:outline-none resize-none" />
              </div>
              <div className="space-y-1">
                <label className="block font-bold">WARNA NOTE STICKER:</label>
                <select value={softSkillForm.bgColor} onChange={(e) => setSoftSkillForm({ ...softSkillForm, bgColor: e.target.value })} className="w-full border-2 border-black rounded p-1.5 bg-white focus:outline-none">
                  <option value="bg-retro-yellow">Kuning</option>
                  <option value="bg-retro-pink">Merah Muda</option>
                  <option value="bg-retro-lime">Lime Green</option>
                  <option value="bg-retro-blue">Biru (Teks Putih)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#3B82F6] text-white border-2 border-black rounded font-bold py-2 text-xs uppercase shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] cursor-pointer mt-2">SIMPAN_SOFTSKILL.EXE</button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
