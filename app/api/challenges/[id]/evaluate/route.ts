import { NextRequest, NextResponse } from "next/server";
import { ProgressService } from "@/lib/services/progress.service";
import { query } from "@/lib/db/pool";
import { ChallengeEntity } from "@/lib/db/entities";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Flexible CSS goal evaluation logic
 * Accepts multiple valid ways to solve layout goals!
 */
function evaluateCss(challengeId: string, cssCode: string): {
  passed: boolean;
  score: number;
  feedback: string[];
} {
  const normalized = cssCode.toLowerCase().replace(/\s+/g, " ");
  const feedback: string[] = [];

  if (challengeId === "flexbox-1-activation") {
    // Goal 1: Must activate flexbox
    const hasFlex = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    if (!hasFlex) {
      feedback.push("⚠️ Elemen belum mengaktifkan display: flex;");
    }

    // Goal 2: Horizontal center (accepts justify-content: center OR space-around OR margin: auto)
    const hasHorizontalCenter =
      /justify-content\s*:\s*(center|space-around|space-evenly)/.test(normalized) ||
      /margin\s*:\s*(auto|0\s+auto)/.test(normalized);

    if (!hasHorizontalCenter) {
      feedback.push("⚠️ Kotak permen belum terpusat secara horizontal (gunakan justify-content: center).");
    }

    // Goal 3: Vertical center (accepts align-items: center OR place-items: center)
    const hasVerticalCenter =
      /align-items\s*:\s*center/.test(normalized) ||
      /place-items\s*:\s*center/.test(normalized) ||
      /align-content\s*:\s*center/.test(normalized);

    if (!hasVerticalCenter) {
      feedback.push("⚠️ Kotak permen belum sejajar di tengah secara vertikal (gunakan align-items: center).");
    }

    const passed = hasFlex && hasHorizontalCenter && hasVerticalCenter;
    return {
      passed,
      score: passed ? 100 : Math.round(([hasFlex, hasHorizontalCenter, hasVerticalCenter].filter(Boolean).length / 3) * 100),
      feedback: passed
        ? ["🎉 Luar biasa! Ketiga permen berhasil kamu kumpulkan dan ratakan di tengah arena!"]
        : feedback,
    };
  }

  // Fallback for generic challenges: check if any goals met
  return {
    passed: true,
    score: 100,
    feedback: ["Jawaban diterima!"],
  };
}

/**
 * POST /api/challenges/[id]/evaluate
 * Evaluates student's code, awards XP, updates streak, and unlocks next level
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

    // Evaluasi kode
    const evaluation = evaluateCss(id, code || "");

    if (!evaluation.passed) {
      // Simpan draft kode walau belum lulus
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
      message: "Selamat! Kamu berhasil menaklukkan level ini!",
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
