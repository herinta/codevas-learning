"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw, BookOpen } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useDailyTargetTracker } from "@/lib/hooks/use-daily-target-tracker";

import { ChallengeData, EarnedXpInfo } from "./types";
import { evaluateLiveGoals } from "./evaluator";
import {
  parseUserStyles,
  getShuffledHelpers,
  toggleHelperSnippet,
  sanitizeUserHtml,
} from "./style-parser";
import { useMiniConfetti } from "./use-mini-confetti";
import { LearnHeader } from "./learn-header";
import { MissionPanel } from "./mission-panel";
import { LiveArena } from "./live-arena";
import { CodeEditorPanel } from "./code-editor-panel";
import { CompletionActionBar } from "./completion-action-bar";
import { TheoryModal } from "./theory-modal";
import { TargetGoalPanel } from "./target-goal-panel";
import { SessionExpiredModal } from "./session-expired-modal";

interface LearnWorkspaceProps {
  classId: string;
  challengeId: string;
}

export const LearnWorkspace: React.FC<LearnWorkspaceProps> = ({
  classId,
  challengeId,
}) => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  // Learning states
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [cssCode, setCssCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Progression & Save states
  const [hasSavedPass, setHasSavedPass] = useState(false);
  const [nextChallengeId, setNextChallengeId] = useState<string | null>(null);
  const [isClassCompleted, setIsClassCompleted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [earnedXpInfo, setEarnedXpInfo] = useState<EarnedXpInfo | null>(null);

  // Daily target tracker active only in workspace
  const dailyTarget = useDailyTargetTracker({ activeMode: true });

  // 1. Load challenge info dynamically from API
  const loadData = useCallback(async () => {
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
          const found: ChallengeData = json.data;
          setChallenge(found);
          // Otomatis munculkan popup materi/teori setiap kali ada materi
          if (found.theory || found.concept_demo || found.target_visual?.concept_demo) {
            setShowTheoryModal(true);
          }
          const rawCode =
            found.codeSnapshot ||
            found.initial_state ||
            (found.class_id === "html-architecture" || found.id.startsWith("html-")
              ? ""
              : found.class_id === "css-grid" || found.id.startsWith("grid-") || found.id.startsWith("gr-")
              ? `.grid-arena {\n  display: grid;\n}`
              : found.id === "flexbox-12-boss-modern-navbar" || found.id === "fb-12"
              ? `.navbar {\n  \n}`
              : `.arena {\n  \n}`);

          // Normalize literal \n, unescape quotes, and strip all instruction comments from editor
          const cleanCode = rawCode
            .replace(/\\r\\n/g, "\n")
            .replace(/\\n/g, "\n")
            .replace(/\r\n/g, "\n")
            .replace(/<!--[\s\S]*?-->\s*/g, "")
            .replace(/\/\*[\s\S]*?\*\/\s*/g, "")
            .replace(/\\"/g, '"')
            .replace(/[ \t]+$/gm, "")
            .trim();

          setCssCode(cleanCode);
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

  // Deterministically shuffled helpers so the correct answer is NEVER placed at index 0
  const shuffledHelpers = useMemo(() => {
    return getShuffledHelpers(challenge?.syntax_helpers, challenge?.id || challengeId);
  }, [challenge?.syntax_helpers, challenge?.id, challengeId]);

  // Sanitized HTML for safe real-time 60 FPS arena preview
  const sanitizedUserHtml = useMemo(() => {
    const unescaped = (cssCode || "")
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n");
    return sanitizeUserHtml(unescaped);
  }, [cssCode]);

  // Real-time Live Evaluation as user types (instant reactivity)
  const liveEval = useMemo(() => {
    return evaluateLiveGoals(challengeId, cssCode);
  }, [challengeId, cssCode]);

  // Real-time Style Parsing for the Live Arena
  const parsedStyles = useMemo(() => {
    return parseUserStyles(cssCode);
  }, [cssCode]);

  // Confetti Animation Hook
  const { confettiCanvasRef, confettiCanvasMobileRef } = useMiniConfetti(liveEval.passed);

  // 2. Save progress on completion
  const saveProgress = useCallback(async () => {
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
  }, [user, isSaving, challengeId, cssCode, challenge?.xp_reward, refreshUser]);

  // Automatically save progress in the background the moment all goals are fulfilled
  useEffect(() => {
    if (liveEval.passed && !hasSavedPass && user && !saveError) {
      saveProgress();
    }
  }, [liveEval.passed, hasSavedPass, user, saveError, saveProgress]);

  // Actions
  const handleSetCssCode = useCallback(
    (codeOrUpdater: string | ((prev: string) => string)) => {
      setCssCode(codeOrUpdater);
    },
    []
  );

  const handleToggleHelper = (snippet: string) => {
    handleSetCssCode((prev) => toggleHelperSnippet(prev, snippet));
  };

  const handleReset = () => {
    if (challenge) {
      const cleanInitial = (challenge.initial_state || "")
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\r\n/g, "\n")
        .replace(/<!--[\s\S]*?-->\s*/g, "")
        .replace(/\/\*[\s\S]*?\*\/\s*/g, "")
        .replace(/\\"/g, '"')
        .replace(/[ \t]+$/gm, "")
        .trim();
      setCssCode(cleanInitial);
      setHasSavedPass(false);
    }
  };

  const handleNextLevel = () => {
    if (nextChallengeId) {
      router.push(`/classes/${classId}/learn/${nextChallengeId}`);
    } else {
      router.push(`/classes/${classId}`);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#EF4444] animate-spin" />
        <p className="font-display font-black text-sm text-slate-900">
          Memuat Workspace Pembelajaran...
        </p>
      </div>
    );
  }

  // Error Screen
  if (loadError || !challenge) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-100 border-3 border-slate-900 flex items-center justify-center text-red-600 shadow-[0_4px_0_#0f172a]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-display font-black text-slate-900">
          {loadError ? "Gagal Memuat Tantangan" : "Tantangan Tidak Ditemukan"}
        </h2>
        <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
          {loadError ||
            "Soal tantangan tidak ditemukan di server. Periksa koneksi internet Anda atau kembali ke silabus kelas."}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => loadData()}
            className="px-4 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Muat Ulang</span>
          </button>
          <Link
            href={`/classes/${classId}`}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white font-display font-black text-xs hover:bg-slate-50 shadow-[0_2px_0_#0f172a] text-slate-900"
          >
            Kembali ke Kelas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col">
      {/* 1. Header Navigation */}
      <LearnHeader
        classId={classId}
        challenge={challenge}
        user={user}
        dailyTarget={dailyTarget}
      />

      {/* ======================================================== */}
      {/* 2. MOBILE WORKSPACE (Unified 1-Screen)                    */}
      {/* ======================================================== */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 overflow-hidden bg-[#FFFDF7] relative">
        {/* Localized Mini Confetti Canvas for mobile */}
        <canvas
          ref={confettiCanvasMobileRef}
          className="pointer-events-none absolute inset-0 z-30 w-full h-full"
        />

        {/* Compact Mission Bar */}
        <div className="px-3 py-2 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-2 shrink-0 shadow-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-1.5 py-0.5 rounded-md bg-[#EF4444] text-white font-display font-black text-[10px] shrink-0">
              Lvl {challenge?.order_index || 1}
            </span>
            <p className="text-xs font-bold text-slate-900 truncate leading-tight">
              {challenge?.instruction}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {challenge?.theory && (
              <button
                type="button"
                onClick={() => setShowTheoryModal(true)}
                className="px-2 py-0.5 rounded-lg bg-[#FEF08A] border-2 border-slate-900 text-[10px] font-black text-slate-900 hover:bg-yellow-200 shadow-[0_1px_0_#0f172a] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3 h-3 text-[#EF4444]" />
                <span>Teori</span>
              </button>
            )}
            <span className="text-[10px] font-mono font-black text-amber-950 bg-[#FEF08A] border-2 border-slate-900 px-1.5 py-0.5 rounded-full shadow-[0_1px_0_#0f172a]">
              +{challenge?.xp_reward}XP
            </span>
          </div>
        </div>

        {/* Compact Live Arena Preview */}
        <div className="p-2.5 bg-slate-100 border-b-2 border-slate-900 flex flex-col items-center justify-center shrink-0">
          <LiveArena
            challengeId={challengeId}
            challenge={challenge}
            parsedStyles={parsedStyles}
            sanitizedUserHtml={sanitizedUserHtml}
            isPassed={liveEval.passed}
            sizeMode="compact"
          />
        </div>

        {/* Compact Code Editor & Chips */}
        <div className="flex-1 p-2 flex flex-col min-h-[90px] max-h-[160px] bg-[#FFFDF7]">
          <CodeEditorPanel
            cssCode={cssCode}
            setCssCode={handleSetCssCode}
            shuffledHelpers={shuffledHelpers}
            onToggleHelper={handleToggleHelper}
            onReset={handleReset}
            isHtmlMode={isHtmlMode}
            sizeMode="compact"
          />
        </div>

        {/* Mobile Action Bar */}
        <div className="p-2.5 bg-white border-t-2 border-slate-900 shrink-0 shadow-xs">
          <CompletionActionBar
            isPassed={liveEval.passed}
            earnedXpInfo={earnedXpInfo}
            isClassCompleted={isClassCompleted}
            challenge={challenge}
            saveError={saveError}
            isSaving={isSaving}
            onRetrySave={saveProgress}
            onNextLevel={handleNextLevel}
            classId={classId}
            challengeId={challengeId}
            user={user}
            sizeMode="compact"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DESKTOP WORKSPACE (3 Columns: Mission | Arena | Code) */}
      {/* ======================================================== */}
      <div className="hidden lg:grid lg:grid-cols-12 flex-1 gap-0 overflow-hidden bg-[#FFFDF7]">
        {/* PANEL 1: INSTRUCTIONS & VISUAL TARGET GOAL (4 Cols) */}
        <MissionPanel
          challenge={challenge}
          onOpenTheory={() => setShowTheoryModal(true)}
        />

        {/* PANEL 2: INTERACTIVE LIVE CANVAS (4 Cols) */}
        <div className="lg:col-span-4 border-r-3 border-slate-900 p-4 sm:p-5 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
          {/* TOP: TARGET GOAL / HASIL AKHIR YANG DIHARAPKAN */}
          <TargetGoalPanel
            challengeId={challengeId}
            challenge={challenge}
          />

          {/* BOTTOM: LIVE ARENA / HASIL KODEMU SAAT INI */}
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between px-1">
              <span className="font-display font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${liveEval.passed ? "bg-emerald-500 animate-pulse" : "bg-[#EF4444]"}`} />
                <span>Hasil Rendermu (Live)</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                liveEval.passed
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                  : "bg-slate-200 text-slate-700 border-slate-300"
              }`}>
                {liveEval.passed ? "Sesuai Target ✓" : "Sedang Dikerjakan"}
              </span>
            </div>

            <LiveArena
              challengeId={challengeId}
              challenge={challenge}
              parsedStyles={parsedStyles}
              sanitizedUserHtml={sanitizedUserHtml}
              isPassed={liveEval.passed}
              sizeMode="desktop"
            />
          </div>
        </div>

        {/* PANEL 3: CODE EDITOR & REAL-TIME ACTION (4 Cols) */}
        <div className="lg:col-span-4 p-6 bg-white flex flex-col justify-between relative overflow-y-auto">
          {/* Confetti Canvas */}
          <canvas
            ref={confettiCanvasRef}
            className="pointer-events-none absolute inset-0 z-30 w-full h-full"
          />

          <div className="space-y-4">
            <CodeEditorPanel
              cssCode={cssCode}
              setCssCode={handleSetCssCode}
              shuffledHelpers={shuffledHelpers}
              onToggleHelper={handleToggleHelper}
              onReset={handleReset}
              isHtmlMode={isHtmlMode}
              sizeMode="desktop"
            />
          </div>

          <CompletionActionBar
            isPassed={liveEval.passed}
            earnedXpInfo={earnedXpInfo}
            isClassCompleted={isClassCompleted}
            challenge={challenge}
            saveError={saveError}
            isSaving={isSaving}
            onRetrySave={saveProgress}
            onNextLevel={handleNextLevel}
            classId={classId}
            challengeId={challengeId}
            user={user}
            sizeMode="desktop"
          />
        </div>
      </div>

      {/* Modals */}
      <TheoryModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
        challenge={challenge}
      />

      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
        classId={classId}
        challengeId={challengeId}
      />
    </div>
  );
};
