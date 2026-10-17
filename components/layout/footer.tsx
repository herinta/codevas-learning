import React from "react";
import Link from "next/link";
import { Terminal, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t-4 border-on-surface pt-16 pb-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand & Tagline */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white border-2 border-on-surface shadow-[0_2px_0_#2e1a28]">
              <Terminal className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tight text-primary leading-none">
                Codevas
              </span>
              <span className="text-[10px] font-bold text-secondary tracking-widest leading-none mt-0.5">
                INTERACTIVE ENGINE
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed max-w-sm">
            Platform belajar web development modern berbasis manipulasi template
            nyata dan gamifikasi. Didesain untuk pemula, remaja, dan developer kreatif.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-bold text-on-surface-variant">
            <span>Dibuat dengan</span>
            <Heart className="w-4 h-4 fill-primary text-primary" />
            <span>untuk talenta developer masa depan</span>
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
              <Link href="/register" className="hover:text-primary transition-colors">
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
                href="/register"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-label font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow hover:scale-105 transition-all text-center"
              >
                Buat Akun Gratis 🚀
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
