"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { DailyTargetStatus } from "@/lib/services/daily-target.service";
import { triggerTestStreakNotification } from "@/lib/pwa/streak-notifications";

const SYNC_INTERVAL_SECONDS = 30;

export function useDailyTargetTracker() {
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<DailyTargetStatus | null>(null);
  const [localSeconds, setLocalSeconds] = useState<number>(0);
  const [justCompletedModal, setJustCompletedModal] = useState<boolean>(false);

  // Unsynced active seconds accumulated in memory
  const unsyncedSecondsRef = useRef<number>(0);
  const isSyncingRef = useRef<boolean>(false);

  // 1. Initial fetch from API (only for authenticated users)
  const fetchStatus = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/user/daily-target");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStatus(json.data);
          setLocalSeconds(json.data.activeSeconds || 0);
        }
      }
    } catch (err) {
      console.warn("[DailyTarget] Failed to fetch status:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchStatus();
    }
  }, [fetchStatus, user?.id]);

  // 2. Sync accumulated seconds to server
  const syncToServer = useCallback(async () => {
    if (unsyncedSecondsRef.current <= 0 || isSyncingRef.current || !user) {
      return;
    }

    const secondsToSync = unsyncedSecondsRef.current;
    unsyncedSecondsRef.current = 0;
    isSyncingRef.current = true;

    try {
      const res = await fetch("/api/user/daily-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds: secondsToSync }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStatus((prev) => ({
            ...prev,
            ...json.data,
            weeklyHistory: prev?.weeklyHistory || [],
          }));
          setLocalSeconds(json.data.activeSeconds);

          if (json.justCompleted) {
            setJustCompletedModal(true);
            refreshUser();

            // Native PWA notification if enabled
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("🎯 Target 10 Menit Tercapai!", {
                  body: "Luar biasa! Kamu telah fokus belajar 10 menit hari ini. Bonus +30 XP telah masuk!",
                  icon: "/icons/icon-192.png",
                });
              } catch (e) {
                console.warn(e);
              }
            }
          }
        }
      } else {
        // Rollback unsynced on failure
        unsyncedSecondsRef.current += secondsToSync;
      }
    } catch {
      unsyncedSecondsRef.current += secondsToSync;
    } finally {
      isSyncingRef.current = false;
    }
  }, [user, refreshUser]);

  // 3. Heartbeat Active Timer (only when user is active & tab is visible)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Only count active time if tab is visible
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        unsyncedSecondsRef.current += 1;
        setLocalSeconds((prev) => prev + 1);

        // Every 30 seconds, sync to server
        if (unsyncedSecondsRef.current >= SYNC_INTERVAL_SECONDS) {
          syncToServer();
        }
      }
    }, 1000);

    // Sync when tab visibility changes or page unloads
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && unsyncedSecondsRef.current > 0) {
        syncToServer();
      }
    };

    const handleBeforeUnload = () => {
      if (unsyncedSecondsRef.current > 0) {
        syncToServer();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (unsyncedSecondsRef.current > 0) {
        syncToServer();
      }
    };
  }, [user?.id, syncToServer]);

  // Compute live local percentage and formatted time
  const targetSeconds = status?.targetSeconds || 600;
  const percent = Math.min(100, Math.round((localSeconds / targetSeconds) * 100));
  const isCompleted = localSeconds >= targetSeconds || status?.isCompleted || false;

  const mins = Math.floor(localSeconds / 60);
  const secs = localSeconds % 60;
  const formattedActive = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return {
    status,
    localSeconds,
    targetSeconds,
    percent,
    isCompleted,
    formattedActive,
    formattedTarget: "10:00",
    justCompletedModal,
    dismissJustCompletedModal: () => setJustCompletedModal(false),
    syncNow: syncToServer,
  };
}
