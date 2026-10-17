import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { ClassService } from "@/lib/services/class.service";
import { ChallengeService } from "@/lib/services/challenge.service";

/**
 * GET /api/admin/classes/[id]
 * Get single class with all challenges
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const { id } = await params;
    const courseClass = await ClassService.getClassById(id);
    if (!courseClass) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan." },
        { status: 404 }
      );
    }

    const challenges = await ChallengeService.getChallengesByClass(id);

    return NextResponse.json({
      success: true,
      data: {
        ...courseClass,
        challenges,
      },
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[GET /api/admin/classes/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat rincian kelas",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/classes/[id]
 * Update class details
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await ClassService.updateClass(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan untuk diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Kelas '${updated.title}' berhasil diperbarui!`,
      data: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/classes/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui kelas",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/classes/[id]
 * Delete class (cascades to challenges)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const { id } = await params;
    const deleted = await ClassService.deleteClass(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan atau sudah dihapus." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas dan seluruh tantangannya berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/classes/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus kelas",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
