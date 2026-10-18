import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { DailyTargetService } from "@/lib/services/daily-target.service";

/**
 * GET /api/user/daily-target
 * Returns current user's today learning target progress & 7-day history
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return NextResponse.json({
        success: true,
        data: {
          activeSeconds: 0,
          targetSeconds: 600,
          remainingSeconds: 600,
          isCompleted: false,
          xpClaimed: false,
          percent: 0,
          formattedActive: "00:00",
          formattedTarget: "10:00",
          bonusXpReward: 30,
          weeklyHistory: [],
        },
      });
    }

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid." },
        { status: 401 }
      );
    }

    const todayStatus = await DailyTargetService.getTodayActivity(payload.userId);
    const weeklyHistory = await DailyTargetService.getWeeklyHistory(payload.userId);

    return NextResponse.json({
      success: true,
      data: {
        ...todayStatus,
        weeklyHistory,
      },
    });
  } catch (error) {
    console.error("GET /api/user/daily-target error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/daily-target
 * Records active learning time (heartbeat sync from client)
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const seconds = typeof body.seconds === "number" ? body.seconds : 30;

    const result = await DailyTargetService.recordActiveSeconds(
      payload.userId,
      seconds
    );

    return NextResponse.json({
      success: true,
      data: result.status,
      justCompleted: result.justCompleted,
      xpAwarded: result.xpAwarded,
    });
  } catch (error) {
    console.error("POST /api/user/daily-target error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan waktu aktivitas." },
      { status: 500 }
    );
  }
}
