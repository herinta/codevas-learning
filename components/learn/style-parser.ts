import type React from "react";
import { ParsedStyles } from "./types";

// Known valid CSS values for anti-flicker live parsing
export const VALID_PROPERTIES: Record<string, RegExp> = {
  display: /^(flex|inline-flex|grid|inline-grid|block|inline-block|none)$/i,
  justifyContent: /^(center|space-between|space-around|space-evenly|flex-start|flex-end|start|end|left|right)$/i,
  alignItems: /^(center|flex-start|flex-end|stretch|baseline|start|end)$/i,
  flexDirection: /^(row|row-reverse|column|column-reverse)$/i,
  flexWrap: /^(wrap|nowrap|wrap-reverse)$/i,
  gap: /^(\d+(\.\d+)?(px|rem|em|%)?(\s+\d+(\.\d+)?(px|rem|em|%)?)?)$/i,
  alignSelf: /^(auto|flex-start|flex-end|center|baseline|stretch|start|end)$/i,
  order: /^-?\d+$/i,
  flexGrow: /^\d+$/i,
  flexShrink: /^\d+$/i,
  gridTemplateColumns: /^.+$/i,
  gridTemplateRows: /^.+$/i,
  gridColumn: /^.+$/i,
  gridRow: /^.+$/i,
  gridArea: /^.+$/i,
  placeItems: /^.+$/i,
  justifyItems: /^.+$/i,
  backgroundColor: /^.+$/i,
  background: /^.+$/i,
  color: /^.+$/i,
  fontSize: /^.+$/i,
  fontWeight: /^(normal|bold|bolder|lighter|\d{3})$/i,
  fontStyle: /^(normal|italic|oblique)$/i,
  textAlign: /^(left|right|center|justify)$/i,
  lineHeight: /^.+$/i,
  padding: /^.+$/i,
  margin: /^.+$/i,
  border: /^.+$/i,
  borderRadius: /^.+$/i,
  boxShadow: /^.+$/i,
  boxSizing: /^(border-box|content-box)$/i,
  opacity: /^.+$/i,
  cursor: /^(pointer|default|not-allowed|grab|move|text)$/i,
  overflow: /^(hidden|auto|scroll|visible)$/i,
  transform: /^.+$/i,
  transition: /^.+$/i,
  width: /^.+$/i,
  height: /^.+$/i,
  minHeight: /^.+$/i,
  maxHeight: /^.+$/i,
  minWidth: /^.+$/i,
  maxWidth: /^.+$/i,
};

/**
 * Deterministically shuffles options so the correct answer is NEVER placed at index 0,
 * and options do not re-shuffle or jitter between keystrokes.
 */
export function getShuffledHelpers(helpers: string[] | undefined, seedKey: string): string[] {
  if (!helpers || helpers.length <= 1) return helpers || [];
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) & 0xffffffff;
  }
  const result = [...helpers];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Ensure the original first item (answer) is NEVER at index 0 if multiple items exist
  if (result[0] === helpers[0] && result.length > 1) {
    const swapIdx = (Math.abs(seed) % (result.length - 1)) + 1;
    [result[0], result[swapIdx]] = [result[swapIdx], result[0]];
  }
  return result;
}

/**
 * Robust, anti-flicker CSS style parser that maps styles directly to React inline styles for silky smooth 60fps reactivity
 */
