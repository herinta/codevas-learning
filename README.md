# 🎮 Codevas — Gamified Code Learning Platform

> **Belajar Coding Jadi Semenyenangkan Bermain Game!**  
> Platform edukasi interaktif modern berbasis gamifikasi yang memadukan visual programming, puzzle logic, quiz blitz, dan live coding dengan tema **Candy Neo-Brutalist Light UI**.

---

## 🚀 Progress Perkembangan Project

Berikut adalah status perkembangan fitur dan arsitektur Codevas hingga saat ini:

### 1. 🗄️ Database & Entity Relational Diagram (ERD)
Sistem database telah dimigrasikan ke **PostgreSQL** lokal (`codevas_db`) dengan relasi lengkap:

* **`users`**: Data akun pengguna, profil, role (`USER`, `ADMIN`), dan akumulasi `xp_points`.
* **`classes`**: Katalog kelas/mata pelajaran (`LIVE_CODE`, `DRAG_DROP` / Visual Logic, `QUIZ`).
* **`user_enrollments`**: Relasi *Many-to-Many* pendaftaran kelas oleh pengguna (`status`: `ACTIVE`, `COMPLETED`, `DROPPED`), dengan proteksi `UNIQUE(user_id, class_id)`.
* **`challenges`**: Modul soal/level dalam setiap kelas (`difficulty`, `instruction`, konfigurasi `target_state` dan `initial_code` berbasis JSONB, serta `xp_reward`).
* **`user_progress`**: Tracking penyelesaian challenge per user (`is_completed`, `attempts`, `submitted_code`, `completed_at`).

> **Automated Migration & Seeding**: Tersedia script `npm run db:setup` untuk otomatis mengeksekusi DDL schema, foreign key, indexes, dan sample seed data.

---

### 2. ⚡ Backend Services (Next.js App Router)
Backend dibangun secara native di dalam **Next.js 15+ App Router** menggunakan `pg` Connection Pool:

* **Entity Types & Interfaces** (`lib/db/entities.ts`): Type-safe entity mappings untuk semua tabel database.
* **Database Pool** (`lib/db/pool.ts`): Koneksi terkelola dengan caching pool client.
* **Enrollment Service & API** (`lib/services/enrollment.service.ts` & `app/api/enrollments/route.ts`):
  * `GET /api/enrollments?userId={id}`: Mengambil daftar kelas yang di-enroll oleh user.
  * `POST /api/enrollments`: Mendaftarkan user ke kelas secara aman dengan validasi duplikasi.
* **Progress Service & API** (`app/api/progress/route.ts`):
  * Tracking progres penyelesaian level dan pemberian XP otomatis ke profil user.
* **Database Migration API** (`app/api/setup-db/route.ts`): Endpoint administratif untuk sinkronisasi skema database.

---

### 3. 🎨 Frontend & Design System (Candy UI)
Mengadopsi filosofi desain **Stitch** dan **Candy Neo-Brutalist**: palet warna cerah, border tebal, drop-shadow retro yang tegas, mikro-animasi, dan tipografi modern.

* **🎯 Dashboard (`/dashboard`)**:
  * **Tab "My Class" (Default)**: Hanya menampilkan kelas-kelas yang aktif di-enroll oleh pengguna.
  * Filter kategori dinamis: *Visual Logic*, *Theory Quiz*, dan *Live Code*.
  * Gamification Header: Daily Streak Counter (🔥), XP Progress Bar, Rank Tier (*Code Master*), dan Notifikasi.
  * Sidebar Widget: **Daily Quiz Blitz** (tantangan harian kilat) dan **Leaderboard** mingguan real-time.
* **📚 Silabus Katalog Semua Kelas (`/classes`)**:
  * Menggantikan tautan statis Silabus dengan katalog interaktif seluruh kelas yang tersedia di platform.
  * Indikator status kelas: badge `✓ Terdaftar` untuk kelas yang sudah di-enroll dan tombol aksi `Lihat & Enroll` untuk kelas baru.
  * Rangkuman silabus: jumlah level/bab, tipe materi, estimasi waktu, dan total reward XP.
* **🕹️ Interactive Level Roadmap & Playground (`/classes/[id]`)**:
  * Peta level gamifikasi (Roadmap Level 1–10).
  * Panel instruksi tugas, target output, dan validasi kode.
* **🧭 Navigation & Layout (`components/layout/navbar.tsx`)**:
  * Navbar responsif terintegrasi dengan rute Dashboard, Silabus (`/classes`), Playground, dan Forum Diskusi.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org) (App Router, Server & Client Components) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS + Tailwind CSS (Candy Neo-Brutalist Theme) |
| **Icons** | Lucide React |
| **Database** | PostgreSQL 16 (`pg` node driver) |
| **Design Specs** | Google Stitch MCP Design Integration |

---

## 🏁 Memulai Project Secara Lokal

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/herinta/codevas-learning.git
cd codevas
npm install
```

### 2. Konfigurasi Environment Variables
Buat atau sesuaikan file `.env.local`:
```env
DATABASE_URL=postgres://postgres:root@localhost:5432/codevas_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=codevas_db
```

### 3. Setup Database (Migrasi & Seed)
Pastikan PostgreSQL service sedang berjalan, kemudian jalankan:
```bash
npm run db:setup
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000) untuk mengakses landing page, `/dashboard`, atau `/classes`.

---

## 🗺️ Rencana Pengembangan Selanjutnya (Next Milestones)

- [ ] Integrasi Monaco Code Editor / WebContainer untuk Live Code Sandbox.
- [ ] Drag-and-Drop Visual Logic Engine menggunakan AST parser / Blockly interaktif.
- [ ] Engine Quiz Blitz Real-time dengan timer countdown dan streak bonus.
- [ ] Sistem Reward & Achievement Badge showcase di profil user.
- [ ] Autentikasi Pengguna lengkap (NextAuth.js / Supabase Auth).
