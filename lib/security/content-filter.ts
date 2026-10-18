/**
 * Anti-Spam & Anti-Judol (Online Gambling) Content Filter
 * Protects Codevas against SEO poisoning, defacement, and malicious UGC (User-Generated Content).
 */

const BLOCKED_KEYWORDS = [
  // Gambling / Judi Online keywords commonly used in SEO poisoning attacks
  "slot",
  "gacor",
  "judol",
  "judi",
  "maxwin",
  "zeus",
  "pragmatic",
  "togel",
  "sbobet",
  "poker",
  "casino",
  "jackpot",
  "deposit pulsa",
  "rtp live",
  "bandar",
  "taruhan",
  "olympus",
  "mahjong",
  "depo",
  "withdraw",
  "bocoran slot",
  "situs judi",
  "agen judi",
  "daftar slot",
  "link slot",
  "scatter",
  "sensational",
];

// Regex for detecting URLs, domains, and messaging links
const URL_PATTERN = /(https?:\/\/|www\.|\.com\b|\.id\b|\.net\b|\.org\b|\.xyz\b|\.top\b|\.vip\b|bit\.ly|t\.me|wa\.me)/i;

// HTML tag detector
const HTML_TAG_PATTERN = /<[^>]*>/g;

export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  reason?: string;
}

/**
 * Validates and sanitizes human display names (full_name, username)
 */
export function validateHumanName(input: string, maxLength = 40): ValidationResult {
  if (!input) {
    return { isValid: true, sanitized: "" };
  }

  // 1. Strip HTML tags
  let cleaned = input.replace(HTML_TAG_PATTERN, "").trim();

  // 2. Remove control characters & newlines
  cleaned = cleaned.replace(/[\r\n\t]+/g, " ");

  // 3. Length check
  if (cleaned.length > maxLength) {
    return {
      isValid: false,
      sanitized: cleaned.slice(0, maxLength),
      reason: `Maksimal panjang nama adalah ${maxLength} karakter.`,
    };
  }

  // 4. URL / Domain Injection check
  if (URL_PATTERN.test(cleaned)) {
    return {
      isValid: false,
      sanitized: cleaned,
      reason: "Nama tidak boleh mengandung tautan (URL/domain).",
    };
  }

  // 5. Judol / Spam keywords check
  const lower = cleaned.toLowerCase();
  for (const keyword of BLOCKED_KEYWORDS) {
    // Match whole words or boundary patterns
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(lower)) {
      return {
        isValid: false,
        sanitized: cleaned,
        reason: "Nama mengandung kata-kata yang tidak diizinkan di sistem.",
      };
    }
  }

  return { isValid: true, sanitized: cleaned };
}

/**
 * Validates avatar image URLs to prevent external malicious redirects or script-based URIs
 */
export function validateAvatarUrl(url: string): boolean {
  if (!url) return true;
  const clean = url.trim().toLowerCase();

  // Reject dangerous protocols
  if (clean.startsWith("javascript:") || clean.startsWith("data:") || clean.startsWith("vbscript:")) {
    return false;
  }

  // Must be either relative path (e.g. /avatars/..) or secure HTTPS
  if (clean.startsWith("/")) return true;
  if (!clean.startsWith("https://")) return false;

  // Check against known safe avatar providers or general image extensions
  const isAllowedHost =
    clean.includes("api.dicebear.com") ||
    clean.includes("githubusercontent.com") ||
    clean.includes("googleusercontent.com") ||
    clean.includes("unsplash.com") ||
    clean.includes("cloudinary.com");

  const hasImageExtension = /\.(png|jpg|jpeg|webp|svg|gif)(\?.*)?$/i.test(clean);

  return isAllowedHost || hasImageExtension;
}
