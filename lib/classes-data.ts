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
    modulesCount: 20,
    puzzlesCount: 20,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 920,
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
    tags: ["Live Code", "HTML Architecture", "DOM Hierarchy", "20 Levels"],
    modules: [
      { id: "html-1-raw-content", number: 1, title: "Level 1: The Raw Canvas & Floating Elements", description: "Buat judul utama h1 dan data diri nama & umurmu dengan tag p.", status: "in-progress", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "html-2-first-box", number: 2, title: "Level 2: The First Container (Kardus Pertama)", description: "Bungkus seluruh teks profil ke dalam kardus pembungkus pertama div.", status: "locked", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "html-3-named-container", number: 3, title: "Level 3: The Named Box (Identitas Kontainer)", description: "Beri identitas class='profile-card' pada tag div pembungkus.", status: "locked", xp: 35, duration: "10 Menit", puzzlesCount: 1 },
      { id: "html-4-siblings", number: 4, title: "Level 4: The Siblings (Dua Kardus Bersaudara)", description: "Buat dua kartu sejajar (siblings): Kartu Profil dan Kartu Catatan Pengembang.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-5-triple-stack", number: 5, title: "Level 5: The Triple Stack (Tiga Zona Vertikal)", description: "Bagi halaman menjadi 3 zona vertikal: top-bar, content-area, bottom-bar.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-6-matryoshka", number: 6, title: "Level 6: The Matryoshka (Nesting Kolom Ganda)", description: "Kardus dalam kardus: 1 div parent membungkus 2 div child avatar-box dan info-box.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-7-avatar-frame", number: 7, title: "Level 7: The Frame (Div Pembungkus Media)", description: "Bungkus elemen img dengan div avatar-frame ber-atribut src dan alt.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-8-card-anatomy", number: 8, title: "Level 8: Card Anatomy (Header & Body Div)", description: "Pisahkan anatomi kartu menjadi div card-header dan card-body.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-9-action-row", number: 9, title: "Level 9: The Action Row (Kardus Tombol Aksi)", description: "Kelompokkan tombol interaksi ke dalam div baris action-row.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-10-badge-overlay", number: 10, title: "Level 10: The Badge Pill (Label Kategori & Tag Profesi)", description: "Tambahkan label badge profesi/kategori ke dalam header profil.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "html-11-stats-columns", number: 11, title: "Level 11: The Metrics Summary (3 Kolom Metrik)", description: "Buat metrics-row yang membungkus 3 div metric-box sejajar.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-12-modular-card", number: 12, title: "Level 12: Capstone Project - The Modular Profile Card", description: "Proyek komprehensif: Rakit kartu modular lengkap dengan 5 lapisan div!", status: "locked", xp: 60, duration: "25 Menit", puzzlesCount: 1 },
      { id: "html-13-split-layout", number: 13, title: "Level 13: The Two-Panel Split (Sidebar & Main)", description: "Bagi halaman web menjadi dua panel besar: div sidebar dan main-content.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-14-sidebar-nav", number: 14, title: "Level 14: Sidebar Navigation Box", description: "Tata bilah samping dengan div brand-box dan menu-box dengan list ul-li.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-15-content-cards", number: 15, title: "Level 15: The Content Stack", description: "Susun beberapa kartu modular mandiri di dalam area kerja main content.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-16-form-group", number: 16, title: "Level 16: The Form & Field Groups", description: "Bungkus setiap baris input form ke dalam div form-group yang rapi.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-17-modal-dialog", number: 17, title: "Level 17: The Modal Dialog (Overlay & Modal Box)", description: "Bangun arsitektur popup modal: div modal-overlay dan modal-box.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "html-18-bento-grid", number: 18, title: "Level 18: The Bento Grid Blocks", description: "Bangun wadah bento-container yang membungkus 4 kotak bento-item.", status: "locked", xp: 55, duration: "25 Menit", puzzlesCount: 1 },
      { id: "html-19-semantic-hybrid", number: 19, title: "Level 19: The Semantic Hybrid", description: "Harmonisasi tag semantik header, main, footer yang membungkus div container.", status: "locked", xp: 55, duration: "25 Menit", puzzlesCount: 1 },
      { id: "html-20-boss-dashboard", number: 20, title: "Level 20: Final Project - Complete Web Dashboard", description: "Proyek akhir arsitektur web: Bangun kerangka Dashboard Web lengkap dari nol!", status: "locked", xp: 100, duration: "40 Menit", puzzlesCount: 1 },
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
    modulesCount: 20,
    puzzlesCount: 20,
    estimatedHours: "4 Jam",
    hasCertificate: true,
    xpReward: 920,
    progressPercent: 0,
    completedModules: 0,
    status: "available",
    accentBg: "bg-tertiary-fixed",
    about:
      "Fondasi mutlak desain web: kuasai Box Model, warna kanvas, tinta teks, tipografi terstruktur, padding, margin, border, box-sizing, hingga transformasi & bayangan elevasi melalui 20 level tantangan interaktif.",
    prerequisites:
      "Tidak ada prasyarat. Terbuka untuk pemula total yang ingin belajar langsung di kanvas browser.",
    instructor: {
      name: "Rian Anggara",
      role: "Lead UI Engineer & Design Technologist",
      company: "Codevas Learning Engine",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Live Code", "CSS Basics", "Box Model", "Typography", "20 Levels"],
    modules: [
      { id: "css-basics-1-background-color", number: 1, title: "Level 1: The Canvas", description: "Warnai latar belakang kanvas menjadi biru muda dengan background-color: lightblue.", status: "in-progress", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "css-basics-2-text-color", number: 2, title: "Level 2: The Typography Ink", description: "Ubah warna teks menjadi gelap kontras dengan color: #0f172a agar mudah dibaca.", status: "locked", xp: 30, duration: "10 Menit", puzzlesCount: 1 },
      { id: "css-basics-3-font-size", number: 3, title: "Level 3: The Visual Scale", description: "Perbesar ukuran judul utama menggunakan font-size: 24px.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-4-font-weight", number: 4, title: "Level 4: The Bold Statement", description: "Buat judul lebih tegas dan berwibawa menggunakan font-weight: bold.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-5-text-align", number: 5, title: "Level 5: The Alignment", description: "Pusatkan alur teks horizontal pada kartu menggunakan text-align: center.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-6-line-height", number: 6, title: "Level 6: The Breathing Space (Line Height)", description: "Beri ruang napas vertikal antar baris teks dengan line-height: 1.6.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-7-padding", number: 7, title: "Level 7: The Inner Space (Padding)", description: "Cegah teks menabrak dinding border dengan memberi ruang dalam padding: 20px.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-8-margin", number: 8, title: "Level 8: The Outer Boundary (Margin)", description: "Dorong kartu saling menjaga jarak sopan dari elemen luar dengan margin: 20px.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-9-border", number: 9, title: "Level 9: The Border Frame", description: "Beri batasan garis tepi tegas neo-brutalisme dengan border: 2px solid #0f172a.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-10-border-radius", number: 10, title: "Level 10: The Smooth Edge", description: "Ubah sudut siku tajam menjadi kurva modern menggunakan border-radius: 16px.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-11-dimensions", number: 11, title: "Level 11: The Dimensions (Width & Min-Height)", description: "Kendalikan dimensi kartu dengan width: 320px dan min-height: 160px.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-12-box-sizing", number: 12, title: "Level 12: The Box-Sizing Revelation", description: "Kunci perhitungan dimensi aman dari risiko luapan (overflow) dengan box-sizing: border-box.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "css-basics-13-capstone-card", number: 13, title: "Level 13: Capstone Card - Neo-Brutalist Badge", description: "Proyek tengah: Integrasikan warna kuning #fef08a, padding 16px, border tebal, dan border-radius!", status: "locked", xp: 60, duration: "25 Menit", puzzlesCount: 1 },
      { id: "css-basics-14-box-shadow", number: 14, title: "Level 14: The Elevation & Depth (Box Shadow)", description: "Ciptakan ilusi 3D neo-brutalisme dengan bayangan tegas box-shadow: 4px 4px 0px #0f172a.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-15-opacity", number: 15, title: "Level 15: Transparency & Muting (Opacity)", description: "Redupkan intensitas visual elemen sekunder dengan opacity: 0.75.", status: "locked", xp: 45, duration: "15 Menit", puzzlesCount: 1 },
      { id: "css-basics-16-cursor-overflow", number: 16, title: "Level 16: Interactive Cues & Overflow", description: "Beri isyarat klik kursor pointer dan amankan batas kurva dengan overflow: hidden.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "css-basics-17-gradient", number: 17, title: "Level 17: Color Energy (Linear Gradient)", description: "Suntikkan energi dua nada dengan background: linear-gradient(135deg, #fef08a, #fed7aa).", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "css-basics-18-transform", number: 18, title: "Level 18: Spatial Dynamics (Transform)", description: "Ciptakan efek melayang secara fisik dengan transform: translateY(-4px).", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "css-basics-19-transitions", number: 19, title: "Level 19: Smooth Motion (CSS Transitions)", description: "Perhalus setiap transisi perpindahan dengan transition: all 0.2s ease-in-out.", status: "locked", xp: 55, duration: "20 Menit", puzzlesCount: 1 },
      { id: "css-basics-20-boss-card", number: 20, title: "Level 20: Final Project - Complete Interactive Component", description: "Proyek akhir: Rakit mahakarya kartu komponen interaktif neo-brutalisme lengkap!", status: "locked", xp: 100, duration: "35 Menit", puzzlesCount: 1 },
    ],
  },
  {
    id: "css-flexbox",
    category: "LIVE_CODE",
    categoryLabel: "Live Code",
    title: "CSS Flexbox",
    tagline:
      "Kuasai tata letak 1 dimensi dari aktivasi display: flex hingga teknik esensial mempusatkan navbar modern.",
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
      { id: "flexbox-1-activation", number: 1, title: "Level 1: The Activation", description: "Nyalakan mode Flexbox pada container dengan display: flex.", status: "completed", xp: 30, duration: "10 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "flexbox-2-push-justify-end", number: 2, title: "Level 2: The Push (Justify End)", description: "Dorong semua kotak ke ujung kanan dengan justify-content: flex-end.", status: "completed", xp: 30, duration: "10 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "flexbox-3-center-stage", number: 3, title: "Level 3: The Center Stage", description: "Kumpulkan kotak tepat di tengah secara horizontal dengan justify-content: center.", status: "completed", xp: 35, duration: "15 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "flexbox-4-split-space-between", number: 4, title: "Level 4: The Split", description: "Pisahkan kotak kiri dan kanan menyentuh dinding dengan justify-content: space-between.", status: "in-progress", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "flexbox-5-social-distancing", number: 5, title: "Level 5: The Social Distancing", description: "Beri jarak adil merata antar kotak dengan justify-content: space-evenly.", status: "locked", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "flexbox-6-gravity-align-items", number: 6, title: "Level 6: The Gravity (Align Items)", description: "Tarik kotak ke tengah secara vertikal menggunakan align-items: center.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "flexbox-7-floor-align-end", number: 7, title: "Level 7: The Floor", description: "Jatuhkan kotak ke lantai dasar kanvas dengan align-items: flex-end.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "flexbox-8-column-direction", number: 8, title: "Level 8: The Column", description: "Ubah arah aliran tumpukan menjadi kolom dengan flex-direction: column.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "flexbox-9-gap", number: 9, title: "Level 9: The Gap", description: "Beri jarak rapi antar kotak tanpa ribet menghitung margin dengan gap: 20px.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "flexbox-10-overflow-wrap", number: 10, title: "Level 10: The Overflow (Wrap)", description: "Izinkan elemen turun ke baris baru saat ruang sempit dengan flex-wrap: wrap.", status: "locked", xp: 50, duration: "25 Menit", puzzlesCount: 1 },
      { id: "flexbox-11-perfect-center", number: 11, title: "Level 11: The Perfect Center", description: "Kombinasi esensial pusatkan elemen di tengah kanvas (justify-content & align-items: center).", status: "locked", xp: 60, duration: "30 Menit", puzzlesCount: 1 },
      { id: "flexbox-12-boss-modern-navbar", number: 12, title: "Level 12: Final Component - The Modern Navbar", description: "Rakit Navbar lengkap: Logo di kiri, menu di kanan, dan sejajar sempurna secara vertikal!", status: "locked", xp: 100, duration: "35 Menit", puzzlesCount: 1 },
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
      { id: "grid-1-blueprint", number: 1, title: "Level 1: The Blueprint", description: "Belah container menjadi 2 kolom sama besar dengan grid-template-columns: 1fr 1fr.", status: "completed", xp: 35, duration: "15 Menit", puzzlesCount: 1, completedPuzzles: 1 },
      { id: "grid-2-triplets", number: 2, title: "Level 2: The Triplets", description: "Buat 3 kolom rata dengan fungsi ringkas repeat(3, 1fr).", status: "in-progress", xp: 35, duration: "15 Menit", puzzlesCount: 1 },
      { id: "grid-3-asymmetry", number: 3, title: "Level 3: The Asymmetry", description: "Buat layout Sidebar fix 250px dan konten fleksibel 1fr.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "grid-4-alleyway", number: 4, title: "Level 4: The Alleyway", description: "Beri pemisah lorong sel grid sebesar 24px dengan gap: 24px.", status: "locked", xp: 40, duration: "15 Menit", puzzlesCount: 1 },
      { id: "grid-5-header-expansion", number: 5, title: "Level 5: The Header Expansion", description: "Bentangkan sel Header melintasi 3 kolom dengan grid-column: span 3.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "grid-6-tower-expansion", number: 6, title: "Level 6: The Tower Expansion", description: "Tinggikan menara Sidebar memakan 2 baris dengan grid-row: span 2.", status: "locked", xp: 45, duration: "20 Menit", puzzlesCount: 1 },
      { id: "grid-7-absolute-placement", number: 7, title: "Level 7: The Absolute Placement", description: "Posisikan elemen dari garis grid 1 hingga 3 dengan grid-column: 1 / 3.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "grid-8-grid-center", number: 8, title: "Level 8: The Grid Center", description: "Pusatkan elemen secara instan di sumbu 2D dengan place-items: center.", status: "locked", xp: 50, duration: "20 Menit", puzzlesCount: 1 },
      { id: "grid-9-responsive-magic", number: 9, title: "Level 9: The Responsive Magic", description: "Buat grid adaptif otomatis dengan repeat(auto-fit, minmax(200px, 1fr)).", status: "locked", xp: 55, duration: "25 Menit", puzzlesCount: 1 },
      { id: "grid-10-grid-areas", number: 10, title: "Level 10: The Canvas Paint (Grid Areas)", description: "Beri nama area sel grid dengan grid-area: header.", status: "locked", xp: 55, duration: "25 Menit", puzzlesCount: 1 },
      { id: "grid-11-inception", number: 11, title: "Level 11: The Inception", description: "Padukan Flexbox di dalam sel Grid untuk memusatkan teks komponen mikro.", status: "locked", xp: 60, duration: "30 Menit", puzzlesCount: 1 },
      { id: "grid-12-boss-bento-dashboard", number: 12, title: "Level 12: Final Layout - The Bento Box Dashboard", description: "Proyek Akhir: Rakit layout Bento Box Dashboard modern ala Apple dengan repeat dan span!", status: "locked", xp: 100, duration: "35 Menit", puzzlesCount: 1 },
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
      { id: "cs-12", number: 12, title: "Level 12: Final Component - The E-Commerce Card", description: "Rakit kartu produk utuh memadukan avatar, badge diskon, tipografi, dan tombol beli!", status: "locked", xp: 100, duration: "45 Menit", puzzlesCount: 1 },
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
      { id: "tw-12", number: 12, title: "Level 12: Final Component - The Glassmorphism Card", description: "Proyek Akhir: Buat kartu efek kaca super modern hanya dengan kombinasi class Tailwind!", status: "locked", xp: 100, duration: "45 Menit", puzzlesCount: 1 },
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
