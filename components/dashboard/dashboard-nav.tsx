"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Flame,
  Star,
  Bell,
  Code2,
  Menu,
  X,
  Compass,
  Trophy,
  LayoutGrid,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export interface DashboardNavProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly userXp?: number;
  readonly streakDays?: number;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  searchQuery,
  onSearchChange,
  userXp: propUserXp,
  streakDays = 12,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isWorkspace = pathname === "/dashboard";
  const isClasses = pathname === "/dashboard/classes" || pathname?.startsWith("/dashboard/classes");

  // Gunakan XP real dari user jika sedang login, atau prop fallback
  const displayXp = user ? user.xp_points : (propUserXp ?? 50);
  const initials = user ? user.username.slice(0, 2).toUpperCase() : "G";

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-3 border-slate-900 shadow-[0_4px_0_#0f172a] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Brand & Global Search */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="font-display font-black text-2xl tracking-tight text-[#1E3A8A] flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#EF4444] flex items-center justify-center text-white border-2 border-slate-900 shadow-[0_3px_0_#991b1b] transition-transform duration-200 group-hover:scale-105">
              <span className="text-xl">🚀</span>
            </div>
            <span className="hidden sm:inline">Codevas</span>
          </Link>

          {/* Quick Search Input */}
          <div className="relative hidden md:block w-56 lg:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kelas, level, sintaks..."
              className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 border-2 border-slate-900 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:shadow-[0_2px_0_#0f172a] transition-all"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`px-3.5 py-1.5 rounded-full text-xs font-display font-black flex items-center gap-1.5 transition-all ${
              isWorkspace
                ? "bg-[#FEF08A] text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                : "text-slate-700 hover:text-slate-900 hover:bg-[#FEF08A]/50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Workspace</span>
          </Link>
          <Link
            href="/dashboard/classes"
            className={`px-3.5 py-1.5 rounded-full text-xs font-display font-black flex items-center gap-1.5 transition-all ${
              isClasses
                ? "bg-[#BAE6FD] text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                : "text-slate-700 hover:text-slate-900 hover:bg-[#BAE6FD]/50"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Silabus</span>
          </Link>
          <Link
            href="/dashboard#leaderboard"
            className="px-3.5 py-1.5 rounded-full text-xs font-display font-bold text-slate-700 hover:text-slate-900 hover:bg-[#FECDD3]/50 transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </Link>
        </nav>

        {/* Gamification Pills & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Streak Counter Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FEF08A] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0"
            title={`${streakDays} Hari Streak Aktif`}
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D97706] fill-[#F59E0B] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-display font-black text-slate-900">
              {streakDays} <span className="hidden sm:inline">Hari</span>
            </span>
          </div>

          {/* Level Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#DCFCE7] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0"
            title={`Level ${user?.level || 1} — ${user?.rank_title || 'Siswa Pemula'}`}
          >
            <span className="text-[11px] sm:text-xs font-mono font-black text-[#15803D]">
              Lv.{user?.level || 1}
            </span>
          </div>

          {/* XP Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E0F2FE] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0">
            <Star className="w-3.5 h-3.5 text-[#0284C7] fill-[#38BDF8]" />
            <span className="text-xs font-mono font-black text-[#0369A1]">
              {displayXp.toLocaleString()} XP
            </span>
          </div>

          {/* Quick Start Coding CTA */}
          <Link
            href="/classes/css-flexbox"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs rounded-full border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:scale-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Coding</span>
          </Link>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-9 h-9 rounded-full border-2 border-slate-900 overflow-hidden bg-[#EF4444] shadow-[0_2px_0_#991b1b] flex items-center justify-center text-xs font-black text-white focus:outline-none cursor-pointer hover:scale-105 transition-transform"
              title={user ? `@${user.username}` : "Akun Pengguna"}
            >
              {initials}
            </button>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full pointer-events-none"></span>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border-3 border-slate-900 rounded-2xl p-3 shadow-[0_6px_0_#0f172a] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 border-b-2 border-slate-100 mb-2">
                      <p className="font-display font-black text-sm text-slate-900 truncate">
                        @{user.username}
                      </p>
                      <p className="font-medium text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="font-mono text-[10px] font-black text-slate-900 bg-[#FEF08A] px-2 py-0.5 rounded-full border border-slate-900">
                          Lv.{user.level || 1}
                        </span>
                        <span className="font-mono text-[10px] font-black text-[#0369A1] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-slate-900">
                          {user.xp_points} XP
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-600 mt-1">
                        {user.rank_title || "Siswa Pemula"}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#FEF08A] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#EF4444]" />
                      <span>Edit Profil &amp; Foto</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5 p-1">
                    <Link
                      href="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Masuk ke Akun</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-white bg-[#EF4444] border-2 border-slate-900 shadow-[0_2px_0_#991b1b]"
                    >
                      <span>Daftar Akun Baru</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-100 cursor-pointer shadow-[0_2px_0_#0f172a]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-slate-900 bg-white px-4 py-3 flex flex-col gap-3 shadow-[0_4px_0_#0f172a]">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kelas, topik, sintaks..."
              className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 border-2 border-slate-900 rounded-full text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-2 pt-1 font-display font-black text-xs">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl transition-colors border-2 border-slate-900 ${
                isWorkspace ? "bg-[#FEF08A] text-slate-900 shadow-[0_2px_0_#0f172a]" : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Workspace Dashboard
            </Link>
            <Link
              href="/dashboard/classes"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl transition-colors border-2 border-slate-900 ${
                isClasses ? "bg-[#BAE6FD] text-slate-900 shadow-[0_2px_0_#0f172a]" : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Silabus Kelas
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white border-2 border-slate-900 text-slate-700 hover:bg-slate-50 shadow-[0_2px_0_#0f172a]"
            >
              Halaman Utama
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
