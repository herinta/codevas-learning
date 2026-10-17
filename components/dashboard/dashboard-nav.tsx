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
} from "lucide-react";

export interface DashboardNavProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly userXp?: number;
  readonly streakDays?: number;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  searchQuery,
  onSearchChange,
  userXp = 1240,
  streakDays = 12,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-fixed border-2 border-on-surface rounded-full candy-btn-shadow">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-xs font-display font-black text-secondary">
              {userXp.toLocaleString()} XP
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

          {/* User Profile Avatar */}
          <div className="relative pl-0.5">
            <div className="w-9 h-9 rounded-full border-2 border-on-surface overflow-hidden bg-primary-fixed ring-2 ring-primary flex items-center justify-center text-sm font-black text-primary">
              AL
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-on-surface rounded-full"></span>
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
