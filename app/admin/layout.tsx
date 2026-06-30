"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { playSynthSound, playClick, playError } from "@/lib/audio";
import { Close } from "pixelarticons/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Ambil session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Dengarkan perubahan status autentikasi
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      if (typeof playError === "function") playError();
      return setErrorMsg("Email dan Password tidak boleh kosong!");
    }

    setSubmitting(true);
    setErrorMsg(null);
    if (typeof playClick === "function") playClick("mid");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    setSubmitting(false);

    if (error) {
      if (typeof playError === "function") playError();
      setErrorMsg(error.message || "Gagal masuk! Kredensial tidak valid.");
    } else {
      // Bunyi sukses (akord retro naik gembira)
      if (typeof playSynthSound === "function") {
        playSynthSound("sine", 523.25, 0.06); 
        setTimeout(() => playSynthSound("sine", 659.25, 0.06), 60); 
        setTimeout(() => playSynthSound("sine", 783.99, 0.12), 120); 
      }
    }
  };

  // 1. LOADING SCREEN OS RETRO
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-retro-bg)] flex flex-col items-center justify-center font-mono text-xs text-neutral-400 select-none p-6">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <span>// SENSING_AUTH_STATE_DEVICES...</span>
          <div className="w-48 bg-neutral-200 border-2 border-black rounded-full h-4 overflow-hidden relative shadow-inner">
            <div className="h-full bg-black animate-[marquee_2s_linear_infinite]" style={{ width: '40%' }} />
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER OVERLAY LOGIN RETRO JIKA TIDAK ADA SESI AKTIF
  if (!session) {
    return (
      <div className="min-h-screen bg-[var(--color-retro-bg)] flex items-center justify-center p-6 select-none font-mono">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, mass: 0.9 }}
          className="max-w-md w-full bg-white border-[3px] border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          {/* Header Jendela Auth */}
          <div className="bg-[var(--color-retro-orange)] px-4 py-2.5 border-b-[3px] border-black flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full border border-black bg-red-500" />
              <span className="font-bold text-[10px] tracking-widest uppercase">SYS_AUTHENTICATOR.EXE</span>
            </div>
            <span className="font-bold text-[9px] uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black animate-pulse">
              [!] LOCKED
            </span>
          </div>

          {/* Form Login Body */}
          <div className="p-6">
            <div className="mb-6">
              <span className="text-[10px] text-neutral-400 font-bold block mb-1">// SECURITY_ACCESS_CONTROL</span>
              <h2 className="font-syne text-2xl font-black text-black uppercase">ADMIN LOGIN</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-black text-neutral-500 mb-1.5">// EMAIL_ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="admin@portfolio.sys"
                  className="w-full border-[3px] border-black p-3 rounded-lg bg-neutral-50 font-bold focus:outline-none focus:bg-white text-xs transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-black text-neutral-500 mb-1.5">// KEY_PASSWORD</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full border-[3px] border-black p-3 rounded-lg bg-neutral-50 font-bold focus:outline-none focus:bg-white text-xs transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 border-2 border-black bg-red-50 text-red-600 rounded text-[10px] font-bold flex items-center justify-between"
                  >
                    <span>⚠️ ERROR: {errorMsg.toUpperCase()}</span>
                    <button type="button" onClick={() => setErrorMsg(null)} className="text-red-600 hover:scale-110 transition-transform">
                      <Close className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[var(--color-retro-orange)] text-white border-[3px] border-black font-black uppercase text-xs rounded-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-orange-600 transition-all cursor-pointer disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
              >
                {submitting ? "AUTHENTICATING..." : "ENTER_DASHBOARD ↵"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. RENDER CONTENT JIKA SUDAH LOGGED IN
  return <>{children}</>;
}
