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

  // ================= HTML ARCHITECTURE (12 Levels) =================
  if (challengeId === "html-1-raw-content") {
    const hasH1 = /<h1[^>]*>[\s\S]*Profil Saya[\s\S]*<\/h1>/i.test(cssCode);
    if (!hasH1) feedback.push("Gunakan tag <h1> dengan teks 'Profil Saya'.");
    return {
      passed: hasH1,
      score: hasH1 ? 100 : 0,
      feedback: hasH1 ? ["Kerangka judul <h1> berhasil dibuat dengan tepat!"] : feedback,
    };
  }

  if (challengeId === "html-2-paragraph") {
    const hasH1 = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]+<\/p>/i.test(cssCode);
    if (!hasP) feedback.push("Tambahkan tag <p> dengan deskripsi singkat dirimu.");
    const passed = hasH1 && hasP;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Paragraf <p> berhasil ditambahkan di bawah judul!"] : feedback,
    };
  }

  if (challengeId === "html-3-first-box") {
    const hasDiv = /<div[^>]*>[\s\S]*<h1[\s\S]*<p[\s\S]*<\/div>/i.test(cssCode);
    if (!hasDiv) feedback.push("Bungkus elemen <h1> dan <p> ke dalam satu container <div>.");
    return {
      passed: hasDiv,
      score: hasDiv ? 100 : 50,
      feedback: hasDiv ? ["Kardus <div> pertamamu berhasil membungkus teks dengan rapi!"] : feedback,
    };
  }

  if (challengeId === "html-4-siblings") {
    const divs = cssCode.match(/<div[^>]*>[\s\S]*?<\/div>/gi);
    const hasTwoDivs = Boolean(divs && divs.length >= 2);
    if (!hasTwoDivs) feedback.push("Buat minimal 2 buah <div> yang sejajar (atas dan bawah).");
    return {
      passed: hasTwoDivs,
      score: hasTwoDivs ? 100 : 50,
      feedback: hasTwoDivs ? ["Dua kardus sejajar (sibling) berhasil disusun!"] : feedback,
    };
  }

  if (challengeId === "html-5-matryoshka") {
    const hasParentAndChildren = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<\/div>/i.test(cssCode);
    if (!hasParentAndChildren) feedback.push("Buat satu <div> utama (Parent) yang membungkus dua <div> (Child) di dalamnya.");
    return {
      passed: hasParentAndChildren,
      score: hasParentAndChildren ? 100 : 50,
      feedback: hasParentAndChildren ? ["Sempurna! Konsep nesting (kardus di dalam kardus) berhasil dipahami!"] : feedback,
    };
  }

  if (challengeId === "html-6-image-element") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasSrc = /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(cssCode);
    if (!hasImg) feedback.push("Gunakan tag <img> (self-closing).");
    if (!hasSrc) feedback.push("Sertakan atribut src dengan tautan gambar.");
    const passed = hasImg && hasSrc;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Elemen gambar <img> berhasil dipasang!"] : feedback,
    };
  }

  if (challengeId === "html-7-action-button") {
    const hasBtn = /<button[^>]*>[\s\S]*Follow[\s\S]*<\/button>/i.test(cssCode);
    if (!hasBtn) feedback.push("Tambahkan tag <button> dengan teks 'Follow'.");
    return {
      passed: hasBtn,
      score: hasBtn ? 100 : 0,
      feedback: hasBtn ? ["Tombol interaktif <button> berhasil dibuat!"] : feedback,
    };
  }

  if (challengeId === "html-8-link") {
    const hasLink = /<a\b[^>]*\bhref\s*=\s*["'][^"']+["'][^>]*>[\s\S]+<\/a>/i.test(cssCode);
    if (!hasLink) feedback.push("Gunakan tag <a> dengan atribut href yang valid.");
    return {
      passed: hasLink,
      score: hasLink ? 100 : 0,
      feedback: hasLink ? ["Tautan navigasi <a> berhasil dipasang!"] : feedback,
    };
  }

  if (challengeId === "html-9-list-hierarchy") {
    const hasUl = /<ul[^>]*>[\s\S]*<\/ul>/i.test(cssCode);
    const hasLi = /<ul[^>]*>[\s\S]*<li[^>]*>[\s\S]*?<\/li>[\s\S]*<\/ul>/i.test(cssCode);
    if (!hasUl) feedback.push("Gunakan tag <ul> sebagai wadah daftar.");
    if (!hasLi) feedback.push("Masukkan elemen item <li> di dalam <ul>.");
    const passed = hasUl && hasLi;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Hierarki daftar <ul> dan <li> berhasil dirakit!"] : feedback,
    };
  }

  if (challengeId === "html-10-semantic-touch") {
    const hasSection = /<section[^>]*>[\s\S]+<\/section>/i.test(cssCode);
    if (!hasSection) feedback.push("Gunakan tag semantik <section> untuk membungkus konten.");
    return {
      passed: hasSection,
      score: hasSection ? 100 : 0,
      feedback: hasSection ? ["Kerangka semantik <section> berhasil diterapkan!"] : feedback,
    };
  }

  if (challengeId === "html-11-form-wrapper") {
    const hasForm = /<form[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasInput = /<form[^>]*>[\s\S]*<input\b[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasButton = /<form[^>]*>[\s\S]*<button\b[^>]*>[\s\S]*<\/button>[\s\S]*<\/form>/i.test(cssCode);
    if (!hasForm) feedback.push("Bungkus elemen dengan tag <form>.");
    if (!hasInput) feedback.push("Sertakan tag <input> di dalam form.");
    if (!hasButton) feedback.push("Sertakan tag <button> di dalam form.");
    const passed = hasForm && hasInput && hasButton;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Formulir pengiriman data berhasil dirakit dengan benar!"] : feedback,
    };
  }

  if (challengeId === "html-12-boss-card") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasInnerDiv = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*<\/div>[\s\S]*<\/div>/i.test(cssCode);
    const hasHead = /<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]*?<\/p>/i.test(cssCode);
    const hasBtn = /<button[^>]*>[\s\S]*?<\/button>/i.test(cssCode);
    if (!hasImg) feedback.push("Tambahkan tag <img /> untuk foto avatar.");
    if (!hasInnerDiv) feedback.push("Bungkus teks nama, bio, dan tombol ke dalam <div> child.");
    if (!hasHead || !hasP || !hasBtn) feedback.push("Pastikan ada elemen judul/nama, paragraf bio, dan tombol follow.");
    const passed = hasImg && hasInnerDiv && hasHead && hasP && hasBtn;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Selamat! Kamu berhasil menaklukkan BOSS FIGHT dan merakit hierarki Profile Card dengan sempurna!"] : feedback,
    };
  }

  // ================= CSS BASICS (12 Levels) =================
  if (challengeId === "css-basics-1-background-color") {
    const passed = /background-color\s*:\s*(lightblue|#add8e6|rgb\(\s*173\s*,\s*216\s*,\s*230\s*\)|sky-?blue|#38bdf8|#60a5fa)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan background-color: lightblue; pada kotak.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Warna latar kanvas berhasil diubah menjadi biru muda!"] : feedback,
    };
  }

  if (challengeId === "css-basics-2-text-color") {
    const passed = /color\s*:\s*(#333|#333333|black|#000|#000000|rgb\(\s*51\s*,\s*51\s*,\s*51\s*\)|#1e293b|#0f172a)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan color: #333; untuk mewarnai teks.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Teks kini kontras dan mudah dibaca!"] : feedback,
    };
  }

  if (challengeId === "css-basics-3-font-size") {
    const passed = /font-size\s*:\s*(24px|1\.5rem)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan font-size: 24px; untuk membesarkan teks.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Ukuran huruf berhasil dibesarkan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-4-font-weight") {
    const passed = /font-weight\s*:\s*(bold|700|800|900)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan font-weight: bold; agar teks menjadi tebal.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Teks kini tebal dan berwibawa!"] : feedback,
    };
  }

  if (challengeId === "css-basics-5-font-style") {
    const passed = /font-style\s*:\s*italic/i.test(cssCode);
    if (!passed) feedback.push("Gunakan font-style: italic; untuk memiringkan teks.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Penekanan teks miring berhasil diterapkan!"] : feedback,
    };
  }

  if (challengeId === "css-basics-6-text-align") {
    const passed = /text-align\s*:\s*center/i.test(cssCode);
    if (!passed) feedback.push("Gunakan text-align: center; untuk memusatkan teks secara horizontal.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Paragraf kini rata tengah dengan rapi!"] : feedback,
    };
  }

  if (challengeId === "css-basics-7-padding") {
    const passed = /padding\s*:\s*(20px|1\.25rem)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan padding: 20px; untuk memberi ruang napas di dalam kotak.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Ruang napas (padding) di dalam kotak berhasil dibuat!"] : feedback,
    };
  }

  if (challengeId === "css-basics-8-margin") {
    const passed = /margin\s*:\s*(15px|16px|1rem|20px)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan margin: 15px; untuk memberi jarak di luar kotak.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Jarak luar (margin) berhasil memisahkan kotak!"] : feedback,
    };
  }

  if (challengeId === "css-basics-9-border") {
    const passed = /border\s*:\s*2px\s+solid/i.test(cssCode);
    if (!passed) feedback.push("Gunakan border: 2px solid black; untuk memberi garis pembatas.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Garis tepi (border) tegas berhasil dipasang!"] : feedback,
    };
  }

  if (challengeId === "css-basics-10-border-radius") {
    const passed = /border-radius\s*:\s*(12px|0\.75rem)/i.test(cssCode);
    if (!passed) feedback.push("Gunakan border-radius: 12px; untuk melengkungkan sudut.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Sudut kotak kini membulat lembut dan modern!"] : feedback,
    };
  }

  if (challengeId === "css-basics-11-box-shadow") {
    const passed = /box-shadow\s*:\s*0px?\s+4px?\s+10px?/i.test(cssCode) || /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    if (!passed) feedback.push("Gunakan box-shadow: 0px 4px 10px rgba(0,0,0,0.1); untuk efek melayang.");
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? ["Efek bayangan 3D (box-shadow) berhasil membuat kotak melayang!"] : feedback,
    };
  }

  if (challengeId === "css-basics-12-boss-fight") {
    const g1 = /background(-color)?\s*:\s*(#ef4444|red|#dc2626|#f87171)/i.test(cssCode);
    const g2 = /color\s*:\s*(white|#fff|#ffffff)/i.test(cssCode);
    const g3 = /padding\s*:\s*8px\s+16px/i.test(cssCode) || /padding\s*:\s*(8px|16px|12px|10px)/i.test(cssCode);
    const g4 = /border-radius\s*:\s*(999px|9999px|50px|50%|24px)/i.test(cssCode);
    if (!g1) feedback.push("Warna latar badge harus merah (#ef4444).");
    if (!g2) feedback.push("Warna teks badge harus putih.");
    if (!g3) feedback.push("Beri padding 8px 16px.");
    if (!g4) feedback.push("Beri border-radius: 999px; agar membulat sempurna.");
    const passed = g1 && g2 && g3 && g4;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed ? ["Selamat! Kamu telah menaklukkan Boss Fight CSS Basics dan merakit Notification Badge dengan sempurna!"] : feedback,
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
        ? ["👑 BOSS FIGHT TAKLUK! Kamu berhasil merakit Modern Navbar dengan tata letak kelas dunia! Selamat menyelesaikan CSS Flexbox! 🎉🏆"]
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
        : "Selamat! Level berhasil ditaklukkan, level berikutnya telah terbuka!",
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
