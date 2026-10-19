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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codevas.dev";

  if (!courseClass) {
    return {
      title: "Kelas Tidak Ditemukan",
    };
  }

  const title = `${courseClass.title} — Kelas Interaktif`;
  const description =
    courseClass.tagline ||
    courseClass.description ||
    `Pelajari ${courseClass.title} secara visual dengan live coding playground dan tantangan gamifikasi berhadiah XP di Codevas.`;

  return {
    title,
    description,
    keywords: [
      courseClass.title,
      `belajar ${courseClass.title.toLowerCase()}`,
      courseClass.category === "LIVE_CODE" ? "live code tutorial" : "coding puzzle",
      "belajar web development pemula",
      "kursus koding gratis",
      "codevas",
    ],
    alternates: {
      canonical: `${baseUrl}/classes/${courseClass.id}`,
    },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url: `${baseUrl}/classes/${courseClass.id}`,
      title,
      description,
      siteName: "Codevas",
      images: [
        {
          url: "/icons/icon-512.png",
          width: 512,
          height: 512,
          alt: courseClass.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/icons/icon-512.png"],
    },
  };
}

async function ClassDetailContent({ params }: PageProps) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codevas.dev";

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

  // Google Rich Snippets: Course & BreadcrumbList Schema.org JSON-LD
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${baseUrl}/classes/${courseClass.id}#course`,
        "name": courseClass.title,
        "description": courseClass.tagline || courseClass.description || "Kelas interaktif di Codevas.",
        "provider": {
          "@type": "Organization",
          "name": "Codevas",
          "sameAs": baseUrl,
        },
        "educationalLevel": courseClass.difficulty_level || "Pemula",
        "isAccessibleForFree": true,
        "inLanguage": "id",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IDR",
          "category": "Free",
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Online",
          "courseWorkload": courseClass.estimated_time || "2 Jam",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/classes/${courseClass.id}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Beranda",
            "item": baseUrl,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Silabus & Kelas",
            "item": `${baseUrl}/classes`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": courseClass.title,
            "item": `${baseUrl}/classes/${courseClass.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <ClassDetailClient initialData={courseClass} />
    </>
  );
}

export default function ClassDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] text-slate-900">
          <div className="flex items-center gap-2 font-display font-black text-lg text-[#EF4444] animate-pulse">
            <span>Memuat Rincian Kelas...</span>
          </div>
        </div>
      }
    >
      <ClassDetailContent params={params} />
    </Suspense>
  );
}
