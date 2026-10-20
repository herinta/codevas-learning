"use client";

import React, { useState, useEffect, use, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  Star,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Eye,
  Rocket,
  Loader2,
  Zap,
  BookOpen,
  AlertCircle,
  WifiOff,
  LogOut,
  RefreshCw,
  HelpCircle,
  Target,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useDailyTargetTracker } from "@/lib/hooks/use-daily-target-tracker";

interface ChallengeData {
  id: string;
  class_id: string;
  title: string;
  difficulty?: string;
  order_index?: number;
  instruction: string;
  theory?: string | null;
  syntax_helpers?: string[];
  hint: string | null;
  xp_reward: number;
  initial_state: string;
  codeSnapshot?: string;
  locked_template?: {
    element?: string;
    itemsCount?: number;
    itemLabels?: string[];
  };
  target_visual?: {
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: string;
    description?: string;
  };
}

/**
 * Live flexible CSS goal evaluator for real-time validation without needing a submit button!
 */

function evaluateLiveGoals(
  challengeId: string,
  cssCode: string
): {
  passed: boolean;
  goals: { label: string; passed: boolean }[];
} {
  const normalized = cssCode.toLowerCase().replace(/\s+/g, " ");

  // ================= HTML ARCHITECTURE LEVELS 1-12 =================
  if (challengeId === "html-1-raw-content") {
    const hasH1 = /<h1[^>]*>[\s\S]*Profil Saya[\s\S]*<\/h1>/i.test(cssCode);
    return {
      passed: hasH1,
      goals: [{ label: "<h1>Profil Saya</h1>", passed: hasH1 }],
    };
  }

  if (challengeId === "html-2-paragraph") {
    const hasH1 = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]+<\/p>/i.test(cssCode);
    return {
      passed: hasH1 && hasP,
      goals: [
        { label: "Judul <h1>Profil Saya</h1>", passed: hasH1 },
        { label: "Paragraf <p> deskripsi dirimu", passed: hasP },
      ],
    };
  }

  if (challengeId === "html-3-first-box") {
    const hasDiv = /<div[^>]*>[\s\S]*<h1[\s\S]*<p[\s\S]*<\/div>/i.test(cssCode);
    const hasBothTags = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode) && /<p[^>]*>[\s\S]*<\/p>/i.test(cssCode);
    const passed = hasDiv && hasBothTags;
    return {
      passed,
      goals: [
        { label: "<div> pembungkus (Parent container)", passed: hasDiv },
        { label: "Nesting: <h1> dan <p> di dalam <div>", passed: hasBothTags && hasDiv },
      ],
    };
  }

  if (challengeId === "html-4-siblings") {
    const divs = cssCode.match(/<div[^>]*>[\s\S]*?<\/div>/gi);
    const hasTwoDivs = Boolean(divs && divs.length >= 2);
    return {
      passed: hasTwoDivs,
      goals: [
        { label: "<div> pertama untuk blok atas", passed: Boolean(divs && divs.length >= 1) },
        { label: "<div> kedua sejajar (Sibling)", passed: hasTwoDivs },
      ],
    };
  }

  if (challengeId === "html-5-matryoshka") {
    const hasParentAndChildren = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<\/div>/i.test(cssCode);
    return {
      passed: hasParentAndChildren,
      goals: [
        { label: "Satu <div> Parent pembungkus utama", passed: /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode) },
        { label: "Dua <div> Child di dalam Parent (Nesting)", passed: hasParentAndChildren },
      ],
    };
  }

  if (challengeId === "html-6-image-element") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasSrc = /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(cssCode);
    return {
      passed: hasImg && hasSrc,
      goals: [
        { label: "Tag <img> self-closing", passed: hasImg },
        { label: "Atribut src dengan link gambar", passed: hasSrc },
      ],
    };
  }

  if (challengeId === "html-7-action-button") {
    const hasButton = /<button[^>]*>[\s\S]*Follow[\s\S]*<\/button>/i.test(cssCode);
    return {
      passed: hasButton,
      goals: [{ label: "Tag <button> dengan teks 'Follow'", passed: hasButton }],
    };
  }

  if (challengeId === "html-8-link") {
    const hasLink = /<a\b[^>]*\bhref\s*=\s*["'][^"']+["'][^>]*>[\s\S]+<\/a>/i.test(cssCode);
    return {
      passed: hasLink,
      goals: [{ label: "Tag <a> dengan atribut href", passed: hasLink }],
    };
  }

  if (challengeId === "html-9-list-hierarchy") {
    const hasUl = /<ul[^>]*>[\s\S]*<\/ul>/i.test(cssCode);
    const hasLi = /<ul[^>]*>[\s\S]*<li[^>]*>[\s\S]*?<\/li>[\s\S]*<\/ul>/i.test(cssCode);
    return {
      passed: hasUl && hasLi,
      goals: [
        { label: "Pembungkus daftar <ul>", passed: hasUl },
        { label: "Item daftar <li> di dalam <ul>", passed: hasLi },
      ],
    };
  }

  if (challengeId === "html-10-semantic-touch") {
    const hasSection = /<section[^>]*>[\s\S]+<\/section>/i.test(cssCode);
    return {
      passed: hasSection,
      goals: [{ label: "Tag semantik <section> sebagai pembungkus", passed: hasSection }],
    };
  }

  if (challengeId === "html-11-form-wrapper") {
    const hasForm = /<form[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasInput = /<form[^>]*>[\s\S]*<input\b[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasButton = /<form[^>]*>[\s\S]*<button\b[^>]*>[\s\S]*<\/button>[\s\S]*<\/form>/i.test(cssCode);
    return {
      passed: hasForm && hasInput && hasButton,
      goals: [
        { label: "Wadah formulir <form>", passed: hasForm },
        { label: "Elemen input <input>", passed: hasInput },
        { label: "Tombol aksi <button>", passed: hasButton },
      ],
    };
  }

  if (challengeId === "html-12-boss-card") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasInnerDiv = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*<\/div>[\s\S]*<\/div>/i.test(cssCode);
    const hasHead = /<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]*?<\/p>/i.test(cssCode);
    const hasBtn = /<button[^>]*>[\s\S]*?<\/button>/i.test(cssCode);
    const passed = hasImg && hasInnerDiv && hasHead && hasP && hasBtn;
    return {
      passed,
      goals: [
        { label: "<div> Parent utama Profile Card", passed: /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode) },
        { label: "Tag <img /> Avatar foto", passed: hasImg },
        { label: "<div> Child pembungkus teks", passed: hasInnerDiv },
        { label: "Elemen <h2>, <p>, dan <button>", passed: hasHead && hasP && hasBtn },
      ],
    };
  }

  // ================= CSS BASICS (12 Levels) =================
  if (challengeId === "css-basics-1-background-color") {
    const passed = /background-color\s*:\s*(lightblue|#add8e6|rgb\(\s*173\s*,\s*216\s*,\s*230\s*\)|sky-?blue|#38bdf8|#60a5fa)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "background-color: lightblue;", passed }],
    };
  }

  if (challengeId === "css-basics-2-text-color") {
    const passed = /color\s*:\s*(#333|#333333|black|#000|#000000|rgb\(\s*51\s*,\s*51\s*,\s*51\s*\)|#1e293b|#0f172a)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "color: #333;", passed }],
    };
  }

  if (challengeId === "css-basics-3-font-size") {
    const passed = /font-size\s*:\s*(24px|1\.5rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-size: 24px;", passed }],
    };
  }

  if (challengeId === "css-basics-4-font-weight") {
    const passed = /font-weight\s*:\s*(bold|700|800|900)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-weight: bold;", passed }],
    };
  }

  if (challengeId === "css-basics-5-font-style") {
    const passed = /font-style\s*:\s*italic/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-style: italic;", passed }],
    };
  }

  if (challengeId === "css-basics-6-text-align") {
    const passed = /text-align\s*:\s*center/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "text-align: center;", passed }],
    };
  }

  if (challengeId === "css-basics-7-padding") {
    const passed = /padding\s*:\s*(20px|1\.25rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "padding: 20px;", passed }],
    };
  }

  if (challengeId === "css-basics-8-margin") {
    const passed = /margin\s*:\s*(15px|16px|1rem|20px)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "margin: 15px;", passed }],
    };
  }

  if (challengeId === "css-basics-9-border") {
    const passed = /border\s*:\s*2px\s+solid/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border: 2px solid black;", passed }],
    };
  }

  if (challengeId === "css-basics-10-border-radius") {
    const passed = /border-radius\s*:\s*(12px|0\.75rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border-radius: 12px;", passed }],
    };
  }

  if (challengeId === "css-basics-11-box-shadow") {
    const passed = /box-shadow\s*:\s*0px?\s+4px?\s+10px?/i.test(cssCode) || /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "box-shadow: 0px 4px 10px rgba(0,0,0,0.1);", passed }],
    };
  }

  if (challengeId === "css-basics-12-boss-fight") {
    const g1 = /background(-color)?\s*:\s*(#ef4444|red|#dc2626|#f87171)/i.test(cssCode);
    const g2 = /color\s*:\s*(white|#fff|#ffffff)/i.test(cssCode);
    const g3 = /padding\s*:\s*8px\s+16px/i.test(cssCode) || /padding\s*:\s*(8px|16px|12px|10px)/i.test(cssCode);
    const g4 = /border-radius\s*:\s*(999px|9999px|50px|50%|24px)/i.test(cssCode);
    return {
      passed: g1 && g2 && g3 && g4,
      goals: [
        { label: "background-color: #ef4444;", passed: g1 },
        { label: "color: white;", passed: g2 },
        { label: "padding: 8px 16px;", passed: g3 },
        { label: "border-radius: 999px;", passed: g4 },
      ],
    };
  }

  // ================= CSS FLEXBOX (12 Levels) =================
  if (challengeId === "flexbox-1-activation" || challengeId === "fb-1") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "display: flex;", passed: g1 }],
    };
  }

  if (challengeId === "flexbox-2-push-justify-end" || challengeId === "fb-2") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*(flex-end|end)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: flex-end;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-3-center-stage" || challengeId === "fb-3") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: center;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-4-split-space-between" || challengeId === "fb-4") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*space-between/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: space-between;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-5-social-distancing" || challengeId === "fb-5") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*(space-evenly|space-around)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: space-evenly;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-6-gravity-align-items" || challengeId === "fb-6") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /align-items\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "align-items: center;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-7-floor-align-end" || challengeId === "fb-7") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /align-items\s*:\s*(flex-end|end)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "align-items: flex-end;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-8-column-direction" || challengeId === "fb-8") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-direction\s*:\s*column\b/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "flex-direction: column;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-9-gap" || challengeId === "fb-9") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /gap\s*:\s*(20px|1\.25rem)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "gap: 20px;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-10-overflow-wrap" || challengeId === "fb-10") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-wrap\s*:\s*wrap\b/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "flex-wrap: wrap;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-11-perfect-center" || challengeId === "fb-11") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    const g3 = /align-items\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: center;", passed: g2 },
        { label: "align-items: center;", passed: g3 },
      ],
    };
  }

  if (challengeId === "flexbox-12-boss-modern-navbar" || challengeId === "fb-12") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*space-between/.test(normalized);
    const g3 = /align-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: space-between;", passed: g2 },
        { label: "align-items: center;", passed: g3 },
      ],
    };
  }

  // ================= CSS GRID (12 Levels) =================
  if (challengeId === "grid-1-blueprint" || challengeId === "gr-1" || challengeId === "grid-1-two-columns") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /grid-template-columns\s*:\s*(1fr\s+1fr|repeat\(\s*2\s*,\s*1fr\s*\)|50%\s+50%)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "grid-template-columns: 1fr 1fr;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-2-triplets" || challengeId === "gr-2") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /grid-template-columns\s*:\s*(repeat\(\s*3\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "grid-template-columns: repeat(3, 1fr);", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-3-asymmetry" || challengeId === "gr-3") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /grid-template-columns\s*:\s*(250px\s+1fr|250px\s+auto)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "grid-template-columns: 250px 1fr;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-4-alleyway" || challengeId === "gr-4") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /gap\s*:\s*(24px|1\.5rem)/.test(normalized) || /grid-gap\s*:\s*24px/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "gap: 24px;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-5-header-expansion" || challengeId === "gr-5") {
    const g1 = /grid-column\s*:\s*(span\s*3|1\s*\/\s*(4|-1))/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-column: span 3;", passed: g1 }],
    };
  }

  if (challengeId === "grid-6-tower-expansion" || challengeId === "gr-6") {
    const g1 = /grid-row\s*:\s*(span\s*2|1\s*\/\s*3)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-row: span 2;", passed: g1 }],
    };
  }

  if (challengeId === "grid-7-absolute-placement" || challengeId === "gr-7") {
    const g1 = /grid-column\s*:\s*(1\s*\/\s*3|1\s*\/\s*span\s*2)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-column: 1 / 3;", passed: g1 }],
    };
  }

  if (challengeId === "grid-8-grid-center" || challengeId === "gr-8") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 =
      /place-items\s*:\s*center/.test(normalized) ||
      (/justify-items\s*:\s*center/.test(normalized) && /align-items\s*:\s*center/.test(normalized));
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "place-items: center;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-9-responsive-magic" || challengeId === "gr-9") {
    const g1 = /grid-template-columns\s*:\s*repeat\(\s*(auto-fit|auto-fill)\s*,\s*minmax\(\s*200px\s*,\s*1fr\s*\)\)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));", passed: g1 }],
    };
  }

  if (challengeId === "grid-10-grid-areas" || challengeId === "gr-10") {
    const g1 = /grid-area\s*:\s*header\b/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-area: header;", passed: g1 }],
    };
  }

  if (challengeId === "grid-11-inception" || challengeId === "gr-11") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "display: flex; (di dalam kartu)", passed: g1 }],
    };
  }

  if (challengeId === "grid-12-boss-bento-dashboard" || challengeId === "gr-12") {
    const g1 = /grid-template-columns\s*:\s*(repeat\(\s*4\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr\s+1fr)/.test(normalized);
    const g2 = /grid-column\s*:\s*span\s*2/.test(normalized) || /grid-row\s*:\s*span\s*2/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "grid-template-columns: repeat(4, 1fr);", passed: g1 },
        { label: "grid-column: span 2; (pada .card-1)", passed: g2 },
      ],
    };
  }

  return { passed: false, goals: [] };
}

