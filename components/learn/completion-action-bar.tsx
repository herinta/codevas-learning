"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Rocket, RefreshCw, WifiOff } from "lucide-react";
import { AuthUser } from "@/components/auth/auth-context";
import { ChallengeData, EarnedXpInfo } from "./types";

interface CompletionActionBarProps {
  isPassed: boolean;
  earnedXpInfo: EarnedXpInfo | null;
  isClassCompleted: boolean;
  challenge: ChallengeData | null;
  saveError: string | null;
  isSaving: boolean;
  onRetrySave: () => void;
  onNextLevel: () => void;
  classId: string;
  challengeId: string;
  user: AuthUser | null;
  sizeMode?: "compact" | "desktop";
}

export const CompletionActionBar: React.FC<CompletionActionBarProps> = ({
  isPassed,
  earnedXpInfo,
  isClassCompleted,
  challenge,
  saveError,
  isSaving,
  onRetrySave,
  onNextLevel,
  classId,
  challengeId,
  user,
  sizeMode = "desktop",
}) => {
  const isCompact = sizeMode === "compact";
  const isLastLevel = isClassCompleted || challenge?.order_index === 10;

  if (!isPassed) {
    if (isCompact) {
      return (
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Target belum terpenuhi</span>
          <span className="text-[10px] font-mono">Ketik atau klik chip di atas</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`animate-in fade-in duration-300 ${
        isCompact
          ? "space-y-1.5"
          : "pt-4 mt-4 border-t-2 border-slate-200 space-y-3"
      }`}
    >
      {/* Target Achievement Banner */}
      <div
        className={`bg-emerald-100 border-3 border-emerald-600 rounded-2xl flex items-center justify-between font-display font-black text-emerald-950 ${
          isCompact
            ? "p-2.5 text-xs shadow-xs"
            : "p-4 text-xs shadow-[0_4px_0_#065f46]"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <span className="truncate block">Target Berhasil Dicapai!</span>
            {earnedXpInfo?.leveledUp && (
              <span className="block text-[10px] sm:text-[11px] font-bold text-amber-800 mt-0.5 truncate">
                🎉 Selamat! Naik ke Level {earnedXpInfo.level} ({earnedXpInfo.rankTitle})
              </span>
            )}
          </div>
        </div>

        {earnedXpInfo?.earnedXp && earnedXpInfo.earnedXp > 0 && (
          <span
            className={`bg-emerald-600 text-white rounded font-mono font-black shrink-0 ${
              isCompact
                ? "px-1.5 py-0.5 text-[10px]"
                : "px-2.5 py-1 text-xs shadow-xs"
            }`}
          >
            +{earnedXpInfo.earnedXp} XP
          </span>
        )}
      </div>

      {/* Save Error Alert Banner */}
      {saveError && (
        <div className="p-2.5 sm:p-3 bg-red-100 border-2 border-red-500 rounded-xl flex items-center justify-between text-xs text-red-950 font-bold gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <WifiOff className="w-4 h-4 text-red-600 shrink-0" />
            <span className="truncate">{saveError}</span>
          </div>
          <button
            type="button"
            onClick={onRetrySave}
            disabled={isSaving}
            className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isSaving ? "animate-spin" : ""}`} />
            <span>{isSaving ? "Menyimpan..." : "Coba Simpan"}</span>
          </button>
        </div>
      )}

      {/* Guest Mode Warning (desktop only or subtle) */}
      {!user && !isCompact && (
        <div className="p-2.5 bg-[#FEF08A]/70 border-2 border-slate-900 rounded-xl text-[11px] text-slate-900 font-medium">
          💡 Kamu sedang belajar sebagai Tamu.{" "}
          <Link
            href={`/login?redirect=/classes/${classId}/learn/${challengeId}`}
            className="font-black underline text-slate-900"
          >
            Login di sini
          </Link>{" "}
          agar poin XP dan rekor streak tersimpan di profilmu.
        </div>
      )}

      {/* Main Action Button */}
      {isLastLevel ? (
        <Link href="/dashboard" className="block w-full">
          <button
            type="button"
            className={`w-full bg-[#FEF08A] hover:bg-yellow-300 text-slate-900 font-display font-black border-2 sm:border-3 border-slate-900 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all ${
              isCompact
                ? "py-2.5 px-4 rounded-xl text-xs shadow-[0_2px_0_#0f172a]"
                : "py-4 rounded-2xl text-base shadow-[0_6px_0_#0f172a]"
            }`}
          >
            <span>🏆 Tamat! Kembali ke Dashboard</span>
          </button>
        </Link>
      ) : (
        <button
          type="button"
          onClick={onNextLevel}
          className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black border-2 sm:border-3 border-slate-900 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all ${
            isCompact
              ? "py-2.5 px-4 rounded-xl text-xs shadow-[0_2px_0_#065f46]"
              : "py-4 rounded-2xl text-base shadow-[0_6px_0_#065f46]"
          }`}
        >
          <span>Lanjut ke Level Berikutnya</span>
          <Rocket className={isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} />
        </button>
      )}

      {!isCompact && (
        <Link
          href={`/classes/${classId}`}
          className="block w-full text-center py-1 text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline"
        >
          Kembali ke Silabus Kelas
        </Link>
      )}
    </div>
  );
};
