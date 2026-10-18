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

function detectImageFormat(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "gif";
  }

  // WEBP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  // AVIF: ....ftypavif or ....ftypavis
  const ftyp = buffer.subarray(4, 12).toString("ascii");
  if (ftyp.includes("avif") || ftyp.includes("avis")) {
    return "avif";
  }

  return null;
}

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cryptographic Magic Bytes verification: Ensure content is truly an authentic image
    const detectedExt = detectImageFormat(buffer);
    if (!detectedExt) {
      return NextResponse.json(
        { success: false, message: "Berkas tidak valid atau bukan gambar biner yang sah." },
        { status: 400 }
      );
    }

    // Target upload directory: public/uploads/avatars
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    // Clean up any previous avatar files for this user to prevent disk exhaustion (DoS)
    try {
      const existingFiles = await fs.readdir(uploadDir);
      for (const f of existingFiles) {
        if (f.startsWith(`avatar-${payload.userId}-`)) {
          await fs.unlink(path.join(uploadDir, f)).catch(() => {});
        }
      }
    } catch {
      // Non-fatal if folder was just created
    }

    const fileName = `avatar-${payload.userId}-${Date.now()}.${detectedExt}`;
    const filePath = path.join(uploadDir, fileName);

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
