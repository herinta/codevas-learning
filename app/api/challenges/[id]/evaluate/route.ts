import { NextRequest, NextResponse } from "next/server";
import { ProgressService } from "@/lib/services/progress.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Flexible CSS goal evaluation logic for all 10 Levels!
 * Evaluates intent and computed layout goals rather than strict line-by-line syntax.
 */
function evaluateCss(challengeId: string, cssCode: string): {
  passed: boolean;
  score: number;
  feedback: string[];
} {
  const normalized = cssCode.toLowerCase().replace(/\s+/g, " ");
  const feedback: string[] = [];

  // ================= HTML ARCHITECTURE (20 Levels Focused on Divs & Containers) =================
  if (challengeId === "html-1-raw-content" || challengeId === "html-1") {
    const hasH1 = /<h1[^>]*>[\s\S]*profil[\s\S]*<\/h1>/i.test(cssCode);
    const hasName = /<p[^>]*>[^<]*nama\s*:[^<]+<\/p>/i.test(cssCode);
    const hasAge = /<p[^>]*>[^<]*umur\s*:[^<]+<\/p>/i.test(cssCode);
    if (!hasH1) feedback.push("Gunakan tag <h1> dengan teks 'Profil Developer'.");
    if (!hasName) feedback.push("Tambahkan tag <p> untuk Nama (misal: <p>Nama: Alex</p>).");
    if (!hasAge) feedback.push("Tambahkan tag <p> untuk Umur (misal: <p>Umur: 16 Tahun</p>).");
    const passed = hasH1 && hasName && hasAge;
    return {
      passed,
      score: passed ? 100 : (hasH1 ? 50 : 0),
      feedback: passed ? ["Hebat! Judul profil dan identitas pribadimu berhasil dibuat!"] : feedback,
    };
  }

  if (challengeId === "html-2-first-box" || challengeId === "html-2") {
    const hasDiv = /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasEnclosed = /<div[^>]*>[\s\S]*<h1[\s\S]*<p[\s\S]*<\/div>/i.test(cssCode);
    if (!hasDiv) feedback.push("Gunakan tag <div> ... </div> sebagai wadah pembungkus utama.");
    if (!hasEnclosed) feedback.push("Pastikan seluruh elemen profil (h1 dan data p) berada di dalam <div>.");
    const passed = hasDiv && hasEnclosed;
    return {
      passed,
      score: passed ? 100 : (hasDiv ? 50 : 0),
      feedback: passed ? ["Box <div> pertamamu berhasil membungkus seluruh elemen profil dengan rapi!"] : feedback,
    };
  }

  if (challengeId === "html-3-named-container" || challengeId === "html-3") {
    const hasNamedDiv = /<div[^>]*class\s*=\s*["'][^"']*\bprofile-card\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasEnclosed = /<div[^>]*class\s*=\s*["'][^"']*\bprofile-card\b[^"']*["'][^>]*>[\s\S]*<h1[\s\S]*<\/div>/i.test(cssCode);
    if (!hasNamedDiv) feedback.push("Beri identitas class='profile-card' pada tag pembungkus div.");
    if (!hasEnclosed) feedback.push("Pastikan elemen profil berada di dalam kontainer bertarget.");
    const passed = hasNamedDiv && hasEnclosed;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Box-mu kini memiliki identitas class='profile-card' yang siap ditata oleh CSS!"] : feedback,
    };
  }

  if (challengeId === "html-4-siblings" || challengeId === "html-4") {
    const divs = cssCode.match(/<div[^>]*>[\s\S]*?<\/div>/gi);
    const hasTwoDivs = Boolean(divs && divs.length >= 2);
    const hasNotesBox =
      /<div[^>]*class\s*=\s*["'][^"']*\b(notes-card|activity-card|note-box|status-box)\b[^"']*["'][^>]*>/i.test(cssCode) ||
      (/<h3[^>]*>[\s\S]*<\/h3>/i.test(cssCode) && /<p[^>]*>[\s\S]*<\/p>/i.test(cssCode) && Boolean(divs && divs.length >= 2));
    if (!hasTwoDivs) feedback.push("Buat minimal dua <div> sejajar (siblings, atas dan bawah).");
    if (!hasNotesBox) feedback.push("Di kartu kedua, buat <div class='notes-card'> berisi <h3> dan <p>.");
    const passed = hasTwoDivs && hasNotesBox;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Dua kontainer bersaudara (Profile Card & Notes Card) berhasil disusun sejajar!"] : feedback,
    };
  }

  if (challengeId === "html-5-triple-stack" || challengeId === "html-5") {
    const hasTopBar = /<div[^>]*class\s*=\s*["'][^"']*\btop-bar\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasContentArea = /<div[^>]*class\s*=\s*["'][^"']*\bcontent-area\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasBottomBar = /<div[^>]*class\s*=\s*["'][^"']*\bbottom-bar\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode);
    if (!hasTopBar) feedback.push("Buat zona atas <div class='top-bar'>.");
    if (!hasContentArea) feedback.push("Buat zona konten <div class='content-area'>.");
    if (!hasBottomBar) feedback.push("Buat zona bawah <div class='bottom-bar'>.");
    const passed = hasTopBar && hasContentArea && hasBottomBar;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Tiga zona vertikal (top-bar, content-area, bottom-bar) berhasil dirakit!"] : feedback,
    };
  }

  if (challengeId === "html-6-matryoshka" || challengeId === "html-6") {
    const hasParent = /<div[^>]*class\s*=\s*["'][^"']*\bcard\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode) || /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasDualChildren = /<div[^>]*class\s*=\s*["'][^"']*\bavatar-box\b[^"']*["'][^>]*>/i.test(cssCode) && /<div[^>]*class\s*=\s*["'][^"']*\binfo-box\b[^"']*["'][^>]*>/i.test(cssCode);
    if (!hasParent || !hasDualChildren) feedback.push("Buat satu <div class='card'> parent yang membungkus dua child: avatar-box dan info-box.");
    const passed = hasParent && hasDualChildren;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Sempurna! Konsep nesting kolom (box di dalam box) berhasil dipahami!"] : feedback,
    };
  }

  if (challengeId === "html-7-avatar-frame" || challengeId === "html-7") {
    const hasFrame = /<div[^>]*class\s*=\s*["'][^"']*\bavatar-frame\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasImg = /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(cssCode) && /<img\b[^>]*\balt\s*=\s*["'][^"']*["'][^>]*>/i.test(cssCode);
    if (!hasFrame) feedback.push("Bungkus gambar dengan <div class='avatar-frame'>.");
    if (!hasImg) feedback.push("Pastikan tag <img> memiliki atribut src dan alt di dalam frame.");
    const passed = hasFrame && hasImg;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Frame pembungkus foto <div class='avatar-frame'> berhasil dibuat rapi!"] : feedback,
    };
  }

  if (challengeId === "html-8-card-anatomy" || challengeId === "html-8") {
    const hasHeader = /<div[^>]*class\s*=\s*["'][^"']*\bcard-header\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasBody = /<div[^>]*class\s*=\s*["'][^"']*\bcard-body\b[^"']*["'][^>]*>/i.test(cssCode);
    if (!hasHeader) feedback.push("Buat wadah anatomi atas <div class='card-header'>.");
    if (!hasBody) feedback.push("Buat wadah anatomi konten <div class='card-body'>.");
    const passed = hasHeader && hasBody;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Anatomi kartu profesional (card-header dan card-body) berhasil dipisahkan!"] : feedback,
    };
  }

  if (challengeId === "html-9-action-row" || challengeId === "html-9") {
    const hasRow = /<div[^>]*class\s*=\s*["'][^"']*\baction-row\b[^"']*["'][^>]*>/i.test(cssCode);
    const buttons = cssCode.match(/<button[^>]*>[\s\S]*?<\/button>/gi);
    const hasButtons = Boolean(buttons && buttons.length >= 2);
    if (!hasRow) feedback.push("Bungkus tombol dengan <div class='action-row'>.");
    if (!hasButtons) feedback.push("Sertakan minimal 2 tombol <button> di dalam baris aksi.");
    const passed = hasRow && hasButtons;
    return {
      passed,
      score: passed ? 100 : (hasRow ? 50 : 0),
      feedback: passed ? ["Baris aksi tombol interaktif <div class='action-row'> berhasil dirakit!"] : feedback,
    };
  }

  if (challengeId === "html-10-badge-overlay" || challengeId === "html-10") {
    const hasBadge = /<div[^>]*class\s*=\s*["'][^"']*\b(badge-role|badge-tag|badge-pill|badge-status|badge-pro|badge)\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasText = /<div[^>]*class\s*=\s*["'][^"']*\b(badge-role|badge-tag|badge-pill|badge-status|badge-pro|badge)\b[^"']*["'][^>]*>[^<]+<\/div>/i.test(cssCode);
    if (!hasBadge) feedback.push("Buat label mini tag <div class='badge-role'> (atau badge-tag).");
    if (!hasText) feedback.push("Tuliskan label profesi atau spesialisasi (misal: Frontend Developer) di dalam badge.");
    const passed = hasBadge && hasText;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Badge label profesi berhasil diposisikan ke dalam header kartu!"] : feedback,
    };
  }

  if (challengeId === "html-11-stats-columns" || challengeId === "html-11") {
    const hasStatsRow = /<div[^>]*class\s*=\s*["'][^"']*\b(metrics-row|stats-row)\b[^"']*["'][^>]*>/i.test(cssCode);
    const statBoxes = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\b(metric-box|stat-box)\b[^"']*["'][^>]*>/gi);
    const hasThreeStats = Boolean(statBoxes && statBoxes.length >= 3);
    if (!hasStatsRow) feedback.push("Buat pembungkus baris <div class='metrics-row'> (atau stats-row).");
    if (!hasThreeStats) feedback.push("Sertakan minimal 3 kotak anak <div class='metric-box'> di dalam baris metrik.");
    const passed = hasStatsRow && hasThreeStats;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Tiga kolom metrik ringkasan portofolio berhasil dirakit dengan pola baris-kotak!"] : feedback,
    };
  }

  if (challengeId === "html-12-modular-card" || challengeId === "html-12") {
    const hasParent = /<div[^>]*class\s*=\s*["'][^"']*\bprofile-card\b[^"']*["'][^>]*>/i.test(cssCode) || /<div[^>]*class\s*=\s*["'][^"']*\bcard\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasHeader = /<div[^>]*class\s*=\s*["'][^"']*\bcard-header\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasBody = /<div[^>]*class\s*=\s*["'][^"']*\bcard-body\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasStats = /<div[^>]*class\s*=\s*["'][^"']*\b(metrics-row|stats-row)\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasFooter = /<div[^>]*class\s*=\s*["'][^"']*\b(card-footer|action-row)\b[^"']*["'][^>]*>/i.test(cssCode);

    if (!hasParent) feedback.push("Bungkus seluruh komponen dengan <div class='profile-card'>.");
    if (!hasHeader) feedback.push("Buat <div class='card-header'> yang memuat avatar-frame dan badge.");
    if (!hasBody || !hasStats) feedback.push("Buat <div class='card-body'> yang memuat nama, bio, dan metrics-row (3 metric-box).");
    if (!hasFooter) feedback.push("Buat <div class='card-footer'> dengan action-row dan 2 tombol.");

    const passed = hasParent && hasHeader && hasBody && hasStats && hasFooter;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["PROYEK CAPSTONE SELESAI! Kamu resmi menguasai 5 tingkatan kontainer modular Profile Card!"] : feedback,
    };
  }

  if (challengeId === "html-13-split-layout" || challengeId === "html-13") {
    const hasLayout = /<div[^>]*class\s*=\s*["'][^"']*\bapp-layout\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasSidebar = /<div[^>]*class\s*=\s*["'][^"']*\bsidebar\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasMain = /<div[^>]*class\s*=\s*["'][^"']*\bmain-content\b[^"']*["'][^>]*>/i.test(cssCode);
    if (!hasLayout) feedback.push("Buat box pembungkus layar <div class='app-layout'>.");
    if (!hasSidebar) feedback.push("Buat panel bilah samping <div class='sidebar'>.");
    if (!hasMain) feedback.push("Buat panel area kerja utama <div class='main-content'>.");
    const passed = hasLayout && hasSidebar && hasMain;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Layout belah layar (app-layout -> sidebar & main-content) berhasil dirakit!"] : feedback,
    };
  }

  if (challengeId === "html-14-sidebar-nav" || challengeId === "html-14") {
    const hasBrand = /<div[^>]*class\s*=\s*["'][^"']*\bbrand-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasMenu = /<div[^>]*class\s*=\s*["'][^"']*\bmenu-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const lis = cssCode.match(/<li[^>]*>[\s\S]*?<\/li>/gi);
    const hasThreeLis = Boolean(lis && lis.length >= 3);
    if (!hasBrand) feedback.push("Buat <div class='brand-box'> berisi logo/nama webmu.");
    if (!hasMenu) feedback.push("Buat <div class='menu-box'> yang membungkus <ul>.");
    if (!hasThreeLis) feedback.push("Sertakan minimal 3 butir tautan menu <li> di dalam <ul>.");
    const passed = hasBrand && hasMenu && hasThreeLis;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Bilah samping navigasi lengkap (brand-box dan menu-box dengan list) berhasil dibuat!"] : feedback,
    };
  }

  if (challengeId === "html-15-content-cards" || challengeId === "html-15") {
    const hasBanner = /<div[^>]*class\s*=\s*["'][^"']*\bbanner-card\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasOverview = /<div[^>]*class\s*=\s*["'][^"']*\boverview-card\b[^"']*["'][^>]*>/i.test(cssCode);
    if (!hasBanner) feedback.push("Buat kartu ucapan selamat datang <div class='banner-card'>.");
    if (!hasOverview) feedback.push("Buat kartu ringkasan target <div class='overview-card'>.");
    const passed = hasBanner && hasOverview;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Dua kartu modular mandiri berhasil ditumpuk di area main content!"] : feedback,
    };
  }

  if (challengeId === "html-16-form-group" || challengeId === "html-16") {
    const hasForm = /<form[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const groups = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\bform-group\b[^"']*["'][^>]*>/gi);
    const hasTwoGroups = Boolean(groups && groups.length >= 2);
    const inputs = cssCode.match(/<input\b[^>]*>/gi);
    const hasInputs = Boolean(inputs && inputs.length >= 2);
    const hasButton = /<button[^>]*>[\s\S]*<\/button>/i.test(cssCode);
    if (!hasForm) feedback.push("Bungkus formulir dengan tag <form>.");
    if (!hasTwoGroups) feedback.push("Bungkus setiap baris input ke dalam <div class='form-group'> (minimal 2 grup).");
    if (!hasInputs) feedback.push("Setiap grup harus memuat pasangan <label> dan <input>.");
    if (!hasButton) feedback.push("Tambahkan tombol submit <button type='submit'>.");
    const passed = hasForm && hasTwoGroups && hasInputs && hasButton;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Arsitektur formulir terstruktur dengan grouping div form-group berhasil dirakit!"] : feedback,
    };
  }

  if (challengeId === "html-17-modal-dialog" || challengeId === "html-17") {
    const hasOverlay = /<div[^>]*class\s*=\s*["'][^"']*\bmodal-overlay\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasBox = /<div[^>]*class\s*=\s*["'][^"']*\bmodal-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasContent = /<h3\b/i.test(cssCode) && /<button\b/i.test(cssCode);
    if (!hasOverlay) feedback.push("Buat box luar lapisan gelap <div class='modal-overlay'>.");
    if (!hasBox) feedback.push("Di dalamnya, buat box popup tengah <div class='modal-box'>.");
    if (!hasContent) feedback.push("Sertakan judul <h3>, teks paragraf, dan tombol <button>Tutup</button> di dalam modal-box.");
    const passed = hasOverlay && hasBox && hasContent;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Arsitektur popup modal 2 lapis (overlay dan modal box) berhasil dirakit sempurna!"] : feedback,
    };
  }

  if (challengeId === "html-18-bento-grid" || challengeId === "html-18") {
    const hasBento = /<div[^>]*class\s*=\s*["'][^"']*\bbento-container\b[^"']*["'][^>]*>/i.test(cssCode);
    const items = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\bbento-item\b[^"']*["'][^>]*>/gi);
    const hasFourItems = Boolean(items && items.length >= 4);
    if (!hasBento) feedback.push("Buat wadah induk <div class='bento-container'>.");
    if (!hasFourItems) feedback.push("Sertakan minimal 4 box modular <div class='bento-item'> di dalamnya.");
    const passed = hasBento && hasFourItems;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Pondasi 4 blok Bento Box modern ala Apple berhasil dibangun!"] : feedback,
    };
  }

  if (challengeId === "html-19-semantic-hybrid" || challengeId === "html-19") {
    const hasHeader = /<header[^>]*>[\s\S]*<div[^>]*class\s*=\s*["'][^"']*\bcontainer\b[^"']*["'][^>]*>[\s\S]*<\/div>[\s\S]*<\/header>/i.test(cssCode);
    const hasMain = /<main[^>]*>[\s\S]*<div[^>]*class\s*=\s*["'][^"']*\bcontainer\b[^"']*["'][^>]*>[\s\S]*<\/div>[\s\S]*<\/main>/i.test(cssCode);
    const hasFooter = /<footer[^>]*>[\s\S]*<div[^>]*class\s*=\s*["'][^"']*\bcontainer\b[^"']*["'][^>]*>[\s\S]*<\/div>[\s\S]*<\/footer>/i.test(cssCode);
    if (!hasHeader) feedback.push("Buat tag <header> yang membungkus <div class='container'>.");
    if (!hasMain) feedback.push("Buat tag <main> yang membungkus <div class='container'>.");
    if (!hasFooter) feedback.push("Buat tag <footer> yang membungkus <div class='container'>.");
    const passed = hasHeader && hasMain && hasFooter;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Harmoni sempurna! Semantik SEO dan div container layout berhasil dipadukan!"] : feedback,
    };
  }

  if (challengeId === "html-20-boss-dashboard" || challengeId === "html-20") {
    const hasLayout = /<div[^>]*class\s*=\s*["'][^"']*\bdashboard-layout\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasSidebar = /<div[^>]*class\s*=\s*["'][^"']*\bsidebar\b[^"']*["'][^>]*>/i.test(cssCode) && /<ul\b/i.test(cssCode);
    const hasMain = /<div[^>]*class\s*=\s*["'][^"']*\bmain-panel\b[^"']*["'][^>]*>/i.test(cssCode);
    const bentoCards = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\b(bento-item|card|stat-box)\b/gi);
    const hasCards = Boolean(bentoCards && bentoCards.length >= 3);

    if (!hasLayout) feedback.push("Bungkus seluruh dashboard dengan <div class='dashboard-layout'>.");
    if (!hasSidebar) feedback.push("Buat <div class='sidebar'> dengan brand dan daftar navigasi <ul>-<li>.");
    if (!hasMain) feedback.push("Buat area kerja utama <div class='main-panel'>.");
    if (!hasCards) feedback.push("Sertakan minimal 3 kartu bento/komponen modular dan form di dalam main-panel.");

    const passed = hasLayout && hasSidebar && hasMain && hasCards;
    return {
      passed,
      score: passed ? 100 : 60,
      feedback: passed
        ? ["🏆 PROYEK AKHIR SELESAI! Selamat, kamu resmi menguasai arsitektur HTML & Sistem Kontainer Div secara mendalam dan profesional! 🎉"]
        : feedback,
    };
  }

  // ================= CSS BASICS (Full 20 Levels) =================
  if (challengeId === "css-basics-1-background-color" || challengeId === "css-basics-1" || challengeId === "basics-1") {
    const passed = /background-color\s*:\s*(lightblue|#add8e6|rgb\(\s*173\s*,\s*216\s*,\s*230\s*\)|sky-?blue|#38bdf8|#60a5fa|#f1f5f9|#e0f2fe|#bae6fd)/i.test(cssCode) || /background\s*:\s*(lightblue|#add8e6|#38bdf8|#e0f2fe)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan background-color: lightblue; pada kotak.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Warna latar kanvas berhasil diubah menjadi biru muda!"] : feedback,
    };
  }

  if (challengeId === "css-basics-2-text-color" || challengeId === "css-basics-2" || challengeId === "basics-2") {
    const passed = /color\s*:\s*(#333|#333333|black|#000|#000000|rgb\(\s*51\s*,\s*51\s*,\s*51\s*\)|#1e293b|#0f172a)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan color: #0f172a; atau color: #333; untuk mewarnai teks.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Teks kini kontras, tajam, dan mudah dibaca!"] : feedback,
    };
  }

  if (challengeId === "css-basics-3-font-size" || challengeId === "css-basics-3" || challengeId === "basics-3") {
    const passed = /font-size\s*:\s*(24px|1\.5rem)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan font-size: 24px; untuk membesarkan teks.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Ukuran huruf berhasil dibesarkan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-4-font-weight" || challengeId === "css-basics-4" || challengeId === "basics-4") {
    const passed = /font-weight\s*:\s*(bold|700|800|900)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan font-weight: bold; agar teks menjadi tebal.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Teks kini tebal dan memiliki bobot fokal!"] : feedback,
    };
  }

  if (challengeId === "css-basics-5-text-align" || challengeId === "css-basics-5" || challengeId === "basics-5") {
    const passed = /text-align\s*:\s*center/i.test(cssCode);
    if (!passed) feedback.push("Gunakan text-align: center; untuk memusatkan teks secara horizontal.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Paragraf kini rata tengah dengan seimbang!"] : feedback,
    };
  }

  if (challengeId === "css-basics-6-line-height" || challengeId === "css-basics-6" || challengeId === "basics-6") {
    const passed = /line-height\s*:\s*(1\.6|1\.5|1\.7|24px|28px|160%)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan line-height: 1.6; untuk memberi jarak bernapas antar baris.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Irama vertikal teks kini lapang dan nyaman dibaca!"] : feedback,
    };
  }

  if (challengeId === "css-basics-7-padding" || challengeId === "css-basics-7" || challengeId === "basics-7") {
    const passed = /padding\s*:\s*(20px|1\.25rem|24px|16px)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan padding: 20px; untuk memberi ruang napas di dalam kotak.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Ruang napas (padding) di dalam kotak berhasil dibuat!"] : feedback,
    };
  }

  if (challengeId === "css-basics-8-margin" || challengeId === "css-basics-8" || challengeId === "basics-8") {
    const passed = /margin\s*:\s*(15px|16px|1rem|20px|24px)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan margin: 20px; untuk memberi jarak di luar kotak.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Jarak luar (margin) berhasil memisahkan kotak dari tetangganya!"] : feedback,
    };
  }

  if (challengeId === "css-basics-9-border" || challengeId === "css-basics-9" || challengeId === "basics-9") {
    const passed = /border\s*:\s*(2px|3px|1px|4px)\s+solid/i.test(cssCode);
    if (!passed) feedback.push("Gunakan border: 2px solid #0f172a; untuk memberi garis pembatas.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Garis tepi (border) neo-brutalisme tegas berhasil dipasang!"] : feedback,
    };
  }

  if (challengeId === "css-basics-10-border-radius" || challengeId === "css-basics-10" || challengeId === "basics-10") {
    const passed = /border-radius\s*:\s*(16px|12px|1rem|20px|0\.75rem)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan border-radius: 16px; untuk melengkungkan sudut.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Sudut kotak kini membulat lembut dan modern!"] : feedback,
    };
  }

  if (challengeId === "css-basics-11-dimensions" || challengeId === "css-basics-11" || challengeId === "basics-11") {
    const hasWidth = /width\s*:\s*(320px|280px|300px|100%|20rem)/i.test(cssCode);
    const hasHeight = /(min-height|height)\s*:\s*(160px|200px|150px|180px|auto)/i.test(cssCode);
    if (!hasWidth) feedback.push("Atur lebar kotak dengan width: 320px;.");
    if (!hasHeight) feedback.push("Beri ruang tinggi minimal dengan min-height: 160px;.");
    const passed = hasWidth || hasHeight;
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Dimensi kotak berhasil dikendalikan secara proporsional!"] : feedback,
    };
  }

  if (challengeId === "css-basics-12-box-sizing" || challengeId === "css-basics-12" || challengeId === "basics-12") {
    const passed = /box-sizing\s*:\s*border-box/i.test(cssCode);
    if (!passed) feedback.push("Kunci kalkulasi kotak dengan box-sizing: border-box;.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Kalkulasi dimensi kotak aman dari risiko overflow!"] : feedback,
    };
  }

  if (challengeId === "css-basics-13-capstone-card" || challengeId === "css-basics-13" || challengeId === "basics-13") {
    const gBg = /background(-color)?\s*:\s*(#fef08a|#fde047|#facc15|yellow|white|#fff)/i.test(cssCode);
    const gPad = /padding\s*:\s*(16px|20px|24px|1rem)/i.test(cssCode);
    const gBorder = /border\s*:\s*(2px|3px|4px)\s+solid/i.test(cssCode);
    const gRadius = /border-radius\s*:\s*(16px|12px|20px|1rem)/i.test(cssCode);
    if (!gBg) feedback.push("Gunakan background-color: #fef08a;.");
    if (!gPad) feedback.push("Beri padding: 16px;.");
    if (!gBorder) feedback.push("Beri border: 3px solid #0f172a;.");
    if (!gRadius) feedback.push("Beri border-radius: 16px;.");
    const passed = gBg && gPad && gBorder && gRadius;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["🎉 CAPSTONE TENGAH SELESAI! Kamu sukses mengintegrasikan Box Model menjadi kartu Neo-Brutalist yang memukau!"] : feedback,
    };
  }

  if (challengeId === "css-basics-14-box-shadow" || challengeId === "css-basics-14" || challengeId === "basics-14") {
    const passed = /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    if (!passed) feedback.push("Gunakan box-shadow: 4px 4px 0px #0f172a; untuk bayangan tegas.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Efek bayangan tegas 3D (box-shadow) berhasil mengangkat kartu ke permukaan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-15-opacity" || challengeId === "css-basics-15" || challengeId === "basics-15") {
    const passed = /opacity\s*:\s*(0\.75|0\.8|0\.7|0\.85|0\.9)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan opacity: 0.75; untuk meredupkan transparansi elemen.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Tingkat transparansi visual berhasil disesuaikan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-16-cursor-overflow" || challengeId === "css-basics-16" || challengeId === "basics-16") {
    const gCursor = /cursor\s*:\s*pointer/i.test(cssCode);
    const gOverflow = /overflow\s*:\s*hidden/i.test(cssCode);
    if (!gCursor) feedback.push("Beri cursor: pointer;.");
    if (!gOverflow) feedback.push("Beri overflow: hidden; agar konten tidak meluap.");
    const passed = gCursor && gOverflow;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Isyarat klik interaktif dan pencegahan luapan konten berhasil diaktifkan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-17-gradient" || challengeId === "css-basics-17" || challengeId === "basics-17") {
    const passed = /background(-image)?\s*:\s*linear-gradient\([^;]+\)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan background: linear-gradient(135deg, #fef08a, #fed7aa);.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Gradasi latar belakang dua nada berhasil menyuntikkan energi visual!"] : feedback,
    };
  }

  if (challengeId === "css-basics-18-transform" || challengeId === "css-basics-18" || challengeId === "basics-18") {
    const passed = /transform\s*:\s*(translatey\(-?\d+px\)|scale\([^)]+\)|translate\([^)]+\))/i.test(cssCode);
    if (!passed) feedback.push("Gunakan transform: translateY(-4px); untuk mengangkat posisi kartu.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Transformasi spasial kartu berhasil diterapkan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-19-transitions" || challengeId === "css-basics-19" || challengeId === "basics-19") {
    const passed = /transition\s*:\s*[^;]+/i.test(cssCode);
    if (!passed) feedback.push("Gunakan transition: all 0.2s ease-in-out; untuk kehalusan animasi.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Transisi mikro halus berhasil diaktifkan untuk pengalaman pengguna yang mulus!"] : feedback,
    };
  }

  if (challengeId === "css-basics-20-boss-card" || challengeId === "css-basics-20" || challengeId === "basics-20" || challengeId === "css-basics-12-boss-fight") {
    const gBg = /background(-color)?\s*:\s*(#fef08a|#ef4444|#fde047|#bae6fd|#fed7aa|yellow|red|white)/i.test(cssCode);
    const gBorder = /border\s*:\s*(2px|3px|4px)\s+solid/i.test(cssCode);
    const gRadius = /border-radius\s*:\s*(16px|20px|24px|999px|9999px|1rem)/i.test(cssCode);
    const gShadow = /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    if (!gBg) feedback.push("Terapkan warna latar.");
    if (!gBorder) feedback.push("Terapkan garis tepi tebal (border: 3px solid #0f172a).");
    if (!gRadius) feedback.push("Terapkan border-radius sudut membulat.");
    if (!gShadow) feedback.push("Terapkan efek bayangan elevasi (box-shadow).");
    const passed = gBg && gBorder && gRadius && gShadow;
    return {
      passed,
      score: passed ? 100 : 60,
      feedback: passed
        ? ["🏆 PROYEK AKHIR SELESAI! Selamat, kamu resmi menguasai seluruh fondasi CSS Basics, Box Model, dan Styling Modern berstandar profesional! 🎉"]
        : feedback,
    };
  }

  // ================= CSS FLEXBOX (12 Levels) =================
  if (challengeId === "flexbox-1-activation" || challengeId === "fb-1") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    if (!hasFlex) feedback.push("Gunakan display: flex; pada .arena.");
    return {
      passed: hasFlex,
      score: hasFlex ? 100 : 0,
      feedback: hasFlex ? ["Mode sakti Flexbox aktif! Kotak kini berbaris ke samping."] : feedback,
    };
  }

  if (challengeId === "flexbox-2-push-justify-end" || challengeId === "fb-2") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasEnd = /justify-content\s*:\s*(flex-end|end)/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; tetap aktif.");
    if (!hasEnd) feedback.push("Gunakan justify-content: flex-end; untuk mendorong kotak ke ujung kanan.");
    const passed = hasFlex && hasEnd;
    return {
      passed,
      score: passed ? 100 : (hasFlex ? 50 : 0),
      feedback: passed ? ["Semua kotak berhasil didorong ke ujung kanan ruangan!"] : feedback,
    };
  }

  if (challengeId === "flexbox-3-center-stage" || challengeId === "fb-3") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasCenter = /justify-content\s*:\s*center/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasCenter) feedback.push("Gunakan justify-content: center; untuk mengumpulkan kotak di tengah horizontal.");
    const passed = hasFlex && hasCenter;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Sempurna! Semua kotak berkumpul tepat di tengah panggung!"] : feedback,
    };
  }

  if (challengeId === "flexbox-4-split-space-between" || challengeId === "fb-4") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasBetween = /justify-content\s*:\s*space-between/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasBetween) feedback.push("Gunakan justify-content: space-between; untuk memisahkan kotak ke kedua ujung.");
    const passed = hasFlex && hasBetween;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Kotak kiri dan kanan berhasil terpisah menyentuh dinding layar!"] : feedback,
    };
  }

  if (challengeId === "flexbox-5-social-distancing" || challengeId === "fb-5") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasEvenly = /justify-content\s*:\s*(space-evenly|space-around)/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasEvenly) feedback.push("Gunakan justify-content: space-evenly; agar jarak sela dan jarak tepi sama persis.");
    const passed = hasFlex && hasEvenly;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Jarak yang adil merata (space-evenly) berhasil diterapkan di antara semua kotak!"] : feedback,
    };
  }

  if (challengeId === "flexbox-6-gravity-align-items" || challengeId === "fb-6") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasCenter = /align-items\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasCenter) feedback.push("Gunakan align-items: center; untuk menarik kotak ke tengah secara vertikal.");
    const passed = hasFlex && hasCenter;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Hebat! Gaya gravitasi Flexbox menarik semua kotak tepat di tengah vertikal!"] : feedback,
    };
  }

  if (challengeId === "flexbox-7-floor-align-end" || challengeId === "fb-7") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasEnd = /align-items\s*:\s*(flex-end|end)/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasEnd) feedback.push("Gunakan align-items: flex-end; untuk menjatuhkan kotak ke lantai dasar.");
    const passed = hasFlex && hasEnd;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Seluruh kotak berhasil mendarat bersandar di lantai dasar arena!"] : feedback,
    };
  }

  if (challengeId === "flexbox-8-column-direction" || challengeId === "fb-8") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasColumn = /flex-direction\s*:\s*column\b/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasColumn) feedback.push("Gunakan flex-direction: column; untuk menumpuk kotak ke bawah.");
    const passed = hasFlex && hasColumn;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Alur arah Flexbox berhasil diubah menjadi kolom vertikal!"] : feedback,
    };
  }

  if (challengeId === "flexbox-9-gap" || challengeId === "fb-9") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasGap = /gap\s*:\s*(20px|1\.25rem)/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasGap) feedback.push("Gunakan gap: 20px; untuk memberi jarak antar kotak.");
    const passed = hasFlex && hasGap;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Jarak lorong gap: 20px berhasil memisahkan kotak dengan sangat rapi!"] : feedback,
    };
  }

  if (challengeId === "flexbox-10-overflow-wrap" || challengeId === "fb-10") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasWrap = /flex-wrap\s*:\s*wrap\b/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasWrap) feedback.push("Gunakan flex-wrap: wrap; agar elemen turun ke baris baru saat ruang sempit.");
    const passed = hasFlex && hasWrap;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Elemen kini membungkus (wrap) ke baris baru tanpa hancur menyusut!"] : feedback,
    };
  }

  if (challengeId === "flexbox-11-perfect-center" || challengeId === "fb-11") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasJustify = /justify-content\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    const hasAlign = /align-items\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    if (!hasFlex) feedback.push("Pastikan display: flex; aktif.");
    if (!hasJustify) feedback.push("Pusatkan horizontal dengan justify-content: center;");
    if (!hasAlign) feedback.push("Pusatkan vertikal dengan align-items: center;");
    const passed = hasFlex && hasJustify && hasAlign;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Legenda interview terpecahkan! Kotak berada tepat di tengah horizontal dan vertikal!"] : feedback,
    };
  }

  if (challengeId === "flexbox-12-boss-modern-navbar" || challengeId === "fb-12") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasSpaceBetween = /justify-content\s*:\s*space-between/.test(normalized);
    const hasAlignCenter = /align-items\s*:\s*center/.test(normalized);
    if (!hasFlex) feedback.push("Aktifkan display: flex; pada navbar.");
    if (!hasSpaceBetween) feedback.push("Pisahkan logo di kiri dan menu di kanan dengan justify-content: space-between;");
    if (!hasAlignCenter) feedback.push("Sejajarkan posisi vertikal dengan align-items: center;");
    const passed = hasFlex && hasSpaceBetween && hasAlignCenter;
    return {
      passed,
      score: passed ? 100 : 60,
      feedback: passed
        ? ["🏆 PROYEK SELESAI! Kamu berhasil merakit Modern Navbar dengan tata letak kelas dunia! Selamat menyelesaikan kelas CSS Flexbox! 🎉"]
        : feedback,
    };
  }

  // ================= CSS GRID (12 Levels) =================
  if (challengeId === "grid-1-blueprint" || challengeId === "gr-1" || challengeId === "grid-1-two-columns") {
    const hasGrid = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const hasCols = /grid-template-columns\s*:\s*(1fr\s+1fr|repeat\(\s*2\s*,\s*1fr\s*\)|50%\s+50%)/.test(normalized);
    if (!hasGrid) feedback.push("Gunakan display: grid; pada container.");
    if (!hasCols) feedback.push("Belah menjadi 2 kolom dengan grid-template-columns: 1fr 1fr; (atau repeat(2, 1fr)).");
    const passed = hasGrid && hasCols;
    return {
      passed,
      score: passed ? 100 : (hasGrid ? 50 : 0),
      feedback: passed ? ["Blueprint Grid pertama berhasil dibangun: 2 kolom 1fr simetris!"] : feedback,
    };
  }

  if (challengeId === "grid-2-triplets" || challengeId === "gr-2") {
    const hasGrid = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const hasRepeat = /grid-template-columns\s*:\s*(repeat\(\s*3\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr)/.test(normalized);
    if (!hasGrid) feedback.push("Pastikan display: grid; aktif.");
    if (!hasRepeat) feedback.push("Gunakan fungsi repeat(3, 1fr) pada grid-template-columns.");
    const passed = hasGrid && hasRepeat;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Ringkas dan elegan! 3 kolom triplets repeat(3, 1fr) siap digunakan!"] : feedback,
    };
  }

  if (challengeId === "grid-3-asymmetry" || challengeId === "gr-3") {
    const hasGrid = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const hasAsym = /grid-template-columns\s*:\s*(250px\s+1fr|250px\s+auto)/.test(normalized);
    if (!hasGrid) feedback.push("Pastikan display: grid; aktif.");
    if (!hasAsym) feedback.push("Set kolom 1 fix 250px dan kolom 2 fleksibel 1fr (grid-template-columns: 250px 1fr).");
    const passed = hasGrid && hasAsym;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Layout Sidebar asimetris (250px 1fr) berhasil dirakit!"] : feedback,
    };
  }

  if (challengeId === "grid-4-alleyway" || challengeId === "gr-4") {
    const hasGrid = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const hasGap = /gap\s*:\s*(24px|1\.5rem)/.test(normalized) || /grid-gap\s*:\s*24px/.test(normalized);
    if (!hasGrid) feedback.push("Pastikan display: grid; aktif.");
    if (!hasGap) feedback.push("Beri lorong pemisah 24px dengan gap: 24px;");
    const passed = hasGrid && hasGap;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Lorong pemisah gap: 24px memberikan jarak sela yang presisi antar sel grid!"] : feedback,
    };
  }

  if (challengeId === "grid-5-header-expansion" || challengeId === "gr-5") {
    const hasSpan = /grid-column\s*:\s*(span\s*3|1\s*\/\s*(4|-1))/.test(normalized);
    if (!hasSpan) feedback.push("Bentangkan elemen header melintasi 3 kolom dengan grid-column: span 3;");
    return {
      passed: hasSpan,
      score: hasSpan ? 100 : 40,
      feedback: hasSpan ? ["Header berhasil membentang menutupi 3 kolom penuh di bagian atas!"] : feedback,
    };
  }

  if (challengeId === "grid-6-tower-expansion" || challengeId === "gr-6") {
    const hasRowSpan = /grid-row\s*:\s*(span\s*2|1\s*\/\s*3)/.test(normalized);
    if (!hasRowSpan) feedback.push("Tinggikan sidebar memakan 2 baris dengan grid-row: span 2;");
    return {
      passed: hasRowSpan,
      score: hasRowSpan ? 100 : 40,
      feedback: hasRowSpan ? ["Menara sidebar berhasil membentang ke bawah memakan 2 baris vertikal!"] : feedback,
    };
  }

  if (challengeId === "grid-7-absolute-placement" || challengeId === "gr-7") {
    const hasPlacement = /grid-column\s*:\s*(1\s*\/\s*3|1\s*\/\s*span\s*2)/.test(normalized);
    if (!hasPlacement) feedback.push("Tempatkan elemen mulai dari garis ke-1 hingga ke-3 dengan grid-column: 1 / 3;");
    return {
      passed: hasPlacement,
      score: hasPlacement ? 100 : 40,
      feedback: hasPlacement ? ["Penempatan absolut pada garis grid (1 / 3) berhasil diterapkan secara presisi!"] : feedback,
    };
  }

  if (challengeId === "grid-8-grid-center" || challengeId === "gr-8") {
    const hasGrid = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const hasPlace = /place-items\s*:\s*center/.test(normalized) ||
      (/justify-items\s*:\s*center/.test(normalized) && /align-items\s*:\s*center/.test(normalized));
    if (!hasGrid) feedback.push("Pastikan display: grid; aktif.");
    if (!hasPlace) feedback.push("Pusatkan elemen dengan jurus place-items: center;");
    const passed = hasGrid && hasPlace;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Satu jurus sakti: place-items: center berhasil memusatkan elemen secara 2D!"] : feedback,
    };
  }

  if (challengeId === "grid-9-responsive-magic" || challengeId === "gr-9") {
    const hasMagic = /grid-template-columns\s*:\s*repeat\(\s*(auto-fit|auto-fill)\s*,\s*minmax\(\s*200px\s*,\s*1fr\s*\)\)/.test(normalized);
    if (!hasMagic) feedback.push("Gunakan formula ajaib: grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));");
    return {
      passed: hasMagic,
      score: hasMagic ? 100 : 40,
      feedback: hasMagic ? ["Formula responsif legendaris aktif: grid kini otomatis beradaptasi tanpa media query!"] : feedback,
    };
  }

  if (challengeId === "grid-10-grid-areas" || challengeId === "gr-10") {
    const hasArea = /grid-area\s*:\s*header\b/.test(normalized);
    if (!hasArea) feedback.push("Beri nama area dengan grid-area: header;");
    return {
      passed: hasArea,
      score: hasArea ? 100 : 40,
      feedback: hasArea ? ["Area berhasil dinamai 'header' secara semantik untuk cetak biru template grid!"] : feedback,
    };
  }

  if (challengeId === "grid-11-inception" || challengeId === "gr-11") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    if (!hasFlex) feedback.push("Jadikan elemen kartu di dalam sel grid sebagai Flexbox dengan display: flex;");
    return {
      passed: hasFlex,
      score: hasFlex ? 100 : 50,
      feedback: hasFlex ? ["Harmoni sempurna! Grid dan Flexbox berpadu apik untuk layout makro dan mikro!"] : feedback,
    };
  }

  if (challengeId === "grid-12-boss-bento-dashboard" || challengeId === "gr-12") {
    const hasCols = /grid-template-columns\s*:\s*(repeat\(\s*4\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr\s+1fr)/.test(normalized);
    const hasSpan = /grid-column\s*:\s*span\s*2/.test(normalized) || /grid-row\s*:\s*span\s*2/.test(normalized);
    if (!hasCols) feedback.push("Atur kontainer dengan 4 kolom: grid-template-columns: repeat(4, 1fr);");
    if (!hasSpan) feedback.push("Bentangkan kartu utama dengan grid-column: span 2;");
    const passed = hasCols && hasSpan;
    return {
      passed,
      score: passed ? 100 : 60,
      feedback: passed
        ? ["👑 CONGRATULATIONS! Kamu berhasil merakit Bento Box Dashboard modern ala Apple dan menamatkan seluruh level CSS Grid! 🎉🏆"]
        : feedback,
    };
  }

  // Fallback
  return {
    passed: true,
    score: 100,
    feedback: ["Solusi berhasil diverifikasi!"],
  };
}

