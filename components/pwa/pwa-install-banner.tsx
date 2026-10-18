"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles, Check, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if mobile web (UA or screen width < 768px)
    const checkIsMobile = () => {
      if (typeof window === "undefined") return false;
      const ua = window.navigator.userAgent.toLowerCase();
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      const isNarrow = window.innerWidth < 768;
      return isMobileUA || isNarrow;
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    window.addEventListener("resize", handleResize);

    // 2. Check if already installed / running in standalone PWA mode
    if (typeof window !== "undefined") {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);

      // Detect iOS Safari
      const ua = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
      setIsIos(isApple);

      // Check session dismissal
      const dismissed = sessionStorage.getItem("codevas_pwa_banner_dismissed") === "true";
      setIsDismissed(dismissed);
    }

    // 3. Listen for beforeinstallprompt (Chrome / Android / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Handle Install Action
  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback instruction
      alert("Untuk memasang di hp, ketuk menu browser (titik tiga) lalu pilih 'Tambahkan ke Layar Utama' atau 'Install Aplikasi'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsStandalone(true);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("codevas_pwa_banner_dismissed", "true");
  };

  // Strictly only show on mobile web! Never on desktop
  if (!isMobile) {
    return null;
  }

  // If already standalone or user dismissed, don't show
  if (isStandalone || isDismissed) {
    return null;
  }

  // Only show if prompt is available OR on iOS Safari
  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <>
      {/* FLOATING MOBILE PWA INSTALL BANNER - KHUSUS MOBILE (Ditempatkan di atas bottom nav) */}
      <div className="fixed bottom-20 inset-x-4 z-50 animate-in slide-in-from-bottom-5 duration-300 md:hidden">
        <div className="bg-surface-container-lowest border-3 border-on-surface rounded-2xl p-4 shadow-[0_8px_0_#2e1a28] relative">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Nanti saja"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5 pr-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white border-2 border-on-surface shadow-xs shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-headline font-black text-xs text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Aplikasi Mobile Codevas</span>
                </span>
              </div>

              <h4 className="font-display font-black text-sm text-on-surface leading-tight">
                Tambahkan ke Layar Utama
              </h4>

              <p className="text-xs text-on-surface-variant font-medium mt-1 leading-snug">
                Buka lebih cepat, tampilan layar penuh tanpa browser bar, dan aktifkan pengingat streak!
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs font-headline font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              Nanti Saja
            </button>

            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-primary hover:bg-[#ec4899] text-white rounded-xl font-headline font-black text-xs border-2 border-on-surface shadow-[0_3px_0_#2e1a28] flex items-center gap-1.5 hover:scale-105 active:translate-y-0.5 transition-transform cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* iOS SAFARI INSTALL GUIDE MODAL */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 max-w-sm w-full shadow-[0_12px_0_#2e1a28] space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-display font-black text-base text-on-surface">
                  Pasang di iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Ikuti 2 langkah mudah berikut di Safari untuk menambahkan Codevas ke Homescreen:
            </p>

            <div className="space-y-3 bg-surface-container-low p-4 rounded-2xl border-2 border-on-surface text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-[11px] shrink-0 border border-on-surface">
                  1
                </span>
                <div>
                  <span className="font-bold text-on-surface block">
                    Ketuk tombol Bagikan (Share)
                  </span>
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    Ikon kotak berpanah ke atas <Share className="w-3.5 h-3.5 text-primary inline" /> di bilah bawah Safari.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center font-black text-[11px] shrink-0 border border-on-surface">
                  2
                </span>
                <div>
                  <span className="font-bold text-on-surface block">
                    Pilih &quot;Tambahkan ke Layar Utama&quot;
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">
                    Scroll ke bawah dan ketuk <strong>Add to Home Screen (➕)</strong>.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 bg-primary text-white font-headline font-black text-xs rounded-xl border-2 border-on-surface shadow-[0_3px_0_#2e1a28] cursor-pointer"
            >
              Mengerti!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
