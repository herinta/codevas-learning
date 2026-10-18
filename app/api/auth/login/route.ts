import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { calculateGamificationStats } from "@/lib/gamification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Cari user berdasarkan email atau username
    const user = await UserService.findByIdentifier(identifier);
    if (!user) {
      return NextResponse.json(
        { error: "Email atau username tidak ditemukan." },
        { status: 401 }
      );
    }

    // 2. Verifikasi kata sandi
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Kata sandi yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // 3. Buat session token
    const token = createSessionToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const stats = calculateGamificationStats(user.xp_points);

    const response = NextResponse.json(
      {
        success: true,
        message: `Selamat datang kembali, @${user.username}!`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          xp_points: user.xp_points,
          level: stats.level,
          rank_title: stats.rank_title,
          rank_badge: stats.rank_badge,
          current_level_xp: stats.current_level_xp,
          next_level_xp: stats.next_level_xp,
          level_progress_percent: stats.level_progress_percent,
          xp_remaining: stats.xp_remaining,
          streak_days: user.streak_days,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // 4. Set cookie session
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("[API Login Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat masuk. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
