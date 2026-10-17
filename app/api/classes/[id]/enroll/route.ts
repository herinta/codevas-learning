import { NextRequest, NextResponse } from "next/server";
import { ClassService } from "@/lib/services/class.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * POST /api/classes/[id]/enroll
 * Enrolls the currently authenticated user into the class and unlocks Level 1
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu untuk mendaftar kelas ini." },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Sesi login telah berakhir. Silakan login ulang." },
        { status: 401 }
      );
    }

    await ClassService.enrollUser(payload.userId, id);

    return NextResponse.json({
      success: true,
      message: "Berhasil mendaftar ke kelas! Level 1 siap dipelajari.",
    });
  } catch (error) {
    console.error(`[API POST /api/classes/[id]/enroll Error]:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mendaftar ke kelas",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
