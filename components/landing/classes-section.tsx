"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  Terminal,
  Clock,
  Flame,
  LayoutGrid,
  Layers,
  Sparkles,
  Compass,
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

  const getClassTheme = (id: string) => {
    if (id.includes("html")) {
      return {
        moduleLabel: "Modul 1: HTML Architecture",
        bgHeader: "bg-[#E0F2FE]",
        badgeColor: "bg-[#0284C7] text-white",
        icon: <Terminal className="w-8 h-8 text-[#0284C7]" />,
      };
    }
    if (id.includes("basics")) {
      return {
        moduleLabel: "Modul 2: CSS Basics",
        bgHeader: "bg-[#FEF08A]",
        badgeColor: "bg-[#EAB308] text-slate-900",
        icon: <Sparkles className="w-8 h-8 text-[#B45309]" />,
      };
    }
    if (id.includes("flexbox")) {
      return {
        moduleLabel: "Modul 3: CSS Flexbox",
        bgHeader: "bg-[#FECDD3]",
        badgeColor: "bg-[#EF4444] text-white",
        icon: <LayoutGrid className="w-8 h-8 text-[#DC2626]" />,
      };
    }
    if (id.includes("grid")) {
      return {
        moduleLabel: "Modul 4: CSS Grid",
        bgHeader: "bg-[#DCFCE7]",
        badgeColor: "bg-[#10B981] text-white",
        icon: <Layers className="w-8 h-8 text-[#059669]" />,
      };
    }
    if (id.includes("styling")) {
      return {
        moduleLabel: "Modul 5: Component Styling",
        bgHeader: "bg-[#EDE9FE]",
        badgeColor: "bg-[#8B5CF6] text-white",
        icon: <Sparkles className="w-8 h-8 text-[#7C3AED]" />,
      };
    }
    if (id.includes("tailwind")) {
      return {
        moduleLabel: "Modul 6: Tailwind CSS",
        bgHeader: "bg-[#CFFAFE]",
        badgeColor: "bg-[#06B6D4] text-white",
        icon: <LayoutGrid className="w-8 h-8 text-[#0891B2]" />,
      };
    }
    return {
      moduleLabel: "Modul Pembelajaran",
      bgHeader: "bg-[#FEF3C7]",
      badgeColor: "bg-[#F59E0B] text-slate-900",
      icon: <Terminal className="w-8 h-8 text-[#D97706]" />,
    };
  };

  return (
    <section className="py-20 px-4 bg-[#FFFDF7] max-w-6xl mx-auto scroll-mt-24 relative" id="classes">
      {/* Anchor alias for #curriculum */}
      <div id="curriculum" className="absolute -top-24" />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF08A] border-3 border-slate-900 text-slate-900 font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#0f172a] mb-4">
            <Compass className="w-4 h-4 text-[#D97706]" />
            <span>Kurikulum Interaktif • 6 Modul Lengkap</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
            Pilihan Kelas Pembelajaran
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
            Kurikulum terstruktur mulai dari pemahaman kerangka HTML, styling CSS, tata letak Flexbox dan Grid, hingga utility modern.
          </p>
        </div>

        {/* Akses Card */}
        <div className="bg-white border-3 border-slate-900 px-5 py-3 rounded-2xl shadow-[0_5px_0_#0f172a] flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#DCFCE7] border-2 border-slate-900 flex items-center justify-center text-[#15803D]">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status Akses
            </p>
            <p className="font-display font-black text-sm text-[#15803D]">
              100% Gratis &amp; Terbuka
            </p>
          </div>
        </div>
      </div>

      {/* Structured Roadmap Feature Banner */}
      <div className="mb-12 rounded-3xl border-4 border-slate-900 overflow-hidden bg-gradient-to-r from-amber-100 via-sky-100 to-rose-100 shadow-[0_10px_0_#0f172a] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EF4444] text-white font-mono font-black text-xs border-2 border-slate-900 mb-3 shadow-[0_2px_0_#0f172a]">
              ALUR BELAJAR BERTAHAP
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
              Kurikulum Terstruktur dari Dasar hingga Mahir
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              Pelajari konsep web development mulai dari kerangka dasar, styling visual, tata letak satu dimensi dan dua dimensi, hingga perakitan antarmuka pengguna nyata.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-800">
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-900 shadow-sm">72 Level Interaktif</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-900 shadow-sm">6 Modul Utama</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-900 shadow-sm">Latihan Praktik Langsung</span>
            </div>
          </div>
          <div className="md:col-span-5 p-4 flex justify-center">
            <div className="rounded-2xl border-3 border-slate-900 overflow-hidden shadow-[0_6px_0_#0f172a] max-w-sm w-full bg-white">
              <Image
                src="/images/kids-adventure-map.jpg"
                alt="Codevas Learning Roadmap Illustration"
                width={500}
                height={300}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-2">
        {[
          { key: "ALL", label: "Semua Kategori", color: "hover:bg-[#FEF08A]" },
          { key: "LIVE_CODE", label: "Live Code", color: "hover:bg-[#BAE6FD]" },
          { key: "DRAG_DROP", label: "Drag & Drop", color: "hover:bg-[#FED7AA]" },
          { key: "QUIZ", label: "Kuis Teori", color: "hover:bg-[#FECDD3]" },
        ].map((tab) => {
          const isActive = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key as any)}
              className={`px-5 py-2.5 rounded-2xl font-display font-black text-xs sm:text-sm border-3 border-slate-900 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#EF4444] text-white shadow-[0_5px_0_#0f172a] -translate-y-1"
                  : `bg-white text-slate-800 ${tab.color} shadow-[0_3px_0_#0f172a]`
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Class Cards */}
      {!loading && filteredClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((item) => {
            const isComingSoon = !item.is_published;
            const theme = getClassTheme(item.id);

            return (
              <div
                key={item.id}
                className={`group bg-white rounded-3xl border-4 border-slate-900 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isComingSoon
                    ? "shadow-[0_6px_0_#0f172a] opacity-75"
                    : "shadow-[0_10px_0_#0f172a] hover:-translate-y-2 hover:shadow-[0_14px_0_#0f172a]"
                }`}
              >
                <div>
                  {/* Card Header Thumbnail */}
                  <div className={`h-40 ${theme.bgHeader} border-b-4 border-slate-900 p-5 flex flex-col justify-between relative`}>
                    <div className="flex items-center justify-between z-10">
                      <span className={`px-3 py-1 rounded-full border-2 border-slate-900 ${theme.badgeColor} font-display font-black text-[11px] shadow-[0_2px_0_#0f172a]`}>
                        {theme.moduleLabel}
                      </span>

                      {isComingSoon ? (
                        <span className="px-2.5 py-1 bg-white text-slate-600 font-mono font-bold text-[11px] rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Segera Hadir</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#FEF08A] text-slate-900 font-mono font-black text-[11px] rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-sm">
                          <Flame className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                          <span>+{item.xp_reward} XP</span>
                        </span>
                      )}
                    </div>

                    {/* Big Module Icon */}
                    <div className="flex items-center gap-3.5 z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-900 flex items-center justify-center shadow-[0_4px_0_#0f172a] group-hover:scale-110 transition-transform">
                        {theme.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 font-mono">
                          Tingkat: {item.difficulty_level}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          Estimasi: {item.estimated_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    {isComingSoon ? (
                      <h3 className="font-display font-black text-xl text-slate-700 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    ) : (
                      <Link href={`/classes/${item.id}`}>
                        <h3 className="font-display font-black text-xl text-slate-900 leading-snug group-hover:text-[#EF4444] transition-colors line-clamp-2 cursor-pointer">
                          {item.title}
                        </h3>
                      </Link>
                    )}

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {item.tagline || item.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 font-mono">
                        {item.totalLevels} Level Pembelajaran
                      </span>

                      {item.isEnrolled && (
                        <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-400">
                          {item.progressPercent}% Selesai
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-6 pt-0">
                  {isComingSoon ? (
                    <div
                      className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-300 font-display font-black text-xs text-slate-400 bg-slate-100 cursor-not-allowed text-center select-none"
                    >
                      Segera Hadir
                    </div>
                  ) : (
                    <Link
                      href={`/classes/${item.id}`}
                      className="w-full py-3.5 px-4 rounded-2xl border-3 border-slate-900 font-display font-black text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_4px_0_#1e3a8a] flex items-center justify-center gap-2 group/btn transition-transform active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                      <span>{item.isEnrolled ? "Lanjutkan Kelas" : "Mulai Kelas"}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State when category has no classes */}
      {!loading && filteredClasses.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border-3 border-dashed border-slate-300">
          <p className="font-display font-bold text-slate-700 text-base">
            Belum ada kelas yang tersedia untuk kategori ini.
          </p>
          <button
            onClick={() => setSelectedCategory("ALL")}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#FEF08A] border-2 border-slate-900 text-xs font-display font-black text-slate-900 shadow-[0_2px_0_#0f172a] hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            Tampilkan Semua Kategori
          </button>
        </div>
      )}
    </section>
  );
};
