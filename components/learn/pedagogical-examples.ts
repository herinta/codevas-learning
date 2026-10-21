/**
 * Pedagogical Examples System for Codevas Learning Engine
 * Ensures that "Contoh Acuan" (Example Code) and "Soal / Jawaban" are ALWAYS DIFFERENT,
 * while teaching the exact same concept/technique (Analogical Learning).
 */

export interface PedagogicalExample {
  filename: string;
  code: string;
  tip: string;
  description?: string;
}

interface ChallengeLike {
  id: string;
  class_id?: string;
  initial_state?: string;
  target_visual?: any;
  concept_demo?: any;
  syntax_helpers?: string[];
  instruction?: string;
}

/**
 * Curated pedagogical examples for every level
 */
const CURATED_EXAMPLES: Record<string, { code: string; tip: string }> = {
  // =========================================================================
  // 1. HTML ARCHITECTURE (20 Levels)
  // =========================================================================
  "html-1-raw-content": {
    code: `<h1>Resep Nasi Goreng Spesial</h1>\n<p>Koki: Chef Arnold</p>\n<p>Porsi: 2 Orang</p>`,
    tip: "Perhatikan cara penulisan judul <h1> dan informasi paragraf <p>. Terapkan pola tag yang sama untuk menuliskan biodata profilmu.",
  },
  "html-1": {
    code: `<h1>Resep Nasi Goreng Spesial</h1>\n<p>Koki: Chef Arnold</p>\n<p>Porsi: 2 Orang</p>`,
    tip: "Perhatikan cara penulisan judul <h1> dan informasi paragraf <p>. Terapkan pola tag yang sama untuk menuliskan biodata profilmu.",
  },

  "html-2-first-box": {
    code: `<div>\n  <h1>Tiket Konser Musik</h1>\n  <p>Artis: Sheila on 7</p>\n  <p>Lokasi: Stadion Utama</p>\n</div>`,
    tip: "Contoh di atas menyatukan informasi tiket ke dalam 1 box pembungkus <div>. Bungkus seluruh data profilmu ke dalam <div> yang serupa.",
  },
  "html-2": {
    code: `<div>\n  <h1>Tiket Konser Musik</h1>\n  <p>Artis: Sheila on 7</p>\n  <p>Lokasi: Stadion Utama</p>\n</div>`,
    tip: "Contoh di atas menyatukan informasi tiket ke dalam 1 box pembungkus <div>. Bungkus seluruh data profilmu ke dalam <div> yang serupa.",
  },

  "html-3-named-container": {
    code: `<div class="product-badge">\n  <h1>Kamera Mirrorless</h1>\n  <p>Garansi: 2 Tahun Resmi</p>\n</div>`,
    tip: "Contoh di atas menyematkan identitas class='product-badge' pada <div>. Pasang class='profile-card' pada div profilmu.",
  },
  "html-3": {
    code: `<div class="product-badge">\n  <h1>Kamera Mirrorless</h1>\n  <p>Garansi: 2 Tahun Resmi</p>\n</div>`,
    tip: "Contoh di atas menyematkan identitas class='product-badge' pada <div>. Pasang class='profile-card' pada div profilmu.",
  },

  "html-4-siblings": {
    code: `<div class="store-card">\n  <h1>Kedai Kopi Senja</h1>\n</div>\n<div class="schedule-card">\n  <h3>Jam Operasional</h3>\n  <p>Buka setiap hari: 08:00 - 22:00 WIB</p>\n</div>`,
    tip: "Dua div di atas berdiri sejajar sebagai saudara (siblings). Buat kartu profil dan kartu catatanmu berdampingan secara mandiri.",
  },
  "html-4": {
    code: `<div class="store-card">\n  <h1>Kedai Kopi Senja</h1>\n</div>\n<div class="schedule-card">\n  <h3>Jam Operasional</h3>\n  <p>Buka setiap hari: 08:00 - 22:00 WIB</p>\n</div>`,
    tip: "Dua div di atas berdiri sejajar sebagai saudara (siblings). Buat kartu profil dan kartu catatanmu berdampingan secara mandiri.",
  },

  "html-5-triple-stack": {
    code: `<div class="brand-bar">\n  <h2>Akademi Koding</h2>\n</div>\n<div class="lesson-panel">\n  <p>Materi: Arsitektur Web Modern</p>\n</div>\n<div class="system-footer">\n  <p>Status: Aktif • 2026</p>\n</div>`,
    tip: "Tiga div bertumpuk vertikal membagi halaman jadi 3 zona. Susun 3 div pembungkus (top-bar, content-area, bottom-bar) pada soalmu.",
  },
  "html-5": {
    code: `<div class="brand-bar">\n  <h2>Akademi Koding</h2>\n</div>\n<div class="lesson-panel">\n  <p>Materi: Arsitektur Web Modern</p>\n</div>\n<div class="system-footer">\n  <p>Status: Aktif • 2026</p>\n</div>`,
    tip: "Tiga div bertumpuk vertikal membagi halaman jadi 3 zona. Susun 3 div pembungkus (top-bar, content-area, bottom-bar) pada soalmu.",
  },

  "html-6-matryoshka": {
    code: `<div class="store-item">\n  <div class="thumbnail-box">\n    <p>[Foto Produk]</p>\n  </div>\n  <div class="details-box">\n    <h3>Sepatu Sneakers Pro</h3>\n    <p>Ukuran: 42 • Warna: Putih</p>\n  </div>\n</div>`,
    tip: "Lihat pola nesting 2 kolom: 1 parent ('store-item') membungkus 2 child ('thumbnail-box' & 'details-box'). Buat struktur bersarang yang sama untuk kartu profilmu ('card' membungkus 'avatar-box' & 'info-box').",
  },
  "html-6": {
    code: `<div class="store-item">\n  <div class="thumbnail-box">\n    <p>[Foto Produk]</p>\n  </div>\n  <div class="details-box">\n    <h3>Sepatu Sneakers Pro</h3>\n    <p>Ukuran: 42 • Warna: Putih</p>\n  </div>\n</div>`,
    tip: "Lihat pola nesting 2 kolom: 1 parent ('store-item') membungkus 2 child ('thumbnail-box' & 'details-box'). Buat struktur bersarang yang sama untuk kartu profilmu ('card' membungkus 'avatar-box' & 'info-box').",
  },

  "html-7-avatar-frame": {
    code: `<div class="banner-frame">\n  <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300" alt="Banner Pemandangan" />\n</div>`,
    tip: "Tag <img> dibungkus rapi di dalam div pembungkus berbingkai. Bungkus foto profilmu dengan div avatar-frame.",
  },
  "html-7": {
    code: `<div class="banner-frame">\n  <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300" alt="Banner Pemandangan" />\n</div>`,
    tip: "Tag <img> dibungkus rapi di dalam div pembungkus berbingkai. Bungkus foto profilmu dengan div avatar-frame.",
  },

  "html-8-card-anatomy": {
    code: `<div class="notice-card">\n  <div class="notice-header">\n    <h2>Pengumuman Penting</h2>\n  </div>\n  <div class="notice-body">\n    <p>Sesi live coding dimulai besok pagi pukul 09:00.</p>\n  </div>\n</div>`,
    tip: "Anatomi kartu dipisahkan menjadi dua bagian logis: header dan body. Terapkan pembagian card-header dan card-body pada kartu profilmu.",
  },
  "html-8": {
    code: `<div class="notice-card">\n  <div class="notice-header">\n    <h2>Pengumuman Penting</h2>\n  </div>\n  <div class="notice-body">\n    <p>Sesi live coding dimulai besok pagi pukul 09:00.</p>\n  </div>\n</div>`,
    tip: "Anatomi kartu dipisahkan menjadi dua bagian logis: header dan body. Terapkan pembagian card-header dan card-body pada kartu profilmu.",
  },

  "html-9-action-row": {
    code: `<div class="button-group">\n  <button>Beli Sekarang</button>\n  <button>Tambah Keranjang</button>\n</div>`,
    tip: "Tombol interaksi dikelompokkan ke dalam satu div baris aksi. Bungkus tombol interaksimu ke dalam div action-row.",
  },
  "html-9": {
    code: `<div class="button-group">\n  <button>Beli Sekarang</button>\n  <button>Tambah Keranjang</button>\n</div>`,
    tip: "Tombol interaksi dikelompokkan ke dalam satu div baris aksi. Bungkus tombol interaksimu ke dalam div action-row.",
  },

  "html-10-badge-overlay": {
    code: `<div class="course-banner">\n  <span class="status-pill">Tingkat Mahir</span>\n  <h2>Mastering Web Layout</h2>\n</div>`,
    tip: "Contoh di atas menyematkan penanda status kecil di dalam kartu. Tambahkan badge profesi pada kartu profilmu.",
  },
  "html-10": {
    code: `<div class="course-banner">\n  <span class="status-pill">Tingkat Mahir</span>\n  <h2>Mastering Web Layout</h2>\n</div>`,
    tip: "Contoh di atas menyematkan penanda status kecil di dalam kartu. Tambahkan badge profesi pada kartu profilmu.",
  },

  "html-11-stats-columns": {
    code: `<div class="stats-row">\n  <div class="stat-col">\n    <h4>2.5K</h4>\n    <p>Follower</p>\n  </div>\n  <div class="stat-col">\n    <h4>140</h4>\n    <p>Koleksi</p>\n  </div>\n  <div class="stat-col">\n    <h4>4.9</h4>\n    <p>Rating</p>\n  </div>\n</div>`,
    tip: "Satu div induk membungkus 3 kolom metrik sejajar. Terapkan struktur metrics-row dan 3 metric-box pada profilmu.",
  },
  "html-11": {
    code: `<div class="stats-row">\n  <div class="stat-col">\n    <h4>2.5K</h4>\n    <p>Follower</p>\n  </div>\n  <div class="stat-col">\n    <h4>140</h4>\n    <p>Koleksi</p>\n  </div>\n  <div class="stat-col">\n    <h4>4.9</h4>\n    <p>Rating</p>\n  </div>\n</div>`,
    tip: "Satu div induk membungkus 3 kolom metrik sejajar. Terapkan struktur metrics-row dan 3 metric-box pada profilmu.",
  },

  "html-12-modular-card": {
    code: `<div class="product-card">\n  <div class="badge-tag">Terlaris</div>\n  <div class="product-header">\n    <h3>Kamera DSLR Pro</h3>\n  </div>\n  <div class="product-body">\n    <p>Resolusi 4K dengan sensor full-frame.</p>\n  </div>\n  <div class="action-footer">\n    <button>Detail Produk</button>\n  </div>\n</div>`,
    tip: "Komposisi komponen modular yang menggabungkan seluruh lapisan container. Susun kartu profil modular lengkapmu dengan pola serupa.",
  },
  "html-12": {
    code: `<div class="product-card">\n  <div class="badge-tag">Terlaris</div>\n  <div class="product-header">\n    <h3>Kamera DSLR Pro</h3>\n  </div>\n  <div class="product-body">\n    <p>Resolusi 4K dengan sensor full-frame.</p>\n  </div>\n  <div class="action-footer">\n    <button>Detail Produk</button>\n  </div>\n</div>`,
    tip: "Komposisi komponen modular yang menggabungkan seluruh lapisan container. Susun kartu profil modular lengkapmu dengan pola serupa.",
  },

  "html-13-split-layout": {
    code: `<div class="app-layout">\n  <div class="left-pane">\n    <p>Bilah Navigasi</p>\n  </div>\n  <div class="workspace-pane">\n    <h1>Area Kerja Utama</h1>\n  </div>\n</div>`,
    tip: "Pola pemisahan dua panel halaman web (sidebar dan main content). Terapkan pada layout split pada soalmu.",
  },
  "html-14-sidebar-nav": {
    code: `<div class="brand-panel">\n  <h2>Logo Toko</h2>\n</div>\n<div class="menu-panel">\n  <ul>\n    <li>Beranda</li>\n    <li>Katalog</li>\n  </ul>\n</div>`,
    tip: "Bilah samping memisahkan logo brand dan daftar menu link. Gunakan pola tag ini untuk melengkapi sidebarmu.",
  },
  "html-15-content-cards": {
    code: `<div class="card-feed">\n  <div class="feed-item">Postingan 1</div>\n  <div class="feed-item">Postingan 2</div>\n</div>`,
    tip: "Menyusun beberapa kartu anak di dalam wadah konten utama.",
  },
  "html-16-form-group": {
    code: `<div class="input-row">\n  <label>Alamat Email</label>\n  <input type="email" placeholder="nama@email.com" />\n</div>`,
    tip: "Setiap bidang input form dibungkus bersama labelnya ke dalam satu wadah form-group yang rapi.",
  },
  "html-17-modal-dialog": {
    code: `<div class="popup-backdrop">\n  <div class="popup-window">\n    <h3>Konfirmasi Logout</h3>\n    <button>Ya, Keluar</button>\n  </div>\n</div>`,
    tip: "Arsitektur modal dialog: wadah overlay di luar membungkus kotak popup modal di dalamnya.",
  },
  "html-18-bento-grid": {
    code: `<div class="grid-showcase">\n  <div class="cell-block">Blok A</div>\n  <div class="cell-block">Blok B</div>\n  <div class="cell-block">Blok C</div>\n</div>`,
    tip: "Wadah grid yang membungkus beberapa blok item mandiri.",
  },
  "html-19-semantic-hybrid": {
    code: `<header>\n  <div class="nav-container">Navigasi</div>\n</header>\n<main>\n  <div class="content-box">Artikel</div>\n</main>\n<footer>\n  <div class="footer-box">Kontak</div>\n</footer>`,
    tip: "Menggabungkan tag semantik HTML5 (header, main, footer) yang masing-masing membungkus div container.",
  },
  "html-20-boss-dashboard": {
    code: `<div class="admin-shell">\n  <div class="side-drawer">Menu</div>\n  <div class="dashboard-area">\n    <div class="top-nav">Header</div>\n    <div class="card-grid">Konten</div>\n  </div>\n</div>`,
    tip: "Arsitektur Dashboard komprehensif: gabungan sidebar, navigasi atas, dan grid kartu kerja.",
  },

  // =========================================================================
  // 2. CSS BASICS (20 Levels)
  // =========================================================================
  "css-basics-1-background-color": {
    code: `.banner-card {\n  background-color: #fef08a;\n}`,
    tip: "Properti background-color mewarnai latar belakang elemen. Terapkan warna yang diminta pada selector .box.",
  },
  "css-basics-2-text-color": {
    code: `.hero-title {\n  color: #1e293b;\n}`,
    tip: "Properti color mengatur warna tinta teks. Terapkan warna teks gelap kontras pada selector .box.",
  },
  "css-basics-3-font-size": {
    code: `.product-name {\n  font-size: 20px;\n}`,
    tip: "Properti font-size mengatur skala besaran huruf. Atur font-size sesuai instruksi pada kartu .box.",
  },
  "css-basics-4-font-weight": {
    code: `.author-tag {\n  font-weight: 700;\n}`,
    tip: "Properti font-weight mengatur ketebalan teks (normal, bold, atau angka 100-900).",
  },
  "css-basics-5-text-align": {
    code: `.testimonial-quote {\n  text-align: center;\n}`,
    tip: "Properti text-align mengatur perataan horizontal teks (left, center, right).",
  },
  "css-basics-6-line-height": {
    code: `.blog-body {\n  line-height: 1.75;\n}`,
    tip: "Properti line-height memberi ruang napas vertikal antar baris kalimat agar nyaman dibaca.",
  },
  "css-basics-7-padding": {
    code: `.modal-card {\n  padding: 24px;\n}`,
    tip: "Properti padding memberikan jarak di bagian dalam antara konten teks dan garis tepi elemen.",
  },
  "css-basics-8-margin": {
    code: `.cta-button {\n  margin: 16px;\n}`,
    tip: "Properti margin memberikan jarak di sisi luar elemen dari batas tetangganya.",
  },
  "css-basics-9-border": {
    code: `.photo-frame {\n  border: 3px solid #0f172a;\n}`,
    tip: "Properti border membingkai elemen (ketebalan, gaya garis, dan warna garis).",
  },
  "css-basics-10-border-radius": {
    code: `.action-pill {\n  border-radius: 9999px;\n}`,
    tip: "Properti border-radius melengkungkan sudut siku elemen agar tampil halus dan modern.",
  },
  "css-basics-11-dimensions": {
    code: `.widget-box {\n  width: 280px;\n  min-height: 140px;\n}`,
    tip: "Kombinasi width dan min-height mengunci dimensi fisik elemen secara terukur.",
  },
  "css-basics-12-box-sizing": {
    code: `.layout-column {\n  box-sizing: border-box;\n}`,
    tip: "Properti box-sizing: border-box memastikan padding dan border dihitung di dalam lebar total.",
  },
  "css-basics-13-capstone-card": {
    code: `.mentor-card {\n  background-color: #e0f2fe;\n  padding: 20px;\n  border: 2px solid #0f172a;\n  border-radius: 12px;\n}`,
    tip: "Integrasi Box Model: padukan warna latar, ruang dalam (padding), border tegas, dan sudut melengkung.",
  },
  "css-basics-14-box-shadow": {
    code: `.retro-card {\n  box-shadow: 6px 6px 0px #0f172a;\n}`,
    tip: "Properti box-shadow memberikan bayangan neo-brutalistik 3D tanpa blur.",
  },
  "css-basics-15-opacity": {
    code: `.overlay-backdrop {\n  opacity: 0.6;\n}`,
    tip: "Properti opacity mengatur transparansi elemen (nilai antara 0.0 hingga 1.0).",
  },
  "css-basics-16-cursor-overflow": {
    code: `.interactive-tile {\n  cursor: pointer;\n  overflow: hidden;\n}`,
    tip: "Kombinasi cursor: pointer untuk isyarat klik dan overflow: hidden untuk memotong luapan.",
  },
  "css-basics-17-gradient": {
    code: `.gradient-header {\n  background: linear-gradient(90deg, #93c5fd, #c4b5fd);\n}`,
    tip: "Properti linear-gradient memadukan dua nada warna yang mengalir halus.",
  },
  "css-basics-18-transform": {
    code: `.floating-card {\n  transform: translateY(-6px);\n}`,
    tip: "Properti transform: translateY() menggeser posisi elemen secara fisik tanpa merusak layout.",
  },
  "css-basics-19-transitions": {
    code: `.smooth-element {\n  transition: all 0.3s ease;\n}`,
    tip: "Properti transition membuat perubahan visual menjadi bergerak halus dan dinamis.",
  },
  "css-basics-20-boss-card": {
    code: `.neo-ticket {\n  background-color: #fef08a;\n  padding: 24px;\n  border: 3px solid #0f172a;\n  border-radius: 16px;\n  box-shadow: 6px 6px 0px #0f172a;\n  transition: all 0.2s ease;\n}`,
    tip: "Sintesis mahakarya CSS Basics: gabungan Box Model, elevasi bayangan, dan transisi interaktif.",
  },

  // =========================================================================
  // 3. CSS FLEXBOX (12 Levels)
  // =========================================================================
  "flexbox-1-activation": {
    code: `.nav-menu {\n  display: flex;\n}`,
    tip: "Mengaktifkan mode Flexbox 1 dimensi pada container utama. Terapkan pada selector .arena.",
  },
  "flexbox-2-push-justify-end": {
    code: `.actions-container {\n  display: flex;\n  justify-content: flex-end;\n}`,
    tip: "justify-content: flex-end mendorong elemen anak ke ujung kanan sumbu horizontal.",
  },
  "flexbox-3-center-stage": {
    code: `.hero-buttons {\n  display: flex;\n  justify-content: center;\n}`,
    tip: "justify-content: center memusatkan seluruh elemen di tengah sumbu horizontal.",
  },
  "flexbox-4-split-space-between": {
    code: `.top-navbar {\n  display: flex;\n  justify-content: space-between;\n}`,
    tip: "justify-content: space-between memisahkan elemen ke ujung tepi kiri dan kanan secara merata.",
  },
  "flexbox-5-social-distancing": {
    code: `.dock-items {\n  display: flex;\n  justify-content: space-evenly;\n}`,
    tip: "justify-content: space-evenly memberikan jarak kosong yang adil dan sama rata antar elemen.",
  },
  "flexbox-6-gravity-align-items": {
    code: `.search-row {\n  display: flex;\n  align-items: center;\n}`,
    tip: "align-items: center menarik elemen ke tengah pada sumbu vertikal (silang).",
  },
  "flexbox-7-floor-align-end": {
    code: `.bar-chart {\n  display: flex;\n  align-items: flex-end;\n}`,
    tip: "align-items: flex-end menaruh elemen menyentuh lantai dasar container.",
  },
  "flexbox-8-column-direction": {
    code: `.menu-sidebar {\n  display: flex;\n  flex-direction: column;\n}`,
    tip: "flex-direction: column mengubah orientasi aliran dari baris menyamping menjadi kolom tegak.",
  },
  "flexbox-9-gap": {
    code: `.badge-list {\n  display: flex;\n  gap: 16px;\n}`,
    tip: "Properti gap memberi jarak renggang rapi antar elemen tanpa repot kalkulasi margin.",
  },
  "flexbox-10-align-self": {
    code: `.special-item {\n  align-self: flex-start;\n}`,
    tip: "align-self memberi hak istimewa pada satu anak spesifik untuk melawan perataan parent.",
  },
  "flexbox-11-perfect-center": {
    code: `.login-dialog {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
    tip: "Kombinasi legendaris Flexbox untuk memusatkan objek tepat di tengah layar secara vertikal dan horizontal.",
  },
  "flexbox-12-boss-navbar": {
    code: `.ecommerce-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
    tip: "Formula standar Navbar web modern: space-between untuk memisah logo dan menu, serta align-items: center untuk meratakan tinggi.",
  },
  "flexbox-12-boss-modern-navbar": {
    code: `.ecommerce-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
    tip: "Formula standar Navbar web modern: space-between untuk memisah logo dan menu, serta align-items: center untuk meratakan tinggi.",
  },

  // =========================================================================
  // 4. CSS GRID (12 Levels)
  // =========================================================================
  "grid-1-two-columns": {
    code: `.gallery-layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}`,
    tip: "Membagi wadah menjadi 2 kolom sama besar menggunakan satuan fraksi 1fr.",
  },
  "grid-2-triplets": {
    code: `.pricing-table {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`,
    tip: "Membagi wadah menjadi 3 kolom kembar sejajar menggunakan fungsi repeat(3, 1fr).",
  },
  "grid-3-asymmetry": {
    code: `.magazine-columns {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n}`,
    tip: "Kolom asimetris: kolom pertama mendapat 2 bagian ruang (2fr) dan kolom kedua 1 bagian (1fr).",
  },
  "grid-4-gap": {
    code: `.bento-wrapper {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}`,
    tip: "Properti gap pada Grid memberi jarak ruang napas antar sel baris dan kolom.",
  },
  "grid-5-header-span": {
    code: `.featured-banner {\n  grid-column: span 2;\n}`,
    tip: "grid-column: span membentangkan elemen agar melebar melewati beberapa kolom sel.",
  },
  "grid-5-header-expansion": {
    code: `.featured-banner {\n  grid-column: span 2;\n}`,
    tip: "grid-column: span membentangkan elemen agar melebar melewati beberapa kolom sel.",
  },
  "grid-6-tower-span": {
    code: `.side-drawer {\n  grid-row: span 2;\n}`,
    tip: "grid-row: span membentangkan elemen secara vertikal melewati beberapa baris sel.",
  },
  "grid-6-tower-expansion": {
    code: `.side-drawer {\n  grid-row: span 2;\n}`,
    tip: "grid-row: span membentangkan elemen secara vertikal melewati beberapa baris sel.",
  },
  "grid-7-absolute-placement": {
    code: `.hero-spot {\n  grid-column: 1 / 3;\n  grid-row: 1;\n}`,
    tip: "Menempatkan sel secara presisi menggunakan nomor garis grid awal dan akhir.",
  },
  "grid-8-place-items": {
    code: `.centered-board {\n  display: grid;\n  place-items: center;\n}`,
    tip: "place-items: center memusatkan isi seluruh sel grid secara vertikal dan horizontal sekaligus.",
  },
  "grid-9-responsive-autofit": {
    code: `.product-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}`,
    tip: "Grid responsif otomatis tanpa media query menggunakan auto-fit dan minmax.",
  },
  "grid-10-grid-area": {
    code: `.layout-frame {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar content";\n}`,
    tip: "Memetakan denah layout visual secara intuitif menggunakan nama area.",
  },
  "grid-10-grid-areas": {
    code: `.layout-frame {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar content";\n}`,
    tip: "Memetakan denah layout visual secara intuitif menggunakan nama area.",
  },
  "grid-11-inception-flex": {
    code: `.card-header {\n  display: flex;\n  justify-content: space-between;\n}`,
    tip: "Pola Inception: menggunakan Flexbox di dalam sel Grid untuk menata tombol atau navigasi kecil.",
  },
  "grid-12-boss-bento": {
    code: `.bento-dashboard {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n.bento-banner {\n  grid-column: span 2;\n}`,
    tip: "Arsitektur Bento Grid Dashboard modern berstandar industri.",
  },
  "grid-12-boss-bento-dashboard": {
    code: `.bento-dashboard {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n.bento-banner {\n  grid-column: span 2;\n}`,
    tip: "Arsitektur Bento Grid Dashboard modern berstandar industri.",
  },
};