// Known valid CSS values for anti-flicker live parsing
const VALID_PROPERTIES: Record<string, RegExp> = {
  display: /^(flex|inline-flex|grid|inline-grid|block|inline-block|none)$/i,
  justifyContent: /^(center|space-between|space-around|space-evenly|flex-start|flex-end|start|end|left|right)$/i,
  alignItems: /^(center|flex-start|flex-end|stretch|baseline|start|end)$/i,
  flexDirection: /^(row|row-reverse|column|column-reverse)$/i,
  flexWrap: /^(wrap|nowrap|wrap-reverse)$/i,
  gap: /^(\d+(\.\d+)?(px|rem|em|%)?(\s+\d+(\.\d+)?(px|rem|em|%)?)?)$/i,
  alignSelf: /^(auto|flex-start|flex-end|center|baseline|stretch|start|end)$/i,
  order: /^-?\d+$/i,
  flexGrow: /^\d+$/i,
  flexShrink: /^\d+$/i,
  gridTemplateColumns: /^.+$/i,
  gridTemplateRows: /^.+$/i,
  gridColumn: /^.+$/i,
  gridRow: /^.+$/i,
  gridArea: /^.+$/i,
  placeItems: /^.+$/i,
  justifyItems: /^.+$/i,
  backgroundColor: /^.+$/i,
  color: /^.+$/i,
  fontSize: /^.+$/i,
  fontWeight: /^(normal|bold|bolder|lighter|\d{3})$/i,
  fontStyle: /^(normal|italic|oblique)$/i,
  textAlign: /^(left|right|center|justify)$/i,
  padding: /^.+$/i,
  margin: /^.+$/i,
  border: /^.+$/i,
  borderRadius: /^.+$/i,
  boxShadow: /^.+$/i,
  width: /^.+$/i,
  height: /^.+$/i,
};

/**
 * Deterministically shuffles options so the correct answer is NEVER placed at index 0,
 * and options do not re-shuffle or jitter between keystrokes.
 */
function getShuffledHelpers(helpers: string[] | undefined, seedKey: string): string[] {
  if (!helpers || helpers.length <= 1) return helpers || [];
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) & 0xffffffff;
  }
  const result = [...helpers];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Ensure the original first item (answer) is NEVER at index 0 if multiple items exist
  if (result[0] === helpers[0] && result.length > 1) {
    const swapIdx = (Math.abs(seed) % (result.length - 1)) + 1;
    [result[0], result[swapIdx]] = [result[swapIdx], result[0]];
  }
  return result;
}

/**
 * Robust, anti-flicker CSS style parser that maps styles directly to React inline styles for silky smooth 60fps reactivity
 */
