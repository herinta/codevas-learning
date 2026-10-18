"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers,
  Terminal,
  Clock,
  Flame,
  LayoutGrid,
  Boxes,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { CLASSES_LIST } from "@/lib/classes-data";

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

const DEFAULT_LANDING_CLASSES: ApiClassItem[] = CLASSES_LIST.map((c) => ({
  id: c.id,
  category: c.category,
  title: c.title,
  tagline: c.tagline ?? null,
  description: c.about ?? null,
  difficulty_level: c.level,
  xp_reward: c.xpReward,
  estimated_time: c.estimatedHours,
  is_published: c.status === "available",
  totalLevels: c.modulesCount || (c.modules ? c.modules.length : 0),
  completedLevels: 0,
  progressPercent: 0,
  isEnrolled: false,
}));

interface ClassesSectionProps {
  initialClasses?: ApiClassItem[];
}

export const ClassesSection: React.FC<ClassesSectionProps> = ({ initialClasses }) => {
  const [classes, setClasses] = useState<ApiClassItem[]>(
    initialClasses && initialClasses.length > 0 ? initialClasses : DEFAULT_LANDING_CLASSES
  );
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "LIVE_CODE" | "DRAG_DROP" | "QUIZ">("ALL");

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setClasses(json.data);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data kelas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const filteredClasses =
    selectedCategory === "ALL"
      ? classes
      : classes.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "LIVE_CODE":
        return <Terminal className="w-4 h-4 text-primary" />;
      case "DRAG_DROP":
        return <Boxes className="w-4 h-4 text-amber-600" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4 text-secondary" />;
      default:
        return <Terminal className="w-4 h-4" />;
    }
  };

  const getCategoryThumbnailIcon = (title: string, cat: string) => {
    if (title.includes("HTML")) return <Terminal className="w-8 h-8 text-sky-600" />;
    if (title.includes("Basics")) return <Sparkles className="w-8 h-8 text-amber-600" />;
    if (title.includes("Flexbox")) return <LayoutGrid className="w-8 h-8 text-primary" />;
    if (title.includes("Grid")) return <Layers className="w-8 h-8 text-emerald-600" />;
    if (title.includes("Tailwind")) return <LayoutGrid className="w-8 h-8 text-cyan-600" />;
    if (title.includes("Styling")) return <Sparkles className="w-8 h-8 text-secondary" />;
    if (cat === "DRAG_DROP") return <Boxes className="w-8 h-8 text-amber-600" />;
    return <HelpCircle className="w-8 h-8 text-secondary" />;
  };

  const getAccentBg = (id: string) => {
    switch (id) {
      case "html-architecture":
        return "bg-[#e0f2fe]";
      case "css-basics":
        return "bg-[#fef3c7]";
      case "css-flexbox":
        return "bg-[#fce7f3]";
      case "css-grid":
        return "bg-[#dcfce7]";
      case "component-styling":
        return "bg-[#ede9fe]";
      case "tailwind-css":
        return "bg-[#cffafe]";
      case "js-logic-blocks":
      case "javascript-logic-blocks":
        return "bg-[#fef3c7]";
      default:
        return "bg-[#e0e7ff]";
    }
  };

  return (
    <section className="py-24 px-4 bg-surface max-w-6xl mx-auto" id="classes">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          {/* Badge Langganan */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed border-2 border-on-surface text-secondary font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#2e1a28] mb-4">
            <Sparkles className="w-4 h-4 text-secondary fill-secondary-container" />
            <span>Kurikulum Dinamis • 3 Kategori Pembelajaran</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight">
            Pilihan Kelas Web Development
          </h2>
          <p className="mt-3 text-base sm:text-lg text-on-surface-variant font-medium max-w-2xl leading-relaxed">
            Kurikulum gamifikasi terstruktur: <strong>Live Code</strong>, <strong>Visual Logic</strong>, dan <strong>Quiz Theory</strong>. Siapa pun bisa melihat detail kurikulum secara gratis!
          </p>
        </div>

        {/* Akses Card */}
        <div className="bg-surface-container-lowest border-2 border-on-surface px-5 py-3 rounded-2xl shadow-[0_4px_0_#2e1a28] flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-on-surface flex items-center justify-center text-emerald-700 font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Status Akses
            </p>
            <p className="font-display font-black text-sm text-emerald-700">
              100% Gratis &amp; Terbuka
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-3 mb-10 pb-2">
        {[
          { key: "ALL", label: "Semua Kategori" },
          { key: "LIVE_CODE", label: "Live Code" },
          { key: "DRAG_DROP", label: "Drag & Drop" },
          { key: "QUIZ", label: "Quiz Theory" },
        ].map((tab) => {
          const isActive = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key as any)}
              className={`px-5 py-2 rounded-full font-headline font-black text-xs sm:text-sm border-2 border-on-surface transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-[0_4px_0_#2e1a28] -translate-y-0.5"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_2px_0_#2e1a28]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-surface-container-lowest rounded-2xl border-4 border-on-surface shadow-[0_8px_0_#2e1a28] flex flex-col justify-between overflow-hidden animate-pulse"
            >
              <div>
                <div className="h-40 bg-surface-container border-b-4 border-on-surface p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-surface-container-high rounded-full border border-on-surface/20" />
                    <div className="h-6 w-16 bg-surface-container-high rounded-full border border-on-surface/20" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-highest border-2 border-on-surface/30" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-surface-container-high rounded" />
                      <div className="h-2.5 w-16 bg-surface-container-high rounded" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="h-6 w-3/4 bg-surface-container-high rounded-lg" />
                  <div className="h-3.5 w-full bg-surface-container rounded" />
                  <div className="h-3.5 w-4/5 bg-surface-container rounded" />
                  <div className="pt-2 flex justify-between">
                    <div className="h-3 w-28 bg-surface-container rounded" />
                    <div className="h-3 w-16 bg-surface-container rounded" />
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="w-full h-11 bg-surface-container-high rounded-xl border-2 border-on-surface/30" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredClasses.length === 0 && (
        <div className="py-16 text-center bg-surface-container-lowest border-2 border-dashed border-on-surface/30 rounded-3xl p-8">
          <p className="font-headline font-bold text-base text-on-surface-variant">
            Belum ada kelas pada kategori ini. Silakan pilih tab kategori lain di atas.
          </p>
        </div>
      )}

      {/* Grid of Class Cards */}
      {!loading && filteredClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredClasses.map((item) => {
            const isComingSoon = !item.is_published;
            const accentBg = getAccentBg(item.id);

            return (
              <div
                key={item.id}
                className={`group bg-surface-container-lowest rounded-2xl border-4 border-on-surface transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isComingSoon
                    ? "shadow-[0_6px_0_#2e1a28] opacity-75 grayscale-[40%]"
                    : "shadow-[0_8px_0_#2e1a28] hover:-translate-y-2 hover:shadow-[0_12px_0_#2e1a28]"
                }`}
              >
                <div>
                  {/* Card Thumbnail */}
                  <div
                    className={`h-40 ${accentBg} border-b-4 border-on-surface p-5 flex flex-col justify-between relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full border-2 border-on-surface bg-white font-headline font-black text-[11px] shadow-[0_2px_0_#2e1a28] flex items-center gap-1.5">
                        {getCategoryIcon(item.category)}
                        <span>{item.category.replace("_", " ")}</span>
                      </span>

                      {isComingSoon ? (
                        <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant font-mono font-bold text-[11px] rounded-full border border-on-surface flex items-center gap-1 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          <span>Coming Soon</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-surface-container-lowest text-on-surface font-mono font-bold text-[11px] rounded-full border border-on-surface flex items-center gap-1 shadow-sm">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>+{item.xp_reward} XP</span>
                        </span>
                      )}
                    </div>

                    {/* Center Icon */}
                    <div className="flex items-center gap-3 z-10">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center shadow-[0_4px_0_#2e1a28] group-hover:scale-110 transition-transform">
                        {getCategoryThumbnailIcon(item.title, item.category)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface font-mono">
                          Tingkat: {item.difficulty_level}
                        </span>
                        <span className="text-[11px] text-on-surface-variant font-medium">
                          Estimasi: {item.estimated_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    {/* Title */}
                    {isComingSoon ? (
                      <h3 className="font-display font-black text-lg text-on-surface leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    ) : (
                      <Link href={`/classes/${item.id}`}>
                        <h3 className="font-display font-black text-lg text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                          {item.title}
                        </h3>
                      </Link>
                    )}

                    <p className="text-xs text-on-surface-variant font-medium line-clamp-2 leading-relaxed">
                      {item.tagline || item.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-on-surface-variant font-mono">
                        {isComingSoon ? "Dalam Pembuatan" : `${item.totalLevels} Level Tantangan`}
                      </span>

                      {item.isEnrolled && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                          {item.progressPercent}% Selesai
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-5 pt-0">
                  {isComingSoon ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-xl border-2 border-on-surface font-headline font-black text-xs text-on-surface-variant bg-surface-container-high cursor-not-allowed text-center"
                    >
                      Segera Hadir
                    </button>
                  ) : (
                    <Link href={`/classes/${item.id}`} className="block w-full">
                      <button className="w-full py-3 px-4 rounded-xl border-2 border-on-surface font-headline font-black text-xs text-white bg-primary hover:bg-[#ec4899] shadow-[0_3px_0_#2e1a28] flex items-center justify-center gap-2 group/btn transition-transform active:translate-y-0.5 cursor-pointer">
                        <span>{item.isEnrolled ? "Lanjutkan Belajar" : "Lihat Silabus & Mulai"}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
