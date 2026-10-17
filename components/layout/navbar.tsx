"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X, Sparkles, LogOut, LayoutGrid, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-surface-container-lowest border-2 border-on-surface rounded-full py-2.5 px-4 md:px-6 shadow-[0_6px_0_#2e1a28] flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white border-2 border-on-surface shadow-[0_2px_0_#2e1a28] group-hover:rotate-12 transition-transform duration-200">
            <Terminal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-tight text-primary leading-none">
              Codevas
            </span>
            <span className="text-[10px] font-bold text-secondary tracking-widest leading-none mt-0.5">
              PLAYGROUND
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-full text-sm font-label font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={user ? "/classes" : "#classes"}
            className="px-4 py-1.5 rounded-full text-sm font-label font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Silabus
          </Link>
          <a
            href="#demo"
            className="px-4 py-1.5 rounded-full text-sm font-label font-bold text-primary bg-primary-fixed border border-primary/20 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Playground</span>
          </a>
          <a
            href="#features"
            className="px-4 py-1.5 rounded-full text-sm font-label font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Keunggulan
          </a>
          <a
            href="#community"
            className="px-4 py-1.5 rounded-full text-sm font-label font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Komunitas
          </a>
        </nav>

        {/* Right CTAs / User Auth State */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-brutal-sm hover:scale-105 transition-transform"
                title="XP Pengguna"
              >
                <Zap className="w-3.5 h-3.5 text-secondary fill-secondary" />
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
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Daftar Gratis
                </Button>
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
            <Link href="/login">
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
          <Link
            href={user ? "/classes" : "#classes"}
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
                <span className="text-xs font-bold text-on-surface">@{user.username} ({user.xp_points} XP)</span>
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
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
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
