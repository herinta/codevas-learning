export interface ModuleItem {
  id: string;
  number: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  xp: number;
  duration: string;
  puzzlesCount: number;
  completedPuzzles?: number;
}

export interface ClassDetail {
  id: string;
  category: "html-css" | "javascript" | "react" | "fullstack";
  title: string;
  tagline: string;
  stage: string;
  stageColor: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  levelName: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  onlineCount: number;
  modulesCount: number;
  puzzlesCount: number;
  estimatedHours: string;
  hasCertificate: boolean;
  xpReward: number;
  progressPercent: number;
  completedModules: number;
  about: string;
  prerequisites: string;
  instructor: {
    name: string;
    role: string;
    company: string;
    avatarUrl: string;
  };
  modules: ModuleItem[];
  tags: string[];
}

export const CLASSES_MAP: Record<string, ClassDetail> = {
  "css-flexbox-magic": {
    id: "css-flexbox-magic",
    category: "html-css",
    title: "CSS Styling & Flexbox Magic: Menguasai Tata Letak Modern",
    tagline:
      "Kuasai alignment dinamis, flex container, space distribution, dan tata letak responsif tanpa pusing menghafal rumus kuno.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#ffd6ee] text-[#a02070]",
    level: "Pemula",
    levelName: "Level 1 • Beginner Friendly",
    rating: 4.9,
    reviewsCount: 636,
    studentsCount: 3120,
    onlineCount: 215,
    modulesCount: 6,
    puzzlesCount: 24,
    estimatedHours: "8 Jam",
    hasCertificate: true,
    xpReward: 350,
    progressPercent: 35,
    completedModules: 2,
    about:
      "CSS Flexbox adalah kunci utama dalam membangun antarmuka web modern yang responsif. Alih-alih membaca dokumentasi yang membosankan, kelas ini melatih insting tata letakmu melalui eksperimen langsung di browser: geser alignment, ubah arah flex, dan perbaiki template yang sengaja dibuat 'rusak' secara real-time.",
    prerequisites:
      "Dasar HTML semantik sederhana (div, section, p, button). Tidak memerlukan instalasi lokal apapun.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Ex-Startup Unicorn",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["CSS3", "Flexbox", "Responsive Design", "UI Layout"],
    modules: [
      {
        id: "mod-1",
        number: 1,
        title: "Pondasi Display Flex & Axis Utama (Main Axis)",
        description:
          "Memahami perbedaan inline vs flex container, flex-direction row vs column, dan konsep dasar main-axis vs cross-axis.",
        status: "completed",
        xp: 80,
        duration: "45 Menit",
        puzzlesCount: 4,
        completedPuzzles: 4,
      },
      {
        id: "mod-2",
        number: 2,
        title: "Justify Content & Distribusi Ruang Spasial",
        description:
          "Eksperimen langsung dengan space-between, space-around, center, dan flex-end untuk merapikan kartu konten.",
        status: "in-progress",
        xp: 100,
        duration: "1 Jam",
        puzzlesCount: 5,
        completedPuzzles: 2,
      },
      {
        id: "mod-3",
        number: 3,
        title: "Align Items & Align Self: Menaklukkan Centering Vertikal",
        description:
          "Trik centering vertikal legendaris yang kini semudah satu baris kode. Meluruskan avatar, badge, dan tombol aksi.",
        status: "locked",
        xp: 90,
        duration: "50 Menit",
        puzzlesCount: 5,
      },
      {
        id: "mod-4",
        number: 4,
        title: "Flex Wrap, Gap, & Card Grid Responsif",
        description:
          "Membuat grid kartu responsif otomatis turun baris tanpa perlu media queries rumit.",
        status: "locked",
        xp: 120,
        duration: "1.5 Jam",
        puzzlesCount: 6,
      },
      {
        id: "mod-5",
        number: 5,
        title: "Flex Grow, Shrink, & Basis: Kontrol Proporsi Item",
        description:
          "Mengatur bagaimana elemen bertambah besar atau mengecil secara luwes ketika ukuran layar ponsel berubah.",
        status: "locked",
        xp: 140,
        duration: "1 Jam",
        puzzlesCount: 4,
      },
      {
        id: "mod-6",
        number: 6,
        title: "Proyek Akhir: Slicing Dashboard E-Commerce Navbar & Sidebar",
        description:
          "Menyusun struktur layout utuh dari dashboard modern dengan split-pane flexbox dan navigasi responsif.",
        status: "locked",
        xp: 250,
        duration: "2 Jam",
        puzzlesCount: 1,
      },
    ],
  },
  "advanced-js-logic": {
    id: "advanced-js-logic",
    category: "javascript",
    title: "Advanced JS Logic, Async & Algorithms",
    tagline:
      "Kuasai eksekusi asynchronous, Promises, event loops, web workers, dan pola algoritma JavaScript modern lewat kuis interaktif.",
    stage: "Stage 3: The Masterpiece",
    stageColor: "bg-[#c8eaff] text-[#006080]",
    level: "Menengah",
    levelName: "Level 4 • Intermediate Mastery",
    rating: 4.9,
    reviewsCount: 2450,
    studentsCount: 5820,
    onlineCount: 184,
    modulesCount: 8,
    puzzlesCount: 48,
    estimatedHours: "12 Jam",
    hasCertificate: true,
    xpReward: 450,
    progressPercent: 25,
    completedModules: 2,
    about:
      "Banyak developer memahami sintaks dasar JavaScript, tetapi sering tersandung ketika menghadapi race conditions, callback hell, atau microtasks vs macrotasks di browser modern. Kelas ini membawa pendekatan direct coding: langsung pecahkan puzzle kode di browser kamu dengan validasi sintaks pintar instan.",
    prerequisites:
      "Memahami sintaks dasar JavaScript (Variables, Functions, Loops, Array/Object destructuring) & manipulasi DOM sederhana.",
    instructor: {
      name: "Farhan Ardiansyah",
      role: "Senior Software Architect",
      company: "Codevas Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["JavaScript", "Async/Await", "Promises", "Event Loop", "Algorithms"],
    modules: [
      {
        id: "adv-1",
        number: 1,
        title: "Execution Context, Call Stack & Hoisting Deep-Dive",
        description:
          "Membedah cara mesin V8 membaca kode JS: Creation Phase vs Execution Phase dan Lexical Environment.",
        status: "completed",
        xp: 100,
        duration: "1 Jam",
        puzzlesCount: 6,
        completedPuzzles: 6,
      },
      {
        id: "adv-2",
        number: 2,
        title: "Event Loop, Task Queue & Microtask Prioritization",
        description:
          "Menyelesaikan teka-teki urutan output console antara setTimeout, Promise.then, queueMicrotask, dan synchronous code.",
        status: "in-progress",
        xp: 120,
        duration: "1.5 Jam",
        puzzlesCount: 6,
        completedPuzzles: 3,
      },
      {
        id: "adv-3",
        number: 3,
        title: "Mastering Promises: All, AllSettled, Race, & Any",
        description:
          "Menangani multiple asynchronous fetch calls secara paralel tanpa blocking render UI pengguna.",
        status: "locked",
        xp: 150,
        duration: "1.5 Jam",
        puzzlesCount: 8,
      },
      {
        id: "adv-4",
        number: 4,
        title: "Async/Await Best Practices & Bulletproof Error Handling",
        description:
          "Pola try/catch bertingkat, custom error classes, dan retry mechanisms saat koneksi jaringan terputus.",
        status: "locked",
        xp: 140,
        duration: "1 Jam",
        puzzlesCount: 6,
      },
      {
        id: "adv-5",
        number: 5,
        title: "Closures, Currying & Functional Programming Patterns",
        description:
          "Teknik memoization, debounce, throttle, dan partial application untuk performa antarmuka sekelas enterprise.",
        status: "locked",
        xp: 180,
        duration: "2 Jam",
        puzzlesCount: 8,
      },
      {
        id: "adv-6",
        number: 6,
        title: "Proyek Masterpiece: Custom Real-Time Event Bus & State Machine",
        description:
          "Membangun reactive pub/sub architecture dari nol dengan vanilla JavaScript modern.",
        status: "locked",
        xp: 300,
        duration: "3 Jam",
        puzzlesCount: 2,
      },
    ],
  },
};

// Default fallback class
export const DEFAULT_CLASS = CLASSES_MAP["css-flexbox-magic"];
