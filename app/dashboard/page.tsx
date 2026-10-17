"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { CategoryFilter, CategoryFilterType } from "@/components/dashboard/category-filter";
import { ClassTrackCard } from "@/components/dashboard/class-card";
import { DailyBlitzWidget } from "@/components/dashboard/daily-blitz-widget";
import { LeaderboardWidget } from "@/components/dashboard/leaderboard-widget";
import { StatsWidget } from "@/components/dashboard/stats-widget";
import { Footer } from "@/components/layout/footer";
import { ClassCategory } from "@/lib/db/entities";
import { Compass, BookOpen, Sparkles, ArrowRight, Loader2, Rocket } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

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

export default function DashboardPage() {
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState<CategoryFilterType>("MY_CLASSES");
  const [searchQuery, setSearchQuery] = useState("");
  const [allClasses, setAllClasses] = useState<ApiClassItem[]>([]);
  const [myClasses, setMyClasses] = useState<ApiClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real data from APIs
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // 1. Fetch all classes
        const resClasses = await fetch("/api/classes", { cache: "no-store" });
        if (resClasses.ok) {
          const json = await resClasses.json();
          if (json.success && Array.isArray(json.data)) {
            setAllClasses(json.data);
          }
        }

        // 2. Fetch user's enrolled classes
        const resMyClasses = await fetch("/api/user/my-classes", { cache: "no-store" });
        if (resMyClasses.ok) {
          const json = await resMyClasses.json();
          if (json.success && Array.isArray(json.data)) {
            setMyClasses(json.data);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Filtered tracks
  const displayedTracks = useMemo(() => {
    let list: ApiClassItem[] = [];

    if (activeCategory === "MY_CLASSES") {
      list = myClasses;
    } else {
      list = allClasses.filter((c) => c.category === activeCategory);
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.tagline && c.tagline.toLowerCase().includes(q))
    );
  }, [activeCategory, myClasses, allClasses, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Navigation Bar with synchronized user XP & streak */}
      <DashboardNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userXp={user?.xp_points ?? 50}
        streakDays={user?.streak_days ?? 1}
      />

      {/* Gamification Hero Banner */}
      <DashboardHero
        totalClasses={allClasses.length}
        totalChallenges={allClasses.reduce((acc, t) => acc + (t.totalLevels || 0), 0)}
      />

      {/* Category Filter */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        enrolledCount={myClasses.length}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: 8 Columns - Class Track Cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-on-surface" />
                <h2 className="font-display font-black text-lg sm:text-xl text-on-surface">
                  {activeCategory === "MY_CLASSES"
                    ? "Kelas Saya yang Di-enroll"
                    : "Pilihan Modul & Tantangan"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant">
                  {displayedTracks.length} Kelas Tersedia
                </span>
              </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="font-headline font-bold text-sm text-on-surface-variant">
                  Mengambil data kelas dari server...
                </p>
              </div>
            ) : displayedTracks.length === 0 ? (
              /* Empty state jika belum enroll kelas */
              <div className="bg-surface-container-lowest border-2 border-dashed border-on-surface rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-4 shadow-brutal-sm">
                <div className="w-16 h-16 rounded-2xl bg-secondary-fixed border-2 border-on-surface flex items-center justify-center text-secondary">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="max-w-md">
                  <h3 className="font-display font-black text-xl text-on-surface">
                    {activeCategory === "MY_CLASSES"
                      ? "Belum Ada Kelas yang Di-enroll"
                      : "Tidak Ada Kelas yang Cocok"}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                    {activeCategory === "MY_CLASSES"
                      ? "Kamu belum mendaftar di kelas mana pun. Jelajahi kurikulum dan mulai petualangan koding pertamamu!"
                      : "Coba ubah kata kunci pencarian atau pilih kategori lain."}
                  </p>
                </div>
                {activeCategory === "MY_CLASSES" && (
                  <button
                    onClick={() => setActiveCategory("LIVE_CODE")}
                    className="px-6 py-3 bg-primary text-white font-headline font-black text-sm rounded-full border-2 border-on-surface candy-btn-shadow flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Jelajahi Kelas Live Code</span>
                  </button>
                )}
              </div>
            ) : (
              /* Grid of Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {displayedTracks.map((track) => (
                  <ClassTrackCard
                    key={track.id}
                    id={track.id}
                    category={track.category}
                    title={track.title}
                    description={track.description || track.tagline || ""}
                    levelCount={track.totalLevels || 1}
                    completedCount={track.completedLevels || 0}
                    xpReward={track.xp_reward}
                    isPublished={track.is_published}
                    challengeTypeDesc={track.tagline || undefined}
                    isEnrolled={track.isEnrolled}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: 4 Columns Sidebar Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <StatsWidget
              streakDays={user?.streak_days ?? 1}
              solvedCount={myClasses.reduce(
                (acc, c) => acc + (c.completedLevels || 0),
                0
              )}
            />
            <DailyBlitzWidget />
            <LeaderboardWidget />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
