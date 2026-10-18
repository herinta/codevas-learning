import { NextRequest, NextResponse } from "next/server";
import { ClassService } from "@/lib/services/class.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * GET /api/classes
 * Returns all classes dynamically from PostgreSQL with enrollment & progress info
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
    console.error("[API GET /api/classes Error]:", error);
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
