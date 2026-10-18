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
      <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl p-5 sm:p-6 candy-card-shadow space-y-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-8 h-8 rounded-full border-2 border-on-surface flex items-center justify-center ${
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : "bg-primary-fixed text-primary"
              }`}
            >
              <Target className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display font-black text-base text-on-surface leading-tight">
                Target Harian 10 Menit
              </h3>
              <span className="text-[11px] font-bold text-on-surface-variant">
                Fokus Belajar &amp; Koding
              </span>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border border-on-surface flex items-center gap-1 shadow-xs ${
              isCompleted
                ? "bg-emerald-100 text-emerald-950 border-emerald-600"
                : "bg-amber-300 text-on-surface"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>+30 XP</span>
          </span>
        </div>

        {/* Live Timer Counter Box */}
        <div className="p-3.5 bg-surface-container-low rounded-xl border-2 border-on-surface space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-black text-2xl text-on-surface tracking-tight">
                {formattedActive}
              </span>
              <span className="text-xs font-mono font-bold text-on-surface-variant">
                / {formattedTarget}
              </span>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-headline font-bold flex items-center gap-1 ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Target Tercapai!</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>Sedang Berjalan</span>
                </>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-container-high rounded-full h-3 border border-on-surface overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-amber-400 via-primary to-secondary"
              }`}
              style={{ width: `${Math.max(6, percent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant">
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
          <div className="pt-2 border-t border-outline-variant space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-headline font-bold text-on-surface-variant">
              <span>Aktivitas 7 Hari Terakhir:</span>
              <span className="font-mono text-primary font-bold">
                {weeklyHistory.filter((d) => d.isCompleted).length}/7 Hari Target
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weeklyHistory.map((day, idx) => (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      day.isCompleted
                        ? "bg-emerald-500 text-white border-emerald-700 shadow-xs"
                        : idx === 6
                        ? "bg-amber-100 text-amber-900 border-amber-400"
                        : "bg-surface-container text-on-surface-variant/60 border-outline-variant/60"
                    }`}
                    title={`${day.date} (${day.dayName}): ${day.activeMinutes} menit`}
                  >
                    {day.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span>{day.activeMinutes}m</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">
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
          <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-[0_12px_0_#2e1a28] text-center space-y-4 relative">
            <button
              onClick={dismissJustCompletedModal}
              className="absolute top-3 right-3 p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-amber-300 border-3 border-on-surface mx-auto flex items-center justify-center text-amber-950 shadow-sm animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-headline font-black mb-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Target Harian Tercapai!</span>
              </div>
              <h3 className="font-display font-black text-xl text-on-surface">
                10 Menit Fokus Belajar
              </h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                Luar biasa! Konsistensi belajarmu hari ini menjaga streak tetap menyala dan kamu berhak mendapat bonus EXP.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
              <span className="font-mono font-black text-base text-amber-950">
                +30 EXP Masuk ke Akunmu
              </span>
            </div>

            <button
              onClick={dismissJustCompletedModal}
              className="w-full py-3 bg-primary text-white font-headline font-black text-sm rounded-xl border-2 border-on-surface shadow-[0_4px_0_#2e1a28] hover:scale-102 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              Keren, Lanjutkan Belajar! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
};
