import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { UserService } from "@/lib/services/user.service";

/**
 * PATCH /api/admin/users/[id]
 * Admin updates user fields or role
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

    const targetUser = await UserService.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await UserService.updateUserAdmin(id, body);

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      data: updated,
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[PATCH /api/admin/users/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui pengguna",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Admin deletes a user (safeguarded against deleting oneself)
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

    if (id === auth.user?.id) {
      return NextResponse.json(
        { success: false, message: "Anda tidak dapat menghapus akun admin yang sedang login!" },
        { status: 400 }
      );
    }

    const deleted = await UserService.deleteUser(id, auth.user!.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan atau sudah dihapus." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/users/[id] Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal menghapus pengguna",
      },
      { status: 500 }
    );
  }
}
