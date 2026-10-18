import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "codevas_session";
const SECRET = (() => {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.warn("[SECURITY WARNING]: AUTH_SECRET is not set in environment. Using fallback secret.");
    return "553944c209bc9108472aae9f980de0918e867fd58a5ceb52e7232a155900b507";
  }
  return secret;
})();

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
  const isProtectedUserPage =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/");

  if (!isApiAdmin && !isPageAdmin && !isProtectedUserPage) {
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
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    return redirectResponse;
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
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete(AUTH_COOKIE_NAME);
    redirectResponse.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    return redirectResponse;
  }

  // Admin role check only for admin paths
  if (isApiAdmin || isPageAdmin) {
    if (payload.role !== "ADMIN") {
      if (isApiAdmin) {
        return NextResponse.json(
          { success: false, message: "Akses ditolak: Hanya Administrator yang diizinkan." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  const response = NextResponse.next();
  // Prevent bfcache for sensitive authenticated pages so Back button never shows stale logged-in UI
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
