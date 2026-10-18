# Project Plan: Codevas (Code Canvas)
**Repository Name:** `codevas-learning-engine`

## 1. Product Vision & Purpose
**Apa itu Codevas?**
Codevas adalah platform edukasi pemrograman interaktif berbasis web (Interactive UI Learning Engine) yang mensimulasikan lingkungan kerja *developer* profesional tanpa memerlukan instalasi apa pun (*zero-setup*). Pengguna memanipulasi *template* antarmuka web modern secara *real-time* melalui penulisan kode terarah.

**Tujuan:**
Menghilangkan rasa frustrasi "kanvas kosong" bagi pelajar dengan menyajikan UI yang sudah berdesain modern (Candy Light Mode), lalu memberikan validasi visual seketika saat pengguna mengetik kode.

## 2. Tech Stack & Infrastructure
*   **Frontend:** Next.js, Tailwind CSS, Monaco Editor, Framer Motion.
*   **Backend:** Nextjs (REST API, Validation Engine).
*   **Database:** PostgreSQL.
*   **Development AI Workflow:** Google Stitch (Fase Desain Visual/UI) + Google Antigravity (Fase Slicing & Logika).
*   **Deployment:** Docker Containerized, Self-Hosted via Synology NAS (Reverse Proxy).

## 3. Desain Visual (UI/UX)
*   **Tema:** *Candy Light Mode*. Latar belakang bersih/putih dengan blok warna pastel solid (Mint Green, Bubblegum Pink, Sky Blue) tanpa gradasi.
*   **Layout Utama:** *Split-screen* (55% Live Canvas menyerupai *browser* macOS, 45% Monaco Editor & Panel Mission Control).
*   **Feedback:** Validasi instan (*auto-check*) tanpa tombol "Submit" manual untuk kategori Live Code HTML/CSS.

## 4. Database Architecture (ERD Core)
Menggunakan `JSONB` agar struktur tabel fleksibel menampung konfigurasi soal yang berbeda-beda tiap kategori.

*   **`users`**: `id` (UUID), `username`, `email`, `password_hash`, `full_name`, `avatar_url`, `xp_points`, `level`, `streak_days`, `role` (USER, ADMIN), `last_seen_at`, `created_at`, `updated_at`.
*   **`xp_transactions`** (Ledger & Audit Trail EXP): `id` (UUID), `user_id` (FK -> users), `amount`, `source` (REGISTER_BONUS, CHALLENGE_COMPLETE, STREAK_BONUS, ADMIN_GRANT), `reference_id`, `description`, `created_at`.
*   **`classes`**: `id`, `category` (ENUM: `LIVE_CODE`, `DRAG_DROP`, `QUIZ`), `title`, `description`, `is_published`.
*   **`user_enrollments`**: `id` (UUID), `user_id` (FK -> users), `class_id` (FK -> classes), `status` (ACTIVE, COMPLETED, DROPPED), `enrolled_at`.
*   **`challenges`** (Level dalam Kelas): 
    *   `id`, `class_id` (FK), `title`, `difficulty`.
    *   `instruction` (TEXT).
    *   `locked_template` (JSONB) -> *Kode boilerplate / opsi UI yang dikunci.*
    *   `initial_state` (TEXT) -> *Kondisi awal di area kerja pengguna.*
    *   `validation_rule` (JSONB) -> *Aturan kelulusan.*
*   **`user_progress`**: `id`, `user_id` (FK), `challenge_id` (FK), `status` (LOCKED, IN_PROGRESS, COMPLETED), `code_snapshot`.

## 5. Struktur Kurikulum Pembelajaran

Kurikulum dibagi berdasarkan **Kategori** (metode pendekatan belajar). Di dalam setiap kategori, terdapat beberapa **Class** (materi spesifik).

### Kategori: Live Code
*(Fokus MVP saat ini. Pengguna memanipulasi kode dengan validasi antarmuka secara real-time. Visual kanvas berupa blok wireframe solid abu-abu untuk Layout).*

