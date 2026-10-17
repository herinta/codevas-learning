"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            href="/classes"
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

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
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
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="px-2.5">
              Masuk
            </Button>
          </Link>
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
            className="px-3 py-2 rounded-xl text-sm font-bold text-primary bg-primary-fixed"
          >
            Dashboard Belajar
          </Link>
          <Link
            href="/classes"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container"
          >
            Silabus Semua Kelas
          </Link>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-primary bg-primary-fixed"
          >
            Playground Interaktif
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container"
          >
            Keunggulan
          </a>
          <a
            href="#community"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container"
          >
            Komunitas
          </a>
          <div className="pt-2 border-t border-outline-variant flex flex-col gap-2">
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Mulai Belajar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
