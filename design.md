````markdown
# 🛠️ Panduan Desain & Spesifikasi Sistem UI: Portfolio "jq works" (jackqqq)

Dokumen ini merupakan spesifikasi teknis dan visual final untuk membangun website portfolio pribadi **jq works (jackqqq)** menggunakan **Next.js (App Router)**, **Tailwind CSS**, dan **Framer Motion**.

---

## 1. Visi Desain & Identitas Branding

Desain ini menggabungkan aliran **Neo-Brutalisme** dengan **Retro OS/Arcade UI**. Tujuannya adalah menciptakan pengalaman digital yang sangat interaktif, membekas di ingatan pengunjung, dan menonjolkan keahlian pengembangan web modern berselimut estetika retro.

- **Nama Branding:** `jq works` / `jackqqq.sys`
- **Slogan:** _"We build things that click. No boring grids allowed."_
- **Tone & Voice:** Santai, percaya diri, antusias, sedikit bernuansa dunia peretasan/komputer klasik (geeky but cool).
- **Konsep Desain:** "Digital Laboratory Desktop"—mengubah halaman web biasa menjadi ruang kerja virtual interaktif tempat pengunjung dapat "bermain".

---

## 2. Palet Warna Neo-Brutalis (Design Tokens)

Warna-warna yang digunakan memiliki tingkat kejenuhan (_saturation_) tinggi untuk memberikan kontras yang berani di atas warna dasar kertas hangat.

| Token Warna                 | Kode Hex  | Utilitas Tailwind | Penggunaan Utama                                 |
| :-------------------------- | :-------- | :---------------- | :----------------------------------------------- |
| **Warm Paper** (Latar)      | `#F4F0EC` | `bg-[#F4F0EC]`    | Latar belakang kanvas website                    |
| **Retro Orange** (Aksen 1)  | `#FF5C00` | `bg-[#FF5C00]`    | Branding utama, highlight penting, tombol primer |
| **Retro Yellow** (Aksen 2)  | `#FACC15` | `bg-yellow-400`   | Ticker marquee, status badge, aksen stiker       |
| **Retro Blue** (Aksen 3)    | `#3B82F6` | `bg-blue-500`     | Header jendela aplikasi (OS Window header)       |
| **Retro Lime** (Status)     | `#A3E635` | `bg-lime-400`     | Indikator aktif, tombol sukses, tautan proyek    |
| **Retro Pink** (Stiker)     | `#F472B6` | `bg-pink-400`     | Aksen stiker cinta, hiasan melayang              |
| **Solid Black** (Tepi/Teks) | `#000000` | `text-black`      | Garis tepi tebal, bayangan tajam, teks utama     |

### Aturan Batas & Bayangan (Borders & Shadows):

- **Garis Tepi:** Harus tebal, solid, dan berwarna hitam.
  - Tailwind: `border-[3px] border-black` atau `border-4 border-black`.
- **Bayangan (Hard Shadow):** Tidak menggunakan blur. Menggunakan pergeseran koordinat solid 90 derajat.
  - Tailwind: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` atau `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`.
  - Efek Klik: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`.

---

## 3. Aturan Desain "Anti-Kaku"

Agar gaya Retro Neo-Brutalisme tidak terasa membosankan dan kaku, terapkan 4 aturan emas berikut secara konsisten:

1. **Rotasi Organik (Asymmetric Angles):**
   Miringkan elemen-elemen dekoratif secara halus (antara -3% hingga 3%) menggunakan utilitas rotate Tailwind.
   - Contoh: `rotate-1`, `-rotate-2`, `rotate-[3deg]`.
2. **Kursor Kustom & Jejak Bintang (Cursor Trail):**
   Gunakan kursor piksel retro kustom dan buat sistem partikel bintang piksel mini yang muncul secara acak setiap kali kursor digerakkan untuk meningkatkan retensi interaksi pengunjung.
3. **Stiker Piksel Melayang (Floating Elements):**
   Tempatkan stiker pixel art SVG di sudut-sudut kosong layar dengan animasi mengapung lambat (_floating animation_) yang tidak berbarengan.
4. **Sudut Membulat yang Halus (Softened Corners):**
   Gunakan border-radius kecil pada kotak tebal untuk mengurangi kekakuan ekstrem.
   - Rekomendasi Tailwind: `rounded-lg` atau `rounded-xl` (hindari sudut tajam 90 derajat murni pada modul utama).

---

## 4. Sistem Animasi & Efek Scroll (Framer Motion)

Animasi dirancang dengan nuansa "snappy" (cepat dan memantul) alih-alih transisi lembut yang lambat.

### A. Konfigurasi Spring (Framer Motion)

Gunakan nilai stiffness tinggi dan damping sedang untuk menghasilkan efek pantulan retro yang memuaskan:

```javascript
export const retroSpring = {
  type: "spring",
  stiffness: 180,
  damping: 12,
  mass: 0.9,
};
```
````

### B. Scroll-Reveal (Muncul Saat Scroll)

Terapkan efek _pop-up_ cepat ketika komponen memasuki layar menggunakan `IntersectionObserver` atau properti `whileInView` di Framer Motion:

```jsx
import { motion } from "framer-motion";

export function ScrollRevealBox({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={retroSpring}
      className="bg-white border-[3px] border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Komponen Kunci Interaktif

### A. Jendela OS yang Bisa Digeser (Draggable Window Component)

Komponen jendela menyerupai antarmuka desktop Windows 95/Mac Classic yang dapat digeser secara bebas oleh pengunjung di atas "meja kerja virtual".

```jsx
import { motion } from "framer-motion";
import { useRef } from "react";

