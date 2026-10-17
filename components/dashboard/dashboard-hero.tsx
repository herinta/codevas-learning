import React from "react";
import { Gamepad2, Zap, Layers, Sparkles } from "lucide-react";

export interface DashboardHeroProps {
  readonly totalClasses?: number;
  readonly totalChallenges?: number;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  totalClasses = 5,
  totalChallenges = 20,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
      <div className="bg-gradient-to-r from-primary-fixed via-secondary-fixed to-tertiary-fixed rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-on-surface candy-card-shadow relative overflow-hidden">
        {/* Playful Floating Glows */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-8 w-28 h-28 rounded-full bg-tertiary/25 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Gamified Mode Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface rounded-full border-2 border-on-surface text-xs font-black text-primary mb-3.5 candy-card-shadow">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span>Mode Belajar Gamifikasi Aktif</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-on-surface leading-tight">
            Pilih Petualangan Kode & Quiz Tantanganmu! 🎮
          </h1>

          {/* Subtitle */}
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed max-w-2xl">
            Asah kemampuanmu lewat mini-quiz interaktif, puzzle blok kode kosong, dan validasi visual seketika yang siap melatih insting developer profesionalmu!
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-6 pt-5 border-t-2 border-on-surface/20 flex flex-wrap gap-4 sm:gap-8 items-center">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs sm:text-sm border-2 border-on-surface">
              {totalClasses}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-on-surface">Trek Kurikulum</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Live Code & Quiz</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary text-white flex items-center justify-center font-black text-xs sm:text-sm border-2 border-on-surface">
              {totalChallenges}+
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-on-surface">Puzzle Level</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Validasi Visual Instan</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-tertiary text-white flex items-center justify-center font-black text-xs sm:text-sm border-2 border-on-surface">
              <Zap className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-on-surface">Hadiah XP Ganda</span>
              <span className="text-[10px] font-bold text-on-surface-variant">Level Boss Fight</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
