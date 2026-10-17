import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { UserService } from "@/lib/services/user.service";
import { AnalyticsService } from "@/lib/services/analytics.service";

/**
 * GET /api/admin/stats
 * Real-time monitoring stats: users online, active today, total users, classes, completions, and landing visitors
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const [stats, visitorStats] = await Promise.all([
      UserService.getAdminUserStats(),
      AnalyticsService.getVisitorStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        ...visitorStats,
      },
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
