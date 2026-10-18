import React from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Demo Showcase Register — Codevas",
  description: "Registrasi cepat otomatis untuk reviewer portofolio Codevas.",
};

/**
 * Route: /demo/register
 * Specially designed for portfolio showcase: includes 1-click random data & 1-click auto-register
 */
export default function DemoRegisterPage() {
  return (
    <AuthShell welcomeBonus={true}>
      <RegisterForm isDemoMode={true} />
    </AuthShell>
  );
}
