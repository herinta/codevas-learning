"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Code2,
  Puzzle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Compass,
  Loader2,
  Clock,
  Flame,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export interface ApiClassItem {
  id: string;
  category: "LIVE_CODE" | "DRAG_DROP" | "QUIZ";
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

export function ClassesCatalogClient({ initialClasses = [] }: { initialClasses?: ApiClassItem[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const [classes, setClasses] = useState<ApiClassItem[]>(initialClasses);
  const [loading, setLoading] = useState(initialClasses.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Jika user sudah login, arahkan ke halaman silabus versi dashboard dengan breadcrumb
  useEffect(() => {
    if (user) {
      router.replace("/dashboard/classes");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setClasses(json.data);
          }
        }
      } catch (err) {
        console.error("Gagal memuat katalog kelas:", err);
      } finally {
        setLoading(false);
      }
    }
    if (initialClasses.length === 0) {
      fetchClasses();
    }
  }, [initialClasses.length]);

  const filteredClasses =
    selectedCategory === "ALL"
      ? classes
      : classes.filter((c) => c.category === selectedCategory);

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "LIVE_CODE":
        return {
          icon: <Code2 className="w-4 h-4 text-emerald-800" />,
          label: "Live Code Playground",
          badgeBg: "bg-emerald-100",
          badgeText: "text-emerald-900",
        };
      case "DRAG_DROP":
        return {
          icon: <Puzzle className="w-4 h-4 text-indigo-800" />,
          label: "Visual Logic Blocks",
          badgeBg: "bg-indigo-100",
          badgeText: "text-indigo-900",
        };
      case "QUIZ":
        return {
          icon: <HelpCircle className="w-4 h-4 text-amber-800" />,
          label: "Theory Multiple Choice",
          badgeBg: "bg-amber-100",
          badgeText: "text-amber-900",
        };
      default:
        return {
          icon: <BookOpen className="w-4 h-4 text-slate-800" />,
          label: "Kurikulum",
          badgeBg: "bg-slate-100",
          badgeText: "text-slate-900",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex-1 w-full">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FEF08A] border-2 border-slate-900 text-slate-900 font-display font-black text-xs uppercase tracking-wider shadow-[0_2px_0_#0f172a] mb-3">
            <Compass className="w-4 h-4 text-slate-900" />
            <span>Katalog Silabus Lengkap</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
            Eksplorasi Kurikulum Frontend
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Pilih trek belajar sesuai kemampuanmu. Mulai dari pemula hingga mahir dengan live code interaktif!
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {[
            { key: "ALL", label: "Semua Kategori" },
            { key: "LIVE_CODE", label: "Live Code" },
            { key: "DRAG_DROP", label: "Visual Logic" },
            { key: "QUIZ", label: "Quiz Theory" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-5 py-2 rounded-full font-display font-black text-xs sm:text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                selectedCategory === tab.key
                  ? "bg-[#EF4444] text-white shadow-[0_3px_0_#991b1b] -translate-y-0.5"
                  : "bg-white text-slate-900 hover:bg-slate-50 shadow-[0_2px_0_#0f172a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border-3 border-slate-900 p-6 shadow-[0_6px_0_#0f172a] flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-6 w-32 bg-slate-200 rounded-full border-2 border-slate-900/20" />
                    <div className="h-6 w-16 bg-slate-200 rounded-full border-2 border-slate-900/20" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-7 w-4/5 bg-slate-200 rounded-lg" />
                    <div className="h-3.5 w-full bg-slate-100 rounded" />
                    <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t-2 border-slate-100 flex items-center justify-between">
                  <div className="h-3.5 w-24 bg-slate-100 rounded" />
                  <div className="h-9 w-24 bg-slate-200 rounded-xl border-2 border-slate-900/30" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((item) => {
              const cfg = getCategoryConfig(item.category);
              const isComingSoon = !item.is_published;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border-3 border-slate-900 p-6 shadow-[0_6px_0_#0f172a] flex flex-col justify-between transition-all ${
                    isComingSoon
                      ? "opacity-75 grayscale-[30%]"
                      : "hover:-translate-y-1 hover:shadow-[0_8px_0_#0f172a]"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-slate-900 text-xs font-display font-black shadow-[0_2px_0_#0f172a] ${cfg.badgeBg} ${cfg.badgeText}`}
                      >
                        {cfg.icon}
                        <span>{cfg.label}</span>
                      </span>

                      {isComingSoon ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Coming Soon</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-amber-950 bg-[#FEF08A] border-2 border-slate-900 px-2.5 py-0.5 rounded-full shadow-[0_2px_0_#0f172a]">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                          <span>+{item.xp_reward} XP</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h2 className="font-display font-black text-xl text-slate-900 leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-600 font-medium mt-2 line-clamp-3 leading-relaxed">
                        {item.description || item.tagline}
                      </p>
                    </div>

                    {/* Progress (if enrolled) */}
                    {item.isEnrolled && (
                      <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-900 space-y-1.5 shadow-[0_2px_0_#0f172a]">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span className="text-slate-900">Progress Kamu</span>
                          <span className="text-[#EF4444] font-mono">{item.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border-2 border-slate-900">
                          <div
                            className="bg-[#EF4444] h-full rounded-full transition-all duration-300"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-6 mt-4 border-t-2 border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {isComingSoon ? "Segera Hadir" : `${item.totalLevels} Level Tantangan`}
                    </span>

                    {isComingSoon ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border-2 border-slate-300 cursor-not-allowed"
                      >
                        Terkunci
                      </button>
                    ) : (
                      <Link href={`/classes/${item.id}`}>
                        <button className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-display font-black rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:scale-105 active:translate-y-0.5 transition-transform flex items-center gap-1.5 cursor-pointer">
                          <span>{item.isEnrolled ? "Lanjutkan" : "Lihat Detail"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
