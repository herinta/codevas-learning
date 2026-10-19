"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const pathname = usePathname();
  const registerHref = pathname?.startsWith("/demo") ? "/demo/register" : "/register";

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#FFFDF7]">
      {/* Playful Floating Dots & Toy Shapes Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-[#FEE2E2] blur-xl"></div>
        <div className="absolute top-40 right-12 w-32 h-32 rounded-full bg-[#E0F2FE] blur-xl"></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-[#FEF08A] blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FEF08A] border-3 border-slate-900 shadow-[0_4px_0_#0f172a]">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs sm:text-sm font-display font-black text-slate-900 tracking-wide uppercase">
              Platform Belajar Coding Web Interaktif
            </span>
          </div>
        </div>

        {/* Hero Grid: Left Copy & Right 3D Mascot Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subheading & Chunky Buttons */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 leading-[1.15] tracking-tight">
              Belajar Coding Web Jadi Lebih{" "}
              <span className="relative inline-block text-[#EF4444]">
                Mudah &amp; Visual
                <span className="absolute left-0 -bottom-2 w-full h-3 bg-[#FACC15] -z-10 rounded-full"></span>
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-700 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Pahami cara kerja HTML, CSS, dan logika web development langsung di browser. 
              <strong className="text-slate-900"> Tanpa setup atau instalasi rumit</strong>, interaktif, dan mudah dipahami langkah demi langkah.
            </p>

            {/* Feature Stickers Row */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] border-2 border-slate-900 text-xs font-bold text-[#0369A1] shadow-[0_2px_0_#0f172a]">
                <span>💻</span> Zero Setup di Browser
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] border-2 border-slate-900 text-xs font-bold text-[#15803D] shadow-[0_2px_0_#0f172a]">
                <span>⚡</span> Hasil Visual Real-Time
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-slate-900 text-xs font-bold text-[#A16207] shadow-[0_2px_0_#0f172a]">
                <span>🎯</span> Latihan Praktik Terstruktur
              </span>
            </div>

            {/* Chunky CTA Row */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={registerHref}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-lg sm:text-xl border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#0f172a] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Mulai Belajar Gratis</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-display font-black text-base sm:text-lg border-3 border-slate-900 shadow-[0_6px_0_#0f172a] hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#0f172a] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Coba Demo Interaktif</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t-2 border-slate-200/80 flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-600">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#EF4444] border-2 border-slate-900 flex items-center justify-center text-white text-xs font-black">C1</div>
                <div className="w-8 h-8 rounded-full bg-[#3B82F6] border-2 border-slate-900 flex items-center justify-center text-white text-xs font-black">C2</div>
                <div className="w-8 h-8 rounded-full bg-[#FACC15] border-2 border-slate-900 flex items-center justify-center text-slate-900 text-xs font-black">C3</div>
                <div className="w-8 h-8 rounded-full bg-[#10B981] border-2 border-slate-900 flex items-center justify-center text-white text-xs font-black">C4</div>
              </div>
              <p>
                Digunakan oleh lebih dari <span className="text-slate-900 font-black">50,000+</span> pengguna untuk belajar coding dasar.
              </p>
            </div>
          </div>

          {/* Right Column: 3D Mascot Illustration in Toy Frame */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md bg-white border-4 border-slate-900 rounded-3xl p-3 sm:p-4 shadow-[0_12px_0_#0f172a]">
              {/* Top Card Bar */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border border-slate-900"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FACC15] border border-slate-900"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-slate-900"></span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FEF08A] px-2.5 py-0.5 rounded-full border border-slate-900">
                  <span className="text-[11px] font-mono font-black text-slate-900">MODUL 1 • LIVE CODING</span>
                </div>
              </div>

              {/* 3D Mascot Image */}
              <div className="relative rounded-2xl overflow-hidden mt-3 border-2 border-slate-900 bg-gradient-to-b from-sky-50 to-amber-50">
                <Image
                  src="/images/kids-coding-mascot.jpg"
                  alt="Codevas Interactive Learning Mascot"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />

                {/* Floating Achievement Badge on image */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[0_3px_0_#0f172a] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider leading-none">Status</p>
                    <p className="text-xs font-black text-slate-900 leading-tight">Pratinjau Real-Time Aktif</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-[#EF4444] text-white border-2 border-slate-900 px-2.5 py-1 rounded-xl shadow-[0_3px_0_#0f172a] font-mono font-black text-xs flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>+100 XP</span>
                </div>
              </div>

              {/* Bottom Clean Explanation */}
              <div className="mt-3 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-left">
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  Ketik kode di editor dan saksikan tampilannya langsung berubah di layar secara instan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
