import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ClassesSection } from "@/components/landing/classes-section";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsBanner } from "@/components/landing/stats-banner";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-on-surface">
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
