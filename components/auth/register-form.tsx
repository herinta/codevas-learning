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
    <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl border-4 border-on-surface neo-card p-6 sm:p-9 md:p-10 relative neo-shadow">
      {/* Header Section */}
      <div className="text-center space-y-2.5 mb-7">
        <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-container px-3.5 py-1 rounded-full border-2 border-on-surface text-xs font-headline font-extrabold shadow-brutal-sm">
          <Zap className="w-3.5 h-3.5 text-tertiary fill-tertiary" />
          <span>Bonus +50 XP Saat Mendaftar!</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
          Buat Akun Baru
        </h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant font-medium max-w-md mx-auto">
          Gabung komunitas developer kreatif &amp; taklukkan tantangan coding berhadiah XP!
        </p>
      </div>

      {/* Demo Tester Quick Access Card */}
      {isDemo && (
        <div className="mb-6 p-4 rounded-2xl border-2 border-on-surface bg-secondary-fixed/30 shadow-[0_4px_0_#2e1a28]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-headline font-black text-xs text-on-surface">
              <Sparkles className="w-4 h-4 text-secondary fill-secondary" />
              <span>Tester Portofolio Demo</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-secondary text-white px-2 py-0.5 rounded-full">
              Otomatis
            </span>
          </div>
          <p className="text-xs text-on-surface-variant font-medium mb-3">
            Tidak perlu repot mengetik data. Pilih opsi di bawah untuk langsung mencoba akun baru:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillRandom}
              className="p-2.5 rounded-xl border-2 border-on-surface bg-white hover:bg-slate-50 text-left transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs flex items-center gap-2"
            >
              <Dices className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <div className="font-headline font-black text-xs text-on-surface">Isi Data Acak</div>
                <div className="text-[10px] text-on-surface-variant">Generate nama &amp; email acak</div>
              </div>
            </button>
            <button
              type="button"
              onClick={handleAutoRegister}
              disabled={loading}
              className="p-2.5 rounded-xl border-2 border-on-surface bg-secondary text-white hover:bg-secondary/90 text-left transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-60"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <div>
                <div className="font-headline font-black text-xs text-white">Daftar Cepat 1-Klik</div>
                <div className="text-[10px] text-white/80">Otomatis buat &amp; masuk</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* SSO Quick Actions */}
      <SocialAuth mode="register" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="w-full border-t-2 border-on-surface"></div>
        <span className="absolute bg-surface-container-lowest px-3 font-headline font-black text-xs tracking-wider text-on-surface-variant uppercase">
          ATAU DAFTAR MANUAL
        </span>
      </div>

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-100 border-2 border-red-500 rounded-2xl flex items-start gap-2.5 text-red-900 text-xs sm:text-sm font-semibold animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-5 p-3.5 bg-emerald-100 border-2 border-emerald-600 rounded-2xl flex items-start gap-2.5 text-emerald-950 text-xs sm:text-sm font-bold animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Fullname */}
        <div>
          <label
            className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface mb-1.5"
            htmlFor="fullname"
          >
            Nama Lengkap (Opsional)
          </label>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <User className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="fullname"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-on-surface font-body font-medium placeholder:text-outline text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Username / Handle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface"
              htmlFor="username"
            >
              Username / Handle <span className="text-primary">*</span>
            </label>
            {username.length >= 3 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-600 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>Format Valid</span>
              </span>
            )}
          </div>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <AtSign className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="username"
              type="text"
              required
              placeholder="budicodes"
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
            Email Pengguna <span className="text-primary">*</span>
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
              Kata Sandi <span className="text-primary">*</span>
            </label>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>{strength >= 3 ? "Kuat & Aman" : strength >= 2 ? "Sedang" : "Minimal 6 Karakter"}</span>
            </span>
          </div>
          <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
            <Lock className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimal 6 karakter unik"
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

          {/* Password Strength Candy Bars */}
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
            disabled={loading}
            className="w-full py-4 px-6 bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-lg rounded-2xl border-4 border-on-surface neo-button shadow-brutal flex items-center justify-center gap-2 group transition-all active:translate-y-1 disabled:opacity-60 cursor-pointer"
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
      <div className="mt-7 text-center pt-5 border-t-2 border-dashed border-outline-variant">
        <p className="font-body text-sm font-semibold text-on-surface">
          Sudah punya akun?{" "}
          <Link
            href={isDemo ? "/demo/login" : "/login"}
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