/**
 * POST /api/challenges/[id]/evaluate
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code } = body;

    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu untuk menyimpan progress." },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Sesi login tidak valid." },
        { status: 401 }
      );
    }

    // Evaluasi fleksibel
    const evaluation = evaluateCss(id, code || "");

    if (!evaluation.passed) {
      await ProgressService.saveDraft(payload.userId, id, code || "");

      return NextResponse.json({
        success: false,
        passed: false,
        score: evaluation.score,
        feedback: evaluation.feedback,
        message: "Tujuan tata letak belum sepenuhnya terpenuhi. Periksa petunjuk dan coba lagi!",
      });
    }

    // Lulus: lengkapi progres, tambahkan XP, perbarui streak, dan buka level berikutnya
    const result = await ProgressService.completeChallenge(
      payload.userId,
      id,
      code || ""
    );

    return NextResponse.json({
      success: true,
      passed: true,
      score: 100,
      feedback: evaluation.feedback,
      earnedXp: result.earnedXp,
      newTotalXp: result.newTotalXp,
      newStreakDays: result.newStreakDays,
      nextChallengeId: result.nextChallengeId,
      isClassCompleted: result.isClassCompleted,
      level: result.level,
      leveledUp: result.leveledUp,
      rankTitle: result.rankTitle,
      rankBadge: result.rankBadge,
      levelProgressPercent: result.levelProgressPercent,
      nextLevelXp: result.nextLevelXp,
      currentLevelXp: result.currentLevelXp,
      message: result.isClassCompleted
        ? "🏆 Selamat! Kamu telah menyelesaikan seluruh level dalam kelas ini!"
        : "Selamat! Level berhasil diselesaikan, level berikutnya telah terbuka!",
    });
  } catch (error) {
    console.error(`[API POST /api/challenges/[id]/evaluate Error]:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengevaluasi jawaban",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
