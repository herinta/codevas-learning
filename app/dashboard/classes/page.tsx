"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  LayoutGrid,
  ChevronRight,
  Search,
  BookOpen,
  Sparkles,
  Code2,
  Puzzle,
  HelpCircle,
  CheckCircle2,
  Filter,
  Loader2,
  Flame,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ClassTrackCard } from "@/components/dashboard/class-card";
import { useAuth } from "@/components/auth/auth-context";
import { ClassCategory } from "@/lib/db/entities";

interface ApiClassItem {
  id: string;
  category: ClassCategory;
  title: string;
  tagline: string | null;
  description: string | null;
  difficulty_level: string;
  xp_reward: number;
  estimated_time: string;
  is_published: boolean;
  totalLevels: number;
  completedLevels: number;
  progressPercent: number;
  isEnrolled: boolean;
}

export default function DashboardClassesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [classes, setClasses] = useState<ApiClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Client-side authentication guard: redirect to login if session is empty
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.replace("/login?redirect=/dashboard/classes");
    }
  }, [user, authLoading, router]);

  // Load classes catalog
  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch("/api/classes");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setClasses(json.data);
        }
      }
    } catch (err) {
      console.error("Gagal memuat silabus kelas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchClasses();
    }
  }, [user?.id, fetchClasses]);

  // Revalidate on focus or when progress updates
  useEffect(() => {
    if (!user?.id) return;

    const handleFocus = () => fetchClasses();
    const handleProgress = () => fetchClasses();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("codevas:progress-updated", handleProgress);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("codevas:progress-updated", handleProgress);
    };
  }, [user?.id, fetchClasses]);

  // Filter & Search computation
  const filteredClasses = useMemo(() => {
    let list = classes;

    if (selectedCategory === "ENROLLED") {
      list = list.filter((c) => c.isEnrolled);
    } else if (selectedCategory !== "ALL") {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.tagline && c.tagline.toLowerCase().includes(q))
    );
  }, [classes, selectedCategory, searchQuery]);

  const enrolledCount = useMemo(() => classes.filter((c) => c.isEnrolled).length, [classes]);

  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#EF4444] animate-spin" />
        <p className="font-display font-black text-sm text-slate-900">
          Memuat Silabus Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col">
      {/* Top Dashboard Navigation */}
      <DashboardNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userXp={user?.xp_points ?? 50}
        streakDays={user?.streak_days ?? 1}
      />

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 flex-wrap">
          <Link
            href="/dashboard"
            className="hover:text-[#EF4444] transition-colors flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-display font-black flex items-center gap-1.5 bg-[#FEF08A] px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
            <Compass className="w-3.5 h-3.5 text-slate-900" />
            <span>Silabus &amp; Kurikulum</span>
          </span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1 pb-24 md:pb-6">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-amber-100 via-sky-100 to-rose-100 border-3 sm:border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#0f172a] mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EF4444] text-white rounded-full text-xs font-display font-black border-2 border-slate-900 shadow-[0_2px_0_#991b1b]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kurikulum Terstruktur</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
                Silabus Kelas &amp; Trek Belajar
              </h1>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Pilih trek belajar sesuai kemampuanmu. Mulai dari pemula hingga mahir dengan latihan live code interaktif!
              </p>
            </div>

            {/* Quick Summary Pill Stats */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[0_4px_0_#0f172a]">
              <div className="text-center px-2">
                <span className="block font-display font-black text-xl text-[#0369A1]">
                  {classes.length}
                </span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Total Trek
                </span>
              </div>
              <div className="w-0.5 h-8 bg-slate-200" />
              <div className="text-center px-2">
                <span className="block font-display font-black text-xl text-[#A16207]">
                  {classes.reduce((acc, c) => acc + (c.totalLevels || 0), 0)}
                </span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Tantangan
                </span>
              </div>
              <div className="w-0.5 h-8 bg-slate-200" />
              <div className="text-center px-2">
                <span className="block font-display font-black text-xl text-[#15803D]">
                  {enrolledCount}
                </span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  Diikuti
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "ALL", label: "Semua Trek" },
              { key: "ENROLLED", label: `Diikuti (${enrolledCount})` },
              { key: "LIVE_CODE", label: "Live Code" },
              { key: "DRAG_DROP", label: "Visual Logic" },
              { key: "QUIZ", label: "Theory Quiz" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-4 py-2 rounded-2xl text-xs font-display font-black border-2 sm:border-3 border-slate-900 transition-all cursor-pointer ${
                  selectedCategory === tab.key
                    ? "bg-[#EF4444] text-white shadow-[0_3px_0_#991b1b] -translate-y-0.5"
                    : "bg-white text-slate-900 shadow-[0_2px_0_#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Result Count Indicator */}
          <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
            Menampilkan <strong className="text-slate-900">{filteredClasses.length}</strong> trek kelas
          </span>
        </div>

        {/* Classes Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_6px_0_#0f172a] flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-slate-200 rounded-full border-2 border-slate-900" />
                    <div className="h-6 w-16 bg-slate-200 rounded-full border-2 border-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                    <div className="h-3.5 w-full bg-slate-100 rounded" />
                    <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t-2 border-slate-200 flex items-center justify-between">
                  <div className="h-3.5 w-20 bg-slate-100 rounded" />
                  <div className="h-9 w-24 bg-slate-200 rounded-xl border-2 border-slate-900" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white border-3 sm:border-4 border-dashed border-slate-900 rounded-3xl p-10 text-center shadow-[0_6px_0_#0f172a] max-w-lg mx-auto my-12">
            <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-display font-black text-xl text-slate-900">
              Tidak Ada Kelas yang Ditemukan
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Coba gunakan kata kunci pencarian lain atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="mt-4 px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-2xl text-xs font-display font-black border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((item) => (
              <ClassTrackCard
                key={item.id}
                id={item.id}
                category={item.category}
                title={item.title}
                description={item.tagline || item.description || "Kelas interaktif di Codevas"}
                levelCount={item.totalLevels}
                completedCount={item.completedLevels}
                xpReward={item.xp_reward}
                isPublished={item.is_published}
                isEnrolled={item.isEnrolled}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
