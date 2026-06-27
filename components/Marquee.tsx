import React from "react";

export default function Marquee() {
  const teks = "✦ JQ WORKS (JACKQQQ) PORTFOLIO ✦ DESIGNED & DEVELOPED IN NEXTJS + TAILWIND ✦ AVAILABLE FOR FREELANCE & COLLABORATION ✦ ";

  return (
    <div className="w-full overflow-hidden bg-retro-yellow border-y-3 border-black py-3.5 my-12 flex whitespace-nowrap -rotate-1 relative z-10 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex text-base font-mono font-extrabold uppercase tracking-widest text-black animate-marquee">
        <span>{teks} {teks}</span>
      </div>
    </div>
  );
}