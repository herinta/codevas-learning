# Codevas (Code Canvas) - Project Plan

## 1. Product Vision
**Codevas** adalah *Interactive UI Learning Engine*. Platform ini menjembatani pelajar (remaja/pemula) yang sedang beralih dari *visual programming* (Scratch/Roblox) ke *text-based syntax* (HTML/CSS/JS/React). 
Alih-alih memberikan kanvas kosong yang mengintimidasi, Codevas menyediakan *template* antarmuka web modern yang sengaja dibuat "rusak" atau belum selesai. Pengguna belajar dengan cara memanipulasi *template* tersebut secara *real-time*.

## 2. Design System: Candy Light Mode
*   **Vibe:** Playful, clean, dan ramah pemula, namun tetap terasa seperti alat kerja *developer* sungguhan.
*   **Warna:** Latar belakang terang (*off-white*) dengan blok warna solid pastel (Bubblegum Pink, Mint Green, Lemon Yellow, Sky Blue) tanpa gradasi.
*   **Layout Utama (Split-Screen):** Kanvas visual di sebelah kiri, Monaco Editor di kanan atas, dan *Mission Control* (Instruksi & Auto-Validator) di kanan bawah.

## 3. Tech Stack & AI Workflow
*   **Frontend:** Next.js, Tailwind CSS, Monaco Editor, Framer Motion.
*   **Backend & DB (Future Scope):** Spring Boot, PostgreSQL, Docker (Self-hosted via Synology).
*   **AI Developer Workflow (The Secret Weapon):**
    1.  **Google Stitch:** Digunakan untuk *generate* desain UI mentah (*Candy Light Mode*) di *browser*.
    2.  **Google Antigravity (MCP):** Digunakan di IDE untuk melakukan *slicing* desain dari Stitch menjadi komponen Next.js yang modular secara otomatis.

## 4. Curriculum Architecture
Pembelajaran dibagi menjadi 3 tahap (*Progressive Disclosure*):
*   **Stage 1: The Architect (Layouting)**
    *   Fokus pada tata letak spasial (Flexbox & CSS Grid).
    *   Visual kanvas hanya berupa blok/kotak *wireframe* solid abu-abu.
*   **Stage 2: The Artist (Component Styling)**
    *   Fokus pada estetika satu komponen terpusat (Card, Button, Navbar).
    *   Bermain dengan *border-radius*, *shadow*, warna, dan tipografi.
*   **Stage 3: The Masterpiece (Full Web & Logic)**
    *   Simulasi *developer* penuh. Muncul mode Terminal.
    *   Integrasi React state dan manipulasi DOM interaktif pada halaman web skala penuh.

## 5. Development Roadmap (Next Steps)
- [x] Inisialisasi Next.js kosong.
- [x] Setup integrasi Stitch MCP di Antigravity.
- [x] Generate desain UI di Stitch (Landing Page, Login, Register, Workspace, Quiz).
- [x] Eksekusi *slicing* modular: Landing Page (`app/page.tsx`), Login (`app/login/page.tsx`), dan Register (`app/register/page.tsx`).
- [ ] Bangun UI untuk *Split-screen Workspace*.
- [ ] Implementasi integrasi Monaco Editor dan *Live Iframe Auto-validation*.