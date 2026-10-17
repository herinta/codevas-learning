import { NextRequest, NextResponse } from "next/server";
import { ClassService } from "@/lib/services/class.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * GET /api/classes/[id]
 * Returns dynamic class details and all its challenges/levels from PostgreSQL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    let userId: string | undefined = undefined;

    if (cookie?.value) {
      const payload = verifySessionToken(cookie.value);
      if (payload) {
        userId = payload.userId;
      }
    }

    const courseClass = await ClassService.getClassById(id, userId);

    if (!courseClass) {
      return NextResponse.json(
        { success: false, message: `Kelas dengan ID '${id}' tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: courseClass,
    });
  } catch (error) {
    console.error(`[API GET /api/classes/[id] Error]:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil rincian kelas",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
