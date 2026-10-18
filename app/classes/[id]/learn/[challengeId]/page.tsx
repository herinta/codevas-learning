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
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

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
  display: /^(flex|inline-flex|grid|block|none)$/i,
  justifyContent: /^(center|space-between|space-around|space-evenly|flex-start|flex-end|start|end|left|right)$/i,
  alignItems: /^(center|flex-start|flex-end|stretch|baseline|start|end)$/i,
  flexDirection: /^(row|row-reverse|column|column-reverse)$/i,
  flexWrap: /^(wrap|nowrap|wrap-reverse)$/i,
  gap: /^(\d+(\.\d+)?(px|rem|em|%)?(\s+\d+(\.\d+)?(px|rem|em|%)?)?)$/i,
  alignSelf: /^(auto|flex-start|flex-end|center|baseline|stretch|start|end)$/i,
  order: /^-?\d+$/i,
};

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
        // While user is mid-keystroke (e.g. typing 'cent'), ignore partial invalid value to prevent flickering
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

      if (selector.includes(".arena") || selector === "arena") {
        Object.assign(arenaStyle, declObj);
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

  // Auto-sync state when passed
  const [hasSavedPass, setHasSavedPass] = useState(false);
  const [nextChallengeId, setNextChallengeId] = useState<string | null>(null);
  const [isClassCompleted, setIsClassCompleted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
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

  // Sanitized HTML for safe real-time 60 FPS arena preview
  const sanitizedUserHtml = useMemo(() => {
    if (!cssCode) return "";
    return cssCode
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
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
      .replace(/\.arena\b/g, "#live-arena")
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

  // Mini Confetti canvas ref localized strictly within the right panel
  const confettiCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const fireMiniConfetti = React.useCallback(() => {
    const canvas = confettiCanvasRef.current;
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
        .html-live-sandbox div::before {
          content: "📦 <div> (Kardus Container)";
          display: block;
          font-size: 9px;
          font-family: monospace;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 6px;
        }
        .html-live-sandbox section {
          border: 2px dashed #8b5cf6;
          background-color: rgba(245, 243, 255, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox section::before {
          content: "🏛️ <section> (Semantik Container)";
          display: block;
          font-size: 9px;
          font-family: monospace;
          font-weight: 700;
          color: #7c3aed;
          margin-bottom: 6px;
        }
        .html-live-sandbox form {
          border: 2px dashed #10b981;
          background-color: rgba(236, 253, 245, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox form::before {
          content: "📋 <form> (Form Wrapper)";
          display: block;
          font-size: 9px;
          font-family: monospace;
          font-weight: 700;
          color: #059669;
          margin-bottom: 6px;
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
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-300 border-2 border-on-surface rounded-full shadow-sm"
            title={`Level ${user?.level || 1} • ${user?.rank_title || 'Siswa Pemula'}`}
          >
            <span className="text-xs font-mono font-black text-on-surface">
              Lv.{user?.level || 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#fff3e0] border-2 border-on-surface rounded-full shadow-sm">
            <Flame className="w-4 h-4 text-[#e65100] fill-[#e65100]" />
            <span className="text-xs font-headline font-black text-on-surface">
              {user ? `${(user as any).streak_days || 1} Hari` : "1 Hari"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-sm">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-xs font-headline font-black text-secondary">
              {user ? `${user.xp_points} XP` : "50 XP"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid: 3 Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* PANEL 1: INSTRUCTIONS & VISUAL TARGET GOAL (4 Cols) */}
        <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface p-5 sm:p-6 bg-surface-container-lowest overflow-y-auto space-y-6">
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
        <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface p-5 sm:p-6 bg-surface-container flex flex-col justify-between">
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
                className={`arena w-full min-h-[19rem] bg-white border-4 rounded-2xl p-5 shadow-brutal overflow-auto transition-all relative ${
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
            ) : (
              <div
                id="live-arena"
                className={`arena w-full h-80 bg-surface-container-lowest border-4 rounded-2xl p-4 shadow-brutal overflow-auto transition-all relative ${
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

          {/* Quick Syntax Pills Helper (Dinamis dari API & Toggleable) */}
          {challenge?.syntax_helpers && challenge.syntax_helpers.length > 0 && (() => {
            const isTutorialLevel = (challenge?.order_index || 1) <= 3;

            return (
              <div className="mt-4 pt-4 border-t border-outline-variant">
                {/* Onboarding Notice for Levels 1-3 */}
                {isTutorialLevel && !liveEval.passed && (
                  <div className="mb-2.5 p-2.5 bg-primary/10 border-2 border-primary/40 rounded-xl flex items-center gap-2 text-[11px] font-bold text-primary animate-pulse">
                    <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                    <span>Tutorial Level {challenge?.order_index || 1}: Teks pilihan jawaban benar sedang berkedip di bawah! Klik untuk langsung mencoba.</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Ketik Cepat (Klik pasang / klik lagi untuk hapus):
                  </span>
                  {isTutorialLevel && !liveEval.passed && (
                    <span className="text-[10px] font-mono font-black text-primary bg-primary/15 px-2 py-0.5 rounded-full border border-primary/30">
                      ONBOARDING MODE
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {challenge.syntax_helpers.map((snippet) => {
                    const active = isHelperActive(snippet, cssCode);
                    const cleanSnippet = snippet.trim().toLowerCase();
                    const cleanProp = cleanSnippet.split(":")[0]?.trim();

                    // Check if this snippet is the correct tutorial choice for level 1-3
                    const isTutorialChoice =
                      isTutorialLevel &&
                      !active &&
                      !liveEval.passed &&
                      (liveEval.goals.some(
                        (g) =>
                          !g.passed &&
                          (cleanSnippet.includes(g.label.toLowerCase()) ||
                            g.label.toLowerCase().includes(cleanSnippet) ||
                            (cleanProp && g.label.toLowerCase().includes(cleanProp)))
                      ) ||
                        (Boolean(challenge?.hint) &&
                          challenge.hint!.toLowerCase().includes(cleanSnippet)));

                    return (
                      <button
                        key={snippet}
                        onClick={() => handleToggleHelper(snippet)}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
                          active
                            ? "bg-primary text-white border-2 border-primary shadow-xs font-black ring-2 ring-primary/30"
                            : isTutorialChoice
                            ? "blinking-tutorial-choice ring-2 ring-primary ring-offset-1 bg-primary/20 text-primary border-2 border-primary font-black shadow-md"
                            : "bg-surface-container-lowest border border-on-surface text-on-surface font-bold hover:bg-primary-fixed hover:text-primary shadow-xs"
                        }`}
                        title={
                          active
                            ? `Klik untuk membatalkan / menghapus "${snippet}"`
                            : isTutorialChoice
                            ? `Pilihan Tutorial Onboarding: Klik untuk memasang "${snippet}"`
                            : `Klik untuk menyisipkan "${snippet}"`
                        }
                      >
                        <span className="text-[10px] font-black">
                          {active ? "✕" : isTutorialChoice ? "✨" : "+"}
                        </span>
                        <span>{snippet}</span>
                        {isTutorialChoice && (
                          <span className="ml-1 text-[8px] font-sans font-black bg-primary text-white px-1 py-0.2 rounded uppercase tracking-wider">
                            TUTORIAL
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* PANEL 3: CODE EDITOR & REAL-TIME ACTION (4 Cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-surface-container-lowest flex flex-col justify-between relative overflow-hidden">
          {/* Localized Mini Confetti Canvas (Sebelah kanan saja, tidak full layar) */}
          <canvas
            ref={confettiCanvasRef}
            className="pointer-events-none absolute inset-0 z-30 w-full h-full"
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline font-black text-xs uppercase tracking-wider text-on-surface">
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
              <div className="bg-[#181825] px-3.5 py-2 border-b border-[#313244] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-mono text-[#a6adc8] ml-2">
                  {isHtmlMode ? "index.html" : "style.css"}
                </span>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                rows={11}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-[#cdd6f4] font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
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

              {/* Offline / Save Error Alert with Retry button */}
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

              {/* Guest User Reminder */}
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
                  onClick={() => {
                    if (nextChallengeId) {
                      router.push(
                        `/classes/${classId}/learn/${nextChallengeId}`
                      );
                    } else {
                      router.push(`/classes/${classId}`);
                    }
                  }}
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
