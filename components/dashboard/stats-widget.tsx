import React from "react";
import { BarChart3, Target, Flame, CheckCircle, Award, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export interface StatsWidgetProps {
  readonly accuracy?: number;
  readonly solvedCount?: number;
  readonly streakDays?: number;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  accuracy = 92,
  solvedCount = 48,
  streakDays = 12,
}) => {
  const { user } = useAuth();
  const level = user?.level || 1;
  const rankTitle = user?.rank_title || "Siswa Pemula";
  const rankBadge = user?.rank_badge || "🌱";
  const progressPercent = user?.level_progress_percent ?? 50;
  const currentXp = user?.current_level_xp ?? 50;
  const xpRemaining = user?.xp_remaining ?? 50;
  const totalXp = user?.xp_points ?? 50;

  return (
    <div className="bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-5 sm:p-6 candy-card-shadow space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center border-2 border-on-surface">
            <BarChart3 className="w-4 h-4" />
          </span>
          <h3 className="font-display font-black text-base text-on-surface">
            Statistik & Level EXP
          </h3>
        </div>
        <span className="text-xs font-mono font-black bg-amber-300 text-on-surface px-2.5 py-1 rounded-full border border-on-surface shadow-xs">
          Lv.{level}
        </span>
      </div>

      {/* EXP Progress Box */}
      <div className="p-3.5 bg-surface-container-low rounded-xl border-2 border-on-surface space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-headline font-black text-on-surface">
            <span>{rankBadge}</span>
            <span>{rankTitle}</span>
          </div>
          <span className="font-mono font-bold text-secondary">
            {totalXp} XP Total
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-container-high rounded-full h-3 border border-on-surface overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-amber-400 via-primary to-secondary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant">
          <span>Progres Level: {progressPercent}%</span>
          <span>{xpRemaining > 0 ? `${xpRemaining} XP lagi ke Lv.${level + 1}` : "Level Maksimal"}</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
        <div className="p-3 bg-surface-container-low rounded-xl border-2 border-on-surface">
          <span className="font-display font-black text-base sm:text-lg text-primary block leading-tight">
            {accuracy}%
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant block mt-0.5">
            Akurasi
          </span>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl border-2 border-on-surface">
          <span className="font-display font-black text-base sm:text-lg text-secondary block leading-tight">
            {solvedCount}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant block mt-0.5">
            Terjawab
          </span>
        </div>

        <div className="p-3 bg-surface-container-low rounded-xl border-2 border-on-surface">
          <span className="font-display font-black text-base sm:text-lg text-[#e65100] block leading-tight">
            {streakDays} 🔥
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant block mt-0.5">
            Streak
          </span>
        </div>
      </div>

      {/* Motivational Banner */}
      <div className="mt-4 p-3 bg-secondary-fixed/40 rounded-xl border-2 border-secondary flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0">
          <Award className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-display font-black text-secondary block">
            Hebat! Kamu on-fire! 🎯
          </span>
          <span className="text-on-surface-variant font-medium leading-tight block mt-0.5">
            2 kuis lagi untuk membuka lencana "Syntax Wizard".
          </span>
        </div>
      </div>
    </div>
  );
};
