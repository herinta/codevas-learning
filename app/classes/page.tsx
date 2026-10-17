"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Code2,
  Puzzle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  BookOpen,
  Star,
  Compass,
  Loader2,
  Clock,
  Flame,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface ApiClassItem {
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

export default function AllClassesCatalogPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ApiClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes", { cache: "no-store" });
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
    fetchClasses();
  }, []);

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
          badgeText: "text-emerald-800",
        };
      case "DRAG_DROP":
        return {
          icon: <Puzzle className="w-4 h-4 text-secondary" />,
          label: "Visual Logic Blocks",
          badgeBg: "bg-secondary-fixed",
          badgeText: "text-secondary",
        };
      case "QUIZ":
        return {
          icon: <HelpCircle className="w-4 h-4 text-tertiary" />,
          label: "Theory Multiple Choice",
          badgeBg: "bg-tertiary-fixed",
          badgeText: "text-tertiary",
        };
      default:
        return {
          icon: <BookOpen className="w-4 h-4" />,
          label: "Kurikulum",
          badgeBg: "bg-surface-container",
          badgeText: "text-on-surface",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex-1 w-full">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-fixed border-2 border-on-surface text-secondary font-headline font-black text-xs uppercase tracking-wider shadow-brutal-sm mb-3">
            <Compass className="w-4 h-4" />
            <span>Katalog Silabus Lengkap</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-on-surface tracking-tight">
            Eksplorasi Kurikulum Frontend
          </h1>
          <p className="mt-3 text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
            Pilih trek belajar sesuai kemampuanmu. Mulai dari pemula hingga mahir dengan sistem validasi visual otomatis!
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
              className={`px-5 py-2 rounded-full font-headline font-black text-xs sm:text-sm border-2 border-on-surface transition-all cursor-pointer ${
                selectedCategory === tab.key
                  ? "bg-primary text-white shadow-brutal -translate-y-0.5"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-headline font-bold text-sm text-on-surface-variant">
              Memuat data silabus dari server...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((item) => {
              const cfg = getCategoryConfig(item.category);
              const isComingSoon = !item.is_published;

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-3xl border-3 border-on-surface p-6 shadow-brutal flex flex-col justify-between transition-all ${
                    isComingSoon
                      ? "opacity-75 grayscale-[30%]"
                      : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2e1a28]"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-on-surface text-xs font-headline font-black ${cfg.badgeBg} ${cfg.badgeText}`}
                      >
                        {cfg.icon}
                        <span>{cfg.label}</span>
                      </span>

                      {isComingSoon ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full border border-outline-variant">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Coming Soon</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>+{item.xp_reward} XP</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h2 className="font-display font-black text-xl text-on-surface leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-xs text-on-surface-variant font-medium mt-2 line-clamp-3 leading-relaxed">
                        {item.description || item.tagline}
                      </p>
                    </div>

                    {/* Progress (if enrolled) */}
                    {item.isEnrolled && (
                      <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-on-surface">Progress Kamu</span>
                          <span className="text-primary font-mono">{item.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden border border-on-surface/40">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-6 mt-4 border-t border-outline-variant flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-on-surface-variant">
                      {isComingSoon ? "Segera Hadir" : `${item.totalLevels} Level Tantangan`}
                    </span>

                    {isComingSoon ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-xl border border-on-surface cursor-not-allowed"
                      >
                        Terkunci
                      </button>
                    ) : (
                      <Link href={`/classes/${item.id}`}>
                        <button className="px-4 py-2 bg-primary text-white text-xs font-headline font-black rounded-xl border-2 border-on-surface shadow-brutal-sm hover:scale-105 active:translate-y-0.5 transition-transform flex items-center gap-1.5 cursor-pointer">
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
