"use client";

import React from "react";
import {
  Target,
  Flame,
  CheckCircle2,
  Sparkles,
  Trophy,
  X,
  Clock,
  Zap,
} from "lucide-react";
import { useDailyTargetTracker } from "@/lib/hooks/use-daily-target-tracker";

export const DailyTargetWidget: React.FC = () => {
  const {
    percent,
    formattedActive,
    formattedTarget,
    isCompleted,
    status,
    justCompletedModal,
    dismissJustCompletedModal,
  } = useDailyTargetTracker();

  const weeklyHistory = status?.weeklyHistory || [];

  return (
    <>
      {/* DAILY TARGET CARD */}
      <div className="bg-white border-3 sm:border-4 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-[0_6px_0_#0f172a] space-y-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-9 h-9 rounded-2xl border-2 border-slate-900 flex items-center justify-center shadow-[0_2px_0_#0f172a] ${
                isCompleted
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "bg-[#FEF08A] text-slate-900"
              }`}
            >
              <Target className="w-4 h-4 stroke-[2.5]" />
            </span>
            <div>
              <h3 className="font-display font-black text-base text-slate-900 leading-tight">
                Target Harian 10 Menit
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                Fokus Belajar &amp; Koding
              </span>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-[0_2px_0_#0f172a] ${
              isCompleted
                ? "bg-[#DCFCE7] text-[#15803D]"
                : "bg-[#FEF08A] text-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#D97706] fill-[#F59E0B]" />
            <span>+30 XP</span>
          </span>
        </div>

        {/* Live Timer Counter Box */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-900 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-black text-2xl text-slate-900 tracking-tight">
                {formattedActive}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                / {formattedTarget}
              </span>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-display font-black flex items-center gap-1 border-2 border-slate-900 shadow-xs ${
                isCompleted
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "bg-[#FEF08A] text-slate-900 animate-pulse"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] stroke-[2.5]" />
                  <span>Target Tercapai!</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Sedang Berjalan</span>
                </>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3.5 border-2 border-slate-900 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-[#10B981]"
                  : "bg-[#EF4444]"
              }`}
              style={{ width: `${Math.max(6, percent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>{percent}% dari target harian</span>
            <span>
              {isCompleted
                ? "Bonus XP telah diklaim"
                : `${Math.max(0, 10 - Math.floor((status?.activeSeconds || 0) / 60))} menit lagi`}
            </span>
          </div>
        </div>

        {/* 7-Day History Mini-Heatmap */}
        {weeklyHistory.length > 0 && (
          <div className="pt-2 border-t-2 border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-display font-black text-slate-700">
              <span>Aktivitas 7 Hari Terakhir:</span>
              <span className="font-mono text-[#0284C7] font-black">
                {weeklyHistory.filter((d) => d.isCompleted).length}/7 Hari Target
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weeklyHistory.map((day, idx) => (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center text-[10px] font-mono font-black transition-all ${
                      day.isCompleted
                        ? "bg-[#10B981] text-white border-slate-900 shadow-[0_2px_0_#065f46]"
                        : idx === 6
                        ? "bg-[#FEF08A] text-slate-900 border-slate-900 shadow-[0_2px_0_#0f172a]"
                        : "bg-slate-100 text-slate-400 border-slate-300"
                    }`}
                    title={`${day.date} (${day.dayName}): ${day.activeMinutes} menit`}
                  >
                    {day.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span>{day.activeMinutes}m</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {day.dayName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TARGET COMPLETED CELEBRATION MODAL */}
      {justCompletedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-[0_12px_0_#0f172a] text-center space-y-4 relative">
            <button
              onClick={dismissJustCompletedModal}
              className="absolute top-3 right-3 p-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-[#FEF08A] border-3 border-slate-900 mx-auto flex items-center justify-center text-[#D97706] shadow-[0_4px_0_#0f172a] animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border-2 border-slate-900 text-xs font-display font-black mb-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Target Harian Tercapai!</span>
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 mt-1">
                10 Menit Fokus Belajar
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Luar biasa! Konsistensi belajarmu hari ini menjaga streak tetap menyala dan kamu berhak mendapat bonus EXP.
              </p>
            </div>

            <div className="p-3 bg-[#FEF08A] rounded-2xl border-2 border-slate-900 flex items-center justify-center gap-2 shadow-[0_2px_0_#0f172a]">
              <Zap className="w-5 h-5 text-[#D97706] fill-[#F59E0B]" />
              <span className="font-mono font-black text-base text-slate-900">
                +30 EXP Masuk ke Akunmu
              </span>
            </div>

            <button
              onClick={dismissJustCompletedModal}
              className="w-full py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_#991b1b] hover:scale-102 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Keren, Lanjutkan Belajar! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
};
