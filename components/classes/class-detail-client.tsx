"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
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
} from "lucide-react";
import { ClassWithChallenges } from "@/lib/db/entities";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-context";

interface ClassDetailClientProps {
  initialData: ClassWithChallenges;
}

export const ClassDetailClient: React.FC<ClassDetailClientProps> = ({ initialData }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<ClassWithChallenges>(initialData);
  const [enrolling, setEnrolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isComingSoon = !course.is_published;
  const isEnrolled = course.isEnrolled;

  // Level pertama yang belum selesai
  const firstActiveChallenge =
    course.challenges.find((c) => c.userStatus === "IN_PROGRESS") ||
    course.challenges[0];

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="w-full bg-surface-container-low border-b-2 border-outline-variant pt-24 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
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

          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full border border-secondary-fixed-dim shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Kurikulum Interaktif 2026</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-surface-container-low via-surface to-background pt-8 pb-12 overflow-hidden border-b-2 border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full border-2 border-on-surface bg-primary text-white font-headline font-black text-xs shadow-sm">
                  {course.category.replace("_", " ")}
                </span>
                <span className="px-3 py-1 rounded-full border border-on-surface bg-surface-container-high font-mono text-xs font-bold">
                  Tingkat: {course.difficulty_level}
                </span>
                <span className="px-3 py-1 rounded-full border border-on-surface bg-surface-container-high font-mono text-xs font-bold">
                  Estimasi: {course.estimated_time}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed">
                {course.description || course.tagline}
              </p>

              {/* Reward Highlights */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 border-2 border-on-surface rounded-full shadow-[0_2px_0_#2e1a28]">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span className="text-xs font-headline font-black text-amber-950">
                    +{course.xp_reward} Total XP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-[0_2px_0_#2e1a28]">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-headline font-black text-secondary">
                    {course.totalLevels} Level Tantangan
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Action & Progress Card */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-7 shadow-[0_8px_0_#2e1a28]">
                {/* Progress Bar (HANYA MUNCUL JIKA SUDAH ENROLL) */}
                {isEnrolled && (
                  <div className="space-y-2 mb-6 p-4 bg-surface-container-low rounded-2xl border-2 border-on-surface">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-on-surface uppercase tracking-wider">
                        Progress Belajar
                      </span>
                      <span className="text-primary font-mono">
                        {course.progressPercent}% Selesai
                      </span>
                    </div>

                    <div className="w-full bg-surface-container-highest rounded-full h-3 border border-on-surface overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300 rounded-full"
                        style={{ width: `${course.progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant pt-1">
                      <span>
                        {course.completedLevels} dari {course.totalLevels} Level Selesai
                      </span>
                      <span className="text-emerald-700 font-semibold">Tersinkronisasi</span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-xl flex items-center gap-2 text-xs font-bold text-red-900">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ACTION CTA BUTTON */}
                {isComingSoon ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-full bg-surface-container-high text-on-surface-variant font-headline font-black text-base border-2 border-on-surface cursor-not-allowed text-center"
                  >
                    Segera Hadir (Tahap Perancangan)
                  </button>
                ) : isEnrolled ? (
                  firstActiveChallenge ? (
                    <Link
                      href={`/classes/${course.id}/learn/${firstActiveChallenge.id}`}
                      className="block w-full"
                    >
                      <button className="w-full py-4 rounded-full bg-primary text-white font-headline font-black text-lg border-2 border-on-surface shadow-[0_6px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 cursor-pointer">
                        <Play className="w-5 h-5 fill-white" />
                        <span>Lanjutkan Belajar ({firstActiveChallenge.title.split(":")[0]})</span>
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 rounded-full bg-emerald-500 text-white font-headline font-black text-lg border-2 border-on-surface"
                    >
                      🎉 Semua Level Selesai!
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 rounded-full bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-lg border-2 border-on-surface shadow-[0_6px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-60"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Mendaftarkan...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span>Daftar Kelas Ini (Gratis)</span>
                      </>
                    )}
                  </button>
                )}

                {/* Value list */}
                <div className="space-y-2 text-xs font-semibold text-on-surface-variant pt-5 border-t border-outline-variant mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Latihan interaktif dengan validasi fleksibel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Bonus XP untuk menaikkan reputasi &amp; streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYLLABUS LIST SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="mb-6">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-on-surface flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>Silabus &amp; Daftar Level ({course.challenges.length} Quest)</span>
          </h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Selesaikan quest secara bertahap untuk membuka level berikutnya dan mengumpulkan XP!
          </p>
        </div>

        {/* Level List */}
        <div className="space-y-4">
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
                    : "bg-surface-container-low opacity-70"
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
                      <h3 className="font-display font-black text-base sm:text-lg text-on-surface">
                        {ch.title}
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        +{ch.xp_reward} XP
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 max-w-2xl leading-relaxed">
                      {ch.instruction}
                    </p>
                  </div>
                </div>

                {/* Right Action Button for this level */}
                <div className="shrink-0 flex items-center gap-2">
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-xl border border-on-surface">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEnrolled ? "Terkunci" : "Daftar untuk Membuka"}</span>
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
      </main>

      <Footer />
    </div>
  );
};
