"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Flame,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  isNotificationSupported,
  getNotificationPermission,
  isStreakReminderEnabled,
  requestStreakNotificationPermission,
  setStreakReminderEnabled,
} from "@/lib/pwa/streak-notifications";
import { useAuth } from "@/components/auth/auth-context";

export const StreakReminderCard: React.FC = () => {
  const { user } = useAuth();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

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

    if (permission !== "granted") {
      const perm = await requestStreakNotificationPermission();
      setPermission(perm);
      if (perm === "granted") {
        setEnabled(true);
        setStreakReminderEnabled(true);
      }
    } else {
      const nextState = !enabled;
      setEnabled(nextState);
      setStreakReminderEnabled(nextState);
    }

    setLoading(false);
  };

  if (!supported) {
    return null;
  }

  const isGranted = permission === "granted" && enabled;

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-[0_3px_0_#0f172a] relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#0f172a] ${
              isGranted
                ? "bg-[#FEF08A] text-slate-900"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isGranted ? (
              <BellRing className="w-5 h-5 text-amber-700 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xs text-slate-900">
                Pengingat Streak
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#FEF08A] text-slate-900 border border-slate-900 rounded-md text-[10px] font-mono font-black">
                <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                <span>{user?.streak_days || 1} Hari</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-snug mt-0.5">
              Notifikasi browser agar streak kodingmu tidak padam.
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={loading || permission === "denied"}
          className={`w-12 h-6.5 rounded-full border-2 border-slate-900 p-0.5 transition-colors cursor-pointer shrink-0 ${
            isGranted ? "bg-emerald-500" : "bg-slate-200"
          } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isGranted ? "Matikan Pengingat" : "Aktifkan Pengingat Streak"}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white border border-slate-900 shadow-xs transition-transform ${
              isGranted ? "translate-x-5.5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Permission Denied Notice */}
      {permission === "denied" && (
        <div className="mt-3 p-2.5 bg-red-50 border-2 border-red-300 rounded-xl text-[11px] text-red-900 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Izin notifikasi diblokir. Aktifkan izin notifikasi pada setelan browsermu.</span>
        </div>
      )}
    </div>
  );
};