export function DesktopWindow({
  title,
  children,
  colorClass = "bg-retro-blue",
}) {
  const constraintsRef = useRef(null);

  return (
    <div
      ref={constraintsRef}
      className="relative w-full h-[400px] border-2 border-black rounded"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="absolute w-72 bg-white border-[3px] border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-15"
      >
        <div
          className={`px-3 py-1.5 ${colorClass} text-white border-b-[3px] border-black flex justify-between items-center cursor-grab active:cursor-grabbing`}
        >
          <span className="font-mono text-xs font-bold">{title}</span>
          <div className="w-4 h-4 bg-red-400 border border-black rounded flex items-center justify-center text-[10px] text-black font-bold">
            ×
          </div>
        </div>
        <div className="p-4 text-black font-sans text-sm">{children}</div>
      </motion.div>
    </div>
  );
}
```

### B. Buku Tamu Meja Kerja Virtual (Sticky Notes Guestbook)

Sebuah papan tulis virtual (`#guestbook-desk`) tempat pengunjung mengirimkan pesan singkat kustom. Pesan akan dicetak ke dalam komponen kartu yang miring secara acak, berwarna kontras, dan dapat digeser-geser sesuka hati di area koordinat papan kerja tersebut.

---

## 6. Sistem Suara Retro 8-Bit (Audio Engine)

Efek suara mikro (_micro-interactions sound_) membuat website terasa nyata. Gunakan library `use-sound` di React atau manfaatkan Web Audio API asli agar tidak membebani performa jaringan dengan unduhan file eksternal (.mp3).

```javascript
// Web Audio API Retro Sound Generator
export function playSynthSound(
  type = "triangle",
  frequency = 220,
  duration = 0.1,
) {
  if (typeof window === "undefined") return;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  // Retro click envelope: Instant attack, exponential decay
  gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration,
  );

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}
```

### Panduan Pemicu Bunyi:

- **Tombol Klik Standar:** Mainkan frekuensi `220Hz` (tipe `triangle`, durasi `0.08` detik).
- **Efek Muncul (Reveal/Spawn):** Mainkan frekuensi menanjak dari `300Hz` ke `1200Hz` (tipe `sine`, durasi `0.15` detik).
- **Pemicu Scroll Baru:** Bunyi gelembung pop ringan `600Hz` ke `800Hz` (tipe `sine`, durasi `0.08` detik) untuk memberi tanda audio bahwa ada hal baru yang dibaca.

---

## 7. Rekomendasi Library Ikon & Integrasi Piksel

Agar visual tetap tajam pada resolusi layar tinggi, hindari gambar PNG berukuran kecil. Gunakan aset berbasis vektor SVG atau pustaka ikon piksel berikut:

1. **`pixelarticons`:** Ikon minimalis berskala piksel 24x24 yang sangat cocok untuk indikator UI standar.
2. **`NES.css Icons`:** Sangat baik untuk menampilkan ornamen bertema gaming klasik seperti ikon nyawa hati (heart) dan koin.
3. **Custom Inline SVGs:** Untuk performa terbaik, buat ikon custom menggunakan elemen `<rect>` (persegi piksel) SVG mandiri untuk memastikan ketajaman tepi yang sempurna (_crisp-edges_).

### Konfigurasi Global CSS untuk Rendering Gambar Piksel:

Tambahkan aturan CSS ini di file `app/globals.css` Next.js agar aset ikon piksel Anda dirender tajam tanpa efek buram (anti-aliasing) di layar Retina/4K:

```css
@layer utilities {
  .pixelated {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
}
```

---

## 8. Struktur Blueprint Halaman Utama (Bento Grid)

Gunakan sistem grid dinamis yang responsif di mana struktur kotak bento-nya berubah secara adaptif sesuai lebar layar ponsel dan desktop:

```
+-----------------------------------------------------------------+
|                         [jq_works] Navbar                       |
+------------------------------------+----------------------------+
|                                    |                            |
|             HERO BOX               |         AVATAR /           |
|   "Hi! I'm jackqqq. We build       |     PIXEL ART WINDOW       |
|    websites that pop!"             |   (Draggable & Rotated)    |
|                                    |                            |
+------------------------------------+----------------------------+
|                                                                 |
|                    INFINITE MARQUEE TICKER                      |
|                                                                 |
+--------------------+---------------------+----------------------+
|                    |                     |                      |
|    PROJECT BOX 1   |    PROJECT BOX 2    |    STATS / TECH      |
|    (OS Windows v1) |    (OS Windows v2)  |   Interactive Tags   |
|                    |                     |                      |
+--------------------+---------------------+----------------------+
|                                                                 |
|                INTERACTIVE GUESTBOOK & CONTACT                  |
|          "Leave a pixel message on jackqqq's desk!"             |
|                                                                 |
+-----------------------------------------------------------------+

```

---

## 9. Langkah Implementasi Next.js 14/15

1. **Inisialisasi Project:**

```bash
npx create-next-app@latest jq-works-portfolio --typescript --tailwind --app

```

2. **Instalasi Library Pendukung:**

```bash
npm install framer-motion pixelarticons use-sound canvas-confetti

```

3. **Aktifkan Fitur Suara Secara Ramah Pengguna:**
   Selalu buat state `soundEnabled` (default `true` atau `false`) yang tersimpan di dalam `localStorage` atau `state` aplikasi global, lengkap dengan tombol toggle berikon speaker 🔊/🔇 di navigasi utama agar pengunjung memiliki kendali penuh atas kenyamanan berselancar mereka.

```

```
