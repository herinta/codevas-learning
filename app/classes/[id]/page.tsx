import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ClassService } from "@/lib/services/class.service";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { ClassDetailClient } from "@/components/classes/class-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const courseClass = await ClassService.getClassById(id);

  if (!courseClass) {
    return {
      title: "Kelas Tidak Ditemukan — Codevas",
    };
  }

  return {
    title: `${courseClass.title} — Codevas`,
    description: courseClass.tagline || courseClass.description || "Kelas interaktif di Codevas.",
  };
}

async function ClassDetailContent({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  let userId: string | undefined = undefined;

  if (sessionCookie?.value) {
    const payload = verifySessionToken(sessionCookie.value);
    if (payload) {
      userId = payload.userId;
    }
  }

  const courseClass = await ClassService.getClassById(id, userId);

  if (!courseClass) {
    notFound();
  }

  return <ClassDetailClient initialData={courseClass} />;
}

export default function ClassDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
          <div className="flex items-center gap-2 font-headline font-bold text-lg text-primary animate-pulse">
            <span>Memuat Rincian Kelas...</span>
          </div>
        </div>
      }
    >
      <ClassDetailContent params={params} />
    </Suspense>
  );
}
