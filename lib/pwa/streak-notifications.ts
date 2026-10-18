/**
 * Client-side PWA and Streak Notification Manager
 */

export interface StreakReminderState {
  isSupported: boolean;
  permission: NotificationPermission;
  isEnabled: boolean;
}

const STORAGE_KEY = 'codevas_streak_notif_enabled';

/**
 * Register the Service Worker in the browser
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch (error) {
    console.warn('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Check if the browser supports Web Notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current notification permission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Check if user has opted in to streak reminders
 */
export function isStreakReminderEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

/**
 * Set user streak reminder preference
 */
export function setStreakReminderEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
}

/**
 * Request notification permission from the user
 */
export async function requestStreakNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setStreakReminderEnabled(true);
    } else {
      setStreakReminderEnabled(false);
    }
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Trigger an immediate test streak reminder notification
 */
export async function triggerTestStreakNotification(streakDays: number = 1, username?: string): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    const perm = await requestStreakNotificationPermission();
    if (perm !== 'granted') return false;
  }

  // 1. Try via Service Worker Registration (Standard PWA way)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(`🔥 Streak ${streakDays} Hari Menunggumu!`, {
          body: `Hai ${username ? `@${username}` : 'Coder'}, pertahankan apimu! 1 quest cepat hari ini cukup untuk menjaga streak belajarmu.`,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: 'streak-reminder-test',
          data: { url: '/dashboard' },
        });
        return true;
      }
    } catch (swErr) {
      console.warn('[PWA] SW showNotification failed, trying fallback:', swErr);
    }
  }

  // 2. Direct Fallback via Window Notification API
  try {
    new Notification(`🔥 Streak ${streakDays} Hari Menunggumu!`, {
      body: `Hai ${username ? `@${username}` : 'Coder'}, pertahankan apimu! 1 quest cepat hari ini cukup untuk menjaga streak belajarmu.`,
      icon: '/icons/icon-192.png',
    });
    return true;
  } catch (fallbackErr) {
    console.error('[PWA] Notification fallback failed:', fallbackErr);
    return false;
  }
}
