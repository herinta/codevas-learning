"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Rocket,
  Lock,
  Flame,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Play,
  Loader2,
  AlertCircle,
  Trophy,
  Check,
  Flag,
  RotateCcw,
  Star,
  Zap,
  ListFilter,
  Map as MapIcon,
  X,
  Award,
} from "lucide-react";
import { ClassWithChallenges, ChallengeWithUserProgress } from "@/lib/db/entities";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-context";

interface ClassDetailClientProps {
  initialData: ClassWithChallenges;
}

// Canvas configuration for the winding Duolingo-style path
const CANVAS_WIDTH = 420;
const STEP_HEIGHT = 150;
const START_OFFSET_Y = 100;

// S-curve oscillation pattern for serpentine stepping stones (in pixels offset from center)
const SNAKE_OFFSETS = [0, -70, -95, -45, 45, 95, 70, 0];

export const ClassDetailClient: React.FC<ClassDetailClientProps> = ({ initialData }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<ClassWithChallenges>(initialData);
  const [enrolling, setEnrolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active view mode: "path" (Duolingo winding map) or "list" (Compact syllabus list)
  const [viewMode, setViewMode] = useState<"path" | "list">("path");

  // Selected challenge for interactive speech-bubble popover card
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const isComingSoon = !course.is_published;
  const isEnrolled = course.isEnrolled;

  // Active / next unlocked challenge
  const firstActiveChallenge = useMemo(() => {
    return (
      course.challenges.find((c) => c.userStatus === "IN_PROGRESS") ||
      (isEnrolled
        ? course.challenges.find((c) => c.userStatus === "LOCKED")
        : course.challenges[0]) ||
      course.challenges[0]
    );
  }, [course.challenges, isEnrolled]);

  // Selected challenge object for popover modal
  const selectedChallenge = useMemo(() => {
    return (
      course.challenges.find((c) => c.id === selectedChallengeId) ||
      firstActiveChallenge ||
      course.challenges[0]
    );
  }, [course.challenges, selectedChallengeId, firstActiveChallenge]);

  // Total XP earned so far by user in this class
  const earnedXp = useMemo(() => {
    return course.challenges
      .filter((c) => c.userStatus === "COMPLETED")
      .reduce((acc, c) => acc + (c.xp_reward || 0), 0);
  }, [course.challenges]);

  // Handle Enrollment
  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?redirect=/classes/${course.id}`);
      return;
    }

    if (isComingSoon) return;

    setEnrolling(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/classes/${course.id}/enroll`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal mendaftar kelas.");
        setEnrolling(false);
        return;
      }

      // Refresh detail data
      const ref = await fetch(`/api/classes/${course.id}`, { cache: "no-store" });
      if (ref.ok) {
        const refJson = await ref.json();
        if (refJson.success && refJson.data) {
          setCourse(refJson.data);
        }
      }
    } catch {
      setErrorMsg("Terjadi gangguan koneksi saat mendaftar.");
    } finally {
      setEnrolling(false);
    }
  };

  // Node position calculations for the winding path
  const nodePositions = useMemo(() => {
    const cx = CANVAS_WIDTH / 2;
    return course.challenges.map((_, idx) => {
      const offset = SNAKE_OFFSETS[idx % SNAKE_OFFSETS.length];
      return {
        x: cx + offset,
        y: START_OFFSET_Y + idx * STEP_HEIGHT,
        offset,
      };
    });
  }, [course.challenges]);

  // Total height of the path container
  const totalMapHeight = useMemo(() => {
    return START_OFFSET_Y + course.challenges.length * STEP_HEIGHT + 130;
  }, [course.challenges.length]);

  // Final trophy milestone position
  const trophyPosition = useMemo(() => {
    const cx = CANVAS_WIDTH / 2;
    return {
      x: cx,
      y: START_OFFSET_Y + course.challenges.length * STEP_HEIGHT + 30,
    };
  }, [course.challenges.length]);

  // Generate SVG bezier curves connecting all nodes
  const pathD = useMemo(() => {
    if (nodePositions.length === 0) return "";
    let d = `M ${CANVAS_WIDTH / 2} 20 L ${nodePositions[0].x} ${nodePositions[0].y}`;

    for (let i = 0; i < nodePositions.length - 1; i++) {
      const curr = nodePositions[i];
      const next = nodePositions[i + 1];
      const midY = (curr.y + next.y) / 2;
      d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
    }

    // Connect last node to trophy
    const last = nodePositions[nodePositions.length - 1];
    const midY = (last.y + trophyPosition.y) / 2;
    d += ` C ${last.x} ${midY}, ${trophyPosition.x} ${midY}, ${trophyPosition.x} ${trophyPosition.y}`;

    return d;
  }, [nodePositions, trophyPosition]);

  const isAllCompleted =
    course.completedLevels === course.totalLevels && course.totalLevels > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar />

      {/* Top Breadcrumb & Status Navigation */}
      <div className="w-full bg-surface-container-low border-b-2 border-outline-variant pt-24 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link
              href="/#classes"
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline hover:scale-[1.02] transition-transform"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Katalog Silabus</span>
            </Link>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant font-medium">Kelas</span>
            <span className="text-outline">/</span>
            <span className="text-secondary font-bold truncate max-w-xs sm:max-w-sm">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full border border-secondary-fixed-dim">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Kurikulum Interaktif 2026</span>
            </span>

            {/* View Mode Switcher */}
            <div className="inline-flex items-center p-0.5 bg-surface-container-high rounded-xl border border-on-surface">
              <button
                onClick={() => setViewMode("path")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-headline font-bold transition-colors cursor-pointer ${
                  viewMode === "path"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Tampilan Peta Mengular (Duolingo Style)"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Peta Jalur</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-headline font-bold transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Tampilan Ringkas Daftar Silabus"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT GAMIFIED CLASS BANNER */}
      <section className="bg-gradient-to-b from-surface-container-low via-surface to-background border-b-2 border-outline-variant py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Title & Tagline */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full border-2 border-on-surface bg-primary text-white font-headline font-black text-xs">
                  {course.category.replace("_", " ")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-on-surface bg-surface-container-high font-mono text-xs font-bold">
                  {course.difficulty_level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-on-surface bg-surface-container-high font-mono text-xs font-bold">
                  ⏱️ {course.estimated_time}
                </span>
              </div>

              <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-on-surface tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
                {course.description || course.tagline}
              </p>
            </div>

            {/* Quick Stats Ticker & CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              {/* Gamification Pills */}
              <div className="flex items-center gap-3 bg-surface-container-lowest border-2 border-on-surface p-3 rounded-2xl shadow-[0_3px_0_#2e1a28]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-200">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-amber-800 uppercase leading-none">
                      XP Reward
                    </div>
                    <div className="text-xs font-mono font-black text-amber-950">
                      {earnedXp} / {course.xp_reward} XP
                    </div>
                  </div>
                </div>

                <div className="w-px h-8 bg-outline-variant" />

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary-fixed/50 rounded-xl border border-secondary-fixed-dim">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-secondary uppercase leading-none">
                      Progress
                    </div>
                    <div className="text-xs font-mono font-black text-secondary">
                      {course.completedLevels} / {course.totalLevels} Level
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Quick Action Button */}
              {isComingSoon ? (
                <button
                  disabled
                  className="px-5 py-3 rounded-2xl bg-surface-container-high text-on-surface-variant font-headline font-bold text-sm border-2 border-on-surface cursor-not-allowed"
                >
                  Segera Hadir
                </button>
              ) : isEnrolled ? (
                firstActiveChallenge ? (
                  <Link href={`/classes/${course.id}/learn/${firstActiveChallenge.id}`}>
                    <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-white font-headline font-black text-sm border-2 border-on-surface shadow-[0_4px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:translate-y-0.5 transition-transform cursor-pointer">
                      <Play className="w-4 h-4 fill-white" />
                      <span>Lanjutkan Level ({firstActiveChallenge.order_index})</span>
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-headline font-black text-sm border-2 border-on-surface flex items-center justify-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Semua Selesai!</span>
                  </button>
                )
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-sm border-2 border-on-surface shadow-[0_4px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:translate-y-0.5 transition-transform cursor-pointer disabled:opacity-60"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Daftar Kelas (Gratis)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar Ribbon */}
          {isEnrolled && (
            <div className="mt-5 pt-4 border-t border-outline-variant/60 flex items-center gap-4">
              <span className="text-xs font-mono font-black text-on-surface shrink-0">
                {course.progressPercent}% Dikuasai
              </span>
              <div className="flex-1 bg-surface-container-highest rounded-full h-3 border border-on-surface overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-on-surface-variant shrink-0 hidden sm:inline">
                {course.completedLevels} dari {course.totalLevels} quest selesai
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-100 border-2 border-red-500 rounded-xl flex items-center gap-2 text-xs font-bold text-red-900">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </section>

      {/* MAIN TWO-COLUMN GAME ARENA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: THE WINDING TIMELINE / DUOLINGO LEARNING PATH */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
            {viewMode === "path" ? (
              /* DUOLINGO WINDING PATH BOARD */
              <div className="w-full bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-10 shadow-[0_8px_0_#2e1a28] relative overflow-hidden">
                {/* Board Unit Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-5 rounded-2xl border-3 border-on-surface shadow-[0_4px_0_#2e1a28] mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 border-2 border-white flex items-center justify-center font-black">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-pink-100">
                        Peta Petualangan
                      </div>
                      <h2 className="font-display font-black text-lg sm:text-xl text-white">
                        {course.title}
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-headline font-black bg-white text-on-surface px-3 py-1 rounded-full border border-on-surface shadow-xs shrink-0">
                    {course.challenges.length} Quest
                  </span>
                </div>

                {/* Decorative floating game background code chips */}
                <div className="absolute top-36 left-4 text-[10px] font-mono text-outline/30 select-none pointer-events-none">
                  &lt;section&gt;
                </div>
                <div className="absolute top-80 right-6 text-[10px] font-mono text-outline/30 select-none pointer-events-none">
                  display: flex;
                </div>
                <div className="absolute top-[520px] left-6 text-[10px] font-mono text-outline/30 select-none pointer-events-none">
                  &lt;/div&gt;
                </div>
                <div className="absolute top-[800px] right-8 text-[10px] font-mono text-outline/30 select-none pointer-events-none">
                  gap: 1rem;
                </div>

                {/* THE SERPENTINE CANVAS CONTAINER */}
                <div
                  className="relative w-full max-w-[420px] mx-auto select-none"
                  style={{ height: `${totalMapHeight}px` }}
                >
                  {/* SVG CONNECTING PATHWAY ROAD */}
                  <svg
                    viewBox={`0 0 ${CANVAS_WIDTH} ${totalMapHeight}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="pathProgressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="activePulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e040a0" />
                        <stop offset="100%" stopColor="#7c52aa" />
                      </linearGradient>
                    </defs>

                    {/* Path 1: 3D Neo-Brutalist Outer Road Shadow/Border */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#2e1a28"
                      strokeWidth="22"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Path 2: Base Roadbed (Unfinished Track) */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#f1e6f2"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Path 3: Stepping Stones Dashes */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#d8c5db"
                      strokeWidth="4"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* START FLAG MARKER */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                    style={{ top: "32px", left: `${(CANVAS_WIDTH / 2 / CANVAS_WIDTH) * 100}%` }}
                  >
                    <span className="px-3.5 py-1 bg-surface-container-high border-2 border-on-surface rounded-full text-[11px] font-headline font-black text-on-surface shadow-[0_2px_0_#2e1a28] flex items-center gap-1.5">
                      <span>🚩</span>
                      <span>Mulai Petualangan</span>
                    </span>
                  </div>

                  {/* LEVEL NODES (DUOLINGO 3D BUTTONS) */}
                  {course.challenges.map((ch, idx) => {
                    const pos = nodePositions[idx];
                    const isCompleted = ch.userStatus === "COMPLETED";
                    const isInProgress = ch.userStatus === "IN_PROGRESS";
                    const isLocked = !isEnrolled || ch.userStatus === "LOCKED";
                    const isSelected = selectedChallengeId === ch.id;

                    const leftPercent = (pos.x / CANVAS_WIDTH) * 100;

                    return (
                      <div
                        key={ch.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                        style={{
                          top: `${pos.y}px`,
                          left: `${leftPercent}%`,
                        }}
                      >
                        {/* DUOLINGO-STYLE FLOATING SPEECH BUBBLE FOR ACTIVE LEVEL */}
                        {isInProgress && (
                          <div className="absolute -top-12 z-30 animate-bounce flex flex-col items-center pointer-events-none">
                            <div className="px-3 py-1 bg-on-surface text-white rounded-xl border-2 border-white shadow-md font-headline font-black text-[11px] flex items-center gap-1 whitespace-nowrap">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>QUEST AKTIF!</span>
                            </div>
                            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-on-surface" />
                          </div>
                        )}

                        {/* COMPLETED THREE-STAR BADGE */}
                        {isCompleted && (
                          <div className="absolute -top-6 flex items-center gap-0.5 z-20">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          </div>
                        )}

                        {/* CHUNKY 3D GAMIFIED STEPPING STONE BUTTON */}
                        <button
                          onClick={() => {
                            setSelectedChallengeId(ch.id);
                          }}
                          className={`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-on-surface flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isCompleted
                              ? "bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_8px_0_#065f46] hover:shadow-[0_10px_0_#065f46] active:translate-y-2 active:shadow-none"
                              : isInProgress
                              ? "bg-gradient-to-b from-primary via-[#e040a0] to-[#be185d] shadow-[0_8px_0_#881337] hover:shadow-[0_10px_0_#881337] ring-4 ring-primary/40 ring-offset-2 active:translate-y-2 active:shadow-none"
                              : "bg-surface-container-high text-on-surface-variant/40 shadow-[0_6px_0_#cbd5e1] hover:shadow-[0_8px_0_#cbd5e1] cursor-pointer"
                          } ${isSelected ? "ring-4 ring-on-surface" : ""}`}
                          title={`${ch.title} - ${isCompleted ? "Selesai" : isInProgress ? "Aktif" : "Terkunci"}`}
                        >
                          {/* Inner Bevel Highlight */}
                          <div className="absolute top-1 inset-x-2 h-4 bg-white/20 rounded-t-full pointer-events-none" />

                          {/* Node Icon */}
                          {isCompleted ? (
                            <Check className="w-8 h-8 text-white stroke-[3.5] drop-shadow-sm" />
                          ) : isInProgress ? (
                            <Play className="w-7 h-7 text-white fill-white ml-0.5 drop-shadow-sm group-hover:scale-110 transition-transform" />
                          ) : (
                            <Lock className="w-6 h-6 text-on-surface-variant/50" />
                          )}

                          {/* Level Number Pill */}
                          <span
                            className={`absolute -bottom-2 text-[10px] font-mono font-black px-2 py-0.5 rounded-full border-2 border-on-surface shadow-xs ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-950"
                                : isInProgress
                                ? "bg-amber-100 text-amber-950"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            Lv.{idx + 1}
                          </span>
                        </button>

                        {/* Title pill below */}
                        <div className="mt-3.5 text-center max-w-[135px] bg-surface-container-lowest/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border-2 border-on-surface shadow-[0_2px_0_#2e1a28] flex flex-col items-center">
                          <p className="font-headline font-black text-[11px] text-on-surface truncate w-full">
                            {ch.title.split(":")[1]?.trim() || ch.title}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-amber-800">
                            +{ch.xp_reward} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* FINAL MILESTONE TROPHY NODE */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                    style={{
                      top: `${trophyPosition.y}px`,
                      left: `${(trophyPosition.x / CANVAS_WIDTH) * 100}%`,
                    }}
                  >
                    <div
                      className={`w-22 h-22 sm:w-24 sm:h-24 rounded-3xl border-4 border-on-surface flex flex-col items-center justify-center transition-all ${
                        isAllCompleted
                          ? "bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_8px_0_#92400e] ring-4 ring-amber-300/50 animate-pulse"
                          : "bg-surface-container-high shadow-[0_6px_0_#cbd5e1] opacity-75"
                      }`}
                    >
                      <Trophy
                        className={`w-10 h-10 ${
                          isAllCompleted
                            ? "text-amber-950 fill-amber-300"
                            : "text-on-surface-variant/50"
                        }`}
                      />
                      <span className="text-[10px] font-headline font-black mt-1 text-on-surface">
                        {isAllCompleted ? "TAMAT!" : "MASTERY"}
                      </span>
                    </div>

                    <div className="mt-3 text-center">
                      <span className="px-3 py-1 bg-surface-container-lowest border-2 border-on-surface rounded-full text-xs font-headline font-black text-on-surface shadow-xs">
                        {isAllCompleted ? "🏆 Sertifikat Terbuka!" : "Puncak Tantangan"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE POPOVER CARD DOCKED AT BOTTOM OF GAME BOARD */}
                {selectedChallenge && (
                  <div className="mt-12 bg-surface-container-high border-3 border-on-surface rounded-2xl p-5 shadow-[0_6px_0_#2e1a28] relative">
                    <button
                      onClick={() => setSelectedChallengeId(null)}
                      className="absolute top-3 right-3 p-1 rounded-lg hover:bg-surface-container-highest text-on-surface-variant"
                      title="Tutup dialog"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-mono font-black rounded-md">
                            LEVEL {selectedChallenge.order_index}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            +{selectedChallenge.xp_reward} XP
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              selectedChallenge.userStatus === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : selectedChallenge.userStatus === "IN_PROGRESS"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {selectedChallenge.userStatus === "COMPLETED"
                              ? "Telah Selesai"
                              : selectedChallenge.userStatus === "IN_PROGRESS"
                              ? "Siap Dikerjakan"
                              : "Terkunci"}
                          </span>
                        </div>

                        <h3 className="font-display font-black text-base sm:text-lg text-on-surface">
                          {selectedChallenge.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed max-w-xl">
                          {selectedChallenge.instruction}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {!isEnrolled ? (
                          <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="px-5 py-2.5 bg-primary text-white rounded-xl font-headline font-bold text-xs border-2 border-on-surface shadow-[0_3px_0_#2e1a28] hover:scale-105 active:translate-y-0.5 transition-transform cursor-pointer"
                          >
                            Daftar Kelas Dulu
                          </button>
                        ) : selectedChallenge.userStatus === "LOCKED" ? (
                          <div className="px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-xl border-2 border-on-surface text-xs font-bold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Selesaikan level sebelumnya</span>
                          </div>
                        ) : (
                          <Link href={`/classes/${course.id}/learn/${selectedChallenge.id}`}>
                            <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-headline font-black text-xs border-2 border-on-surface shadow-[0_3px_0_#2e1a28] hover:scale-105 active:translate-y-0.5 transition-transform cursor-pointer flex items-center gap-2">
                              {selectedChallenge.userStatus === "COMPLETED" ? (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Latihan Ulang</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>Mulai Quest Sekarang</span>
                                </>
                              )}
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* COMPACT SYLLABUS LIST VIEW (ACCESSIBILITY / ALTERNATIVE MODE) */
              <div className="w-full space-y-4">
                <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 shadow-[0_6px_0_#2e1a28] mb-4">
                  <h2 className="font-display font-black text-xl text-on-surface flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>Daftar Silabus Seluruh Level</span>
                  </h2>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    Pelajari setiap konsep langkah demi langkah untuk membangun keahlian praktis.
                  </p>
                </div>

                {course.challenges.map((ch, idx) => {
                  const isCompleted = ch.userStatus === "COMPLETED";
                  const isInProgress = ch.userStatus === "IN_PROGRESS";
                  const isLocked = !isEnrolled || ch.userStatus === "LOCKED";

                  return (
                    <div
                      key={ch.id}
                      className={`p-5 rounded-2xl border-3 border-on-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        isCompleted
                          ? "bg-emerald-50 border-emerald-600 shadow-[0_3px_0_#059669]"
                          : isInProgress
                          ? "bg-surface-container-lowest border-primary shadow-[0_4px_0_#2e1a28] scale-[1.01]"
                          : "bg-surface-container-low opacity-75"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl border-2 border-on-surface flex items-center justify-center font-headline font-black text-sm shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isInProgress
                              ? "bg-primary text-white"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-black text-base text-on-surface">
                              {ch.title}
                            </h3>
                            <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                              +{ch.xp_reward} XP
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 max-w-xl leading-relaxed">
                            {ch.instruction}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-xl border border-on-surface">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{isEnrolled ? "Terkunci" : "Daftar Dulu"}</span>
                          </span>
                        ) : (
                          <Link href={`/classes/${course.id}/learn/${ch.id}`}>
                            <button className="px-4 py-2 bg-primary text-white rounded-xl font-headline font-bold text-xs border-2 border-on-surface shadow-[0_2px_0_#2e1a28] hover:scale-105 active:translate-y-0.5 flex items-center gap-1.5 transition-transform cursor-pointer">
                              <span>{isCompleted ? "Buka Lagi" : "Mulai Quest"}</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: STICKY MISSION COMPANION & GAMIFICATION   */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* CARD 1: RADAR QUEST AKTIF (JUMP DIRECTLY TO CURRENT CHALLENGE) */}
            <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 shadow-[0_8px_0_#2e1a28]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-outline-variant mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  <span className="font-headline font-black text-xs uppercase tracking-wider text-on-surface">
                    Radar Quest Aktif
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full border border-secondary-fixed-dim">
                  Tingkat {firstActiveChallenge?.difficulty || "EASY"}
                </span>
              </div>

              {firstActiveChallenge ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-lg text-on-surface">
                      {firstActiveChallenge.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-1.5 line-clamp-3 leading-relaxed">
                      {firstActiveChallenge.instruction}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-bold bg-surface-container-low p-2.5 rounded-xl border border-outline-variant">
                    <span className="text-on-surface-variant">Bonus XP Quest:</span>
                    <span className="text-amber-800 font-black">
                      +{firstActiveChallenge.xp_reward} XP
                    </span>
                  </div>

                  {isEnrolled ? (
                    <Link
                      href={`/classes/${course.id}/learn/${firstActiveChallenge.id}`}
                      className="block w-full"
                    >
                      <button className="w-full py-3.5 rounded-2xl bg-primary text-white font-headline font-black text-base border-2 border-on-surface shadow-[0_5px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:translate-y-1 transition-all cursor-pointer">
                        <Play className="w-5 h-5 fill-white" />
                        <span>
                          {firstActiveChallenge.userStatus === "COMPLETED"
                            ? "Review Level Ini"
                            : "Lanjutkan Quest Sekarang"}
                        </span>
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 rounded-2xl bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-base border-2 border-on-surface shadow-[0_5px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:translate-y-1 transition-all cursor-pointer"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Mendaftarkan...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          <span>Daftar Kelas (Gratis)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                  <p className="font-headline font-bold text-sm text-on-surface">
                    Semua Quest Selesai!
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Hebat! Kamu telah menaklukkan seluruh tantangan kelas ini.
                  </p>
                </div>
              )}
            </div>

            {/* CARD 2: PANDUAN PETA (LEGEND) */}
            <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 shadow-[0_6px_0_#2e1a28]">
              <h4 className="font-headline font-black text-xs uppercase tracking-wider text-on-surface mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Panduan Status Peta</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-on-surface flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-headline font-bold text-on-surface">Level Selesai</div>
                    <div className="text-[11px] text-on-surface-variant font-medium">
                      Tantangan tervalidasi dan XP telah masuk ke akunmu.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary border-2 border-on-surface flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                  </div>
                  <div>
                    <div className="font-headline font-bold text-on-surface">Quest Aktif</div>
                    <div className="text-[11px] text-on-surface-variant font-medium">
                      Level yang saat ini terbuka untuk kamu kerjakan.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high border-2 border-on-surface flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5 text-on-surface-variant" />
                  </div>
                  <div>
                    <div className="font-headline font-bold text-on-surface">Terkunci</div>
                    <div className="text-[11px] text-on-surface-variant font-medium">
                      Selesaikan quest sebelumnya untuk membuka kunci level ini.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: BENEFIT & JAMINAN BELAJAR */}
            <div className="bg-surface-container-low border-2 border-on-surface rounded-2xl p-5 space-y-2.5">
              <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <span>Validasi Otomatis &amp; Real-time Preview</span>
              </div>
              <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Akumulasi XP untuk Naik Peringkat Leaderboard</span>
              </div>
              <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>Bebas Akses Kapan Saja &amp; 100% Gratis</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
