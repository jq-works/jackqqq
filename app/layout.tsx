import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, Space_Mono, Press_Start_2P } from "next/font/google";
import SystemHeader from "@/components/SystemHeader";
import SystemFooter from "@/components/SystemFooter";
import CursorTrail from "@/components/CursorTrail";
import "./globals.css";

// 1. PASTIKAN SELURUH FONT INI SUDAH DIINISIALISASI DI LUAR KOMPONEN ROOTLAYOUT
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta" 
});

const syne = Syne({ 
  subsets: ["latin"], 
  variable: "--font-syne" 
});

const spaceMono = Space_Mono({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-space-mono" 
});

const pressStart = Press_Start_2P({ 
  weight: ["400"], 
  subsets: ["latin"], 
  variable: "--font-press-start" 
});

export const metadata: Metadata = {
  title: "jq works // jackqqq - Interactive Pixel Portfolio",
  description: "Neo-Brutalist & Retro OS Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${jakarta.variable} ${syne.variable} ${spaceMono.variable} ${pressStart.variable} bg-retro-bg text-black antialiased font-sans selection:bg-retro-orange selection:text-white retro-grid min-h-screen flex flex-col justify-between`}
      >
        {/* Aktivasi Jejak Bintang Piksel */}
        <CursorTrail />

        {/* Navigasi Global Sistem */}
        <SystemHeader />

        {/* Konten Dinamis Halaman (Page Content) */}
        <div className="flex-1 w-full">
          {children}
        </div>

        {/* Log Aktivitas & Footer Global */}
        <SystemFooter />
      </body>
    </html>
  );
}