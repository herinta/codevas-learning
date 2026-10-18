import React from "react";
import type { Metadata } from "next";
import { ClassService } from "@/lib/services/class.service";
import { CLASSES_LIST } from "@/lib/classes-data";
import {
  ClassesCatalogClient,
  type ApiClassItem,
} from "@/components/classes/classes-catalog-client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codevas.dev";

export const metadata: Metadata = {
  title: "Silabus & Katalog Kelas Koding Interaktif",
  description:
    "Jelajahi kurikulum pemrograman web interaktif di Codevas. Pelajari HTML Architecture, CSS Box Model, JavaScript DOM, dan algoritma logika dengan playground interaktif & gamifikasi.",
  keywords: [
    "katalog kelas coding",
    "kursus web development gratis",
    "belajar html css javascript",
    "kurikulum frontend developer indonesia",
    "silabus coding interaktif",
    "codevas classes",
    "belajar coding pemula",
    "live code playground indonesia",
  ],
  alternates: {
    canonical: `${baseUrl}/classes`,
  },
  openGraph: {
    title: "Silabus & Katalog Kelas Koding Interaktif — Codevas",
    description:
      "Kurikulum pemrograman web modern dengan gamifikasi: Live Code Playground, Visual Logic Blocks, dan Kuis Interaktif.",
    url: `${baseUrl}/classes`,
    type: "website",
    siteName: "Codevas",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silabus & Katalog Kelas Koding Interaktif — Codevas",
    description:
      "Kurikulum pemrograman web modern dengan gamifikasi: Live Code Playground, Visual Logic Blocks, dan Kuis Interaktif.",
  },
};

export default async function AllClassesCatalogPage() {
  let initialClasses: ApiClassItem[] = [];

  try {
    const dbClasses = await ClassService.getAllClasses();
    if (dbClasses && dbClasses.length > 0) {
      initialClasses = dbClasses.map((c) => ({
        id: c.id,
        category: (c.category || "LIVE_CODE") as "LIVE_CODE" | "DRAG_DROP" | "QUIZ",
        title: c.title,
        tagline: c.tagline ?? null,
        description: c.description ?? null,
        difficulty_level: c.difficulty_level,
        xp_reward: c.xp_reward,
        estimated_time: c.estimated_time,
        is_published: c.is_published,
        totalLevels: c.totalLevels || 0,
        completedLevels: c.completedLevels || 0,
        progressPercent: c.progressPercent || 0,
        isEnrolled: c.isEnrolled || false,
      }));
    }
  } catch (err) {
    console.error("Gagal memuat kelas SSR katalog:", err);
    initialClasses = CLASSES_LIST.map((c) => ({
      id: c.id,
      category: c.category,
      title: c.title,
      tagline: c.tagline ?? null,
      description: c.about ?? null,
      difficulty_level: c.level,
      xp_reward: c.xpReward,
      estimated_time: c.estimatedHours,
      is_published: c.status === "available",
      totalLevels: c.modulesCount || 0,
      completedLevels: 0,
      progressPercent: 0,
      isEnrolled: false,
    }));
  }

  // Schema.org ItemList for Rich Snippets on Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Katalog & Silabus Kelas Koding Codevas",
    description:
      "Daftar kelas pemrograman web terstruktur mulai dari HTML, CSS, hingga JavaScript.",
    url: `${baseUrl}/classes`,
    numberOfItems: initialClasses.length,
    itemListElement: initialClasses.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: item.title,
        description: item.description || item.tagline || item.title,
        url: `${baseUrl}/classes/${item.id}`,
        provider: {
          "@type": "EducationalOrganization",
          name: "Codevas",
          sameAs: baseUrl,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClassesCatalogClient initialClasses={initialClasses} />
    </>
  );
}
