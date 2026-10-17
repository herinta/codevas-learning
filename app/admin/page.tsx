import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Console — Codevas",
  description: "Pusat kendali administrator, pemantauan sistem, dan kurikulum Codevas.",
};

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
      <AdminDashboardClient />
    </Suspense>
  );
}
