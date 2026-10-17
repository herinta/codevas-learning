export type ClassCategory = "LIVE_CODE" | "DRAG_DROP" | "QUIZ";
export type ClassStatus = "available" | "coming-soon";

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
  category: ClassCategory;
  categoryLabel: string;
  title: string;
  tagline: string;
  stage: string;
  stageColor: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  levelName: string;
  levelBars: number;
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
  status: ClassStatus;
  accentBg: string;
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

export const CLASSES_LIST: ClassDetail[] = [
  // ================= 1. KATEGORI: LIVE CODE =================
  {
    id: "css-flexbox",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "CSS Flexbox",
    tagline:
      "Kuasai tata letak 1 dimensi dari aktivasi display: flex hingga jurus pamungkas mempusatkan div secara instan.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#ffd6ee] text-[#a02070]",
    level: "Pemula",
    levelName: "Level 1 • Beginner Friendly",
    levelBars: 1,
    rating: 4.9,
    reviewsCount: 636,
    studentsCount: 3120,
    onlineCount: 215,
    modulesCount: 10,
    puzzlesCount: 10,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 350,
    progressPercent: 30,
    completedModules: 3,
    status: "available",
    accentBg: "bg-primary-fixed",
    about:
      "Fokus MVP Live Code: Manipulasi sintaks CSS Flexbox dengan kanvas wireframe solid abu-abu yang berubah seketika saat kamu mengetik. 10 level tantangan berurutan mengasah naluri layouting tanpa rasa frustrasi.",
    prerequisites:
      "Mengenal tag HTML dasar (div, button, p). Langsung ngoding di browser tanpa setup apa pun.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "CSS Flexbox", "10 Levels", "MVP Focus"],
    modules: [
      {
        id: "fb-1",
        number: 1,
        title: "Level 1: The Activation",
        description: "Menyalakan display: flex pada container pembungkus.",
        status: "completed",
        xp: 30,
        duration: "15 Menit",
        puzzlesCount: 1,
        completedPuzzles: 1,
      },
      {
        id: "fb-2",
        number: 2,
        title: "Level 2: The Sniper",
        description: "Menggunakan justify-content: center untuk memusatkan item di sumbu utama.",
        status: "completed",
        xp: 30,
        duration: "15 Menit",
        puzzlesCount: 1,
        completedPuzzles: 1,
      },
      {
        id: "fb-3",
        number: 3,
        title: "Level 3: The Split",
        description: "Menggunakan justify-content: space-between untuk mendorong item ke tepi.",
        status: "completed",
        xp: 35,
        duration: "20 Menit",
        puzzlesCount: 1,
        completedPuzzles: 1,
      },
      {
        id: "fb-4",
        number: 4,
        title: "Level 4: The Breathing Room",
        description: "Menggunakan justify-content: space-evenly untuk jarak yang presisi rata.",
        status: "in-progress",
        xp: 35,
        duration: "20 Menit",
        puzzlesCount: 1,
      },
      {
        id: "fb-5",
        number: 5,
        title: "Level 5: The Push",
        description: "Menggunakan justify-content: flex-end untuk menempatkan item di ujung kanan.",
        status: "locked",
        xp: 35,
        duration: "20 Menit",
        puzzlesCount: 1,
      },
      {
        id: "fb-6",
        number: 6,
        title: "Level 6: The Gravity",
        description: "Menggunakan align-items: center untuk meratakan item di sumbu silang.",
        status: "locked",
        xp: 40,
        duration: "25 Menit",
        puzzlesCount: 1,
      },
      {
        id: "fb-7",
        number: 7,
        title: "Level 7: The Floor",
        description: "Menggunakan align-items: flex-end untuk menjatuhkan elemen ke bawah.",
        status: "locked",
        xp: 40,
        duration: "25 Menit",
        puzzlesCount: 1,
      },
      {
        id: "fb-8",
        number: 8,
        title: "Level 8: The Tetris Tower",
        description: "Mengubah orientasi layout dengan flex-direction: column.",
        status: "locked",
        xp: 45,
        duration: "30 Menit",
        puzzlesCount: 1,
      },
      {
        id: "fb-9",
        number: 9,
        title: "Level 9: The Gap",
        description: "Memberi jarak antar elemen secara bersih menggunakan properti gap.",
        status: "locked",
        xp: 45,
        duration: "30 Menit",
        puzzlesCount: 1,
      },
      {
        id: "fb-10",
        number: 10,
        title: "Level 10: Boss Fight - Centering Div",
        description: "Jurus pamungkas mempusatkan elemen secara horizontal dan vertikal sekaligus!",
        status: "locked",
        xp: 100,
        duration: "45 Menit",
        puzzlesCount: 1,
      },
    ],
  },
  {
    id: "css-grid",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "CSS Grid",
    tagline:
      "Arsitektur tata letak 2 dimensi modern dari papan blueprint dasar hingga merakit UI Bento Box.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#d4f8e8] text-[#1b5e20]",
    level: "Pemula",
    levelName: "Level 1 • Beginner Friendly",
    levelBars: 2,
    rating: 4.9,
    reviewsCount: 512,
    studentsCount: 2840,
    onlineCount: 178,
    modulesCount: 10,
    puzzlesCount: 10,
    estimatedHours: "5 Jam",
    hasCertificate: true,
    xpReward: 400,
    progressPercent: 10,
    completedModules: 1,
    status: "available",
    accentBg: "bg-emerald-100",
    about:
      "Kuasai sistem layout 2 dimensi paling bertenaga di web. Lewat 10 level interaktif, kamu akan belajar membagi kolom, memperlebar sel dengan col-span/row-span, hingga merakit Bento Box UI profesional.",
    prerequisites: "Selesai atau memahami dasar CSS Flexbox.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "CSS Grid", "10 Levels", "Bento Box"],
    modules: [
      {
        id: "gr-1",
        number: 1,
        title: "Level 1: The Blueprint",
        description: "Membuat papan kerja dengan grid-template-columns.",
        status: "completed",
        xp: 35,
        duration: "20 Menit",
        puzzlesCount: 1,
        completedPuzzles: 1,
      },
      {
        id: "gr-2",
        number: 2,
        title: "Level 2: The Triplets",
        description: "Membagi ruang menjadi 3 kolom rata dengan satuan fractional (1fr).",
        status: "in-progress",
        xp: 35,
        duration: "20 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-3",
        number: 3,
        title: "Level 3: The Asymmetry",
        description: "Merancang layout Sidebar sempit dan Konten lebar (1fr 3fr).",
        status: "locked",
        xp: 40,
        duration: "25 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-4",
        number: 4,
        title: "Level 4: The Alleyway",
        description: "Penerapan grid gap horizontal dan vertikal.",
        status: "locked",
        xp: 40,
        duration: "25 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-5",
        number: 5,
        title: "Level 5: The Header Expansion",
        description: "Memperlebar sel header melintasi seluruh kolom dengan col-span.",
        status: "locked",
        xp: 45,
        duration: "30 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-6",
        number: 6,
        title: "Level 6: The Tower Expansion",
        description: "Mempertinggi sel kartu menggunakan row-span.",
        status: "locked",
        xp: 45,
        duration: "30 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-7",
        number: 7,
        title: "Level 7: The VIP Pass",
        description: "Mengubah urutan render elemen menggunakan order.",
        status: "locked",
        xp: 50,
        duration: "30 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-8",
        number: 8,
        title: "Level 8: The Perfect Center",
        description: "Penyelarasan instan 2D menggunakan place-items-center.",
        status: "locked",
        xp: 50,
        duration: "30 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-9",
        number: 9,
        title: "Level 9: The Inception",
        description: "Menerapkan Flexbox di dalam sel Grid untuk komponen atomik.",
        status: "locked",
        xp: 55,
        duration: "35 Menit",
        puzzlesCount: 1,
      },
      {
        id: "gr-10",
        number: 10,
        title: "Level 10: Boss Fight - The Bento Box",
        description: "Merakit komponen modular menjadi UI Dashboard Bento Box utuh!",
        status: "locked",
        xp: 120,
        duration: "50 Menit",
        puzzlesCount: 1,
      },
    ],
  },
  {
    id: "component-styling",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "Component Styling",
    tagline:
      "Fokus pada estetika satu komponen terpusat: tombol, kartu, dan navbar dengan bayangan neo-brutalist dan border-radius.",
    stage: "Stage 2: The Artist",
    stageColor: "bg-[#eedcff] text-[#7c52aa]",
    level: "Menengah",
    levelName: "Level 2 • Component Aesthetics",
    levelBars: 2,
    rating: 4.9,
    reviewsCount: 380,
    studentsCount: 1950,
    onlineCount: 92,
    modulesCount: 8,
    puzzlesCount: 16,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 300,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-secondary-fixed",
    about: "Modul mendatang yang memfokuskan pada detail visual mikro komponen web modern.",
    prerequisites: "CSS Flexbox dan CSS Grid.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer",
      company: "Codevas",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Component", "Styling", "Candy Light Mode"],
    modules: [],
  },

  // ================= 2. KATEGORI: VISUAL LOGIC (DRAG & DROP) =================
  {
    id: "javascript-logic-blocks",
    category: "DRAG_DROP",
    categoryLabel: "Visual Logic (Drag & Drop)",
    title: "Javascript Logic Blocks",
    tagline:
      "Pendekatan drag-and-drop blok visual untuk membangun insting hierarki dan alur algoritma tanpa risiko syntax error.",
    stage: "Stage 3: The Masterpiece",
    stageColor: "bg-[#FEF08A] text-[#854d0e]",
    level: "Pemula",
    levelName: "Level 1 • Drag & Drop Visual",
    levelBars: 1,
    rating: 4.8,
    reviewsCount: 420,
    studentsCount: 2210,
    onlineCount: 110,
    modulesCount: 8,
    puzzlesCount: 20,
    estimatedHours: "3 Jam",
    hasCertificate: true,
    xpReward: 280,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-amber-100",
    about:
      "Dirancang untuk pemula yang ingin memahami logika algoritma (variabel, kondisi if-else, pengulangan) tanpa perlu mengetik sintaks secara manual.",
    prerequisites: "Tidak ada prasyarat. Terbuka untuk semua usia dan pemula total.",
    instructor: {
      name: "Farhan Ardiansyah",
      role: "Senior Software Architect",
      company: "Codevas Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Drag & Drop", "Logic Blocks", "Visual Programming"],
    modules: [],
  },
  {
    id: "css-layouting-hierarchy",
    category: "DRAG_DROP",
    categoryLabel: "Visual Logic (Drag & Drop)",
    title: "CSS Layouting Hierarchy",
    tagline:
      "Susun balok hierarki parent-child, positioning, dan relative vs absolute lewat antarmuka interaktif yang menyenangkan.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#ffd6ee] text-[#a02070]",
    level: "Pemula",
    levelName: "Level 1 • Visual Layouting",
    levelBars: 1,
    rating: 4.9,
    reviewsCount: 310,
    studentsCount: 1650,
    onlineCount: 85,
    modulesCount: 6,
    puzzlesCount: 15,
    estimatedHours: "3 Jam",
    hasCertificate: true,
    xpReward: 250,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-pink-100",
    about: "Eksplorasi hierarki pembungkus CSS dengan menyusun blok-blok visual secara berurutan.",
    prerequisites: "Pengenalan dasar tampilan antarmuka web.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer",
      company: "Codevas",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Hierarchy", "Parent-Child", "Visual Blocks"],
    modules: [],
  },
  {
    id: "html-dom-tree-assembly",
    category: "DRAG_DROP",
    categoryLabel: "Visual Logic (Drag & Drop)",
    title: "HTML DOM Tree Assembly",
    tagline:
      "Merakit struktur pohon HTML DOM dari tag html, head, body, hingga komponen bersarang layaknya lego visual.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#c8eaff] text-[#006080]",
    level: "Pemula",
    levelName: "Level 1 • DOM Tree",
    levelBars: 1,
    rating: 4.8,
    reviewsCount: 290,
    studentsCount: 1420,
    onlineCount: 65,
    modulesCount: 6,
    puzzlesCount: 12,
    estimatedHours: "2.5 Jam",
    hasCertificate: true,
    xpReward: 220,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-tertiary-fixed",
    about: "Pahami hierarki pohon DOM tanpa salah penutup tag dengan mekanisme drag-and-drop lego.",
    prerequisites: "Tidak ada.",
    instructor: {
      name: "Farhan Ardiansyah",
      role: "Senior Software Architect",
      company: "Codevas Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["HTML DOM", "Tree", "Drag & Drop"],
    modules: [],
  },

  // ================= 3. KATEGORI: THEORY (MULTIPLE CHOICE) =================
  {
    id: "css-selectors-quiz",
    category: "QUIZ",
    categoryLabel: "Theory (Multiple Choice)",
    title: "CSS Selectors Quiz",
    tagline:
      "Kuis antarmuka interaktif menguji pemahaman class, id, pseudo-classes (:hover, :focus, :nth-child), dan spesifisitas.",
    stage: "Stage 2: The Artist",
    stageColor: "bg-[#eedcff] text-[#7c52aa]",
    level: "Pemula",
    levelName: "Level 1 • Quiz Cepat",
    levelBars: 1,
    rating: 4.9,
    reviewsCount: 520,
    studentsCount: 2780,
    onlineCount: 140,
    modulesCount: 5,
    puzzlesCount: 25,
    estimatedHours: "2 Jam",
    hasCertificate: true,
    xpReward: 200,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-secondary-fixed",
    about: "Kuis kilat gamifikasi dengan tantangan menebak selector yang tepat untuk memanipulasi target UI.",
    prerequisites: "Dasar penamaan selector CSS.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer",
      company: "Codevas",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Quiz", "CSS Selectors", "Multiple Choice"],
    modules: [],
  },
  {
    id: "html-semantic-quiz",
    category: "QUIZ",
    categoryLabel: "Theory (Multiple Choice)",
    title: "HTML Semantic Quiz",
    tagline:
      "Tantangan kuis pilihan ganda membedakan penggunaan tag section, article, nav, aside, dan main sesuai standar aksesibilitas.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#d4f8e8] text-[#1b5e20]",
    level: "Pemula",
    levelName: "Level 1 • Semantic Quiz",
    levelBars: 1,
    rating: 4.9,
    reviewsCount: 460,
    studentsCount: 2340,
    onlineCount: 98,
    modulesCount: 5,
    puzzlesCount: 20,
    estimatedHours: "1.5 Jam",
    hasCertificate: true,
    xpReward: 180,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-emerald-100",
    about: "Pelajari kaidah semantik HTML5 modern untuk SEO dan aksesibilitas ramah screen-reader.",
    prerequisites: "Pengenalan tag HTML.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer",
      company: "Codevas",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Quiz", "HTML5", "Semantics", "Accessibility"],
    modules: [],
  },
  {
    id: "js-fundamentals-quiz",
    category: "QUIZ",
    categoryLabel: "Theory (Multiple Choice)",
    title: "JS Fundamentals Quiz",
    tagline:
      "Asah logika teoretis JavaScript: tipe data primitif, coercion, scope let vs const, dan hoisting sebelum terjun ke editor.",
    stage: "Stage 3: The Masterpiece",
    stageColor: "bg-[#FEF08A] text-[#854d0e]",
    level: "Menengah",
    levelName: "Level 2 • JS Theory Quiz",
    levelBars: 2,
    rating: 4.8,
    reviewsCount: 680,
    studentsCount: 3100,
    onlineCount: 165,
    modulesCount: 6,
    puzzlesCount: 30,
    estimatedHours: "2.5 Jam",
    hasCertificate: true,
    xpReward: 250,
    progressPercent: 0,
    completedModules: 0,
    status: "coming-soon",
    accentBg: "bg-amber-100",
    about: "Kuis interaktif pilihan ganda untuk menajamkan pemahaman konsep fondasi JavaScript modern.",
    prerequisites: "Dasar variabel dan fungsi JavaScript.",
    instructor: {
      name: "Farhan Ardiansyah",
      role: "Senior Software Architect",
      company: "Codevas Engineering",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Quiz", "JavaScript", "Theory", "Multiple Choice"],
    modules: [],
  },
];

// Helper Map
export const CLASSES_MAP: Record<string, ClassDetail> = CLASSES_LIST.reduce(
  (acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  },
  {} as Record<string, ClassDetail>
);

// Backward-compatibility aliases
CLASSES_MAP["css-flexbox-magic"] = CLASSES_MAP["css-flexbox"];
CLASSES_MAP["advanced-js-logic"] = CLASSES_MAP["css-grid"];

export const DEFAULT_CLASS = CLASSES_MAP["css-flexbox"];
