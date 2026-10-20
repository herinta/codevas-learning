"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Star, Target } from "lucide-react";
import { AuthUser } from "@/components/auth/auth-context";
import { ChallengeData } from "./types";

interface LearnHeaderProps {
  classId: string;
  challenge: ChallengeData | null;
  user: AuthUser | null;
  dailyTarget: {
    formattedActive: string;
    isCompleted: boolean;
    percent: number;
  };
}

export const LearnHeader: React.FC<LearnHeaderProps> = ({
  classId,
  challenge,
  user,
  dailyTarget,
}) => {
  return (
    <header className="w-full bg-white border-b-3 border-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-3">
        <Link
          href={`/classes/${classId}`}
          className="p-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 shadow-[0_2px_0_#0f172a] transition-all active:translate-y-0.5 cursor-pointer"
          title="Kembali ke Silabus"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black text-slate-500 tracking-wider uppercase">
              LEVEL {challenge?.order_index || 1} / 12
            </span>
            {challenge?.difficulty && (
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full border-2 border-slate-900 bg-[#FEF08A] text-slate-900 shadow-[0_1px_0_#0f172a]">
                {challenge.difficulty}
              </span>
            )}
          </div>
          <h1 className="font-display font-black text-sm sm:text-base text-slate-900 truncate max-w-xs sm:max-w-md">
            {challenge?.title || "Level"}
          </h1>
        </div>
      </div>

      {/* User Status Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <div
          className="flex items-center gap-1 px-2.5 py-1 bg-[#FEF08A] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0"
          title={`Level ${user?.level || 1} • ${user?.rank_title || "Siswa Pemula"}`}
        >
          <span className="text-[11px] sm:text-xs font-mono font-black text-slate-900">
            Lv.{user?.level || 1}
          </span>
        </div>

        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#FFF3E0] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e65100] fill-[#e65100]" />
          <span className="text-[11px] sm:text-xs font-display font-black text-slate-900">
            {user ? `${(user as any).streak_days || 1}d` : "1d"}
          </span>
        </div>

        <div
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-sky-100 border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0"
          title={`Target Harian: 10 Menit Fokus Belajar (${dailyTarget.percent}% tercapai)`}
        >
          <Target
            className={`w-3.5 h-3.5 ${
              dailyTarget.isCompleted ? "text-emerald-600" : "text-[#EF4444]"
            }`}
          />
          <span className="text-[11px] font-mono font-black text-slate-900">
            {dailyTarget.formattedActive}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#BAE6FD] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0">
          <Star className="w-4 h-4 text-sky-900 fill-sky-800" />
          <span className="text-xs font-display font-black text-slate-900">
            {user ? `${user.xp_points} XP` : "50 XP"}
          </span>
        </div>

        {/* Quick Profile / Dashboard Avatar */}
        {user ? (
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-[#EF4444] shadow-[0_2px_0_#991b1b] flex items-center justify-center text-xs font-black text-white hover:scale-105 active:translate-y-0.5 transition-transform shrink-0"
            title={`@${user.username} — Profil Pengguna`}
          >
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={`@${user.username}`}
                className="w-full h-full object-cover"
              />
            ) : (
              user.username.slice(0, 2).toUpperCase()
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-2.5 py-1 rounded-full text-xs font-display font-black text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-2 border-slate-900 shadow-[0_1px_0_#0f172a]"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
};
