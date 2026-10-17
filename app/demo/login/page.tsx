import React from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Demo Showcase Login — Codevas",
  description: "Akses akun demo siswa dan admin untuk review portofolio interaktif Codevas.",
};

/**
 * Route: /demo/login
 * Specially designed for portfolio showcase: displays demo accounts with 1-click auto-fill
 */
export default function DemoLoginPage() {
  return (
    <AuthShell>
      <LoginForm isDemoMode={true} />
    </AuthShell>
  );
}
