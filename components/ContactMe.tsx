"use client";

import React, { useState } from "react";
import { Mail, Globe, ArrowRight } from "pixelarticons/react";
import { FaWhatsapp } from "react-icons/fa6";
import { playSynthSound, playPowerUp, playError, playKeypress } from "@/lib/audio";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactMe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      playError();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setEmail("");
      setMessage("");
      playPowerUp();
    }, 1500);
  };

  return (
    <section id="kontak" className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24 mb-12 select-none">
      
      {/* TITLE SECTION */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex items-center gap-3 sm:gap-4 mb-10">
          <div className="bg-retro-blue text-white p-3 border-[3px] border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
            <Mail className="w-8 h-8 block text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-pixel text-[8px] tracking-widest text-neutral-500">KONEKSI SISTEM</span>
            <h2 className="font-syne text-lg xs:text-xl sm:text-3xl md:text-4xl font-extrabold text-black uppercase mt-1 break-words">
              CONNECT_
              <br className="sm:hidden" />
              TERMINAL.IN
            </h2>
          </div>
        </div>
      </ScrollReveal>

      {/* MAIN BENTO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* KOLOM KIRI: TERMINAL PROMPT */}
        <ScrollReveal direction="right" delay={0.2} className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-black border-[4px] border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full relative">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b-[3px] border-black shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 border border-black rounded-full"></div>
                <span className="font-mono text-[11px] font-bold text-white">jq_works_prompt.exe</span>
              </div>
              <span className="bg-black text-retro-lime px-2 py-0.5 rounded text-[8px] font-mono border border-neutral-700">ONLINE</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col justify-between flex-1 gap-6 font-mono text-xs text-retro-lime">
              <div className="space-y-4">
                <div className="text-neutral-400 leading-relaxed">
                  Microsoft Windows [Version 10.0.JQ-WORKS]<br />
                  (c) JQ Works Corporation. Menerima pengiriman pesan proyek digital.<br />
                  <span className="text-retro-yellow">C:\Users\Guest&gt; initialize_contact_form</span>
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-white text-[13px]">&gt; ENTER_YOUR_EMAIL:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={() => playKeypress()} placeholder="nama@email.com" className="w-full bg-neutral-900 border-2 border-neutral-700 rounded p-3 text-white placeholder-neutral-600 outline-none focus:border-retro-lime font-mono text-xs transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-white text-[13px]">&gt; WRITE_MESSAGE_DATA:</label>
                  <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={() => playKeypress()} placeholder="Ketik detail rencana proyek atau pesanmu di sini..." className="w-full bg-neutral-900 border-2 border-neutral-700 rounded p-3 text-white placeholder-neutral-600 outline-none focus:border-retro-lime font-mono text-xs resize-none transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full md:w-auto self-end px-6 py-2.5 bg-retro-lime text-black border-[3px] border-black rounded font-mono font-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2">
                {isSubmitting ? "TRANSMITTING_DATA..." : "EXECUTE_SEND_COMMAND [Enter]"}
                <ArrowRight className="w-4 h-4 text-black block" />
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* KOLOM KANAN: DIGITAL HUB */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4">
          
          {/* Info Card Atas */}
          <ScrollReveal direction="left" delay={0.3} className="flex-1">
            <div className="bg-retro-pink border-[3px] border-black rounded-lg p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="font-pixel text-[6px] bg-black text-white px-1.5 py-0.5 rounded border border-white">HQ_MALANG</span>
                <span className="font-mono text-xs font-bold text-black">// JQ WORKS HUB</span>
              </div>
              <h3 className="font-syne text-xl font-black uppercase text-black leading-tight mb-2">
                Mari Bangun Solusi Digital Bersama!
              </h3>
              <p className="font-sans text-xs font-semibold text-neutral-800 leading-relaxed">
                Punya ide startup, butuh pengembangan sistem website <span className="font-extrabold">full-stack</span>, atau kebutuhan live streaming media partner untuk event besar? Hubungi saya kapan saja untuk mendiskusikan kolaborasi taktis.
              </p>
            </div>
            <div className="pt-3 border-t border-dashed border-black/30 mt-3 flex items-center gap-2 font-mono text-[10px] font-bold text-black">
              <Globe className="w-3.5 h-3.5 block text-black" />
              <span>STAY_CONNECTED_ALWAYS</span>
            </div>
          </div>
          </ScrollReveal>

          {/* WhatsApp CTA */}
          <ScrollReveal direction="left" delay={0.4}>
<a
  href="https://wa.me/6285111232385"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    if (typeof playSynthSound === "function") {
      playSynthSound("square", 392, 0.1);
    }
  }}
  style={{
    backgroundColor: "#25D366",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "between",
    opacity: 1,
    visibility: "visible"
  }}
  className="w-full p-4 border-[4px] border-black rounded-[20px] !bg-[#25D366] !text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between !no-underline group shrink-0 relative z-20"
>
  {/* SISI KIRI: IKON DAN TEKS UTAMA */}
  <div className="flex items-center gap-3 font-mono text-sm font-black !text-white" style={{ color: "#ffffff" }}>
    <FaWhatsapp size={22} className="!text-white shrink-0 group-hover:scale-110 transition-transform duration-200" style={{ color: "#ffffff" }} />
    <span className="uppercase tracking-wide !text-white block" style={{ color: "#ffffff", display: "block" }}>
      LAUNCH_WHATSAPP_CHAT
    </span>
  </div>

  {/* SISI KANAN: BADGE LIVE */}
  <span 
    style={{ backgroundColor: "#000000", color: "#25D366" }}
    className="font-mono text-[10px] font-black !bg-black !text-[#25D366] px-3 py-1.5 rounded-xl border-2 border-black uppercase tracking-wide shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap block shrink-0"
  >
    LIVE ↗
  </span>
</a>
          </ScrollReveal>

        </div>
      </div>

    </section>
  );
}