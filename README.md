# 🎮 Codevas — Gamified Frontend Learning Platform

> **Belajar Coding Jadi Semenyenangkan Bermain Game!**  
> Platform edukasi interaktif modern berbasis gamifikasi yang memadukan visual playground, live coding real-time, kurikulum dinamis, dan console manajemen kurikulum berestetika **Candy Neo-Brutalist Light UI**.

---

## 🚀 Progress Perkembangan Project

Berikut adalah rangkuman komprehensif perkembangan arsitektur, fitur, dan engine Codevas:

### 1. 🗄️ Database PostgreSQL & Skema Relasional (ERD)
Sistem database telah dimigrasikan dan tersinkronisasi penuh dengan **PostgreSQL 16** lokal (`codevas_db`) dan Docker container:

* **`users`**: Data autentikasi akun, profil, level pengguna, XP points, streak harian, role (`USER` dan `ADMIN`), tanggal aktif, serta `last_seen_at` untuk pemantauan realtime online.
* **`xp_transactions`**: Ledger dan audit trail riwayat perolehan EXP pengguna (`user_id`, `amount`, `source`, `reference_id`, `description`, `created_at`).
* **`classes`**: Katalog mata pelajaran per kategori (`LIVE_CODE`, `DRAG_DROP`, `QUIZ`), tingkat kesulitan, estimasi waktu, status publikasi, dan total reward XP.
* **`challenges`**: Modul quest/level dalam kelas. Dilengkapi kolom **`theory`** (materi konsep kunci), **`instruction`** (soal misi), **`syntax_helpers`** (tag pintasan ketik cepat), **`target_visual`** (target solusi visual), **`locked_template`**, dan **`initial_state`**.
* **`user_enrollments`**: Relasi pendaftaran kelas oleh pengguna (`status`: `ACTIVE`, `COMPLETED`, `DROPPED`) dengan proteksi `UNIQUE(user_id, class_id)`.
* **`user_progress`**: Tracking progres penyelesaian quest per pengguna (`LOCKED`, `IN_PROGRESS`, `COMPLETED`), snapshot kode CSS terakhir, dan waktu penyelesaian.
* **`site_visits`**: Pelacakan analitik pengunjung publik landing page tanpa login secara anonim (`visitor_id`, `path`, `ip_hash`, `user_agent`, `visited_at`) dengan fitur auto-throttle 5 menit.

> **Automated Migration & Seed**: Script `node scripts/setup-db.mjs` (atau `npm run db:setup`) mengeksekusi DDL schema, migration idempotent, indexes, tabel ledger `xp_transactions`, serta seed materi kurikulum.

---

### 2. ⚡ Real-Time Live Coding Playground Engine (`/classes/[id]/learn/[challengeId]`)
Engine live coding interaktif ala *Flexbox Froggy* dengan performa tinggi:

* **Live Evaluation Tanpa Tombol Submit**: Validasi CSS berjalan secara instan 60 FPS saat pengguna mengetik tanpa perlu klik tombol cek/submit.
* **Anti-Flicker Style Parser**: Parser CSS yang menyaring deklarasi valid dan memetakan langsung ke inline style React dengan animasi *spring glide* yang halus.
* **Soal & Materi 100% Dinamis dari API**: Instruksi misi (`instruction`), materi teori pembelajaran (`theory`), petunjuk bantuan (`hint`), dan tombol ketik cepat (`syntax_helpers`) diambil langsung via API `/api/challenges/[id]`.
* **Bubble Ketik Cepat Cerdas (Toggle & Anti-Spam)**:
  * **Klik Pasang**: Menyisipkan kode CSS secara rapi ke editor.
  * **Klik Lagi untuk Hapus**: Jika kode sudah terpasang, klik kembali akan otomatis menghapusnya dari editor.
  * **Auto-Replace Nilai Sejenis**: Mengganti nilai properti sejenis (misal `justify-content`) tanpa menumpuk baris berulang.
* **Efek Mini Confetti Terlokalisasi**: Efek selebrasi partikel mini confetti meletup secara halus di panel aksi kanan saja (tidak menutupi layar penuh) saat target berhasil dicapai.
* **Sinkronisasi Progres Otomatis**: Progres tersimpan otomatis di background dan memperbarui progress bar di Silabus Kelas, Dashboard, dan Profil Pengguna.

