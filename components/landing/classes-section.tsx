"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Star,
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

  const getKidFriendlyTheme = (id: string, title: string) => {
    if (id.includes("html")) {
      return {
        islandName: "Pulau 1: Kerangka Istana Web 🏝️",
        emoji: "🏰",
        bgHeader: "bg-[#E0F2FE]",
        badgeColor: "bg-[#0284C7] text-white",
        borderColor: "border-[#38BDF8]",
      };
    }
    if (id.includes("basics")) {
      return {
        islandName: "Pulau 2: Pelukis Warna Ajaib 🎨",
        emoji: "🎨",
        bgHeader: "bg-[#FEF08A]",
        badgeColor: "bg-[#EAB308] text-slate-900",
        borderColor: "border-[#FACC15]",
      };
    }
    if (id.includes("flexbox")) {
      return {
        islandName: "Pulau 3: Robot & Permen Lincah 🍬",
        emoji: "🍬",
        bgHeader: "bg-[#FECDD3]",
        badgeColor: "bg-[#EF4444] text-white",
        borderColor: "border-[#F87171]",
      };
    }
    if (id.includes("grid")) {
      return {
        islandName: "Pulau 4: Kotak Harta Karun 🧩",
        emoji: "🧩",
        bgHeader: "bg-[#DCFCE7]",
        badgeColor: "bg-[#10B981] text-white",
        borderColor: "border-[#4ADE80]",
      };
    }
    if (id.includes("styling")) {
      return {
        islandName: "Pulau 5: Tombol Menyala & Kaca 🪄",
        emoji: "🪄",
        bgHeader: "bg-[#EDE9FE]",
        badgeColor: "bg-[#8B5CF6] text-white",
        borderColor: "border-[#A78BFA]",
      };
    }
    if (id.includes("tailwind")) {
      return {
        islandName: "Pulau 6: Jurus Koding Kilat ⚡",
        emoji: "⚡",
        bgHeader: "bg-[#CFFAFE]",
        badgeColor: "bg-[#06B6D4] text-white",
        borderColor: "border-[#22D3EE]",
      };
    }
    return {
      islandName: "Pulau Petualangan 🌟",
      emoji: "🎮",
      bgHeader: "bg-[#FEF3C7]",
      badgeColor: "bg-[#F59E0B] text-slate-900",
      borderColor: "border-[#FCD34D]",
    };
  };

  return (
    <section className="py-20 px-4 bg-[#FFFDF7] max-w-6xl mx-auto" id="classes">
      {/* Header Section with Kid Theme */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF08A] border-3 border-slate-900 text-slate-900 font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#0f172a] mb-4">
            <Compass className="w-4 h-4 text-[#D97706]" />
            <span>Peta Petualangan Koding Cilik • 6 Pulau Ajaib</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
            Pilih Misimu &amp; Jelajahi Dunianya! 🗺️✨
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
            Setiap kelas adalah sebuah pulau petualangan berisi 12 level seru. Mulai dari membangun istana HTML sampai menggerakkan robot permen!
          </p>
        </div>

        {/* Akses Card */}
        <div className="bg-white border-3 border-slate-900 px-5 py-3 rounded-2xl shadow-[0_5px_0_#0f172a] flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#DCFCE7] border-2 border-slate-900 flex items-center justify-center text-2xl font-black">
            🎁
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status Akses Belajar
            </p>
            <p className="font-display font-black text-sm text-[#15803D]">
              100% Gratis &amp; Terbuka
            </p>
          </div>
        </div>
      </div>

      {/* World Map Feature Showcase Banner */}
      <div className="mb-12 rounded-3xl border-4 border-slate-900 overflow-hidden bg-gradient-to-r from-amber-100 via-sky-100 to-rose-100 shadow-[0_10px_0_#0f172a] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EF4444] text-white font-mono font-black text-xs border-2 border-slate-900 mb-3 shadow-[0_2px_0_#0f172a]">
              PETA LEVEL 3D DUNIA CODEVAS
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
              Kumpulkan Bintang Emas &amp; Buka Kunci Harta Karun! 🌟
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              Jalani misi dari pulau ke pulau. Setiap kali berhasil menulis balok kode yang benar, roketmu akan meluncur dan pulau berikutnya terbuka!
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-800">
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-900 shadow-sm">🏰 72 Level Total</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-900 shadow-sm">🍬 6 Boss Fight Epik</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-900 shadow-sm">🏆 100% Mode Santai</span>
            </div>
          </div>
          <div className="md:col-span-5 p-4 flex justify-center">
            <div className="rounded-2xl border-3 border-slate-900 overflow-hidden shadow-[0_6px_0_#0f172a] max-w-sm w-full bg-white">
              <Image
                src="/images/kids-adventure-map.jpg"
                alt="Codevas Kids World Adventure Map"
                width={500}
                height={300}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Toy Style) */}
      <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-2">
        {[
          { key: "ALL", label: "🌟 Semua Pulau", color: "hover:bg-[#FEF08A]" },
          { key: "LIVE_CODE", label: "🎮 Live Code Ajaib", color: "hover:bg-[#BAE6FD]" },
          { key: "DRAG_DROP", label: "🧩 Balok Visual", color: "hover:bg-[#FED7AA]" },
          { key: "QUIZ", label: "❓ Kuis Tebak Ceria", color: "hover:bg-[#FECDD3]" },
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
            const theme = getKidFriendlyTheme(item.id, item.title);

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
                        {theme.islandName}
                      </span>

                      {isComingSoon ? (
                        <span className="px-2.5 py-1 bg-white text-slate-600 font-mono font-bold text-[11px] rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Segera Hadir</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#FEF08A] text-slate-900 font-mono font-black text-[11px] rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                          <span>+{item.xp_reward} XP</span>
                        </span>
                      )}
                    </div>

                    {/* Big Island Emoji Icon */}
                    <div className="flex items-center gap-3.5 z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[0_4px_0_#0f172a] group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        {theme.emoji}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 font-mono">
                          Tingkat: {item.difficulty_level}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          Waktu santai: {item.estimated_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <Link href={`/classes/${item.id}`}>
                      <h3 className="font-display font-black text-xl text-slate-900 leading-snug group-hover:text-[#EF4444] transition-colors line-clamp-2 cursor-pointer">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {item.tagline || item.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 font-mono flex items-center gap-1">
                        <span>🎯</span>
                        <span>{item.totalLevels} Misi Petualangan</span>
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
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-2xl border-2 border-slate-900 font-display font-black text-xs text-slate-400 bg-slate-100 cursor-not-allowed text-center"
                    >
                      Pulau Masih Dibangun 🚧
                    </button>
                  ) : (
                    <Link href={`/classes/${item.id}`} className="block w-full">
                      <button className="w-full py-3.5 px-4 rounded-2xl border-3 border-slate-900 font-display font-black text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_4px_0_#1e3a8a] flex items-center justify-center gap-2 group/btn transition-transform active:translate-y-0.5 active:shadow-none cursor-pointer">
                        <span>{item.isEnrolled ? "Lanjutkan Petualangan 🚀" : "Mulai Jelajahi Pulau ➔"}</span>
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
