"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { SocialAuth } from "./social-auth";

export const RegisterForm: React.FC = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("@budicodes");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("CandySecret#2026");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Password strength calculation (0 to 4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(`Selamat datang di Codevas, ${fullname || username}! Akunmu berhasil dibuat 🎉`);
      setSubmitted(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl border-4 border-on-surface neo-card p-6 sm:p-9 md:p-10 relative neo-shadow">
      {/* Header Section */}
      <div className="text-center space-y-2.5 mb-7">
        <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-container px-3.5 py-1 rounded-full border-2 border-on-surface text-xs font-headline font-extrabold shadow-brutal-sm">
          <Zap className="w-3.5 h-3.5 text-tertiary fill-tertiary" />
          <span>Mulai Koding 2 Menit!</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
          Buat Akun Baru
        </h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant font-medium max-w-md mx-auto">
          Gabung komunitas developer kreatif &amp; bangun portfolio impianmu!
        </p>
      </div>

      {/* SSO Quick Actions */}
      <SocialAuth mode="register" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="w-full border-t-2 border-on-surface"></div>
        <span className="absolute bg-surface-container-lowest px-3 font-headline font-black text-xs tracking-wider text-on-surface-variant uppercase">
          ATAU DAFTAR MANUAL
        </span>
      </div>

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Fullname */}
        <div>
          <label
            className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface mb-1.5"
            htmlFor="fullname"
          >
            Nama Lengkap
          </label>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <User className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="fullname"
              type="text"
              required
              placeholder="Budi Santoso"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-on-surface font-body font-medium placeholder:text-outline text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Username / Handle with availability badge */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface"
              htmlFor="username"
            >
              Username / Handle
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-600 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tersedia</span>
            </span>
          </div>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <AtSign className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="username"
              type="text"
              required
              placeholder="@budicodes"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-on-surface font-headline font-bold placeholder:text-outline text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface mb-1.5"
            htmlFor="email"
          >
            Email Pengguna
          </label>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <Mail className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="email"
              type="email"
              required
              placeholder="budi@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-on-surface font-body font-medium placeholder:text-outline text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface"
              htmlFor="password"
            >
              Kata Sandi
            </label>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>{strength >= 3 ? "Kuat & Aman" : "Standar"}</span>
            </span>
          </div>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <Lock className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimal 8 karakter unik"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-on-surface font-mono font-medium placeholder:text-outline text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-on-surface-variant hover:text-on-surface ml-2 focus:outline-none"
              title="Lihat password"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength 4 Candy Bars */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            <div
              className={`h-2 rounded-full border border-on-surface transition-colors ${
                strength >= 1 ? "bg-primary" : "bg-surface-container-highest"
              }`}
            ></div>
            <div
              className={`h-2 rounded-full border border-on-surface transition-colors ${
                strength >= 2 ? "bg-primary" : "bg-surface-container-highest"
              }`}
            ></div>
            <div
              className={`h-2 rounded-full border border-on-surface transition-colors ${
                strength >= 3 ? "bg-secondary" : "bg-surface-container-highest"
              }`}
            ></div>
            <div
              className={`h-2 rounded-full border border-on-surface transition-colors ${
                strength >= 4 ? "bg-tertiary" : "bg-surface-container-highest"
              }`}
            ></div>
          </div>
        </div>

        {/* Checkbox Terms */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded-lg border-2 border-on-surface text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary"
            />
            <span className="font-body text-xs sm:text-sm text-on-surface font-medium leading-tight">
              Saya menyetujui{" "}
              <a
                href="#"
                className="font-bold underline decoration-primary decoration-2 underline-offset-2 hover:text-primary"
              >
                Ketentuan Layanan
              </a>{" "}
              &amp;{" "}
              <a
                href="#"
                className="font-bold underline decoration-secondary decoration-2 underline-offset-2 hover:text-secondary"
              >
                Kebijakan Privasi
              </a>{" "}
              Codevas.
            </span>
          </label>
        </div>

        {/* CTA Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={submitted}
            className="w-full py-4 px-6 bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-lg rounded-2xl border-4 border-on-surface neo-button shadow-brutal flex items-center justify-center gap-2 group transition-all active:translate-y-1 disabled:opacity-50"
          >
            <span>{submitted ? "Mendaftarkan..." : "Buat Akun Sekarang"}</span>
            <span className="text-xl group-hover:rotate-12 transition-transform">
              🎉
            </span>
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-7 text-center pt-5 border-t-2 border-dashed border-outline-variant">
        <p className="font-body text-sm font-semibold text-on-surface">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-headline font-black text-secondary hover:text-primary underline decoration-2 underline-offset-4 ml-1 inline-flex items-center gap-1 group"
          >
            <span>Masuk di sini</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </div>
    </div>
  );
};
