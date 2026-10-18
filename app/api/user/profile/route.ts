import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { calculateGamificationStats } from "@/lib/gamification";
import { validateHumanName, validateAvatarUrl } from "@/lib/security/content-filter";

/**
 * GET /api/user/profile
 * Returns full profile info of the logged in user along with gamification stats & XP history
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

    const stats = calculateGamificationStats(user.xp_points);
    const xpHistory = await UserService.getXpHistory(user.id, 10);

    return NextResponse.json({
      success: true,
      data: {
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
        created_at: user.created_at,
        gamification: stats,
        xp_history: xpHistory,
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

    let sanitizedFullName: string | undefined = undefined;
    if (full_name !== undefined) {
      const validName = validateHumanName(String(full_name), 40);
      if (!validName.isValid) {
        return NextResponse.json(
          { success: false, message: validName.reason || "Nama lengkap tidak diizinkan." },
          { status: 400 }
        );
      }
      sanitizedFullName = validName.sanitized;
    }

    let sanitizedAvatarUrl: string | undefined = undefined;
    if (avatar_url !== undefined && avatar_url !== "") {
      if (!validateAvatarUrl(String(avatar_url))) {
        return NextResponse.json(
          { success: false, message: "Format atau sumber URL avatar tidak diizinkan." },
          { status: 400 }
        );
      }
      sanitizedAvatarUrl = String(avatar_url).trim();
    }

    const updatedUser = await UserService.updateProfile(payload.userId, {
      full_name: sanitizedFullName,
      avatar_url: sanitizedAvatarUrl,
    });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Gagal memperbarui profil" }, { status: 400 });
    }

    const stats = calculateGamificationStats(updatedUser.xp_points);

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
        level: stats.level,
        rank_title: stats.rank_title,
        rank_badge: stats.rank_badge,
        current_level_xp: stats.current_level_xp,
        next_level_xp: stats.next_level_xp,
        level_progress_percent: stats.level_progress_percent,
        xp_remaining: stats.xp_remaining,
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
