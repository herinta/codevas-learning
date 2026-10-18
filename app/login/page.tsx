import React from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk ke Akun",
  description:
    "Lanjutkan petualangan coding frontend-mu di Codevas. Masuk untuk mengakses kurikulum, progress belajar, dan streak harian.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
