import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullname, username, email, password } = body;

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
    });

    // 5. Generate secure session token
    const token = createSessionToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

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
          streak_days: user.streak_days,
          role: user.role,
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
    console.error("[API Register Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat mendaftar. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
