import React from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  PlayCircle,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-surface-container-lowest">
      {/* Subtle Concentric Rings Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[300px] h-[300px] rounded-full border border-outline-variant absolute"></div>
        <div className="w-[520px] h-[520px] rounded-full border border-outline-variant absolute"></div>
        <div className="w-[740px] h-[740px] rounded-full border border-outline-variant absolute"></div>
        <div className="w-[980px] h-[980px] rounded-full border border-outline-variant absolute"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        {/* Floating Crisp Tech Badges */}
        <div className="hidden lg:flex absolute left-8 top-12 items-center gap-2 bg-[#ff5722]/10 border-2 border-on-surface px-4 py-2 rounded-full shadow-[0_4px_0_#2e1a28] rotate-[-6deg] hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <span className="w-3 h-3 rounded-full bg-[#ff5722]"></span>
          <span className="font-display font-black text-xs text-[#d84315] tracking-wider">
            HTML5
          </span>
        </div>

        <div className="hidden lg:flex absolute right-12 top-10 items-center gap-2 bg-[#29b6f6]/15 border-2 border-on-surface px-4 py-2 rounded-full shadow-[0_4px_0_#2e1a28] rotate-[8deg] hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <span className="w-3 h-3 rounded-full bg-tertiary"></span>
          <span className="font-display font-black text-xs text-tertiary tracking-wider">
            CSS3 MAGIC
          </span>
        </div>

        <div className="hidden lg:flex absolute left-2 top-56 items-center gap-2 bg-[#ffd600]/25 border-2 border-on-surface px-4 py-2 rounded-full shadow-[0_4px_0_#2e1a28] rotate-[-12deg] hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <span className="w-3 h-3 rounded-full bg-[#f57f17]"></span>
          <span className="font-display font-black text-xs text-[#b26a00] tracking-wider">
            JAVASCRIPT ES6+
          </span>
        </div>

        <div className="hidden lg:flex absolute right-4 top-60 items-center gap-2 bg-secondary-fixed border-2 border-on-surface px-4 py-2 rounded-full shadow-[0_4px_0_#2e1a28] rotate-[10deg] hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <span className="w-3 h-3 rounded-full bg-secondary"></span>
          <span className="font-display font-black text-xs text-secondary tracking-wider">
            REACT 19
          </span>
        </div>

        {/* Hero Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed border-2 border-on-surface shadow-[0_3px_0_#2e1a28] mb-6 animate-bounce duration-1000">
          <Flame className="w-4 h-4 fill-primary text-primary" />
          <span className="text-xs md:text-sm font-label font-black text-on-primary-fixed tracking-wide">
            LEVEL UP CODING SKILLS • SERU & INTERAKTIF
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-on-surface leading-[1.1] max-w-4xl mx-auto">
          Belajar Coding Web Jadi Semenyenangkan{" "}
          <span className="relative inline-block text-primary">
            Bermain Game
            <span className="absolute left-0 -bottom-2 w-full h-3 bg-secondary-container -z-10 rounded-full"></span>
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-lg sm:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
          Buka browser, ketik kode nyata, dan saksikan tampilan visual langsung
          berubah seketika. Tanpa setup rumit, penuh quest berhadiah XP!
        </p>

        {/* CTA Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-label font-black text-lg border-2 border-on-surface shadow-[0_6px_0_#2e1a28] hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#2e1a28] transition-all flex items-center justify-center gap-3 group"
          >
            <span>Mulai Belajar Gratis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-surface-container-lowest text-on-surface font-label font-bold text-lg border-2 border-on-surface shadow-[0_4px_0_#2e1a28] hover:bg-surface-container transition-all flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5 text-secondary fill-secondary-container" />
            <span>Lihat Demo Interaktif</span>
          </a>
        </div>

        {/* Overlapping Stacked Preview Cards */}
        <div className="mt-16 max-w-4xl mx-auto relative pt-4">
          {/* Background Offset Cards */}
          <div className="absolute inset-x-6 top-0 h-48 bg-secondary-fixed rounded-2xl border-2 border-on-surface rotate-[-2deg] opacity-75"></div>
          <div className="absolute inset-x-3 top-2 h-52 bg-tertiary-fixed rounded-2xl border-2 border-on-surface rotate-[1.5deg] opacity-80"></div>

          {/* Main Foreground Card */}
          <div className="relative bg-surface-container-lowest border-4 border-on-surface rounded-2xl p-4 sm:p-6 shadow-[0_12px_0_#2e1a28] z-20">
            {/* Mock Window Bar */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-outline-variant mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-on-surface"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-on-surface"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-on-surface"></span>
                <span className="ml-3 text-xs font-mono font-bold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant/60">
                  mission_01_avatar_card.html
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-black text-xs border border-primary/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-primary" />
                  <span>+150 XP</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-secondary font-black text-xs border border-secondary/30">
                  Lv. 4
                </span>
              </div>
            </div>

            {/* Mock Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-left">
              <div className="md:col-span-5 bg-surface-container rounded-xl p-4 border border-outline-variant font-mono text-xs text-on-surface space-y-1.5 shadow-inner">
                <p className="text-secondary font-bold">
                  &lt;div class=&quot;candy-card&quot;&gt;
                </p>
                <p className="pl-4 text-primary font-medium">
                  &lt;h3&gt;Halo Dunia Visual!&lt;/h3&gt;
                </p>
                <p className="pl-4 text-tertiary font-medium">
                  &lt;button bg=&quot;candy-pink&quot;&gt;
                </p>
                <p className="pl-8 text-on-surface font-semibold">
                  Klik Saya! ✨
                </p>
                <p className="pl-4 text-tertiary font-medium">&lt;/button&gt;</p>
                <p className="text-secondary font-bold">&lt;/div&gt;</p>
              </div>

              <div className="md:col-span-7 flex flex-col sm:flex-row items-center gap-4 bg-primary-fixed/20 border-2 border-dashed border-primary/40 rounded-xl p-5">
                <div className="w-16 h-16 rounded-full bg-primary border-2 border-on-surface flex items-center justify-center text-white shrink-0 shadow-[0_4px_0_#2e1a28]">
                  <Palette className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-display font-black text-on-surface">
                      Hasil Render Langsung
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-400">
                      Live 60fps
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                    Komponen reaktif yang kamu ubah terkompilasi dalam hitungan
                    milidetik. Belajar tata letak Flexbox dan Grid tidak lagi
                    membingungkan!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
