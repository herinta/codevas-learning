import React from "react";
import { Zap, Layout, Eye, CheckCircle2 } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-surface max-w-6xl mx-auto" id="features">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed border-2 border-on-surface text-secondary font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#2e1a28]">
          Kenapa Harus Codevas
        </div>
        <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight">
          Didesain Khusus untuk Otak Kreatif
        </h2>
        <p className="mt-3 text-base sm:text-lg text-on-surface-variant font-medium">
          Tiga pilar kenyamanan yang bikin proses belajar tidak lagi terasa seperti
          membaca dokumentasi teknis yang membosankan.
        </p>
      </div>

      {/* 3 Parallel Flat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Pastel Lemon */}
        <div className="rounded-2xl border-4 border-on-surface bg-[#FEF08A] p-7 shadow-[0_10px_0_#2e1a28] hover:-translate-y-2 transition-transform duration-200 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center text-on-surface shadow-[0_4px_0_#2e1a28] mb-6">
              <Zap className="w-8 h-8 text-[#d48b00] fill-[#fde047]" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container-lowest border-2 border-on-surface text-xs font-display font-black text-on-surface mb-3">
              LANGSUNG NGEBUT
            </span>
            <h3 className="font-display font-black text-2xl text-on-surface tracking-tight">
              Zero Setup
            </h3>
            <p className="mt-3 text-on-surface/90 font-medium text-sm sm:text-base leading-relaxed">
              Lupakan instalasi Node.js, terminal bash, atau konfigurasi webpack
              yang bikin pusing. Cukup buka peramban dan kamu siap mengoding seketika.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-on-surface/20 flex items-center justify-between text-xs font-bold text-on-surface">
            <span>Browser Ready</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Card 2: Bubblegum Pink */}
        <div className="rounded-2xl border-4 border-on-surface bg-[#ffd6ee] p-7 shadow-[0_10px_0_#2e1a28] hover:-translate-y-2 transition-transform duration-200 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center text-primary shadow-[0_4px_0_#2e1a28] mb-6">
              <Layout className="w-8 h-8 text-primary" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container-lowest border-2 border-on-surface text-xs font-display font-black text-on-surface mb-3">
              PRODUKSI SIAP PAKAI
            </span>
            <h3 className="font-display font-black text-2xl text-on-surface tracking-tight">
              Real-world Templates
            </h3>
            <p className="mt-3 text-on-surface/90 font-medium text-sm sm:text-base leading-relaxed">
              Belajar dengan memanipulasi komponen modern yang dipakai oleh
              startup: landing page, e-commerce checkout, dashboard analitik, dan chat bubble.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-on-surface/20 flex items-center justify-between text-xs font-bold text-on-surface">
            <span>50+ Proyek Nyata</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Card 3: Sky Blue */}
        <div className="rounded-2xl border-4 border-on-surface bg-[#c8eaff] p-7 shadow-[0_10px_0_#2e1a28] hover:-translate-y-2 transition-transform duration-200 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center text-tertiary shadow-[0_4px_0_#2e1a28] mb-6">
              <Eye className="w-8 h-8 text-tertiary" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container-lowest border-2 border-on-surface text-xs font-display font-black text-on-surface mb-3">
              FEEDBACK INSTAN
            </span>
            <h3 className="font-display font-black text-2xl text-on-surface tracking-tight">
              Instant Visual Feedback
            </h3>
            <p className="mt-3 text-on-surface/90 font-medium text-sm sm:text-base leading-relaxed">
              Tiap baris CSS atau tag HTML yang kamu ubah ter-render dalam
              sekejap mata. Pahami bagaimana layout bereaksi tanpa rasa frustrasi.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-on-surface/20 flex items-center justify-between text-xs font-bold text-on-surface">
            <span>Kompilasi 0.02s</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
      </div>
    </section>
  );
};
