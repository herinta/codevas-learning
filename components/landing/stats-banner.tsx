import React from "react";
import Link from "next/link";
import { Trophy, Star, ArrowRight } from "lucide-react";

export const StatsBanner: React.FC = () => {
  return (
    <section className="py-12 px-4" id="community">
      <div className="max-w-6xl mx-auto bg-secondary-fixed rounded-3xl border-4 border-on-surface p-8 md:p-12 shadow-[0_10px_0_#2e1a28] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-secondary font-bold text-xs uppercase tracking-wider border-2 border-on-surface inline-flex items-center gap-1.5 mb-3 shadow-[0_2px_0_#2e1a28]">
            <Trophy className="w-3.5 h-3.5 text-secondary" />
            <span>Leaderboard & Komunitas</span>
          </span>
          <h3 className="font-display font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
            Kumpulkan XP, Naikkan Level, Raih Trofi Coding!
          </h3>
          <p className="mt-3 text-on-surface/80 font-medium text-base leading-relaxed">
            Lebih dari 45,000+ calon web developer aktif menyelesaikan quest
            harian dan bersaing sehat di papan peringkat Codevas.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-primary text-white font-label font-black text-sm border-2 border-on-surface shadow-[0_4px_0_#2e1a28] hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>Gabung Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="bg-surface-container-lowest border-2 border-on-surface px-6 py-5 rounded-2xl shadow-[0_4px_0_#2e1a28] text-center min-w-[150px]">
            <p className="font-display font-black text-3xl text-primary">
              120K+
            </p>
            <p className="font-label font-bold text-xs text-on-surface-variant mt-1">
              Misi Diselesaikan
            </p>
          </div>
          <div className="bg-surface-container-lowest border-2 border-on-surface px-6 py-5 rounded-2xl shadow-[0_4px_0_#2e1a28] text-center min-w-[150px]">
            <div className="flex items-center justify-center gap-1 text-secondary">
              <span className="font-display font-black text-3xl">4.9</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <p className="font-label font-bold text-xs text-on-surface-variant mt-1">
              Ulasan Pengguna
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
