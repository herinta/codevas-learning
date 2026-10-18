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
import { Navbar } from "@/components/layout/navbar";
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-headline font-bold text-sm text-on-surface">
          Memuat Profil Pengguna...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex-1 w-full">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant font-medium">Pengaturan Akun</span>
        </div>

        <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-9 shadow-[0_8px_0_#2e1a28]">
          {/* Top Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-outline-variant">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed border border-on-surface rounded-full text-xs font-headline font-black text-secondary mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-secondary" />
                <span>Profil Developer</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-on-surface">
                Edit Profil Saya
              </h1>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
                Kustomisasi nama tampilan dan avatar unik untuk reputasi di leaderboard.
              </p>
            </div>

            {/* Gamification Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-300 border-2 border-on-surface rounded-full shadow-sm">
                <span className="text-xs font-mono font-black text-on-surface">
                  Lv.{user?.level || 1}
                </span>
                <span className="text-xs font-headline font-bold text-on-surface">
                  {user?.rank_title || "Siswa Pemula"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff3e0] border-2 border-on-surface rounded-full shadow-sm">
                <Flame className="w-4 h-4 text-[#e65100] fill-[#e65100]" />
                <span className="text-xs font-headline font-black text-on-surface">
                  {user ? `${(user as any).streak_days || 1} Hari` : "1 Hari"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-sm">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="text-xs font-headline font-black text-secondary">
                  {user?.xp_points || 50} XP
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-2xl flex items-center gap-2.5 text-red-900 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-600 rounded-2xl flex items-center gap-2.5 text-emerald-950 text-xs sm:text-sm font-bold animate-pulse">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="mt-8 space-y-7">
            {/* Avatar Section */}
            <div>
              <label className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface mb-3">
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
                  <div className="w-24 h-24 rounded-3xl border-4 border-on-surface overflow-hidden bg-primary-fixed flex items-center justify-center shadow-brutal relative">
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
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white border-2 border-on-surface flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
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
                      className="px-4 py-2 bg-primary hover:bg-[#ec4899] text-white rounded-xl font-headline font-black text-xs border-2 border-on-surface shadow-[0_3px_0_#2e1a28] inline-flex items-center gap-2 hover:scale-102 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      <span>{uploadingImage ? "Mengunggah..." : "Unggah Foto dari Perangkat"}</span>
                    </button>
                    <p className="text-[11px] text-on-surface-variant font-medium mt-1">
                      Pilih foto JPG, PNG, atau WebP dari komputer / HP kamu (Maks. 5MB).
                    </p>
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="pt-2 border-t border-on-surface/10">
                    <span className="text-[11px] font-bold text-on-surface-variant block mb-1.5">
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
                              ? "border-primary ring-3 ring-primary scale-110 shadow-sm"
                              : "border-on-surface hover:scale-105 opacity-80"
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
                className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface mb-1.5"
                htmlFor="full-name"
              >
                Nama Lengkap
              </label>
              <div className="flex items-center bg-surface-container-low rounded-xl border-2 border-on-surface px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary">
                <User className="w-5 h-5 text-on-surface-variant mr-2.5 shrink-0" />
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-on-surface font-body font-bold text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Read-Only Account Info (Username & Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Username (Permanen)
                </label>
                <div className="flex items-center bg-surface-container-high rounded-xl border-2 border-outline-variant px-3.5 py-2.5 text-on-surface-variant font-mono font-bold text-sm">
                  <AtSign className="w-4 h-4 mr-2 shrink-0" />
                  <span>@{user?.username}</span>
                </div>
              </div>

              <div>
                <label className="block font-label font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Email Terdaftar
                </label>
                <div className="flex items-center bg-surface-container-high rounded-xl border-2 border-outline-variant px-3.5 py-2.5 text-on-surface-variant font-mono text-sm truncate">
                  <Mail className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t-2 border-outline-variant flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-3.5 bg-primary hover:bg-[#ec4899] text-white font-headline font-black text-sm rounded-2xl border-3 border-on-surface shadow-brutal flex items-center gap-2 cursor-pointer active:translate-y-0.5 transition-all disabled:opacity-60"
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
          <div className="mt-8 pt-8 border-t-4 border-on-surface space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-300 text-on-surface border-2 border-on-surface flex items-center justify-center font-mono font-black text-xs">
                Lv
              </span>
              <div>
                <h2 className="font-display font-black text-xl text-on-surface">
                  Reputasi &amp; Tingkat EXP
                </h2>
                <p className="font-body text-xs text-on-surface-variant font-medium">
                  Selesaikan quest coding dan tantangan untuk meningkatkan level dan membuka reputasi developer.
                </p>
              </div>
            </div>

            {/* Level Progress Banner */}
            <div className="p-5 bg-surface-container-low rounded-2xl border-2 border-on-surface space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{user?.rank_badge || "🌱"}</span>
                  <div>
                    <span className="font-headline font-black text-base text-on-surface block">
                      {user?.rank_title || "Siswa Pemula"}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant font-bold">
                      Level {user?.level || 1} • {user?.xp_points || 50} Total XP
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-secondary">
                    {user?.xp_remaining && user.xp_remaining > 0
                      ? `${user.xp_remaining} XP lagi menuju Level ${(user?.level || 1) + 1}`
                      : "Peringkat Tertinggi"}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-surface-container-high rounded-full h-4 border-2 border-on-surface overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 via-primary to-secondary h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, user?.level_progress_percent ?? 50)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold text-on-surface-variant">
                <span>{user?.current_level_xp ?? 50} XP di level ini</span>
                <span>Progres: {user?.level_progress_percent ?? 50}%</span>
              </div>
            </div>

            {/* XP Transactions History List */}
            <div className="space-y-3">
              <h3 className="font-display font-black text-base text-on-surface flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Riwayat Perolehan EXP</span>
              </h3>

              {xpHistory.length === 0 ? (
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant text-center text-xs text-on-surface-variant font-medium">
                  Belum ada catatan transaksi EXP. Selesaikan quest tantangan pertamamu untuk mulai mengumpulkan EXP!
                </div>
              ) : (
                <div className="space-y-2">
                  {xpHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-surface-container-low rounded-xl border border-on-surface flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 bg-secondary-fixed text-secondary font-mono font-black rounded-lg border border-on-surface text-[11px]">
                          +{item.amount} XP
                        </span>
                        <div>
                          <p className="font-headline font-bold text-on-surface leading-snug">
                            {item.description || item.source}
                          </p>
                          <span className="text-[10px] text-on-surface-variant font-mono">
                            {new Date(item.created_at).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant">
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