/**
 * Intelligent fallback generator: Transforms target code into an analogous sibling example
 * so that example and goal are NEVER 100% identical.
 */
function generateAnalogousExample(rawCode: string, isCss: boolean): { code: string; tip: string } {
  if (isCss) {
    const transformed = rawCode
      .replace(/\.arena\b/g, ".container-card")
      .replace(/\.grid-arena\b/g, ".gallery-grid")
      .replace(/\.box\b/g, ".badge-item")
      .replace(/\.navbar\b/g, ".app-header")
      .replace(/\.header\b/g, ".hero-banner")
      .replace(/\.sidebar\b/g, ".side-menu")
      .replace(/\.permen-([0-9]+)\b/g, ".item-$1");

    return {
      code: transformed,
      tip: "Contoh di atas mendemonstrasikan pola penulisan properti CSS yang sama pada konteks yang berbeda. Terapkan properti tersebut pada selector tantanganmu.",
    };
  }

  // HTML Analogous Transformation
  const transformed = rawCode
    .replace(/\bprofile-card\b/g, "product-card")
    .replace(/\bavatar-box\b/g, "thumbnail-box")
    .replace(/\binfo-box\b/g, "details-box")
    .replace(/\bnotes-card\b/g, "summary-card")
    .replace(/\bmetric-box\b/g, "counter-box")
    .replace(/\bmetrics-row\b/g, "counter-row")
    .replace(/\bcard\b/g, "item-card")
    .replace(/Profil Developer/g, "Sepatu Sneakers Pro")
    .replace(/Alex Coder/g, "Budi Developer")
    .replace(/Frontend Developer/g, "Stok: 12 Tersedia")
    .replace(/16 Tahun/g, "Ukuran 42");

  return {
    code: transformed,
    tip: "Contoh di atas memperlihatkan pola struktur kontainer yang serupa pada studi kasus berbeda. Bangun struktur tag yang sama untuk kartu profilmu.",
  };
}

