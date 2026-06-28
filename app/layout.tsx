import type { Metadata } from "next";
import SystemHeader from "@/components/SystemHeader";
import SystemFooter from "@/components/SystemFooter";
import CursorTrail from "@/components/CursorTrail";
import "./globals.css";

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
      <head>
        {/* Mengimpor core icon NES.css secara aman tanpa reset global */}
        <link href="https://unpkg.com/nes.css@2.3.0/css/nes-core.min.css" rel="stylesheet" />
      </head>
      <body
        className="bg-retro-bg text-black antialiased retro-grid min-h-screen flex flex-col justify-between font-sans"
      >
        {/* Efek partikel jejak kursor */}
        <CursorTrail />

        {/* Struktur Navigasi Utama */}
        <SystemHeader />
        
        <div className="flex-1 w-full">
          {children}
        </div>

        <SystemFooter />
      </body>
    </html>
  );
}