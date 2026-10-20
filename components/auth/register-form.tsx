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
  Zap,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Dices,
  Sparkles,
  Rocket,
  Gamepad2,
  Code2,
  Flame,
  Check,
} from "lucide-react";
import { SocialAuth } from "./social-auth";
import { useAuth } from "./auth-context";

interface RegisterFormProps {
  isDemoMode?: boolean;
}

const AGE_GROUPS = [
  {
    id: "6-7th",
    range: "6 - 7 Tahun",
    title: "Petualang Cilik",
    desc: "Pengenalan logika, teka-teki visual, dan animasi ceria tanpa coding rumit.",
    badge: "TK & SD Awal",
    icon: Rocket,
    color: "bg-[#FEF08A]",
    borderHighlight: "border-amber-400",
  },
  {
    id: "8-10th",
    range: "8 - 10 Tahun",
    title: "Penjelajah Kode",
    desc: "Game mini interaktif, logika blok, dan eksplorasi pemrograman visual seru.",
    badge: "SD Kelas 3 - 5",
    icon: Gamepad2,
    color: "bg-[#BAE6FD]",
    borderHighlight: "border-sky-400",
  },
  {
    id: "11-13th",
    range: "11 - 13 Tahun",
    title: "Perakit Web",
    desc: "Bikin website pertama dengan HTML interaktif, CSS styling, dan JavaScript dasar.",
    badge: "SMP / Pra-Remaja",
    icon: Code2,
    color: "bg-[#BBF7D0]",
    borderHighlight: "border-emerald-400",
  },
  {
    id: "13-17th",
    range: "13 - 17 Tahun",
    title: "Arsitek Digital",
    desc: "Tantangan kode nyata, logika algoritma mendalam, dan modern web application.",
    badge: "Remaja & SMA/SMK",
    icon: Flame,
    color: "bg-[#FECDD3]",
    borderHighlight: "border-rose-400",
  },
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ isDemoMode = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isDemo = isDemoMode || pathname?.startsWith("/demo");
  const { setUser } = useAuth();

  // Step state: 1 = data pendaftaran, 2 = pemilihan rentang usia
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Form fields
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Step 2 Selection
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("8-10th");
  const [savingAge, setSavingAge] = useState(false);

  // Feedback states
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

      // Otomatis terlogin di session cookie
      setUser(resJson.user);
      setSuccessMsg("Akun demo berhasil dibuat! Lanjut memilih kelompok usia.");
      setStep(2);
      setLoading(false);
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

  const handleSubmitStep1 = async (e: React.FormEvent) => {
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

      // Success Step 1 - Otomatis terlogin di cookie & context, geser ke langkah 2
      setUser(data.user);
      setSuccessMsg("Pendaftaran berhasil! Pilih rentang usia untuk mempersonalisasi belajarmu.");
      setStep(2);
      setLoading(false);
    } catch {
      setErrorMsg("Terjadi gangguan koneksi ke server. Pastikan internet aktif dan coba lagi.");
      setLoading(false);
    }
  };

  // Submit Step 2: Update age group profile and direct to dashboard
  const handleConfirmAgeGroup = async () => {
    setSavingAge(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age_group: selectedAgeGroup }),
      });

      const resData = await res.json();
      if (res.ok && resData.data) {
        setUser(resData.data);
      }
    } catch (e) {
      console.warn("Age group save warning:", e);
    }

    // Direct langsung ke dashboard
    router.push("/dashboard");
    router.refresh();
  };

  const handleSkipAgeGroup = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl border-3 sm:border-4 border-slate-900 shadow-[0_8px_0_#0f172a] sm:shadow-[0_10px_0_#0f172a] p-6 sm:p-9 md:p-10 relative">
      {/* Wizard Progress Indicator */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-slate-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs border-2 border-slate-900 transition-all ${
              step === 1
                ? "bg-[#EF4444] text-white shadow-[0_2px_0_#0f172a]"
                : "bg-[#10B981] text-white shadow-[0_2px_0_#0f172a]"
            }`}
          >
            {step === 2 ? "✓" : "1"}
          </div>
          <span
            className={`text-xs font-display font-black ${
              step === 1 ? "text-slate-900" : "text-slate-500"
            }`}
          >
            1. Akun
          </span>
        </div>

        <div className="flex-1 max-w-[120px] h-2 bg-slate-100 rounded-full border border-slate-900 overflow-hidden">
          <div
            className={`h-full bg-[#EF4444] transition-all duration-300 ${
              step === 2 ? "w-full" : "w-1/2"
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs border-2 border-slate-900 transition-all ${
              step === 2
                ? "bg-[#3B82F6] text-white shadow-[0_2px_0_#0f172a]"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            2
          </div>
          <span
            className={`text-xs font-display font-black ${
              step === 2 ? "text-slate-900" : "text-slate-500"
            }`}
          >
            2. Kelompok Usia
          </span>
        </div>
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

      {/* ============================================================== */}
      {/* STEP 1: FORM PENDAFTARAN                                       */}
      {/* ============================================================== */}
      {step === 1 && (
        <>
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
              Langkah 1: Lengkapi profil dasarmu &amp; dapatkan bonus XP instan!
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

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleSubmitStep1}>
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

            {/* Username */}
            <div>
              <label
                className="block font-display font-black text-xs uppercase tracking-wider text-slate-900 mb-1.5"
                htmlFor="username"
              >
                Username
              </label>
              <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
                <AtSign className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Contoh: budi_coder"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-slate-900 font-medium placeholder:text-slate-400 text-sm focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] font-mono text-slate-500">
                Gunakan 3-24 karakter (huruf, angka, atau underscore).
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                className="block font-display font-black text-xs uppercase tracking-wider text-slate-900 mb-1.5"
                htmlFor="email"
              >
                Alamat Email
              </label>
              <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
                <Mail className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="budi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-slate-900 font-medium placeholder:text-slate-400 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block font-display font-black text-xs uppercase tracking-wider text-slate-900 mb-1.5"
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="flex items-center bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 px-3.5 py-2.5 transition-all focus-within:bg-white focus-within:shadow-[0_2px_0_#0f172a]">
                <Lock className="w-5 h-5 text-slate-500 mr-2.5 shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-slate-900 font-medium placeholder:text-slate-400 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 ml-2 shrink-0"
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
                    <span>Lanjut ke Langkah 2</span>
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
        </>
      )}

      {/* ============================================================== */}
      {/* STEP 2: PEMILIHAN KELOMPOK USIA                                */}
      {/* ============================================================== */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#BAE6FD] text-slate-900 px-3.5 py-1 rounded-full border-2 border-slate-900 text-xs font-mono font-black shadow-[0_2px_0_#0f172a]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>Langkah 2 dari 2 • Personalisasi</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Berapa Usia Kamu?
            </h2>
            <p className="font-body text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
              Pilih kelompok usia untuk membantu kami menyesuaikan petualangan dan rekomendasi belajarmu!
            </p>
          </div>

          {/* Cards 4 Age Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {AGE_GROUPS.map((group) => {
              const isSelected = selectedAgeGroup === group.id;
              const IconComp = group.icon;

              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedAgeGroup(group.id)}
                  className={`relative p-4 rounded-2xl border-3 border-slate-900 cursor-pointer transition-all ${
                    isSelected
                      ? `${group.color} shadow-[0_4px_0_#0f172a] -translate-y-1 ring-2 ring-slate-900`
                      : "bg-white hover:bg-slate-50 shadow-[0_2px_0_#0f172a] hover:-translate-y-0.5"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-white text-slate-900 shadow-[0_2px_0_#0f172a]" : `${group.color} text-slate-900`
                      }`}
                    >
                      <IconComp className="w-5 h-5 stroke-[2.5]" />
                    </div>

                    <div className="min-w-0 pr-4">
                      <div className="font-display font-black text-base text-slate-900 leading-tight">
                        {group.range}
                      </div>
                      <div className="text-xs font-mono font-black text-slate-800 mt-0.5">
                        {group.title}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-md border border-slate-800 text-slate-800">
                        {group.badge}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                    {group.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Info note */}
          <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-300 text-[11px] font-medium text-amber-900 leading-relaxed">
            💡 <strong>Info:</strong> Saat ini semua modul kelas terbuka bebas untuk semua usia. Pilihan usia ini akan digunakan untuk fitur kurikulum bertingkat mendatang.
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleConfirmAgeGroup}
              disabled={savingAge}
              className="w-full py-3.5 px-6 bg-[#10B981] hover:bg-[#059669] text-white font-display font-black text-base sm:text-lg rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#047857] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#047857] disabled:opacity-60 cursor-pointer"
            >
              {savingAge ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan Pilihan...</span>
                </>
              ) : (
                <>
                  <span>Mulai Petualangan Belajar!</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkipAgeGroup}
              disabled={savingAge}
              className="w-full py-2.5 text-center text-xs font-mono font-black text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Lewati untuk sekarang (bisa diatur nanti di Profil) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
