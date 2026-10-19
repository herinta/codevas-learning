"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer inside dashboard, classes detail, profile, and admin app scope
  const isAppScope =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/classes/") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/admin");

  if (isAppScope) {
    return null;
  }

  const registerHref = pathname?.startsWith("/demo") ? "/demo/register" : "/register";

  return (
    <footer className="bg-surface-container-lowest border-t-4 border-on-surface pt-16 pb-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand & Tagline */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EF4444] flex items-center justify-center text-white border-2 border-slate-900 shadow-[0_3px_0_#991b1b]">
              <span className="text-xl">🚀</span>
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-[#1E3A8A] leading-none">
              Codevas
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-sm">
            Platform belajar pemrograman web interaktif berbasis visual untuk semua tingkatan usia. Memahami konsep HTML, CSS, dan logika web secara bertahap dan terstruktur.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-bold text-slate-500">
            <span>Dibuat untuk memudahkan pembelajaran coding modern secara visual.</span>
          </div>
        </div>

        {/* Links Col 1: Pembelajaran */}
        <div className="md:col-span-2 sm:col-span-4 space-y-3">
          <h4 className="font-display font-black text-sm uppercase tracking-wider text-on-surface">
            Pembelajaran
          </h4>
          <ul className="space-y-2 text-sm font-medium text-on-surface-variant">
            <li>
              <a href="#demo" className="hover:text-primary transition-colors">
                CSS Flexbox
              </a>
            </li>
            <li>
              <a href="#curriculum" className="hover:text-primary transition-colors">
                CSS Grid
              </a>
            </li>
            <li>
              <a href="#curriculum" className="hover:text-primary transition-colors">
                HTML5 Semantik
              </a>
            </li>
            <li>
              <a href="#curriculum" className="hover:text-primary transition-colors">
                React 19 Components
              </a>
            </li>
          </ul>
        </div>

        {/* Links Col 2: Fitur */}
        <div className="md:col-span-2 sm:col-span-4 space-y-3">
          <h4 className="font-display font-black text-sm uppercase tracking-wider text-on-surface">
            Fitur
          </h4>
          <ul className="space-y-2 text-sm font-medium text-on-surface-variant">
            <li>
              <a href="#demo" className="hover:text-primary transition-colors">
                Live Playground
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-primary transition-colors">
                Tantangan Kode
              </a>
            </li>
            <li>
              <a href="#community" className="hover:text-primary transition-colors">
                Sistem XP & Trofi
              </a>
            </li>
            <li>
              <Link href={registerHref} className="hover:text-primary transition-colors">
                Kuis Live Syntax
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Col 3: Akun & Legal */}
        <div className="md:col-span-3 sm:col-span-4 space-y-3">
          <h4 className="font-display font-black text-sm uppercase tracking-wider text-on-surface">
            Mulai Sekarang
          </h4>
          <div className="space-y-2 text-sm font-medium text-on-surface-variant">
            <p className="text-xs">
              Bergabung bersama 45,000+ pelajar dan selesaikan tantangan pertamamu hari ini.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={registerHref}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-label font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow hover:scale-105 transition-all text-center"
              >
                Buat Akun Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-on-surface-variant">
        <p>© 2026 Codevas. Hak Cipta Dilindungi.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:underline">
            Ketentuan Layanan
          </a>
          <a href="#" className="hover:underline">
            Kebijakan Privasi
          </a>
          <a href="#" className="hover:underline">
            Bantuan
          </a>
        </div>
      </div>
    </footer>
  );
};
