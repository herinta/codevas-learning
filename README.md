# 💻 Codevas — Interactive Frontend Learning Platform

> **Platform Edukasi Pemrograman Frontend Interaktif Real-Time**  
> Platform belajar koding berbasis web (*Interactive UI Learning Engine*) yang memadukan visual playground interaktif, live coding real-time dengan umpan balik instan, kurikulum terstruktur (HTML Architecture, CSS Fundamentals, Flexbox, Grid), dan dashboard analitik berestetika **Candy Neo-Brutalist Light UI**.

---

## 🚀 Progress Perkembangan Project

Berikut adalah rangkuman komprehensif arsitektur, fitur, dan engine Codevas:

### 1. 🗄️ Database PostgreSQL & Skema Relasional (ERD)
Sistem database tersinkronisasi penuh dengan **PostgreSQL 16** lokal (`codevas_db`) dan Docker container:

* **`users`**: Data autentikasi akun, profil, level pengguna, XP points, streak harian, role (`USER` dan `ADMIN`), tanggal aktif, serta `last_seen_at` untuk pemantauan realtime online.
* **`xp_transactions`**: Ledger dan audit trail riwayat perolehan EXP pengguna (`user_id`, `amount`, `source`, `reference_id`, `description`, `created_at`).
* **`classes`**: Katalog mata pelajaran per kategori (`LIVE_CODE`, `DRAG_DROP`, `QUIZ`), tingkat kesulitan, estimasi waktu, status publikasi, dan total reward XP.
* **`challenges`**: Modul pembelajaran/level dalam kelas. Dilengkapi kolom **`theory`** (materi konsep kunci), **`instruction`** (panduan tugas koding), **`syntax_helpers`** (tag pintasan ketik cepat), **`target_visual`** (target solusi visual), **`locked_template`**, dan **`initial_state`**.
* **`user_enrollments`**: Relasi pendaftaran kelas oleh pengguna (`status`: `ACTIVE`, `COMPLETED`, `DROPPED`) dengan proteksi `UNIQUE(user_id, class_id)`.
* **`user_progress`**: Tracking progres penyelesaian modul per pengguna (`LOCKED`, `IN_PROGRESS`, `COMPLETED`), snapshot kode terakhir, dan waktu penyelesaian.
* **`site_visits`**: Pelacakan analitik pengunjung publik landing page tanpa login secara anonim (`visitor_id`, `path`, `ip_hash`, `user_agent`, `visited_at`) dengan fitur auto-throttle 5 menit.

> **Automated Migration & Seed**: Single Source of Truth berada pada `docker/init-db.sql`. Eksekusi via `node scripts/setup-db.mjs` (atau `npm run db:setup`) secara otomatis menyinkronkan tabel, trigger, indeks, dan 56 tantangan aktif.

---

### 2. ⚡ Real-Time Live Coding Playground Engine (`/classes/[id]/learn/[challengeid]`)
Engine live coding interaktif dengan performa tinggi:

* **Live Evaluation Tanpa Tombol Submit**: Validasi DOM dan CSS berjalan secara instan 60 FPS saat pengguna mengetik tanpa perlu klik tombol cek/submit.
* **Anti-Flicker Style & DOM Parser**: Parser yang menyaring sintaks HTML/CSS dan memetakan langsung ke inline style React dengan animasi *spring glide* yang halus.
* **Materi & Soal 100% Dinamis dari Database**: Instruksi panduan (`instruction`), materi teori pembelajaran (`theory`), petunjuk bantuan (`hint`), dan tombol ketik cepat (`syntax_helpers`) diambil langsung via database melalui API `/api/challenges/[id]`.
* **Bubble Ketik Cepat Cerdas (Toggle & Anti-Spam)**:
  * **Klik Pasang**: Menyisipkan kode HTML/CSS secara rapi ke editor Monaco.
  * **Klik Lagi untuk Hapus**: Jika kode sudah terpasang, klik kembali akan otomatis menghapusnya dari editor.
  * **Auto-Replace Nilai Sejenis**: Mengganti nilai properti sejenis (misal `justify-content`) tanpa menumpuk baris berulang.
