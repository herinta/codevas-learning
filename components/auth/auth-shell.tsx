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
    <div className="bg-[#c8eaff] text-on-surface min-h-screen relative overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col justify-between">
      {/* Background Floating Decorative Elements */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Top-Left Code Badge */}
        <div className="absolute top-12 left-6 md:left-24 animate-float-slow opacity-85">
          <div className="bg-primary text-white border-2 border-on-surface font-black px-4 py-2 rounded-full neo-shadow-sm flex items-center gap-1.5 text-xs sm:text-sm rotate-[-8deg]">
            <Code className="w-4 h-4" />
            <span>&lt;candy_code /&gt;</span>
          </div>
        </div>

        {/* Top-Right XP Sparkle Badge */}
        <div className="absolute top-20 right-8 md:right-28 animate-float-reverse opacity-90">
          <div className="bg-secondary text-white border-2 border-on-surface font-black px-4 py-2.5 rounded-full neo-shadow-sm flex items-center gap-1.5 text-xs sm:text-sm rotate-[10deg]">
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>+1,240 XP Ready!</span>
          </div>
        </div>

        {/* Floating Sugar Star Left */}
        <div className="absolute top-1/2 left-4 md:left-14 -translate-y-1/2 animate-float-reverse opacity-75 hidden sm:block">
          <div className="w-14 h-14 bg-primary-fixed border-2 border-on-surface rounded-2xl rotate-12 flex items-center justify-center neo-shadow-sm">
            <Star className="w-7 h-7 text-primary fill-primary" />
          </div>
        </div>

        {/* Floating Terminal Tag Right */}
        <div className="absolute top-2/3 right-6 md:right-20 animate-float-slow opacity-85 hidden sm:block">
          <div className="bg-surface-container-lowest border-2 border-on-surface text-secondary font-bold px-4 py-2 rounded-full neo-shadow-sm flex items-center gap-2 text-xs rotate-[-6deg]">
            <Terminal className="w-4 h-4 text-tertiary" />
            <span>npm run sugar-blast</span>
          </div>
        </div>

        {/* Bottom Left Cookie Token */}
        <div className="absolute bottom-10 left-12 md:left-32 animate-float-slow opacity-80 hidden md:block">
          <div className="w-12 h-12 bg-secondary-fixed border-2 border-on-surface rounded-full flex items-center justify-center neo-shadow-sm rotate-[18deg]">
            <Award className="w-6 h-6 text-secondary" />
          </div>
        </div>

        {/* Bottom Right CSS Sweet Badge */}
        <div className="absolute bottom-8 right-12 md:right-36 animate-float-reverse opacity-85 hidden md:block">
          <div className="bg-tertiary-container border-2 border-on-surface text-on-tertiary-container font-black px-4 py-1.5 rounded-full neo-shadow-sm flex items-center gap-1.5 text-xs rotate-3">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>CSS is Sweet</span>
          </div>
        </div>
      </div>

      {/* Primary Layout Container */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Top Header Navigation */}
        <header className="w-full flex items-center justify-between py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border-2 border-on-surface text-on-surface font-label font-bold text-xs sm:text-sm rounded-full neo-shadow-sm hover:bg-surface-container transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            {welcomeBonus && (
              <div className="hidden sm:flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed border-2 border-on-surface px-3 py-1.5 rounded-full font-headline font-black text-xs shadow-[0_2px_0_#2e1a28]">
                <Gift className="w-3.5 h-3.5 text-primary" />
                <span>+500 XP Welcome Bonus!</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-surface-container-lowest border-2 border-on-surface px-3.5 py-1.5 rounded-full neo-shadow-sm">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-display font-black text-xs border border-on-surface">
                C
              </div>
              <span className="font-display font-black text-lg tracking-tight text-primary">
                Codevas
              </span>
            </div>
          </div>
        </header>

        {/* Center Card */}
        <main className="w-full flex items-center justify-center py-6 sm:py-8 my-auto">
          {children}
        </main>

        {/* Footer info */}
        <footer className="text-center py-3 text-xs font-semibold text-on-surface/70">
          © 2026 Codevas. Platform Pembelajaran Frontend Interaktif.
        </footer>
      </div>
    </div>
  );
};
