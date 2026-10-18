import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import fs from "fs/promises";
import path from "path";

// Supported image formats
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json(
        { success: false, message: "Belum terautentikasi. Silakan login." },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Format tidak didukung. Harap upload gambar (JPG, PNG, WebP, GIF)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran gambar terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    // Determine extension
    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
    const fileName = `avatar-${payload.userId}-${Date.now()}.${ext}`;

    // Target upload directory: public/uploads/avatars
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/avatars/${fileName}`;

    // Persist new avatar URL to user in PostgreSQL database
    await UserService.updateProfile(payload.userId, {
      avatar_url: publicUrl,
    });

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
      message: "Foto profil berhasil diunggah!",
    });
  } catch (error) {
    console.error("[API POST /api/user/upload-avatar Error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat mengunggah foto profil." },
      { status: 500 }
    );
  }
}
