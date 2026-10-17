import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { UserService } from "@/lib/services/user.service";

/**
 * GET /api/admin/stats
 * Real-time monitoring stats: users online, active today, total users, classes, completions
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const stats = await UserService.getAdminUserStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[GET /api/admin/stats Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil statistik dashboard admin",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
