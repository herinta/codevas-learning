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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-headline font-bold text-sm text-on-surface">
          Memuat Silabus Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Dashboard Navigation */}
      <DashboardNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userXp={user?.xp_points ?? 50}
        streakDays={user?.streak_days ?? 1}
      />

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant flex-wrap">
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline" />
          <span className="text-primary font-black flex items-center gap-1.5 bg-primary-fixed/40 px-2.5 py-0.5 rounded-full border border-primary/20">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Silabus &amp; Kurikulum</span>
          </span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1">
        {/* Banner Section */}
        <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl sm:rounded-3xl p-6 sm:p-8 candy-card-shadow mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-full text-xs font-black shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kurikulum Terstruktur</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-on-surface tracking-tight">
                Silabus Kelas &amp; Trek Belajar
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
                Pilih trek belajar sesuai kemampuanmu. Mulai dari pemula hingga mahir dengan latihan live code interaktif!
              </p>
            </div>

            {/* Quick Summary Pill Stats */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-surface-container-low border-2 border-on-surface rounded-2xl p-4 candy-btn-shadow">
              <div className="text-center px-2">
                <span className="block font-display font-black text-xl text-primary">
                  {classes.length}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Trek
                </span>
              </div>
              <div className="w-0.5 h-8 bg-outline-variant" />
              <div className="text-center px-2">
                <span className="block font-display font-black text-xl text-secondary">
                  {classes.reduce((acc, c) => acc + (c.totalLevels || 0), 0)}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Tantangan
                </span>
              </div>
              <div className="w-0.5 h-8 bg-outline-variant" />
              <div className="text-center px-2">
                <span className="block font-display font-black text-xl text-emerald-600">
                  {enrolledCount}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-black border-2 border-on-surface transition-all cursor-pointer ${
                  selectedCategory === tab.key
                    ? "bg-primary text-white shadow-[0_2px_0_#2e1a28] scale-105"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Result Count Indicator */}
          <span className="text-xs font-bold text-on-surface-variant shrink-0">
            Menampilkan <strong className="text-on-surface">{filteredClasses.length}</strong> trek kelas
          </span>
        </div>

        {/* Classes Catalog Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-headline font-bold text-sm text-on-surface">
              Memuat kurikulum kelas...
            </p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl p-10 text-center candy-card-shadow max-w-lg mx-auto my-12">
            <Compass className="w-12 h-12 text-outline mx-auto mb-3" />
            <h3 className="font-display font-black text-lg text-on-surface">
              Tidak Ada Kelas yang Ditemukan
            </h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Coba gunakan kata kunci pencarian lain atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black border-2 border-on-surface shadow-[0_3px_0_#2e1a28] hover:scale-105 transition-transform cursor-pointer"
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
