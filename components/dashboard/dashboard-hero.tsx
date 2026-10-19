import React from "react";
import { Zap, Layers, Sparkles } from "lucide-react";

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
      <div className="bg-gradient-to-r from-amber-100 via-sky-100 to-rose-100 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[0_10px_0_#0f172a] relative overflow-hidden">
        {/* Soft Decorative Shape Background */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-[#FEE2E2] blur-xl pointer-events-none" />
        <div className="absolute right-1/4 -top-8 w-28 h-28 rounded-full bg-[#E0F2FE] blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444] text-white font-mono font-black text-xs border-2 border-slate-900 shadow-[0_2px_0_#0f172a] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODUL INTERAKTIF &amp; TANTANGAN</span>
          </span>

          {/* Headline */}
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 leading-tight">
            Pilih Petualangan Kode &amp; Tantanganmu! 🚀
          </h1>

          {/* Subtitle */}
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl">
            Asah kemampuanmu lewat latihan langsung di browser, puzzle hierarki visual, dan live preview seketika yang siap melatih insting web developer-mu!
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-6 pt-5 border-t-2 border-slate-900/15 flex flex-wrap gap-3 sm:gap-4 items-center">
          <div className="bg-white border-2 border-slate-900 rounded-2xl px-4 py-2 shadow-[0_3px_0_#0f172a] flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-display font-black text-xs sm:text-sm border border-slate-900">
              {totalClasses}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900">Modul Kelas</span>
              <span className="text-[10px] font-bold text-slate-500">Live Code &amp; Quiz</span>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl px-4 py-2 shadow-[0_3px_0_#0f172a] flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center font-display font-black text-xs sm:text-sm border border-slate-900">
              {totalChallenges}+
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900">Level Praktik</span>
              <span className="text-[10px] font-bold text-slate-500">Tantangan Interaktif</span>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl px-4 py-2 shadow-[0_3px_0_#0f172a] flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FACC15] text-slate-900 flex items-center justify-center font-display font-black text-xs sm:text-sm border border-slate-900">
              <Zap className="w-4 h-4 fill-slate-900" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900">XP &amp; Pencapaian</span>
              <span className="text-[10px] font-bold text-slate-500">Hadiah Level Up</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
