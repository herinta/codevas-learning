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
  Layers,
  BookOpen,
  Star,
  Compass,
} from "lucide-react";
import { ClassCategory } from "@/lib/db/entities";

interface CatalogClass {
  id: string;
  category: ClassCategory;
  title: string;
  description: string;
  levelCount: number;
  xpReward: number;
  isPublished: boolean;
  difficulty: "EASY" | "MEDIUM" | "ADVANCED";
  topics: string[];
}

const ALL_CLASSES_CATALOG: CatalogClass[] = [
  // 1. LIVE CODE
  {
    id: "css-flexbox",
    category: "LIVE_CODE",
    title: "CSS Flexbox Mastery",
    description: "Kuasai tata letak fleksibel modern secara visual melalui 10 level tantangan dengan validasi visual seketika.",
    levelCount: 10,
    xpReward: 150,
    isPublished: true,
    difficulty: "EASY",
    topics: ["display: flex", "justify-content", "align-items", "flex-direction", "gap & centering div"],
  },
  {
    id: "css-grid",
    category: "LIVE_CODE",
    title: "CSS Grid Architecture",
    description: "Bangun struktur 2D layout kompleks, sistem dashboard bento box, dan responsive grid modern.",
    levelCount: 10,
    xpReward: 200,
    isPublished: true,
    difficulty: "MEDIUM",
    topics: ["grid-template-columns", "col-span & row-span", "order & alignment", "place-items-center", "bento box UI"],
  },
  {
    id: "component-styling",
    category: "LIVE_CODE",
    title: "Component Styling & Design Tokens",
    description: "Desain komponen web modern dengan utility classes Candy Light Mode, glassmorphism, dan pill badges.",
    levelCount: 8,
    xpReward: 180,
    isPublished: false,
    difficulty: "EASY",
    topics: ["Design Tokens", "Pill Badges", "Glass Cards", "Neo-brutalist Shadows"],
  },
  {
    id: "react-next-basics",
    category: "LIVE_CODE",
    title: "React & Next.js Basics",
    description: "Komposisi komponen modular, pemisahan Server dan Client Component, serta hooks state modern.",
    levelCount: 12,
    xpReward: 300,
    isPublished: false,
    difficulty: "MEDIUM",
    topics: ["Props & Interfaces", "useState & useEffect", "Custom Hooks", "Clean Architecture"],
  },

  // 2. VISUAL LOGIC
  {
    id: "js-logic-blocks",
    category: "DRAG_DROP",
    title: "JavaScript Logic Blocks",
    description: "Latih logika pemrograman, percabangan, dan perulangan menggunakan visual drag-and-drop tanpa risiko syntax error.",
    levelCount: 15,
    xpReward: 250,
    isPublished: false,
    difficulty: "EASY",
    topics: ["If/Else Conditions", "Loops & Arrays", "Data Mapping", "Event Handling"],
  },
  {
    id: "css-layout-hierarchy",
    category: "DRAG_DROP",
    title: "CSS Layouting Hierarchy",
    description: "Asah insting penataan pohon DOM dan hierarki box model secara visual.",
    levelCount: 10,
    xpReward: 160,
    isPublished: false,
    difficulty: "EASY",
    topics: ["Parent-Child Rel", "Box Sizing", "Nesting Containers", "Z-Index Flow"],
  },

  // 3. THEORY QUIZ
  {
    id: "css-selectors-quiz",
    category: "QUIZ",
    title: "CSS Selectors & Specificity",
    description: "Uji pemahaman selektor tingkat lanjut, pseudo-classes, dan hierarki specificity tanpa ragu.",
    levelCount: 20,
    xpReward: 120,
    isPublished: false,
    difficulty: "EASY",
    topics: ["Combinators (> + ~)", "Pseudo-classes (:hover, :focus)", "Specificity Score", "Attribute Matching"],
  },
  {
    id: "html-semantic-quiz",
    category: "QUIZ",
    title: "HTML5 Semantic Architecture",
    description: "Pahami struktur dokumen web yang ramah aksesibilitas dan standar W3C.",
    levelCount: 15,
    xpReward: 100,
    isPublished: false,
    difficulty: "EASY",
    topics: ["Header/Main/Footer", "Article vs Section", "ARIA Labels", "Form Controls"],
  },
];

