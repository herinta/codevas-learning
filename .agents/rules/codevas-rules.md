<!-- Codevas Agent Rules: Automatically discovered by Antigravity IDE and subagents -->

# Codevas Codebase Rules

Silakan merujuk ke pedoman lengkap di [rules.md](file:///d:/Project/codevas/rules.md).

## Aturan Utama Singkat:
1. **SEO-Friendly**:
   - Seluruh halaman publik (`app/**/page.tsx`) wajib memiliki export `metadata` dengan title template (`%s — Codevas`), deskripsi bahasa Indonesia, canonical URL, OpenGraph, dan Twitter Cards.
   - Sertakan Schema.org JSON-LD (`EducationalOrganization`, `Course`, `BreadcrumbList`, `ItemList`) untuk Google Rich Snippets.
   - Daftarkan URL publik di `app/sitemap.ts` dan batasi akses rute privat di `app/robots.ts`.

2. **Clean Code & Modular**:
   - Page route (`app/**/page.tsx`) adalah Server Component dan lean orchestrator (< 100 baris).
   - Ekstrak komponen interaktif ke `components/<domain>/`.
   - Pisahkan query database ke `lib/services/`.
   - Strict TypeScript: Dilarang menggunakan `any`.

3. **Selalu Cek Validasi**:
   - Jangan pernah percaya input client. Setiap API Route Handler (`app/api/**`) wajib memvalidasi tipe data, panjang string, dan format payload sebelum eksekusi.
   - Semua query SQL ke PostgreSQL wajib menggunakan Parameterized Queries (`$1`, `$2`). Dilarang raw string concatenation.
   - File upload: Wajib validasi MIME type dan batasan ukuran file.
   - Error Masking: Jangan pernah membocorkan error teknis/database mentah ke user. Tampilkan pesan yang ramah dan solutif.

4. **Hierarki Navigasi & UX**:
   - Pengguna login yang berada di dashboard harus tetap berada di layout dashboard (`/dashboard/classes`), jangan lempar ke marketing landing page.
   - Pada mode PWA / mobile, sembunyikan footer global di area dashboard dan gunakan bottom navigation bar.

5. **Verifikasi**:
   - Selalu jalankan `npx tsc --noEmit` sebelum commit. Kode wajib 100% bebas dari compile/type errors.
   - Commit menggunakan Conventional Commits dan push ke branch `dev`.