* **Efek Mini Confetti Terlokalisasi**: Efek selebrasi partikel mini confetti meletup secara halus di panel aksi kanan saja saat target koding berhasil dicapai.
* **Sinkronisasi Progres Otomatis**: Progres tersimpan otomatis di background dan memperbarui progress bar di Silabus Kelas, Dashboard, dan Profil Pengguna.

---

### 3. 🛡️ Dashboard Administrator & Monitoring Sistem (`/admin`)
Pusat kendali komprehensif bagi administrator yang dilindungi oleh role-based auth guard:

* **Pemantauan Real-Time (Live Metrics)**:
  * 🟢 **User Online Sekarang**: Pengguna yang aktif dalam 15 menit terakhir.
  * ⚡ **User Aktif Hari Ini**: Jumlah pengguna unik yang beraktivitas hari ini.
  * 👥 **Total Pengguna & Administrator**: Statistik total akun terdaftar.
  * 🎓 **Total Kelas & Modul Live Code**: Katalog modul aktif.
  * 🏆 **Total Modul Selesai**: Akumulasi level yang berhasil diselesaikan siswa.
* **Pelacakan Pengunjung Landing Page (Tanpa Login)**:
  * 🌐 **Pengunjung Sedang Aktif**: Pengunjung publik di landing page (15m terakhir).
  * 📈 **Pengunjung Landing Hari Ini**: Jumlah pengunjung unik hari ini tanpa login.
  * 👥 **Total Pengunjung Unik**: Akumulasi browser/perangkat unik yang pernah berkunjung.
  * 👁️ **Total Kunjungan Halaman (Pageviews)**: Total hit landing page secara keseluruhan.
* **Manajemen Pengguna (User Management)**:
  * Tabel pengguna dengan pencarian (username, nama, email) dan filter role.
  * Toggle role cepat (`USER` ⇄ `ADMIN`).
  * Modal edit profil, XP, streak, dan hapus user dengan proteksi anti self-deletion.
* **Manajemen Kelas & Level Live Code (CRUD Kurikulum)**:
  * Manajemen kelas per kategori (`LIVE_CODE` aktif, `DRAG_DROP` & `QUIZ` disiapkan untuk tahap berikutnya).
  * Form setup khusus level Live Code: ID, judul, nomor urut, tingkat kesulitan, reward XP, textarea panduan, textarea teori, tag syntax helpers, kode awal, konfigurasi visual target, dan template elemen.

---

### 4. 🌟 Rute Khusus Portofolio (`/demo` & `/demo/login`)
Pemisahan alur akses khusus untuk kebutuhan pameran portofolio dan perekrut:

* **Akses Portofolio (`codevas.my.id/demo`)**:
  * Otomatis mengalihkan ke `/demo/login`.
  * Menampilkan banner eksklusif **PORTO SHOWCASE** dengan tombol isi instan:
    * 🎓 **Akun Siswa**: `demo` / `demo123` *(menguji pengerjaan materi live coding, streak, dan akumulasi XP)*.
    * 🛡️ **Akun Admin**: `admin` / `admin123` *(menguji monitoring real-time, visitor tracker, user management, dan kurikulum CRUD)*.
* **Akses Normal Pengguna (`codevas.my.id/login`)**:
  * Menjaga antarmuka login tetap bersih dan profesional untuk pengguna produksi tanpa menampilkan tombol pengisian otomatis demo.

---

## 📂 Struktur Lengkap File & Direktori (Directory Architecture)