**Class: CSS Flexbox**
*   Level 1: The Activation (Menyalakan `display: flex`)
*   Level 2: The Sniper (Menggunakan `justify-content: center`)
*   Level 3: The Split (Menggunakan `justify-content: space-between`)
*   Level 4: The Breathing Room (Menggunakan `justify-content: space-evenly`)
*   Level 5: The Push (Menggunakan `justify-content: flex-end`)
*   Level 6: The Gravity (Menggunakan `align-items: center`)
*   Level 7: The Floor (Menggunakan `align-items: flex-end`)
*   Level 8: The Tetris Tower (Mengubah orientasi dengan `flex-direction: column`)
*   Level 9: The Gap (Memberi jarak dengan `gap`)
*   Level 10: Boss Fight - Centering Div (Jurus pamungkas mempusatkan elemen)

**Class: CSS Grid**
*   Level 1: The Blueprint (Membuat papan `grid-template-columns`)
*   Level 2: The Triplets (Membagi ruang menjadi 3 kolom rata)
*   Level 3: The Asymmetry (Layout Sidebar dan Konten)
*   Level 4: The Alleyway (Penerapan Grid Gap)
*   Level 5: The Header Expansion (Memperlebar sel dengan `col-span`)
*   Level 6: The Tower Expansion (Mempertinggi sel dengan `row-span`)
*   Level 7: The VIP Pass (Mengubah urutan render elemen menggunakan `order`)
*   Level 8: The Perfect Center (Menggunakan `place-items-center`)
*   Level 9: The Inception (Menerapkan Flexbox di dalam sel Grid)
*   Level 10: Boss Fight - The Bento Box (Merakit komponen menjadi UI Dashboard)

**Class: Component Styling** *(Coming Soon)*
**Class: Full Web Integration** *(Coming Soon)*
**Class: React & Next.js Basics** *(Coming Soon)*

---

### Kategori: Visual Logic (Drag & Drop)
*(Pendekatan drag-and-drop blok visual untuk membangun insting hierarki/logika tanpa risiko syntax error).*

**Class: Javascript Logic Blocks** *(Coming Soon)*
**Class: CSS Layouting Hierarchy** *(Coming Soon)*
**Class: HTML DOM Tree Assembly** *(Coming Soon)*

---

### Kategori: Theory (Multiple Choice)
*(Kuis UI interaktif untuk menguji pemahaman konsep dasar sebelum menyentuh kode).*

**Class: CSS Selectors Quiz** *(Coming Soon)*
**Class: HTML Semantic Quiz** *(Coming Soon)*
**Class: JS Fundamentals Quiz** *(Coming Soon)*
```eof

Dengan struktur ini, tabel `classes` di *database* sudah pasti akan punya kolom `category`. AI juga tidak akan kebingungan membuat inisiatif fitur yang belum perlu dibuat karena batas-batas `(Coming Soon)` sudah disiapkan dengan tegas!

---

## 6. Next Tasks (Upcoming Milestones)
1. **📱 Full Mobile Responsiveness**:
   - Optimalisasi semua halaman agar responsive di layar mobile (`sm`, `md` breakpoints).
   - Mobile navigation drawer / hamburger menu untuk Navbar.
   - Penyesuaian layout split-screen `/classes/[id]` pada mobile (tab switching antara kanvas & code/instruksi).
   - Layout kartu Dashboard dan Silabus Katalog yang adaptive.

2. **🔐 Authentication dengan Auth.js (NextAuth v5) & Google Login**:
   - Integrasi `@auth/core` / `next-auth` App Router handler (`/api/auth/[...nextauth]`).
   - Setup Google OAuth Provider (Google Client ID & Secret).
   - Sinkronisasi sesi login Google ke entitas database `users`.
   - Middleware proteksi rute (`/dashboard`, `/classes/[id]`).