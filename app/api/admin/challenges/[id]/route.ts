import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { ChallengeService } from "@/lib/services/challenge.service";

/**
 * PATCH /api/admin/challenges/[id]
 * Update challenge details
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

    const updated = await ChallengeService.updateChallenge(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Level tantangan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Level '${updated.title}' berhasil diperbarui!`,
      data: updated,
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[PATCH /api/admin/challenges/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui level tantangan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/challenges/[id]
 * Delete challenge
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
    const deleted = await ChallengeService.deleteChallenge(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Level tantangan tidak ditemukan atau sudah dihapus." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Level tantangan berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/challenges/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus level tantangan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