```text
codevas/
├── app/                                        # Next.js App Router (Halaman, Layout & REST API)
│   ├── (auth)/                                 # Kelompok Rute Autentikasi Publik
│   │   ├── login/page.tsx                      # Halaman masuk akun siswa/admin standar
│   │   └── register/page.tsx                   # Pendaftaran akun siswa baru & pemilihan age_group
│   ├── admin/                                  # Area Manajemen Sistem
│   │   └── page.tsx                            # Dashboard administrator (Live Metrics, User & Modul CRUD)
│   ├── classes/                                # Area Modul & Kelas Pembelajaran
│   │   ├── page.tsx                            # Katalog kelas (Filter kategori: Live Code, Visual, Quiz)
│   │   ├── [id]/page.tsx                       # Halaman silabus kelas, daftar level & status pendaftaran
│   │   └── [id]/learn/[challengeid]/page.tsx   # Workspace live code interaktif
│   ├── dashboard/page.tsx                      # Beranda belajar siswa (XP, streak calendar, recent class)
│   ├── demo/                                   # Rute Showcase Portofolio Publik
│   │   ├── page.tsx                            # Landing demo (redirect instan ke /demo/login)
│   │   └── login/page.tsx                      # Demo showcase login dengan 1-click credentials
│   ├── profile/page.tsx                        # Halaman akun profil pengguna & riwayat XP
│   ├── api/                                    # Backend REST Endpoints
│   │   ├── admin/                              # API CRUD khusus hak akses administrator
│   │   │   ├── challenges/route.ts             # Tambah, update, dan hapus level tantangan
│   │   │   ├── classes/route.ts                # Tambah, edit, dan kelola kelas kurikulum
│   │   │   └── users/route.ts                  # Modifikasi role user, XP adjustment, & hapus akun
│   │   ├── analytics/route.ts                  # Endpoint pencatatan site_visits anonim (throttle 5m)
│   │   ├── auth/                               # Endpoint penanganan sesi autentikasi
│   │   │   ├── login/route.ts                  # Verifikasi password hash bcrypt & pasang cookie JWT
│   │   │   ├── register/route.ts               # Validasi input, pembuatan user baru & inisialisasi enrollment
│   │   │   ├── me/route.ts                     # Get current user session info
│   │   │   └── logout/route.ts                 # Hapus auth cookie
│   │   ├── challenges/                         # Endpoint data materi & penilaian kode
│   │   │   ├── route.ts                        # List challenges filter by class_id
│   │   │   ├── [id]/route.ts                   # Fetch detail satu tantangan
│   │   │   └── [id]/evaluate/route.ts          # Server-side validation, award XP & unlock level selanjutnya
│   │   ├── classes/                            # Endpoint katalog kelas
│   │   │   ├── route.ts                        # Fetch seluruh kelas yang dipublikasi
│   │   │   └── [id]/route.ts                   # Detail silabus kelas spesifik
│   │   ├── enrollments/route.ts                # Pendaftaran user ke kelas tertentu
│   │   ├── leaderboard/route.ts                # Peringkat siswa berdasarkan perolehan XP
│   │   ├── progress/route.ts                   # Simpan autosave code snapshot & update status modul
│   │   ├── setup-db/route.ts                   # Trigger migrasi database via API
│   │   └── user/route.ts                       # Update data profil pengguna
│   ├── favicon.ico                             # Favicon aplikasi
│   ├── globals.css                             # CSS global & design tokens Candy Light Mode
│   ├── layout.tsx                              # Root layout, font provider, & navigasi global
│   ├── manifest.ts                             # Manifest metadata Web App (PWA support)
│   ├── robots.ts                               # Konfigurasi SEO bot crawler
│   └── sitemap.ts                              # Sitemap generator untuk mesin pencari
│
├── components/                                 # Komponen UI Terisolasi & Modular
│   ├── admin/                                  # Komponen Panel Administrator
│   │   └── admin-dashboard-client.tsx          # Client console: Live visitor tracker, user list, modal CRUD
│   ├── auth/                                   # Komponen Antarmuka Autentikasi
│   │   ├── auth-context.tsx                    # React Context penyedia status sesi user di seluruh aplikasi
│   │   ├── auth-shell.tsx                      # Shell kartu login/register bergaya neo-brutalist
│   │   ├── login-form.tsx                      # Form masukan kredensial login
│   │   ├── register-form.tsx                   # Form pendaftaran dengan pilihan kelompok usia
│   │   └── social-auth.tsx                     # Tombol integrasi login sosial (Google OAuth ready)
│   ├── classes/                                # Komponen Katalog & Silabus
│   │   ├── classes-catalog-client.tsx          # Komponen filter & kartu kelas di /classes
│   │   ├── class-detail-client.tsx             # Client container silabus & modul list
│   │   └── class-detail-view.tsx               # Tampilan presentasi daftar 20 level bertingkat
│   ├── dashboard/                              # Komponen Beranda Siswa
│   │   ├── category-filter.tsx                 # Filter tab kategori materi
│   │   ├── class-card.tsx                      # Kartu kelas dengan indikator progress bar
│   │   ├── daily-blitz-widget.tsx              # Widget tantangan kilat harian
│   │   ├── daily-target-widget.tsx             # Target harian koding & visualisasi goal
│   │   ├── dashboard-hero.tsx                  # Banner sapaan siswa dengan ringkasan status
│   │   ├── dashboard-nav.tsx                   # Navigasi tab dashboard internal
│   │   ├── leaderboard-widget.tsx              # Widget papan peringkat skor XP
│   │   └── stats-widget.tsx                    # Kartu metrik streak & total XP
│   ├── landing/                                # Komponen Landing Page Publik
│   │   ├── hero-section.tsx                    # Hero banner dengan preview interaktif
│   │   ├── interactive-demo.tsx                # Playground mini di landing page untuk coba koding langsung
│   │   ├── features-section.tsx                # Penjelasan keunggulan engine Codevas
│   │   ├── classes-section.tsx                 # Cuplikan silabus materi yang tersedia
│   │   └── stats-banner.tsx                    # Banner counter statistik platform
│   ├── layout/                                 # Komponen Struktur Layout Global
│   │   ├── navbar.tsx                          # Navigasi utama dengan auto-detect role ADMIN
│   │   └── footer.tsx                          # Footer situs dengan link navigasi & hak cipta
│   ├── learn/                                  # 🧠 Komponen Workspace Koding (Live Learning Engine)
│   │   ├── learn-workspace.tsx                 # Orkestrator utama menghubungkan editor, kanvas, & evaluasi
│   │   ├── learn-header.tsx                    # Bar atas: nama level, timer, poin XP, & tombol modal teori
│   │   ├── mission-panel.tsx                   # Panel panduan tugas & instruksi tantangan koding
│   │   ├── code-editor-panel.tsx               # Editor Monaco terintegrasi + baris syntax quick-helper
│   │   ├── live-arena.tsx                      # Kanvas pratinjau rendering real-time DOM & CSS
│   │   ├── completion-action-bar.tsx           # Bar aksi penyelesaian: mini-confetti, XP reward & next level
│   │   ├── theory-modal.tsx                    # Modal penjabaran konsep teori & analogi materi
│   │   ├── session-expired-modal.tsx           # Dialog peringatan saat sesi login habis
│   │   ├── evaluator.ts                        # Client-side validation engine untuk auto-check instan
│   │   ├── style-parser.ts                     # Parser selector CSS & deklarasi properti ke style React
│   │   ├── types.ts                            # Definisi interface dan tipe data workspace belajar
│   │   └── use-mini-confetti.ts                # Custom hook animasi partikel confetti terlokalisasi
│   └── ui/                                     # Komponen Primitif Desain Candy Neo-Brutalist
│
├── lib/                                        # Modul Inti Logika, Service & Database
│   ├── auth/                                   # Utilitas Autentikasi & Keamanan
│   │   ├── admin-guard.ts                      # Helper validasi token server-side untuk hak akses ADMIN
│   │   ├── password.ts                         # Enkripsi & verifikasi kata sandi dengan bcrypt
│   │   └── session.ts                          # Pembuatan & parsing token sesi terenkripsi HMAC-SHA256
│   ├── db/                                     # Koneksi Database PostgreSQL
│   │   ├── pool.ts                             # Inisialisasi pool koneksi pg dengan SSL auto-detect
│   │   ├── entities.ts                         # Interface TypeScript representasi tabel database
│   │   └── setup.ts                            # Skrip pendukung eksekusi query DDL
│   ├── services/                               # 🛡️ Service Layer (Akses Database Terpusat)
│   │   ├── analytics.service.ts                # Pencatatan dan agregasi analitik site_visits
│   │   ├── challenge.service.ts                # Query level soal, validasi kriteria, & unlock level berikutnya
│   │   ├── class.service.ts                    # Query katalog kelas, ringkasan modul, & statistik silabus
│   │   ├── daily-target.service.ts             # Manajemen pencapaian target harian siswa
│   │   ├── enrollment.service.ts               # Pendaftaran siswa ke kelas & status aktif
│   │   ├── progress.service.ts                 # Update snapshot kode & status modul (LOCKED/IN_PROGRESS/COMPLETED)
│   │   └── user.service.ts                     # Manajemen akun, profil, XP ledger, & streak counter
│   ├── classes-data.ts                         # Dataset statis kurikulum untuk fallback offline / demo preview
│   └── gamification.ts                         # Logika kenaikan level siswa, badge pangkat, & threshold XP
│
├── docker/                                     # Konfigurasi Kontainerisasi & Database
│   └── init-db.sql                             # 💎 Single Source of Truth: Skema DDL ERD & seed data 56 tantangan
├── scripts/                                    # Skrip Utilitas CLI
│   └── setup-db.mjs                            # Runner migrasi & seed database otomatis dari init-db.sql
├── project_plan.md                             # Dokumen perencanaan lengkap, roadmap, & log progres
├── PRODUCTION.md                               # Panduan deployment produksi & Synology NAS Docker setup
└── README.md                                   # Dokumentasi pengenalan proyek & referensi pengembang
```

