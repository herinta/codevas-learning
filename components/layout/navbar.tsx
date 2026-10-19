"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X, Sparkles, LogOut, LayoutGrid, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isDemo = pathname ? pathname.startsWith("/demo") : false;
  const brandHref = isDemo ? "/demo" : "/";
  const loginHref = isDemo ? "/demo/login" : "/login";
  const registerHref = isDemo ? "/demo/register" : "/register";

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-surface-container-lowest border-2 border-on-surface rounded-full py-2.5 px-4 md:px-6 shadow-[0_6px_0_#2e1a28] flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <Link href={brandHref} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#EF4444] flex items-center justify-center text-white border-2 border-slate-900 shadow-[0_3px_0_#991b1b] group-hover:rotate-12 transition-transform duration-200">
            <span className="text-xl">🚀</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-2xl tracking-tight text-[#1E3A8A] leading-none">
              Codevas
            </span>
            <span className="bg-[#FACC15] text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-[0_2px_0_#ca8a04] rotate-3 uppercase tracking-wider">
              KIDS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#FEF08A] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={user ? "/dashboard/classes" : "#classes"}
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#BAE6FD] transition-colors flex items-center gap-1"
          >
            <span>🗺️</span>
            <span>Peta Petualangan</span>
          </Link>
          <a
            href="#demo"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-[#1E3A8A] bg-[#BAE6FD] border border-[#0284C7] transition-colors flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <span>🎮</span>
            <span>Arena Main</span>
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#FECDD3] transition-colors"
          >
            Kenapa Seru?
          </a>
          <a
            href="#community"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#FEF08A] transition-colors flex items-center gap-1"
          >
            <span>⭐️</span>
            <span>Trofi Juara</span>
          </a>
        </nav>

        {/* Right CTAs / User Auth State */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-brutal-sm hover:scale-105 transition-transform"
                title={`Level ${user.level || 1} — ${user.rank_title || 'Siswa Pemula'}`}
              >
                <span className="bg-amber-300 text-on-surface text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-on-surface">
                  Lv.{user.level || 1}
                </span>
                <span className="font-display font-black text-xs text-secondary">
                  {user.xp_points} XP
                </span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-surface-container transition-colors border border-outline-variant"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center border border-on-surface uppercase">
                  {user.username.slice(0, 2)}
                </div>
                <span className="font-headline font-bold text-xs text-on-surface max-w-[100px] truncate">
                  @{user.username}
                </span>
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-on-surface border-2 border-on-surface rounded-full shadow-brutal-sm hover:scale-105 transition-transform"
                  title="Panel Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="font-headline font-black text-xs">Admin</span>
                </Link>
              )}

              <button
                onClick={() => logout()}
                className="p-2 rounded-full border border-on-surface bg-surface-container hover:bg-red-50 hover:text-red-600 text-on-surface-variant transition-colors"
                title="Keluar / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href={loginHref}>
                <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-800 hover:bg-[#FEF08A] transition-colors border border-slate-300 cursor-pointer">
                  Masuk
                </button>
              </Link>
              <Link href={registerHref}>
                <button className="px-5 py-2 rounded-full bg-[#EF4444] hover:bg-[#dc2626] text-white font-black text-sm border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>🚀</span>
                  <span>Mulai Main!</span>
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center border-2 border-on-surface uppercase">
                {user.username.slice(0, 2)}
              </div>
            </Link>
          ) : (
            <Link href={loginHref}>
              <Button variant="ghost" size="sm" className="px-2.5">
                Masuk
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full border border-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-on-surface" />
            ) : (
              <Menu className="w-5 h-5 text-on-surface" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 max-w-sm mx-auto bg-surface-container-lowest border-2 border-on-surface rounded-2xl p-4 shadow-[0_6px_0_#2e1a28] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-primary bg-primary-fixed flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard Belajar</span>
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-on-surface bg-amber-400 border border-on-surface flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Panel Admin (Monitoring &amp; Kelas)</span>
            </Link>
          )}
          <Link
            href={user ? "/dashboard/classes" : "#classes"}
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container"
          >
            Silabus Kelas
          </Link>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container"
          >
            Playground Interaktif
          </a>

          <div className="pt-2 border-t border-outline-variant flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs font-bold text-on-surface">@{user.username} (Lv.{user.level || 1} • {user.xp_points} XP)</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-bold text-red-600 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link href={registerHref} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Mulai Belajar Sekarang
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
