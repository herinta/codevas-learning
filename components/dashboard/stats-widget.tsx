import React from "react";
import { BarChart3, Target, Flame, CheckCircle, Award, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { StreakReminderCard } from "@/components/pwa/streak-reminder-card";

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
    <div className="bg-white rounded-3xl border-3 sm:border-4 border-slate-900 p-5 sm:p-6 shadow-[0_6px_0_#0f172a] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#BAE6FD] text-slate-900 flex items-center justify-center border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
            <BarChart3 className="w-5 h-5 text-slate-900" />
          </span>
          <h3 className="font-display font-black text-lg text-slate-900">
            Statistik & Level EXP
          </h3>
        </div>
        <span className="text-xs font-mono font-black bg-[#FEF08A] text-slate-900 px-3 py-1 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
          Lv.{level}
        </span>
      </div>

      {/* EXP Progress Box */}
      <div className="p-4 bg-slate-50 rounded-2xl border-3 border-slate-900 shadow-[0_3px_0_#0f172a] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-display font-black text-slate-900">
            <span>{rankBadge}</span>
            <span>{rankTitle}</span>
          </div>
          <span className="font-mono font-black text-xs text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full border border-slate-900">
            {totalXp} XP Total
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-3.5 border-2 border-slate-900 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-amber-400 via-rose-500 to-sky-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
          <span>Progres Level: {progressPercent}%</span>
          <span>{xpRemaining > 0 ? `${xpRemaining} XP lagi ke Lv.${level + 1}` : "Level Maksimal"}</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
        <div className="p-3 bg-[#E0F2FE] rounded-2xl border-2 sm:border-3 border-slate-900 shadow-[0_3px_0_#0f172a]">
          <span className="font-display font-black text-lg sm:text-xl text-[#0369A1] block leading-tight">
            {accuracy}%
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mt-0.5">
            Akurasi
          </span>
        </div>

        <div className="p-3 bg-[#DCFCE7] rounded-2xl border-2 sm:border-3 border-slate-900 shadow-[0_3px_0_#0f172a]">
          <span className="font-display font-black text-lg sm:text-xl text-[#15803D] block leading-tight">
            {solvedCount}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mt-0.5">
            Terjawab
          </span>
        </div>

        <div className="p-3 bg-[#FEF08A] rounded-2xl border-2 sm:border-3 border-slate-900 shadow-[0_3px_0_#0f172a]">
          <span className="font-display font-black text-lg sm:text-xl text-[#A16207] block leading-tight">
            {streakDays} 🔥
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mt-0.5">
            Streak
          </span>
        </div>
      </div>

      {/* Streak Notification Reminder Box */}
      <StreakReminderCard />

      {/* Motivational Banner */}
      <div className="p-3.5 bg-[#FEF3C7] rounded-2xl border-2 sm:border-3 border-slate-900 shadow-[0_3px_0_#0f172a] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FACC15] border-2 border-slate-900 flex items-center justify-center text-slate-900 flex-shrink-0 shadow-[0_2px_0_#0f172a]">
          <Award className="w-5 h-5 text-slate-900" />
        </div>
        <div className="text-xs">
          <span className="font-display font-black text-slate-900 block text-xs sm:text-sm">
            Hebat! Kamu on-fire! 🎯
          </span>
          <span className="text-slate-700 font-medium text-[11px] sm:text-xs leading-tight block mt-0.5">
            Pertahankan streak harian untuk meraih bonus XP eksklusif.
          </span>
        </div>
      </div>
    </div>
  );
};
