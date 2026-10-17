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
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface ChallengeData {
  id: string;
  class_id: string;
  title: string;
  difficulty?: string;
  order_index?: number;
  instruction: string;
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

  // Load challenge info
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setHasSavedPass(false);
      setNextChallengeId(null);
      setIsClassCompleted(false);

      try {
        const res = await fetch(`/api/classes/${classId}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.challenges) {
            const found = json.data.challenges.find(
              (c: any) => c.id === challengeId
            );
            if (found) {
              setChallenge(found);
              setCssCode(
                found.codeSnapshot ||
                  found.initial_state ||
                  `.arena {\n  /* Tulis CSS Flexbox di sini */\n}`
              );
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat tantangan:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId, challengeId]);

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

  // Automatically save progress in the background the moment all goals are fulfilled
  useEffect(() => {
    if (liveEval.passed && !hasSavedPass && user) {
      setHasSavedPass(true);

      fetch(`/api/challenges/${challengeId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cssCode }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.passed) {
            setNextChallengeId(data.nextChallengeId);
            setIsClassCompleted(Boolean(data.isClassCompleted));
            refreshUser();
          }
        })
        .catch((err) => console.error("Error auto-saving progress:", err));
    }
  }, [liveEval.passed, hasSavedPass, user, challengeId, cssCode, refreshUser]);

  const handleInsertHelper = (snippet: string) => {
    setCssCode((prev) => {
      if (prev.includes(".arena {")) {
        return prev.replace(".arena {", `.arena {\n  ${snippet};`);
      }
      return `${prev}\n${snippet};`;
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
                LEVEL {challenge?.order_index || 1} / 10
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
          {/* Mission Box */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed border border-primary text-primary font-headline font-black text-xs">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span>Misi Tantangan (+{challenge?.xp_reward} XP)</span>
            </div>
            <h2 className="font-display font-black text-xl text-on-surface">
              {challenge?.title}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              {challenge?.instruction}
            </p>
          </div>

          {/* VISUAL TARGET BOX */}
          <div className="p-4 bg-surface-container-low border-2 border-on-surface rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-headline font-black text-emerald-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Target Visual Solusi (Contoh Benar)</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                GOAL TARGET
              </span>
            </div>

            {/* Target Canvas Mini Preview */}
            <div
              className="w-full h-40 bg-white rounded-xl border-2 border-dashed border-emerald-600 p-2.5 overflow-hidden shadow-inner transition-all"
              style={{
                display: targetVisual.display || "flex",
                flexDirection: (targetVisual.flexDirection as any) || "row",
                justifyContent: targetVisual.justifyContent || "center",
                alignItems: targetVisual.alignItems || "center",
                flexWrap: (targetVisual.flexWrap as any) || "nowrap",
                gap: targetVisual.gap || "8px",
              }}
            >
              {Array.from({ length: itemsCount }).map((_, i) => {
                const color = palette[i % palette.length];
                const label = itemLabels[i] || `Item ${i + 1}`;

                // Level-specific goal overrides for the visual target
                const itemTargetStyle: React.CSSProperties = {};
                if (isLevel8 && i === 1) {
                  itemTargetStyle.alignSelf = "flex-end";
                }
                if (isLevel9 && i === 2) {
                  itemTargetStyle.order = -1;
                }

                return (
                  <div
                    key={i}
                    style={itemTargetStyle}
                    className={`rounded-lg border-2 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm transition-all ${
                      color.bg
                    } ${
                      isLevel10
                        ? "w-[45%] h-14 p-1"
                        : itemsCount > 4
                        ? "w-11 h-11 p-0.5"
                        : "w-14 h-14 p-1"
                    }`}
                  >
                    <span className={itemsCount > 4 ? "text-sm" : "text-base"}>
                      {color.emoji}
                    </span>
                    <span className="text-[8px] font-bold font-mono text-center truncate max-w-full">
                      {label.replace(/^[^\w]+/, "")}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-on-surface-variant font-medium leading-tight">
              💡 <em>Tujuan:</em>{" "}
              {targetVisual.description ||
                "Ketik kode CSS di editor agar posisi elemen di arena sesuai target."}
            </p>
          </div>

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

            {/* LIVE ARENA CONTAINER - Directly reacts to user's CSS inline styles */}
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


          </div>

          {/* Quick Syntax Pills Helper */}
          <div className="mt-4 pt-4 border-t border-outline-variant">
            <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Ketik Cepat (Klik untuk menyisipkan):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "display: flex",
                "justify-content: center",
                "justify-content: space-between",
                "justify-content: space-around",
                "align-items: center",
                "flex-direction: column",
                "flex-wrap: wrap",
                "gap: 16px",
              ].map((snippet) => (
                <button
                  key={snippet}
                  onClick={() => handleInsertHelper(snippet)}
                  className="px-2.5 py-1 bg-surface-container-lowest border border-on-surface text-[11px] font-mono font-bold rounded-lg shadow-sm hover:bg-primary-fixed hover:text-primary transition-colors cursor-pointer"
                >
                  +{snippet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL 3: CODE EDITOR & REAL-TIME ACTION (4 Cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-surface-container-lowest flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline font-black text-xs uppercase tracking-wider text-on-surface">
                CSS Editor
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
                  style.css
                </span>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                rows={11}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-[#cdd6f4] font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                placeholder=".arena { display: flex; ... }"
              />
            </div>
          </div>

          {/* Bottom Action Area: Appears when target is achieved */}
          {liveEval.passed && (
            <div className="pt-4 mt-4 border-t border-outline-variant space-y-2.5 animate-in fade-in duration-300">
              <div className="p-3.5 bg-emerald-100 border-2 border-emerald-600 rounded-2xl flex items-center gap-2.5 text-xs font-headline font-black text-emerald-950 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Sempurna! Target berhasil dicapai! 🎉</span>
              </div>

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