/**
 * Main export: Retrieves the curated distinct pedagogical example for any level
 */
export function getPedagogicalExample(challenge: ChallengeLike | null): PedagogicalExample | null {
  if (!challenge) return null;

  const isCss =
    challenge.class_id === "css-basics" ||
    challenge.class_id === "css-flexbox" ||
    challenge.class_id === "css-grid" ||
    challenge.id.startsWith("css-") ||
    challenge.id.startsWith("basics-") ||
    challenge.id.startsWith("flexbox-") ||
    challenge.id.startsWith("fb-") ||
    challenge.id.startsWith("grid-") ||
    challenge.id.startsWith("gr-");

  const filename = isCss ? "style.css" : "index.html";

  // 1. Check curated explicit mapping
  const found = CURATED_EXAMPLES[challenge.id];
  if (found) {
    return {
      filename,
      code: found.code,
      tip: found.tip,
    };
  }

  // Check by normalized short ID (e.g. "html-2" or "fb-3")
  const shortId = challenge.id.replace(/(-[a-z0-9_-]+)$/, "");
  if (CURATED_EXAMPLES[shortId]) {
    return {
      filename,
      code: CURATED_EXAMPLES[shortId].code,
      tip: CURATED_EXAMPLES[shortId].tip,
    };
  }

  // 2. Analogous fallback transformation from target_visual or concept_demo
  const rawTarget =
    challenge.concept_demo?.codeExample ||
    challenge.target_visual?.concept_demo?.codeExample ||
    challenge.target_visual?.preview ||
    challenge.initial_state;

  if (rawTarget && typeof rawTarget === "string" && rawTarget.trim()) {
    const generated = generateAnalogousExample(rawTarget.trim(), isCss);
    return {
      filename,
      code: generated.code,
      tip: generated.tip,
    };
  }

  return null;
}
