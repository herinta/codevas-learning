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
  const categories: { id: CategoryFilterType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: "MY_CLASSES",
      label: "My Class",
      icon: <BookmarkCheck className="w-4 h-4" />,
      badge: enrolledCount,
    },
    {
      id: "LIVE_CODE",
      label: "Live Code HTML/CSS",
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: "DRAG_DROP",
      label: "Visual Logic (Drag & Drop)",
      icon: <Puzzle className="w-4 h-4" />,
    },
    {
      id: "QUIZ",
      label: "Theory Quiz (Pilihan Ganda)",
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Filter Capsule Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-display font-bold text-xs sm:text-sm border-2 border-on-surface candy-btn-shadow whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-white scale-[1.02]"
                    : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.badge !== undefined && cat.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? "bg-white text-primary"
                        : "bg-primary-fixed text-primary"
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kelas atau topik..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-surface-container-lowest border-2 border-on-surface rounded-full text-on-surface font-medium placeholder:text-outline text-xs sm:text-sm candy-card-shadow focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </section>
  );
};
