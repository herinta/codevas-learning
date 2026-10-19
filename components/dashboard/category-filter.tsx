"use client";

import React from "react";
import { Search, Code2, Puzzle, HelpCircle, BookmarkCheck } from "lucide-react";

export type CategoryFilterType = "MY_CLASSES" | "LIVE_CODE" | "DRAG_DROP" | "QUIZ";

export interface CategoryFilterProps {
  readonly activeCategory: CategoryFilterType;
  readonly onSelectCategory: (category: CategoryFilterType) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly enrolledCount?: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  enrolledCount = 1,
}) => {
  const categories: {
    id: CategoryFilterType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    color: string;
  }[] = [
    {
      id: "MY_CLASSES",
      label: "Kelas Saya",
      icon: <BookmarkCheck className="w-4 h-4" />,
      badge: enrolledCount,
      color: "hover:bg-[#FEF08A]",
    },
    {
      id: "LIVE_CODE",
      label: "Live Code HTML/CSS",
      icon: <Code2 className="w-4 h-4" />,
      color: "hover:bg-[#BAE6FD]",
    },
    {
      id: "DRAG_DROP",
      label: "Visual Logic Blocks",
      icon: <Puzzle className="w-4 h-4" />,
      color: "hover:bg-[#FED7AA]",
    },
    {
      id: "QUIZ",
      label: "Kuis Teori",
      icon: <HelpCircle className="w-4 h-4" />,
      color: "hover:bg-[#FECDD3]",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Filter Capsule Pill Buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl font-display font-black text-xs sm:text-sm border-3 border-slate-900 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#EF4444] text-white shadow-[0_5px_0_#0f172a] -translate-y-1"
                    : `bg-white text-slate-800 ${cat.color} shadow-[0_3px_0_#0f172a]`
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.badge !== undefined && cat.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black border border-slate-900 ${
                      isActive
                        ? "bg-white text-slate-900"
                        : "bg-[#FEF08A] text-slate-900"
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Search in Filter Bar */}
        <div className="relative w-full lg:w-72 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kelas atau topik..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border-3 border-slate-900 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 text-xs sm:text-sm shadow-[0_3px_0_#0f172a] focus:outline-none focus:shadow-[0_5px_0_#0f172a] transition-all"
          />
        </div>
      </div>
    </section>
  );
};
