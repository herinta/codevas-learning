"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
  Terminal,
  Clock,
  Lock,
  Puzzle,
  Flame,
  LayoutGrid,
  Boxes,
  HelpCircle,
} from "lucide-react";
import { CLASSES_LIST, ClassCategory } from "@/lib/classes-data";

export const ClassesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "ALL" | ClassCategory
  >("ALL");

  const filteredClasses =
    selectedCategory === "ALL"
      ? CLASSES_LIST
      : CLASSES_LIST.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (cat: ClassCategory) => {
    switch (cat) {
      case "LIVE_CODE":
        return <Terminal className="w-4 h-4 text-primary" />;
      case "DRAG_DROP":
        return <Boxes className="w-4 h-4 text-amber-600" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4 text-secondary" />;
    }
  };

  const getCategoryThumbnailIcon = (title: string, cat: ClassCategory) => {
    if (title.includes("Flexbox")) return <LayoutGrid className="w-8 h-8 text-primary" />;
    if (title.includes("Grid")) return <Layers className="w-8 h-8 text-emerald-600" />;
    if (title.includes("Styling")) return <Sparkles className="w-8 h-8 text-secondary" />;
    if (cat === "DRAG_DROP") return <Boxes className="w-8 h-8 text-amber-600" />;
    return <HelpCircle className="w-8 h-8 text-secondary" />;
  };

  return (
    <section className="py-24 px-4 bg-surface max-w-6xl mx-auto" id="curriculum">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          {/* Badge Langganan */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed border-2 border-on-surface text-secondary font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#2e1a28] mb-4">
            <Sparkles className="w-4 h-4 text-secondary fill-secondary-container" />
            <span>Sistem Langganan All-Access • 3 Kategori Pembelajaran</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight">
            Belajar Design &amp; Web Development
          </h2>
          <p className="mt-3 text-base sm:text-lg text-on-surface-variant font-medium max-w-2xl leading-relaxed">
            Kurikulum terstruktur ke dalam 3 metode pendekatan belajar:{" "}
            <strong>Live Code</strong>, <strong>Visual Logic (Drag &amp; Drop)</strong>, dan{" "}
            <strong>Theory (Multiple Choice)</strong>. Semua modul sudah termasuk dalam satu
            paket langganan aktif!
          </p>
        </div>

        {/* Highlight Akses Subs Card */}
        <div className="bg-surface-container-lowest border-2 border-on-surface px-5 py-3 rounded-2xl shadow-[0_4px_0_#2e1a28] flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-on-surface flex items-center justify-center text-emerald-700 font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Akses Langganan
            </p>
            <p className="font-display font-black text-sm text-emerald-700">
              Semua Kategori Termasuk ✨
            </p>
          </div>
        </div>
      </div>

      {/* 3 Main Categories Filter Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
          { key: "ALL", label: "Semua Kategori", count: CLASSES_LIST.length },
          { key: "LIVE_CODE", label: "Live Code (Fokus MVP)", count: 3 },
          { key: "DRAG_DROP", label: "Visual Logic (Drag & Drop)", count: 3 },
          { key: "QUIZ", label: "Theory (Multiple Choice)", count: 3 },
        ].map((tab) => {
          const isActive = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key as any)}
              className={`px-5 py-2.5 rounded-full font-headline font-bold text-sm border-2 border-on-surface transition-all whitespace-nowrap active:translate-y-0.5 flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-white shadow-[0_4px_0_#2e1a28] scale-[1.02]"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_2px_0_#2e1a28]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive
                    ? "bg-white text-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredClasses.map((item) => {
          const isComingSoon = item.status === "coming-soon";

          return (
            <div
              key={item.id}
              className={`group bg-surface-container-lowest rounded-2xl border-4 border-on-surface transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isComingSoon
                  ? "shadow-[0_6px_0_#2e1a28] opacity-95"
                  : "shadow-[0_8px_0_#2e1a28] hover:-translate-y-2 hover:shadow-[0_12px_0_#2e1a28]"
              }`}
            >
              <div>
                {/* Card Thumbnail Visual Mockup */}
                <div
                  className={`h-44 ${item.accentBg} border-b-4 border-on-surface p-5 flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Background Soft Glow */}
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/40 blur-md pointer-events-none"></div>

                  {/* Top Row on Thumbnail */}
                  <div className="flex items-center justify-between z-10">
                    <span
                      className={`px-3 py-1 rounded-full border-2 border-on-surface font-headline font-black text-[11px] shadow-[0_2px_0_#2e1a28] flex items-center gap-1.5 ${item.stageColor}`}
                    >
                      {getCategoryIcon(item.category)}
                      <span>{item.categoryLabel}</span>
                    </span>

                    {isComingSoon ? (
                      <span className="px-2.5 py-1 bg-surface-container-lowest text-on-surface-variant font-mono font-bold text-[11px] rounded-full border border-on-surface flex items-center gap-1 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-secondary" />
                        <span>Coming Soon</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-surface-container-lowest text-on-surface font-mono font-bold text-[11px] rounded-full border border-on-surface flex items-center gap-1 shadow-sm">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>+{item.xpReward} XP</span>
                      </span>
                    )}
                  </div>

                  {/* Center Visual Icon & Tag Chips */}
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center shadow-[0_4px_0_#2e1a28] group-hover:scale-110 transition-transform">
                      {getCategoryThumbnailIcon(item.title, item.category)}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-surface-container-lowest/90 text-on-surface font-mono text-[10px] font-bold border border-outline-variant"
                        >
                          {t}
                        </span>
                      ))}
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
                    {item.tagline}
                  </p>

                  {/* Subscription Badge (No Price!) */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-500 rounded-full text-xs font-headline font-black shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>Termasuk dalam Langganan</span>
                    </div>

                    <span className="text-xs font-bold text-on-surface-variant font-mono">
                      {isComingSoon ? "Segera Rilis" : `${item.modulesCount} Level`}
                    </span>
                  </div>

                  {/* Rating & Difficulty Level (BuildWithAngga Style) */}
                  <div className="pt-3 border-t-2 border-surface-container-high flex items-center justify-between text-xs">
                    {/* Stars & Reviews */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="font-bold text-on-surface">
                        {item.rating}
                      </span>
                      <span className="text-on-surface-variant font-medium">
                        ({item.reviewsCount})
                      </span>
                    </div>

                    {/* Difficulty Level Bar */}
                    <div
                      className="flex items-center gap-1.5 text-on-surface font-bold text-xs"
                      title={`Tingkat: ${item.level}`}
                    >
                      <div className="flex items-end gap-0.5 h-4">
                        <span
                          className={`w-1 rounded-sm ${
                            item.levelBars >= 1
                              ? "bg-primary h-2"
                              : "bg-outline-variant h-2"
                          }`}
                        ></span>
                        <span
                          className={`w-1 rounded-sm ${
                            item.levelBars >= 2
                              ? "bg-primary h-3"
                              : "bg-outline-variant h-3"
                          }`}
                        ></span>
                        <span
                          className={`w-1 rounded-sm ${
                            item.levelBars >= 3
                              ? "bg-primary h-4"
                              : "bg-outline-variant h-4"
                          }`}
                        ></span>
                      </div>
                      <span className="text-[11px] font-label text-on-surface-variant">
                        {item.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 pb-5 pt-1">
                {isComingSoon ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-on-surface-variant font-label font-bold text-xs border-2 border-outline-variant flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Segera Hadir (Tahap Berikutnya)</span>
                  </button>
                ) : (
                  <Link
                    href={`/classes/${item.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-primary hover:text-white text-on-surface font-label font-bold text-xs border-2 border-on-surface shadow-[0_2px_0_#2e1a28] flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all text-center"
                  >
                    <span>Mulai Belajar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Banner CTA under Classes */}
      <div className="mt-14 bg-gradient-to-r from-primary-fixed via-secondary-fixed to-tertiary-fixed rounded-2xl border-4 border-on-surface p-6 sm:p-8 shadow-[0_8px_0_#2e1a28] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-display font-black text-xl sm:text-2xl text-on-surface">
            Buka Seluruh 3 Kategori Kelas Tanpa Batas!
          </h4>
          <p className="font-body text-sm text-on-surface-variant font-medium">
            Satu langganan aktif mencakup modul <strong>Live Code</strong>,{" "}
            <strong>Visual Logic Drag &amp; Drop</strong>, serta kuis{" "}
            <strong>Theory</strong> dengan live playground tanpa biaya per modul.
          </p>
        </div>
        <Link
          href="/register"
          className="px-6 py-3 rounded-full bg-primary text-white font-headline font-black text-sm border-2 border-on-surface shadow-[0_4px_0_#2e1a28] hover:scale-105 active:translate-y-0.5 transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>Daftar &amp; Langganan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
