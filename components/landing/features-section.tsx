import React from "react";
import { Zap, Sparkles, Eye, CheckCircle2, Heart, Award } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#FFFDF7] max-w-6xl mx-auto scroll-mt-24" id="features">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF08A] border-3 border-slate-900 text-slate-900 font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#0f172a]">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <span>Keunggulan Platform</span>
        </div>
        <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Metode Belajar Interaktif &amp; Visual
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
          Tiga pilar utama yang memudahkan pemahaman konsep pemrograman web secara intuitif dan menyenangkan.
        </p>
      </div>

      {/* 3 Parallel Chunky Cartoon Cards (Yellow, Blue, Red) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Sunny Banana Yellow */}
        <div className="rounded-3xl border-4 border-slate-900 bg-[#FEF08A] p-7 shadow-[0_10px_0_#0f172a] hover:-translate-y-2 transition-transform duration-200 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[0_4px_0_#0f172a] mb-6">
              🎯
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-white border-2 border-slate-900 text-xs font-display font-black text-slate-900 mb-3 shadow-[0_2px_0_#0f172a]">
              SISTEM PROGRES
            </span>
            <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              Progres Terstruktur &amp; XP
            </h3>
            <p className="mt-3 text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
              Setiap latihan yang diselesaikan memberikan poin XP dan pencapaian bertahap, membuat proses belajar konsisten, terarah, dan terukur.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-slate-900/20 flex items-center justify-between text-xs font-black text-slate-900">
            <span>72+ Latihan Bertahap</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Card 2: Electric Sky Blue */}
        <div className="rounded-3xl border-4 border-slate-900 bg-[#BAE6FD] p-7 shadow-[0_10px_0_#0f172a] hover:-translate-y-2 transition-transform duration-200 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[0_4px_0_#0f172a] mb-6">
              💻
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-white border-2 border-slate-900 text-xs font-display font-black text-slate-900 mb-3 shadow-[0_2px_0_#0f172a]">
              CLOUD RUNTIME
            </span>
            <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              Tanpa Setup Lingkungan Kerja
            </h3>
            <p className="mt-3 text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
              Tidak memerlukan instalasi aplikasi, compiler, atau konfigurasi lokal yang rumit. Cukup buka browser dan Anda bisa langsung mulai praktik.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-slate-900/20 flex items-center justify-between text-xs font-black text-slate-900">
            <span>100% Berbasis Browser</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Card 3: Strawberry Candy Red */}
        <div className="rounded-3xl border-4 border-slate-900 bg-[#FECDD3] p-7 shadow-[0_10px_0_#0f172a] hover:-translate-y-2 transition-transform duration-200 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[0_4px_0_#0f172a] mb-6">
              ⚡
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-white border-2 border-slate-900 text-xs font-display font-black text-slate-900 mb-3 shadow-[0_2px_0_#0f172a]">
              LIVE FEEDBACK
            </span>
            <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              Pratinjau Visual Real-Time
            </h3>
            <p className="mt-3 text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
              Setiap baris kode yang ditulis langsung dirender di layar seketika. Membantu memahami hubungan sintaksis dengan hasil visualnya secara gamblang.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-slate-900/20 flex items-center justify-between text-xs font-black text-slate-900">
            <span>Rendering Cepat 60 FPS</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
      </div>
    </section>
  );
};
