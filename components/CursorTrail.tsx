"use client";

import React, { useEffect } from "react";

export default function CursorTrail() {
  useEffect(() => {
    const particleColors = ["#FF5C00", "#FACC15", "#A3E635", "#3B82F6", "#F472B6"];

    const handleMouseMove = (e: MouseEvent) => {
      // Kendalikan laju kemunculan partikel secara acak agar tidak membebani memori
      if (Math.random() > 0.15) return;

      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";
      particle.style.left = `${e.pageX - 6}px`;
      particle.style.top = `${e.pageY - 6}px`;
      particle.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";

      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      
      // Menggunakan SVG Bintang Piksel Murni 8-Bit
      particle.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 8 8" fill="${color}">
          <rect x="3" y="1" width="2" height="1"/>
          <rect x="2" y="2" width="4" height="1"/>
          <rect x="1" y="3" width="6" height="1"/>
          <rect x="0" y="4" width="8" height="1"/>
          <rect x="1" y="5" width="6" height="1"/>
          <rect x="2" y="6" width="4" height="1"/>
          <rect x="3" y="7" width="2" height="1"/>
        </svg>
      `;

      document.body.appendChild(particle);

      // Trigger animasi menyusut dan memudar
      setTimeout(() => {
        const randX = (Math.random() - 0.5) * 40;
        const randY = (Math.random() - 0.5) * 40;
        particle.style.transform = `translate(${randX}px, ${randY}px) scale(0.1) rotate(${Math.random() * 360}deg)`;
        particle.style.opacity = "0";
      }, 20);

      // Pembersihan elemen dari DOM
      setTimeout(() => {
        particle.remove();
      }, 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null; // Komponen ini hanya memanipulasi efek DOM secara global
}