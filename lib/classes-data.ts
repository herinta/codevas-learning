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
    id: "html-architecture",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "HTML Architecture (The Skeletons & Hierarchy)",
    tagline:
      "Memahami logika 'Kardus' (Container), hierarki parent-child, nesting, dan kapan harus membungkus elemen.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#c8eaff] text-[#006080]",
    level: "Pemula",
    levelName: "Level 1 • Beginner Friendly",
    levelBars: 1,
    rating: 4.95,
    reviewsCount: 920,
    studentsCount: 4500,
    onlineCount: 340,
    modulesCount: 12,
    puzzlesCount: 12,
    estimatedHours: "3 Jam",
    hasCertificate: true,
    xpReward: 420,
    progressPercent: 0,
    completedModules: 0,
    status: "available",
    accentBg: "bg-tertiary-fixed",
    about:
      "Pondasi logika kontainer web: pahami hierarki parent-child, teknik membungkus div (kardus dalam kardus), elemen self-closing, tautan, list, hingga semantik sebelum ditata oleh CSS.",
    prerequisites:
      "Tidak ada prasyarat. Terbuka untuk semua yang baru pertama kali memulai belajar web.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "HTML Architecture", "DOM Hierarchy", "12 Levels"],
    modules: [
      { id: "html-1", number: 1, title: "Level 1: The Raw Content", description: "Buat judul utama h1 dengan teks 'Profil Saya'.", status: "in-progress", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "html-2", number: 2, title: "Level 2: The Paragraph", description: "Tambahkan tag p di bawah judul untuk menulis deskripsi singkat.", status: "locked", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "html-3", number: 3, title: "Level 3: The First Box (Container)", description: "Bungkus tag h1 dan p ke dalam kardus pembungkus div.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-4", number: 4, title: "Level 4: The Siblings", description: "Buat dua buah div atas dan bawah yang sejajar (siblings).", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-5", number: 5, title: "Level 5: The Matryoshka (Nesting)", description: "Kardus dalam kardus: 1 div parent membungkus 2 div child foto dan teks.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-6", number: 6, title: "Level 6: The Image Element", description: "Tampilkan gambar menggunakan tag self-closing img dengan atribut src.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-7", number: 7, title: "Level 7: The Action (Button)", description: "Tambahkan tombol interaktif menggunakan tag button bertuliskan 'Follow'.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-8", number: 8, title: "Level 8: The Link", description: "Buat teks yang bisa diklik dengan tag a dan atribut href.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-9", number: 9, title: "Level 9: The List Hierarchy", description: "Buat daftar hobi menggunakan hierarki ul membungkus item li.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-10", number: 10, title: "Level 10: The Semantic Touch", description: "Gunakan tag semantik section untuk membungkus blok konten besar.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-11", number: 11, title: "Level 11: The Form Wrapper", description: "Bungkus form input dan tombol submit ke dalam tag form.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-12", number: 12, title: "Level 12: Boss Fight - The Card Structure", description: "Ujian kerangka: Bangun pohon hierarki lengkap untuk Profile Card!", status: "locked", xp: 100, duration: "35 Menit", puzzlesCount: 1 },
    ],
  },
  {
    id: "css-basics",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "CSS Basics (The Fundamentals)",
    tagline:
      "Kuasai Box Model, warna, tipografi, padding, margin, border, dan bayangan neo-brutalisme dari kanvas dasar.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#c8eaff] text-[#006080]",
    level: "Pemula",
    levelName: "Level 1 • Beginner Friendly",
    levelBars: 1,
    rating: 4.95,
    reviewsCount: 780,
    studentsCount: 3890,
    onlineCount: 290,
    modulesCount: 12,
    puzzlesCount: 12,
    estimatedHours: "3.5 Jam",
    hasCertificate: true,
    xpReward: 450,
    progressPercent: 0,
    completedModules: 0,
    status: "available",
    accentBg: "bg-tertiary-fixed",
    about:
      "Fondasi mutlak desain web: kuasai Box Model, warna kanvas, tinta teks, tipografi terstruktur, padding, margin, border, hingga bayangan elevasi melalui 12 level tantangan interaktif.",
    prerequisites:
      "Tidak ada prasyarat. Terbuka untuk pemula total yang ingin belajar langsung di kanvas browser.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "CSS Basics", "Box Model", "Typography", "12 Levels"],
    modules: [
      { id: "basics-1", number: 1, title: "Level 1: The Canvas", description: "Warnai latar belakang kanvas menjadi biru muda dengan background-color: lightblue.", status: "in-progress", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "basics-2", number: 2, title: "Level 2: The Ink", description: "Ubah warna teks menjadi putih gelap dengan color: #333 agar terbaca kontras.", status: "locked", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "basics-3", number: 3, title: "Level 3: The Typographer", description: "Perbesar ukuran teks menggunakan font-size: 24px.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "basics-4", number: 4, title: "Level 4: The Bold Statement", description: "Buat judul lebih tegas dan berwibawa menggunakan font-weight: bold.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "basics-5", number: 5, title: "Level 5: The Emphasis", description: "Beri penekanan miring pada kutipan menggunakan font-style: italic.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "basics-6", number: 6, title: "Level 6: The Alignment", description: "Pusatkan alur teks horizontal menggunakan text-align: center.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "basics-7", number: 7, title: "Level 7: The Inner Space (Padding)", description: "Beri ruang napas di dalam kotak dengan padding: 20px.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "basics-8", number: 8, title: "Level 8: The Outer Space (Margin)", description: "Dorong kotak saling menjauh dengan jarak luar margin: 15px.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "basics-9", number: 9, title: "Level 9: The Frame", description: "Beri batasan garis tepi tegas dengan border: 2px solid black.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "basics-10", number: 10, title: "Level 10: The Soft Edges", description: "Lengkungkan sudut kotak kaku menggunakan border-radius: 12px.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "basics-11", number: 11, title: "Level 11: The Illusion of Depth", description: "Tambahkan bayangan lembut menggunakan box-shadow: 0px 4px 10px rgba(0,0,0,0.1).", status: "locked", xp: 60, duration: "25 Menit", puzzlesCount: 1 },
      { id: "basics-12", number: 12, title: "Level 12: Boss Fight - The Notification Badge", description: "Ubah elemen span menjadi badge notifikasi modern lengkap dengan sudut bulat sempurna!", status: "locked", xp: 100, duration: "35 Menit", puzzlesCount: 1 },
    ],
  },
  {
    id: "css-flexbox",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "CSS Flexbox",
    tagline:
      "Kuasai tata letak 1 dimensi dari aktivasi display: flex hingga jurus pamungkas mempusatkan navbar modern.",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#ffd6ee] text-[#a02070]",
    level: "Pemula",
    levelName: "Level 1 • Beginner Friendly",
    levelBars: 1,
    rating: 4.9,
    reviewsCount: 636,
    studentsCount: 3120,
    onlineCount: 215,
    modulesCount: 12,
    puzzlesCount: 12,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 450,
    progressPercent: 25,
    completedModules: 3,
    status: "available",
    accentBg: "bg-primary-fixed",
    about:
      "Manipulasi sintaks CSS Flexbox dengan kanvas interaktif yang merespons seketika saat kamu mengetik. 12 level tantangan mengasah naluri layouting 1 dimensi tanpa rasa frustrasi.",
    prerequisites:
      "Mengenal tag HTML dasar. Langsung ngoding di browser tanpa instalasi apa pun.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "CSS Flexbox", "12 Levels", "Responsive"],
    modules: [
      { id: "fb-1", number: 1, title: "Level 1: The Activation", description: "Nyalakan mode Flexbox pada container dengan display: flex.", status: "completed", xp: 30, duration: "15 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "fb-2", number: 2, title: "Level 2: The Push (Justify End)", description: "Dorong semua kotak ke ujung kanan dengan justify-content: flex-end.", status: "completed", xp: 30, duration: "15 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "fb-3", number: 3, title: "Level 3: The Center Stage", description: "Kumpulkan kotak tepat di tengah secara horizontal dengan justify-content: center.", status: "completed", xp: 35, duration: "15 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "fb-4", number: 4, title: "Level 4: The Split", description: "Pisahkan kotak kiri dan kanan menyentuh dinding dengan justify-content: space-between.", status: "in-progress", xp: 35, duration: "20 Menit", puzzlesCount: 1 },
      { id: "fb-5", number: 5, title: "Level 5: The Social Distancing", description: "Beri jarak adil merata antar kotak dengan justify-content: space-evenly.", status: "locked", xp: 35, duration: "20 Menit", puzzlesCount: 1 },
      { id: "fb-6", number: 6, title: "Level 6: The Gravity (Align Items)", description: "Tarik kotak ke tengah secara vertikal menggunakan align-items: center.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "fb-7", number: 7, title: "Level 7: The Floor", description: "Jatuhkan kotak ke lantai dasar kanvas dengan align-items: flex-end.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "fb-8", number: 8, title: "Level 8: The Column", description: "Ubah arah aliran tumpukan menjadi kolom dengan flex-direction: column.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "fb-9", number: 9, title: "Level 9: The Gap", description: "Beri jarak rapi antar kotak tanpa ribet menghitung margin dengan gap: 20px.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "fb-10", number: 10, title: "Level 10: The Overflow (Wrap)", description: "Izinkan elemen turun ke baris baru saat ruang sempit dengan flex-wrap: wrap.", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "fb-11", number: 11, title: "Level 11: The Perfect Center", description: "Jurus pamungkas pusatkan elemen di tengah kanvas (justify-content & align-items: center).", status: "locked", xp: 60, duration: "30 Menit", puzzlesCount: 1 },
      { id: "fb-12", number: 12, title: "Level 12: Boss Fight - The Modern Navbar", description: "Rakit Navbar lengkap: Logo di kiri, menu di kanan, dan sejajar sempurna secara vertikal!", status: "locked", xp: 100, duration: "40 Menit", puzzlesCount: 1 },
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
    modulesCount: 12,
    puzzlesCount: 12,
    estimatedHours: "5 Jam",
    hasCertificate: true,
    xpReward: 480,
    progressPercent: 10,
    completedModules: 1,
    status: "available",
    accentBg: "bg-emerald-100",
    about:
      "Kuasai sistem layout 2 dimensi paling bertenaga di web. Lewat 12 level interaktif, kamu akan belajar membagi kolom, memperlebar sel dengan span, hingga merakit Bento Box UI ala Apple.",
    prerequisites: "Selesai atau memahami dasar CSS Flexbox.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "CSS Grid", "12 Levels", "Bento Box"],
    modules: [
      { id: "gr-1", number: 1, title: "Level 1: The Blueprint", description: "Belah container menjadi 2 kolom sama besar dengan grid-template-columns: 1fr 1fr.", status: "completed", xp: 35, duration: "15 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "gr-2", number: 2, title: "Level 2: The Triplets", description: "Buat 3 kolom rata dengan fungsi ringkas repeat(3, 1fr).", status: "in-progress", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "gr-3", number: 3, title: "Level 3: The Asymmetry", description: "Buat layout Sidebar fix 250px dan konten fleksibel 1fr.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "gr-4", number: 4, title: "Level 4: The Alleyway", description: "Beri pemisah lorong sel grid sebesar 24px dengan gap: 24px.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "gr-5", number: 5, title: "Level 5: The Header Expansion", description: "Bentangkan sel Header melintasi 3 kolom dengan grid-column: span 3.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "gr-6", number: 6, title: "Level 6: The Tower Expansion", description: "Tinggikan menara Sidebar memakan 2 baris dengan grid-row: span 2.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "gr-7", number: 7, title: "Level 7: The Absolute Placement", description: "Posisikan elemen dari garis grid 1 hingga 3 dengan grid-column: 1 / 3.", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "gr-8", number: 8, title: "Level 8: The Grid Center", description: "Pusatkan elemen secara instan di sumbu 2D dengan place-items: center.", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "gr-9", number: 9, title: "Level 9: The Responsive Magic", description: "Buat grid adaptif otomatis dengan repeat(auto-fit, minmax(200px, 1fr)).", status: "locked", xp: 55, duration: "30 Menit", puzzlesCount: 1 },
      { id: "gr-10", number: 10, title: "Level 10: The Canvas Paint (Grid Areas)", description: "Beri nama area sel grid dengan grid-area: header.", status: "locked", xp: 55, duration: "30 Menit", puzzlesCount: 1 },
      { id: "gr-11", number: 11, title: "Level 11: The Inception", description: "Padukan Flexbox di dalam sel Grid untuk memusatkan teks komponen mikro.", status: "locked", xp: 60, duration: "35 Menit", puzzlesCount: 1 },
      { id: "gr-12", number: 12, title: "Level 12: Boss Fight - The Bento Box Dashboard", description: "Ujian Akhir: Rakit layout Bento Box Dashboard modern ala Apple dengan repeat dan span!", status: "locked", xp: 100, duration: "45 Menit", puzzlesCount: 1 },
    ],
  },
  {
    id: "component-styling",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "Component Styling",
    tagline:
      "Fokus pada estetika mikro komponen web: tombol interaktif, form focus, avatar bulat, dan glassmorphism.",
    stage: "Stage 2: The Artist",
    stageColor: "bg-[#eedcff] text-[#7c52aa]",
    level: "Menengah",
    levelName: "Level 2 • Component Aesthetics",
    levelBars: 2,
    rating: 4.9,
    reviewsCount: 380,
    studentsCount: 1950,
    onlineCount: 92,
    modulesCount: 12,
    puzzlesCount: 12,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 480,
    progressPercent: 0,
    completedModules: 0,
    status: "available",
    accentBg: "bg-secondary-fixed",
    about: "Kuasai seni mendesain detail visual komponen antarmuka modern dari tombol, form input, avatar, pill, hingga kartu e-commerce.",
    prerequisites: "CSS Flexbox dan CSS Grid.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer",
      company: "Codevas",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Component", "Styling", "Candy Light Mode", "12 Levels"],
    modules: [
      { id: "cs-1", number: 1, title: "Level 1: The Primary Button", description: "Hilangkan border bawaan, beri padding dan background biru menyala.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "cs-2", number: 2, title: "Level 2: The Hover Lift", description: "Beri reaksi sentuhan tombol dengan pseudo-class :hover (#1d4ed8).", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "cs-3", number: 3, title: "Level 3: The Input Field", description: "Percantik form input dengan padding dan sudut membulat ringan.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "cs-4", number: 4, title: "Level 4: The Focus Ring", description: "Beri highlight border biru dan outline: none saat input aktif (:focus).", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "cs-5", number: 5, title: "Level 5: The Profile Avatar", description: "Ubah foto menjadi lingkaran profil dengan border-radius: 50% dan object-fit: cover.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "cs-6", number: 6, title: "Level 6: The Floating Dot (Absolute)", description: "Posisikan badge titik merah melayang di pojok atas avatar dengan position: absolute.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "cs-7", number: 7, title: "Level 7: The Tag / Pill", description: "Ubah teks kategori menjadi Pill badge dengan border-radius: 999px.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "cs-8", number: 8, title: "Level 8: The Transparent Glass", description: "Beri efek transparan putih dengan background-color: rgba(255, 255, 255, 0.2).", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "cs-9", number: 9, title: "Level 9: The Blur Effect", description: "Sempurnakan efek kaca dengan backdrop-filter: blur(10px).", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "cs-10", number: 10, title: "Level 10: The Skeleton Loader", description: "Buat loading state abu-abu polos tanpa teks.", status: "locked", xp: 55, duration: "30 Menit", puzzlesCount: 1 },
      { id: "cs-11", number: 11, title: "Level 11: The Pricing Card Base", description: "Fondasi kartu harga: Flex-col, background putih, padding besar, dan box-shadow.", status: "locked", xp: 55, duration: "30 Menit", puzzlesCount: 1 },
      { id: "cs-12", number: 12, title: "Level 12: Boss Fight - The E-Commerce Card", description: "Rakit kartu produk utuh memadukan avatar, badge diskon, tipografi, dan tombol beli!", status: "locked", xp: 100, duration: "45 Menit", puzzlesCount: 1 },
    ],
  },
  {
    id: "tailwind-css",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "Tailwind CSS (The Modern Way)",
    tagline:
      "Konversi pemahaman CSS murni menjadi penulisan Utility Classes modern standar industri teknologi.",
    stage: "Stage 2: The Artist",
    stageColor: "bg-[#c8eaff] text-[#006080]",
    level: "Pemula",
    levelName: "Level 1 • Utility First",
    levelBars: 2,
    rating: 4.95,
    reviewsCount: 840,
    studentsCount: 4120,
    onlineCount: 310,
    modulesCount: 12,
    puzzlesCount: 12,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 500,
    progressPercent: 0,
    completedModules: 0,
    status: "available",
    accentBg: "bg-tertiary-fixed",
    about: "Pelajari utility-first workflow yang digunakan developer modern: warna, ukuran, spacing, flexbox, grid, breakpoints responsif, hingga dark mode.",
    prerequisites: "Memahami dasar CSS Box Model dan Flexbox.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer",
      company: "Codevas",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Tailwind CSS", "Utility First", "Live Code", "12 Levels"],
    modules: [
      { id: "tw-1", number: 1, title: "Level 1: The Translation", description: "Terapkan class text-white bg-red-500 langsung di HTML.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "tw-2", number: 2, title: "Level 2: The Sizer", description: "Penuhi layar dengan utilitas w-full dan h-screen.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "tw-3", number: 3, title: "Level 3: The Spacing Scale", description: "Beri ruang dengan mudah menggunakan p-4 dan mb-6.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "tw-4", number: 4, title: "Level 4: The Flex Utility", description: "Panggil Flexbox instan dengan flex justify-between items-center.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "tw-5", number: 5, title: "Level 5: The Grid Utility", description: "Rakit tata letak grid dengan grid grid-cols-3 gap-4.", status: "locked", xp: 40, duration: "20 Menit", puzzlesCount: 1 },
      { id: "tw-6", number: 6, title: "Level 6: The Typo Scale", description: "Format tipografi dengan text-2xl font-bold text-gray-800.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "tw-7", number: 7, title: "Level 7: The Modern Polish", description: "Percantik kotak dengan rounded-2xl shadow-xl border border-gray-100.", status: "locked", xp: 45, duration: "25 Menit", puzzlesCount: 1 },
      { id: "tw-8", number: 8, title: "Level 8: The Interactive State", description: "Beri efek sentuhan dengan hover:bg-blue-600 transition-colors.", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "tw-9", number: 9, title: "Level 9: The Responsive Breakpoint", description: "Bikin tampilan adaptif dengan kombinasi flex-col md:flex-row.", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "tw-10", number: 10, title: "Level 10: The Dark Mode", description: "Dukung tema malam dengan bg-white dark:bg-slate-900.", status: "locked", xp: 55, duration: "30 Menit", puzzlesCount: 1 },
      { id: "tw-11", number: 11, title: "Level 11: Arbitrary Values", description: "Gunakan kurung siku untuk ukuran spesifik: w-[321px].", status: "locked", xp: 55, duration: "30 Menit", puzzlesCount: 1 },
      { id: "tw-12", number: 12, title: "Level 12: Boss Fight - The Glassmorphism Card", description: "Ujian Akhir: Buat kartu efek kaca super modern hanya dengan kombinasi class Tailwind!", status: "locked", xp: 100, duration: "45 Menit", puzzlesCount: 1 },
    ],
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
CLASSES_MAP["js-logic-blocks"] = CLASSES_MAP["javascript-logic-blocks"];

export const DEFAULT_CLASS = CLASSES_MAP["css-flexbox"];
