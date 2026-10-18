import { NextRequest, NextResponse } from "next/server";
import { ClassService } from "@/lib/services/class.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { CLASSES_LIST } from "@/lib/classes-data";

/**
 * GET /api/classes
 * Returns all classes dynamically from PostgreSQL with enrollment & progress info.
 * Never crashes with 500: safely falls back to static curriculum if database is unreachable.
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    let userId: string | undefined = undefined;

    if (cookie?.value) {
      const payload = verifySessionToken(cookie.value);
      if (payload) {
        userId = payload.userId;
      }
    }

    const classes = await ClassService.getAllClasses(userId);

    const response = NextResponse.json({
      success: true,
      data: classes,
    });
    // Cache for 30s in browser, revalidate in background up to 5 minutes
    response.headers.set(
      "Cache-Control",
      userId
        ? "private, max-age=30, stale-while-revalidate=300"
        : "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
    );
    return response;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[API GET /api/classes Error, falling back to static]:", error);

    const fallbackClasses = CLASSES_LIST.map((c, idx) => ({
      id: c.id,
      category: c.category,
      title: c.title,
      tagline: c.tagline ?? null,
      description: c.about ?? null,
      difficulty_level: c.level,
      xp_reward: c.xpReward,
      estimated_time: c.estimatedHours,
      is_published: c.status === "available",
      order_index: idx + 1,
      totalLevels: c.modulesCount || (c.modules ? c.modules.length : 0),
      completedLevels: 0,
      progressPercent: 0,
      isEnrolled: false,
    }));

    return NextResponse.json({
      success: true,
      data: fallbackClasses,
      fallback: true,
    });
  }
}
