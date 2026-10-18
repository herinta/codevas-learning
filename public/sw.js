/**
 * Codevas Progressive Web App (PWA) Service Worker
 * Handles offline shell caching, push notifications, and streak reminders.
 */

const CACHE_NAME = 'codevas-pwa-v1';
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
];

// 1. Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[PWA SW] Pre-caching warning:', err);
        return self.skipWaiting();
      })
  );
});

// 2. Activate Event: Clean old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log('[PWA SW] Deleting outdated cache:', name);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-first with Cache fallback for navigations, Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests and API calls from aggressive caching
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  // Navigation requests: Network first, fallback to cached dashboard or root
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/dashboard') || caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets (images, icons, styles): Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Notification Click Event: Focus or open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 5. Message Event: Trigger real test notifications or schedule streak reminder from client
self.addEventListener('message', (event) => {
  if (!event.data) return;

  const { type, streakDays, username, customBody } = event.data;

  if (type === 'TRIGGER_STREAK_NOTIFICATION') {
    const days = streakDays || 1;
    const name = username ? `@${username}` : 'Coder';

    const title = `🔥 Streak ${days} Hari Menunggumu!`;
    const options = {
      body:
        customBody ||
        `Hai ${name}, jangan biarkan apimu padam! Selesaikan 1 quest cepat hari ini untuk mempertahankan streak-mu.`,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'streak-reminder',
      renotify: true,
      vibrate: [100, 50, 100],
      data: {
        url: '/dashboard',
        timestamp: Date.now(),
      },
      actions: [
        {
          action: 'open_dashboard',
          title: 'Mulai Quest Sekarang 🚀',
        },
      ],
    };

    self.registration.showNotification(title, options);
  }
});

// 6. Push Event: Handle background push messages
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { text: event.data ? event.data.text() : '' };
  }

  const title = data.title || '🔥 Pengingat Streak Codevas';
  const options = {
    body:
      data.body ||
      'Waktunya koding! Luangkan 3 menit hari ini untuk menjaga streak belajarmu tetap menyala.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'streak-reminder',
    vibrate: [150, 50, 150],
    data: {
      url: data.url || '/dashboard',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