---

### 3. 🛡️ Dashboard Administrator & Monitoring Sistem (`/admin`)
Pusat kendali komprehensif bagi administrator yang dilindungi oleh role-based auth guard:

* **Pemantauan Real-Time (Live Metrics)**:
  * 🟢 **User Online Sekarang**: Pengguna yang aktif dalam 15 menit terakhir.
  * ⚡ **User Aktif Hari Ini**: Jumlah pengguna unik yang beraktivitas hari ini.
  * 👥 **Total Pengguna & Administrator**: Statistik total akun terdaftar.
  * 🎓 **Total Kelas & Modul Live Code**: Katalog modul aktif.
  * 🏆 **Total Quest Tamat**: Akumulasi level yang berhasil diselesaikan siswa.
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
  * Form setup khusus level Live Code: ID, judul, nomor urut, tingkat kesulitan, reward XP, textarea soal, textarea teori, tag syntax helpers, kode awal, konfigurasi visual target, dan template elemen.

---

### 4. 🌟 Rute Khusus Portofolio (`/demo` & `/demo/login`)
Pemisahan alur akses khusus untuk kebutuhan pameran portofolio dan perekrut:

* **Akses Portofolio (`codevas.my.id/demo`)**:
  * Otomatis mengalihkan ke `/demo/login`.
  * Menampilkan banner eksklusif **PORTO SHOWCASE** dengan tombol isi instan:
    * 🎓 **Akun Siswa**: `demo` / `demo123` *(menguji 10 level quest, live coding, streak, dan XP)*.
    * 🛡️ **Akun Admin**: `admin` / `admin123` *(menguji monitoring real-time, visitor tracker, user management, dan kurikulum CRUD)*.
* **Akses Normal Pengguna (`codevas.my.id/login`)**:
  * Tidak menampilkan akun demo sama sekali, menjaga antarmuka login tetap bersih dan profesional untuk pengguna produksi.

---

### 5. 🎨 Frontend Design System (Candy Neo-Brutalist Light UI)
* Desain visual modern mengadopsi elemen *Candy Neo-Brutalist*: border hitam tebal, drop-shadow retro yang tegas (`shadow-brutal`), palet warna cerah, dan tipografi modern (*Space Grotesk* dan *Plus Jakarta Sans*).
* **Navigasi Dinamis**: [Navbar](file:///d:/Project/codevas/components/layout/navbar.tsx) secara otomatis menampilkan tombol **Admin** jika akun yang sedang login memiliki hak akses `ADMIN`.
* **Katalog Silabus (`/classes` & `/classes/[id]`)**: Menampilkan daftar kelas lengkap dengan status pendaftaran, total bab, dan road map level 1–10.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 16.4.2](https://nextjs.org) (App Router, Turbopack, React 19) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS + Tailwind CSS v4 (Candy Neo-Brutalist Design System) |
| **Icons** | Lucide React |
| **Database** | PostgreSQL 16 (`pg` connection pool) |
| **Authentication** | Custom HMAC-SHA256 Signed Session Token & Cookies |
| **Container & CI/CD** | Docker Compose, Dockerfile Multi-Stage, GitHub Actions CI/CD |

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
Pastikan PostgreSQL lokal sedang berjalan:
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
| **Demo Siswa** | `demo` | `demo123` | Akses penuh silabus belajar, 10 level quest live code, tracking XP & streak |
| **Demo Administrator** | `admin` | `admin123` | Akses penuh Admin Console, monitoring visitor, manajemen user, dan CRUD kurikulum |

---

## 🗺️ Roadmap & Milestone Berikutnya

- [x] Full 10 Quest CSS Flexbox Mastery dengan validasi instan real-time.
- [x] Dashboard Administrator, User Management, dan Live Code Class/Challenge CRUD.
- [x] Tracking analitik pengunjung landing page tanpa login.
- [x] Rute terisolasi khusus portofolio `/demo` dan `/demo/login`.
- [ ] Implementasi editor visual Drag-and-Drop Puzzle Logic (Kategori `DRAG_DROP`).
- [ ] Implementasi engine Quiz Blitz interaktif dengan timer countdown (Kategori `QUIZ`).
- [ ] Sistem sertifikat tamat kelas yang dapat diunduh (PDF / SVG badge).
