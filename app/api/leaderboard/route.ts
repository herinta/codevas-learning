import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { calculateGamificationStats } from "@/lib/gamification";

export const dynamic = "force-dynamic";

/**
 * GET /api/leaderboard
 * Returns top learners ranking based on XP points, and current user's rank
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const limit = Math.min(50, Math.max(1, isNaN(limitParam) ? 10 : limitParam));

    // Optional user session
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    let currentUserId: string | null = null;
    let currentUserRank: number | null = null;
    let currentUserData = null;

    if (cookie?.value) {
      const payload = verifySessionToken(cookie.value);
      if (payload?.userId) {
        currentUserId = payload.userId;
        const [rank, userEntity] = await Promise.all([
          UserService.getUserRank(currentUserId),
          UserService.findById(currentUserId),
        ]);
        currentUserRank = rank;

        if (userEntity) {
          const stats = calculateGamificationStats(userEntity.xp_points);
          currentUserData = {
            rank: currentUserRank,
            id: userEntity.id,
            username: userEntity.username,
            full_name: userEntity.full_name || userEntity.username,
            avatar_url: userEntity.avatar_url,
            xp_points: userEntity.xp_points,
            level: stats.level,
            rank_title: stats.rank_title,
            rank_badge: stats.rank_badge,
            streak_days: userEntity.streak_days,
            isCurrentUser: true,
          };
        }
      }
    }

    const leaderboard = await UserService.getLeaderboard(limit);

    const data = leaderboard.map((item) => ({
      ...item,
      isCurrentUser: currentUserId ? item.id === currentUserId : false,
    }));

    return NextResponse.json(
      {
        success: true,
        data,
        currentUserRank,
        currentUser: currentUserData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API GET /api/leaderboard Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data papan peringkat leaderboard",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
