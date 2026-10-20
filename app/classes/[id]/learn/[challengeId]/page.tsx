import React, { Suspense, use } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { LearnWorkspace } from "@/components/learn/learn-workspace";

interface ChallengePageProps {
  params: Promise<{ id: string; challengeId: string }>;
}

export const metadata: Metadata = {
  title: "Workspace Belajar — Codevas",
  description: "Tantangan coding interaktif live code playground dengan gamifikasi dan live feedback.",
};

function ChallengePlaygroundWrapper({ params }: ChallengePageProps) {
  const { id: classId, challengeId } = use(params);

  return <LearnWorkspace classId={classId} challengeId={challengeId} />;
}

export default function ChallengePlaygroundPage({ params }: ChallengePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#EF4444] animate-spin" />
          <p className="font-display font-black text-sm text-slate-900">
            Mempersiapkan Workspace Interaktif...
          </p>
        </div>
      }
    >
      <ChallengePlaygroundWrapper params={params} />
    </Suspense>
  );
}
