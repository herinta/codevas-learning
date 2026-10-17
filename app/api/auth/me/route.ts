import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Ambil data user terkini dari database (termasuk xp_points terbaru)
    const user = await UserService.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Perbarui waktu aktif terakhir user
    UserService.touchLastSeen(user.id);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          xp_points: user.xp_points,
          streak_days: user.streak_days,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    console.error("[API Auth/Me Error]:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
