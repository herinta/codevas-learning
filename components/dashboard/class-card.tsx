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
  // Theme palette based on category matching landing page
  const categoryConfig: Record<
    ClassCategory,
    { badgeBg: string; headerBg: string; progressBg: string; icon: React.ReactNode; label: string }
  > = {
    LIVE_CODE: {
      badgeBg: "bg-[#0284C7] text-white",
      headerBg: "bg-[#E0F2FE]",
      progressBg: "bg-[#0284C7]",
      icon: <Code2 className="w-3.5 h-3.5" />,
      label: "Live Code",
    },
    DRAG_DROP: {
      badgeBg: "bg-[#FEF08A] text-slate-900",
      headerBg: "bg-[#FEF08A]/60",
      progressBg: "bg-[#EAB308]",
      icon: <Puzzle className="w-3.5 h-3.5" />,
      label: "Visual Logic",
    },
    QUIZ: {
      badgeBg: "bg-[#EF4444] text-white",
      headerBg: "bg-[#FECDD3]",
      progressBg: "bg-[#EF4444]",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      label: "Kuis Teori",
    },
  };

  const config = categoryConfig[category] || categoryConfig.LIVE_CODE;
  const progressPercent = levelCount > 0 ? Math.round((completedCount / levelCount) * 100) : 0;
  const isStarted = completedCount > 0;

  return (
    <div
      className={`bg-white rounded-3xl border-3 sm:border-4 border-slate-900 shadow-[0_6px_0_#0f172a] transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
        isPublished ? "hover:-translate-y-1 hover:shadow-[0_10px_0_#0f172a]" : "opacity-85"
      } ${isRecommended ? "ring-4 ring-[#FACC15]" : ""}`}
    >
      {/* Recommended Ribbon */}
      {isRecommended && (
        <div className="absolute -right-8 top-5 rotate-45 bg-[#FACC15] text-slate-900 text-[10px] font-display font-black uppercase tracking-wider py-0.5 px-8 border-y-2 border-slate-900 shadow-sm z-20">
          Rekomendasi
        </div>
      )}

      <div>
        {/* Card Header Thumbnail Band */}
        <div className={`p-4 sm:p-5 ${config.headerBg} border-b-3 border-slate-900 flex items-center justify-between relative`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 font-display font-black text-xs rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a] ${config.badgeBg}`}
            >
              {config.icon}
              <span>{config.label}</span>
            </span>

            {isEnrolled && (
              <span className="px-2.5 py-0.5 bg-[#DCFCE7] text-[#15803D] text-[11px] font-mono font-black rounded-full border-2 border-slate-900 shadow-sm">
                ✓ Enrolled
              </span>
            )}
          </div>

          <span className="text-xs font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
            {isPublished ? (
              <span>{levelCount} Level</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Lock className="w-3 h-3" /> Segera Hadir
              </span>
            )}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <Link href={isPublished ? `/classes/${id}` : "#"}>
            <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug hover:text-[#EF4444] transition-colors cursor-pointer">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Features Pill Box */}
          {challengeTypeDesc && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-200 text-xs">
              <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Fokus Tantangan:</span>
              </div>
              <div className="font-medium text-slate-600 line-clamp-2">
                {challengeTypeDesc}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4 pt-1">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-800 font-display font-black">Progress Belajar</span>
              {isPublished ? (
                <span className="text-slate-900 font-mono font-black text-xs">
                  {isStarted ? `${completedCount}/${levelCount} (${progressPercent}%)` : "Belum Dimulai"}
                </span>
              ) : (
                <span className="text-slate-400 font-bold">Terkunci</span>
              )}
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isPublished && isStarted ? config.progressBg : "bg-transparent"
                }`}
                style={{ width: `${isPublished && isStarted ? progressPercent : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 flex items-center justify-between">
        <span className="text-xs font-mono font-black text-slate-900 bg-[#FEF08A] px-2.5 py-1 rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-[#D97706] fill-[#F59E0B]" />
          <span>+{xpReward} XP</span>
        </span>

        {isPublished ? (
          <Link
            href={`/classes/${id}`}
            className={`px-5 py-2.5 text-white font-display font-black text-xs sm:text-sm rounded-2xl border-2 border-slate-900 hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer ${
              isEnrolled
                ? isStarted
                  ? "bg-[#10B981] hover:bg-[#059669] shadow-[0_4px_0_#065f46]"
                  : "bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_4px_0_#1e3a8a]"
                : "bg-[#EF4444] hover:bg-[#DC2626] shadow-[0_4px_0_#991b1b]"
            }`}
          >
            <span>
              {isEnrolled
                ? isStarted
                  ? "Lanjut Level"
                  : "Buka Kelas"
                : "Lihat & Enroll"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div
            className="px-4 py-2 bg-slate-100 text-slate-400 font-display font-black text-xs rounded-2xl border-2 border-slate-300 cursor-not-allowed flex items-center gap-1 select-none"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Segera Hadir</span>
          </div>
        )}
      </div>
    </div>
  );
};