export function parseUserStyles(css: string): ParsedStyles {
  const arenaStyle: Record<string, string> = {};
  const itemStyles: Record<string, Record<string, string>> = {};

  try {
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let hasRules = false;
    let match: RegExpExecArray | null;

    const sanitizeDeclaration = (prop: string, val: string): { key: string; value: string } | null => {
      const cleanProp = prop.trim();
      const cleanVal = val.trim();
      if (!cleanProp || !cleanVal) return null;

      const camelProp = cleanProp.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      const validator = VALID_PROPERTIES[camelProp];
      if (validator && !validator.test(cleanVal)) {
        // While user is mid-keystroke, ignore partial invalid value to prevent flickering
        return null;
      }
      return { key: camelProp, value: cleanVal };
    };

    while ((match = ruleRegex.exec(css)) !== null) {
      hasRules = true;
      const selector = match[1].trim();
      const declarations = match[2].trim();
      const declObj: Record<string, string> = {};

      declarations.split(";").forEach((rule) => {
        const [prop, val] = rule.split(":");
        if (prop && val) {
          const sanitized = sanitizeDeclaration(prop, val);
          if (sanitized) {
            declObj[sanitized.key] = sanitized.value;
          }
        }
      });

      if (
        selector.includes(".arena") ||
        selector === "arena" ||
        selector.includes(".grid-arena") ||
        selector === "grid-arena" ||
        selector.includes(".navbar") ||
        selector === "navbar" ||
        selector.includes(".box") ||
        selector === "box" ||
        selector.includes(".badge") ||
        selector === "badge" ||
        selector === "*"
      ) {
        Object.assign(arenaStyle, declObj);
        itemStyles["box"] = { ...(itemStyles["box"] || {}), ...declObj };
      } else if (selector.includes(".header") || selector === "header") {
        itemStyles["header"] = { ...(itemStyles["header"] || {}), ...declObj };
      } else if (selector.includes(".sidebar") || selector === "sidebar") {
        itemStyles["sidebar"] = { ...(itemStyles["sidebar"] || {}), ...declObj };
      } else {
        const itemMatch = selector.match(/\.(permen|card)-?([0-9]+)/);
        if (itemMatch) {
          const key = `item-${itemMatch[2]}`;
          itemStyles[key] = { ...(itemStyles[key] || {}), ...declObj };
          itemStyles[`card-${itemMatch[2]}`] = { ...(itemStyles[`card-${itemMatch[2]}`] || {}), ...declObj };
        }
      }
    }

    // If user writes without .arena { ... }, parse directly into arena
    if (!hasRules && css.trim()) {
      css.split(";").forEach((rule) => {
        const [prop, val] = rule.split(":");
        if (prop && val) {
          const sanitized = sanitizeDeclaration(prop, val);
          if (sanitized) {
            arenaStyle[sanitized.key] = sanitized.value;
          }
        }
      });
    }
  } catch (err) {
    console.error("CSS Parse Error:", err);
  }

  return { arenaStyle, itemStyles };
}

/**
 * Check if a snippet is already present in user's CSS/HTML
 */
