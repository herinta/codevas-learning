import React from "react";
import { BarChart3, Target, Flame, CheckCircle, Award } from "lucide-react";

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
  return (
    <div className="bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-5 sm:p-6 candy-card-shadow">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center border-2 border-on-surface">
          <BarChart3 className="w-4 h-4" />
        </span>
        <h3 className="font-display font-black text-base text-on-surface">
          Statistik Kuis & Performa
        </h3>
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
