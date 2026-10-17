import React, { Suspense } from "react";
import type { Metadata } from "next";
import { CLASSES_MAP, DEFAULT_CLASS } from "@/lib/classes-data";
import { ClassDetailView } from "@/components/classes/class-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: "css-flexbox-magic" },
    { id: "html5-semantic-structure" },
    { id: "css-grid-animations" },
    { id: "javascript-dom-interactivity" },
    { id: "react-19-component-engineering" },
    { id: "fullstack-ui-engine" },
    { id: "advanced-js-logic" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const classData = CLASSES_MAP[id] || DEFAULT_CLASS;

  return {
    title: `${classData.title} — Codevas`,
    description: classData.tagline,
  };
}

async function ClassDetailContent({ params }: PageProps) {
  const { id } = await params;
  const classData = CLASSES_MAP[id] || DEFAULT_CLASS;

  return <ClassDetailView classData={classData} />;
}

export default function ClassDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
          <div className="flex items-center gap-2 font-headline font-bold text-lg text-primary animate-pulse">
            <span>Memuat Modul Kelas Codevas...</span>
          </div>
        </div>
      }
    >
      <ClassDetailContent params={params} />
    </Suspense>
  );
}
