---
name: stitch
description: End-to-end design-to-code workflow bridging Google Stitch MCP (screen generation, design systems, variants, and DESIGN.md synchronization) with full-stack-skills/react-skills (modular React 19 / Next.js 15 App Router slicing, React Hooks, TypeScript, Clean Code, and token-based styling). Use whenever the user wants to generate UI screens in Stitch, align designs with design.md, or slice Stitch designs into clean, modular React/Next.js components.
---

# Stitch & Full-Stack React Workflow Guide

Panduan komprehensif untuk mengintegrasikan **Google Stitch MCP** dengan standar **`full-stack-skills/react-skills`** guna menghasilkan komponen React dan Next.js (App Router) yang *clean code*, modular, *type-safe*, dan konsisten dengan sistem desain (`design.md`).

---

## 1. Arsitektur & Prinsip Utama

Workflow ini menggabungkan dua ekosistem:
1. **Google Stitch (Design & Layout Generator)**:
   - Membuat *screen* baru dari deskripsi teks dan *prompt engineering* UI/UX.
   - Mengelola dan menyinkronkan token desain melalui `design.md` dan Stitch Design System.
   - Mengaudit visual dan *layout breakdown* dari hasil generasi Stitch.
2. **Full-Stack React Skills (`full-stack-skills/react-skills`)**:
   - **Clean Code & Modularity**: Memecah halaman menjadi komponen atomik dan molekuler (Cards, Badges, Modals, Navbar, Canvas). Dilarang membuat file halaman monolitik yang membengkak.
   - **Next.js App Router (v15+)**: Menerapkan Server Component secara default, dan hanya menambahkan direktif `"use client"` pada komponen interaktif yang menggunakan React Hooks atau *browser APIs*.
   - **React Hooks Best Practices**: Mengisolasi *state logic* dan *side-effects* ke dalam *custom hooks* di direktori `hooks/`.
   - **TypeScript Strictness**: Setiap komponen wajib memiliki `Readonly<[Name]Props>` interface yang terdefinisi jelas.
   - **Data Decoupling**: Memisahkan *mock data* atau konfigurasi statis ke dalam direktori terisolasi (`lib/` atau `data/`), tidak di-*hardcode* di dalam JSX.
   - **Design Token Discipline**: Menggunakan kelas Tailwind CSS atau CSS Variables yang dipetakan dari `design.md`. Dilarang menggunakan *arbitrary hex colors* sembarangan.

---

## 2. Referensi Google Stitch MCP Tools

Stitch diakses melalui MCP Server `StitchMCP` menggunakan `call_mcp_tool`:

| Tool Name | Kegunaan | Parameter Utama |
| :--- | :--- | :--- |
| `list_projects` | Melihat daftar project Stitch yang aktif. | - |
| `create_project` | Membuat project Stitch baru. | `title` |
| `get_project` | Mengambil detail metadata project dan *screen instances*. | `name` (`projects/{id}`) |
| `generate_screen_from_text` | Menghasilkan screen UI baru berdasarkan prompt terstruktur. | `projectId`, `prompt`, `deviceType`, `designSystem` |
| `edit_screens` | Mengubah screen yang sudah ada menggunakan prompt perbaikan. | `projectId`, `selectedScreenIds`, `prompt` |
| `get_screen` | Mengambil metadata screen, download URL HTML & Screenshot. | `name` (`projects/{id}/screens/{id}`) |
| `list_screens` | Melihat seluruh screen yang ada dalam sebuah project. | `projectId` |
| `generate_variants` | Menghasilkan variasi layout/warna dari screen yang ada. | `projectId`, `screenId`, `prompt` |
| `upload_design_md` | Mengunggah `DESIGN.md` (Base64) ke project Stitch. | `projectId`, `designMdBase64` |
| `create_design_system_from_design_md` | Mengonversi `DESIGN.md` menjadi Design System aktif di Stitch. | `projectId` |
| `list_design_systems` | Mengambil daftar design system yang terdaftar. | `projectId` |
| `apply_design_system` | Menerapkan design system ke kumpulan screen. | `projectId`, `assetId`, `selectedScreenInstances` |

---

## 3. Sinkronisasi Design Tokens & `design.md`

Sebelum atau setelah melakukan generasi screen di Stitch, pastikan keselarasan desain dengan file acuan `design.md`:

1. **Audit Token Desain**:
   - **Primary Accent**: Emerald / Mint Neon (`#0df2c9` / `hsl(168, 89%, 50%)`).
   - **Background Palette**: Dark Canvas (`#0a1513`, `#0d1b18`, `#122420`).
   - **Surface & Cards**: Glassmorphism semi-transparan dengan `backdrop-blur-md` dan border halus `rgba(13, 242, 201, 0.15)`.
   - **Typography**: Font modern clean sans-serif (Inter / Space Grotesk / Outfit) dan font monospace untuk kode (JetBrains Mono / Fira Code).
2. **Sinkronisasi ke Stitch**:
   - Jika membuat/memperbarui desain, baca `design.md`, ubah menjadi Base64 string UTF-8, lalu panggil `upload_design_md` dan `create_design_system_from_design_md`.
   - Saat memanggil `generate_screen_from_text`, sertakan `designSystem` ID agar layar yang dihasilkan otomatis mewarisi tema yang konsisten.

---

## 4. Standar Slicing Komponen (`full-stack-skills/react-skills`)

Setiap screen atau visual dari Stitch harus di-*slicing* dengan standar berikut:

