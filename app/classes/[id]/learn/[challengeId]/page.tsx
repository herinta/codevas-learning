"use client";

import React, { useState, useEffect, use, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  Star,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Eye,
  Rocket,
  Loader2,
  Zap,
  BookOpen,
  AlertCircle,
  WifiOff,
  LogOut,
  RefreshCw,
  HelpCircle,
  Target,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useDailyTargetTracker } from "@/lib/hooks/use-daily-target-tracker";

interface ChallengeData {
  id: string;
  class_id: string;
  title: string;
  difficulty?: string;
  order_index?: number;
  instruction: string;
  theory?: string | null;
  syntax_helpers?: string[];
  hint: string | null;
  xp_reward: number;
  initial_state: string;
  codeSnapshot?: string;
  locked_template?: {
    element?: string;
    itemsCount?: number;
    itemLabels?: string[];
  };
  target_visual?: {
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: string;
    description?: string;
  };
}

/**
 * Live flexible CSS goal evaluator for real-time validation without needing a submit button!
 */

function evaluateLiveGoals(
  challengeId: string,
  cssCode: string
): {
  passed: boolean;
  goals: { label: string; passed: boolean }[];
} {
  const normalized = cssCode.toLowerCase().replace(/\s+/g, " ");

  // ================= HTML ARCHITECTURE LEVELS 1-12 =================
  if (challengeId === "html-1-raw-content") {
    const hasH1 = /<h1[^>]*>[\s\S]*Profil Saya[\s\S]*<\/h1>/i.test(cssCode);
    return {
      passed: hasH1,
      goals: [{ label: "<h1>Profil Saya</h1>", passed: hasH1 }],
    };
  }

  if (challengeId === "html-2-paragraph") {
    const hasH1 = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]+<\/p>/i.test(cssCode);
    return {
      passed: hasH1 && hasP,
      goals: [
        { label: "Judul <h1>Profil Saya</h1>", passed: hasH1 },
        { label: "Paragraf <p> deskripsi dirimu", passed: hasP },
      ],
    };
  }

  if (challengeId === "html-3-first-box") {
    const hasDiv = /<div[^>]*>[\s\S]*<h1[\s\S]*<p[\s\S]*<\/div>/i.test(cssCode);
    const hasBothTags = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode) && /<p[^>]*>[\s\S]*<\/p>/i.test(cssCode);
    const passed = hasDiv && hasBothTags;
    return {
      passed,
      goals: [
        { label: "<div> pembungkus (Parent container)", passed: hasDiv },
        { label: "Nesting: <h1> dan <p> di dalam <div>", passed: hasBothTags && hasDiv },
      ],
    };
  }

  if (challengeId === "html-4-siblings") {
    const divs = cssCode.match(/<div[^>]*>[\s\S]*?<\/div>/gi);
    const hasTwoDivs = Boolean(divs && divs.length >= 2);
    return {
      passed: hasTwoDivs,
      goals: [
        { label: "<div> pertama untuk blok atas", passed: Boolean(divs && divs.length >= 1) },
        { label: "<div> kedua sejajar (Sibling)", passed: hasTwoDivs },
      ],
    };
  }

  if (challengeId === "html-5-matryoshka") {
    const hasParentAndChildren = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<\/div>/i.test(cssCode);
    return {
      passed: hasParentAndChildren,
      goals: [
        { label: "Satu <div> Parent pembungkus utama", passed: /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode) },
        { label: "Dua <div> Child di dalam Parent (Nesting)", passed: hasParentAndChildren },
      ],
    };
  }

  if (challengeId === "html-6-image-element") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasSrc = /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(cssCode);
    return {
      passed: hasImg && hasSrc,
      goals: [
        { label: "Tag <img> self-closing", passed: hasImg },
        { label: "Atribut src dengan link gambar", passed: hasSrc },
      ],
    };
  }

  if (challengeId === "html-7-action-button") {
    const hasButton = /<button[^>]*>[\s\S]*Follow[\s\S]*<\/button>/i.test(cssCode);
    return {
      passed: hasButton,
      goals: [{ label: "Tag <button> dengan teks 'Follow'", passed: hasButton }],
    };
  }

  if (challengeId === "html-8-link") {
    const hasLink = /<a\b[^>]*\bhref\s*=\s*["'][^"']+["'][^>]*>[\s\S]+<\/a>/i.test(cssCode);
    return {
      passed: hasLink,
      goals: [{ label: "Tag <a> dengan atribut href", passed: hasLink }],
    };
  }

  if (challengeId === "html-9-list-hierarchy") {
    const hasUl = /<ul[^>]*>[\s\S]*<\/ul>/i.test(cssCode);
    const hasLi = /<ul[^>]*>[\s\S]*<li[^>]*>[\s\S]*?<\/li>[\s\S]*<\/ul>/i.test(cssCode);
    return {
      passed: hasUl && hasLi,
      goals: [
        { label: "Pembungkus daftar <ul>", passed: hasUl },
        { label: "Item daftar <li> di dalam <ul>", passed: hasLi },
      ],
    };
  }

  if (challengeId === "html-10-semantic-touch") {
    const hasSection = /<section[^>]*>[\s\S]+<\/section>/i.test(cssCode);
    return {
      passed: hasSection,
      goals: [{ label: "Tag semantik <section> sebagai pembungkus", passed: hasSection }],
    };
  }

  if (challengeId === "html-11-form-wrapper") {
    const hasForm = /<form[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasInput = /<form[^>]*>[\s\S]*<input\b[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasButton = /<form[^>]*>[\s\S]*<button\b[^>]*>[\s\S]*<\/button>[\s\S]*<\/form>/i.test(cssCode);
    return {
      passed: hasForm && hasInput && hasButton,
      goals: [
        { label: "Wadah formulir <form>", passed: hasForm },
        { label: "Elemen input <input>", passed: hasInput },
        { label: "Tombol aksi <button>", passed: hasButton },
      ],
    };
  }

  if (challengeId === "html-12-boss-card") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasInnerDiv = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*<\/div>[\s\S]*<\/div>/i.test(cssCode);
    const hasHead = /<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]*?<\/p>/i.test(cssCode);
    const hasBtn = /<button[^>]*>[\s\S]*?<\/button>/i.test(cssCode);
    const passed = hasImg && hasInnerDiv && hasHead && hasP && hasBtn;
    return {
      passed,
      goals: [
        { label: "<div> Parent utama Profile Card", passed: /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode) },
        { label: "Tag <img /> Avatar foto", passed: hasImg },
        { label: "<div> Child pembungkus teks", passed: hasInnerDiv },
        { label: "Elemen <h2>, <p>, dan <button>", passed: hasHead && hasP && hasBtn },
      ],
    };
  }

  // ================= CSS BASICS (12 Levels) =================
  if (challengeId === "css-basics-1-background-color") {
    const passed = /background-color\s*:\s*(lightblue|#add8e6|rgb\(\s*173\s*,\s*216\s*,\s*230\s*\)|sky-?blue|#38bdf8|#60a5fa)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "background-color: lightblue;", passed }],
    };
  }

  if (challengeId === "css-basics-2-text-color") {
    const passed = /color\s*:\s*(#333|#333333|black|#000|#000000|rgb\(\s*51\s*,\s*51\s*,\s*51\s*\)|#1e293b|#0f172a)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "color: #333;", passed }],
    };
  }

  if (challengeId === "css-basics-3-font-size") {
    const passed = /font-size\s*:\s*(24px|1\.5rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-size: 24px;", passed }],
    };
  }

  if (challengeId === "css-basics-4-font-weight") {
    const passed = /font-weight\s*:\s*(bold|700|800|900)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-weight: bold;", passed }],
    };
  }

  if (challengeId === "css-basics-5-font-style") {
    const passed = /font-style\s*:\s*italic/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-style: italic;", passed }],
    };
  }

  if (challengeId === "css-basics-6-text-align") {
    const passed = /text-align\s*:\s*center/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "text-align: center;", passed }],
    };
  }

  if (challengeId === "css-basics-7-padding") {
    const passed = /padding\s*:\s*(20px|1\.25rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "padding: 20px;", passed }],
    };
  }

  if (challengeId === "css-basics-8-margin") {
    const passed = /margin\s*:\s*(15px|16px|1rem|20px)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "margin: 15px;", passed }],
    };
  }

  if (challengeId === "css-basics-9-border") {
    const passed = /border\s*:\s*2px\s+solid/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border: 2px solid black;", passed }],
    };
  }

  if (challengeId === "css-basics-10-border-radius") {
    const passed = /border-radius\s*:\s*(12px|0\.75rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border-radius: 12px;", passed }],
    };
  }

  if (challengeId === "css-basics-11-box-shadow") {
    const passed = /box-shadow\s*:\s*0px?\s+4px?\s+10px?/i.test(cssCode) || /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "box-shadow: 0px 4px 10px rgba(0,0,0,0.1);", passed }],
    };
  }

  if (challengeId === "css-basics-12-boss-fight") {
    const g1 = /background(-color)?\s*:\s*(#ef4444|red|#dc2626|#f87171)/i.test(cssCode);
    const g2 = /color\s*:\s*(white|#fff|#ffffff)/i.test(cssCode);
    const g3 = /padding\s*:\s*8px\s+16px/i.test(cssCode) || /padding\s*:\s*(8px|16px|12px|10px)/i.test(cssCode);
    const g4 = /border-radius\s*:\s*(999px|9999px|50px|50%|24px)/i.test(cssCode);
    return {
      passed: g1 && g2 && g3 && g4,
      goals: [
        { label: "background-color: #ef4444;", passed: g1 },
        { label: "color: white;", passed: g2 },
        { label: "padding: 8px 16px;", passed: g3 },
        { label: "border-radius: 999px;", passed: g4 },
      ],
    };
  }

  // ================= CSS FLEXBOX LEVELS =================
  if (challengeId === "flexbox-1-activation") {

    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 =
      /justify-content\s*:\s*(center|space-around|space-evenly)/.test(normalized) ||
      /margin\s*:\s*(auto|0\s+auto)/.test(normalized);
    const g3 =
      /align-items\s*:\s*center/.test(normalized) ||
      /place-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "justify-content: center", passed: g2 },
        { label: "align-items: center", passed: g3 },
      ],
    };
  }

  if (challengeId === "flexbox-2-space-between") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*space-between/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "justify-content: space-between", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-3-space-around") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*(space-around|space-evenly)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "justify-content: space-around", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-4-flex-end") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*(flex-end|end)/.test(normalized);
    const g3 = /align-items\s*:\s*(flex-end|end)/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "justify-content: flex-end", passed: g2 },
        { label: "align-items: flex-end", passed: g3 },
      ],
    };
  }

  if (challengeId === "flexbox-5-direction-column") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-direction\s*:\s*column/.test(normalized);
    const g3 =
      /align-items\s*:\s*center/.test(normalized) ||
      /justify-content\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "flex-direction: column", passed: g2 },
        { label: "align-items: center", passed: g3 },
      ],
    };
  }

  if (challengeId === "flexbox-6-column-reverse") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-direction\s*:\s*column-reverse/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "flex-direction: column-reverse", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-7-flex-wrap") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-wrap\s*:\s*wrap/.test(normalized);
    const g3 = /gap\s*:\s*(16px|1rem|12px|20px|1.5rem)/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "flex-wrap: wrap", passed: g2 },
        { label: "gap: 16px", passed: g3 },
      ],
    };
  }

  if (challengeId === "flexbox-8-align-self") {
    const g1 = /align-self\s*:\s*(flex-end|end)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: ".permen-2 { align-self: flex-end; }", passed: g1 }],
    };
  }

  if (challengeId === "flexbox-9-order") {
    const g1 = /order\s*:\s*(-1|0|-2)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: ".permen-3 { order: -1; }", passed: g1 }],
    };
  }

  if (challengeId === "flexbox-10-boss-fight") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-wrap\s*:\s*wrap/.test(normalized);
    const g3 = /justify-content\s*:\s*(space-between|center|space-around)/.test(
      normalized
    );
    const g4 = /gap\s*:\s*(16px|1rem|12px|20px|1.5rem)/.test(normalized);
    return {
      passed: g1 && g2 && g3 && g4,
      goals: [
        { label: "display: flex", passed: g1 },
        { label: "flex-wrap: wrap", passed: g2 },
        { label: "justify-content: space-between", passed: g3 },
        { label: "gap: 16px", passed: g4 },
      ],
    };
  }

  return { passed: false, goals: [] };
}

