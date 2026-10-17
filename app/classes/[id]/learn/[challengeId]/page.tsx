"use client";

import React, { useState, useEffect, use, Suspense } from "react";
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
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface ChallengeData {
  id: string;
  class_id: string;
  title: string;
  instruction: string;
  hint: string | null;
  xp_reward: number;
  initial_state: string;
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
  } | null>(null);

  // Load challenge info
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/classes/${classId}`);
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

  // Extract CSS inside .arena { ... } for live preview
  const parseUserStyles = (): React.CSSProperties => {
    try {
      const match = cssCode.match(/\.arena\s*\{([^}]*)\}/i) || [null, cssCode];
      const declarations = match[1] || "";
      const styleObj: Record<string, string> = {};

      declarations.split(";").forEach((rule) => {
        const [prop, val] = rule.split(":");
        if (prop && val) {
          const camelProp = prop
            .trim()
            .replace(/-([a-z])/g, (_, g) => g.toUpperCase());
          styleObj[camelProp] = val.trim();
        }
      });

      return styleObj as React.CSSProperties;
    } catch {
      return {};
    }
  };

  const userStyles = parseUserStyles();

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
            <span className="text-[11px] font-bold text-secondary tracking-widest uppercase">
              MODUL INTERAKTIF
            </span>
            <h1 className="font-display font-black text-sm sm:text-base text-on-surface truncate max-w-xs sm:max-w-md">
              {challenge?.title || "Level 1"}
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
            <div className="w-full h-36 bg-white rounded-xl border-2 border-dashed border-emerald-600 p-2 flex items-center justify-center gap-3 overflow-hidden shadow-inner">
              <div className="w-16 h-16 rounded-xl bg-pink-100 border-2 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm">
                <span className="text-xl">🍬</span>
                <span className="text-[9px] font-bold font-mono">Item 1</span>
              </div>
              <div className="w-16 h-16 rounded-xl bg-purple-100 border-2 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm">
                <span className="text-xl">🍭</span>
                <span className="text-[9px] font-bold font-mono">Item 2</span>
              </div>
              <div className="w-16 h-16 rounded-xl bg-amber-100 border-2 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm">
                <span className="text-xl">🍫</span>
                <span className="text-[9px] font-bold font-mono">Item 3</span>
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant font-medium leading-tight">
              💡 <em>Catatan:</em> Solusi kamu fleksibel! Yang terpenting elemen tersusun horizontal dan berada di tengah arena.
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
                {challenge?.hint || "Gunakan display: flex; justify-content: center; align-items: center;"}
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
              className="w-full h-80 bg-surface-container-lowest border-4 border-on-surface rounded-2xl p-4 shadow-brutal overflow-auto transition-all relative"
              style={userStyles}
            >
              <div className="w-20 h-20 rounded-2xl bg-pink-200 border-3 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm transition-all duration-300">
                <span className="text-2xl animate-bounce">🍬</span>
                <span className="text-[10px] font-bold font-mono text-on-surface">
                  Permen 1
                </span>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-purple-200 border-3 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm transition-all duration-300">
                <span className="text-2xl">🍭</span>
                <span className="text-[10px] font-bold font-mono text-on-surface">
                  Permen 2
                </span>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-amber-200 border-3 border-on-surface flex flex-col items-center justify-center shadow-brutal-sm transition-all duration-300">
                <span className="text-2xl">🍫</span>
                <span className="text-[10px] font-bold font-mono text-on-surface">
                  Permen 3
                </span>
              </div>
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
                "align-items: center",
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
              <Link href={`/classes/${classId}`} className="block w-full">
                <button className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-black text-base border-3 border-on-surface shadow-brutal flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 transition-all">
                  <span>Kembali ke Silabus Kelas</span>
                  <Rocket className="w-5 h-5" />
                </button>
              </Link>
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
