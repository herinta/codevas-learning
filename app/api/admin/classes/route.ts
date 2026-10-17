import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { ClassService } from "@/lib/services/class.service";

/**
 * GET /api/admin/classes
 * Retrieve classes with challenge count and enrollments, filterable by category
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const classes = await ClassService.getAdminClasses(category);

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[GET /api/admin/classes Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar kelas",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/classes
 * Admin creates a new class (e.g. category 'LIVE_CODE')
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
      category = "LIVE_CODE",
      title,
      tagline,
      description,
      difficulty_level = "Pemula",
      xp_reward = 150,
      estimated_time = "2 Jam",
      is_published = true,
      order_index = 1,
    } = body;

    if (!id || !title) {
      return NextResponse.json(
        { success: false, message: "ID Kelas dan Judul Kelas wajib diisi." },
        { status: 400 }
      );
    }

    // Check if ID exists
    const existing = await ClassService.getClassById(id);
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Kelas dengan ID '${id}' sudah ada.` },
        { status: 409 }
      );
    }

    const newClass = await ClassService.createClass({
      id,
      category,
      title,
      tagline,
      description,
      difficulty_level,
      xp_reward: Number(xp_reward),
      estimated_time,
      is_published: Boolean(is_published),
      order_index: Number(order_index),
    });

    return NextResponse.json({
      success: true,
      message: `Kelas '${newClass.title}' berhasil dibuat!`,
      data: newClass,
    });
  } catch (error) {
    console.error("[POST /api/admin/classes Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat kelas baru",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
