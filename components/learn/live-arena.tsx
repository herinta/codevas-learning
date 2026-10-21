"use client";

import React from "react";
import { ChallengeData, ParsedStyles } from "./types";

interface LiveArenaProps {
  challengeId: string;
  challenge: ChallengeData | null;
  parsedStyles: ParsedStyles;
  sanitizedUserHtml: string;
  isPassed: boolean;
  sizeMode?: "compact" | "desktop";
}

const PALETTE = [
  { bg: "bg-pink-100", border: "border-pink-900", text: "text-pink-950", emoji: "🍬" },
  { bg: "bg-purple-100", border: "border-purple-900", text: "text-purple-950", emoji: "🍭" },
  { bg: "bg-amber-100", border: "border-amber-900", text: "text-amber-950", emoji: "🍫" },
  { bg: "bg-sky-100", border: "border-sky-900", text: "text-sky-950", emoji: "⭐" },
  { bg: "bg-emerald-100", border: "border-emerald-900", text: "text-emerald-950", emoji: "💎" },
  { bg: "bg-rose-100", border: "border-rose-900", text: "text-rose-950", emoji: "🍩" },
];

export const LiveArena: React.FC<LiveArenaProps> = ({
  challengeId,
  challenge,
  parsedStyles,
  sanitizedUserHtml,
  isPassed,
  sizeMode = "desktop",
}) => {
  const isCompact = sizeMode === "compact";
  const { arenaStyle, itemStyles } = parsedStyles;

  const isHtmlMode =
    challenge?.class_id === "html-architecture" || challengeId.startsWith("html-");
  const isCssBasicsMode =
    challenge?.class_id === "css-basics" ||
    challengeId.startsWith("css-basics-") ||
    challengeId.startsWith("basics-");
  const isNavbarMode =
    challengeId === "flexbox-12-boss-modern-navbar" || challengeId === "fb-12";
  const isGridMode =
    challenge?.class_id === "css-grid" ||
    challengeId.startsWith("grid-") ||
    challengeId.startsWith("gr-");
  const isBentoMode =
    challengeId === "grid-12-boss-bento-dashboard" || challengeId === "gr-12";
  const isGridHeaderMode =
    challengeId === "grid-5-header-expansion" ||
    challengeId === "gr-5" ||
    challengeId === "grid-7-absolute-placement" ||
    challengeId === "gr-7" ||
    challengeId === "grid-10-grid-areas" ||
    challengeId === "gr-10";
  const isGridSidebarMode =
    challengeId === "grid-6-tower-expansion" || challengeId === "gr-6";

  const itemsCount = challenge?.locked_template?.itemsCount || 3;
  const itemLabels = challenge?.locked_template?.itemLabels || [
    "🍬 Permen 1",
    "🍭 Permen 2",
    "🍫 Permen 3",
  ];

  const borderClass = isPassed
    ? "border-emerald-600 ring-4 ring-emerald-300/60"
    : "border-slate-900";

  // 1. HTML Architecture
  if (isHtmlMode) {
    return (
      <div
        id="live-arena"
        className={`arena w-full bg-white border-3 sm:border-4 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_4px_0_#0f172a] sm:shadow-[0_8px_0_#0f172a] overflow-auto transition-all relative ${borderClass} ${
          isCompact ? "h-28 sm:h-36 text-xs" : "min-h-[12rem] sm:min-h-[15rem]"
        }`}
      >
        <div
          className="html-live-sandbox w-full font-body text-slate-800"
          dangerouslySetInnerHTML={{ __html: sanitizedUserHtml }}
        />
      </div>
    );
  }

  // 2. CSS Basics
  if (isCssBasicsMode) {
    const isCapstone =
      challengeId.includes("boss") ||
      challengeId.includes("capstone") ||
      challengeId.includes("13") ||
      challengeId.includes("20");

    return (
      <div
        id="live-arena"
        className={`arena w-full bg-white border-3 sm:border-4 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-[0_4px_0_#0f172a] sm:shadow-[0_8px_0_#0f172a] overflow-auto flex items-center justify-center transition-all ${borderClass} ${
          isCompact ? "h-28 sm:h-36" : "h-48 sm:h-60 lg:h-64"
        }`}
      >
        {isCapstone ? (
          <div
            className="box transition-all inline-block font-body text-center max-w-xs cursor-pointer select-none"
            style={itemStyles["box"] || arenaStyle}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">🚀</span>
              <span className="font-display font-black text-sm tracking-wide">
                Neo Component
              </span>
            </div>
            <p className="text-xs opacity-90 leading-tight">
              Komponen interaktif berstandar UI modern.
            </p>
          </div>
        ) : (
          <div
            className={`box transition-all w-full text-center font-body bg-white text-slate-800 border-2 border-slate-200 rounded-xl shadow-xs ${
              isCompact ? "max-w-xs p-3" : "max-w-sm p-5"
            }`}
            style={itemStyles["box"] || arenaStyle}
          >
            <h3 className={`font-bold ${isCompact ? "text-sm" : "text-base"}`}>
              Belajar CSS Dasar
            </h3>
            <p className={`text-slate-600 mt-1 ${isCompact ? "text-xs" : "text-sm mt-2"}`}>
              Menguasai box model, perataan, warna, dan tipografi.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 3. Flexbox Navbar
  if (isNavbarMode) {
    return (
      <div
        id="live-arena"
        className={`navbar w-full bg-slate-900 border-3 sm:border-4 rounded-2xl sm:rounded-3xl shadow-[0_4px_0_#0f172a] sm:shadow-[0_8px_0_#0f172a] overflow-auto transition-all ${borderClass} ${
          isCompact ? "min-h-[4rem] p-3" : "min-h-[5.5rem] p-5"
        }`}
        style={arenaStyle}
      >
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md">
            ⚡
          </span>
          <div>
            <span className="font-display font-black text-white text-xs sm:text-base tracking-wider block leading-tight">
              CODEVAS
            </span>
            {!isCompact && (
              <span className="text-[10px] text-slate-400 font-mono">Modern Flex Navbar</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!isCompact && (
            <>
              <span className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-colors">
                Kurikulum
              </span>
              <span className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-colors">
                Tantangan
              </span>
            </>
          )}
          <button className="px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-[10px] sm:text-xs border border-white/20 shadow-md transition-transform active:scale-95">
            Mulai Belajar 🚀
          </button>
        </div>
      </div>
    );
  }

  // 4. CSS Grid
  if (isGridMode) {
    return (
      <div
        id="live-arena"
        className={`grid-arena w-full bg-slate-50 border-3 sm:border-4 rounded-2xl sm:rounded-3xl shadow-[0_4px_0_#0f172a] sm:shadow-[0_8px_0_#0f172a] overflow-auto transition-all ${borderClass} ${
          isCompact
            ? "min-h-[7.5rem] p-2.5"
            : "min-h-[12rem] sm:min-h-[16rem] lg:min-h-[18rem] p-4 sm:p-5"
        }`}
        style={{ display: "grid", ...arenaStyle }}
      >
        {isBentoMode ? (
          <>
            <div
              style={itemStyles["card-1"] || itemStyles["item-1"] || {}}
              className={`card-1 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white border-2 sm:border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col justify-between ${
                isCompact ? "p-2.5" : "p-5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={isCompact ? "text-xs" : "text-2xl"}>📈</span>
                <span className={`bg-white/20 px-2 py-0.5 rounded-full font-bold ${isCompact ? "text-[8px]" : "text-xs"}`}>
                  +148%
                </span>
              </div>
              <div>
                <p className={`font-black leading-tight ${isCompact ? "text-[10px]" : "text-lg"}`}>
                  Proyeksi Analitik
                </p>
                <p className={`text-white/80 ${isCompact ? "text-[8px]" : "text-xs mt-1"}`}>
                  Dashboard Bento
                </p>
              </div>
            </div>

            <div
              style={itemStyles["card-2"] || itemStyles["item-2"] || {}}
              className={`card-2 rounded-xl sm:rounded-2xl bg-amber-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center ${
                isCompact ? "p-1.5" : "p-4"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-2xl"}>👥</span>
              <span className={`font-black text-slate-900 ${isCompact ? "text-[8px]" : "text-sm mt-1"}`}>
                12.4k User
              </span>
            </div>

            <div
              style={itemStyles["card-3"] || itemStyles["item-3"] || {}}
              className={`card-3 rounded-xl sm:rounded-2xl bg-emerald-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center ${
                isCompact ? "p-1.5" : "p-4"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-2xl"}>⚡</span>
              <span className={`font-black text-slate-900 ${isCompact ? "text-[8px]" : "text-sm mt-1"}`}>
                99.9% Uptime
              </span>
            </div>

            <div
              style={itemStyles["card-4"] || itemStyles["item-4"] || {}}
              className={`card-4 rounded-xl sm:rounded-2xl bg-rose-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center ${
                isCompact ? "p-1.5" : "p-4"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-2xl"}>🛡️</span>
              <span className={`font-black text-slate-900 ${isCompact ? "text-[8px]" : "text-sm mt-1"}`}>
                Enkripsi
              </span>
            </div>

            {!isCompact && (
              <div
                style={itemStyles["card-5"] || itemStyles["item-5"] || {}}
                className="card-5 rounded-2xl p-4 bg-sky-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
              >
                <span className="text-2xl">⭐</span>
                <span className="text-sm font-black text-slate-900 mt-1">4.9 / 5.0</span>
                <span className="text-[10px] text-slate-500">Rating Komunitas</span>
              </div>
            )}
          </>
        ) : isGridHeaderMode ? (
          <>
            <div
              style={itemStyles["header"] || itemStyles["item-1"] || {}}
              className={`header grid-header rounded-xl sm:rounded-2xl bg-indigo-50 border-2 sm:border-3 border-slate-900 shadow-xs flex items-center justify-between ${
                isCompact ? "p-2" : "p-4"
              }`}
            >
              <div>
                <span className={`font-black text-indigo-950 font-mono block ${isCompact ? "text-[9px]" : "text-xs"}`}>
                  👑 .header (Span 3)
                </span>
                {!isCompact && (
                  <p className="text-xs text-indigo-800">Membentang melintasi 3 kolom</p>
                )}
              </div>
              <span className={isCompact ? "text-xs" : "text-2xl"}>⚡</span>
            </div>

            <div
              style={itemStyles["card-1"] || itemStyles["item-2"] || {}}
              className={`card-1 rounded-xl sm:rounded-2xl bg-amber-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center ${
                isCompact ? "p-2" : "p-4"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-xl"}>📦</span>
              <span className={`font-bold text-slate-800 ${isCompact ? "text-[9px]" : "text-xs mt-1"}`}>
                Kolom 1
              </span>
            </div>

            <div
              style={itemStyles["card-2"] || itemStyles["item-3"] || {}}
              className={`card-2 rounded-xl sm:rounded-2xl bg-emerald-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center ${
                isCompact ? "p-2" : "p-4"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-xl"}>📊</span>
              <span className={`font-bold text-slate-800 ${isCompact ? "text-[9px]" : "text-xs mt-1"}`}>
                Kolom 2
              </span>
            </div>

            <div
              style={itemStyles["card-3"] || itemStyles["item-4"] || {}}
              className={`card-3 rounded-xl sm:rounded-2xl bg-rose-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center ${
                isCompact ? "p-2" : "p-4"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-xl"}>⚙️</span>
              <span className={`font-bold text-slate-800 ${isCompact ? "text-[9px]" : "text-xs mt-1"}`}>
                Kolom 3
              </span>
            </div>
          </>
        ) : isGridSidebarMode ? (
          <>
            <div
              style={itemStyles["sidebar"] || itemStyles["item-1"] || {}}
              className={`sidebar grid-sidebar rounded-xl sm:rounded-2xl bg-purple-50 border-2 sm:border-3 border-slate-900 shadow-xs flex flex-col justify-center items-center text-center ${
                isCompact ? "p-2" : "p-5"
              }`}
            >
              <span className={isCompact ? "text-xs" : "text-3xl"}>🏰</span>
              <span className={`font-black text-purple-950 font-mono ${isCompact ? "text-[9px]" : "text-sm mt-2"}`}>
                .sidebar
              </span>
              <span className={`text-purple-700 ${isCompact ? "text-[8px]" : "text-xs"}`}>
                Tower Span 2
              </span>
            </div>

            <div
              style={itemStyles["card-1"] || itemStyles["item-2"] || {}}
              className={`card-1 rounded-xl sm:rounded-2xl bg-sky-50 border-2 sm:border-3 border-slate-900 shadow-xs flex items-center justify-center ${
                isCompact ? "p-2" : "p-5"
              }`}
            >
              <span className={`font-bold text-slate-800 ${isCompact ? "text-[9px]" : "text-sm"}`}>
                Panel 1
              </span>
            </div>

            <div
              style={itemStyles["card-2"] || itemStyles["item-3"] || {}}
              className={`card-2 rounded-xl sm:rounded-2xl bg-emerald-50 border-2 sm:border-3 border-slate-900 shadow-xs flex items-center justify-center ${
                isCompact ? "p-2" : "p-5"
              }`}
            >
              <span className={`font-bold text-slate-800 ${isCompact ? "text-[9px]" : "text-sm"}`}>
                Panel 2
              </span>
            </div>
          </>
        ) : (
          Array.from({ length: itemsCount }).map((_, i) => {
            const color = PALETTE[i % PALETTE.length];
            const label = itemLabels[i] || `Sel ${i + 1}`;
            const itemSpecificStyle =
              itemStyles[`card-${i + 1}`] || itemStyles[`item-${i + 1}`] || {};

            return (
              <div
                key={i}
                style={itemSpecificStyle}
                className={`card-${i + 1} rounded-xl sm:rounded-2xl border-2 sm:border-3 border-slate-900 flex flex-col items-center justify-center shadow-xs transition-all ${
                  color.bg
                } ${isCompact ? "p-2" : "p-4 shadow-[0_4px_0_#0f172a]"}`}
              >
                <span className={isCompact ? "text-xs" : "text-2xl"}>{color.emoji}</span>
                <span className="text-[9px] sm:text-xs font-bold font-mono text-slate-900 text-center truncate max-w-full mt-0.5">
                  {label}
                </span>
              </div>
            );
          })
        )}
      </div>
    );
  }

  // 5. Default CSS Flexbox (Permen/Candies)
  return (
    <div
      id="live-arena"
      className={`arena w-full bg-white border-3 sm:border-4 rounded-2xl sm:rounded-3xl shadow-[0_4px_0_#0f172a] sm:shadow-[0_8px_0_#0f172a] overflow-auto transition-all relative ${borderClass} ${
        isCompact ? "h-28 sm:h-36 p-2" : "h-48 sm:h-60 lg:h-64 p-4 sm:p-5"
      }`}
      style={arenaStyle}
    >
      {Array.from({ length: itemsCount }).map((_, i) => {
        const color = PALETTE[i % PALETTE.length];
        const label = itemLabels[i] || `Permen ${i + 1}`;
        const itemSpecificStyle =
          itemStyles[`item-${i + 1}`] || itemStyles[`card-${i + 1}`] || {};

        return (
          <div
            key={i}
            style={itemSpecificStyle}
            className={`permen-${i + 1} card-${
              i + 1
            } rounded-xl sm:rounded-2xl border-2 sm:border-3 border-slate-900 flex flex-col items-center justify-center shadow-[0_2px_0_#0f172a] sm:shadow-[0_4px_0_#0f172a] transition-all duration-200 ${
              color.bg
            } ${
              isCompact
                ? itemsCount > 4
                  ? "w-10 h-10 p-0.5"
                  : "w-12 h-12 p-1"
                : itemsCount > 4
                ? "w-14 h-14 p-1"
                : "w-20 h-20 p-2"
            }`}
          >
            <span
              className={
                isCompact
                  ? itemsCount > 4
                    ? "text-xs"
                    : "text-base"
                  : itemsCount > 4
                  ? "text-lg"
                  : "text-2xl"
              }
            >
              {color.emoji}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold font-mono text-slate-900 text-center truncate max-w-full">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