// Known valid CSS values for anti-flicker live parsing
const VALID_PROPERTIES: Record<string, RegExp> = {
  display: /^(flex|inline-flex|grid|block|inline-block|none)$/i,
  justifyContent: /^(center|space-between|space-around|space-evenly|flex-start|flex-end|start|end|left|right)$/i,
  alignItems: /^(center|flex-start|flex-end|stretch|baseline|start|end)$/i,
  flexDirection: /^(row|row-reverse|column|column-reverse)$/i,
  flexWrap: /^(wrap|nowrap|wrap-reverse)$/i,
  gap: /^(\d+(\.\d+)?(px|rem|em|%)?(\s+\d+(\.\d+)?(px|rem|em|%)?)?)$/i,
  alignSelf: /^(auto|flex-start|flex-end|center|baseline|stretch|start|end)$/i,
  order: /^-?\d+$/i,
  backgroundColor: /^.+$/i,
  color: /^.+$/i,
  fontSize: /^.+$/i,
  fontWeight: /^(normal|bold|bolder|lighter|\d{3})$/i,
  fontStyle: /^(normal|italic|oblique)$/i,
  textAlign: /^(left|right|center|justify)$/i,
  padding: /^.+$/i,
  margin: /^.+$/i,
  border: /^.+$/i,
  borderRadius: /^.+$/i,
  boxShadow: /^.+$/i,
};

