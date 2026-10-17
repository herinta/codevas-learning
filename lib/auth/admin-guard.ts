import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME, SessionPayload } from "@/lib/auth/session";
import { UserService } from "@/lib/services/user.service";
import { UserEntity } from "@/lib/db/entities";

export interface AdminAuthResult {
  isAdmin: boolean;
  user?: UserEntity;
  session?: SessionPayload;
  errorResponse?: NextResponse;
}

/**
 * Validates whether the incoming request is from an authenticated user with ADMIN role.
 */
export async function verifyAdminRequest(req: NextRequest): Promise<AdminAuthResult> {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) {
    return {
      isAdmin: false,
      errorResponse: NextResponse.json(
        { success: false, message: "Akses ditolak: Anda harus login terlebih dahulu." },
        { status: 401 }
      ),
    };
  }

  const payload = verifySessionToken(cookie.value);
  if (!payload) {
    return {
      isAdmin: false,
      errorResponse: NextResponse.json(
        { success: false, message: "Sesi tidak valid atau telah kedaluwarsa." },
        { status: 401 }
      ),
    };
  }

  // Double check role from database to ensure fresh permission
  const user = await UserService.findById(payload.userId);
  if (!user) {
    return {
      isAdmin: false,
      errorResponse: NextResponse.json(
        { success: false, message: "User tidak ditemukan di sistem." },
        { status: 404 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      isAdmin: false,
      errorResponse: NextResponse.json(
        { success: false, message: "Akses ditolak: Hanya Administrator yang berhak mengakses endpoint ini." },
        { status: 403 }
      ),
    };
  }

  return {
    isAdmin: true,
    user,
    session: payload,
  };
}
