# Codevas Development Rules & Engineering Standards

> **North Star**: Membangun platform pembelajaran koding interaktif nomor satu di Indonesia yang cepat, modular, aman, teruji validasinya, ramah SEO (*Top Google Search*), dan menyenangkan untuk pengguna (*Candy Expressive Gamification*).

Dokumen ini adalah pedoman wajib (*mandatory rules*) bagi seluruh pengembang dan asisten AI yang berkontribusi pada codebase **Codevas**.

---

## Daftar Isi
1. [Prinsip Utama (Core Principles)](#1-prinsip-utama-core-principles)
2. [Aturan SEO & Ranking Pencarian (SEO-Friendly Rules)](#2-aturan-seo--ranking-pencarian-seo-friendly-rules)
3. [Arsitektur Clean Code & Modular](#3-arsitektur-clean-code--modular)
4. [Protokol Validasi & Keamanan Data (Selalu Cek Validasi)](#4-protokol-validasi--keamanan-data-selalu-cek-validasi)
5. [Standar UI/UX, Gamifikasi & Copywriting](#5-standar-uiux-gamifikasi--copywriting)
6. [Navigasi, Layout Hierarchy & Mode PWA](#6-navigasi-layout-hierarchy--mode-pwa)
7. [Disiplin Git, Build & Verifikasi](#7-disiplin-git-build--verifikasi)

---

## 1. Prinsip Utama (Core Principles)

1. **Zero-Jargon User Experience**: Pengguna Codevas adalah pembelajar (mulai dari pemula hingga mahir). Jangan pernah menampilkan pesan teknis mentah (seperti *regex error*, *null pointer*, *database constraint violation*, atau *debug badge*). Sajikan pesan yang ramah, jelas, dan solutif.
2. **Server-First by Default**: Manfaatkan kapabilitas Next.js App Router. Gunakan Server Components untuk halaman, metadata, data fetching awal, dan skema SEO. Isolasi `"use client"` hanya pada daun pohon komponen (*leaf components*) yang membutuhkan interaksi pengguna.
3. **Defense in Depth (Zero Trust)**: Validasi input pengguna di sisi klien **dan** sisi server. Jangan pernah percaya pada data yang dikirimkan oleh browser atau API client.
4. **Single Source of Truth**: Token desain, tipe data, skema validasi, dan relasi database harus terdefinisi terpusat, tanpa duplikasi logika (*DRY - Don't Repeat Yourself*).

---

## 2. Aturan SEO & Ranking Pencarian (SEO-Friendly Rules)

Agar setiap halaman publik Codevas mampu bersaing di peringkat teratas mesin pencari (Google Top Search), terapkan aturan berikut:

### 2.1 Metadata Standar pada Setiap Halaman Publik
Setiap route publik (`app/**/page.tsx`) **wajib** mengekspor objek `metadata` atau fungsi `generateMetadata`:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Judul Halaman yang Menarik", // Otomatis memakai template: "%s — Codevas"
  description: "Deskripsi padat 140–160 karakter yang mengandung kata kunci utama dan ajakan bertindak (CTA).",
  keywords: [
    "belajar coding pemula",
    "kursus web development indonesia",
    "interactive code playground",
    "codevas",
  ],
  alternates: {
    canonical: "/classes", // Menghindari duplikasi konten
  },
  openGraph: {
    title: "Judul Halaman — Codevas",
    description: "Deskripsi singkat untuk preview WhatsApp, Twitter/X, LinkedIn.",
    url: "/classes",
    type: "website",
    siteName: "Codevas",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Judul Halaman — Codevas",
    description: "Deskripsi ringkas untuk preview X / Twitter.",
  },
};
```

### 2.2 Sinkronisasi `robots.ts` & `sitemap.ts`
- **Robots Directives ([`app/robots.ts`](file:///d:/Project/codevas/app/robots.ts))**:
  - Seluruh rute publik (`/`, `/classes`, `/classes/*`, `/login`, `/register`) wajib diizinkan (`allow`).
  - Seluruh rute privat/sistem (`/api/`, `/dashboard/`, `/admin/`, `/profile/`) wajib dicegah (`disallow`) agar Googlebot fokus mengindeks materi publik dan tidak membuang *crawl budget*.
- **Dynamic Sitemap ([`app/sitemap.ts`](file:///d:/Project/codevas/app/sitemap.ts))**:
  - Setiap penambahan modul/kursus dinamis baru di database harus otomatis terindeks di sitemap dengan `priority` dan `changeFrequency` yang tepat.

### 2.3 Structured Data / Schema.org JSON-LD (Google Rich Snippets)
Gunakan tag `<script type="application/ld+json">` pada Server Component untuk menghasilkan *rich results* di Google:
- **Root Layout (`app/layout.tsx`)**: Skema `EducationalOrganization` dan `WebSite` dengan `SearchAction`.
- **Katalog Kelas (`app/classes/page.tsx`)**: Skema `ItemList` berisi daftar kursus aktif.
- **Detail Kelas (`app/classes/[id]/page.tsx`)**: Skema `Course` (nama, deskripsi, tingkat kesulitan, provider) dan `BreadcrumbList`.

### 2.4 Struktur Semantik HTML
- Setiap halaman wajib memiliki **tepat satu** tag `<h1>` yang mendeskripsikan topik utama halaman.
- Gunakan elemen semantik HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Seluruh elemen gambar (`<img>` atau `<Image>`) **wajib** memiliki atribut `alt` deskriptif yang relevan untuk pembaca layar (*screen reader*) dan Google Image Search.

---

## 3. Arsitektur Clean Code & Modular

### 3.1 Struktur Direktori Proyek
```text
codevas/
├── app/                  # Routing Next.js App Router (Server Components & metadata)
│   ├── (auth)/           # Route login, register
│   ├── (marketing)/      # Landing page, silabus publik
│   ├── dashboard/        # Area pembelajaran & progres user (terproteksi)
│   ├── api/              # API Route Handlers (Server-only)
│   ├── robots.ts         # Robot crawler directives
│   └── sitemap.ts        # Dynamic sitemap generator
├── components/           # Komponen UI modular terorganisir per domain
│   ├── auth/             # Login, register, form autentikasi
│   ├── classes/          # Katalog kelas, modul, level card
│   ├── dashboard/        # Sidebar, breadcrumb, dashboard widgets
│   ├── landing/          # Hero, fitur, stats, demo banner
│   ├── layout/           # Navbar publik, footer, PWA bottom nav
│   └── ui/               # Atomik UI (button, badge, modal, input)
├── lib/                  # Logika bisnis, database, utilities
│   ├── db.ts             # Koneksi PostgreSQL pool terpusat
│   ├── services/         # Layer query database & business logic (ClassService, dsb.)
│   └── utils/            # Helper formatting, sanitization, cn
└── types/                # Kontrak interface TypeScript bersama
```

### 3.2 Pemisahan Tanggung Jawab (*Separation of Concerns*)
- **Page Route (`app/**/page.tsx`)**: Bertindak sebagai *orchestrator*. Mengambil data (SSR), menyusun metadata, dan merender komponen modular. Usahakan ukuran file di bawah 100 baris.
- **Client Component (`components/**`)**: Berisi state interaktif (`useState`, `useEffect`, event handler). Dilarang menyematkan query SQL langsung di komponen.
- **Service Layer (`lib/services/**`)**: Seluruh interaksi database PostgreSQL dibungkus dalam class/fungsi layanan (misal: `ClassService`, `UserService`).

### 3.3 Strict TypeScript & No `any`
- Dilarang keras menggunakan tipe `any`. Gunakan `unknown` jika tipe belum pasti, lalu lakukan *type narrowing*.
- Definisikan interface yang jelas untuk setiap payload API dan entitas database:
  ```typescript
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  ```

---

## 4. Protokol Validasi & Keamanan Data (Selalu Cek Validasi)

> **Motto**: *"Never trust client input. Always validate early and fail gracefully."*

### 4.1 Validasi di Sisi Server (API Route Handlers)
Setiap route handler di `app/api/**/route.ts` **wajib** melakukan pemeriksaan berjenjang:
1. **Validasi Metode HTTP**: Tolak metode yang tidak diizinkan dengan status `405 Method Not Allowed`.
2. **Validasi Autentikasi / Token**: Pastikan user memiliki sesi valid sebelum mengakses data sensitif.
3. **Validasi Payload Body & Query Params**:
   - Periksa keberadaan field wajib (*required fields*).
   - Validasi tipe data (string, number, boolean).
   - Validasi panjang (*length bounds*) dan pola format (email regex, slug format).
4. **Respon Konsisten**: Kembalikan status HTTP yang tepat (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).

Contoh Pola Standar API Handler:
```typescript
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validasi Input Wajib
    if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Judul materi minimal harus 3 karakter." },
        { status: 400 }
      );
    }

    // 2. Query Terparameterisasi (Aman dari SQL Injection)
    const result = await query(
      "INSERT INTO courses (title, created_at) VALUES ($1, NOW()) RETURNING *",
      [body.title.trim()]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    // 3. Error Masking: Jangan pernah membocorkan error internal DB ke client
    console.error("API Error [POST /courses]:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
```

### 4.2 Pencegahan SQL Injection
- **Wajib menggunakan Parameterized Queries** (`$1`, `$2`, dst.).
- **Dilarang keras** menggabungkan string langsung ke dalam query SQL (`query("SELECT * FROM users WHERE id = '" + id + "'")`).

### 4.3 Validasi Upload File & Media
- Pengguna harus dapat mengunggah file foto/gambar asli secara langsung (bukan memaksa pengguna memasukkan URL link mentah).
- **Validasi MIME Type**: Hanya izinkan format yang disetujui (misal: `image/jpeg`, `image/png`, `image/webp`).
- **Validasi Ukuran Maksimal**: Batasi ukuran file (misal: maks 5 MB untuk foto profil/cover).
- Simpan file ke private cloud storage / object storage, dan simpan URL publik yang dihasilkan ke database.

### 4.4 Sanitasi & Keamanan Klien
- Lindungi aplikasi dari XSS saat merender kode live demo atau pratinjau HTML dengan mengisolasi eksekusi di dalam `iframe` dengan atribut `sandbox="allow-scripts"`.
- Header keamanan (CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`) wajib selalu aktif melalui `next.config.ts`.

---

## 5. Standar UI/UX, Gamifikasi & Copywriting

### 5.1 Sistem Desain "Candy Expressive"
Gunakan token warna yang telah didefinisikan dalam [`design.md`](file:///d:/Project/codevas/design.md):
- **Primary** (`#e040a0` / `bg-primary`): Tombol aksi utama, tab aktif, streak highlight.
- **Secondary** (`#7c52aa` / `bg-secondary`): Milestone silabus, header kategori.
- **Tertiary** (`#0096cc` / `bg-tertiary`): Indikator sinkronisasi live code preview, info chips.
- **Neo-Brutalist Tactility**: Gunakan border tegas (`border-2 border-on-surface` atau `border-4`) dengan drop shadow bergaya blok (`shadow-[0_4px_0_#2e1a28]`) serta micro-interaction klik (`active:translate-y-0.5`).

### 5.2 Bahasa & Komunikasi Pengguna (Copywriting)
- Gunakan Bahasa Indonesia yang ramah, santai, namun profesional.
- **Hindari**: "Error 500: Database connection pool exhausted", "Invalid regex token input".
- **Gunakan**: "Oops! Terjadi kendala teknis. Tim kami sedang menanganinya.", "Format email belum sesuai, coba periksa kembali ya."

---

## 6. Navigasi, Layout Hierarchy & Mode PWA

### 6.1 Integritas Hierarki Navigasi (Breadcrumb Flow)
- **Konsistensi Lingkup Pengguna Terautentikasi**:
  Ketika pengguna yang sudah login berada di dalam area dashboard dan mengklik link silabus atau kelas, mereka **harus diarahkan ke silabus versi dashboard** (`/dashboard/classes`), **bukan** terlempar keluar ke landing page marketing (`/classes`).
- Sediakan breadcrumb yang jelas (misal: *Dashboard > Silabus Kelas > HTML Architecture*) sehingga pengguna selalu paham posisi navigasinya dan dapat kembali dengan satu klik.

### 6.2 Mode PWA (Progressive Web App)
- **Bersihkan Tampilan Aplikasi**: Sembunyikan footer global website saat berada di dalam area dashboard atau ruang pembelajaran level koding agar layar terasa seperti aplikasi native yang fokus dan clean.
- **Mobile Bottom Navigation**: Pada resolusi perangkat seluler / mode PWA terpasang, sediakan navigasi bilah bawah (*bottom bar*) untuk akses cepat ke Home, Kelas, Progres, dan Profil.

---

## 7. Disiplin Git, Build & Verifikasi

Sebelum melakukan commit atau push ke repositori:

1. **Jalankan Pengecekan Tipe**:
   ```bash
   npx tsc --noEmit
   ```
   *Wajib keluar dengan kode 0 (tanpa satupun error TypeScript).*
2. **Jalankan Linter**:
   ```bash
   npm run lint
   ```
   *Pastikan tidak ada lint error yang menghalangi build Next.js.*
3. **Format Pesan Commit (Conventional Commits)**:
   - `feat(scope): deskripsi fitur baru`
   - `fix(scope): perbaikan bug spesifik`
   - `sec(scope): perbaikan keamanan atau validasi`
   - `refactor(scope): restrukturisasi kode tanpa mengubah fungsionalitas`
4. **Target Branch**:
   - Seluruh pekerjaan pengembangan harian di-push ke branch **`dev`**.
   - Penggabungan ke `main` hanya dilakukan setelah lolos QA dan pengujian integrasi.

---

## 8. Konfigurasi Lingkungan & Pemisahan Database (Dev vs Prod Profiles)

Pemisahan antara database **Development (Lokal)** dan **Production (Server)** bersifat mutlak untuk mencegah risiko kehilangan data pengguna asli.

### 8.1 File Profil Konfigurasi
Mirip konsep `application-dev.properties` & `application-prod.properties` di Spring Boot:
- [`.env.development`](file:///d:/Project/codevas/.env.development): Mode dev lokal (di laptop), mengarah ke database lokal (`localhost:5432/codevas_db`).
- [`.env.production`](file:///d:/Project/codevas/.env.production): Mode production resmi (di Docker / Synology NAS), mengarah ke database container internal (`codevas-db:5432/codevas_db`).
- [`.env.local`](file:///d:/Project/codevas/.env.local): Overrides lokal untuk developer. Cukup ubah `DB_MODE="local"` atau `DB_MODE="server"` untuk beralih target database.

### 8.2 Perintah Sinkronisasi Database
- Migrasi Database Lokal:
  ```bash
  npm run db:setup:local
  ```
- Migrasi Database Server (Synology NAS LAN):
  ```bash
  npm run db:setup:server
  ```
- Migrasi Otomatis (sesuai `DB_MODE` aktif):
  ```bash
  npm run db:setup
  ```

---

*Aturan ini bersifat mengikat dan wajib diperbarui jika terdapat penambahan modul, perubahan arsitektur, atau konvensi baru pada Codevas.*
