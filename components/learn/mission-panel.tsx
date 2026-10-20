"use client";

import React, { useState } from "react";
import { Zap, BookOpen, Lightbulb } from "lucide-react";
import { ChallengeData } from "./types";

interface MissionPanelProps {
  challenge: ChallengeData | null;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ challenge }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="lg:col-span-4 border-r-3 border-slate-900 p-6 bg-white overflow-y-auto space-y-6 shadow-xs">
      {/* Mission Box */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-slate-900 text-slate-900 font-display font-black text-xs shadow-[0_2px_0_#0f172a]">
          <Zap className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />
          <span>Panduan Tantangan (+{challenge?.xp_reward} XP)</span>
        </div>
        <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
          {challenge?.title}
        </h2>
        <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-[#FFFDF7] p-4 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a]">
          {challenge?.instruction}
        </div>
      </div>

      {/* Materi & Konsep Teori */}
      {challenge?.theory && (
        <div className="p-4 bg-sky-50 border-3 border-slate-900 rounded-2xl space-y-2.5 shadow-[0_4px_0_#0f172a]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-sky-800" />
            </div>
            <span className="text-xs font-display font-black uppercase tracking-wider text-slate-900">
              Materi &amp; Teori Pembelajaran
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line pl-1">
            {challenge.theory}
          </p>
        </div>
      )}

      {/* Hint Accordion */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs font-display font-black text-slate-800 hover:text-[#EF4444] cursor-pointer transition-colors"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{showHint ? "Sembunyikan Petunjuk" : "Butuh Bantuan? Lihat Petunjuk"}</span>
        </button>
        {showHint && (
          <div className="mt-2 p-3.5 bg-[#FEF08A]/70 border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed shadow-[0_2px_0_#0f172a]">
            {challenge?.hint ||
              "Gunakan display: flex; justify-content: center; align-items: center;"}
          </div>
        )}
      </div>
    </div>
  );
};
