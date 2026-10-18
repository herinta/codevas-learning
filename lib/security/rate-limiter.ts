/**
 * In-Memory Token Bucket / Window Rate Limiter
 * Guards sensitive auth endpoints against brute force, credential stuffing, and DDoS attacks.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup expired keys periodically every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (timer && typeof timer === "object" && "unref" in timer) {
    (timer as any).unref();
  }
}

export interface RateLimitResult {
  isLimited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Checks and increments the attempt counter for a given key
 * @param key unique identifier (e.g. `login:ip:identifier`)
 * @param maxAttempts maximum allowed attempts before limiting (default: 5)
 * @param windowMs time window in milliseconds (default: 60_000 / 1 minute)
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || record.resetAt <= now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      isLimited: false,
      remaining: maxAttempts - 1,
      retryAfterSeconds: 0,
    };
  }

  record.count += 1;

  if (record.count > maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      isLimited: true,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    isLimited: false,
    remaining: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Resets the attempt counter upon successful authentication
 */
export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
}

/**
 * Extracts client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
