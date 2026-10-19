"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Dices,
  Sparkles,
} from "lucide-react";
import { SocialAuth } from "./social-auth";
import { useAuth } from "./auth-context";

interface RegisterFormProps {
  isDemoMode?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ isDemoMode = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isDemo = isDemoMode || pathname?.startsWith("/demo");
  const { setUser } = useAuth();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const generateRandomData = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const names = ["Andi", "Budi", "Citra", "Dian", "Eko", "Fajar", "Gita", "Hadi", "Indah", "Joko"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    return {
      fullname: `${randomName} Tester ${rand}`,
      username: `tester_${rand}`,
      email: `tester${rand}@codevas.dev`,
      password: "Password123!",
    };
  };

  const handleFillRandom = () => {
    const data = generateRandomData();
    setFullname(data.fullname);
    setUsername(data.username);
    setEmail(data.email);
    setPassword(data.password);
    setAgreeTerms(true);
    setErrorMsg(null);
  };

  const handleAutoRegister = async () => {
    const data = generateRandomData();
    setFullname(data.fullname);
    setUsername(data.username);
    setEmail(data.email);
    setPassword(data.password);
    setAgreeTerms(true);
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();
      if (!res.ok) {
        setErrorMsg(resJson.error || "Gagal membuat akun otomatis. Coba lagi.");
        setLoading(false);
        return;
      }

      setUser(resJson.user);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Terjadi gangguan koneksi ke server. Pastikan internet aktif dan coba lagi.");
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!agreeTerms) {
      setErrorMsg("Harap setujui Ketentuan Layanan & Kebijakan Privasi Codevas.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal membuat akun. Silakan periksa kembali data Anda.");
        setLoading(false);
        return;
      }

