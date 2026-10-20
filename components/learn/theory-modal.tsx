"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Layers,
} from "lucide-react";
import { ChallengeData, ConceptDemo } from "./types";

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
  const [activeTab, setActiveTab] = useState<"walkthrough" | "code" | "summary">("walkthrough");

  if (!isOpen) return null;

  const concept: ConceptDemo | undefined =
    challenge?.concept_demo || challenge?.target_visual?.concept_demo || undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-t-3 sm:border-3 border-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_8px_0_#0f172a] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF08A] border-2 border-slate-900 flex items-center justify-center shadow-[0_2px_0_#0f172a]">
              <Sparkles className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#EF4444] text-white font-display font-black text-[10px] uppercase">
                  Checkpoint Teori • Level {challenge?.order_index || 1}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Concept Walkthrough
                </span>
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
                {concept?.conceptTitle || challenge?.title || "Materi & Teori Pembelajaran"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-2 border-transparent hover:border-slate-900 cursor-pointer transition-all"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher if ConceptDemo is rich */}
        {concept && (
          <div className="flex items-center gap-2 p-1 bg-slate-100 border-2 border-slate-900 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("walkthrough")}
              className={`flex-1 py-1.5 px-3 rounded-lg font-display font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "walkthrough"
                  ? "bg-white text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Filosofi &amp; Visual</span>
            </button>
            {concept.codeExample && (
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-display font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "code"
                    ? "bg-white text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Contoh Kode</span>
              </button>
            )}
            {concept.keyTakeaways && concept.keyTakeaways.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-display font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-white text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Intisari</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 1: Walkthrough & Filosofi */}
        {(!concept || activeTab === "walkthrough") && (
          <div className="space-y-4">
            {/* Why It Matters / Filosofi Tag/Properti */}
            <div className="p-4 bg-sky-50 border-2 border-slate-900 rounded-2xl space-y-2 shadow-[0_2px_0_#0f172a]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                  Mengapa Ini Diperlukan? (Filosofi &amp; Fungsi)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {concept?.whyItMatters || challenge?.theory}
              </p>
            </div>

            {/* What If Without / Konsekuensi Jika Tanpa Pembungkus/Properti */}
            {concept?.whatIfWithout && (
              <div className="p-4 bg-rose-50 border-2 border-slate-900 rounded-2xl space-y-2 shadow-[0_2px_0_#0f172a]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Apa Akibatnya Jika Tanpa Pendekatan Ini?
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {concept.whatIfWithout}
                </p>
              </div>
            )}

            {/* Visual Comparison (Sebelum vs Sesudah) */}
            {concept?.visualComparison && (
              <div className="space-y-2">
                <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800">
                  Perbandingan Visual (Sebelum vs Sesudah):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Without Box */}
                  <div className="p-3.5 bg-rose-50/70 border-2 border-slate-900 rounded-xl space-y-1.5 shadow-[0_2px_0_#0f172a]">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
                      <span>❌ {concept.visualComparison.withoutLabel || "Tanpa Pembungkus / Properti"}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                      {concept.visualComparison.withoutDesc}
                    </p>
                    {concept.visualComparison.previewCodeWithout && (
                      <pre className="mt-2 p-2 bg-white/90 border border-slate-300 rounded-lg text-[10px] font-mono text-slate-700 overflow-x-auto">
                        {concept.visualComparison.previewCodeWithout}
                      </pre>
                    )}
                  </div>

                  {/* With Box */}
                  <div className="p-3.5 bg-emerald-50/70 border-2 border-slate-900 rounded-xl space-y-1.5 shadow-[0_2px_0_#0f172a]">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                      <span>✅ {concept.visualComparison.withLabel || "Dengan Pembungkus Rapi"}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                      {concept.visualComparison.withDesc}
                    </p>
                    {concept.visualComparison.previewCodeWith && (
                      <pre className="mt-2 p-2 bg-white/90 border border-slate-300 rounded-lg text-[10px] font-mono text-slate-700 overflow-x-auto">
                        {concept.visualComparison.previewCodeWith}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Code Example */}
        {concept && activeTab === "code" && concept.codeExample && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800">
                Pola Kode Acuan:
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Gunakan pola struktur ini sebagai referensi
              </span>
            </div>
            <div className="p-4 bg-slate-900 border-2 border-slate-900 rounded-2xl shadow-[0_4px_0_#0f172a] text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre className="whitespace-pre">{concept.codeExample}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Summary / Key Takeaways */}
        {concept && activeTab === "summary" && concept.keyTakeaways && (
          <div className="space-y-3">
            <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800">
              Prinsip Penting yang Harus Diingat:
            </span>
            <div className="space-y-2">
              {concept.keyTakeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border-2 border-slate-900 rounded-xl flex items-start gap-2.5 shadow-[0_2px_0_#0f172a]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint Box (If Available) */}
        {challenge?.hint && (
          <div className="p-3.5 bg-[#FEF08A] border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed space-y-1 shadow-[0_2px_0_#0f172a]">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lightbulb className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Petunjuk Singkat:</span>
            </div>
            <p>{challenge.hint}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_#991b1b] text-center cursor-pointer active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <span>Paham Konsepnya, Siap Latihan!</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
