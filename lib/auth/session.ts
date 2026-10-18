import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = "codevas_session";

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  exp: number; // UNIX epoch in seconds
}

function getSecretKey(): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL SECURITY ERROR: AUTH_SECRET must be set in production environment!");
    }
    console.warn("[SECURITY WARNING]: AUTH_SECRET is not set in .env. Using development fallback.");
    return "dev-local-secret-replace-with-auth-secret-in-production-env";
  }
  return secret;
}

/**
 * Creates a signed JWT-style token: `<header_b64>.<payload_b64>.<signature_b64>`
 */
export function createSessionToken(
  user: { id: string; username: string; email: string; role: string },
  expiresInSeconds = 60 * 60 * 24 * 7 // 7 days
): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = createHmac("sha256", getSecretKey())
    .update(dataToSign)
    .digest("base64url");

  return `${dataToSign}.${signature}`;
}

/**
 * Verifies the signed session token and returns the payload if valid & unexpired
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToSign = `${headerB64}.${payloadB64}`;

    const expectedSignature = createHmac("sha256", getSecretKey())
      .update(dataToSign)
      .digest("base64url");

    const sigA = Buffer.from(signatureB64);
    const sigB = Buffer.from(expectedSignature);

    if (sigA.length !== sigB.length || !timingSafeEqual(sigA, sigB)) {
      return null;
    }

    const payloadText = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(payloadText);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
