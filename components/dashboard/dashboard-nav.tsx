"use client";

import React, { useState } from "react";
import Link from "next/link";
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

  // Gunakan XP real dari user jika sedang login, atau prop fallback
  const displayXp = user ? user.xp_points : (propUserXp ?? 50);
  const initials = user ? user.username.slice(0, 2).toUpperCase() : "G";

  return (
    <header className="w-full bg-surface-container-lowest border-b-2 border-on-surface shadow-[0_4px_16px_rgba(224,64,160,0.12)] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Brand & Global Search */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="font-display font-black text-2xl tracking-tight text-primary flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xl candy-card-shadow border-2 border-on-surface transform group-hover:rotate-12 transition-transform">
              🍬
            </span>
            <span className="hidden sm:inline">Codevas</span>
          </Link>

          {/* Quick Search Input */}
          <div className="relative hidden md:block w-56 lg:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kelas, level, sintaks..."
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-surface-container-low border-2 border-outline-variant rounded-full text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-primary font-bold border-b-2 border-primary pb-0.5 text-sm flex items-center gap-1.5"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Workspace</span>
          </Link>
          <Link
            href="/classes"
            className="text-on-surface-variant hover:text-on-surface font-bold text-sm transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Silabus</span>
          </Link>
          <a
            href="#leaderboard"
            className="text-on-surface-variant hover:text-on-surface font-bold text-sm transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </a>
        </nav>

        {/* Gamification Pills & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter Pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff3e0] border-2 border-on-surface rounded-full candy-btn-shadow"
            title={`${streakDays} Hari Streak Aktif`}
          >
            <Flame className="w-4 h-4 text-[#e65100] fill-[#e65100] animate-pulse" />
            <span className="text-xs font-display font-black text-on-surface">
              {streakDays} Hari
            </span>
          </div>

          {/* Level Pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-300 border-2 border-on-surface rounded-full candy-btn-shadow"
            title={`Level ${user?.level || 1} — ${user?.rank_title || 'Siswa Pemula'}`}
          >
            <span className="text-xs font-mono font-black text-on-surface">
              Lv.{user?.level || 1}
            </span>
          </div>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-fixed border-2 border-on-surface rounded-full candy-btn-shadow">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-xs font-display font-black text-secondary">
              {displayXp.toLocaleString()} XP
            </span>
          </div>

          {/* Notification Button */}
          <button
            className="w-9 h-9 rounded-full bg-surface-container-high border-2 border-on-surface flex items-center justify-center text-on-surface hover:bg-secondary-fixed transition-colors candy-btn-shadow"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Quick Start Coding CTA */}
          <Link
            href="/classes/css-flexbox"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white font-display font-bold text-xs rounded-full border-2 border-on-surface candy-btn-shadow hover:scale-105 transition-transform duration-200"
          >
            <Code2 className="w-4 h-4" />
            <span>Coding</span>
          </Link>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-9 h-9 rounded-full border-2 border-on-surface overflow-hidden bg-primary-fixed ring-2 ring-primary flex items-center justify-center text-xs font-black text-primary focus:outline-none cursor-pointer"
              title={user ? `@${user.username}` : "Akun Pengguna"}
            >
              {initials}
            </button>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-on-surface rounded-full pointer-events-none"></span>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border-2 border-on-surface rounded-2xl p-2.5 shadow-brutal z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-outline-variant mb-1">
                      <p className="font-headline font-bold text-xs text-on-surface truncate">
                        @{user.username}
                      </p>
                      <p className="font-body text-[11px] text-on-surface-variant truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="font-mono text-[10px] font-black text-on-surface bg-amber-300 px-2 py-0.5 rounded-full border border-on-surface">
                          Lv.{user.level || 1}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">
                          {user.xp_points} XP
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-on-surface-variant mt-1">
                        {user.rank_title || "Siswa Pemula"}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span>Edit Profil &amp; Foto</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-1 p-1">
                    <Link
                      href="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Masuk ke Akun</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary bg-primary-fixed hover:opacity-90 transition-opacity"
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
            className="lg:hidden p-2 rounded-full border-2 border-on-surface bg-surface-container hover:bg-surface-container-high"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-on-surface bg-surface-container-lowest px-4 py-3 flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kelas, topik, sintaks..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low border-2 border-outline-variant rounded-full text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-2 pt-1 font-bold text-sm">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-primary-fixed text-primary"
            >
              Workspace Dashboard
            </Link>
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-surface-container"
            >
              Silabus Kelas
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-surface-container"
            >
              Landing Page
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