export function isHelperActive(snippet: string, code: string): boolean {
  if (!code || !snippet) return false;
  const clean = snippet.trim().replace(/;$/, "");
  // Strip comments so <!-- ... --> and /* ... */ never trigger false positives!
  const effectiveCode = code.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

  // 1. HTML attribute snippet (e.g. class="profile-card")
  const attrMatch = clean.match(/^([a-z0-9_-]+)=["']([^"']+)["']$/i);
  if (attrMatch) {
    const [, attrName, attrVal] = attrMatch;
    const escapedVal = attrVal.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    return new RegExp(`<[a-z0-9_-]+\\b[^>]*\\b${attrName}=["'][^"']*\\b${escapedVal}\\b[^"']*["']`, "i").test(effectiveCode);
  }

  // 2. HTML tag snippets
  if (clean.startsWith("<")) {
    // Exact match (case-insensitive)
    if (effectiveCode.toLowerCase().includes(clean.toLowerCase())) {
      return true;
    }

    // Special container wrappers
    if (clean === "<div> ... </div>") {
      return /<div[^>]*>[\s\S]*<\/div>/i.test(effectiveCode);
    }
    if (clean === "<div>") {
      return /<div(?:\s+[^>]*)?>/i.test(effectiveCode);
    }
    if (clean === "</div>") {
      return /<\/div>/i.test(effectiveCode);
    }

    // Tag with class attribute, e.g. <div class="profile-card">
    const tagWithClassMatch = clean.match(/^<([a-z0-9_-]+)[^>]*\bclass=["']([^"']+)["']/i);
    if (tagWithClassMatch) {
      const [, tag, cls] = tagWithClassMatch;
      const escapedCls = cls.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`<${tag}\\b[^>]*\\bclass=["'][^"']*\\b${escapedCls}\\b[^"']*["']`, "i").test(effectiveCode);
    }

    // If snippet has an inner text prefix, e.g. <p>Nama: Alex Coder</p> or <p>Umur: 16 Tahun</p>
    const prefixMatch = clean.match(/<([a-z0-9_-]+)[^>]*>\s*([a-zA-Z0-9]+:)/i);
    if (prefixMatch) {
      const [, tag, prefix] = prefixMatch;
      return new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?${prefix}`, "i").test(effectiveCode);
    }

    // If snippet has specific inner text, e.g. <h1>Profil Developer</h1> or <button>Follow</button>
    const innerTextMatch = clean.match(/>([^<]+)</);
    if (innerTextMatch) {
      const inner = innerTextMatch[1].trim();
      if (inner.length > 2) {
        return effectiveCode.toLowerCase().includes(inner.toLowerCase());
      }
    }

    // Void elements e.g. <img ... />
    if (clean.startsWith("<img")) {
      return /<img\b/i.test(effectiveCode);
    }

    // Single tag without text e.g. <section> or <main>
    const singleTagMatch = clean.match(/^<([a-z0-9_-]+)\s*\/?>$/i);
    if (singleTagMatch) {
      return new RegExp(`<${singleTagMatch[1]}\\b`, "i").test(effectiveCode);
    }

    return false;
  }

  // 3. CSS declaration e.g. "display: flex" or "color: lightblue"
  if (clean.includes(":")) {
    const [prop, val] = clean.split(":").map((s) => s.trim());
    const escapedProp = prop.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const escapedVal = val.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Ensure prop is not preceded by word or hyphen, so "color" does not match "background-color"
    const regex = new RegExp(`(?<![\\w-])${escapedProp}\\s*:\\s*${escapedVal}\\b`, "i");
    return regex.test(effectiveCode);
  }

  // 4. CSS selector e.g. ".profile-card"
  if (clean.startsWith(".")) {
    const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    return new RegExp(`${escaped}\\b`, "i").test(effectiveCode);
  }

  return effectiveCode.toLowerCase().includes(clean.toLowerCase());
}

/**
 * Toggle helper: Click once to insert, click again to remove cleanly (no stacking/spam)
 */
export function toggleHelperSnippet(prev: string, snippet: string): string {
  const clean = snippet.trim().replace(/;$/, "");

  // 0. Attribute snippet: e.g. class="profile-card"
  const attrMatch = clean.match(/^([a-z0-9_-]+)=["']([^"']+)["']$/i);
  if (attrMatch) {
    const [, attrName, attrVal] = attrMatch;
    const escapedVal = attrVal.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const attrRegex = new RegExp(`\\s+${attrName}=["'][^"']*\\b${escapedVal}\\b[^"']*["']`, "i");

    if (attrRegex.test(prev)) {
      return prev.replace(attrRegex, "");
    }

    const openingTagRegex = /<([a-z0-9_-]+)([^>]*)>/i;
    if (openingTagRegex.test(prev)) {
      return prev.replace(openingTagRegex, (match, tag, rest) => {
        return `<${tag} ${clean}${rest}>`;
      });
    }
    return `${clean} ${prev}`;
  }

  // 1. If snippet is an HTML tag (e.g. "<div class=\"profile-card\">", "<h1>Profil Developer</h1>", etc.)
  if (clean.startsWith("<")) {
    // 1a. Wrapper pattern: <div> ... </div>
    if (clean === "<div> ... </div>") {
      const trimmed = prev.replace(/<!--[\s\S]*?-->/g, "").trim();
      if (!trimmed) {
        return `<div>\n  \n</div>`;
      }
      if (trimmed.startsWith("<div>") && trimmed.endsWith("</div>")) {
        return trimmed.replace(/^<div>\s*\n?/, "").replace(/\n?\s*<\/div>$/, "");
      }
      return `<div>\n  ${trimmed}\n</div>`;
    }

    // 1b. Opening wrapper: <div>
    if (clean === "<div>") {
      const trimmed = prev.trim();
      if (/^<div>/i.test(trimmed)) {
        return trimmed.replace(/^<div>\s*\n?/, "");
      }
      return `<div>\n${trimmed}`;
    }

    // 1c. Closing wrapper: </div>
    if (clean === "</div>") {
      const trimmed = prev.trim();
      if (/<\/div>$/i.test(trimmed)) {
        return trimmed.replace(/\n?\s*<\/div>$/, "");
      }
      return `${trimmed}\n</div>`;
    }

    // 1d. Tag with class attribute, e.g. <div class="profile-card">
    const tagWithClassMatch = clean.match(/^<([a-z0-9_-]+)[^>]*\bclass=["']([^"']+)["']\s*\/?>$/i);
    if (tagWithClassMatch) {
      const [, tag, cls] = tagWithClassMatch;
      const escapedCls = cls.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const tagWithClsRegex = new RegExp(`<${tag}\\b([^>]*)\\bclass=["'][^"']*\\b${escapedCls}\\b[^"']*["']([^>]*)>`, "i");

      // TOGGLE OFF: remove class and revert to plain tag if no other attributes
      if (tagWithClsRegex.test(prev)) {
        return prev.replace(tagWithClsRegex, (match, before, after) => {
          const remaining = (before + after).trim();
          return remaining ? `<${tag} ${remaining}>` : `<${tag}>`;
        });
      }

      // TOGGLE ON: if plain <tag> exists without class, upgrade it!
      const plainTagRegex = new RegExp(`<${tag}(?![^>]*\\bclass=)([^>]*)>`, "i");
      if (plainTagRegex.test(prev)) {
        return prev.replace(plainTagRegex, (match, rest) => {
          const trimmedRest = rest.trim();
          return trimmedRest ? `<${tag} class="${cls}" ${trimmedRest}>` : `<${tag} class="${cls}">`;
        });
      }
    }

    // 1e. If EXACT snippet exists -> TOGGLE OFF (REMOVE)
    if (prev.includes(clean)) {
      return prev
        .replace(clean, "")
        .replace(/\n\s*\n/g, "\n")
        .trim();
    }

    // 1f. If snippet has a distinct prefix like <p>Nama: or <p>Umur:
    const prefixMatch = clean.match(/<([a-z0-9_-]+)[^>]*>\s*([a-zA-Z0-9]+:)/i);
    if (prefixMatch) {
      const [, tag, prefix] = prefixMatch;
      const existingPrefixRegex = new RegExp(`\\s*<${tag}\\b[^>]*>\\s*${prefix}[\\s\\S]*?<\\/${tag}>`, "i");
      if (existingPrefixRegex.test(prev)) {
        return prev
          .replace(existingPrefixRegex, "")
          .replace(/\n\s*\n/g, "\n")
          .trim();
      }
    }

    // 1g. Clean any stray HTML comments
    const cleanPrev = prev.replace(/<!--[\s\S]*?-->/g, "").trim();
    if (cleanPrev !== prev.trim()) {
      return cleanPrev ? `${cleanPrev}\n${clean}` : clean;
    }

    // 1h. Otherwise, append the snippet on a clean new line!
    const trimmed = cleanPrev;
    return trimmed ? `${trimmed}\n${clean}` : clean;
  }

  // 2. If snippet is a CSS declaration (e.g. "display: flex" or "justify-content: center")
  if (clean.includes(":")) {
    const [prop, val] = clean.split(":").map((s) => s.trim());
    const escapedProp = prop.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const escapedVal = val.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const exactRegex = new RegExp(`(?<![\\w-])[\\t ]*${escapedProp}\\s*:\\s*${escapedVal}\\s*;?\\n?`, "gi");

    // If EXACT declaration already exists -> TOGGLE OFF (REMOVE)
    if (exactRegex.test(prev)) {
      return prev.replace(exactRegex, "").replace(/\n{3,}/g, "\n\n");
    }

    // If the same property already exists with another value -> REPLACE IT (no stacking/spam)
    const samePropRegex = new RegExp(`(?<![\\w-])${escapedProp}\\s*:\\s*[^;\\n]+;?`, "i");
    if (samePropRegex.test(prev)) {
      return prev.replace(samePropRegex, `${prop}: ${val};`);
    }

    // Otherwise -> INSERT into matching container rule or append
    if (prev.includes(".grid-arena {")) {
      return prev.replace(".grid-arena {", `.grid-arena {\n  ${clean};`);
    }
    if (prev.includes(".navbar {")) {
      return prev.replace(".navbar {", `.navbar {\n  ${clean};`);
    }
    if (prev.includes(".arena {")) {
      return prev.replace(".arena {", `.arena {\n  ${clean};`);
    }
    if (prev.includes(".header {")) {
      return prev.replace(".header {", `.header {\n  ${clean};`);
    }
    if (prev.includes(".sidebar {")) {
      return prev.replace(".sidebar {", `.sidebar {\n  ${clean};`);
    }
    return `${prev}\n${clean};`;
  }

  // 3. If snippet is a selector (e.g. ".card-2", ".permen-2", ".header", etc.)
  if (clean.startsWith(".")) {
    const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const blockRegex = new RegExp(`\\n*${escaped}\\s*\\{[^}]*\\}`, "gi");
    if (blockRegex.test(prev)) {
      return prev.replace(blockRegex, "").replace(/\n{3,}/g, "\n\n");
    }
    const defaultProp = clean.includes("header")
      ? "grid-column: span 3;"
      : clean.includes("sidebar")
      ? "grid-row: span 2;"
      : clean.includes("3")
      ? "order: -1;"
      : "align-self: flex-end;";
    return `${prev}\n\n${clean} {\n  ${defaultProp}\n}`;
  }

  // 3. Fallback toggle
  if (prev.includes(clean)) {
    return prev.replace(clean, "").replace(/\n{3,}/g, "\n\n");
  }
  return `${prev}\n${clean};`;
}

/**
 * Sanitized HTML for safe real-time 60 FPS arena preview (comprehensive XSS, event-handler, & script injection protection)
 */
export function sanitizeUserHtml(code: string): string {
  if (!code) return "";
  return code
    // 1. Unescape literal escaped newlines and carriage returns
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    // 2. Strip any remaining stray literal \n or /n tokens that could render as visible text
    .replace(/(?:^|\n|>)\s*\\n\s*(?:<|\n|$)/g, "$1\n$2")
    .replace(/(?:^|\n|>)\s*\/n\s*(?:<|\n|$)/g, "$1\n$2")
    // 3. Security sanitization: strip script, iframe, objects, event handlers, etc.
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/<base\b[^>]*>/gi, "")
    .replace(/\bon[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(javascript|vbscript|data):/gi, "")
    .replace(/\bautofocus\b/gi, "");
}

/**
 * Scoped CSS tag for extra browser cascade support
 */
export function getScopedCss(cssCode: string): string {
  if (!cssCode) return "";
  return cssCode
    .replace(/\.arena\b/g, "#live-arena, .arena")
    .replace(/\.box\b/g, "#live-arena .box, .box")
    .replace(/\.badge\b/g, "#live-arena .badge, .badge")
    .replace(/\.navbar\b/g, "#live-arena, .navbar")
    .replace(/\.grid-arena\b/g, "#live-arena, .grid-arena")
    .replace(/\.header\b/g, "#live-arena .grid-header, .header")
    .replace(/\.sidebar\b/g, "#live-arena .grid-sidebar, .sidebar")
    .replace(/\.permen-([0-9]+)\b/g, "#live-arena .permen-$1")
    .replace(/\.card-([0-9]+)\b/g, "#live-arena .card-$1");
}
