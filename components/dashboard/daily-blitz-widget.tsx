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
    <div className="bg-primary-fixed rounded-2xl border-2 border-on-surface p-5 sm:p-6 candy-card-shadow relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-on-surface shadow-sm">
            <Zap className="w-4 h-4 fill-white" />
          </span>
          <h3 className="font-display font-black text-base sm:text-lg text-on-surface">
            Daily Quiz Blitz
          </h3>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-surface rounded-full border-2 border-on-surface text-xs font-black text-primary candy-btn-shadow">
          <Timer className="w-3.5 h-3.5" />
          <span>{timeLeft}</span>
        </div>
      </div>

      <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
        Misi harian spesial dengan pengganda XP. Segera selesaikan sebelum reset harian!
      </p>

      {/* Mission Card Box */}
      <div className="mt-4 p-3.5 bg-surface rounded-xl border-2 border-on-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-on-surface">Misi Hari Ini:</span>
          <span className="px-2 py-0.5 bg-secondary-fixed text-secondary font-black text-[10px] rounded-full border border-on-surface">
            Bonus +150 XP
          </span>
        </div>

        <p className="mt-1.5 text-xs text-on-surface font-medium">
          "Aktifkan 3 container flexbox dengan CSS alignment yang presisi."
        </p>

        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="flex-1 h-2.5 bg-surface-container-high rounded-full border border-on-surface overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "66%" }} />
          </div>
          <span className="text-xs font-black text-on-surface">2/3 Selesai</span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href="/classes/css-flexbox"
        className="mt-4 w-full py-2.5 bg-primary text-white font-display font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
      >
        <span>Mulai Blitz Sekarang</span>
        <Flame className="w-4 h-4 fill-white" />
      </Link>
    </div>
  );
};
