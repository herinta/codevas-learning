"use client";

import React, { useMemo } from "react";
import { ChallengeData } from "./types";
import { sanitizeUserHtml } from "./style-parser";

interface TargetGoalPanelProps {
  challengeId: string;
  challenge: ChallengeData | null;
}

const PALETTE = [
  { bg: "bg-pink-100", border: "border-pink-900", text: "text-pink-950", emoji: "🍬" },
  { bg: "bg-purple-100", border: "border-purple-900", text: "text-purple-950", emoji: "🍭" },
  { bg: "bg-amber-100", border: "border-amber-900", text: "text-amber-950", emoji: "🍫" },
  { bg: "bg-sky-100", border: "border-sky-900", text: "text-sky-950", emoji: "⭐" },
  { bg: "bg-emerald-100", border: "border-emerald-900", text: "text-emerald-950", emoji: "💎" },
  { bg: "bg-rose-100", border: "border-rose-900", text: "text-rose-950", emoji: "🍩" },
];

export const TargetGoalPanel: React.FC<TargetGoalPanelProps> = ({
  challengeId,
  challenge,
}) => {
  const isHtmlMode =
    challenge?.class_id === "html-architecture" || challengeId.startsWith("html-");
  const isCssBasicsMode =
    challenge?.class_id === "css-basics" ||
    challengeId.startsWith("css-basics-") ||
    challengeId.startsWith("basics-");
  const isGridMode =
    challenge?.class_id === "css-grid" ||
    challengeId.startsWith("grid-") ||
    challengeId.startsWith("gr-");
  const isFlexboxMode =
    challenge?.class_id === "flexbox" ||
    challengeId.startsWith("flexbox-") ||
    challengeId.startsWith("fb-");

  const itemsCount = challenge?.locked_template?.itemsCount || 3;
  const itemLabels = challenge?.locked_template?.itemLabels || [
    "🍬 Permen 1",
    "🍭 Permen 2",
    "🍫 Permen 3",
  ];

  // Sanitized HTML target preview
  const sanitizedTargetHtml = useMemo(() => {
    if (!isHtmlMode || !challenge?.target_visual?.preview) return "";
    return sanitizeUserHtml(challenge.target_visual.preview);
  }, [isHtmlMode, challenge?.target_visual?.preview]);

  // Target Flexbox styles calculation
  const targetFlexStyle = useMemo<React.CSSProperties>(() => {
    const tv = challenge?.target_visual || {};
    const style: React.CSSProperties = {
      display: (tv.display as any) || "flex",
      flexDirection: (tv.flexDirection as any) || (challengeId.includes("column") ? "column" : "row"),
      justifyContent:
        tv.justifyContent ||
        (challengeId.includes("center")
          ? "center"
          : challengeId.includes("push-justify-end") || challengeId.includes("floor-align-end")
          ? "flex-end"
          : challengeId.includes("split-space-between") || challengeId.includes("navbar")
          ? "space-between"
          : challengeId.includes("social-distancing")
          ? "space-evenly"
          : "flex-start"),
      alignItems:
        tv.alignItems ||
        (challengeId.includes("gravity") || challengeId.includes("perfect-center") || challengeId.includes("navbar")
          ? "center"
          : challengeId.includes("floor-align-end")
          ? "flex-end"
          : "stretch"),
      flexWrap: (tv.flexWrap as any) || (challengeId.includes("wrap") ? "wrap" : "nowrap"),
      gap: tv.gap || (challengeId.includes("gap") ? "20px" : challengeId.includes("navbar") ? "16px" : "12px"),
    };
    return style;
  }, [challenge?.target_visual, challengeId]);

  // Target Grid styles calculation
  const targetGridStyle = useMemo<React.CSSProperties>(() => {
    const tv = challenge?.target_visual || {};
    return {
      display: "grid",
      gridTemplateColumns:
        (tv as any).gridTemplateColumns ||
        (challengeId.includes("triplets")
          ? "repeat(3, 1fr)"
          : challengeId.includes("asymmetry")
          ? "250px 1fr"
          : challengeId.includes("bento")
          ? "repeat(4, 1fr)"
          : challengeId.includes("responsive")
          ? "repeat(auto-fit, minmax(180px, 1fr))"
          : "repeat(2, 1fr)"),
      gap: tv.gap || (challengeId.includes("alleyway") ? "24px" : "16px"),
    };
  }, [challenge?.target_visual, challengeId]);

  const targetDescription =
    challenge?.target_visual?.description ||
    (isHtmlMode
      ? "Struktur visual komponen yang perlu kamu bangun"
      : "Susunan letak elemen target yang diharapkan");

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {/* Header Label */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-lg bg-[#FEF08A] text-slate-900 border-2 border-slate-900 font-display font-black text-[11px] shadow-[0_1px_0_#0f172a] flex items-center gap-1 shrink-0">
            <span>🎯</span>
            <span>TARGET GOAL</span>
          </span>
          <p className="text-[11px] font-bold text-slate-600 truncate max-w-[240px] sm:max-w-[280px]">
            {targetDescription}
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
          Acuan Visual
        </span>
      </div>

      {/* Target Preview Box */}
      <div className="w-full bg-white border-3 border-slate-900 rounded-2xl shadow-[0_4px_0_#0f172a] overflow-auto p-3 sm:p-4 max-h-[180px] sm:max-h-[220px] relative">
        {/* Subtle Watermark Badge */}
        <div className="absolute top-2 right-2 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded-md bg-amber-100/80 border border-amber-300 text-[9px] font-mono font-bold text-amber-900">
            Acuan
          </span>
        </div>

        {/* 1. HTML Architecture Target Visual */}
        {isHtmlMode && (
          <div
            className="html-live-sandbox w-full font-body text-slate-800 text-xs sm:text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizedTargetHtml }}
          />
        )}

        {/* 2. Flexbox Target Visual */}
        {isFlexboxMode && (
          <div
            className="w-full h-full min-h-[90px] flex items-center p-2 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 transition-all"
            style={targetFlexStyle}
          >
            {Array.from({ length: itemsCount }).map((_, i) => {
              const color = PALETTE[i % PALETTE.length];
              const label = itemLabels[i] || `Permen ${i + 1}`;
              return (
                <div
                  key={i}
                  className={`rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center shadow-xs ${
                    color.bg
                  } ${
                    itemsCount > 4
                      ? "w-11 h-11 p-1 text-[8px]"
                      : "w-14 h-14 p-1.5 text-[10px]"
                  }`}
                >
                  <span className={itemsCount > 4 ? "text-xs" : "text-base"}>{color.emoji}</span>
                  <span className="font-bold font-mono text-slate-900 truncate max-w-full">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. CSS Grid Target Visual */}
        {isGridMode && (
          <div
            className="w-full h-full min-h-[90px] p-2 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 transition-all"
            style={targetGridStyle}
          >
            {Array.from({ length: itemsCount }).map((_, i) => {
              const color = PALETTE[i % PALETTE.length];
              const label = itemLabels[i] || `Sel ${i + 1}`;
              return (
                <div
                  key={i}
                  className={`rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center shadow-xs p-2 ${color.bg}`}
                >
                  <span className="text-base">{color.emoji}</span>
                  <span className="text-[10px] font-bold font-mono text-slate-900 mt-0.5 truncate max-w-full">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. CSS Basics Target Visual */}
        {isCssBasicsMode && (
          <div className="w-full flex items-center justify-center p-3">
            <div className="box w-full max-w-xs text-center font-body bg-sky-50 text-slate-800 border-2 border-slate-900 rounded-xl p-3 shadow-xs">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                {challenge?.title || "Target Visual"}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {challenge?.target_visual?.preview || challenge?.target_visual?.description || "Atur styling agar sesuai dengan panduan misi."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
