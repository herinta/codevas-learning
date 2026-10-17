"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { SocialAuth } from "./social-auth";

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Client-side demo feedback
    setTimeout(() => {
      alert(`Selamat datang kembali di Codevas, ${identifier || "Teman Koding"}!`);
      setSubmitted(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-lg bg-surface-container-lowest border-[3px] border-on-surface rounded-2xl p-6 sm:p-8 md:p-10 neo-shadow transition-all relative">
      {/* Header Section */}
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-1.5 bg-primary-fixed border-2 border-on-surface text-on-primary-fixed px-3.5 py-1 rounded-full text-xs sm:text-sm font-label font-bold neo-shadow-sm">
          <span>👋 Halo Teman Koding!</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
          Masuk ke Akun
        </h1>
        <p className="font-body text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          Lanjutkan petualangan koding frontend dan kumpulkan XP harianmu!
        </p>
      </div>

      {/* SSO Buttons */}
      <SocialAuth mode="login" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t-2 border-on-surface w-full"></div>
        <span className="bg-surface-container-lowest px-3 text-[11px] font-label font-black tracking-wider text-on-surface-variant uppercase relative">
          ATAU DENGAN EMAIL
        </span>
      </div>

      {/* Credentials Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email / Username Input */}
        <div>
          <label
            className="block text-xs sm:text-sm font-label font-bold text-on-surface mb-1.5 ml-1"
            htmlFor="email-field"
          >
            Email atau Username
          </label>
          <div className="relative flex items-center">
            <input
              id="email-field"
              type="text"
              required
              placeholder="nama@email.com atau @username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-on-surface text-on-surface placeholder:text-outline font-body text-sm rounded-full py-3 pl-4 pr-11 focus:outline-none focus:ring-2 focus:ring-primary focus:border-on-surface transition-all"
            />
            <Mail className="w-5 h-5 text-on-surface-variant absolute right-4 pointer-events-none" />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
            <label
              className="text-xs sm:text-sm font-label font-bold text-on-surface"
              htmlFor="password-field"
            >
              Kata Sandi
            </label>
            <a
              href="#"
              className="text-xs font-label font-bold text-secondary hover:text-primary transition-colors hover:underline"
            >
              Lupa sandi?
            </a>
          </div>
          <div className="relative flex items-center">
            <input
              id="password-field"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-on-surface text-on-surface placeholder:text-outline font-body text-sm rounded-full py-3 pl-4 pr-11 focus:outline-none focus:ring-2 focus:ring-primary focus:border-on-surface transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-on-surface-variant hover:text-on-surface focus:outline-none transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Help link */}
        <div className="flex items-center justify-between pt-1 pb-2 px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-md border-2 border-on-surface text-primary focus:ring-primary focus:ring-offset-0 transition accent-primary cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-label font-medium text-on-surface">
              Ingat saya
            </span>
          </label>
          <a
            href="#"
            className="text-xs font-label font-medium text-on-surface-variant hover:text-on-surface hover:underline"
          >
            Pusat Bantuan
          </a>
        </div>

        {/* Main CTA Button */}
        <button
          type="submit"
          disabled={submitted}
          className="w-full py-3.5 px-6 bg-inverse-surface text-inverse-on-surface font-label font-black text-base rounded-full border-2 border-on-surface neo-shadow-button transition-transform duration-150 flex items-center justify-center gap-2 group hover:bg-[#1a0f17] active:scale-95 disabled:opacity-50"
        >
          <span>{submitted ? "Memproses..." : "Masuk ke Codevas"}</span>
          <span className="text-lg group-hover:scale-125 transition-transform">
            🚀
          </span>
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 text-center pt-6 border-t-2 border-dashed border-outline-variant">
        <p className="font-body text-sm font-medium text-on-surface-variant">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-headline font-black text-primary hover:text-[#c02080] underline decoration-2 underline-offset-4 ml-1 inline-flex items-center gap-1 group"
          >
            <span>Daftar gratis sekarang</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-500 fill-amber-400" />
          </Link>
        </p>
      </div>
    </div>
  );
};