export default function AllClassesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [enrolledClassIds, setEnrolledClassIds] = useState<string[]>(["css-flexbox"]);
  const [loadingEnrollId, setLoadingEnrollId] = useState<string | null>(null);

  // Fetch current user enrollments
  useEffect(() => {
    fetch("/api/enrollments?userId=b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.enrolledClassIds)) {
          setEnrolledClassIds(data.data.enrolledClassIds);
        }
      })
      .catch((err) => console.warn("Failed fetching enrollments:", err));
  }, []);

  // Handle Enrollment
  const handleEnroll = async (classId: string) => {
    setLoadingEnrollId(classId);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
          classId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledClassIds((prev) => [...prev, classId]);
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setLoadingEnrollId(null);
    }
  };

  const filteredClasses = ALL_CLASSES_CATALOG.filter((c) => {
    if (selectedCategory === "ALL") return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Main Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-primary font-black">Silabus Semua Kelas</span>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-black text-secondary hover:underline flex items-center gap-1"
          >
            <span>Buka Dashboard Saya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary-fixed via-secondary-fixed to-tertiary-fixed rounded-3xl p-6 sm:p-10 border-2 border-on-surface candy-card-shadow mb-8 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface rounded-full border-2 border-on-surface text-xs font-black text-primary mb-3 candy-card-shadow">
              <Compass className="w-3.5 h-3.5" />
              <span>Silabus Kurikulum Lengkap</span>
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-on-surface leading-tight">
              Katalog Silabus Semua Kelas 📚
            </h1>
            <p className="mt-3 text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
              Jelajahi seluruh kelas pembelajaran terstruktur. Pilih kelas yang ingin kamu pelajari, lakukan enroll, dan mulai asah insting ngodingmu lewat kanvas visual!
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-8">
          {[
            { id: "ALL", label: "Semua Kelas (8)", icon: <Layers className="w-4 h-4" /> },
            { id: "LIVE_CODE", label: "Live Code HTML/CSS (4)", icon: <Code2 className="w-4 h-4" /> },
            { id: "DRAG_DROP", label: "Visual Logic (2)", icon: <Puzzle className="w-4 h-4" /> },
            { id: "QUIZ", label: "Theory Quiz (2)", icon: <HelpCircle className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-display font-bold text-xs sm:text-sm border-2 border-on-surface candy-btn-shadow whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-white scale-[1.02]"
                    : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((c) => {
            const isEnrolled = enrolledClassIds.includes(c.id);

            return (
              <div
                key={c.id}
                className={`bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-6 candy-card-shadow flex flex-col justify-between transition-all duration-200 ${
                  c.isPublished
                    ? "hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2e1a28]"
                    : "opacity-80"
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border-2 border-on-surface ${
                        c.category === "LIVE_CODE"
                          ? "bg-emerald-100 text-emerald-900"
                          : c.category === "DRAG_DROP"
                          ? "bg-purple-100 text-purple-900"
                          : "bg-sky-100 text-sky-900"
                      }`}
                    >
                      {c.category === "LIVE_CODE"
                        ? "Live Code"
                        : c.category === "DRAG_DROP"
                        ? "Visual Logic"
                        : "Theory Quiz"}
                    </span>

                    <span className="text-xs font-bold text-on-surface-variant">
                      {c.levelCount} Level
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-black text-xl text-on-surface leading-snug">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs text-on-surface-variant font-medium leading-relaxed">
                    {c.description}
                  </p>

                  {/* Syllabus / Topic Preview */}
                  <div className="mt-4 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="flex items-center gap-1.5 text-xs font-black text-secondary mb-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Cakupan Silabus:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-on-surface-variant">
                      {c.topics.slice(0, 3).map((topic, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{topic}</span>
                        </li>
                      ))}
                      {c.topics.length > 3 && (
                        <li className="text-[11px] font-bold text-primary pl-3">
                          + {c.topics.length - 3} topik lainnya
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t-2 border-surface-container-high flex items-center justify-between gap-3">
                  <span className="text-xs font-black text-secondary flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                    <span>+{c.xpReward} XP</span>
                  </span>

                  {c.isPublished ? (
                    isEnrolled ? (
                      <Link
                        href={`/classes/${c.id}`}
                        className="px-4 py-2 bg-emerald-500 text-white font-display font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow flex items-center gap-1.5 hover:scale-105 transition-transform"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Buka Silabus</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(c.id)}
                        disabled={loadingEnrollId === c.id}
                        className="px-4 py-2 bg-primary text-white font-display font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-70"
                      >
                        {loadingEnrollId === c.id ? (
                          <span>Mendaftarkan...</span>
                        ) : (
                          <>
                            <span>Enroll Kelas</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-surface-container-high text-outline font-display font-bold text-xs rounded-full border-2 border-outline cursor-not-allowed flex items-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Coming Soon</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
