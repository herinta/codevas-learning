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
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-full py-2.5 px-4 md:px-6 shadow-[0_4px_0_#0f172a] flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <Link href={brandHref} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#EF4444] flex items-center justify-center text-white border-2 border-slate-900 shadow-[0_3px_0_#991b1b] transition-transform duration-200">
            <span className="text-xl">🚀</span>
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-[#1E3A8A] leading-none">
            Codevas
          </span>
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
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#BAE6FD] transition-colors"
          >
            Kelas
          </Link>
          <a
            href="#demo"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#BAE6FD] transition-colors"
          >
            Demo
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#FECDD3] transition-colors"
          >
            Fitur
          </a>
          <a
            href="#community"
            className="px-3.5 py-1.5 rounded-full text-sm font-label font-bold text-slate-700 hover:text-slate-900 hover:bg-[#FEF08A] transition-colors"
          >
            Komunitas
          </a>
        </nav>

        {/* Right CTAs / User Auth State */}
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF08A] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] hover:scale-105 transition-transform"
                title={`Level ${user.level || 1} — ${user.rank_title || 'Siswa Pemula'}`}
              >
                <span className="bg-white text-slate-900 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-slate-900">
                  Lv.{user.level || 1}
                </span>
                <span className="font-display font-black text-xs text-slate-900">
                  {user.xp_points} XP
                </span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-300"
              >
                <div className="w-7 h-7 rounded-full bg-[#EF4444] text-white text-xs font-black flex items-center justify-center border-2 border-slate-900 uppercase">
                  {user.username.slice(0, 2)}
                </div>
                <span className="font-display font-bold text-xs text-slate-900 max-w-[100px] truncate">
                  @{user.username}
                </span>
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-900 border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] hover:scale-105 transition-transform"
                  title="Panel Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="font-display font-black text-xs">Admin</span>
                </Link>
              )}

              <button
                onClick={() => logout()}
                className="p-2 rounded-full border-2 border-slate-900 bg-white hover:bg-red-50 hover:text-red-600 text-slate-700 shadow-[0_2px_0_#0f172a] transition-all cursor-pointer"
                title="Keluar / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href={loginHref}
                className="px-4 py-2 rounded-full text-sm font-bold text-slate-800 hover:bg-[#FEF08A] transition-colors border border-slate-300 cursor-pointer"
              >
                Masuk
              </Link>
              <Link
                href={registerHref}
                className="px-5 py-2 rounded-full bg-[#EF4444] hover:bg-[#dc2626] text-white font-black text-sm border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-full bg-[#EF4444] text-white text-xs font-black flex items-center justify-center border-2 border-slate-900 uppercase">
                {user.username.slice(0, 2)}
              </div>
            </Link>
          ) : (
            <Link
              href={loginHref}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 hover:bg-[#FEF08A] transition-colors border border-slate-300"
            >
              Masuk
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[0_2px_0_#0f172a] transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-sm mx-auto bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[0_6px_0_#0f172a] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-slate-900 bg-[#FEF08A] border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4 text-[#EF4444]" />
            <span>Dashboard Belajar</span>
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-900 bg-amber-400 border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Panel Admin (Monitoring &amp; Kelas)</span>
            </Link>
          )}
          <Link
            href={user ? "/dashboard/classes" : "#classes"}
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Kelas
          </Link>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Demo
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Fitur
          </a>
          <a
            href="#community"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Komunitas
          </a>

          <div className="pt-2 border-t-2 border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs font-bold text-slate-900">@{user.username} (Lv.{user.level || 1} • {user.xp_points} XP)</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                href={registerHref}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#EF4444] text-white font-bold text-sm border-2 border-slate-900 shadow-[0_3px_0_#991b1b] text-center block"
              >
                Daftar Gratis
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
