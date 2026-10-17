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
import { Compass, BookOpen, Sparkles, ArrowRight } from "lucide-react";

interface TrackItem {
  id: string;
  category: ClassCategory;
  title: string;
  description: string;
  levelCount: number;
  completedCount?: number;
  xpReward: number;
  isPublished: boolean;
  challengeTypeDesc: string;
  isRecommended?: boolean;
  isEnrolled?: boolean;
}

const DEFAULT_TRACKS: TrackItem[] = [
  {
    id: "css-flexbox",
    category: "LIVE_CODE",
    title: "CSS Flexbox Mastery",
    description: "Kuasai alignment dinamis, flex container, justify-content, dan responsive layouting.",
    levelCount: 10,
    completedCount: 8,
    xpReward: 150,
    isPublished: true,
    challengeTypeDesc: "Flex direction, Justify Center, Align Items, Flex Wrap & Gap",
    isRecommended: false,
    isEnrolled: true, // Demo user Alex is enrolled
  },
  {
    id: "css-grid",
    category: "LIVE_CODE",
    title: "CSS Grid Architecture",
    description: "Bangun struktur tata letak 2 dimensi modern, sistem bento box, dan responsive grid columns.",
    levelCount: 10,
    completedCount: 0,
    xpReward: 200,
    isPublished: true,
    challengeTypeDesc: "Grid Template Columns, Col Span, Row Span, Place Items Center",
    isRecommended: true,
    isEnrolled: false,
  },
  {
    id: "component-styling",
    category: "LIVE_CODE",
    title: "Component Styling & Effects",
    description: "Desain komponen UI modern dengan utility classes dan design tokens Candy Light Mode.",
    levelCount: 8,
    completedCount: 0,
    xpReward: 180,
    isPublished: false,
    challengeTypeDesc: "Pill Badges, Glassmorphism Cards, Neo-brutalist Shadows",
    isEnrolled: false,
  },
  {
    id: "js-logic-blocks",
    category: "DRAG_DROP",
    title: "JavaScript Logic Blocks",
    description: "Latih insting percabangan (if/else), perulangan (loops), dan array tanpa risiko syntax error.",
    levelCount: 15,
    completedCount: 0,
    xpReward: 250,
    isPublished: false,
    challengeTypeDesc: "Visual Puzzle Blocks, Data Flow Pipeline, State Updates",
    isEnrolled: false,
  },
  {
    id: "css-selectors-quiz",
    category: "QUIZ",
    title: "CSS Selectors & Specificity",
    description: "Uji pemahaman selektor tingkat lanjut, pseudo-classes, dan hierarki specificity tanpa ragu.",
    levelCount: 20,
    completedCount: 0,
    xpReward: 120,
    isPublished: false,
    challengeTypeDesc: "Specificity Calculations, Pseudo-elements, Attribute Selectors",
    isEnrolled: false,
  },
  {
    id: "react-next-basics",
    category: "LIVE_CODE",
    title: "React & Next.js Basics",
    description: "Komposisi komponen modular, hooks kustom, dan pengelolaan state interaktif di web modern.",
    levelCount: 12,
    completedCount: 0,
    xpReward: 300,
    isPublished: false,
    challengeTypeDesc: "Component Props, useState, useEffect, Server & Client Separation",
    isEnrolled: false,
  },
];

