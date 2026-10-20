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
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

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
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-slate-900">
      <DashboardNav />

      {/* Breadcrumb Bar */}
      <div className="w-full bg-white border-b-2 border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link
              href="/#curriculum"
              className="inline-flex items-center gap-1 font-display font-black text-[#EF4444] hover:underline hover:scale-[1.02] transition-transform"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Katalog Kelas</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Path</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Frontend Mastery</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-sm">
              {classData.title}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-display font-black text-slate-900 bg-[#FEF08A] px-3.5 py-1.5 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
            <span>Kurikulum Terakreditasi 2026</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-[#FFFDF7] pt-8 pb-12 overflow-hidden border-b-2 border-slate-200">
        {/* Decorative Background Glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary-fixed opacity-40 blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-16 w-56 h-56 rounded-full bg-tertiary-fixed opacity-40 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Badges Cluster */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-display font-black bg-[#c8eaff] text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{classData.levelName}</span>
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-display font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] bg-[#FEF08A] text-slate-900"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{classData.stage}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-black bg-orange-100 text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                  <span>+{classData.xpReward} XP Reward</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight">
                {classData.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                {classData.tagline}
              </p>

              {/* Rating & Social Proof */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-display font-black text-slate-900 text-sm">{classData.rating}</span>
                  <span className="text-slate-500 text-xs font-medium">
                    ({classData.reviewsCount} Ulasan)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-tertiary">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{classData.onlineCount} pelajar sedang coding hari ini</span>
                </div>
              </div>

              {/* Metadata Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2 pt-4 border-t-2 border-slate-200">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <div className="w-8 h-8 rounded-full bg-[#FEF08A] text-slate-900 border border-slate-900 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Kurikulum</p>
                    <p className="text-xs font-display font-bold text-slate-900 mt-0.5">
                      {classData.modulesCount} Modul
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <div className="w-8 h-8 rounded-full bg-[#c8eaff] text-slate-900 border border-slate-900 flex items-center justify-center shrink-0">
                    <Puzzle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Praktik Kode</p>
                    <p className="text-xs font-display font-bold text-slate-900 mt-0.5">
                      {classData.puzzlesCount} Puzzle
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <div className="w-8 h-8 rounded-full bg-[#ffd6ee] text-slate-900 border border-slate-900 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Estimasi</p>
                    <p className="text-xs font-display font-bold text-slate-900 mt-0.5">
                      {classData.estimatedHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 border border-slate-900 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Kelulusan</p>
                    <p className="text-xs font-display font-bold text-slate-900 mt-0.5">Sertifikat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Enrollment Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white rounded-3xl p-6 border-3 sm:border-4 border-slate-900 shadow-[0_8px_0_#0f172a] transition-transform duration-200">
                {/* Preview Video / Sandbox Banner */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-slate-900 mb-5 group bg-slate-900 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#EF4444] text-white border-2 border-slate-900 flex items-center justify-center shadow-[0_3px_0_#991b1b] group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-xs font-display font-black px-3 py-1 rounded-full text-slate-900 flex items-center gap-1.5 border border-slate-900 shadow-[0_2px_0_#0f172a]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pratinjau Sandbox Interaktif</span>
                  </span>
                </div>

                {/* Subscription Indicator */}
                <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-3.5 mb-5 flex items-center justify-between shadow-[0_2px_0_#065f46]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-display font-black text-emerald-950 leading-none">
                        All-Access Pass
                      </p>
                      <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                        Termasuk dalam sistem kurikulum
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full font-mono text-[11px] font-bold border border-emerald-400">
                    Aktif
                  </span>
                </div>

                {/* Active User Progress Indicator */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_#0f172a] mb-5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-display font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping"></span>
                      Progress Belajar
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900 bg-[#FEF08A] px-2.5 py-0.5 rounded-full border border-slate-900">
                      {classData.progressPercent}% Selesai
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border-2 border-slate-900">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-[#EF4444] to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${classData.progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] font-medium text-slate-600">
                    <span>
                      {classData.completedModules} dari {classData.modulesCount} Modul Tuntas
                    </span>
                    <span className="text-slate-900 font-bold">Lanjut Target Hari Ini</span>
                  </div>
                </div>

                {/* Primary ENROLL ACTION BUTTON */}
                <button
                  onClick={handleEnroll}
                  className="w-full py-4 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-lg border-3 border-slate-900 shadow-[0_4px_0_#991b1b] flex items-center justify-center gap-2 hover:scale-[1.01] active:translate-y-1 active:shadow-none transition-all duration-150 mb-4 cursor-pointer"
                >
                  <span>Mulai Belajar / Enroll</span>
                  <Rocket className="w-5 h-5" />
                </button>

                {/* Value Points */}
                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <span>Garansi Proyek Siap Portofolio GitHub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
                      Daftar Modul Pembelajaran
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Selesaikan tantangan kode untuk membuka modul berikutnya
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
                        className={`rounded-2xl border-2 sm:border-3 border-slate-900 p-5 transition-all ${
                          isCompleted
                            ? "bg-white shadow-[0_4px_0_#0f172a] hover:border-emerald-500"
                            : isInProgress
                            ? "bg-[#FEF08A] shadow-[0_4px_0_#0f172a]"
                            : "bg-slate-100 opacity-80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            {/* Status Icon */}
                            <div
                              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 border-slate-900 font-black ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isInProgress
                                  ? "bg-[#EF4444] text-white animate-pulse"
                                  : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-6 h-6 stroke-[3]" />
                              ) : isInProgress ? (
                                <span className="text-sm font-bold">{mod.number}</span>
                              ) : (
                                <Lock className="w-4 h-4 text-slate-500" />
                              )}
                            </div>

                            {/* Module Info */}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {isCompleted && (
                                  <span className="text-xs font-display font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-400">
                                    Selesai • 100% Skor
                                  </span>
                                )}
                                {isInProgress && (
                                  <span className="text-xs font-display font-black text-white bg-[#EF4444] px-2.5 py-0.5 rounded-full border border-slate-900 shadow-[0_2px_0_#991b1b]">
                                    Sedang Aktif • 2/4 Puzzle
                                  </span>
                                )}
                                {isLocked && (
                                  <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300">
                                    Terkunci
                                  </span>
                                )}
                                <span className="text-xs font-display font-black text-slate-900 bg-[#c8eaff] px-2.5 py-0.5 rounded-full border border-slate-900">
                                  +{mod.xp} XP
                                </span>
                              </div>

                              <h3 className="font-display font-black text-base text-slate-900">
                                Modul {mod.number}: {mod.title}
                              </h3>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl font-medium">
                                {mod.description}
                              </p>

                              <div className="flex items-center gap-4 mt-2 text-[11px] font-bold text-slate-500">
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
                                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-display font-bold text-xs border-2 border-slate-900 shadow-[0_2px_0_#0f172a] hover:bg-slate-100 cursor-pointer"
                              >
                                Review Kode
                              </button>
                            ) : isInProgress ? (
                              <button
                                onClick={handleEnroll}
                                className="px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>Lanjut Kuis</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-xs font-bold text-slate-500 px-3 py-1.5 rounded-xl bg-slate-200 border border-slate-300">
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
              <div className="bg-white rounded-3xl p-6 border-3 sm:border-4 border-slate-900 shadow-[0_6px_0_#0f172a] space-y-6">
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Pendekatan Pembelajaran Codevas</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">
                    {classData.about}
                  </p>
                </div>

                {/* 3-Column Bento Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#EF4444] text-white border border-slate-900 flex items-center justify-center mb-3 shadow-[0_2px_0_#991b1b]">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-black text-sm text-slate-900 mb-1">
                      100% Interaktif di Web
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Langsung koding di browser tanpa repot menginstal Node.js atau bundler.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#c8eaff] text-slate-900 border border-slate-900 flex items-center justify-center mb-3 shadow-[0_2px_0_#0f172a]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-black text-sm text-slate-900 mb-1">
                      Feedback Otomatis Instan
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Linter AI mengecek error logika kamu secara real-time dalam hitungan milidetik.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#FEF08A] text-slate-900 border border-slate-900 flex items-center justify-center mb-3 shadow-[0_2px_0_#0f172a]">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-black text-sm text-slate-900 mb-1">
                      Lencana Profil Eksklusif
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Kumpulkan badge candy yang bisa dipamerkan di profil publik &amp; portofolio.
                    </p>
                  </div>
                </div>

                {/* Prerequisites Card */}
                <div className="bg-[#FEF08A] rounded-2xl p-4 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-black text-xs uppercase tracking-wide text-slate-900 mb-0.5">
                      Prasyarat Minimum
                    </h4>
                    <p className="text-xs text-slate-800 leading-normal font-medium">
                      {classData.prerequisites}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FINAL PROJECT */}
            {activeTab === "project" && (
              <div className="bg-white rounded-3xl p-6 border-3 sm:border-4 border-slate-900 shadow-[0_6px_0_#0f172a] space-y-4">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-6 h-6 text-[#EF4444]" />
                  <h3 className="font-display font-black text-xl text-slate-900">
                    Proyek Portofolio Akhir
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Di akhir kelas, kamu akan membangun satu proyek utuh yang siap
                  dipublikasikan ke GitHub dan dipamerkan kepada recruiter:
                </p>
                <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-900 font-mono text-xs space-y-2 shadow-[0_4px_0_#0f172a]">
                  <p className="text-amber-400 font-bold">✨ Live Production Capstone:</p>
                  <p className="text-slate-200">
                    Membangun Interactive Web Playground dengan Real-time DOM validation,
                    custom theme toggles, dan modul state terisolasi.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DISCUSSION */}
            {activeTab === "discussion" && (
              <div className="bg-white rounded-3xl p-6 border-3 sm:border-4 border-slate-900 shadow-[0_6px_0_#0f172a] space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-sky-600" />
                  <h3 className="font-display font-black text-xl text-slate-900">
                    Diskusi Kelas &amp; Tanya AI Tutor Kiko
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Punya pertanyaan seputar materi atau menemui bug pada puzzle kode?
                  Tanyakan langsung pada AI Tutor Kiko yang siap mendampingi 24/7 di dalam workspace.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-center justify-between">
                  <span className="text-xs font-display font-black text-slate-900">
                    Forum Diskusi Komunitas Siswa Aktif
                  </span>
                  <button
                    onClick={handleEnroll}
                    className="px-4 py-2 bg-[#EF4444] text-white font-display font-black text-xs rounded-xl border-2 border-slate-900 shadow-[0_2px_0_#991b1b] cursor-pointer"
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
            <div className="bg-white rounded-3xl p-5 border-3 border-slate-900 shadow-[0_6px_0_#0f172a]">
              <span className="text-[11px] font-display font-black text-slate-900 uppercase tracking-wider">
                Instruktur Kelas
              </span>
              <div className="flex items-center gap-3.5 mt-3">
                <img
                  src={classData.instructor.avatarUrl}
                  alt={classData.instructor.name}
                  className="w-14 h-14 rounded-full border-2 border-slate-900 object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-black text-base text-slate-900">
                      {classData.instructor.name}
                    </h4>
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {classData.instructor.role}
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    {classData.instructor.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges & Rewards Widget */}
            <div className="bg-white rounded-3xl p-5 border-3 border-slate-900 shadow-[0_6px_0_#0f172a]">
              <span className="text-[11px] font-display font-black text-slate-900 uppercase tracking-wider">
                Hadiah &amp; Trofi Yang Kamu Dapatkan
              </span>
              <div className="grid grid-cols-3 gap-2.5 mt-3 text-center">
                <div className="p-2.5 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex flex-col items-center">
                  <span className="text-2xl mb-1">🍬</span>
                  <span className="text-[10px] font-display font-bold text-slate-900 leading-tight">
                    Candy Architect
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex flex-col items-center">
                  <span className="text-2xl mb-1">🏆</span>
                  <span className="text-[10px] font-display font-bold text-slate-900 leading-tight">
                    Top Solver
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex flex-col items-center">
                  <span className="text-2xl mb-1">📜</span>
                  <span className="text-[10px] font-display font-bold text-slate-900 leading-tight">
                    Sertifikat
                  </span>
                </div>
              </div>
            </div>

            {/* All-Access Subscription Reminder Card */}
            <div className="bg-[#FEF08A] rounded-3xl p-5 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] text-slate-900">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 font-display font-black text-[10px] uppercase border-2 border-slate-900 inline-block mb-2 shadow-[0_2px_0_#0f172a]">
                All-Access Pass
              </span>
              <h4 className="font-display font-black text-lg text-slate-900 leading-snug">
                Langganan Codevas
              </h4>
              <p className="text-xs text-slate-800 font-medium mt-1 leading-relaxed">
                Akses semua materi kelas, kuis interaktif, dan sertifikat resmi
                tanpa biaya per modul.
              </p>
              <button
                onClick={handleEnroll}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:scale-102 active:translate-y-0.5 active:shadow-none transition-all text-center cursor-pointer"
              >
                Mulai dengan Langganan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