---

## 🔄 Diagram Alur Kerja & Sistem (System Architecture & Flows)

### 1. Alur Belajar Interaktif (Live Code & Instant Validation Loop)
Siklus pengerjaan tantangan koding oleh pengguna dengan umpan balik visual instan:

```mermaid
sequenceDiagram
    autonumber
    actor Siswa as Siswa (User)
    participant Editor as Monaco Editor (CodeEditorPanel)
    participant Parser as StyleParser / DOM Parser
    participant Canvas as Live Arena Canvas
    participant ClientEval as Evaluator Engine (Client)
    participant ActionBar as CompletionActionBar
    participant ServerAPI as POST /api/challenges/[id]/evaluate
    participant DB as PostgreSQL Database

    Siswa->>Editor: Mengetik kode HTML / CSS
    Editor->>Parser: Ekstrak tag HTML & deklarasi CSS secara real-time
    Parser->>Canvas: Render visual ke kanvas pratinjau (Candy Light Mode)
    Canvas->>ClientEval: Validasi kesesuaian terhadap validation_rules
    alt Kriteria Belum Terpenuhi
        ClientEval-->>ActionBar: Status: Belum Selesai (Siswa lanjut eksplorasi kode)
    else Seluruh Kriteria Terpenuhi (Passed)
        ClientEval-->>ActionBar: Status: LULUS (Passed)!
        ActionBar->>Siswa: Tampilkan animasi sukses, mini-confetti, & suara perayaan
        Siswa->>ActionBar: Klik tombol "Lanjut ke Level Berikutnya"
        ActionBar->>ServerAPI: Kirim snapshot kode & durasi pengerjaan
        ServerAPI->>DB: Update user_progress (COMPLETED) & Catat reward di xp_transactions
        ServerAPI->>DB: Unlock modul berikutnya (status: IN_PROGRESS)
        ServerAPI-->>ActionBar: Respon sukses + data level berikutnya
        ActionBar->>Siswa: Navigasikan langsung ke URL level berikutnya
    end
```

