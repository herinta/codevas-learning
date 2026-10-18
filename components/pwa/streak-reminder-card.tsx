"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
import {
  isNotificationSupported,
  getNotificationPermission,
  isStreakReminderEnabled,
  requestStreakNotificationPermission,
  triggerTestStreakNotification,
  setStreakReminderEnabled,
} from "@/lib/pwa/streak-notifications";
import { useAuth } from "@/components/auth/auth-context";

export const StreakReminderCard: React.FC = () => {
  const { user } = useAuth();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const isSupp = isNotificationSupported();
    setSupported(isSupp);
    if (isSupp) {
      setPermission(getNotificationPermission());
      setEnabled(isStreakReminderEnabled());
    }
  }, []);

  const handleToggle = async () => {
    if (!supported) return;

    setLoading(true);
    setTestSent(false);

    if (permission !== "granted") {
      const perm = await requestStreakNotificationPermission();
      setPermission(perm);
      if (perm === "granted") {
        setEnabled(true);
        // Automatically fire one test notification to delight the user!
        await triggerTestStreakNotification(user?.streak_days || 1, user?.username);
        setTestSent(true);
      }
    } else {
      const nextState = !enabled;
      setEnabled(nextState);
      setStreakReminderEnabled(nextState);
    }

    setLoading(false);
  };

  const handleTestNotification = async () => {
    setLoading(true);
    setTestSent(false);
    const success = await triggerTestStreakNotification(
      user?.streak_days || 1,
      user?.username
    );
    setLoading(false);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  if (!supported) {
    return null;
  }

  const isGranted = permission === "granted" && enabled;

  return (
    <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl p-4 sm:p-5 shadow-[0_4px_0_#2e1a28] relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl border-2 border-on-surface flex items-center justify-center shrink-0 shadow-xs ${
              isGranted
                ? "bg-amber-400 text-on-surface"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {isGranted ? (
              <BellRing className="w-5 h-5 text-amber-950 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-black text-xs text-on-surface">
                Pengingat Streak
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-[10px] font-mono font-bold">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>{user?.streak_days || 1} Hari</span>
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium leading-snug mt-0.5">
              Notifikasi browser agar streak kodingmu tidak padam.
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={loading || permission === "denied"}
          className={`w-12 h-6.5 rounded-full border-2 border-on-surface p-0.5 transition-colors cursor-pointer shrink-0 ${
            isGranted ? "bg-emerald-500" : "bg-surface-container-highest"
          } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isGranted ? "Matikan Pengingat" : "Aktifkan Pengingat Streak"}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white border border-on-surface shadow-xs transition-transform ${
              isGranted ? "translate-x-5.5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Permission Denied Notice */}
      {permission === "denied" && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-300 rounded-xl text-[11px] text-red-900 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Izin notifikasi diblokir. Aktifkan izin notifikasi pada setelan browsermu.</span>
        </div>
      )}

      {/* Active State Actions */}
      {isGranted && (
        <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{testSent ? "Notifikasi terkirim!" : "Notifikasi Aktif"}</span>
          </div>

          <button
            onClick={handleTestNotification}
            disabled={loading}
            className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg border border-on-surface text-[11px] font-headline font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            title="Kirim notifikasi uji coba ke perangkat"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3 text-primary" />
            )}
            <span>Tes Notifikasi</span>
          </button>
        </div>
      )}
    </div>
  );
};
