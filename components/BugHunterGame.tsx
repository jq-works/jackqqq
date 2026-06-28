"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSynthSound } from "@/lib/audio";
import { Cpu, Trophy, Play, Reload } from "pixelarticons/react";

interface Bug {
  id: number;
  x: number;
  y: number;
}

export default function BugHunterGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [bugs, setBugs] = useState<Bug[]>([]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("bughunter_highscore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft === 0) {
      setIsPlaying(false);
      setBugs([]);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("bughunter_highscore", score.toString());
      }
      if (typeof playSynthSound === "function") {
        playSynthSound("square", 220, 0.2);
        setTimeout(() => playSynthSound("square", 165, 0.3), 150);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 40;
        const height = containerRef.current.clientHeight - 40;
        
        const newBug: Bug = {
          id: Date.now(),
          x: Math.max(10, Math.floor(Math.random() * width)),
          y: Math.max(10, Math.floor(Math.random() * height)),
        };

        setBugs((prev) => [...prev.slice(-2), newBug]);
      }
    }, 700);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    setBugs([]);
    if (typeof playSynthSound === "function") {
      playSynthSound("sine", 523.25, 0.1);
    }
  };

  const handleBugHit = (id: number) => {
    setScore((prev) => prev + 1);
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    if (typeof playSynthSound === "function") {
      playSynthSound("triangle", 880, 0.05);
    }
  };

  return (
    <section id="mini-game" className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24 select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* PANEL KIRI: SCOREBOARD */}
        <div className="lg:col-span-4 bg-white border-3 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-6 font-mono text-xs text-black">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-retro-orange animate-spin" />
              <span className="font-bold text-sm tracking-tight uppercase">BUG_HUNTER.EXE</span>
            </div>
            <p className="text-neutral-500 leading-relaxed mb-6">
              Sistem inti sedang diserang oleh serangga kode digital! Bantu bersihkan tumpukan bug sebelum waktu kompilasi habis.
            </p>

            <div className="space-y-3 bg-neutral-100 p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center font-bold">
                <span>TIME_LEFT:</span>
                <span className={`text-sm ${timeLeft <= 5 ? "text-red-500 animate-pulse font-black" : "text-black"}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>CURRENT_SCORE:</span>
                <span className="text-sm text-retro-blue font-black">{score}</span>
              </div>
              <div className="flex justify-between items-center font-bold border-t border-dashed border-neutral-300 pt-2">
                <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-[#eab308]" /> HIGH_SCORE:</span>
                <span className="text-sm font-black text-[#eab308]">{highScore}</span>
              </div>
            </div>
          </div>

          {!isPlaying ? (
            <button
              onClick={startGame}
              className="w-full py-3 bg-retro-lime text-black font-syne font-black text-sm border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" /> START_COMPILING [RUN]
            </button>
          ) : (
            <div className="w-full py-3 bg-neutral-900 text-retro-lime font-bold border-3 border-black rounded-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse uppercase tracking-widest">
              // CLEANING_SYSTEMS...
            </div>
          )}
        </div>

        {/* PANEL KANAN: CANVAS MONITOR */}
        <div className="lg:col-span-8 bg-neutral-900 border-4 border-black rounded-2xl h-[340px] md:h-[400px] overflow-hidden relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          
          <div className="w-full bg-neutral-800 border-b-[3px] border-black px-4 py-1.5 flex items-center justify-between font-mono text-[10px] text-white shrink-0 relative z-10">
            <span className="font-bold opacity-75">sandbox_workspace.env</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 border border-black rounded-full"></div>
            </div>
          </div>

          <div 
            ref={containerRef} 
            className="w-full h-[calc(100%-35px)] bg-[#1e1e2e] relative overflow-hidden bg-[linear-gradient(to_right,#2a2b3c_1px,transparent_1px),linear-gradient(to_bottom,#2a2b3c_1px,transparent_1px)] bg-[size:20px_20px]"
          >
            <AnimatePresence>
              {isPlaying && bugs.map((bug) => (
                <motion.button
                  key={bug.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={() => handleBugHit(bug.id)}
                  style={{ left: bug.x, top: bug.y }}
                  className="absolute w-10 h-10 bg-retro-pink border-3 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-90 cursor-crosshair z-20 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="text-black group-hover:rotate-12 transition-transform">
                    <path d="M12 3v18M6 9h12M6 15h12M3 12h18" />
                  </svg>
                </motion.button>
              ))}
            </AnimatePresence>

            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center px-4 font-mono">
                <span className="font-syne text-xs xs:text-sm sm:text-base md:text-lg font-black text-white tracking-wide uppercase mb-1">
                  SYSTEM_SANDBOX_READY
                </span>
                <p className="text-[11px] text-neutral-400 font-bold max-w-sm leading-relaxed mb-4">
                  Klik tombol start untuk memulai. Ketuk bug serangga merah muda secepat mungkin sebelum menghilang otomatis dari layar!
                </p>
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-white text-black font-bold border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(163,230,53,1)] hover:bg-neutral-50 flex items-center gap-2 text-xs"
                >
                  {/* FIX: Menggunakan ikon Reload yang valid dari paket pixelarticons */}
                  <Reload className="w-4 h-4 text-black" /> EXECUTE_GAME.SH
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}