### A. Struktur Folder Modular
```text
components/
├── [feature]/
│   ├── [feature]-card.tsx          # Komponen kartu presentasional
│   ├── [feature]-list.tsx          # Wrapper daftar komponen
│   ├── [feature]-modal.tsx         # Modal / Dialog interaktif
│   └── [feature]-sandbox.tsx       # Canvas / Playground interaktif
├── layout/
│   ├── navbar.tsx                  # Header & Navigasi utama
│   └── footer.tsx                  # Footer & Attribution
└── ui/
    ├── button.tsx
    ├── badge.tsx
    └── glass-panel.tsx
hooks/
└── use-[feature].ts                # Logika state, filtering, atau interaksi
lib/
└── [feature]-data.ts               # Data statis, tipe data, dan mock configuration
app/
└── [route]/
    └── page.tsx                    # Route segment / Orchestrator halaman
```

### B. Aturan Penulisan Komponen (Clean Code)
1. **Interface Props Wajib & Readonly**:
   ```typescript
   export interface ClassCardProps {
     readonly id: string;
     readonly title: string;
     readonly description: string;
     readonly category: 'LIVE_CODE' | 'DRAG_DROP' | 'QUIZ';
     readonly levelCount: number;
     readonly isPopular?: boolean;
     readonly onEnroll?: (id: string) => void;
   }
   ```
2. **Pemisahan Server & Client Components**:
   - Halaman `page.tsx` atau layout yang hanya merender data statis dan SEO metadata dijadikan **Server Component** (tanpa `"use client"`).
   - Komponen dengan interaktivitas (`useState`, `useEffect`, `onClick`, `onChange`, browser storage, animations) menggunakan direktif `"use client"` di baris paling atas.
3. **Logic Extraction ke Custom Hooks**:
   - Jika terdapat *state* kompleks (misal: filter tab, sandboxing, validasi kode, animasi timer), pindahkan ke file di direktori `hooks/use-[feature].ts`.
   - Komponen UI hanya bertugas menampilkan tampilan (*pure presentation*) dan menerima *callback*.
4. **Navigasi & Links**:
   - Selalu ganti `href="#"` dari Stitch dengan komponen Next.js `<Link href="...">`.
   - Pastikan logo/brand name selalu mengarah ke `/` (*home*).
5. **Aksesibilitas (A11y) & Semantic HTML**:
   - Gunakan elemen semantik: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
   - Berikan atribut `aria-label` pada tombol icon atau link tanpa teks deskriptif.
   - Sediakan `id` unik pada elemen input dan interaktif penting untuk pengujian.

---

## 5. Alur Kerja Praktik (Step-by-Step Runbook)

### Langkah 1: Eksplorasi & Prompt Engineering (Stitch)
1. Tentukan kebutuhan UI: tujuan halaman, target audiens, dan komponen penting.
2. Strukturkan prompt dengan format profesional (hindari kata ambigu):
   - Sebutkan hierarki layout: Sticky Header, Hero Banner, Content Grid, Sidebar Filter, Modal.
   - Tentukan *responsive behaviour* (Desktop grid vs Mobile stack).

### Langkah 2: Eksekusi Stitch MCP
1. Panggil `generate_screen_from_text` dengan `projectId` dan `prompt`.
2. Jika perlu variasi estetika, gunakan `generate_variants`.
3. Ambil data screen dengan `get_screen` untuk mendapatkan download URL HTML dan Screenshot resolusi tinggi (`=w1920`).

### Langkah 3: Visual & Token Audit
1. Buka dan periksa screenshot visual untuk memahami alur UX, spacing, dan layout hierarchy.
2. Identifikasi komponen yang dapat di-abstraksi menjadi komponen yang *reusable*.

### Langkah 4: Pembuatan Data Layer & Tipe Data
1. Buat interface data model di TypeScript.
2. Siapkan data statis / mock di `lib/[feature]-data.ts` dengan struktur yang siap digantikan oleh REST API di kemudian hari.

### Langkah 5: Implementasi Komponen & Halaman
1. Buat komponen atomik dan molekuler di bawah `components/[feature]/`.
2. Pastikan styling mengacu pada token `design.md` (menggunakan utility classes Tailwind atau CSS variables).
3. Susun halaman utama di `app/[route]/page.tsx`.

### Langkah 6: Verifikasi Kualitas
1. Jalankan pengecekan TypeScript:
   ```bash
   npx tsc --noEmit
   ```
2. Periksa tampilan responsif (Desktop, Tablet, Mobile).
3. Pastikan tidak ada *hardcoded hex values* sembarangan atau *broken navigation links*.

---

## 6. Daftar Anti-Pattern yang Dilarang

- ❌ **Monolithic Pages**: Menulis 500+ baris kode JSX dalam satu file `page.tsx` tanpa pemisahan komponen.
- ❌ **Inline Business Logic**: Menumpuk `useState` 10+ variabel dan kalkulasi rumit di dalam komponen UI tanpa *custom hook*.
- ❌ **Hardcoded Colors**: Menulis kode warna acak seperti `bg-[#1a2b3c]` alih-alih menggunakan token tema (`bg-slate-900`, `text-emerald-400`, `var(--primary)`).
- ❌ **Missing TypeScript Props**: Membuat komponen tanpa interface tipe props yang terdefinisi.
- ❌ **Placeholder Links**: Membiarkan tag `<a>` dengan `href="#"` yang tidak bisa dinavigasi.
- ❌ **Uncontrolled Pushes**: Melakukan `git push` tanpa instruksi eksplisit dari pengguna.
