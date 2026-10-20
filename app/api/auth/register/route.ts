import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { calculateGamificationStats } from "@/lib/gamification";
import { validateHumanName } from "@/lib/security/content-filter";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: Maksimal 5 pendaftaran per IP per 15 menit untuk mencegah bot spamming
    const ip = getClientIp(req);
    const rate = checkRateLimit(`register:ip:${ip}`, 5, 15 * 60 * 1000);
    if (rate.isLimited) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan pendaftaran dari perangkat ini. Harap tunggu ${rate.retryAfterSeconds} detik.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fullname, username, email, password, age_group } = body;

    // 1. Validasi input dasar
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().replace(/^@+/, "");
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username minimal terdiri dari 3 karakter." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username hanya boleh menggunakan huruf, angka, dan underscore (_)." },
        { status: 400 }
      );
    }

    // Filter anti-judol & anti-spam pada username
    const validUsername = validateHumanName(cleanUsername, 24);
    if (!validUsername.isValid) {
      return NextResponse.json(
        { error: validUsername.reason || "Username tidak diizinkan." },
        { status: 400 }
      );
    }

    // Filter anti-judol & anti-spam pada full name jika ada
    let sanitizedFullName = cleanUsername;
    if (fullname && typeof fullname === "string") {
      const validFullname = validateHumanName(fullname, 40);
      if (!validFullname.isValid) {
        return NextResponse.json(
          { error: validFullname.reason || "Nama lengkap tidak diizinkan." },
          { status: 400 }
        );
      }
      sanitizedFullName = validFullname.sanitized || cleanUsername;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    // 2. Cek apakah username sudah dipakai
    const existingUsername = await UserService.findByUsername(cleanUsername);
    if (existingUsername) {
      return NextResponse.json(
        { error: `Username @${cleanUsername} sudah digunakan. Silakan pilih username lain.` },
        { status: 409 }
      );
    }

    // 3. Cek apakah email sudah terdaftar
    const existingEmail = await UserService.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 409 }
      );
    }

    // 4. Buat user baru di PostgreSQL
    const user = await UserService.createUser({
      username: cleanUsername,
      email,
      password,
      full_name: sanitizedFullName,
      age_group: age_group ? String(age_group).trim() : undefined,
    });

    // 5. Generate secure session token
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
        message: "Akun berhasil dibuat! Selamat datang di Codevas.",
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
          age_group: user.age_group,
        },
      },
      { status: 201 }
    );

    // 6. Set HTTP-only secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[API Register Error]:", err);
    return NextResponse.json(
      { error: `Pendaftaran gagal: ${msg}` },
      { status: 500 }
    );
  }
}
