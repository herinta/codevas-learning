"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
  Palette,
  Terminal,
  Cpu,
  Flame,
} from "lucide-react";

interface ClassItem {
  id: string;
  category: "all" | "html-css" | "javascript" | "react" | "fullstack";
  title: string;
  stage: string;
  stageColor: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  levelBars: number; // 1 = low, 2 = mid, 3 = high
  rating: number;
  reviews: number;
  missionsCount: number;
  xpReward: number;
  accentBg: string;
  icon: React.ReactNode;
  tags: string[];
}

const CLASSES_DATA: ClassItem[] = [
  {
    id: "css-flexbox-magic",
    category: "html-css",
    title: "CSS Styling & Flexbox Magic: Menguasai Tata Letak Modern",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#ffd6ee] text-[#a02070]",
    level: "Pemula",
    levelBars: 1,
    rating: 4.9,
    reviews: 636,
    missionsCount: 20,
    xpReward: 180,
    accentBg: "bg-primary-fixed",
    icon: <Palette className="w-8 h-8 text-primary" />,
    tags: ["Flexbox", "Box Model", "Alignment"],
  },
  {
    id: "html5-semantic-structure",
    category: "html-css",
    title: "HTML5 Semantic & Structure: Pondasi Web Standar W3C",
    stage: "Stage 1: The Architect",
    stageColor: "bg-[#d4f8e8] text-[#1b5e20]",
    level: "Pemula",
    levelBars: 1,
    rating: 4.9,
    reviews: 512,
    missionsCount: 15,
    xpReward: 120,
    accentBg: "bg-emerald-100",
    icon: <Code2 className="w-8 h-8 text-emerald-600" />,
    tags: ["Semantics", "SEO", "Accessibility"],
  },
  {
    id: "css-grid-animations",
    category: "html-css",
    title: "CSS Grid & Creative Animations: Layout 2 Dimensi Kompleks",
    stage: "Stage 2: The Artist",
    stageColor: "bg-[#eedcff] text-[#7c52aa]",
    level: "Menengah",
    levelBars: 2,
    rating: 4.9,
    reviews: 418,
    missionsCount: 18,
    xpReward: 220,
    accentBg: "bg-secondary-fixed",
    icon: <Layers className="w-8 h-8 text-secondary" />,
    tags: ["CSS Grid", "Keyframes", "Micro-interactions"],
  },
  {
    id: "javascript-dom-interactivity",
    category: "javascript",
    title: "JavaScript DOM & Interactivity: Manipulasi Web secara Real-Time",
    stage: "Stage 3: The Masterpiece",
    stageColor: "bg-[#FEF08A] text-[#854d0e]",
    level: "Pemula",
    levelBars: 1,
    rating: 4.8,
    reviews: 742,
    missionsCount: 25,
    xpReward: 250,
    accentBg: "bg-amber-100",
    icon: <Terminal className="w-8 h-8 text-amber-600" />,
    tags: ["Event Listeners", "DOM API", "State Basics"],
  },
  {
    id: "react-19-component-engineering",
    category: "react",
    title: "React 19 & Tailwind CSS: Membangun Komponen Reaktif Siap Pakai",
    stage: "Stage 2: The Artist",
    stageColor: "bg-[#c8eaff] text-[#006080]",
    level: "Menengah",
    levelBars: 2,
    rating: 5.0,
    reviews: 890,
    missionsCount: 28,
    xpReward: 350,
    accentBg: "bg-tertiary-fixed",
    icon: <Cpu className="w-8 h-8 text-tertiary" />,
    tags: ["Components", "Hooks", "Props"],
  },
  {
    id: "fullstack-ui-engine",
    category: "fullstack",
    title: "Full-Stack Web App: Next.js App Router & Server Components",
    stage: "Stage 3: The Masterpiece",
    stageColor: "bg-[#ffd6ee] text-[#9d174d]",
    level: "Lanjutan",
    levelBars: 3,
    rating: 4.9,
    reviews: 320,
    missionsCount: 32,
    xpReward: 500,
    accentBg: "bg-pink-100",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    tags: ["Next.js", "Server Actions", "PostgreSQL"],
  },
];

