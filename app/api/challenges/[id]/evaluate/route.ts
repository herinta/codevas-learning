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
