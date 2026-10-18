"use client";

import React, { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa/streak-notifications";
import { PwaInstallBanner } from "./pwa-install-banner";

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Automatically register Service Worker
    registerServiceWorker();
  }, []);

  return (
    <>
      {children}
      <PwaInstallBanner />
    </>
  );
};