/**
 * Deterministically shuffles options so the correct answer is NEVER placed at index 0,
 * and options do not re-shuffle or jitter between keystrokes.
 */
function getShuffledHelpers(helpers: string[] | undefined, seedKey: string): string[] {
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
function parseUserStyles(css: string): {
  arenaStyle: React.CSSProperties;
  itemStyles: Record<string, React.CSSProperties>;
} {
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
        selector.includes(".box") ||
        selector === "box" ||
        selector.includes(".badge") ||
        selector === "badge" ||
        selector === "*"
      ) {
        Object.assign(arenaStyle, declObj);
        itemStyles["box"] = { ...(itemStyles["box"] || {}), ...declObj };
      } else {
        const itemMatch = selector.match(/\.(permen|card)-?([0-9]+)/);
        if (itemMatch) {
          const key = `item-${itemMatch[2]}`;
          itemStyles[key] = { ...(itemStyles[key] || {}), ...declObj };
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

function ChallengePlaygroundContent({
  params,
}: {
  params: Promise<{ id: string; challengeId: string }>;
}) {
  const { id: classId, challengeId } = use(params);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [cssCode, setCssCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<"mission" | "arena" | "editor" | "all">("editor");
  // Target belajar harian hanya aktif berdetik di halaman workspace belajar ini
  const dailyTarget = useDailyTargetTracker({ activeMode: true });

  // Auto-sync state when passed
  const [hasSavedPass, setHasSavedPass] = useState(false);
  const [nextChallengeId, setNextChallengeId] = useState<string | null>(null);
  const [isClassCompleted, setIsClassCompleted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleNextLevel = () => {
    if (nextChallengeId) {
      router.push(`/classes/${classId}/learn/${nextChallengeId}`);
    } else {
      router.push(`/classes/${classId}`);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [earnedXpInfo, setEarnedXpInfo] = useState<{
    earnedXp: number;
    leveledUp: boolean;
    level: number;
    rankTitle: string;
    newTotalXp?: number;
  } | null>(null);

  // Load challenge info dynamically from API
  const loadData = React.useCallback(async () => {
    setLoading(true);
    setHasSavedPass(false);
    setNextChallengeId(null);
    setIsClassCompleted(false);
    setSaveError(null);
    setLoadError(null);
    setEarnedXpInfo(null);

    try {
      const res = await fetch(`/api/challenges/${challengeId}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const found = json.data;
          setChallenge(found);
          setCssCode(
            found.codeSnapshot ||
              found.initial_state ||
              (found.class_id === "html-architecture" || found.id.startsWith("html-")
                ? "<!-- Tulis tag HTML di sini -->"
                : `.arena {\n  /* Tulis CSS Flexbox di sini */\n}`)
          );
        } else {
          setLoadError(json.message || "Tantangan tidak ditemukan.");
        }
      } else {
        setLoadError(`Gagal memuat tantangan (Status ${res.status}).`);
      }
    } catch (err) {
      console.error("Gagal memuat tantangan:", err);
      setLoadError("Koneksi gagal saat memuat tantangan. Periksa jaringan Anda.");
    } finally {
      setLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isHtmlMode =
    challenge?.class_id === "html-architecture" || challengeId.startsWith("html-");
  const isCssBasicsMode =
    challenge?.class_id === "css-basics" || challengeId.startsWith("css-basics-");

  // Deterministically shuffled helpers so the correct answer is NEVER placed at index 0 (top/first)
  const shuffledHelpers = useMemo(() => {
    return getShuffledHelpers(challenge?.syntax_helpers, challenge?.id || challengeId);
  }, [challenge?.syntax_helpers, challenge?.id, challengeId]);


  // Sanitized HTML for safe real-time 60 FPS arena preview (comprehensive XSS, event-handler, & script injection protection)
  const sanitizedUserHtml = useMemo(() => {
    if (!cssCode) return "";
    return cssCode
      // Strip dangerous tags completely
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      .replace(/<link\b[^>]*>/gi, "")
      .replace(/<meta\b[^>]*>/gi, "")
      .replace(/<base\b[^>]*>/gi, "")
      // Strip all event handlers: quoted ("..."), single-quoted ('...'), and UNQUOTED (onerror=alert(1))
      .replace(/\bon[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      // Strip dangerous pseudo-protocols
      .replace(/(javascript|vbscript|data):/gi, "")
      // Strip autofocus to prevent focus-trap / event escalation
      .replace(/\bautofocus\b/gi, "");
  }, [cssCode]);

  // Real-time Live Evaluation as user types (instant reactivity)
  const liveEval = useMemo(() => {
    return evaluateLiveGoals(challengeId, cssCode);
  }, [challengeId, cssCode]);

  // Real-time Style Parsing for the Live Arena
  const { arenaStyle, itemStyles } = useMemo(() => {
    return parseUserStyles(cssCode);
  }, [cssCode]);

  // Scoped CSS tag for extra browser cascade support
  const scopedCss = useMemo(() => {
    if (!cssCode) return "";
    return cssCode
      .replace(/\.arena\b/g, "#live-arena, .arena")
      .replace(/\.box\b/g, "#live-arena .box, .box")
      .replace(/\.badge\b/g, "#live-arena .badge, .badge")
      .replace(/\.permen-([0-9]+)\b/g, "#live-arena .permen-$1")
      .replace(/\.card-([0-9]+)\b/g, "#live-arena .card-$1");
  }, [cssCode]);


  // Robust function to save progress with error handling & retry
  const saveProgress = React.useCallback(async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/challenges/${challengeId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cssCode }),
      });

      if (res.status === 401) {
        setSessionExpired(true);
        setHasSavedPass(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal menyimpan progress ke server");
      }

      const data = await res.json();
      if (data.passed) {
        setHasSavedPass(true);
        setNextChallengeId(data.nextChallengeId);
        setIsClassCompleted(Boolean(data.isClassCompleted));
        setEarnedXpInfo({
          earnedXp: data.earnedXp ?? challenge?.xp_reward ?? 20,
          leveledUp: Boolean(data.leveledUp),
          level: data.level ?? user?.level ?? 1,
          rankTitle: data.rankTitle ?? user?.rank_title ?? "Siswa Pemula",
          newTotalXp: data.newTotalXp,
        });
        refreshUser();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("codevas:progress-updated"));
          try {
            localStorage.setItem("codevas:progress-synced", Date.now().toString());
          } catch {}
        }
      }
    } catch (err) {
      console.error("Error auto-saving progress:", err);
      setSaveError("Gagal menyimpan progress ke server. Periksa koneksi Anda.");
      setHasSavedPass(false);
    } finally {
      setIsSaving(false);
    }
  }, [user, isSaving, challengeId, cssCode, refreshUser]);

  // Automatically save progress in the background the moment all goals are fulfilled
  useEffect(() => {
    if (liveEval.passed && !hasSavedPass && user && !saveError) {
      saveProgress();
    }
  }, [liveEval.passed, hasSavedPass, user, saveError, saveProgress]);

  // Mini Confetti canvas refs for desktop and mobile
  const confettiCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasMobileRef = React.useRef<HTMLCanvasElement | null>(null);

  const fireMiniConfetti = React.useCallback(() => {
    const canvas =
      typeof window !== "undefined" && window.innerWidth < 1024
        ? confettiCanvasMobileRef.current || confettiCanvasRef.current
        : confettiCanvasRef.current || confettiCanvasMobileRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    // Set canvas dimensions to right panel container size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = ["#ec4899", "#f59e0b", "#10b981", "#6366f1", "#06b6d4", "#fbbf24", "#e11d48"];
    const particlesCount = 42;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      alpha: number;
      shape: "rect" | "circle";
    }> = [];

    // Burst from bottom center of the right action panel
    const startX = canvas.width / 2;
    const startY = canvas.height - 80;

    for (let i = 0; i < particlesCount; i++) {
      const speed = 4 + Math.random() * 7;
      particles.push({
        x: startX + (Math.random() - 0.5) * 80,
        y: startY,
        vx: (Math.random() - 0.5) * 8,
        vy: -speed - 2,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.rotationSpeed;
        if (elapsed > 900) {
          p.alpha = Math.max(0, 1 - (elapsed - 900) / 900);
        }

        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 2000) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrameId = requestAnimationFrame(render);
  }, []);

  // Trigger mini confetti only when transitioning from false -> true
  const prevPassedRef = React.useRef(false);
  useEffect(() => {
    if (liveEval.passed && !prevPassedRef.current) {
      fireMiniConfetti();
    }
    prevPassedRef.current = liveEval.passed;
  }, [liveEval.passed, fireMiniConfetti]);

  // Check if a snippet is already present in user's CSS/HTML
  const isHelperActive = (snippet: string, code: string): boolean => {
    const clean = snippet.trim().replace(/;$/, "");
    if (clean.startsWith("<")) {
      if (clean === "<div> ... </div>") {
        return /<div[^>]*>[\s\S]*<\/div>/i.test(code);
      }
      if (clean.startsWith("<img")) {
        return /<img\b/i.test(code);
      }
      const tagMatch = clean.match(/^<([a-z0-9]+)/i);
      if (tagMatch) {
        return new RegExp(`<${tagMatch[1]}\\b`, "i").test(code);
      }
      return code.toLowerCase().includes(clean.toLowerCase());
    }
    if (clean.includes(":")) {
      const [prop, val] = clean.split(":").map((s) => s.trim());
      const escapedVal = val.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b${prop}\\s*:\\s*${escapedVal}\\b`, "i");
      return regex.test(code);
    }
    if (clean.startsWith(".")) {
      const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`${escaped}\\b`, "i").test(code);
    }
    return code.toLowerCase().includes(clean.toLowerCase());
  };

  // Toggle helper: Click once to insert, click again to remove cleanly (no stacking/spam)
  const handleToggleHelper = (snippet: string) => {
    const clean = snippet.trim().replace(/;$/, "");

    setCssCode((prev) => {
      // 0. If snippet is an HTML tag (e.g. "<h1>Profil Saya</h1>" or "<div> ... </div>")
      if (clean.startsWith("<")) {
        if (clean === "<div> ... </div>") {
          const trimmed = prev.trim();
          if (trimmed.startsWith("<div>") && trimmed.endsWith("</div>")) {
            return trimmed.replace(/^<div>\s*/, "").replace(/\s*<\/div>$/, "");
          }
          return `<div>\n  ${trimmed}\n</div>`;
        }

        const tagMatch = clean.match(/^<([a-z0-9]+)/i);
        const tagName = tagMatch ? tagMatch[1] : "";

        // If exact snippet exists -> TOGGLE OFF (REMOVE)
        if (prev.includes(clean)) {
          return prev.replace(clean, "").trim();
        }

        // If tag already exists -> replace tag block
        if (tagName && tagName !== "div" && tagName !== "img" && new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "i").test(prev)) {
          return prev.replace(new RegExp(`\\s*<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "i"), "").trim();
        }

        // If there is an HTML comment placeholder like <!-- ... -->, replace it!
        if (/<!--[\s\S]*?-->/.test(prev)) {
          return prev.replace(/<!--[\s\S]*?-->/, clean).trim();
        }

        return prev ? `${prev}\n${clean}` : clean;
      }

      // 1. If snippet is a CSS declaration (e.g. "display: flex" or "justify-content: center")
      if (clean.includes(":")) {
        const [prop, val] = clean.split(":").map((s) => s.trim());
        const escapedVal = val.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        const exactRegex = new RegExp(`[\\t ]*${prop}\\s*:\\s*${escapedVal}\\s*;?\\n?`, "gi");

        // If EXACT declaration already exists -> TOGGLE OFF (REMOVE)
        if (exactRegex.test(prev)) {
          return prev.replace(exactRegex, "").replace(/\n{3,}/g, "\n\n");
        }

        // If the same property already exists with another value -> REPLACE IT (no stacking/spam)
        const samePropRegex = new RegExp(`${prop}\\s*:\\s*[^;\\n]+;?`, "i");
        if (samePropRegex.test(prev)) {
          return prev.replace(samePropRegex, `${prop}: ${val};`);
        }

        // Otherwise -> INSERT into .arena { ... } or append
        if (prev.includes(".arena {")) {
          return prev.replace(".arena {", `.arena {\n  ${clean};`);
        }
        return `${prev}\n${clean};`;
      }

      // 2. If snippet is a selector (e.g. ".permen-2" or ".permen-3")
      if (clean.startsWith(".")) {
        const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        const blockRegex = new RegExp(`\\n*${escaped}\\s*\\{[^}]*\\}`, "gi");
        if (blockRegex.test(prev)) {
          return prev.replace(blockRegex, "").replace(/\n{3,}/g, "\n\n");
        }
        const defaultProp = clean.includes("2") ? "align-self: flex-end;" : "order: -1;";
        return `${prev}\n\n${clean} {\n  ${defaultProp}\n}`;
      }

      // 3. Fallback toggle
      if (prev.includes(clean)) {
        return prev.replace(clean, "").replace(/\n{3,}/g, "\n\n");
      }
      return `${prev}\n${clean};`;
    });
  };

  const handleReset = () => {
    if (challenge) {
      setCssCode(challenge.initial_state);
      setHasSavedPass(false);
    }
  };

  // Item configurations
  const itemsCount = challenge?.locked_template?.itemsCount || 3;
  const itemLabels = challenge?.locked_template?.itemLabels || [
    "🍬 Permen 1",
    "🍭 Permen 2",
    "🍫 Permen 3",
  ];

  const palette = [
    { bg: "bg-pink-100", border: "border-pink-900", text: "text-pink-950", emoji: "🍬" },
    { bg: "bg-purple-100", border: "border-purple-900", text: "text-purple-950", emoji: "🍭" },
    { bg: "bg-amber-100", border: "border-amber-900", text: "text-amber-950", emoji: "🍫" },
    { bg: "bg-sky-100", border: "border-sky-900", text: "text-sky-950", emoji: "⭐" },
    { bg: "bg-emerald-100", border: "border-emerald-900", text: "text-emerald-950", emoji: "💎" },
    { bg: "bg-rose-100", border: "border-rose-900", text: "text-rose-950", emoji: "🍩" },
  ];

  // Target visual goal styles
  const targetVisual = challenge?.target_visual || {};
  const isLevel8 = challenge?.id === "flexbox-8-align-self";
  const isLevel9 = challenge?.id === "flexbox-9-order";
  const isLevel10 = challenge?.id === "flexbox-10-boss-fight";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-headline font-bold text-sm text-on-surface">
          Memuat Workspace Pembelajaran...
        </p>
      </div>
    );
  }

  if (loadError || !challenge) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-error/10 border-2 border-error/30 flex items-center justify-center text-error">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-display font-black text-on-surface">
          {loadError ? "Gagal Memuat Tantangan" : "Tantangan Tidak Ditemukan"}
        </h2>
        <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
          {loadError || "Soal tantangan tidak ditemukan di server. Periksa koneksi internet Anda atau kembali ke silabus kelas."}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => loadData()}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-headline font-bold text-xs shadow-xs hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Muat Ulang</span>
          </button>
          <Link
            href={`/classes/${classId}`}
            className="px-4 py-2.5 rounded-xl border border-on-surface bg-surface-container font-headline font-bold text-xs hover:bg-surface-container-high"
          >
            Kembali ke Kelas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Scoped Dynamic Styles for Live Arena with Spring Glide Animations */}
      <style>{`
        #live-arena {
          box-sizing: border-box;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        #live-arena > div {
          transition: all 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) !important;
          will-change: transform, margin, flex, order, align-self;
        }
        @keyframes tutorial-blink {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.04);
            box-shadow: 0 0 0 6px rgba(236, 72, 153, 0);
          }
        }
        .blinking-tutorial-choice {
          animation: tutorial-blink 1.2s infinite ease-in-out;
        }
        .html-live-sandbox h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .html-live-sandbox h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .html-live-sandbox p {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }
        .html-live-sandbox div {
          border: 2px dashed #3b82f6;
          background-color: rgba(239, 246, 255, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox section {
          border: 2px dashed #8b5cf6;
          background-color: rgba(245, 243, 255, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox form {
          border: 2px dashed #10b981;
          background-color: rgba(236, 253, 245, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          background-color: #2563eb;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          margin-top: 4px;
        }
        .html-live-sandbox a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 600;
          font-size: 14px;
        }
        .html-live-sandbox input {
          border: 2px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-right: 8px;
        }
        .html-live-sandbox ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 6px 0;
        }
        .html-live-sandbox li {
          font-size: 13px;
          color: #334155;
          margin-bottom: 2px;
        }
        .html-live-sandbox img {
          max-width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 8px;
          border: 2px solid #e2e8f0;
        }
        ${scopedCss}
      `}</style>

      {/* Top Bar Navigation */}
      <header className="w-full bg-surface-container-lowest border-b-2 border-on-surface px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href={`/classes/${classId}`}
            className="p-2 rounded-full border border-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
            title="Kembali ke Silabus"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-secondary tracking-widest uppercase">
                LEVEL {challenge?.order_index || 1} / 12
              </span>
              {challenge?.difficulty && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-on-surface bg-primary text-white">
                  {challenge.difficulty}
                </span>
              )}
            </div>
            <h1 className="font-display font-black text-sm sm:text-base text-on-surface truncate max-w-xs sm:max-w-md">
              {challenge?.title || "Level"}
            </h1>
          </div>
        </div>

        {/* User Status Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-amber-300 border-2 border-on-surface rounded-full shadow-xs shrink-0"
            title={`Level ${user?.level || 1} • ${user?.rank_title || 'Siswa Pemula'}`}
          >
            <span className="text-[11px] sm:text-xs font-mono font-black text-on-surface">
              Lv.{user?.level || 1}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#fff3e0] border-2 border-on-surface rounded-full shadow-xs shrink-0">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e65100] fill-[#e65100]" />
            <span className="text-[11px] sm:text-xs font-headline font-black text-on-surface">
              {user ? `${(user as any).streak_days || 1}d` : "1d"}
            </span>
          </div>

          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-surface-container-high border-2 border-on-surface rounded-full shadow-xs shrink-0"
            title={`Target Harian: 10 Menit Fokus Belajar (${dailyTarget.percent}% tercapai)`}
          >
            <Target className={`w-3.5 h-3.5 ${dailyTarget.isCompleted ? 'text-emerald-600' : 'text-primary'}`} />
            <span className="text-[11px] font-mono font-black text-on-surface">
              {dailyTarget.formattedActive}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-xs shrink-0">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-xs font-headline font-black text-secondary">
              {user ? `${user.xp_points} XP` : "50 XP"}
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE WORKSPACE (Unified 1-Screen: Soal + Preview + Code) */}
      {/* ======================================================== */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 overflow-hidden bg-surface-container-lowest relative">
        {/* Localized Mini Confetti Canvas for mobile */}
        <canvas
          ref={confettiCanvasMobileRef}
          className="pointer-events-none absolute inset-0 z-30 w-full h-full"
        />

        {/* 1. COMPACT MISSION BANNER */}
        <div className="px-3 py-1.5 bg-surface-container border-b-2 border-on-surface flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-1.5 py-0.5 rounded-md bg-primary text-white font-headline font-black text-[10px] shrink-0">
              Lvl {challenge?.order_index || 1}
            </span>
            <p className="text-xs font-bold text-on-surface truncate leading-tight">
              {challenge?.instruction}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {challenge?.theory && (
              <button
                onClick={() => setShowTheoryModal(true)}
                className="px-2 py-0.5 rounded-lg bg-surface-container-high border border-on-surface text-[10px] font-bold text-on-surface hover:bg-surface-container-highest flex items-center gap-1 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3 h-3 text-primary" />
                <span>Teori</span>
              </button>
            )}
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full">
              +{challenge?.xp_reward}XP
            </span>
          </div>
        </div>

        {/* 2. COMPACT LIVE ARENA PREVIEW */}
        <div className="p-2 bg-surface-container-low border-b-2 border-on-surface flex flex-col items-center justify-center shrink-0">
          {isHtmlMode ? (
            <div
              id="live-arena"
              className={`arena w-full h-28 sm:h-36 bg-white border-2 rounded-xl p-2.5 shadow-xs overflow-auto transition-all ${
                liveEval.passed ? "border-emerald-500 ring-2 ring-emerald-300" : "border-on-surface"
              }`}
            >
              <div
                className="html-live-sandbox w-full font-body text-xs text-slate-800"
                dangerouslySetInnerHTML={{ __html: sanitizedUserHtml }}
              />
            </div>
          ) : isCssBasicsMode ? (
            <div
              id="live-arena"
              className={`arena w-full h-28 sm:h-36 bg-surface-container-lowest border-2 rounded-xl p-3 shadow-xs overflow-auto flex items-center justify-center transition-all ${
                liveEval.passed ? "border-emerald-500 ring-2 ring-emerald-300" : "border-on-surface"
              }`}
            >
              {challengeId === "css-basics-12-boss-fight" ? (
                <span
                  className="badge transition-all inline-block font-mono text-xs font-bold"
                  style={itemStyles["box"] || arenaStyle}
                >
                  🔔 3 Pesan Baru
                </span>
              ) : (
                <div
                  className="box transition-all w-full max-w-xs text-center font-body p-3 bg-white text-slate-800 border border-slate-200 rounded-lg shadow-xs"
                  style={itemStyles["box"] || arenaStyle}
                >
                  <h3 className="font-bold text-sm">Belajar CSS</h3>
                  <p className="text-xs text-slate-600 mt-1">Menguasai box model dan styling visual.</p>
                </div>
              )}
            </div>
          ) : (
            <div
              id="live-arena"
              className={`arena w-full h-28 sm:h-36 bg-surface-container-lowest border-2 rounded-xl p-2 shadow-xs overflow-hidden transition-all relative ${
                liveEval.passed ? "border-emerald-500 ring-2 ring-emerald-300" : "border-on-surface"
              }`}
              style={arenaStyle}
            >
              {Array.from({ length: itemsCount }).map((_, i) => {
                const color = palette[i % palette.length];
                const label = itemLabels[i] || `Permen ${i + 1}`;
                const itemSpecificStyle = itemStyles[`item-${i + 1}`] || {};

                return (
                  <div
                    key={i}
                    style={itemSpecificStyle}
                    className={`permen-${i + 1} card-${i + 1} rounded-xl border-2 border-on-surface flex flex-col items-center justify-center shadow-xs transition-all duration-200 ${
                      color.bg
                    } ${
                      isLevel10
                        ? "w-[44%] min-h-[3rem] p-1"
                        : itemsCount > 4
                        ? "w-10 h-10 p-0.5"
                        : "w-12 h-12 p-1"
                    }`}
                  >
                    <span className={itemsCount > 4 ? "text-xs" : "text-base"}>
                      {color.emoji}
                    </span>
                    <span className="text-[9px] font-bold font-mono text-on-surface text-center truncate max-w-full">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. CLEAN CODE CHIPS (Minimalist, Diverse & Never putting key at index 0) */}
        {shuffledHelpers && shuffledHelpers.length > 0 && (
          <div className="px-2 py-1 flex flex-wrap gap-1 bg-surface-container-lowest border-b border-outline-variant shrink-0 max-h-16 overflow-y-auto">
            {shuffledHelpers.map((snippet) => {
              const active = isHelperActive(snippet, cssCode);
              return (
                <button
                  key={snippet}
                  onClick={() => handleToggleHelper(snippet)}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1 shrink-0 ${
                    active
                      ? "bg-primary text-white border-2 border-primary font-bold shadow-xs"
                      : "bg-surface-container-high border border-on-surface text-on-surface font-semibold hover:border-primary shadow-xs"
                  }`}
                >
                  <span className="text-[9px] opacity-75">{active ? "✓" : "+"}</span>
                  <span>{snippet}</span>
                </button>
              );
            })}
          </div>
        )}


        {/* 4. COMPACT CODE EDITOR */}
        <div className="flex-1 p-2 flex flex-col min-h-[80px] max-h-[140px] bg-surface-container-lowest">
          <div className="rounded-xl border-2 border-on-surface overflow-hidden bg-[#1e1e2e] flex flex-col flex-1 shadow-xs">
            <div className="bg-[#181825] px-2.5 py-1 border-b border-[#313244] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-[#a6adc8] ml-1">
                  {isHtmlMode ? "index.html" : "style.css"}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-[#a6adc8] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 p-2 bg-transparent text-[#cdd6f4] font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"
              placeholder={isHtmlMode ? "<!-- Tulis tag HTML di sini -->" : ".arena { display: flex; ... }"}
            />
          </div>
        </div>

        {/* 5. BOTTOM ACTION BAR (Success / Next / Status) */}
        <div className="p-2 bg-surface-container border-t-2 border-on-surface shrink-0">
          {liveEval.passed ? (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-headline font-black text-emerald-950 truncate">
                    Target Berhasil Dicapai!
                  </span>
                  {earnedXpInfo?.earnedXp && earnedXpInfo.earnedXp > 0 && (
                    <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded font-mono font-black text-[10px] shrink-0">
                      +{earnedXpInfo.earnedXp} XP
                    </span>
                  )}
                </div>
                {isClassCompleted || challenge?.order_index === 10 ? (
                  <Link href="/dashboard">
                    <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-headline font-black text-xs border-2 border-on-surface shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0">
                      <span>Tamat! Dashboard</span>
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={handleNextLevel}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-black text-xs border-2 border-on-surface shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>Lanjut</span>
                    <Rocket className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {saveError && (
                <div className="p-1.5 bg-red-100 border border-red-500 rounded-lg flex items-center justify-between text-[11px] text-red-950 font-bold gap-1">
                  <span>{saveError}</span>
                  <button
                    onClick={() => saveProgress()}
                    disabled={isSaving}
                    className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSaving ? "animate-spin" : ""}`} />
                    <span>Coba Lagi</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-medium text-on-surface">Ubah kode atau pilih chip di atas</span>
              </div>
              {challenge?.hint && (
                <button
                  onClick={() => setShowTheoryModal(true)}
                  className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-secondary" />
                  <span>Petunjuk</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP WORKSPACE (3 Columns: Mission | Arena | Editor)  */}
      {/* ======================================================== */}
      <div className="hidden lg:grid lg:grid-cols-12 flex-1 gap-0 overflow-hidden">
        {/* PANEL 1: INSTRUCTIONS & VISUAL TARGET GOAL (4 Cols) */}
        <div className="lg:col-span-4 border-r-2 border-on-surface p-4 sm:p-6 bg-surface-container-lowest overflow-y-auto space-y-6">
          {/* Mission Box (Soal Dinamis dari API) */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed border border-primary text-primary font-headline font-black text-xs">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span>Misi Tantangan (+{challenge?.xp_reward} XP)</span>
            </div>
            <h2 className="font-display font-black text-xl text-on-surface">
              {challenge?.title}
            </h2>
            <div className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
              {challenge?.instruction}
            </div>
          </div>

          {/* Materi & Konsep Teori (Dinamis dari API) */}
          {challenge?.theory && (
            <div className="p-4 bg-primary-fixed/20 border-2 border-primary/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs font-headline font-black uppercase tracking-wider text-primary">
                  Materi &amp; Teori Pembelajaran
                </span>
              </div>
              <p className="text-xs text-on-surface font-medium leading-relaxed whitespace-pre-line pl-1">
                {challenge.theory}
              </p>
            </div>
          )}

          {/* Hint Dropdown */}
          <div className="pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-secondary" />
              <span>{showHint ? "Sembunyikan Petunjuk" : "Butuh Bantuan? Lihat Petunjuk"}</span>
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-secondary-fixed/30 border border-secondary rounded-xl text-xs text-on-surface font-medium leading-relaxed">
                {challenge?.hint ||
                  "Gunakan display: flex; justify-content: center; align-items: center;"}
              </div>
            )}
          </div>
        </div>

        {/* PANEL 2: INTERACTIVE LIVE CANVAS (4 Cols) */}
        <div className="lg:col-span-4 border-r-2 border-on-surface p-4 sm:p-6 bg-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline font-black text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Arena Koding</span>
              </span>
            </div>

            {/* LIVE ARENA CONTAINER - Directly reacts to user's HTML / CSS */}
            {isHtmlMode ? (
              <div
                id="live-arena"
                className={`arena w-full min-h-[11rem] sm:min-h-[18rem] bg-white border-4 rounded-2xl p-4 sm:p-5 shadow-brutal overflow-auto transition-all relative ${
                  liveEval.passed
                    ? "border-emerald-500 ring-4 ring-emerald-300/60"
                    : "border-on-surface"
                }`}
              >
                <div
                  className="html-live-sandbox w-full font-body text-slate-800"
                  dangerouslySetInnerHTML={{ __html: sanitizedUserHtml }}
                />
              </div>
            ) : isCssBasicsMode ? (
              <div
                id="live-arena"
                className={`arena w-full h-44 sm:h-60 lg:h-80 bg-surface-container-lowest border-4 rounded-2xl p-6 shadow-brutal overflow-auto flex items-center justify-center transition-all ${
                  liveEval.passed
                    ? "border-emerald-500 ring-4 ring-emerald-300/60"
                    : "border-on-surface"
                }`}
              >
                {challengeId === "css-basics-12-boss-fight" ? (
                  <span
                    className="badge transition-all inline-block font-mono text-sm font-bold"
                    style={itemStyles["box"] || arenaStyle}
                  >
                    🔔 3 Pesan Baru
                  </span>
                ) : (
                  <div
                    className="box transition-all w-full max-w-sm text-center font-body p-5 bg-white text-slate-800 border-2 border-slate-200 rounded-xl shadow-xs"
                    style={itemStyles["box"] || arenaStyle}
                  >
                    <h3 className="font-bold text-base">Belajar CSS Dasar</h3>
                    <p className="text-sm text-slate-600 mt-2">Menguasai box model, perataan, warna, dan tipografi.</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                id="live-arena"
                className={`arena w-full h-44 sm:h-60 lg:h-80 bg-surface-container-lowest border-4 rounded-2xl p-4 shadow-brutal overflow-auto transition-all relative ${
                  liveEval.passed
                    ? "border-emerald-500 ring-4 ring-emerald-300/60"
                    : "border-on-surface"
                }`}
                style={arenaStyle}
              >
                {Array.from({ length: itemsCount }).map((_, i) => {
                  const color = palette[i % palette.length];
                  const label = itemLabels[i] || `Permen ${i + 1}`;
                  const itemSpecificStyle = itemStyles[`item-${i + 1}`] || {};

                  return (
                    <div
                      key={i}
                      style={itemSpecificStyle}
                      className={`permen-${i + 1} card-${
                        i + 1
                      } rounded-2xl border-3 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm transition-all duration-200 ${
                        color.bg
                      } ${
                        isLevel10
                          ? "w-[46%] min-h-[5rem] p-2"
                          : itemsCount > 4
                          ? "w-14 h-14 p-1"
                          : "w-20 h-20 p-2"
                      }`}
                    >
                      <span
                        className={
                          itemsCount > 4 ? "text-lg" : "text-2xl"
                        }
                      >
                        {color.emoji}
                      </span>
                      <span className="text-[10px] font-bold font-mono text-on-surface text-center truncate max-w-full">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3: CODE EDITOR & REAL-TIME ACTION (4 Cols) */}
        <div className="lg:col-span-4 p-3.5 sm:p-6 bg-surface-container-lowest flex flex-col justify-between relative overflow-hidden">
          {/* Localized Mini Confetti Canvas */}
          <canvas
            ref={confettiCanvasRef}
            className="pointer-events-none absolute inset-0 z-30 w-full h-full"
          />
          <div className="space-y-3">
            {/* Clean Code Chips Bar (Minimalist, Diverse & Never putting key at index 0) */}
            {shuffledHelpers && shuffledHelpers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 py-0.5">
                {shuffledHelpers.map((snippet) => {
                  const active = isHelperActive(snippet, cssCode);

                  return (
                    <button
                      key={snippet}
                      onClick={() => handleToggleHelper(snippet)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                        active
                          ? "bg-primary text-white border-2 border-primary font-bold shadow-xs"
                          : "bg-surface-container-high border border-on-surface text-on-surface font-semibold hover:border-primary shadow-xs"
                      }`}
                    >
                      <span className="text-[10px] opacity-75">{active ? "✓" : "+"}</span>
                      <span>{snippet}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="font-headline font-black text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {isHtmlMode ? "HTML Editor" : "CSS Editor"}
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-1 cursor-pointer"
                title="Reset kode awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Code Input Area */}
            <div className="rounded-2xl border-3 border-on-surface overflow-hidden bg-[#1e1e2e] shadow-brutal">
              <div className="bg-[#181825] px-3 py-1.5 border-b border-[#313244] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-mono text-[#a6adc8] ml-1.5">
                    {isHtmlMode ? "index.html" : "style.css"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6c7086]">Live Eval</span>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                rows={8}
                spellCheck={false}
                className="w-full p-3 sm:p-4 bg-transparent text-[#cdd6f4] font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                placeholder={isHtmlMode ? "<!-- Tulis tag HTML di sini -->" : ".arena { display: flex; ... }"}
              />
            </div>
          </div>

          {/* Bottom Action Area: Appears when target is achieved */}
          {liveEval.passed && (
            <div className="pt-4 mt-4 border-t border-outline-variant space-y-2.5 animate-in fade-in duration-300">
              <div className="p-3.5 bg-emerald-100 border-2 border-emerald-600 rounded-2xl flex items-center justify-between text-xs font-headline font-black text-emerald-950 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span>Sempurna! Target berhasil dicapai.</span>
                    {earnedXpInfo?.leveledUp && (
                      <span className="block text-[11px] font-bold text-amber-800 mt-0.5">
                        🎉 Selamat! Naik ke Level {earnedXpInfo.level} ({earnedXpInfo.rankTitle})
                      </span>
                    )}
                  </div>
                </div>
                {earnedXpInfo?.earnedXp && earnedXpInfo.earnedXp > 0 && (
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-mono font-black text-xs shrink-0 shadow-xs">
                    +{earnedXpInfo.earnedXp} XP
                  </span>
                )}
              </div>

              {saveError && (
                <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl flex items-center justify-between text-xs text-red-950 font-bold gap-2">
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{saveError}</span>
                  </div>
                  <button
                    onClick={() => saveProgress()}
                    disabled={isSaving}
                    className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSaving ? "animate-spin" : ""}`} />
                    <span>{isSaving ? "Menyimpan..." : "Coba Simpan"}</span>
                  </button>
                </div>
              )}

              {!user && (
                <div className="p-2.5 bg-amber-100 border border-amber-400 rounded-xl text-[11px] text-amber-950 font-medium">
                  💡 Kamu sedang belajar sebagai Tamu.{" "}
                  <Link href={`/login?redirect=/classes/${classId}/learn/${challengeId}`} className="font-bold underline text-amber-900">
                    Login di sini
                  </Link>{" "}
                  agar poin XP dan rekor streak tersimpan di profilmu.
                </div>
              )}

              {isClassCompleted || challenge?.order_index === 10 ? (
                <Link href="/dashboard" className="block w-full">
                  <button className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-headline font-black text-base border-3 border-on-surface shadow-brutal flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition-all">
                    <span>🏆 Selamat! Kamu Menamatkan Kelas (Ke Dashboard)</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleNextLevel}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-black text-base border-3 border-on-surface shadow-brutal flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition-all"
                >
                  <span>Lanjut ke Level Berikutnya</span>
                  <Rocket className="w-5 h-5" />
                </button>
              )}

              <Link
                href={`/classes/${classId}`}
                className="block w-full text-center py-1 text-xs font-bold text-on-surface-variant hover:underline"
              >
                Kembali ke Silabus Kelas
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Theory & Hint Modal / Drawer (Responsive Bottom Sheet on Mobile) */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border-t-3 sm:border-3 border-on-surface rounded-t-3xl sm:rounded-3xl p-5 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-brutal space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-display font-black text-base text-on-surface">
                  Materi &amp; Teori Pembelajaran
                </h3>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {challenge?.theory && (
              <p className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed whitespace-pre-line">
                {challenge.theory}
              </p>
            )}

            {challenge?.hint && (
              <div className="p-3 bg-secondary-fixed/30 border border-secondary rounded-xl text-xs text-on-surface font-medium leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-secondary">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Petunjuk Tantangan:</span>
                </div>
                <p>{challenge.hint}</p>
              </div>
            )}

            <button
              onClick={() => setShowTheoryModal(false)}
              className="w-full py-3 rounded-xl bg-primary text-white font-headline font-black text-xs border-2 border-on-surface shadow-xs text-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              Paham, Lanjut Koding
            </button>
          </div>
        </div>
      )}


      {/* Session Expired Modal */}
      {sessionExpired && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border-3 border-on-surface rounded-3xl p-6 max-w-sm w-full shadow-brutal space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-700">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="font-display font-black text-lg text-on-surface">
              Sesi Login Anda Telah Habis
            </h3>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Sesi login Anda telah berakhir. Silakan login kembali untuk menyimpan progres level, poin XP, dan rekor streak Anda.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/login?redirect=/classes/${classId}/learn/${challengeId}`}
                className="w-full py-3 rounded-xl bg-primary text-white font-headline font-black text-sm border-2 border-on-surface shadow-xs text-center hover:opacity-90 transition-opacity"
              >
                Login Kembali
              </Link>
              <button
                onClick={() => setSessionExpired(false)}
                className="w-full py-2.5 rounded-xl border border-outline font-headline font-bold text-xs text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                Tetap Belajar (Mode Tamu)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengePlaygroundPage({
  params,
}: {
  params: Promise<{ id: string; challengeId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="font-headline font-bold text-sm text-on-surface">
            Mempersiapkan Workspace Interaktif...
          </p>
        </div>
      }
    >
      <ChallengePlaygroundContent params={params} />
    </Suspense>
  );
}
