"use client";

import React, { useState, useEffect, use, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  Star,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Eye,
  Rocket,
  Loader2,
  Zap,
  Check,
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
  const [evaluating, setEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Result state
  const [result, setResult] = useState<{
    passed: boolean;
    feedback: string[];
    earnedXp?: number;
    newTotalXp?: number;
    nextChallengeId?: string | null;
    isClassCompleted?: boolean;
  } | null>(null);

  // Load challenge info
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setResult(null);
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

  // Handle evaluation
  const handleEvaluate = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menyimpan progress koding.");
      router.push(`/login?redirect=/classes/${classId}/learn/${challengeId}`);
      return;
    }

    setEvaluating(true);
    setResult(null);

    try {
      const res = await fetch(`/api/challenges/${challengeId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cssCode }),
      });

      const data = await res.json();
      setResult({
        passed: data.passed,
        feedback: data.feedback || [data.message],
        earnedXp: data.earnedXp,
        newTotalXp: data.newTotalXp,
        nextChallengeId: data.nextChallengeId,
        isClassCompleted: data.isClassCompleted,
      });

      if (data.passed) {
        refreshUser();
      }
    } catch {
      setResult({
        passed: false,
        feedback: ["Gagal menghubungkan ke server validasi."],
      });
    } finally {
      setEvaluating(false);
    }
  };

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
      setResult(null);
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

  // Scoped CSS generator for the live arena
  const scopedCss = useMemo(() => {
    if (!cssCode) return "";
    return cssCode
      .replace(/\.arena\b/g, "#live-arena")
      .replace(/\.permen-([0-9]+)\b/g, "#live-arena .permen-$1")
      .replace(/\.card-([0-9]+)\b/g, "#live-arena .card-$1");
  }, [cssCode]);

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
      {/* Scoped Dynamic Styles for Live Arena */}
      <style>{`
        #live-arena {
          box-sizing: border-box;
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
            <Flame className="w-4 h-4 text-[#e65100] fill-[#e65100] animate-pulse" />
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
                "Sesuaikan properti CSS flexbox agar tata letak arena cocok dengan target di atas."}
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
                <span>Arena Koding (Preview Langsung)</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                Live Rendering
              </span>
            </div>

            {/* LIVE ARENA CONTAINER */}
            <div
              id="live-arena"
              className="arena w-full h-80 bg-surface-container-lowest border-4 border-on-surface rounded-2xl p-4 shadow-brutal overflow-auto transition-all relative"
            >
              {Array.from({ length: itemsCount }).map((_, i) => {
                const color = palette[i % palette.length];
                const label = itemLabels[i] || `Permen ${i + 1}`;

                return (
                  <div
                    key={i}
                    className={`permen-${i + 1} card-${
                      i + 1
                    } rounded-2xl border-3 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm transition-all duration-300 ${
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
                      className={`animate-bounce ${
                        itemsCount > 4 ? "text-lg" : "text-2xl"
                      }`}
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

        {/* PANEL 3: CODE EDITOR & SUBMISSION (4 Cols) */}
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
                rows={10}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-[#cdd6f4] font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                placeholder=".arena { ... }"
              />
            </div>

            {/* Evaluation Result Feedback Banner */}
            {result && (
              <div
                className={`p-4 rounded-2xl border-2 text-xs font-bold space-y-1.5 animate-in fade-in slide-in-from-bottom-2 ${
                  result.passed
                    ? "bg-emerald-100 border-emerald-600 text-emerald-950"
                    : "bg-red-100 border-red-500 text-red-950"
                }`}
              >
                <div className="flex items-center gap-2 font-headline font-black text-sm">
                  {result.passed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Level Berhasil Ditaklukkan! 🎉</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span>Belum Tepat, Coba Lagi!</span>
                    </>
                  )}
                </div>
                {result.feedback.map((f, i) => (
                  <p key={i} className="pl-7">
                    {f}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Submit Action Button */}
          <div className="pt-4 mt-4 border-t border-outline-variant space-y-2">
            {result?.passed ? (
              <div className="space-y-2">
                {result.nextChallengeId ? (
                  <button
                    onClick={() => {
                      setResult(null);
                      router.push(
                        `/classes/${classId}/learn/${result.nextChallengeId}`
                      );
                    }}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-black text-base border-3 border-on-surface shadow-brutal flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition-all"
                  >
                    <span>Lanjut ke Level Berikutnya</span>
                    <Rocket className="w-5 h-5" />
                  </button>
                ) : (
                  <Link href="/dashboard" className="block w-full">
                    <button className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-headline font-black text-base border-3 border-on-surface shadow-brutal flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition-all">
                      <span>🏆 Selamat! Kelas Selesai (Ke Dashboard)</span>
                    </button>
                  </Link>
                )}
                <Link
                  href={`/classes/${classId}`}
                  className="block w-full text-center py-1.5 text-xs font-bold text-on-surface-variant hover:underline"
                >
                  Kembali ke Silabus Kelas
                </Link>
              </div>
            ) : (
              <button
                onClick={handleEvaluate}
                disabled={evaluating}
                className="w-full py-4 rounded-2xl bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-base border-3 border-on-surface shadow-brutal flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition-all disabled:opacity-60"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengevaluasi Jawaban...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Periksa Jawaban (Cek Solusi)</span>
                  </>
                )}
              </button>
            )}
          </div>
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
