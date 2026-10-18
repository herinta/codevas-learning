import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "codevas_session";
const SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "codevas-super-secure-production-secret-key-2026";

function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(pad);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

interface EdgeSessionPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  exp: number;
}

async function verifyEdgeToken(token: string): Promise<EdgeSessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToSign = `${headerB64}.${payloadB64}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64UrlToUint8Array(signatureB64);
    const dataBytes = encoder.encode(dataToSign);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as ArrayBuffer,
      dataBytes as unknown as ArrayBuffer
    );

    if (!isValid) return null;

    const payloadJson: EdgeSessionPayload = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(payloadB64))
    );

    const now = Math.floor(Date.now() / 1000);
    if (payloadJson.exp && payloadJson.exp < now) {
      return null;
    }

    return payloadJson;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiAdmin = pathname.startsWith("/api/admin");
  const isPageAdmin = pathname.startsWith("/admin");

  if (!isApiAdmin && !isPageAdmin) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) {
    if (isApiAdmin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Autentikasi diperlukan." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyEdgeToken(cookie.value);
  if (!payload) {
    if (isApiAdmin) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid atau telah kedaluwarsa." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (payload.role !== "ADMIN") {
    if (isApiAdmin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Hanya Administrator yang diizinkan." },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