export const ClassesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "html-css" | "javascript" | "react" | "fullstack"
  >("all");

  const filteredClasses =
    selectedCategory === "all"
      ? CLASSES_DATA
      : CLASSES_DATA.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-24 px-4 bg-surface max-w-6xl mx-auto" id="curriculum">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          {/* Badge Langganan */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed border-2 border-on-surface text-secondary font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#2e1a28] mb-4">
            <Sparkles className="w-4 h-4 text-secondary fill-secondary-container" />
            <span>Sistem Langganan All-Access • Bebas Akses Semua Kelas</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight">
            Belajar Design &amp; Web Development
          </h2>
          <p className="mt-3 text-base sm:text-lg text-on-surface-variant font-medium max-w-2xl leading-relaxed">
            Tidak ada biaya per modul. Cukup satu langganan aktif untuk membuka
            seluruh alur belajar, kuis live syntax, dan sandbox tanpa batasan!
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
              Semua Modul Termasuk ✨
            </p>
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
          { key: "all", label: "Semua Kelas" },
          { key: "html-css", label: "HTML & CSS Visual" },
          { key: "javascript", label: "JavaScript Core" },
          { key: "react", label: "React 19 & Components" },
          { key: "fullstack", label: "Fullstack UI App" },
        ].map((tab) => {
          const isActive = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key as any)}
              className={`px-5 py-2.5 rounded-full font-headline font-bold text-sm border-2 border-on-surface transition-all whitespace-nowrap active:translate-y-0.5 ${
                isActive
                  ? "bg-primary text-white shadow-[0_4px_0_#2e1a28] scale-[1.02]"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_2px_0_#2e1a28]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="group bg-surface-container-lowest rounded-2xl border-4 border-on-surface shadow-[0_8px_0_#2e1a28] hover:-translate-y-2 hover:shadow-[0_12px_0_#2e1a28] transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Card Thumbnail Visual Mockup */}
              <div
                className={`h-44 ${item.accentBg} border-b-4 border-on-surface p-5 flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/40 blur-md pointer-events-none"></div>

                {/* Top Row on Thumbnail */}
                <div className="flex items-center justify-between z-10">
                  <span
                    className={`px-3 py-1 rounded-full border-2 border-on-surface font-headline font-black text-[11px] shadow-[0_2px_0_#2e1a28] ${item.stageColor}`}
                  >
                    {item.stage}
                  </span>
                  <span className="px-2.5 py-1 bg-surface-container-lowest text-on-surface font-mono font-bold text-[11px] rounded-full border border-on-surface flex items-center gap-1 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>+{item.xpReward} XP</span>
                  </span>
                </div>

                {/* Center Visual Icon & Live Badges */}
                <div className="flex items-center gap-3 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center shadow-[0_4px_0_#2e1a28] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-surface-container-lowest/80 text-on-surface font-mono text-[10px] font-bold border border-outline-variant"
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
                <Link href={`/classes/${item.id}`}>
                  <h3 className="font-display font-black text-lg text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                    {item.title}
                  </h3>
                </Link>

                {/* Subscription Badge (No Price, All-Access Subs!) */}
                <div className="flex items-center justify-between pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-500 rounded-full text-xs font-headline font-black shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Termasuk dalam Langganan</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant font-mono">
                    {item.missionsCount} Misi
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
                      ({item.reviews})
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
                          item.levelBars >= 1 ? "bg-primary h-2" : "bg-outline-variant h-2"
                        }`}
                      ></span>
                      <span
                        className={`w-1 rounded-sm ${
                          item.levelBars >= 2 ? "bg-primary h-3" : "bg-outline-variant h-3"
                        }`}
                      ></span>
                      <span
                        className={`w-1 rounded-sm ${
                          item.levelBars >= 3 ? "bg-primary h-4" : "bg-outline-variant h-4"
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
              <Link
                href={`/classes/${item.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-primary hover:text-white text-on-surface font-label font-bold text-xs border-2 border-on-surface shadow-[0_2px_0_#2e1a28] flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all text-center"
              >
                <span>Mulai Belajar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Banner CTA under Classes */}
      <div className="mt-14 bg-gradient-to-r from-primary-fixed via-secondary-fixed to-tertiary-fixed rounded-2xl border-4 border-on-surface p-6 sm:p-8 shadow-[0_8px_0_#2e1a28] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-display font-black text-xl sm:text-2xl text-on-surface">
            Buka Seluruh Akses Kelas Tanpa Batas!
          </h4>
          <p className="font-body text-sm text-on-surface-variant font-medium">
            Langganan sekali untuk belajar HTML, CSS, JavaScript, hingga React
            dengan live playground tanpa biaya per kelas.
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
