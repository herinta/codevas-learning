"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Camera,
  Save,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Shield,
  Calendar,
  AtSign,
  Mail,
  UploadCloud,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { useAuth } from "@/components/auth/auth-context";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=NeoCoder",
  "https://api.dicebear.com/7.x/bottts/svg?seed=PixelNinja",
  "https://api.dicebear.com/7.x/bottts/svg?seed=ByteHero",
  "https://api.dicebear.com/7.x/bottts/svg?seed=GlitchWizard",
  "https://api.dicebear.com/7.x/bottts/svg?seed=CyberCat",
  "https://api.dicebear.com/7.x/bottts/svg?seed=CodevasStar",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser, loading: authLoading } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [xpHistory, setXpHistory] = useState<Array<{
    id: string;
    amount: number;
    source: string;
    description: string;
    created_at: string;
  }>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Harap pilih file gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran foto maksimal 5MB.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengunggah foto profil.");
      }

      setAvatarUrl(data.avatarUrl);
      setSuccessMsg("Foto profil berhasil diunggah!");
      await refreshUser();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("codevas:progress-updated"));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto profil.";
      setErrorMsg(msg);
      setAvatarUrl(user?.avatar_url || "");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Sync initial values from auth user & fetch detailed profile + XP history
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.replace("/login?redirect=/profile");
    } else if (user) {
      setFullName((user as any).full_name || user.username || "");
      setAvatarUrl(
        (user as any).avatar_url ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`
      );

      // Fetch latest gamification profile & history
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            if (Array.isArray(json.data.xp_history)) {
              setXpHistory(json.data.xp_history);
            }
          }
        })
        .catch(() => {});
    }
  }, [user, authLoading]);

  // Handle browser Back/Forward Cache (bfcache)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal memperbarui profil.");
        setSaving(false);
        return;
      }

      setSuccessMsg("Profil berhasil diperbarui! 🎉");
      await refreshUser();
    } catch {
      setErrorMsg("Terjadi gangguan jaringan saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#EF4444] animate-spin" />
        <p className="font-display font-black text-sm text-slate-900">
          Memuat Profil Pengguna...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col">
      <DashboardNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-28 md:pb-16 flex-1 w-full">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-display font-black text-[#EF4444] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-bold">Pengaturan Akun</span>
        </div>

        <div className="bg-white border-3 sm:border-4 border-slate-900 rounded-3xl p-6 sm:p-9 shadow-[0_8px_0_#0f172a]">
          {/* Top Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF08A] border-2 border-slate-900 rounded-full text-xs font-display font-black text-slate-900 mb-2 shadow-[0_2px_0_#0f172a]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Profil Developer</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                Edit Profil Saya
              </h1>
              <p className="font-body text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Kustomisasi nama tampilan dan avatar unik untuk reputasi di leaderboard.
              </p>
            </div>

            {/* Gamification Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF08A] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a]">
                <span className="text-xs font-mono font-black text-slate-900">
                  Lv.{user?.level || 1}
                </span>
                <span className="text-xs font-display font-bold text-slate-900">
                  {user?.rank_title || "Siswa Pemula"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a]">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
                <span className="text-xs font-display font-black text-slate-900">
                  {user ? `${(user as any).streak_days || 1} Hari` : "1 Hari"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c8eaff] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a]">
                <Star className="w-4 h-4 text-sky-600 fill-sky-500" />
                <span className="text-xs font-display font-black text-slate-900">
                  {user?.xp_points || 50} XP
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-2xl flex items-center gap-2.5 text-red-900 text-xs sm:text-sm font-bold shadow-[0_2px_0_#991b1b]">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-600 rounded-2xl flex items-center gap-2.5 text-emerald-950 text-xs sm:text-sm font-bold shadow-[0_2px_0_#065f46]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="mt-8 space-y-7">
            {/* Avatar Section */}
            <div>
              <label className="block font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
                Foto Profil / Avatar
              </label>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Preview & Direct Click Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group shrink-0 cursor-pointer"
                  title="Klik untuk memilih foto dari perangkatmu"
                >
                  <div className="w-24 h-24 rounded-3xl border-3 sm:border-4 border-slate-900 overflow-hidden bg-slate-100 flex items-center justify-center shadow-[0_4px_0_#0f172a] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=user`}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                        <span className="text-[10px] font-bold mt-1">Mengunggah...</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                      Ganti Foto
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#EF4444] text-white border-2 border-slate-900 flex items-center justify-center shadow-[0_2px_0_#0f172a] group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                {/* Upload action and preset avatar choices */}
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] inline-flex items-center gap-2 hover:scale-102 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      <span>{uploadingImage ? "Mengunggah..." : "Unggah Foto dari Perangkat"}</span>
                    </button>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      Pilih foto JPG, PNG, atau WebP dari komputer / HP kamu (Maks. 5MB).
                    </p>
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      Atau pilih karakter preset:
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {PRESET_AVATARS.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setAvatarUrl(preset)}
                          className={`w-10 h-10 rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${
                            avatarUrl === preset
                              ? "border-slate-900 ring-3 ring-[#EF4444] scale-110 shadow-[0_2px_0_#0f172a]"
                              : "border-slate-300 hover:border-slate-900 hover:scale-105 opacity-80"
                          }`}
                          title="Gunakan avatar karakter ini"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preset} alt="preset" className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                className="block font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5"
                htmlFor="full-name"
              >
                Nama Lengkap
              </label>
              <div className="flex items-center bg-slate-50 rounded-2xl border-2 border-slate-900 px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-[#EF4444] shadow-[0_2px_0_#0f172a]">
                <User className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-slate-900 font-body font-bold text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Read-Only Account Info (Username & Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wider text-slate-600 mb-1.5">
                  Username (Permanen)
                </label>
                <div className="flex items-center bg-slate-100 rounded-2xl border-2 border-slate-300 px-4 py-3 text-slate-700 font-mono font-bold text-sm">
                  <AtSign className="w-4 h-4 mr-2 shrink-0" />
                  <span>@{user?.username}</span>
                </div>
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Terdaftar
                </label>
                <div className="flex items-center bg-slate-100 rounded-2xl border-2 border-slate-300 px-4 py-3 text-slate-700 font-mono text-sm truncate">
                  <Mail className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t-2 border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-3.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#991b1b] flex items-center gap-2 cursor-pointer active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card Reputasi & EXP Gamifikasi */}
          <div className="mt-8 pt-8 border-t-3 border-slate-900 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FEF08A] text-slate-900 border-2 border-slate-900 flex items-center justify-center font-mono font-black text-xs shadow-[0_2px_0_#0f172a]">
                Lv
              </span>
              <div>
                <h2 className="font-display font-black text-xl text-slate-900">
                  Reputasi &amp; Tingkat EXP
                </h2>
                <p className="font-body text-xs text-slate-600 font-medium">
                  Selesaikan quest coding dan tantangan untuk meningkatkan level dan membuka reputasi developer.
                </p>
              </div>
            </div>

            {/* Level Progress Banner */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 sm:border-3 border-slate-900 shadow-[0_4px_0_#0f172a] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{user?.rank_badge || "🌱"}</span>
                  <div>
                    <span className="font-display font-black text-base text-slate-900 block">
                      {user?.rank_title || "Siswa Pemula"}
                    </span>
                    <span className="font-mono text-xs text-slate-600 font-bold">
                      Level {user?.level || 1} • {user?.xp_points || 50} Total XP
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-sky-700">
                    {user?.xp_remaining && user.xp_remaining > 0
                      ? `${user.xp_remaining} XP lagi menuju Level ${(user?.level || 1) + 1}`
                      : "Peringkat Tertinggi"}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-200 rounded-full h-4 border-2 border-slate-900 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 via-[#EF4444] to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, user?.level_progress_percent ?? 50)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                <span>{user?.current_level_xp ?? 50} XP di level ini</span>
                <span>Progres: {user?.level_progress_percent ?? 50}%</span>
              </div>
            </div>

            {/* XP Transactions History List */}
            <div className="space-y-3">
              <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Riwayat Perolehan EXP</span>
              </h3>

              {xpHistory.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 text-center text-xs text-slate-600 font-medium">
                  Belum ada catatan transaksi EXP. Selesaikan quest tantangan pertamamu untuk mulai mengumpulkan EXP!
                </div>
              ) : (
                <div className="space-y-2">
                  {xpHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 bg-[#FEF08A] text-slate-900 font-mono font-black rounded-lg border border-slate-900 text-[11px]">
                          +{item.amount} XP
                        </span>
                        <div>
                          <p className="font-display font-bold text-slate-900 leading-snug">
                            {item.description || item.source}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(item.created_at).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {item.source}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