function parseUserStyles(css: string): {
  arenaStyle: React.CSSProperties;
  itemStyles: Record<string, React.CSSProperties>;
} {
  const arenaStyle: Record<string, string> = {};
  const itemStyles: Record<string, Record<string, string>> = {};

  try {
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let hasRules = false;
    let match: RegExpExecArray | null;

    const sanitizeDeclaration = (prop: string, val: string): { key: string; value: string } | null => {
      const cleanProp = prop.trim();
      const cleanVal = val.trim();
      if (!cleanProp || !cleanVal) return null;

      const camelProp = cleanProp.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      const validator = VALID_PROPERTIES[camelProp];
      if (validator && !validator.test(cleanVal)) {
        // While user is mid-keystroke, ignore partial invalid value to prevent flickering
        return null;
      }
      return { key: camelProp, value: cleanVal };
    };

    while ((match = ruleRegex.exec(css)) !== null) {
      hasRules = true;
      const selector = match[1].trim();
      const declarations = match[2].trim();
      const declObj: Record<string, string> = {};

      declarations.split(";").forEach((rule) => {
        const [prop, val] = rule.split(":");
        if (prop && val) {
          const sanitized = sanitizeDeclaration(prop, val);
          if (sanitized) {
            declObj[sanitized.key] = sanitized.value;
          }
        }
      });

      if (
        selector.includes(".arena") ||
        selector === "arena" ||
        selector.includes(".grid-arena") ||
        selector === "grid-arena" ||
        selector.includes(".navbar") ||
        selector === "navbar" ||
        selector.includes(".box") ||
        selector === "box" ||
        selector.includes(".badge") ||
        selector === "badge" ||
        selector === "*"
      ) {
        Object.assign(arenaStyle, declObj);
        itemStyles["box"] = { ...(itemStyles["box"] || {}), ...declObj };
      } else if (selector.includes(".header") || selector === "header") {
        itemStyles["header"] = { ...(itemStyles["header"] || {}), ...declObj };
      } else if (selector.includes(".sidebar") || selector === "sidebar") {
        itemStyles["sidebar"] = { ...(itemStyles["sidebar"] || {}), ...declObj };
      } else {
        const itemMatch = selector.match(/\.(permen|card)-?([0-9]+)/);
        if (itemMatch) {
          const key = `item-${itemMatch[2]}`;
          itemStyles[key] = { ...(itemStyles[key] || {}), ...declObj };
          itemStyles[`card-${itemMatch[2]}`] = { ...(itemStyles[`card-${itemMatch[2]}`] || {}), ...declObj };
        }
      }
    }


    // If user writes without .arena { ... }, parse directly into arena
    if (!hasRules && css.trim()) {
      css.split(";").forEach((rule) => {
        const [prop, val] = rule.split(":");
        if (prop && val) {
          const sanitized = sanitizeDeclaration(prop, val);
          if (sanitized) {
            arenaStyle[sanitized.key] = sanitized.value;
          }
        }
      });
    }
  } catch (err) {
    console.error("CSS Parse Error:", err);
  }

  return { arenaStyle, itemStyles };
}

