import React from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar Akun Baru — Codevas",
  description: "Mulai belajar coding web interaktif dan kumpulkan XP di Codevas.",
};

export default function RegisterPage() {
  return (
    <AuthShell welcomeBonus={true}>
      <RegisterForm />
    </AuthShell>
  );
}
