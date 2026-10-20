"use client";

import React, { useState } from "react";
import { Zap, BookOpen, Lightbulb, Sparkles, ChevronRight, Layers } from "lucide-react";
import { ChallengeData, ConceptDemo } from "./types";

interface MissionPanelProps {
  challenge: ChallengeData | null;
  onOpenTheory?: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  challenge,
  onOpenTheory,
}) => {
  const [showHint, setShowHint] = useState(false);

  const concept: ConceptDemo | undefined =
    challenge?.concept_demo || challenge?.target_visual?.concept_demo || undefined;

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

      {/* Interstitial Theory Checkpoint & Guided Examples Card */}
      {(concept || challenge?.theory) && (
        <div className="p-4 bg-sky-50 border-3 border-slate-900 rounded-2xl space-y-3 shadow-[0_4px_0_#0f172a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center shadow-xs">
                {concept ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 text-sky-800" />
                )}
              </div>
              <span className="text-xs font-display font-black uppercase tracking-wider text-slate-900">
                {concept ? "Jeda Materi & Demo Visual" : "Materi & Teori Pembelajaran"}
              </span>
            </div>
            {concept && (
              <span className="px-2 py-0.5 rounded-full bg-amber-200 border border-slate-900 text-[10px] font-black text-amber-950 font-mono">
                Checkpoint
              </span>
            )}
          </div>

          {concept?.conceptTitle && (
            <h4 className="font-display font-black text-sm text-slate-900">
              {concept.conceptTitle}
            </h4>
          )}

          <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3 pl-0.5">
            {concept?.whyItMatters || challenge?.theory}
          </p>

          {onOpenTheory && (
            <button
              type="button"
              onClick={onOpenTheory}
              className="w-full mt-1 py-2 px-3 bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-xl font-display font-black text-xs text-slate-900 shadow-[0_2px_0_#0f172a] flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Buka Demo Visual &amp; Contoh Kode</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
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
              "Tuliskan tag HTML atau properti CSS sesuai instruksi di atas."}
          </div>
        )}
      </div>
    </div>
  );
};