function ChallengePlaygroundContent({
  params,
}: {
  params: Promise<{ id: string; challengeId: string }>;
}) {
  const { id: classId, challengeId } = use(params);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [cssCode, setCssCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<"mission" | "arena" | "editor" | "all">("editor");
  // Target belajar harian hanya aktif berdetik di halaman workspace belajar ini
  const dailyTarget = useDailyTargetTracker({ activeMode: true });

  // Auto-sync state when passed
  const [hasSavedPass, setHasSavedPass] = useState(false);
  const [nextChallengeId, setNextChallengeId] = useState<string | null>(null);
  const [isClassCompleted, setIsClassCompleted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleNextLevel = () => {
    if (nextChallengeId) {
      router.push(`/classes/${classId}/learn/${nextChallengeId}`);
    } else {
      router.push(`/classes/${classId}`);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [earnedXpInfo, setEarnedXpInfo] = useState<{
    earnedXp: number;
    leveledUp: boolean;
    level: number;
    rankTitle: string;
    newTotalXp?: number;
  } | null>(null);

  // Load challenge info dynamically from API
  const loadData = React.useCallback(async () => {
    setLoading(true);
    setHasSavedPass(false);
    setNextChallengeId(null);
    setIsClassCompleted(false);
    setSaveError(null);
    setLoadError(null);
    setEarnedXpInfo(null);

    try {
      const res = await fetch(`/api/challenges/${challengeId}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const found = json.data;
          setChallenge(found);
          setCssCode(
            found.codeSnapshot ||
              found.initial_state ||
              (found.class_id === "html-architecture" || found.id.startsWith("html-")
                ? "<!-- Tulis tag HTML di sini -->"
                : found.class_id === "css-grid" || found.id.startsWith("grid-") || found.id.startsWith("gr-")
                ? `.grid-arena {\n  display: grid;\n  /* Tulis CSS Grid di sini */\n}`
                : found.id === "flexbox-12-boss-modern-navbar" || found.id === "fb-12"
                ? `.navbar {\n  /* Tulis CSS Flexbox di sini */\n}`
                : `.arena {\n  /* Tulis CSS Flexbox di sini */\n}`)
          );
        } else {
          setLoadError(json.message || "Tantangan tidak ditemukan.");
        }
      } else {
        setLoadError(`Gagal memuat tantangan (Status ${res.status}).`);
      }
    } catch (err) {
      console.error("Gagal memuat tantangan:", err);
      setLoadError("Koneksi gagal saat memuat tantangan. Periksa jaringan Anda.");
    } finally {
      setLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isHtmlMode =
    challenge?.class_id === "html-architecture" || challengeId.startsWith("html-");
  const isCssBasicsMode =
    challenge?.class_id === "css-basics" || challengeId.startsWith("css-basics-");
  const isNavbarMode =
    challengeId === "flexbox-12-boss-modern-navbar" || challengeId === "fb-12";
  const isGridMode =
    challenge?.class_id === "css-grid" || challengeId.startsWith("grid-") || challengeId.startsWith("gr-");
  const isBentoMode =
    challengeId === "grid-12-boss-bento-dashboard" || challengeId === "gr-12";
  const isGridHeaderMode =
    challengeId === "grid-5-header-expansion" || challengeId === "gr-5" ||
    challengeId === "grid-7-absolute-placement" || challengeId === "gr-7" ||
    challengeId === "grid-10-grid-areas" || challengeId === "gr-10";
  const isGridSidebarMode =
    challengeId === "grid-6-tower-expansion" || challengeId === "gr-6";

  // Deterministically shuffled helpers so the correct answer is NEVER placed at index 0 (top/first)
  const shuffledHelpers = useMemo(() => {
    return getShuffledHelpers(challenge?.syntax_helpers, challenge?.id || challengeId);
  }, [challenge?.syntax_helpers, challenge?.id, challengeId]);


  // Sanitized HTML for safe real-time 60 FPS arena preview (comprehensive XSS, event-handler, & script injection protection)
  const sanitizedUserHtml = useMemo(() => {
    if (!cssCode) return "";
    return cssCode
      // Strip dangerous tags completely
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      .replace(/<link\b[^>]*>/gi, "")
      .replace(/<meta\b[^>]*>/gi, "")
      .replace(/<base\b[^>]*>/gi, "")
      // Strip all event handlers: quoted ("..."), single-quoted ('...'), and UNQUOTED (onerror=alert(1))
      .replace(/\bon[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      // Strip dangerous pseudo-protocols
      .replace(/(javascript|vbscript|data):/gi, "")
      // Strip autofocus to prevent focus-trap / event escalation
      .replace(/\bautofocus\b/gi, "");
  }, [cssCode]);

  // Real-time Live Evaluation as user types (instant reactivity)
  const liveEval = useMemo(() => {
    return evaluateLiveGoals(challengeId, cssCode);
  }, [challengeId, cssCode]);

  // Real-time Style Parsing for the Live Arena
  const { arenaStyle, itemStyles } = useMemo(() => {
    return parseUserStyles(cssCode);
  }, [cssCode]);

  // Scoped CSS tag for extra browser cascade support
  const scopedCss = useMemo(() => {
    if (!cssCode) return "";
    return cssCode
      .replace(/\.arena\b/g, "#live-arena, .arena")
      .replace(/\.box\b/g, "#live-arena .box, .box")
      .replace(/\.badge\b/g, "#live-arena .badge, .badge")
      .replace(/\.navbar\b/g, "#live-arena, .navbar")
      .replace(/\.grid-arena\b/g, "#live-arena, .grid-arena")
      .replace(/\.header\b/g, "#live-arena .grid-header, .header")
      .replace(/\.sidebar\b/g, "#live-arena .grid-sidebar, .sidebar")
      .replace(/\.permen-([0-9]+)\b/g, "#live-arena .permen-$1")
      .replace(/\.card-([0-9]+)\b/g, "#live-arena .card-$1");
  }, [cssCode]);


  // Robust function to save progress with error handling & retry
  const saveProgress = React.useCallback(async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/challenges/${challengeId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cssCode }),
      });

      if (res.status === 401) {
        setSessionExpired(true);
        setHasSavedPass(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal menyimpan progress ke server");
      }

      const data = await res.json();
      if (data.passed) {
        setHasSavedPass(true);
        setNextChallengeId(data.nextChallengeId);
        setIsClassCompleted(Boolean(data.isClassCompleted));
        setEarnedXpInfo({
          earnedXp: data.earnedXp ?? challenge?.xp_reward ?? 20,
          leveledUp: Boolean(data.leveledUp),
          level: data.level ?? user?.level ?? 1,
          rankTitle: data.rankTitle ?? user?.rank_title ?? "Siswa Pemula",
          newTotalXp: data.newTotalXp,
        });
        refreshUser();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("codevas:progress-updated"));
          try {
            localStorage.setItem("codevas:progress-synced", Date.now().toString());
          } catch {}
        }
      }
    } catch (err) {
      console.error("Error auto-saving progress:", err);
      setSaveError("Gagal menyimpan progress ke server. Periksa koneksi Anda.");
      setHasSavedPass(false);
    } finally {
      setIsSaving(false);
    }
  }, [user, isSaving, challengeId, cssCode, refreshUser]);

  // Automatically save progress in the background the moment all goals are fulfilled
  useEffect(() => {
    if (liveEval.passed && !hasSavedPass && user && !saveError) {
      saveProgress();
    }
  }, [liveEval.passed, hasSavedPass, user, saveError, saveProgress]);

  // Mini Confetti canvas refs for desktop and mobile
  const confettiCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasMobileRef = React.useRef<HTMLCanvasElement | null>(null);

  const fireMiniConfetti = React.useCallback(() => {
    const canvas =
      typeof window !== "undefined" && window.innerWidth < 1024
        ? confettiCanvasMobileRef.current || confettiCanvasRef.current
        : confettiCanvasRef.current || confettiCanvasMobileRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    // Set canvas dimensions to right panel container size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = ["#ec4899", "#f59e0b", "#10b981", "#6366f1", "#06b6d4", "#fbbf24", "#e11d48"];
    const particlesCount = 42;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      alpha: number;
      shape: "rect" | "circle";
    }> = [];

    // Burst from bottom center of the right action panel
    const startX = canvas.width / 2;
    const startY = canvas.height - 80;

    for (let i = 0; i < particlesCount; i++) {
      const speed = 4 + Math.random() * 7;
      particles.push({
        x: startX + (Math.random() - 0.5) * 80,
        y: startY,
        vx: (Math.random() - 0.5) * 8,
        vy: -speed - 2,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.rotationSpeed;
        if (elapsed > 900) {
          p.alpha = Math.max(0, 1 - (elapsed - 900) / 900);
        }

        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 2000) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrameId = requestAnimationFrame(render);
  }, []);

  // Trigger mini confetti only when transitioning from false -> true
  const prevPassedRef = React.useRef(false);
  useEffect(() => {
    if (liveEval.passed && !prevPassedRef.current) {
      fireMiniConfetti();
    }
    prevPassedRef.current = liveEval.passed;
  }, [liveEval.passed, fireMiniConfetti]);

  // Check if a snippet is already present in user's CSS/HTML
  const isHelperActive = (snippet: string, code: string): boolean => {
    const clean = snippet.trim().replace(/;$/, "");
    if (clean.startsWith("<")) {
      if (clean === "<div> ... </div>") {
        return /<div[^>]*>[\s\S]*<\/div>/i.test(code);
      }
      if (clean.startsWith("<img")) {
        return /<img\b/i.test(code);
      }
      const tagMatch = clean.match(/^<([a-z0-9]+)/i);
      if (tagMatch) {
        return new RegExp(`<${tagMatch[1]}\\b`, "i").test(code);
      }
      return code.toLowerCase().includes(clean.toLowerCase());
    }
    if (clean.includes(":")) {
      const [prop, val] = clean.split(":").map((s) => s.trim());
      const escapedVal = val.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b${prop}\\s*:\\s*${escapedVal}\\b`, "i");
      return regex.test(code);
    }
    if (clean.startsWith(".")) {
      const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`${escaped}\\b`, "i").test(code);
    }
    return code.toLowerCase().includes(clean.toLowerCase());
  };

  // Toggle helper: Click once to insert, click again to remove cleanly (no stacking/spam)
  const handleToggleHelper = (snippet: string) => {
    const clean = snippet.trim().replace(/;$/, "");

    setCssCode((prev) => {
      // 0. If snippet is an HTML tag (e.g. "<h1>Profil Saya</h1>" or "<div> ... </div>")
      if (clean.startsWith("<")) {
        if (clean === "<div> ... </div>") {
          const trimmed = prev.trim();
          if (trimmed.startsWith("<div>") && trimmed.endsWith("</div>")) {
            return trimmed.replace(/^<div>\s*/, "").replace(/\s*<\/div>$/, "");
          }
          return `<div>\n  ${trimmed}\n</div>`;
        }

        const tagMatch = clean.match(/^<([a-z0-9]+)/i);
        const tagName = tagMatch ? tagMatch[1] : "";

        // If exact snippet exists -> TOGGLE OFF (REMOVE)
        if (prev.includes(clean)) {
          return prev.replace(clean, "").trim();
        }

        // If tag already exists -> replace tag block
        if (tagName && tagName !== "div" && tagName !== "img" && new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "i").test(prev)) {
          return prev.replace(new RegExp(`\\s*<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "i"), "").trim();
        }

        // If there is an HTML comment placeholder like <!-- ... -->, replace it!
        if (/<!--[\s\S]*?-->/.test(prev)) {
          return prev.replace(/<!--[\s\S]*?-->/, clean).trim();
        }

        return prev ? `${prev}\n${clean}` : clean;
      }

      // 1. If snippet is a CSS declaration (e.g. "display: flex" or "justify-content: center")
      if (clean.includes(":")) {
        const [prop, val] = clean.split(":").map((s) => s.trim());
        const escapedVal = val.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        const exactRegex = new RegExp(`[\\t ]*${prop}\\s*:\\s*${escapedVal}\\s*;?\\n?`, "gi");

        // If EXACT declaration already exists -> TOGGLE OFF (REMOVE)
        if (exactRegex.test(prev)) {
          return prev.replace(exactRegex, "").replace(/\n{3,}/g, "\n\n");
        }

        // If the same property already exists with another value -> REPLACE IT (no stacking/spam)
        const samePropRegex = new RegExp(`${prop}\\s*:\\s*[^;\\n]+;?`, "i");
        if (samePropRegex.test(prev)) {
          return prev.replace(samePropRegex, `${prop}: ${val};`);
        }

        // Otherwise -> INSERT into matching container rule or append
        if (prev.includes(".grid-arena {")) {
          return prev.replace(".grid-arena {", `.grid-arena {\n  ${clean};`);
        }
        if (prev.includes(".navbar {")) {
          return prev.replace(".navbar {", `.navbar {\n  ${clean};`);
        }
        if (prev.includes(".arena {")) {
          return prev.replace(".arena {", `.arena {\n  ${clean};`);
        }
        if (prev.includes(".header {")) {
          return prev.replace(".header {", `.header {\n  ${clean};`);
        }
        if (prev.includes(".sidebar {")) {
          return prev.replace(".sidebar {", `.sidebar {\n  ${clean};`);
        }
        return `${prev}\n${clean};`;
      }

      // 2. If snippet is a selector (e.g. ".card-2", ".permen-2", ".header", etc.)
      if (clean.startsWith(".")) {
        const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        const blockRegex = new RegExp(`\\n*${escaped}\\s*\\{[^}]*\\}`, "gi");
        if (blockRegex.test(prev)) {
          return prev.replace(blockRegex, "").replace(/\n{3,}/g, "\n\n");
        }
        const defaultProp =
          clean.includes("header")
            ? "grid-column: span 3;"
            : clean.includes("sidebar")
            ? "grid-row: span 2;"
            : clean.includes("3")
            ? "order: -1;"
            : "align-self: flex-end;";
        return `${prev}\n\n${clean} {\n  ${defaultProp}\n}`;
      }

      // 3. Fallback toggle
      if (prev.includes(clean)) {
        return prev.replace(clean, "").replace(/\n{3,}/g, "\n\n");
      }
      return `${prev}\n${clean};`;
    });
  };

  const handleReset = () => {
    if (challenge) {
      setCssCode(challenge.initial_state);
      setHasSavedPass(false);
    }
  };

  // Item configurations
  const itemsCount = challenge?.locked_template?.itemsCount || 3;
  const itemLabels = challenge?.locked_template?.itemLabels || [
    "🍬 Permen 1",
    "🍭 Permen 2",
    "🍫 Permen 3",
  ];

  const palette = [
    { bg: "bg-pink-100", border: "border-pink-900", text: "text-pink-950", emoji: "🍬" },
    { bg: "bg-purple-100", border: "border-purple-900", text: "text-purple-950", emoji: "🍭" },
    { bg: "bg-amber-100", border: "border-amber-900", text: "text-amber-950", emoji: "🍫" },
    { bg: "bg-sky-100", border: "border-sky-900", text: "text-sky-950", emoji: "⭐" },
    { bg: "bg-emerald-100", border: "border-emerald-900", text: "text-emerald-950", emoji: "💎" },
    { bg: "bg-rose-100", border: "border-rose-900", text: "text-rose-950", emoji: "🍩" },
  ];

  // Target visual goal styles
  const targetVisual = challenge?.target_visual || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#EF4444] animate-spin" />
        <p className="font-display font-black text-sm text-slate-900">
          Memuat Workspace Pembelajaran...
        </p>
      </div>
    );
  }

  if (loadError || !challenge) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-100 border-3 border-slate-900 flex items-center justify-center text-red-600 shadow-[0_4px_0_#0f172a]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-display font-black text-slate-900">
          {loadError ? "Gagal Memuat Tantangan" : "Tantangan Tidak Ditemukan"}
        </h2>
        <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
          {loadError || "Soal tantangan tidak ditemukan di server. Periksa koneksi internet Anda atau kembali ke silabus kelas."}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => loadData()}
            className="px-4 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Muat Ulang</span>
          </button>
          <Link
            href={`/classes/${classId}`}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white font-display font-black text-xs hover:bg-slate-50 shadow-[0_2px_0_#0f172a] text-slate-900"
          >
            Kembali ke Kelas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col">
      {/* Scoped Dynamic Styles for Live Arena with Spring Glide Animations */}
      <style>{`
        #live-arena {
          box-sizing: border-box;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        #live-arena > div {
          transition: all 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) !important;
          will-change: transform, margin, flex, order, align-self;
        }
        @keyframes tutorial-blink {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.04);
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
          }
        }
        .blinking-tutorial-choice {
          animation: tutorial-blink 1.2s infinite ease-in-out;
        }
        .html-live-sandbox h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .html-live-sandbox h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .html-live-sandbox p {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }
        .html-live-sandbox div {
          border: 2px dashed #3b82f6;
          background-color: rgba(239, 246, 255, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox section {
          border: 2px dashed #8b5cf6;
          background-color: rgba(245, 243, 255, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox form {
          border: 2px dashed #10b981;
          background-color: rgba(236, 253, 245, 0.4);
          padding: 12px;
          margin: 6px 0;
          border-radius: 12px;
        }
        .html-live-sandbox button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          background-color: #2563eb;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          margin-top: 4px;
        }
        .html-live-sandbox a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 600;
          font-size: 14px;
        }
        .html-live-sandbox input {
          border: 2px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-right: 8px;
        }
        .html-live-sandbox ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 6px 0;
        }
        .html-live-sandbox li {
          font-size: 13px;
          color: #334155;
          margin-bottom: 2px;
        }
        .html-live-sandbox img {
          max-width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 8px;
          border: 2px solid #e2e8f0;
        }
        ${scopedCss}
      `}</style>

      {/* Top Bar Navigation */}
      <header className="w-full bg-white border-b-3 border-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/classes/${classId}`}
            className="p-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 shadow-[0_2px_0_#0f172a] transition-all active:translate-y-0.5 cursor-pointer"
            title="Kembali ke Silabus"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black text-slate-500 tracking-wider uppercase">
                LEVEL {challenge?.order_index || 1} / 12
              </span>
              {challenge?.difficulty && (
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full border-2 border-slate-900 bg-[#FEF08A] text-slate-900 shadow-[0_1px_0_#0f172a]">
                  {challenge.difficulty}
                </span>
              )}
            </div>
            <h1 className="font-display font-black text-sm sm:text-base text-slate-900 truncate max-w-xs sm:max-w-md">
              {challenge?.title || "Level"}
            </h1>
          </div>
        </div>

        {/* User Status Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div
            className="flex items-center gap-1 px-2.5 py-1 bg-[#FEF08A] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0"
            title={`Level ${user?.level || 1} • ${user?.rank_title || 'Siswa Pemula'}`}
          >
            <span className="text-[11px] sm:text-xs font-mono font-black text-slate-900">
              Lv.{user?.level || 1}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#FFF3E0] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e65100] fill-[#e65100]" />
            <span className="text-[11px] sm:text-xs font-display font-black text-slate-900">
              {user ? `${(user as any).streak_days || 1}d` : "1d"}
            </span>
          </div>

          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-sky-100 border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0"
            title={`Target Harian: 10 Menit Fokus Belajar (${dailyTarget.percent}% tercapai)`}
          >
            <Target className={`w-3.5 h-3.5 ${dailyTarget.isCompleted ? 'text-emerald-600' : 'text-[#EF4444]'}`} />
            <span className="text-[11px] font-mono font-black text-slate-900">
              {dailyTarget.formattedActive}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#BAE6FD] border-2 border-slate-900 rounded-full shadow-[0_2px_0_#0f172a] shrink-0">
            <Star className="w-4 h-4 text-sky-900 fill-sky-800" />
            <span className="text-xs font-display font-black text-slate-900">
              {user ? `${user.xp_points} XP` : "50 XP"}
            </span>
          </div>

          {/* Quick Profile / Dashboard Avatar */}
          {user ? (
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-[#EF4444] shadow-[0_2px_0_#991b1b] flex items-center justify-center text-xs font-black text-white hover:scale-105 active:translate-y-0.5 transition-transform shrink-0"
              title={`@${user.username} — Profil Pengguna`}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-2.5 py-1 rounded-full text-xs font-display font-black text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-2 border-slate-900 shadow-[0_1px_0_#0f172a]"
            >
              Masuk
            </Link>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE WORKSPACE (Unified 1-Screen: Soal + Preview + Code) */}
      {/* ======================================================== */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 overflow-hidden bg-[#FFFDF7] relative">
        {/* Localized Mini Confetti Canvas for mobile */}
        <canvas
          ref={confettiCanvasMobileRef}
          className="pointer-events-none absolute inset-0 z-30 w-full h-full"
        />

        {/* 1. COMPACT MISSION BANNER */}
        <div className="px-3 py-2 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-2 shrink-0 shadow-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-1.5 py-0.5 rounded-md bg-[#EF4444] text-white font-display font-black text-[10px] shrink-0">
              Lvl {challenge?.order_index || 1}
            </span>
            <p className="text-xs font-bold text-slate-900 truncate leading-tight">
              {challenge?.instruction}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {challenge?.theory && (
              <button
                onClick={() => setShowTheoryModal(true)}
                className="px-2 py-0.5 rounded-lg bg-[#FEF08A] border-2 border-slate-900 text-[10px] font-black text-slate-900 hover:bg-yellow-200 shadow-[0_1px_0_#0f172a] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3 h-3 text-[#EF4444]" />
                <span>Teori</span>
              </button>
            )}
            <span className="text-[10px] font-mono font-black text-amber-950 bg-[#FEF08A] border-2 border-slate-900 px-1.5 py-0.5 rounded-full shadow-[0_1px_0_#0f172a]">
              +{challenge?.xp_reward}XP
            </span>
          </div>
        </div>

        {/* 2. COMPACT LIVE ARENA PREVIEW */}
        <div className="p-2.5 bg-slate-100 border-b-2 border-slate-900 flex flex-col items-center justify-center shrink-0">
          {isHtmlMode ? (
            <div
              id="live-arena"
              className={`arena w-full h-28 sm:h-36 bg-white border-3 rounded-2xl p-2.5 shadow-[0_4px_0_#0f172a] overflow-auto transition-all ${
                liveEval.passed ? "border-emerald-600 ring-4 ring-emerald-300/60" : "border-slate-900"
              }`}
            >
              <div
                className="html-live-sandbox w-full font-body text-xs text-slate-800"
                dangerouslySetInnerHTML={{ __html: sanitizedUserHtml }}
              />
            </div>
          ) : isCssBasicsMode ? (
            <div
              id="live-arena"
              className={`arena w-full h-28 sm:h-36 bg-white border-3 rounded-2xl p-3 shadow-[0_4px_0_#0f172a] overflow-auto flex items-center justify-center transition-all ${
                liveEval.passed ? "border-emerald-600 ring-4 ring-emerald-300/60" : "border-slate-900"
              }`}
            >
              {challengeId === "css-basics-12-boss-fight" ? (
                <span
                  className="badge transition-all inline-block font-mono text-xs font-bold"
                  style={itemStyles["box"] || arenaStyle}
                >
                  🔔 3 Pesan Baru
                </span>
              ) : (
                <div
                  className="box transition-all w-full max-w-xs text-center font-body p-3 bg-white text-slate-800 border-2 border-slate-200 rounded-xl shadow-xs"
                  style={itemStyles["box"] || arenaStyle}
                >
                  <h3 className="font-bold text-sm">Belajar CSS</h3>
                  <p className="text-xs text-slate-600 mt-1">Menguasai box model dan styling visual.</p>
                </div>
              )}
            </div>
          ) : isNavbarMode ? (
            <div
              id="live-arena"
              className={`navbar w-full min-h-[4rem] bg-slate-900 border-3 rounded-2xl p-3 shadow-[0_4px_0_#0f172a] overflow-auto transition-all ${
                liveEval.passed ? "border-emerald-600 ring-4 ring-emerald-300/60" : "border-slate-900"
              }`}
              style={arenaStyle}
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-6 h-6 rounded-lg bg-[#EF4444] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  ⚡
                </span>
                <span className="font-display font-black text-white text-xs tracking-wider">
                  CODEVAS
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-300 hidden sm:inline">
                  Fitur
                </span>
                <button className="px-2 py-0.5 rounded-lg bg-[#EF4444] text-white font-black text-[10px] border border-white/20 shadow-xs">
                  Mulai
                </button>
              </div>
            </div>
          ) : isGridMode ? (
            <div
              id="live-arena"
              className={`grid-arena w-full min-h-[7.5rem] bg-slate-50 border-3 rounded-2xl p-2.5 shadow-[0_4px_0_#0f172a] overflow-auto transition-all ${
                liveEval.passed ? "border-emerald-600 ring-4 ring-emerald-300/60" : "border-slate-900"
              }`}
              style={{ display: "grid", ...arenaStyle }}
            >
              {isBentoMode ? (
                <>
                  <div
                    style={itemStyles["card-1"] || itemStyles["item-1"] || {}}
                    className="card-1 rounded-xl p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-2 border-slate-900 shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">📈</span>
                      <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">+148%</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black leading-tight">Proyeksi Analitik</p>
                      <p className="text-[8px] text-white/80">Dashboard Utama</p>
                    </div>
                  </div>
                  <div
                    style={itemStyles["card-2"] || itemStyles["item-2"] || {}}
                    className="card-2 rounded-xl p-1.5 bg-amber-50 border-2 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-xs">👥</span>
                    <span className="text-[8px] font-black text-slate-900">12.4k User</span>
                  </div>
                  <div
                    style={itemStyles["card-3"] || itemStyles["item-3"] || {}}
                    className="card-3 rounded-xl p-1.5 bg-emerald-50 border-2 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-xs">⚡</span>
                    <span className="text-[8px] font-black text-slate-900">99.9% Uptime</span>
                  </div>
                  <div
                    style={itemStyles["card-4"] || itemStyles["item-4"] || {}}
                    className="card-4 rounded-xl p-1.5 bg-rose-50 border-2 border-slate-900 shadow-xs flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-xs">🛡️</span>
                    <span className="text-[8px] font-black text-slate-900">Enkripsi</span>
                  </div>
                </>
              ) : isGridHeaderMode ? (
                <>
                  <div
                    style={itemStyles["header"] || itemStyles["item-1"] || {}}
                    className="header grid-header rounded-xl p-2 bg-indigo-50 border-2 border-slate-900 shadow-xs flex items-center justify-between"
                  >
                    <span className="text-[9px] font-black text-indigo-950 font-mono">👑 .header (Span 3)</span>
                    <span className="text-xs">⚡</span>
                  </div>
                  <div
                    style={itemStyles["card-1"] || itemStyles["item-2"] || {}}
                    className="card-1 rounded-xl p-2 bg-amber-50 border-2 border-slate-900 shadow-xs flex items-center justify-center text-center"
                  >
                    <span className="text-[9px] font-bold text-slate-800">Konten A</span>
                  </div>
                  <div
                    style={itemStyles["card-2"] || itemStyles["item-3"] || {}}
                    className="card-2 rounded-xl p-2 bg-emerald-50 border-2 border-slate-900 shadow-xs flex items-center justify-center text-center"
                  >
                    <span className="text-[9px] font-bold text-slate-800">Konten B</span>
                  </div>
                  <div
                    style={itemStyles["card-3"] || itemStyles["item-4"] || {}}
                    className="card-3 rounded-xl p-2 bg-rose-50 border-2 border-slate-900 shadow-xs flex items-center justify-center text-center"
                  >
                    <span className="text-[9px] font-bold text-slate-800">Konten C</span>
                  </div>
                </>
              ) : isGridSidebarMode ? (
                <>
                  <div
                    style={itemStyles["sidebar"] || itemStyles["item-1"] || {}}
                    className="sidebar grid-sidebar rounded-xl p-2 bg-purple-50 border-2 border-slate-900 shadow-xs flex flex-col justify-center items-center text-center"
                  >
                    <span className="text-xs">🏰</span>
                    <span className="text-[9px] font-black text-purple-950 font-mono">.sidebar</span>
                    <span className="text-[8px] text-purple-700">Tower Span</span>
                  </div>
                  <div
                    style={itemStyles["card-1"] || itemStyles["item-2"] || {}}
                    className="card-1 rounded-xl p-2 bg-sky-50 border-2 border-slate-900 shadow-xs flex items-center justify-center"
                  >
                    <span className="text-[9px] font-bold text-slate-800">Panel 1</span>
                  </div>
                  <div
                    style={itemStyles["card-2"] || itemStyles["item-3"] || {}}
                    className="card-2 rounded-xl p-2 bg-emerald-50 border-2 border-slate-900 shadow-xs flex items-center justify-center"
                  >
                    <span className="text-[9px] font-bold text-slate-800">Panel 2</span>
                  </div>
                </>
              ) : (
                Array.from({ length: itemsCount }).map((_, i) => {
                  const color = palette[i % palette.length];
                  const label = itemLabels[i] || `Sel ${i + 1}`;
                  const itemSpecificStyle = itemStyles[`card-${i + 1}`] || itemStyles[`item-${i + 1}`] || {};

                  return (
                    <div
                      key={i}
                      style={itemSpecificStyle}
                      className={`card-${i + 1} rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center p-2 shadow-xs transition-all ${color.bg}`}
                    >
                      <span className="text-xs">{color.emoji}</span>
                      <span className="text-[9px] font-bold font-mono text-slate-900 text-center truncate max-w-full">
                        {label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div
              id="live-arena"
              className={`arena w-full h-28 sm:h-36 bg-white border-3 rounded-2xl p-2 shadow-[0_4px_0_#0f172a] overflow-hidden transition-all relative ${
                liveEval.passed ? "border-emerald-600 ring-4 ring-emerald-300/60" : "border-slate-900"
              }`}
              style={arenaStyle}
            >
              {Array.from({ length: itemsCount }).map((_, i) => {
                const color = palette[i % palette.length];
                const label = itemLabels[i] || `Permen ${i + 1}`;
                const itemSpecificStyle = itemStyles[`item-${i + 1}`] || itemStyles[`card-${i + 1}`] || {};

                return (
                  <div
                    key={i}
                    style={itemSpecificStyle}
                    className={`permen-${i + 1} card-${i + 1} rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center shadow-[0_2px_0_#0f172a] transition-all duration-200 ${
                      color.bg
                    } ${
                      itemsCount > 4
                        ? "w-10 h-10 p-0.5"
                        : "w-12 h-12 p-1"
                    }`}
                  >
                    <span className={itemsCount > 4 ? "text-xs" : "text-base"}>
                      {color.emoji}
                    </span>
                    <span className="text-[9px] font-bold font-mono text-slate-900 text-center truncate max-w-full">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. CLEAN CODE CHIPS (Minimalist, Diverse & Never putting key at index 0) */}
        {shuffledHelpers && shuffledHelpers.length > 0 && (
          <div className="px-2 py-1.5 flex flex-wrap gap-1.5 bg-white border-b-2 border-slate-900 shrink-0 max-h-20 overflow-y-auto">
            {shuffledHelpers.map((snippet) => {
              const active = isHelperActive(snippet, cssCode);
              return (
                <button
                  key={snippet}
                  onClick={() => handleToggleHelper(snippet)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1 shrink-0 ${
                    active
                      ? "bg-[#EF4444] text-white border-2 border-slate-900 font-bold shadow-[0_2px_0_#991b1b]"
                      : "bg-slate-100 border-2 border-slate-900 text-slate-800 font-bold hover:bg-slate-200 shadow-[0_1px_0_#0f172a]"
                  }`}
                >
                  <span className="text-[9px] opacity-75">{active ? "✓" : "+"}</span>
                  <span>{snippet}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 4. COMPACT CODE EDITOR */}
        <div className="flex-1 p-2 flex flex-col min-h-[90px] max-h-[150px] bg-[#FFFDF7]">
          <div className="rounded-2xl border-3 border-slate-900 overflow-hidden bg-[#1e1e2e] flex flex-col flex-1 shadow-[0_4px_0_#0f172a]">
            <div className="bg-[#181825] px-2.5 py-1.5 border-b border-[#313244] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-[#a6adc8] ml-1">
                  {isHtmlMode ? "index.html" : "style.css"}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-[#a6adc8] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 p-2 bg-transparent text-[#cdd6f4] font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"
              placeholder={isHtmlMode ? "<!-- Tulis tag HTML di sini -->" : ".arena { display: flex; ... }"}
            />
          </div>
        </div>

        {/* 5. BOTTOM ACTION BAR (Success / Next / Status) */}
        <div className="p-2.5 bg-white border-t-2 border-slate-900 shrink-0 shadow-xs">
          {liveEval.passed ? (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-display font-black text-emerald-950 truncate">
                    Target Berhasil Dicapai!
                  </span>
                  {earnedXpInfo?.earnedXp && earnedXpInfo.earnedXp > 0 && (
                    <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded font-mono font-black text-[10px] shrink-0">
                      +{earnedXpInfo.earnedXp} XP
                    </span>
                  )}
                </div>
                {isClassCompleted || challenge?.order_index === 10 ? (
                  <Link href="/dashboard">
                    <button className="px-3.5 py-1.5 rounded-xl bg-[#FEF08A] hover:bg-yellow-300 text-slate-900 font-display font-black text-xs border-2 border-slate-900 shadow-[0_2px_0_#0f172a] flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0">
                      <span>Tamat! Dashboard</span>
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={handleNextLevel}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_2px_0_#065f46] flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>Lanjut</span>
                    <Rocket className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {saveError && (
                <div className="p-1.5 bg-red-100 border border-red-500 rounded-lg flex items-center justify-between text-[11px] text-red-950 font-bold gap-1">
                  <span>{saveError}</span>
                  <button
                    onClick={() => saveProgress()}
                    disabled={isSaving}
                    className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSaving ? "animate-spin" : ""}`} />
                    <span>Coba Lagi</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-[11px] font-medium text-slate-900">Ubah kode atau pilih chip di atas</span>
              </div>
              {challenge?.hint && (
                <button
                  onClick={() => setShowTheoryModal(true)}
                  className="text-[11px] font-bold text-slate-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Petunjuk</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP WORKSPACE (3 Columns: Mission | Arena | Editor)  */}
      {/* ======================================================== */}
      <div className="hidden lg:grid lg:grid-cols-12 flex-1 gap-0 overflow-hidden bg-[#FFFDF7]">
        {/* PANEL 1: INSTRUCTIONS & VISUAL TARGET GOAL (4 Cols) */}
        <div className="lg:col-span-4 border-r-3 border-slate-900 p-6 bg-white overflow-y-auto space-y-6 shadow-xs">
          {/* Mission Box (Soal Dinamis dari API) */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-slate-900 text-slate-900 font-display font-black text-xs shadow-[0_2px_0_#0f172a]">
              <Zap className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />
              <span>Misi Tantangan (+{challenge?.xp_reward} XP)</span>
            </div>
            <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              {challenge?.title}
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-[#FFFDF7] p-4 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a]">
              {challenge?.instruction}
            </div>
          </div>

          {/* Materi & Konsep Teori (Dinamis dari API) */}
          {challenge?.theory && (
            <div className="p-4 bg-sky-50 border-3 border-slate-900 rounded-2xl space-y-2.5 shadow-[0_4px_0_#0f172a]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 text-sky-800" />
                </div>
                <span className="text-xs font-display font-black uppercase tracking-wider text-slate-900">
                  Materi &amp; Teori Pembelajaran
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line pl-1">
                {challenge.theory}
              </p>
            </div>
          )}

          {/* Hint Dropdown */}
          <div className="pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs font-display font-black text-slate-800 hover:text-[#EF4444] cursor-pointer transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{showHint ? "Sembunyikan Petunjuk" : "Butuh Bantuan? Lihat Petunjuk"}</span>
            </button>
            {showHint && (
              <div className="mt-2 p-3.5 bg-[#FEF08A]/70 border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed shadow-[0_2px_0_#0f172a]">
                {challenge?.hint ||
                  "Gunakan display: flex; justify-content: center; align-items: center;"}
              </div>
            )}
          </div>
        </div>

        {/* PANEL 2: INTERACTIVE LIVE CANVAS (4 Cols) */}
        <div className="lg:col-span-4 border-r-3 border-slate-900 p-6 bg-slate-50 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#EF4444]" />
                <span>Arena Koding</span>
              </span>
            </div>

            {/* LIVE ARENA CONTAINER - Directly reacts to user's HTML / CSS */}
            {isHtmlMode ? (
              <div
                id="live-arena"
                className={`arena w-full min-h-[14rem] sm:min-h-[20rem] bg-white border-4 rounded-3xl p-5 shadow-[0_8px_0_#0f172a] overflow-auto transition-all relative ${
                  liveEval.passed
                    ? "border-emerald-600 ring-4 ring-emerald-300/60"
                    : "border-slate-900"
                }`}
              >
                <div
                  className="html-live-sandbox w-full font-body text-slate-800"
                  dangerouslySetInnerHTML={{ __html: sanitizedUserHtml }}
                />
              </div>
            ) : isCssBasicsMode ? (
              <div
                id="live-arena"
                className={`arena w-full h-56 sm:h-72 lg:h-96 bg-white border-4 rounded-3xl p-6 shadow-[0_8px_0_#0f172a] overflow-auto flex items-center justify-center transition-all ${
                  liveEval.passed
                    ? "border-emerald-600 ring-4 ring-emerald-300/60"
                    : "border-slate-900"
                }`}
              >
                {challengeId === "css-basics-12-boss-fight" ? (
                  <span
                    className="badge transition-all inline-block font-mono text-sm font-bold"
                    style={itemStyles["box"] || arenaStyle}
                  >
                    🔔 3 Pesan Baru
                  </span>
                ) : (
                  <div
                    className="box transition-all w-full max-w-sm text-center font-body p-5 bg-white text-slate-800 border-2 border-slate-200 rounded-xl shadow-xs"
                    style={itemStyles["box"] || arenaStyle}
                  >
                    <h3 className="font-bold text-base">Belajar CSS Dasar</h3>
                    <p className="text-sm text-slate-600 mt-2">Menguasai box model, perataan, warna, dan tipografi.</p>
                  </div>
                )}
              </div>
            ) : isNavbarMode ? (
              <div
                id="live-arena"
                className={`navbar w-full min-h-[5.5rem] bg-slate-900 border-4 rounded-3xl p-5 shadow-[0_8px_0_#0f172a] overflow-auto transition-all ${
                  liveEval.passed
                    ? "border-emerald-600 ring-4 ring-emerald-300/60"
                    : "border-slate-900"
                }`}
                style={arenaStyle}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="w-9 h-9 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-black text-sm shadow-md">
                    ⚡
                  </span>
                  <div>
                    <span className="font-display font-black text-white text-base tracking-wider block leading-tight">
                      CODEVAS
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Modern Flex Navbar</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-colors">
                    Kurikulum
                  </span>
                  <span className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-colors">
                    Tantangan
                  </span>
                  <button className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border border-white/20 shadow-md transition-transform active:scale-95">
                    Mulai Belajar 🚀
                  </button>
                </div>
              </div>
            ) : isGridMode ? (
              <div
                id="live-arena"
                className={`grid-arena w-full min-h-[16rem] sm:min-h-[22rem] lg:min-h-[26rem] bg-slate-50 border-4 rounded-3xl p-6 shadow-[0_8px_0_#0f172a] overflow-auto transition-all ${
                  liveEval.passed
                    ? "border-emerald-600 ring-4 ring-emerald-300/60"
                    : "border-slate-900"
                }`}
                style={{ display: "grid", ...arenaStyle }}
              >
                {isBentoMode ? (
                  <>
                    <div
                      style={itemStyles["card-1"] || itemStyles["item-1"] || {}}
                      className="card-1 rounded-2xl p-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">📈</span>
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full font-bold">
                          +148% Bulanan
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black leading-tight">Analisis Ekosistem Digital</h4>
                        <p className="text-xs text-white/80 mt-1">Bento Hero Card membentang 2 kolom penuh.</p>
                      </div>
                    </div>
                    <div
                      style={itemStyles["card-2"] || itemStyles["item-2"] || {}}
                      className="card-2 rounded-2xl p-4 bg-amber-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-2xl">👥</span>
                      <span className="text-sm font-black text-slate-900 mt-1">12,480 Siswa</span>
                      <span className="text-[10px] text-slate-500">Aktif Belajar</span>
                    </div>
                    <div
                      style={itemStyles["card-3"] || itemStyles["item-3"] || {}}
                      className="card-3 rounded-2xl p-4 bg-emerald-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-2xl">⚡</span>
                      <span className="text-sm font-black text-slate-900 mt-1">99.98%</span>
                      <span className="text-[10px] text-slate-500">Live Uptime</span>
                    </div>
                    <div
                      style={itemStyles["card-4"] || itemStyles["item-4"] || {}}
                      className="card-4 rounded-2xl p-4 bg-rose-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-2xl">🛡️</span>
                      <span className="text-sm font-black text-slate-900 mt-1">AES-256</span>
                      <span className="text-[10px] text-slate-500">Security Grade</span>
                    </div>
                    <div
                      style={itemStyles["card-5"] || itemStyles["item-5"] || {}}
                      className="card-5 rounded-2xl p-4 bg-sky-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-2xl">⭐</span>
                      <span className="text-sm font-black text-slate-900 mt-1">4.9 / 5.0</span>
                      <span className="text-[10px] text-slate-500">Rating Komunitas</span>
                    </div>
                  </>
                ) : isGridHeaderMode ? (
                  <>
                    <div
                      style={itemStyles["header"] || itemStyles["item-1"] || {}}
                      className="header grid-header rounded-2xl p-4 bg-indigo-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-black text-indigo-950 font-mono block">👑 .header</span>
                        <p className="text-xs text-indigo-800">Membentang melintasi 3 kolom dengan grid-column: span 3;</p>
                      </div>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div
                      style={itemStyles["card-1"] || itemStyles["item-2"] || {}}
                      className="card-1 rounded-2xl p-4 bg-amber-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-xl">📦</span>
                      <span className="text-xs font-bold text-slate-800 mt-1">Konten Kolom 1</span>
                    </div>
                    <div
                      style={itemStyles["card-2"] || itemStyles["item-3"] || {}}
                      className="card-2 rounded-2xl p-4 bg-emerald-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-xl">📊</span>
                      <span className="text-xs font-bold text-slate-800 mt-1">Konten Kolom 2</span>
                    </div>
                    <div
                      style={itemStyles["card-3"] || itemStyles["item-4"] || {}}
                      className="card-3 rounded-2xl p-4 bg-rose-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-xl">⚙️</span>
                      <span className="text-xs font-bold text-slate-800 mt-1">Konten Kolom 3</span>
                    </div>
                  </>
                ) : isGridSidebarMode ? (
                  <>
                    <div
                      style={itemStyles["sidebar"] || itemStyles["item-1"] || {}}
                      className="sidebar grid-sidebar rounded-2xl p-5 bg-purple-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex flex-col justify-center items-center text-center"
                    >
                      <span className="text-3xl">🏰</span>
                      <span className="text-sm font-black text-purple-950 font-mono mt-2">.sidebar</span>
                      <span className="text-xs text-purple-700">Tower Span 2 Baris</span>
                    </div>
                    <div
                      style={itemStyles["card-1"] || itemStyles["item-2"] || {}}
                      className="card-1 rounded-2xl p-5 bg-sky-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex items-center justify-center"
                    >
                      <span className="text-sm font-bold text-slate-800">Panel Konten 1</span>
                    </div>
                    <div
                      style={itemStyles["card-2"] || itemStyles["item-3"] || {}}
                      className="card-2 rounded-2xl p-5 bg-emerald-50 border-3 border-slate-900 shadow-[0_4px_0_#0f172a] flex items-center justify-center"
                    >
                      <span className="text-sm font-bold text-slate-800">Panel Konten 2</span>
                    </div>
                  </>
                ) : (
                  Array.from({ length: itemsCount }).map((_, i) => {
                    const color = palette[i % palette.length];
                    const label = itemLabels[i] || `Sel ${i + 1}`;
                    const itemSpecificStyle = itemStyles[`card-${i + 1}`] || itemStyles[`item-${i + 1}`] || {};

                    return (
                      <div
                        key={i}
                        style={itemSpecificStyle}
                        className={`card-${i + 1} rounded-2xl border-3 border-slate-900 flex flex-col items-center justify-center p-4 shadow-[0_4px_0_#0f172a] transition-all ${color.bg}`}
                      >
                        <span className="text-2xl">{color.emoji}</span>
                        <span className="text-xs font-bold font-mono text-slate-900 text-center truncate max-w-full mt-1">
                          {label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div
                id="live-arena"
                className={`arena w-full h-56 sm:h-72 lg:h-96 bg-white border-4 rounded-3xl p-5 shadow-[0_8px_0_#0f172a] overflow-auto transition-all relative ${
                  liveEval.passed
                    ? "border-emerald-600 ring-4 ring-emerald-300/60"
                    : "border-slate-900"
                }`}
                style={arenaStyle}
              >
                {Array.from({ length: itemsCount }).map((_, i) => {
                  const color = palette[i % palette.length];
                  const label = itemLabels[i] || `Permen ${i + 1}`;
                  const itemSpecificStyle = itemStyles[`item-${i + 1}`] || itemStyles[`card-${i + 1}`] || {};

                  return (
                    <div
                      key={i}
                      style={itemSpecificStyle}
                      className={`permen-${i + 1} card-${
                        i + 1
                      } rounded-2xl border-3 border-slate-900 flex flex-col items-center justify-center shadow-[0_4px_0_#0f172a] transition-all duration-200 ${
                        color.bg
                      } ${
                        itemsCount > 4
                          ? "w-14 h-14 p-1"
                          : "w-20 h-20 p-2"
                      }`}
                    >
                      <span
                        className={
                          itemsCount > 4 ? "text-lg" : "text-2xl"
                        }
                      >
                        {color.emoji}
                      </span>
                      <span className="text-[10px] font-bold font-mono text-slate-900 text-center truncate max-w-full">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3: CODE EDITOR & REAL-TIME ACTION (4 Cols) */}
        <div className="lg:col-span-4 p-6 bg-white flex flex-col justify-between relative overflow-y-auto">
          {/* Localized Mini Confetti Canvas */}
          <canvas
            ref={confettiCanvasRef}
            className="pointer-events-none absolute inset-0 z-30 w-full h-full"
          />
          <div className="space-y-4">
            {/* Clean Code Chips Bar (Minimalist, Diverse & Never putting key at index 0) */}
            {shuffledHelpers && shuffledHelpers.length > 0 && (
              <div className="flex flex-wrap gap-2 py-1">
                {shuffledHelpers.map((snippet) => {
                  const active = isHelperActive(snippet, cssCode);

                  return (
                    <button
                      key={snippet}
                      onClick={() => handleToggleHelper(snippet)}
                      className={`px-3 py-1 text-xs font-mono rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                        active
                          ? "bg-[#EF4444] text-white border-2 border-slate-900 font-bold shadow-[0_2px_0_#991b1b]"
                          : "bg-slate-100 border-2 border-slate-900 text-slate-800 font-bold hover:bg-slate-200 shadow-[0_2px_0_#0f172a]"
                      }`}
                    >
                      <span className="text-[10px] opacity-75">{active ? "✓" : "+"}</span>
                      <span>{snippet}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="font-display font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {isHtmlMode ? "HTML Editor" : "CSS Editor"}
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-display font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset kode awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Code Input Area */}
            <div className="rounded-2xl border-3 border-slate-900 overflow-hidden bg-[#1e1e2e] shadow-[0_6px_0_#0f172a]">
              <div className="bg-[#181825] px-3.5 py-2 border-b border-[#313244] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-mono text-[#a6adc8] ml-1.5">
                    {isHtmlMode ? "index.html" : "style.css"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6c7086]">Live Eval</span>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                rows={8}
                spellCheck={false}
                className="w-full p-3 sm:p-4 bg-transparent text-[#cdd6f4] font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                placeholder={isHtmlMode ? "<!-- Tulis tag HTML di sini -->" : ".arena { display: flex; ... }"}
              />
            </div>
          </div>

          {/* Bottom Action Area: Appears when target is achieved */}
          {liveEval.passed && (
            <div className="pt-4 mt-4 border-t-2 border-slate-200 space-y-3 animate-in fade-in duration-300">
              <div className="p-4 bg-emerald-100 border-3 border-emerald-600 rounded-2xl flex items-center justify-between text-xs font-display font-black text-emerald-950 shadow-[0_4px_0_#065f46]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span>Sempurna! Target berhasil dicapai.</span>
                    {earnedXpInfo?.leveledUp && (
                      <span className="block text-[11px] font-bold text-amber-800 mt-0.5">
                        🎉 Selamat! Naik ke Level {earnedXpInfo.level} ({earnedXpInfo.rankTitle})
                      </span>
                    )}
                  </div>
                </div>
                {earnedXpInfo?.earnedXp && earnedXpInfo.earnedXp > 0 && (
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-mono font-black text-xs shrink-0 shadow-xs">
                    +{earnedXpInfo.earnedXp} XP
                  </span>
                )}
              </div>

              {saveError && (
                <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl flex items-center justify-between text-xs text-red-950 font-bold gap-2">
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{saveError}</span>
                  </div>
                  <button
                    onClick={() => saveProgress()}
                    disabled={isSaving}
                    className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSaving ? "animate-spin" : ""}`} />
                    <span>{isSaving ? "Menyimpan..." : "Coba Simpan"}</span>
                  </button>
                </div>
              )}

              {!user && (
                <div className="p-2.5 bg-[#FEF08A]/70 border-2 border-slate-900 rounded-xl text-[11px] text-slate-900 font-medium">
                  💡 Kamu sedang belajar sebagai Tamu.{" "}
                  <Link href={`/login?redirect=/classes/${classId}/learn/${challengeId}`} className="font-black underline text-slate-900">
                    Login di sini
                  </Link>{" "}
                  agar poin XP dan rekor streak tersimpan di profilmu.
                </div>
              )}

              {isClassCompleted || challenge?.order_index === 10 ? (
                <Link href="/dashboard" className="block w-full">
                  <button className="w-full py-4 rounded-2xl bg-[#FEF08A] hover:bg-yellow-300 text-slate-900 font-display font-black text-base border-3 border-slate-900 shadow-[0_6px_0_#0f172a] flex items-center justify-center gap-2 cursor-pointer active:translate-y-1 active:shadow-none transition-all">
                    <span>🏆 Selamat! Kamu Menamatkan Kelas (Ke Dashboard)</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleNextLevel}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-base border-3 border-slate-900 shadow-[0_6px_0_#065f46] flex items-center justify-center gap-2 cursor-pointer active:translate-y-1 active:shadow-none transition-all"
                >
                  <span>Lanjut ke Level Berikutnya</span>
                  <Rocket className="w-5 h-5" />
                </button>
              )}

              <Link
                href={`/classes/${classId}`}
                className="block w-full text-center py-1 text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline"
              >
                Kembali ke Silabus Kelas
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Theory & Hint Modal / Drawer (Responsive Bottom Sheet on Mobile) */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border-t-3 sm:border-3 border-slate-900 rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_8px_0_#0f172a] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#EF4444]" />
                <h3 className="font-display font-black text-lg text-slate-900">
                  Materi &amp; Teori Pembelajaran
                </h3>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {challenge?.theory && (
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {challenge.theory}
              </p>
            )}

            {challenge?.hint && (
              <div className="p-3.5 bg-[#FEF08A] border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed space-y-1 shadow-[0_2px_0_#0f172a]">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Lightbulb className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Petunjuk Tantangan:</span>
                </div>
                <p>{challenge.hint}</p>
              </div>
            )}

            <button
              onClick={() => setShowTheoryModal(false)}
              className="w-full py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-xs border-2 border-slate-900 shadow-[0_3px_0_#991b1b] text-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              Paham, Lanjut Koding
            </button>
          </div>
        </div>
      )}

      {/* Session Expired Modal */}
      {sessionExpired && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-[0_8px_0_#0f172a] space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FEF08A] border-3 border-slate-900 flex items-center justify-center text-slate-900 shadow-[0_3px_0_#0f172a]">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="font-display font-black text-lg text-slate-900">
              Sesi Login Anda Telah Habis
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Sesi login Anda telah berakhir. Silakan login kembali untuk menyimpan progres level, poin XP, dan rekor streak Anda.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/login?redirect=/classes/${classId}/learn/${challengeId}`}
                className="w-full py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm border-2 border-slate-900 shadow-[0_3px_0_#991b1b] text-center transition-all cursor-pointer"
              >
                Login Kembali
              </Link>
              <button
                onClick={() => setSessionExpired(false)}
                className="w-full py-2.5 rounded-xl border-2 border-slate-900 font-display font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer shadow-[0_2px_0_#0f172a]"
              >
                Tetap Belajar (Mode Tamu)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengePlaygroundPage({
  params,
}: {
  params: Promise<{ id: string; challengeId: string }>;
}) {
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
      <ChallengePlaygroundContent params={params} />
    </Suspense>
  );
}
