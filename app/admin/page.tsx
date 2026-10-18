import React, { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { Loader2 } from "lucide-react";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { UserService } from "@/lib/services/user.service";

export const metadata: Metadata = {
  title: "Admin Console — Codevas",
  description: "Pusat kendali administrator, pemantauan sistem, dan kurikulum Codevas.",
};

async function AdminGuardContent() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/login?redirect=/admin");
  }

  const payload = verifySessionToken(sessionCookie.value);
  if (!payload) {
    redirect("/login?redirect=/admin");
  }

  // Double check directly from DB to prevent privilege escalation or revoked accounts
  const user = await UserService.findById(payload.userId);
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminDashboardClient />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="font-headline font-bold text-sm text-on-surface">
            Mempersiapkan Admin Console...
          </p>
        </div>
      }
    >
      <AdminGuardContent />
    </Suspense>
  );
}

