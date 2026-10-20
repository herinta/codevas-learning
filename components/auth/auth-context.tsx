"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { calculateGamificationStats } from "@/lib/gamification";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  xp_points: number;
  level: number;
  rank_title: string;
  rank_badge: string;
  current_level_xp: number;
  next_level_xp: number;
  level_progress_percent: number;
  xp_remaining: number;
  streak_days?: number;
  role: string;
  age_group?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
  setUser: () => {},
});

const CACHED_USER_KEY = "codevas_auth_user_cache";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Instant Cache Hydration: Render cached user immediately in 0ms to eliminate reload spinners
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHED_USER_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id) {
          setUser(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn("Failed to load cached user session:", e);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const stats = calculateGamificationStats(data.user.xp_points);
          const fullUser: AuthUser = {
            ...data.user,
            level: data.user.level ?? stats.level,
            rank_title: data.user.rank_title ?? stats.rank_title,
            rank_badge: data.user.rank_badge ?? stats.rank_badge,
            current_level_xp: data.user.current_level_xp ?? stats.current_level_xp,
            next_level_xp: data.user.next_level_xp ?? stats.next_level_xp,
            level_progress_percent: data.user.level_progress_percent ?? stats.level_progress_percent,
            xp_remaining: data.user.xp_remaining ?? stats.xp_remaining,
          };
          setUser(fullUser);
          try {
            localStorage.setItem(CACHED_USER_KEY, JSON.stringify(fullUser));
          } catch {}
        } else {
          setUser(null);
          try {
            localStorage.removeItem(CACHED_USER_KEY);
          } catch {}
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem(CACHED_USER_KEY);
        } catch {}
      }
    } catch {
      // Keep existing cached user on temporary network hiccups
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      try {
        localStorage.removeItem(CACHED_USER_KEY);
        localStorage.removeItem("codevas_dashboard_classes_cache");
      } catch {}
      // Use replace to erase the authenticated page from the browser history stack
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    // Initial silent background revalidation
    refreshUser();

    // Listen to browser Back/Forward Cache (bfcache) restore
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        refreshUser();
      }
    };

    // Auto-update when returning to tab without manual reload
    const handleFocus = () => {
      refreshUser();
    };

    // Cross-tab synchronization when a challenge passes in another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "codevas:progress-synced") {
        refreshUser();
      }
    };

    const handleCustomProgress = () => {
      refreshUser();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("codevas:progress-updated", handleCustomProgress);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("codevas:progress-updated", handleCustomProgress);
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