      // Success - Direct redirect to Dashboard
      setUser(data.user);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Terjadi gangguan koneksi ke server. Pastikan internet aktif dan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl border-3 sm:border-4 border-slate-900 shadow-[0_8px_0_#0f172a] sm:shadow-[0_10px_0_#0f172a] p-6 sm:p-9 md:p-10 relative">
      {/* Header Section */}
      <div className="text-center space-y-2.5 mb-7">
        <div className="inline-flex items-center gap-1.5 bg-[#FEF08A] text-slate-900 px-3.5 py-1 rounded-full border-2 border-slate-900 text-xs font-mono font-black shadow-[0_2px_0_#0f172a]">
          <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>Bonus +50 XP Saat Mendaftar!</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Buat Akun Baru
        </h1>
        <p className="font-body text-sm sm:text-base text-slate-600 font-medium max-w-md mx-auto">
          Gabung komunitas developer kreatif &amp; taklukkan tantangan coding berhadiah XP!
        </p>
      </div>

      {/* Demo Tester Quick Access Card */}
      {isDemo && (
        <div className="mb-6 p-4 rounded-2xl border-3 border-slate-900 bg-[#FEF08A] shadow-[0_4px_0_#0f172a]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-display font-black text-xs text-slate-900">
              <Sparkles className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Tester Portofolio Demo</span>
            </div>
            <span className="text-[10px] font-mono font-black bg-white text-slate-900 px-2 py-0.5 rounded-full border-2 border-slate-900">
              Otomatis
            </span>
          </div>
          <p className="text-xs text-slate-800 font-bold mb-3">
            Tidak perlu repot mengetik data. Pilih opsi di bawah untuk langsung mencoba akun baru:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleFillRandom}
              className="p-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-left transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer shadow-[0_2px_0_#0f172a] flex items-center gap-2"
            >
              <Dices className="w-5 h-5 text-slate-900 shrink-0" />
              <div>
                <div className="font-display font-black text-xs text-slate-900">Isi Data Acak</div>
                <div className="text-[10px] font-mono font-bold text-slate-600">Generate nama &amp; email acak</div>
              </div>
            </button>
            <button
              type="button"
              onClick={handleAutoRegister}
              disabled={loading}
              className="p-3 rounded-xl border-2 border-slate-900 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-left transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer shadow-[0_2px_0_#1e3a8a] flex items-center gap-2 disabled:opacity-60"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300 shrink-0" />
              <div>
                <div className="font-display font-black text-xs text-white">Daftar Cepat 1-Klik</div>
                <div className="text-[10px] font-mono font-bold text-sky-100">Otomatis buat &amp; masuk</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* SSO Quick Actions */}
      <SocialAuth mode="register" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="w-full border-t-2 border-slate-900"></div>
        <span className="absolute bg-white px-3 font-mono font-black text-xs tracking-wider text-slate-500 uppercase">
          ATAU DAFTAR MANUAL
        </span>
      </div>

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border-2 border-red-500 rounded-2xl flex items-start gap-2.5 text-red-900 text-xs sm:text-sm font-bold shadow-[0_2px_0_#ef4444]">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-5 p-3.5 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex items-start gap-2.5 text-emerald-950 text-xs sm:text-sm font-bold shadow-[0_2px_0_#10b981]">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Fullname */}
        <div>
          <label
            className="block font-display font-black text-xs uppercase tracking-wider text-slate-900 mb-1.5"
            htmlFor="fullname"
          >
            Nama Lengkap (Opsional)
          </label>
          <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
            <User className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
            <input
              id="fullname"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-slate-900 font-medium placeholder:text-slate-400 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Username / Handle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="block font-display font-black text-xs uppercase tracking-wider text-slate-900"
              htmlFor="username"
            >
              Username / Handle <span className="text-[#EF4444]">*</span>
            </label>
            {username.length >= 3 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-[#15803D] bg-[#DCFCE7] border border-slate-900 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                <span>Format Valid</span>
              </span>
            )}
          </div>
          <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
            <AtSign className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
            <input
              id="username"
              type="text"
              required
              placeholder="budicodes"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-slate-900 font-mono font-bold placeholder:text-slate-400 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            className="block font-display font-black text-xs uppercase tracking-wider text-slate-900 mb-1.5"
            htmlFor="email"
          >
            Email Pengguna <span className="text-[#EF4444]">*</span>
          </label>
          <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
            <Mail className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
            <input
              id="email"
              type="email"
              required
              placeholder="budi@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-slate-900 font-medium placeholder:text-slate-400 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="block font-display font-black text-xs uppercase tracking-wider text-slate-900"
              htmlFor="password"
            >
              Kata Sandi <span className="text-[#EF4444]">*</span>
            </label>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
              <span>{strength >= 3 ? "Kuat & Aman" : strength >= 2 ? "Sedang" : "Minimal 6 Karakter"}</span>
            </span>
          </div>
          <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
            <Lock className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimal 6 karakter unik"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-slate-900 font-mono font-medium placeholder:text-slate-400 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-slate-900 ml-2 focus:outline-none cursor-pointer"
              title="Lihat password"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Candy Bars */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            <div
              className={`h-2.5 rounded-full border border-slate-900 transition-colors ${
                strength >= 1 ? "bg-[#EF4444]" : "bg-slate-200"
              }`}
            ></div>
            <div
              className={`h-2.5 rounded-full border border-slate-900 transition-colors ${
                strength >= 2 ? "bg-[#FACC15]" : "bg-slate-200"
              }`}
            ></div>
            <div
              className={`h-2.5 rounded-full border border-slate-900 transition-colors ${
                strength >= 3 ? "bg-[#3B82F6]" : "bg-slate-200"
              }`}
            ></div>
            <div
              className={`h-2.5 rounded-full border border-slate-900 transition-colors ${
                strength >= 4 ? "bg-[#10B981]" : "bg-slate-200"
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
              className="w-5 h-5 mt-0.5 rounded-lg border-2 border-slate-900 text-[#EF4444] focus:ring-0 cursor-pointer accent-[#EF4444]"
            />
            <span className="font-body text-xs sm:text-sm text-slate-700 font-medium leading-tight">
              Saya menyetujui{" "}
              <a
                href="#"
                className="font-bold underline decoration-[#EF4444] decoration-2 underline-offset-2 hover:text-[#EF4444]"
              >
                Ketentuan Layanan
              </a>{" "}
              &amp;{" "}
              <a
                href="#"
                className="font-bold underline decoration-[#3B82F6] decoration-2 underline-offset-2 hover:text-[#3B82F6]"
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
            disabled={loading}
            className="w-full py-4 px-6 bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-lg rounded-2xl border-3 sm:border-4 border-slate-900 shadow-[0_4px_0_#991b1b] flex items-center justify-center gap-2 group transition-all hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#991b1b] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <>
                <span>Buat Akun Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-7 text-center pt-5 border-t-2 border-dashed border-slate-300">
        <p className="font-body text-sm font-medium text-slate-600">
          Sudah punya akun?{" "}
          <Link
            href={isDemo ? "/demo/login" : "/login"}
            className="font-display font-black text-[#EF4444] hover:text-[#DC2626] underline decoration-2 underline-offset-4 ml-1 inline-flex items-center gap-1 group"
          >
            <span>Masuk di sini</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </div>
    </div>
  );
};
