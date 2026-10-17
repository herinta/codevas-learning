import React from "react";
import Link from "next/link";
import { Star, ArrowRight, Lock, Code2, Puzzle, HelpCircle, Sparkles } from "lucide-react";
import { ClassCategory } from "@/lib/db/entities";

export interface ClassTrackCardProps {
  readonly id: string;
  readonly category: ClassCategory;
  readonly title: string;
  readonly description: string;
  readonly levelCount: number;
  readonly completedCount?: number;
  readonly xpReward?: number;
  readonly isPublished: boolean;
  readonly challengeTypeDesc?: string;
  readonly isRecommended?: boolean;
  readonly isEnrolled?: boolean;
}

export const ClassTrackCard: React.FC<ClassTrackCardProps> = ({
  id,
  category,
  title,
  description,
  levelCount,
  completedCount = 0,
  xpReward = 150,
  isPublished,
  challengeTypeDesc,
  isRecommended = false,
  isEnrolled = false,
}) => {
  // Theme palette based on category
  const categoryConfig: Record<
    ClassCategory,
    { badgeBg: string; badgeText: string; progressBg: string; icon: React.ReactNode; label: string }
  > = {
    LIVE_CODE: {
      badgeBg: "bg-[#d4f8e8]",
      badgeText: "text-[#1b5e20]",
      progressBg: "bg-[#10b981]",
      icon: <Code2 className="w-3.5 h-3.5" />,
      label: "Live Code",
    },
    DRAG_DROP: {
      badgeBg: "bg-secondary-fixed",
      badgeText: "text-on-secondary-fixed",
      progressBg: "bg-secondary",
      icon: <Puzzle className="w-3.5 h-3.5" />,
      label: "Visual Logic",
    },
    QUIZ: {
      badgeBg: "bg-tertiary-fixed",
      badgeText: "text-on-tertiary-fixed",
      progressBg: "bg-tertiary",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      label: "Theory Quiz",
    },
  };

  const config = categoryConfig[category] || categoryConfig.LIVE_CODE;
  const progressPercent = levelCount > 0 ? Math.round((completedCount / levelCount) * 100) : 0;
  const isStarted = completedCount > 0;

  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-5 sm:p-6 candy-card-shadow transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
        isPublished ? "hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2e1a28]" : "opacity-85"
      } ${isRecommended ? "ring-2 ring-tertiary" : ""}`}
    >
      {/* Recommended Ribbon */}
      {isRecommended && (
        <div className="absolute -right-8 top-5 rotate-45 bg-tertiary text-white text-[10px] font-black uppercase tracking-wider py-0.5 px-8 border-y-2 border-on-surface shadow-sm">
          Rekomendasi
        </div>
      )}

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 font-display font-bold text-xs rounded-full border-2 border-on-surface ${config.badgeBg} ${config.badgeText}`}
            >
              {config.icon}
              <span>{config.label}</span>
            </span>

            {isEnrolled && (
              <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-900 text-[11px] font-black rounded-full border-2 border-on-surface">
                ✓ Enrolled
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
            {isPublished ? (
              <span>{levelCount} Level</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-outline">
                <Lock className="w-3 h-3" /> Segera Terbuka
              </span>
            )}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-display font-black text-lg sm:text-xl text-on-surface leading-snug">
          {title}
        </h3>
        <p className="mt-1 text-xs text-on-surface-variant font-medium leading-relaxed">
          {description}
        </p>

        {/* Features Pill Box */}
        {challengeTypeDesc && (
          <div className="mt-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant text-xs">
            <div className="font-bold text-secondary mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Fokus Tantangan:</span>
            </div>
            <div className="font-medium text-on-surface-variant line-clamp-2">
              {challengeTypeDesc}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-on-surface">Progress Belajar</span>
            {isPublished ? (
              <span className="text-primary font-black">
                {isStarted ? `${completedCount}/${levelCount} Selesai (${progressPercent}%)` : "Belum Dimulai"}
              </span>
            ) : (
              <span className="text-outline">Terkunci</span>
            )}
          </div>
          <div className="w-full h-3 bg-surface-container-high rounded-full border-2 border-on-surface overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPublished ? config.progressBg : "bg-outline/50"
              }`}
              style={{ width: `${isPublished ? Math.max(progressPercent, 4) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-6 pt-4 border-t-2 border-surface-container-high flex items-center justify-between">
        <span className="text-xs font-black text-secondary flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
          <span>+{xpReward} XP</span>
        </span>

        {isPublished ? (
          <Link
            href={`/classes/${id}`}
            className="px-4 py-2 bg-primary text-white font-display font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <span>
              {isEnrolled
                ? isStarted
                  ? "Lanjut Level"
                  : "Buka Kelas"
                : "Lihat & Enroll"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
};
