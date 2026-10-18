"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Clock,
  BookOpen,
  Puzzle,
  Award,
  Play,
  Rocket,
  Lock,
  Flame,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FolderArchive,
  MessageSquare,
  FileText,
  UserCheck,
} from "lucide-react";
import { ClassDetail } from "@/lib/classes-data";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface ClassDetailViewProps {
  classData: ClassDetail;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({ classData }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"syllabus" | "about" | "project" | "discussion">(
    "syllabus"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from localStorage on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("codevas_user_logged_in") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Handle Enrollment logic
  const handleEnroll = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/classes/${classData.id}`);
    } else {
      const firstModule = classData.modules?.[0];
      const targetUrl = firstModule
        ? `/classes/${classData.id}/learn/${firstModule.id}`
        : `/classes/${classData.id}`;
      router.push(targetUrl);
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
              href="/#curriculum"
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline hover:scale-[1.02] transition-transform"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Katalog Kelas</span>
            </Link>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant font-medium">Path</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant font-medium">Frontend Mastery</span>
            <span className="text-outline">/</span>
            <span className="text-secondary font-bold truncate max-w-xs sm:max-w-sm">
              {classData.title}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full border border-secondary-fixed-dim shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Kurikulum Terakreditasi 2026</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-surface-container-low via-surface to-background pt-8 pb-12 overflow-hidden border-b-2 border-outline-variant">
        {/* Decorative Background Glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary-fixed opacity-40 blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-16 w-56 h-56 rounded-full bg-tertiary-fixed opacity-40 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Badges Cluster */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface shadow-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{classData.levelName}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border-2 border-on-surface shadow-sm ${classData.stageColor}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{classData.stage}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>+{classData.xpReward} XP Reward</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-on-surface leading-tight tracking-tight">
                {classData.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-on-surface-variant font-normal leading-relaxed">
                {classData.tagline}
              </p>

              {/* Rating & Social Proof */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full border-2 border-outline-variant shadow-sm">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-on-surface text-sm">{classData.rating}</span>
                  <span className="text-on-surface-variant text-xs font-medium">
                    ({classData.reviewsCount} Ulasan)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-tertiary">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{classData.onlineCount} pelajar sedang coding hari ini</span>
                </div>
              </div>

              {/* Metadata Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2 pt-4 border-t-2 border-outline-variant">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-lowest border-2 border-outline-variant">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Kurikulum</p>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {classData.modulesCount} Modul
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-lowest border-2 border-outline-variant">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                    <Puzzle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Praktik Kode</p>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {classData.puzzlesCount} Puzzle
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-lowest border-2 border-outline-variant">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Estimasi</p>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {classData.estimatedHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-lowest border-2 border-outline-variant">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Kelulusan</p>
                    <p className="text-xs font-bold text-on-surface mt-0.5">Sertifikat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Enrollment Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-surface-container-lowest rounded-2xl p-6 border-4 border-on-surface shadow-[0_10px_0_#2e1a28] transition-transform duration-200">
                {/* Preview Video / Sandbox Banner */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-on-surface mb-5 group bg-secondary-container flex items-center justify-center blueprint-grid">
                  <div className="w-16 h-16 rounded-full bg-primary text-white border-2 border-on-surface flex items-center justify-center shadow-lg candy-btn-shadow group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <span className="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-on-surface flex items-center gap-1.5 border border-on-surface/40">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Pratinjau Sandbox Interaktif</span>
                  </span>
                </div>

                {/* Subscription Indicator */}
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-3 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-black text-emerald-900 leading-none">
                        All-Access Pass
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Termasuk dalam sistem langganan
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full font-mono text-[11px] font-bold">
                    Aktif
                  </span>
                </div>

                {/* Active User Progress Indicator */}
                <div className="bg-surface-container-low p-4 rounded-xl border-2 border-outline-variant mb-5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                      Progress Belajar
                    </span>
                    <span className="text-xs font-black text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                      {classData.progressPercent}% Selesai
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-surface-container-highest rounded-full overflow-hidden p-0.5 border border-outline-variant">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full transition-all duration-500"
                      style={{ width: `${classData.progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] font-medium text-on-surface-variant">
                    <span>
                      {classData.completedModules} dari {classData.modulesCount} Modul Tuntas
                    </span>
                    <span className="text-secondary font-bold">Lanjut Target Hari Ini</span>
                  </div>
                </div>

                {/* Primary ENROLL ACTION BUTTON */}
                <button
                  onClick={handleEnroll}
                  className="w-full py-4 rounded-full bg-primary text-white font-headline font-black text-lg border-2 border-on-surface shadow-[0_6px_0_#2e1a28] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-150 mb-4"
                >
                  <span>Mulai Belajar / Enroll</span>
                  <Rocket className="w-5 h-5" />
                </button>

                {/* Value Points */}
                <div className="space-y-2 text-xs font-semibold text-on-surface-variant pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Garansi Proyek Siap Portofolio GitHub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
                    <span>Akses Materi &amp; Playground Tanpa Batas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span>Bantuan AI Tutor Kiko 24/7 di Editor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION: TABS & SYLLABUS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Tabs, Syllabus & Details */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b-2 border-outline-variant overflow-x-auto pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("syllabus")}
                className={`flex items-center gap-2 px-5 py-3 border-b-4 font-bold text-sm transition-all ${
                  activeTab === "syllabus"
                    ? "border-primary text-primary bg-primary-fixed/20 rounded-t-xl"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Silabus &amp; Modul</span>
                <span className="bg-primary text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                  {classData.modules.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("about")}
                className={`flex items-center gap-2 px-5 py-3 border-b-4 font-bold text-sm transition-all ${
                  activeTab === "about"
                    ? "border-primary text-primary bg-primary-fixed/20 rounded-t-xl"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Tentang Kelas</span>
              </button>

              <button
                onClick={() => setActiveTab("project")}
                className={`flex items-center gap-2 px-5 py-3 border-b-4 font-bold text-sm transition-all ${
                  activeTab === "project"
                    ? "border-primary text-primary bg-primary-fixed/20 rounded-t-xl"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <FolderArchive className="w-4 h-4" />
                <span>Proyek Akhir</span>
              </button>

              <button
                onClick={() => setActiveTab("discussion")}
                className={`flex items-center gap-2 px-5 py-3 border-b-4 font-bold text-sm transition-all ${
                  activeTab === "discussion"
                    ? "border-primary text-primary bg-primary-fixed/20 rounded-t-xl"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tanya AI Tutor</span>
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </button>
            </div>

            {/* TAB CONTENT: SYLLABUS */}
            {activeTab === "syllabus" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-black text-2xl text-on-surface">
                      Daftar Modul &amp; Misi Koding
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Tuntaskan puzzle kode untuk membuka modul berikutnya
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1.5 rounded-full border border-primary/20">
                    Total {classData.puzzlesCount} Puzzle Interaktif
                  </span>
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                  {classData.modules.map((mod) => {
                    const isCompleted = mod.status === "completed";
                    const isInProgress = mod.status === "in-progress";
                    const isLocked = mod.status === "locked";

                    return (
                      <div
                        key={mod.id}
                        className={`rounded-2xl border-3 border-on-surface p-5 transition-all ${
                          isCompleted
                            ? "bg-surface-container-lowest shadow-[0_4px_0_#2e1a28] hover:border-emerald-500"
                            : isInProgress
                            ? "bg-surface-container-lowest ring-2 ring-primary shadow-[0_6px_0_#2e1a28]"
                            : "bg-surface-container-high/60 opacity-80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            {/* Status Icon */}
                            <div
                              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 border-on-surface font-black ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : isInProgress
                                  ? "bg-primary text-white animate-pulse"
                                  : "bg-surface-container text-on-surface-variant"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-6 h-6 stroke-[3]" />
                              ) : isInProgress ? (
                                <span className="text-sm font-bold">{mod.number}</span>
                              ) : (
                                <Lock className="w-4 h-4 text-on-surface-variant" />
                              )}
                            </div>

                            {/* Module Info */}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {isCompleted && (
                                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                                    Selesai • 100% Skor
                                  </span>
                                )}
                                {isInProgress && (
                                  <span className="text-xs font-black text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-primary/30">
                                    Sedang Aktif • 2/4 Puzzle
                                  </span>
                                )}
                                {isLocked && (
                                  <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant">
                                    Terkunci
                                  </span>
                                )}
                                <span className="text-xs font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">
                                  +{mod.xp} XP
                                </span>
                              </div>

                              <h3 className="font-display font-black text-base text-on-surface">
                                Modul {mod.number}: {mod.title}
                              </h3>
                              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-xl">
                                {mod.description}
                              </p>

                              <div className="flex items-center gap-4 mt-2 text-[11px] font-medium text-on-surface-variant">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{mod.duration}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Puzzle className="w-3.5 h-3.5" />
                                  <span>{mod.puzzlesCount} Puzzle Kode</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 self-end sm:self-center">
                            {isCompleted ? (
                              <button
                                onClick={handleEnroll}
                                className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label font-bold text-xs border border-on-surface hover:bg-surface-container-high transition-all"
                              >
                                Review Kode
                              </button>
                            ) : isInProgress ? (
                              <button
                                onClick={handleEnroll}
                                className="px-5 py-2.5 rounded-full bg-primary text-white font-label font-black text-xs border-2 border-on-surface candy-btn-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                              >
                                <span>Lanjut Kuis</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-xs font-bold text-on-surface-variant px-3 py-1.5 rounded-full bg-surface-container">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Terkunci</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ABOUT */}
            {activeTab === "about" && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 border-3 border-on-surface shadow-[0_6px_0_#2e1a28] space-y-6">
                <div>
                  <h3 className="font-display font-black text-xl text-on-surface mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    <span>Pendekatan Pembelajaran Codevas</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant font-normal">
                    {classData.about}
                  </p>
                </div>

                {/* 3-Column Bento Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low rounded-xl p-4 border-2 border-outline-variant hover:border-primary transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-3">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">
                      100% Interaktif di Web
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Langsung koding di browser tanpa repot menginstal Node.js atau bundler.
                    </p>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-4 border-2 border-outline-variant hover:border-tertiary transition-all">
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">
                      Feedback Otomatis Instan
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Linter AI mengecek error logika kamu secara real-time dalam hitungan milidetik.
                    </p>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-4 border-2 border-outline-variant hover:border-secondary transition-all">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">
                      Lencana Profil Eksklusif
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Kumpulkan badge candy yang bisa dipamerkan di profil publik &amp; portofolio.
                    </p>
                  </div>
                </div>

                {/* Prerequisites Card */}
                <div className="bg-secondary-fixed/40 rounded-xl p-4 border-2 border-secondary-fixed-dim flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide text-secondary mb-0.5">
                      Prasyarat Minimum
                    </h4>
                    <p className="text-xs text-on-secondary-fixed leading-normal">
                      {classData.prerequisites}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FINAL PROJECT */}
            {activeTab === "project" && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 border-3 border-on-surface shadow-[0_6px_0_#2e1a28] space-y-4">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-6 h-6 text-primary" />
                  <h3 className="font-display font-black text-xl text-on-surface">
                    Proyek Portofolio Akhir
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Di akhir kelas, kamu akan membangun satu proyek utuh yang siap
                  dipublikasikan ke GitHub dan dipamerkan kepada recruiter:
                </p>
                <div className="p-4 bg-surface-container-low rounded-xl border-2 border-on-surface font-mono text-xs space-y-2">
                  <p className="text-primary font-bold">✨ Live Production Capstone:</p>
                  <p className="text-on-surface">
                    Membangun Interactive Web Playground dengan Real-time DOM validation,
                    custom theme toggles, dan modul state terisolasi.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DISCUSSION */}
            {activeTab === "discussion" && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 border-3 border-on-surface shadow-[0_6px_0_#2e1a28] space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                  <h3 className="font-display font-black text-xl text-on-surface">
                    Diskusi Kelas &amp; Tanya AI Tutor Kiko
                  </h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Punya pertanyaan seputar materi atau menemui bug pada puzzle kode?
                  Tanyakan langsung pada AI Tutor Kiko yang siap mendampingi 24/7 di dalam workspace.
                </p>
                <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">
                    Forum Diskusi Komunitas Siswa Aktif
                  </span>
                  <button
                    onClick={handleEnroll}
                    className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-full border border-on-surface candy-btn-shadow"
                  >
                    Buka Forum 💬
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Instructor & Rewards Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Instructor Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 border-3 border-on-surface shadow-[0_6px_0_#2e1a28]">
              <span className="text-[11px] font-headline font-black text-secondary uppercase tracking-wider">
                Instruktur Kelas
              </span>
              <div className="flex items-center gap-3.5 mt-3">
                <img
                  src={classData.instructor.avatarUrl}
                  alt={classData.instructor.name}
                  className="w-14 h-14 rounded-full border-2 border-on-surface object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-black text-base text-on-surface">
                      {classData.instructor.name}
                    </h4>
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {classData.instructor.role}
                  </p>
                  <p className="text-[11px] text-outline font-semibold">
                    {classData.instructor.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges & Rewards Widget */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 border-3 border-on-surface shadow-[0_6px_0_#2e1a28]">
              <span className="text-[11px] font-headline font-black text-primary uppercase tracking-wider">
                Hadiah &amp; Trofi Yang Kamu Dapatkan
              </span>
              <div className="grid grid-cols-3 gap-2.5 mt-3 text-center">
                <div className="p-2.5 rounded-xl bg-primary-fixed border border-on-surface flex flex-col items-center">
                  <span className="text-2xl mb-1">🍬</span>
                  <span className="text-[10px] font-bold text-on-surface leading-tight">
                    Candy Architect
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary-fixed border border-on-surface flex flex-col items-center">
                  <span className="text-2xl mb-1">🏆</span>
                  <span className="text-[10px] font-bold text-on-surface leading-tight">
                    Top Solver
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-tertiary-fixed border border-on-surface flex flex-col items-center">
                  <span className="text-2xl mb-1">📜</span>
                  <span className="text-[10px] font-bold text-on-surface leading-tight">
                    Sertifikat
                  </span>
                </div>
              </div>
            </div>

            {/* All-Access Subscription Reminder Card */}
            <div className="bg-gradient-to-br from-secondary-fixed to-primary-fixed rounded-2xl p-5 border-3 border-on-surface shadow-[0_6px_0_#2e1a28]">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-black text-[10px] uppercase border border-on-surface inline-block mb-2">
                All-Access Pass
              </span>
              <h4 className="font-display font-black text-lg text-on-surface leading-snug">
                Langganan Codevas
              </h4>
              <p className="text-xs text-on-surface/85 font-medium mt-1 leading-relaxed">
                Akses semua materi kelas, kuis interaktif, dan sertifikat resmi
                tanpa biaya per modul.
              </p>
              <button
                onClick={handleEnroll}
                className="mt-4 w-full py-2.5 px-4 rounded-full bg-primary text-white font-label font-black text-xs border-2 border-on-surface candy-btn-shadow hover:scale-105 transition-all text-center"
              >
                Mulai dengan Langganan
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