export default function DashboardPage() {
  // Tab 'MY_CLASSES' is the default view as requested
  const [activeCategory, setActiveCategory] = useState<CategoryFilterType>("MY_CLASSES");
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<TrackItem[]>(DEFAULT_TRACKS);
  const [enrolledIds, setEnrolledIds] = useState<string[]>(["css-flexbox"]);

  // Fetch classes and enrollments from API
  useEffect(() => {
    // 1. Fetch user enrollments for Alex
    fetch("/api/enrollments?userId=b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data?.enrolledClassIds)) {
          setEnrolledIds(resData.data.enrolledClassIds);
        }
      })
      .catch((err) => console.warn("Enrollment API fallback:", err));

    // 2. Fetch all classes from API
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const merged = DEFAULT_TRACKS.map((defTrack) => {
            const apiMatch = data.data.find((d: { id: string }) => d.id === defTrack.id);
            if (apiMatch) {
              return {
                ...defTrack,
                title: apiMatch.title || defTrack.title,
                description: apiMatch.description || defTrack.description,
                category: apiMatch.category || defTrack.category,
                isPublished: apiMatch.is_published ?? defTrack.isPublished,
              };
            }
            return defTrack;
          });
          setTracks(merged);
        }
      })
      .catch((err) => console.warn("Classes API fallback:", err));
  }, []);

  // Compute enrolled count
  const enrolledCount = useMemo(() => {
    return tracks.filter((t) => enrolledIds.includes(t.id)).length;
  }, [tracks, enrolledIds]);

  // Filtered tracks: MY_CLASSES shows ONLY enrolled classes
  const filteredTracks = useMemo(() => {
    return tracks
      .map((t) => ({ ...t, isEnrolled: enrolledIds.includes(t.id) }))
      .filter((t) => {
        // If 'MY_CLASSES', ONLY show enrolled classes
        if (activeCategory === "MY_CLASSES") {
          if (!t.isEnrolled) return false;
        } else {
          // Filter by category
          if (t.category !== activeCategory) return false;
        }

        // Search match
        if (searchQuery.trim() === "") return true;
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.challengeTypeDesc.toLowerCase().includes(q)
        );
      });
  }, [tracks, enrolledIds, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Navigation Bar */}
      <DashboardNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userXp={1240}
        streakDays={12}
      />

      {/* Gamification Hero Banner */}
      <DashboardHero
        totalClasses={tracks.length}
        totalChallenges={tracks.reduce((acc, t) => acc + t.levelCount, 0)}
      />

      {/* Category Filter: "My Class" (Default) replacing "Semua Kategori" */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        enrolledCount={enrolledCount}
      />

      {/* Main Content Area (8 Cols Grid + 4 Cols Sidebar) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: 8 Columns - Class Track Cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Header info */}
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
                  {activeCategory === "MY_CLASSES"
                    ? `${filteredTracks.length} Kelas Terdaftar`
                    : `Menampilkan ${filteredTracks.length} Modul`}
                </span>
                <Link
                  href="/classes"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Lihat Semua Silabus</span>
                </Link>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredTracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {filteredTracks.map((track) => (
                  <ClassTrackCard
                    key={track.id}
                    id={track.id}
                    category={track.category}
                    title={track.title}
                    description={track.description}
                    levelCount={track.levelCount}
                    completedCount={track.completedCount}
                    xpReward={track.xpReward}
                    isPublished={track.isPublished}
                    challengeTypeDesc={track.challengeTypeDesc}
                    isRecommended={track.isRecommended}
                    isEnrolled={track.isEnrolled}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-10 sm:p-12 text-center candy-card-shadow flex flex-col items-center justify-center">
                <span className="text-4xl mb-3">
                  {activeCategory === "MY_CLASSES" ? "🎓" : "🔍"}
                </span>
                <h3 className="font-display font-black text-lg text-on-surface">
                  {activeCategory === "MY_CLASSES"
                    ? "Belum Ada Kelas yang Di-enroll"
                    : "Tidak Ada Modul Ditemukan"}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 max-w-md leading-relaxed">
                  {activeCategory === "MY_CLASSES"
                    ? "Kamu belum mendaftar di kelas ini. Buka halaman Silabus untuk melihat katalog lengkap dan mendaftar kelas baru!"
                    : `Tidak ada modul yang cocok dengan kata kunci "${searchQuery}".`}
                </p>

                {activeCategory === "MY_CLASSES" ? (
                  <Link
                    href="/classes"
                    className="mt-5 px-5 py-2.5 bg-primary text-white text-xs font-display font-bold rounded-full border-2 border-on-surface candy-btn-shadow inline-flex items-center gap-1.5 hover:scale-105 transition-transform"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Jelajahi Silabus Semua Kelas</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setActiveCategory("MY_CLASSES");
                      setSearchQuery("");
                    }}
                    className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full border-2 border-on-surface candy-btn-shadow"
                  >
                    Kembali ke Kelas Saya
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: 4 Columns - Sidebar Widgets */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <DailyBlitzWidget />
            <LeaderboardWidget />
            <StatsWidget />
          </aside>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
