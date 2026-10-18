"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { SocialAuth } from "./social-auth";
import { useAuth } from "./auth-context";

interface LoginFormProps {
  isDemoMode?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isDemoMode = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useAuth();

  const showDemoBox = isDemoMode || pathname.startsWith("/demo");

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal masuk. Periksa kembali email/username dan kata sandi.");
        setLoading(false);
        return;
      }

      setUser(data.user);
      
      // Direct redirect ke Dashboard atau tujuan redirect tanpa alert/jeda
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const redirectUrl = params?.get("redirect") || "/dashboard";
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Cek koneksi Anda lalu coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-surface-container-lowest border-[3px] border-on-surface rounded-2xl p-6 sm:p-8 md:p-10 neo-shadow transition-all relative">
      {/* Header Section */}
      <div className="text-center space-y-3 mb-6">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
          Masuk ke Akun
        </h1>
        <p className="font-body text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          Lanjutkan pembelajaran koding frontend dan kumpulkan XP harianmu.
        </p>
      </div>

      {/* SSO Buttons */}
      <SocialAuth mode="login" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t-2 border-on-surface w-full"></div>
        <span className="bg-surface-container-lowest px-3 text-[11px] font-label font-black tracking-wider text-on-surface-variant uppercase relative">
          ATAU DENGAN EMAIL / USERNAME
        </span>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-100 border-2 border-red-500 rounded-2xl flex items-start gap-2.5 text-red-900 text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Demo Credentials Helper - KHUSUS UNTUK LINK PORTO /demo */}
      {showDemoBox && (
        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-on-surface rounded-2xl neo-shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-headline font-black text-xs sm:text-sm text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
              <span>Akses Demo Cepat</span>
            </span>
            <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-400">
              DEMO
            </span>
          </div>
          <p className="text-[11px] text-amber-900/80 font-medium leading-tight">
            Pilih akun uji coba untuk pengisian otomatis:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Akun Demo Siswa */}
            <button
              type="button"
              onClick={() => {
                setIdentifier("demo");
                setPassword("demo123");
              }}
              className="p-2.5 rounded-xl border-2 border-on-surface bg-white hover:bg-secondary-fixed/30 text-left transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-headline font-black text-xs text-secondary">
                  Akun Siswa
                </span>
                <span className="text-[10px] font-mono font-bold text-secondary">Gunakan</span>
              </div>
              <div className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                demo / demo123
              </div>
            </button>

            {/* Akun Demo Admin */}
            <button
              type="button"
              onClick={() => {
                setIdentifier("admin");
                setPassword("admin123");
              }}
              className="p-2.5 rounded-xl border-2 border-on-surface bg-white hover:bg-amber-100 text-left transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-headline font-black text-xs text-amber-900">
                  Akun Admin
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-800">Gunakan</span>
              </div>
              <div className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                admin / admin123
              </div>
            </button>
          </div>
        </div>
      )}

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
          disabled={loading}
          className="w-full py-3.5 px-6 bg-inverse-surface text-inverse-on-surface font-label font-black text-base rounded-full border-2 border-on-surface neo-shadow-button transition-transform duration-150 flex items-center justify-center gap-2 group hover:bg-[#1a0f17] active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Codevas</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 text-center pt-6 border-t-2 border-dashed border-outline-variant">
        <p className="font-body text-sm font-medium text-on-surface-variant">
          Belum punya akun?{" "}
          <Link
            href={showDemoBox ? "/demo/register" : "/register"}
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
