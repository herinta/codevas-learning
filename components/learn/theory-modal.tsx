"use client";

import React from "react";
import { BookOpen, Lightbulb, X } from "lucide-react";
import { ChallengeData } from "./types";

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeData | null;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  challenge,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-t-3 sm:border-3 border-slate-900 rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_8px_0_#0f172a] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#EF4444]" />
            <h3 className="font-display font-black text-lg text-slate-900">
              Materi &amp; Teori Pembelajaran
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {challenge?.theory && (
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
            {challenge.theory}
          </p>
        )}

        {challenge?.hint && (
          <div className="p-3.5 bg-[#FEF08A] border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed space-y-1 shadow-[0_2px_0_#0f172a]">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lightbulb className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Petunjuk Tantangan:</span>
            </div>
            <p>{challenge.hint}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] text-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          Paham, Lanjut Koding
        </button>
      </div>
    </div>
  );
};
