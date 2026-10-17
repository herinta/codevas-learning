import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

/**
 * GET /api/user/profile
 * Returns full profile info of the logged in user
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json({ success: false, message: "Belum terautentikasi" }, { status: 401 });
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Sesi tidak valid" }, { status: 401 });
    }

    const user = await UserService.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        xp_points: user.xp_points,
        streak_days: user.streak_days,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("[API GET /api/user/profile Error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data profil" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * Updates full_name and avatar_url
 */
export async function PUT(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json({ success: false, message: "Belum login" }, { status: 401 });
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, avatar_url } = body;

    const updatedUser = await UserService.updateProfile(payload.userId, {
      full_name,
      avatar_url,
    });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Gagal memperbarui profil" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui!",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        avatar_url: updatedUser.avatar_url,
        xp_points: updatedUser.xp_points,
        streak_days: updatedUser.streak_days,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("[API PUT /api/user/profile Error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan perubahan profil" },
      { status: 500 }
    );
  }
}