### 2. Alur Pengambilan Data & Fallback (Data Fetching Flow)
Mekanisme pembacaan data pembelajaran dengan fallback cerdas:

```mermaid
flowchart TD
    A([Siswa Mengakses Halaman Belajar]) --> B{Koneksi Database Aktif?}
    B -- Ya --> C[Query challenge.service.ts ke PostgreSQL]
    B -- Tidak (Mode Demo/Offline) --> D[Fallback ke lib/classes-data.ts]
    C --> E[Siapkan Initial State, Locked Template, Theory & Hints]
    D --> E
    E --> F[Render LearnWorkspace: CodeEditor + LiveArena + MissionPanel]
    F --> G[Siswa Siap Melakukan Live Coding]
```

### 3. Alur Konsistensi Skema Database (Database Sync Flow)
Mekanisme satu pintu untuk memastikan konsistensi skema dan silabus:

```mermaid
flowchart LR
    A[docker/init-db.sql\nSingle Source of Truth] -->|Dibaca & dieksekusi oleh| B[scripts/setup-db.mjs]
    B -->|Query DDL & Seeding| C[(PostgreSQL Server)]
    C -->|Dikelola oleh| D[lib/services/*.service.ts]
    D -->|Disajikan via REST| E[app/api/*]
```

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 16.4.2](https://nextjs.org) (App Router, Turbopack, React 19) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS + Tailwind CSS v4 (Candy Neo-Brutalist Design System) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Icons & Animasi** | Lucide React + Canvas Confetti |
| **Database** | PostgreSQL 16 (`pg` connection pool) |
| **Authentication** | Custom HMAC-SHA256 Signed Session Token & Secure Cookies |
| **Container & CI/CD** | Docker Compose, Multi-Stage Dockerfile, GitHub Actions |

---

## 🌿 Struktur Percabangan Git (Branching Strategy)

* **`main`**: Cabang produksi (*Production Branch*). Terproteksi dan hanya diperbarui saat rilis final.
* **`dev`**: Cabang pengembangan aktif (*Development Branch*). Seluruh commit fitur baru, pengujian build, dan migrasi database wajib masuk ke cabang `dev` terlebih dahulu.

---

## 🏁 Memulai Project Secara Lokal

### 1. Clone & Masuk ke Branch `dev`
```bash
git clone https://github.com/herinta/codevas-learning.git
cd codevas
git checkout dev
npm install
```

### 2. Konfigurasi Environment Variables (`.env.local`)
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/codevas_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=codevas_db
AUTH_SECRET=your-secure-secret-key-for-jwt-session
```

### 3. Migrasi & Seed Database
Pastikan service PostgreSQL lokal sedang berjalan:
```bash
npm run db:setup
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Akses platform di browser:
* **Landing Page**: [http://localhost:3000](http://localhost:3000)
* **Porto Demo Showcase**: [http://localhost:3000/demo](http://localhost:3000/demo)
* **Katalog Silabus**: [http://localhost:3000/classes](http://localhost:3000/classes)
* **Admin Console**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Login dengan akun `admin`)*

---

## 📋 Akun Uji Coba Default

| Tipe Akun | Identifier / Username | Kata Sandi | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Demo Siswa** | `demo` | `demo123` | Akses penuh silabus belajar, pengerjaan modul live code, tracking XP & streak |
| **Demo Administrator** | `admin` | `admin123` | Akses penuh Admin Console, monitoring visitor, manajemen user, dan CRUD kurikulum |

---

## 🗺️ Roadmap & Milestone Berikutnya

- [x] Full 20 Level HTML Architecture (Hierarki pembungkus container `<div>`).
- [x] Full 12 Level CSS Basics, Flexbox, & Grid dengan validasi instan real-time.
- [x] Dashboard Administrator, User Management, dan Live Code Class/Challenge CRUD.
- [x] Tracking analitik pengunjung landing page tanpa login.
- [x] Rute terisolasi khusus portofolio `/demo` dan `/demo/login`.
- [ ] Jeda Materi Konseptual & Guided Interactive Examples (*Interstitial Theory Checkpoints*).
- [ ] Mobile Responsive Split-Screen pada halaman pembelajaran.
- [ ] Integrasi Google OAuth & Auth.js v5.
- [ ] Diferensiasi kurikulum bertingkat berdasarkan kelompok usia pengguna (*Age-Tiered Classes*).
