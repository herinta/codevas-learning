import React from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar Akun Baru Gratis",
  description:
    "Mulai belajar coding web interaktif, live playground, kuis, dan kumpulkan XP seru di Codevas. 100% gratis untuk pemula.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterPage() {
  return (
    <AuthShell welcomeBonus={true}>
      <RegisterForm />
    </AuthShell>
  );
}
