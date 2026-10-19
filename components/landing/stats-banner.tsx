"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Trophy, Star, ArrowRight, Award } from "lucide-react";

export const StatsBanner: React.FC = () => {
  const pathname = usePathname();
  const registerHref = pathname?.startsWith("/demo") ? "/demo/register" : "/register";

  return (
    <section className="py-16 px-4" id="community">
      <div className="max-w-6xl mx-auto bg-[#FEF08A] rounded-3xl border-4 border-slate-900 p-8 md:p-12 shadow-[0_12px_0_#0f172a] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Left Text & CTA */}
        <div className="max-w-xl text-center lg:text-left z-10">
          <span className="px-4 py-1.5 rounded-full bg-white text-slate-900 font-display font-black text-xs uppercase tracking-wider border-2 border-slate-900 inline-flex items-center gap-1.5 mb-4 shadow-[0_2px_0_#0f172a]">
            <Trophy className="w-4 h-4 text-[#D97706]" />
            <span>Progres &amp; Komunitas</span>
          </span>
          <h3 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Tingkatkan Kemampuan Pemrograman Web Secara Bertahap
          </h3>
          <p className="mt-3 text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
            Bergabung bersama lebih dari <strong>50,000+</strong> pengguna yang aktif mempelajari dasar pemrograman web dengan kurikulum interaktif di Codevas.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link
              href={registerHref}
              className="px-8 py-4 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-base sm:text-lg border-3 border-slate-900 shadow-[0_5px_0_#0f172a] hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#0f172a] transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Daftar Gratis Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right 3D Trophy Image & Stat Cards */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto z-10">
          {/* 3D Trophy Badge Image */}
          <div className="w-40 sm:w-48 rounded-2xl border-3 border-slate-900 overflow-hidden shadow-[0_6px_0_#0f172a] bg-white shrink-0 hover:rotate-2 transition-transform">
            <Image
              src="/images/kids-trophy-badges.jpg"
              alt="Codevas Trophy and Badges"
              width={250}
              height={250}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Mini Stat Counters */}
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <div className="bg-white border-3 border-slate-900 px-6 py-4 rounded-2xl shadow-[0_4px_0_#0f172a] text-center min-w-[160px]">
              <p className="font-display font-black text-3xl text-[#EF4444]">
                150K+
              </p>
              <p className="font-display font-bold text-xs text-slate-600 mt-0.5">
                Latihan Diselesaikan
              </p>
            </div>
            <div className="bg-white border-3 border-slate-900 px-6 py-4 rounded-2xl shadow-[0_4px_0_#0f172a] text-center min-w-[160px]">
              <div className="flex items-center justify-center gap-1 text-slate-900">
                <span className="font-display font-black text-3xl text-[#3B82F6]">4.9</span>
                <Star className="w-6 h-6 fill-[#FACC15] text-[#FACC15]" />
              </div>
              <p className="font-display font-bold text-xs text-slate-600 mt-0.5">
                Rating Kepuasan Pengguna
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
