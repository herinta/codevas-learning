"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Timer, Flame, CheckCircle2 } from "lucide-react";

export const DailyBlitzWidget: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("04:22:15");

  // Simulated countdown clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(23 - now.getHours()).padStart(2, "0");
      const minutes = String(59 - now.getMinutes()).padStart(2, "0");
      const seconds = String(59 - now.getSeconds()).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#FEF08A] rounded-3xl border-3 sm:border-4 border-slate-900 p-5 sm:p-6 shadow-[0_6px_0_#0f172a] relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#FACC15] text-slate-900 flex items-center justify-center border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
            <Zap className="w-5 h-5 fill-slate-900 text-slate-900" />
          </span>
          <h3 className="font-display font-black text-lg text-slate-900">
            Daily Quiz Blitz
          </h3>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border-2 border-slate-900 text-xs font-mono font-black text-slate-900 shadow-[0_2px_0_#0f172a]">
          <Timer className="w-3.5 h-3.5 text-red-500" />
          <span>{timeLeft}</span>
        </div>
      </div>

      <p className="text-xs font-bold text-slate-800 leading-relaxed">
        Misi harian spesial dengan pengganda XP. Segera selesaikan sebelum reset harian!
      </p>

      {/* Mission Card Box */}
      <div className="mt-4 p-4 bg-white rounded-2xl border-3 border-slate-900 shadow-[0_3px_0_#0f172a] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Misi Hari Ini:</span>
          <span className="px-2.5 py-0.5 bg-[#DCFCE7] text-[#15803D] font-mono font-black text-[11px] rounded-full border border-slate-900">
            Bonus +150 XP
          </span>
        </div>

        <p className="text-xs text-slate-700 font-bold">
          "Aktifkan 3 container flexbox dengan CSS alignment yang presisi."
        </p>

        <div className="flex items-center gap-2.5 pt-1">
          <div className="flex-1 h-3 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden p-0.5">
            <div className="bg-[#EF4444] h-full rounded-full" style={{ width: "66%" }} />
          </div>
          <span className="text-xs font-mono font-black text-slate-900">2/3 Selesai</span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href="/classes/css-flexbox"
        className="mt-4 w-full py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#991b1b] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#991b1b] transition-all cursor-pointer"
      >
        <span>Mulai Blitz Sekarang</span>
        <Flame className="w-4 h-4 fill-white text-white" />
      </Link>
    </div>
  );
};
