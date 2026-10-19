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
      
      // Direct redirect ke Dashboard atau tujuan redirect aman tanpa open redirect
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const rawRedirect = params?.get("redirect") || "/dashboard";
      const isSafeRelativeUrl =
        rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("://");
      const redirectUrl = isSafeRelativeUrl ? rawRedirect : "/dashboard";
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Cek koneksi Anda lalu coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white border-3 sm:border-4 border-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_8px_0_#0f172a] sm:shadow-[0_10px_0_#0f172a] transition-all relative">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Masuk ke Akun
        </h1>
        <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          Lanjutkan petualangan koding frontend dan kumpulkan XP harianmu.
        </p>
      </div>

      {/* SSO Buttons */}
      <SocialAuth mode="login" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t-2 border-slate-900 w-full"></div>
        <span className="bg-white px-3 text-[11px] font-mono font-black tracking-wider text-slate-500 uppercase relative">
          ATAU DENGAN EMAIL / USERNAME
        </span>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border-2 border-red-500 rounded-2xl flex items-start gap-2.5 text-red-900 text-xs sm:text-sm font-bold shadow-[0_2px_0_#ef4444]">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Demo Credentials Helper - KHUSUS UNTUK LINK PORTO /demo */}
      {showDemoBox && (
        <div className="mb-6 p-4 sm:p-5 bg-[#FEF08A] border-3 border-slate-900 rounded-2xl shadow-[0_4px_0_#0f172a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <span>Akses Demo Cepat</span>
            </span>
            <span className="text-[10px] font-mono font-black bg-white text-slate-900 px-2.5 py-0.5 rounded-full border-2 border-slate-900 shadow-xs">
              DEMO
            </span>
          </div>
          <p className="text-[11px] text-slate-800 font-bold leading-tight">
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
              className="p-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-left transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer shadow-[0_2px_0_#0f172a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-xs text-[#0284C7]">
                  Akun Siswa
                </span>
                <span className="text-[10px] font-mono font-black text-slate-900 bg-[#BAE6FD] px-1.5 py-0.2 rounded border border-slate-900">Gunakan</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-600 mt-1">
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
              className="p-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-left transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer shadow-[0_2px_0_#0f172a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-xs text-[#DC2626]">
                  Akun Admin
                </span>
                <span className="text-[10px] font-mono font-black text-slate-900 bg-[#FECDD3] px-1.5 py-0.2 rounded border border-slate-900">Gunakan</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-600 mt-1">
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
            className="block text-xs sm:text-sm font-display font-black text-slate-900 mb-1.5 ml-1"
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
              className="w-full bg-slate-50 border-2 sm:border-3 border-slate-900 text-slate-900 placeholder:text-slate-400 font-medium text-sm rounded-2xl py-3 pl-4 pr-11 focus:outline-none focus:bg-white focus:shadow-[0_2px_0_#0f172a] transition-all"
            />
            <Mail className="w-5 h-5 text-slate-500 absolute right-4 pointer-events-none" />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
            <label
              className="text-xs sm:text-sm font-display font-black text-slate-900"
              htmlFor="password-field"
            >
              Kata Sandi
            </label>
            <a
              href="#"
              className="text-xs font-display font-bold text-[#EF4444] hover:text-[#DC2626] transition-colors hover:underline"
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
              className="w-full bg-slate-50 border-2 sm:border-3 border-slate-900 text-slate-900 placeholder:text-slate-400 font-mono text-sm rounded-2xl py-3 pl-4 pr-11 focus:outline-none focus:bg-white focus:shadow-[0_2px_0_#0f172a] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-slate-500 hover:text-slate-900 focus:outline-none transition-colors cursor-pointer"
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
              className="w-4 h-4 rounded-md border-2 border-slate-900 text-[#EF4444] focus:ring-0 transition accent-[#EF4444] cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Ingat saya
            </span>
          </label>
          <a
            href="#"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline"
          >
            Pusat Bantuan
          </a>
        </div>

        {/* Main CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 sm:py-4 px-6 bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-base rounded-2xl border-3 sm:border-4 border-slate-900 shadow-[0_4px_0_#991b1b] transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#991b1b] disabled:opacity-60 cursor-pointer"
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
      <div className="mt-8 text-center pt-6 border-t-2 border-dashed border-slate-300">
        <p className="font-body text-sm font-medium text-slate-600">
          Belum punya akun?{" "}
          <Link
            href={showDemoBox ? "/demo/register" : "/register"}
            className="font-display font-black text-[#EF4444] hover:text-[#DC2626] underline decoration-2 underline-offset-4 ml-1 inline-flex items-center gap-1 group"
          >
            <span>Daftar gratis sekarang</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-500 fill-amber-400" />
          </Link>
        </p>
      </div>
    </div>
  );
};
