import { NextRequest, NextResponse } from "next/server";
import { ClassService } from "@/lib/services/class.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * GET /api/user/my-classes
 * Returns ONLY classes that the currently authenticated user is enrolled in
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const myClasses = await ClassService.getUserEnrolledClasses(payload.userId);

    return NextResponse.json({
      success: true,
      data: myClasses,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[API GET /api/user/my-classes Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar kelas saya",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
