import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code,
  Flame,
  Star,
  Terminal,
  Award,
  Heart,
  Gift,
} from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  welcomeBonus?: boolean;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  welcomeBonus = false,
}) => {
  return (
    <div className="bg-[#FFFDF7] text-slate-900 min-h-screen relative overflow-x-hidden selection:bg-[#FEF08A] selection:text-slate-900 flex flex-col justify-between">
      {/* Background Floating Decorative Elements */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Top-Left Code Badge */}
        <div className="absolute top-28 left-4 md:left-12 animate-float-slow opacity-90 hidden lg:block">
          <div className="bg-[#EF4444] text-white border-3 border-slate-900 font-mono font-black px-4 py-2 rounded-2xl shadow-[0_4px_0_#0f172a] flex items-center gap-1.5 text-xs sm:text-sm rotate-[-8deg]">
            <Code className="w-4 h-4 text-white" />
            <span>&lt;codevas_hub /&gt;</span>
          </div>
        </div>

        {/* Top-Right XP Sparkle Badge */}
        <div className="absolute top-28 right-4 md:right-12 animate-float-reverse opacity-90 hidden lg:block">
          <div className="bg-[#FEF08A] text-slate-900 border-3 border-slate-900 font-display font-black px-4 py-2 rounded-2xl shadow-[0_4px_0_#0f172a] flex items-center gap-1.5 text-xs sm:text-sm rotate-[10deg]">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <span>+1,240 XP Ready!</span>
          </div>
        </div>

        {/* Floating Star Left */}
        <div className="absolute top-1/2 left-4 md:left-14 -translate-y-1/2 animate-float-reverse opacity-80 hidden sm:block">
          <div className="w-14 h-14 bg-[#BAE6FD] border-3 border-slate-900 rounded-2xl rotate-12 flex items-center justify-center shadow-[0_4px_0_#0f172a]">
            <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
          </div>
        </div>

        {/* Floating Terminal Tag Right */}
        <div className="absolute top-2/3 right-6 md:right-20 animate-float-slow opacity-90 hidden sm:block">
          <div className="bg-white border-3 border-slate-900 text-slate-900 font-mono font-black px-4 py-2 rounded-2xl shadow-[0_4px_0_#0f172a] flex items-center gap-2 text-xs rotate-[-6deg]">
            <Terminal className="w-4 h-4 text-[#EF4444]" />
            <span>npm run dev</span>
          </div>
        </div>

        {/* Bottom Left Trophy Token */}
        <div className="absolute bottom-10 left-12 md:left-32 animate-float-slow opacity-85 hidden md:block">
          <div className="w-12 h-12 bg-[#DCFCE7] border-3 border-slate-900 rounded-2xl flex items-center justify-center shadow-[0_3px_0_#0f172a] rotate-[18deg]">
            <Award className="w-6 h-6 text-emerald-700" />
          </div>
        </div>

        {/* Bottom Right CSS Badge */}
        <div className="absolute bottom-8 right-12 md:right-36 animate-float-reverse opacity-90 hidden md:block">
          <div className="bg-[#FECDD3] border-3 border-slate-900 text-slate-900 font-display font-black px-4 py-1.5 rounded-2xl shadow-[0_3px_0_#0f172a] flex items-center gap-1.5 text-xs rotate-3">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Frontend is Fun</span>
          </div>
        </div>
      </div>

      {/* Primary Layout Container */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Top Header Navigation */}
        <header className="w-full flex items-center justify-between py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 text-slate-900 font-display font-black text-xs sm:text-sm rounded-2xl shadow-[0_2px_0_#0f172a] hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            {welcomeBonus && (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#FEF08A] text-slate-900 border-2 border-slate-900 px-3.5 py-1.5 rounded-full font-mono font-black text-xs shadow-[0_2px_0_#0f172a]">
                <Gift className="w-3.5 h-3.5 text-red-500" />
                <span>+500 XP Welcome Bonus!</span>
              </div>
            )}

            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-2xl bg-[#EF4444] border-2 border-slate-900 shadow-[0_3px_0_#991b1b] flex items-center justify-center text-lg group-hover:-translate-y-0.5 transition-transform">
                🚀
              </span>
              <span className="font-display font-black text-2xl tracking-tight text-[#1E3A8A]">
                Codevas
              </span>
            </Link>
          </div>
        </header>

        {/* Center Card */}
        <main className="w-full flex items-center justify-center py-6 sm:py-8 my-auto">
          {children}
        </main>

        {/* Footer info */}
        <footer className="text-center py-3 text-xs font-bold text-slate-500">
          © 2026 Codevas. Platform Pembelajaran Frontend Interaktif &amp; Gamifikasi Pemula.
        </footer>
      </div>
    </div>
  );
};
