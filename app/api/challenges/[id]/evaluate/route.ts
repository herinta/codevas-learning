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

  // ================= CSS FLEXBOX (10 Levels) =================
  // LEVEL 1: Rapatkan 3 Permen ke Titik Tengah
  if (challengeId === "flexbox-1-activation") {

    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    if (!hasFlex) feedback.push("⚠️ Elemen arena belum mengaktifkan display: flex;");

    const hasHorizontalCenter =
      /justify-content\s*:\s*(center|space-around|space-evenly)/.test(normalized) ||
      /margin\s*:\s*(auto|0\s+auto)/.test(normalized);
    if (!hasHorizontalCenter) feedback.push("⚠️ Kotak permen belum terpusat secara horizontal (gunakan justify-content: center).");

    const hasVerticalCenter =
      /align-items\s*:\s*center/.test(normalized) ||
      /place-items\s*:\s*center/.test(normalized) ||
      /align-content\s*:\s*center/.test(normalized);
    if (!hasVerticalCenter) feedback.push("⚠️ Kotak permen belum sejajar di tengah secara vertikal (gunakan align-items: center).");

    const passed = hasFlex && hasHorizontalCenter && hasVerticalCenter;
    return {
      passed,
      score: passed ? 100 : Math.round(([hasFlex, hasHorizontalCenter, hasVerticalCenter].filter(Boolean).length / 3) * 100),
      feedback: passed
        ? ["🎉 Luar biasa! Ketiga permen berhasil kamu kumpulkan dan ratakan di tengah arena!"]
        : feedback,
    };
  }

  // LEVEL 2: Sebarkan Elemen ke Kedua Ujung Tepi (Space Between)
  if (challengeId === "flexbox-2-space-between") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasSpaceBetween = /justify-content\s*:\s*space-between/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Pastikan display: flex; tetap aktif.");
    if (!hasSpaceBetween) feedback.push("⚠️ Gunakan justify-content: space-between; untuk menyebarkan permen ke batas tepi.");

    const passed = hasFlex && hasSpaceBetween;
    return {
      passed,
      score: passed ? 100 : (hasFlex ? 50 : 0),
      feedback: passed
        ? ["🎉 Sempurna! Elemen kini terpisah merata dari ujung kiri hingga ujung kanan!"]
        : feedback,
    };
  }

  // LEVEL 3: Distribusi Jarak Merata (Space Around / Space Evenly)
  if (challengeId === "flexbox-3-space-around") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasSpaceAround = /justify-content\s*:\s*(space-around|space-evenly)/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Pastikan display: flex; aktif.");
    if (!hasSpaceAround) feedback.push("⚠️ Berikan spasi merata di sekeliling elemen dengan justify-content: space-around;.");

    const passed = hasFlex && hasSpaceAround;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed
        ? ["🎉 Hebat! Ruang sela di sekeliling permen kini terbagi sangat proporsional!"]
        : feedback,
    };
  }

  // LEVEL 4: Dorong Semua Permen ke Pojok Kanan Bawah (Flex End)
  if (challengeId === "flexbox-4-flex-end") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasJustifyEnd = /justify-content\s*:\s*(flex-end|end)/.test(normalized);
    const hasAlignEnd = /align-items\s*:\s*(flex-end|end)/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Pastikan display: flex; aktif.");
    if (!hasJustifyEnd) feedback.push("⚠️ Dorong elemen ke kanan dengan justify-content: flex-end;");
    if (!hasAlignEnd) feedback.push("⚠️ Turunkan elemen ke dasar dengan align-items: flex-end;");

    const passed = hasFlex && hasJustifyEnd && hasAlignEnd;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed
        ? ["🎉 Keren! Seluruh permen telah berkumpul di pojok kanan bawah arena!"]
        : feedback,
    };
  }

  // LEVEL 5: Ubah Alur Menjadi Kolom Vertikal (Direction Column)
  if (challengeId === "flexbox-5-direction-column") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasColumn = /flex-direction\s*:\s*column/.test(normalized);
    const hasCenter = /align-items\s*:\s*center/.test(normalized) || /justify-content\s*:\s*center/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Pastikan display: flex; aktif.");
    if (!hasColumn) feedback.push("⚠️ Ubah orientasi menjadi kolom dengan flex-direction: column;");
    if (!hasCenter) feedback.push("⚠️ Posisikan kolom di tengah dengan align-items: center;");

    const passed = hasFlex && hasColumn && hasCenter;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed
        ? ["🎉 Mantap! Susunan elemen kini berbaris lurus vertikal di tengah arena!"]
        : feedback,
    };
  }

  // LEVEL 6: Balikkan Urutan Kolom Terbalik (Column Reverse)
  if (challengeId === "flexbox-6-column-reverse") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasColumnReverse = /flex-direction\s*:\s*column-reverse/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Pastikan display: flex; aktif.");
    if (!hasColumnReverse) feedback.push("⚠️ Balikkan arah alur menggunakan flex-direction: column-reverse;");

    const passed = hasFlex && hasColumnReverse;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed
        ? ["🎉 Berhasil! Permen nomor 3 sekarang berada di puncak paling atas!"]
        : feedback,
    };
  }

  // LEVEL 7: Atasi Elemen Meluap dengan Multi-Baris (Flex Wrap)
  if (challengeId === "flexbox-7-flex-wrap") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasWrap = /flex-wrap\s*:\s*wrap/.test(normalized);
    const hasGap = /gap\s*:\s*(16px|1rem|12px|20px|1.5rem)/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Pastikan display: flex; aktif.");
    if (!hasWrap) feedback.push("⚠️ Izinkan pembungkusan baris dengan flex-wrap: wrap;");
    if (!hasGap) feedback.push("⚠️ Berikan jarak antar permen dengan gap: 16px;");

    const passed = hasFlex && hasWrap && hasGap;
    return {
      passed,
      score: passed ? 100 : 50,
      feedback: passed
        ? ["🎉 Rapi sekali! Elemen kini membungkus ke baris berikutnya tanpa meluap keluar arena!"]
        : feedback,
    };
  }

  // LEVEL 8: Turunkan Permen Bintang Sendirian (Align Self)
  if (challengeId === "flexbox-8-align-self") {
    const hasAlignSelf = /align-self\s*:\s*(flex-end|end)/.test(normalized);

    if (!hasAlignSelf) {
      feedback.push("⚠️ Gunakan align-self: flex-end; pada .permen-2 untuk menurunkannya sendirian.");
    }

    const passed = hasAlignSelf;
    return {
      passed,
      score: passed ? 100 : 40,
      feedback: passed
        ? ["🎉 Trik master! Permen bintang berhasil turun secara independen tanpa menggeser temannya!"]
        : feedback,
    };
  }

  // LEVEL 9: Tukar Urutan Permen Juara (Order)
  if (challengeId === "flexbox-9-order") {
    const hasOrder = /order\s*:\s*(-1|0|-2)/.test(normalized);

    if (!hasOrder) {
      feedback.push("⚠️ Berikan nilai order negatif seperti order: -1; pada .permen-3 agar maju ke depan.");
    }

    const passed = hasOrder;
    return {
      passed,
      score: passed ? 100 : 40,
      feedback: passed
        ? ["🎉 Juara! Permen nomor 3 berhasil memotong antrean ke posisi terdepan tanpa mengubah HTML!"]
        : feedback,
    };
  }

  // LEVEL 10: BOSS FIGHT — Responsive Bento Dashboard Layout
  if (challengeId === "flexbox-10-boss-fight") {
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const hasWrap = /flex-wrap\s*:\s*wrap/.test(normalized);
    const hasDistribute = /justify-content\s*:\s*(space-between|center|space-around)/.test(normalized);
    const hasGap = /gap\s*:\s*(16px|1rem|12px|20px|1.5rem)/.test(normalized);

    if (!hasFlex) feedback.push("⚠️ Aktifkan display: flex;");
    if (!hasWrap) feedback.push("⚠️ Atur multi-baris dengan flex-wrap: wrap;");
    if (!hasDistribute) feedback.push("⚠️ Atur sebaran kartu bento dengan justify-content: space-between;");
    if (!hasGap) feedback.push("⚠️ Berikan jarak antar kartu bento dengan gap: 16px;");

    const passed = hasFlex && hasWrap && hasDistribute && hasGap;
    return {
      passed,
      score: passed ? 100 : 60,
      feedback: passed
        ? ["👑 CONGRATULATIONS! Kamu berhasil menaklukkan BOSS FIGHT dan menamatkan CSS Flexbox Mastery! 🎉🏆"]
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
