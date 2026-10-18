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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const stats = calculateGamificationStats(data.user.xp_points);
          setUser({
            ...data.user,
            level: data.user.level ?? stats.level,
            rank_title: data.user.rank_title ?? stats.rank_title,
            rank_badge: data.user.rank_badge ?? stats.rank_badge,
            current_level_xp: data.user.current_level_xp ?? stats.current_level_xp,
            next_level_xp: data.user.next_level_xp ?? stats.next_level_xp,
            level_progress_percent: data.user.level_progress_percent ?? stats.level_progress_percent,
            xp_remaining: data.user.xp_remaining ?? stats.xp_remaining,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
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
      // Use replace to erase the authenticated page from the browser history stack
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to browser Back/Forward Cache (bfcache) restore
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        refreshUser();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
