"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ClassesSection } from "@/components/landing/classes-section";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsBanner } from "@/components/landing/stats-banner";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Jika user sudah login, redirect otomatis ke /dashboard; jika belum, alihkan sementara ke /demo
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/demo");
      }
    }
  }, [user, loading, router]);

  // Track visitor
  useEffect(() => {
    if (!loading && !user) {
      fetch("/api/analytics/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/demo" }),
      }).catch(() => {});
    }
  }, [loading, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] text-slate-900">
      <div className="flex items-center gap-2 font-display font-black text-sm text-[#EF4444] animate-pulse">
        <span>Mengalihkan ke Codevas Demo...</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col bg-[#FFFDF7] text-slate-900">
      <Navbar />
      <HeroSection />
      <ClassesSection />
      <InteractiveDemo />
      <FeaturesSection />
      <StatsBanner />
      <Footer />
    </main>
  );
}
