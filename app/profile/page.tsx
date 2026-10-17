"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync initial values from auth user
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    } else if (user) {
      setFullName((user as any).full_name || user.username || "");
      setAvatarUrl(
        (user as any).avatar_url ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`
      );
    }
  }, [user, authLoading, router]);

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
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fff3e0] border-2 border-on-surface rounded-full shadow-sm">
                <Flame className="w-4 h-4 text-[#e65100] fill-[#e65100]" />
                <span className="text-xs font-headline font-black text-on-surface">
                  {user ? `${(user as any).streak_days || 1} Hari Streak` : "1 Hari"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary-fixed border-2 border-on-surface rounded-full shadow-sm">
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

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Preview */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-3xl border-4 border-on-surface overflow-hidden bg-primary-fixed flex items-center justify-center shadow-brutal">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=user`}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-on-surface flex items-center justify-center text-on-surface shadow-sm">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                {/* Preset Avatar Selection */}
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-on-surface-variant block">
                    Pilih Preset Avatar Karakter:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAvatarUrl(preset)}
                        className={`w-11 h-11 rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${
                          avatarUrl === preset
                            ? "border-primary ring-3 ring-primary scale-110 shadow-sm"
                            : "border-on-surface hover:scale-105 opacity-80"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preset} alt="preset" className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-medium pt-1">
                    Atau tempelkan link URL foto profil kamu sendiri di bawah.
                  </p>
                </div>
              </div>

              {/* Custom Avatar URL Input */}
              <div className="mt-4">
                <input
                  type="url"
                  placeholder="https://example.com/foto-kamu.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-surface-container-low border-2 border-on-surface text-on-surface placeholder:text-outline font-mono text-xs rounded-xl py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
