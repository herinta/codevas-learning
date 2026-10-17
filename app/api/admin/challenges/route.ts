import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { ChallengeService } from "@/lib/services/challenge.service";
import { ClassService } from "@/lib/services/class.service";

/**
 * POST /api/admin/challenges
 * Create a new challenge/level under a class
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const body = await req.json();
    const {
      id,
      class_id,
      title,
      difficulty = "EASY",
      order_index,
      xp_reward = 20,
      instruction,
      theory,
      syntax_helpers,
      hint,
      locked_template,
      target_visual,
      initial_state,
      validation_rules,
    } = body;

    if (!id || !class_id || !title || !instruction) {
      return NextResponse.json(
        { success: false, message: "ID, Class ID, Judul, dan Instruksi Soal wajib diisi." },
        { status: 400 }
      );
    }

    // Verify parent class exists
    const parentClass = await ClassService.getClassById(class_id);
    if (!parentClass) {
      return NextResponse.json(
        { success: false, message: `Kelas dengan ID '${class_id}' tidak ditemukan.` },
        { status: 404 }
      );
    }

    const newChallenge = await ChallengeService.createChallenge({
      id,
      class_id,
      title,
      difficulty,
      order_index: Number(order_index) || 1,
      xp_reward: Number(xp_reward) || 20,
      instruction,
      theory,
      syntax_helpers: Array.isArray(syntax_helpers) ? syntax_helpers : [],
      hint,
      locked_template,
      target_visual,
      initial_state,
      validation_rules,
    });

    return NextResponse.json({
      success: true,
      message: `Level '${newChallenge.title}' berhasil ditambahkan ke kelas!`,
      data: newChallenge,
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[POST /api/admin/challenges Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat level tantangan baru",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
