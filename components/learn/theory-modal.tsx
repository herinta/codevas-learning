"use client";

import React, { useMemo } from "react";
import {
  BookOpen,
  Lightbulb,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Monitor,
} from "lucide-react";
import { ChallengeData, ConceptDemo } from "./types";
import { parseUserStyles, sanitizeUserHtml } from "./style-parser";

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeData | null;
}

/**
 * Formats HTML into cleanly indented separate lines (baris baru)
 */
function prettyFormatHtml(raw: string): string {
  if (!raw) return "";
  let clean = raw.trim();

  // Split tags that are stuck together onto new lines
  clean = clean.replace(/>\s*</g, ">\n<");

  const rawLines = clean.split("\n");
  let indent = 0;
  const formatted: string[] = [];

  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;

    const isClosingOnly = /^<\/[a-zA-Z0-9_-]+>$/.test(line);
    const isOpeningOnly =
      /^<[a-zA-Z0-9_-]+(?:\s+[^>]*)?>$/.test(line) && !line.endsWith("/>");

    if (isClosingOnly) {
      indent = Math.max(0, indent - 1);
    }

    formatted.push("  ".repeat(indent) + line);

    if (isOpeningOnly) {
      indent++;
    }
  }

  return formatted.join("\n");
}

/**
 * Lightweight syntax colorizer for the modal preview editor
 */
function renderHighlightedLine(line: string, isCss: boolean) {
  if (!line.trim()) return <span>&nbsp;</span>;

  if (isCss) {
    if (line.includes("{") || line.includes("}")) {
      const selector = line.replace(/[{}]/g, "").trim();
      return (
        <span>
          <span className="text-amber-400 font-bold">{selector}</span>
          <span className="text-slate-400">{line.includes("{") ? " {" : "}"}</span>
        </span>
      );
    }
    if (line.includes(":")) {
      const [prop, ...valParts] = line.split(":");
      const val = valParts.join(":");
      return (
        <span>
          <span className="text-sky-300 font-medium">{prop}:</span>
          <span className="text-emerald-300">{val}</span>
        </span>
      );
    }
    return <span className="text-slate-200">{line}</span>;
  }

  // HTML syntax highlighting
  const parts = line.split(
    /(<\/?[a-zA-Z0-9_-]+(?:(?:\s+[\w:-]+(?:\s*=\s*(?:".*?"|'.*?'|[^\s>]+))?)*)\s*\/?>)/g
  );

  return (
    <span>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (part.startsWith("<") && part.endsWith(">")) {
          const isClosing = part.startsWith("</");
          const tagContent = isClosing ? part.slice(2, -1) : part.slice(1, -1);
          const firstSpaceIdx = tagContent.indexOf(" ");

          if (firstSpaceIdx === -1) {
            return (
              <span key={idx} className="text-sky-400">
                &lt;{isClosing ? "/" : ""}
                <span className="text-pink-400 font-bold">{tagContent}</span>
                &gt;
              </span>
            );
          }

          const tagName = tagContent.slice(0, firstSpaceIdx);
          const attrs = tagContent.slice(firstSpaceIdx);

          return (
            <span key={idx} className="text-sky-400">
              &lt;
              <span className="text-pink-400 font-bold">{tagName}</span>
              <span className="text-amber-200">{attrs}</span>
              &gt;
            </span>
          );
        }
        return (
          <span key={idx} className="text-slate-100 font-medium">
            {part}
          </span>
        );
      })}
    </span>
  );
}

function getExampleSnippet(challenge: ChallengeData | null): {
  isHtml: boolean;
  fileName: string;
  code: string;
  description?: string;
} {
  if (!challenge) {
    return {
      isHtml: true,
      fileName: "index.html",
      code: "<!-- Tulis kode di sini -->",
    };
  }

  const isHtml =
    challenge.class_id === "html-architecture" || challenge.id.startsWith("html-");
  const concept = challenge.concept_demo || challenge.target_visual?.concept_demo;

  // Level 1 specific clean example with explicit newlines
  if (challenge.id === "html-1-raw-content" || challenge.id === "html-1") {
    return {
      isHtml: true,
      fileName: "index.html",
      code: "<h1>Profil Developer</h1>\n<p>Nama: Alex Coder</p>\n<p>Umur: 16 Tahun</p>",
      description: "Judul besar Profil Developer di bagian atas diikuti nama dan umur.",
    };
  }

  // 1. If explicit concept.codeExample exists
  if (concept?.codeExample) {
    const raw = concept.codeExample.trim();
    return {
      isHtml,
      fileName: isHtml ? "index.html" : "style.css",
      code: isHtml ? prettyFormatHtml(raw) : raw,
      description: challenge.target_visual?.description || undefined,
    };
  }

  // 2. If HTML mode
  if (isHtml) {
    if (challenge.target_visual?.preview && challenge.target_visual.preview.includes("<")) {
      return {
        isHtml: true,
        fileName: "index.html",
        code: prettyFormatHtml(challenge.target_visual.preview),
        description: challenge.target_visual.description || undefined,
      };
    }
    if (challenge.syntax_helpers && challenge.syntax_helpers.length > 0) {
      return {
        isHtml: true,
        fileName: "index.html",
        code: prettyFormatHtml(challenge.syntax_helpers.join("\n")),
        description: challenge.target_visual?.description || undefined,
      };
    }
    return {
      isHtml: true,
      fileName: "index.html",
      code: "<div>\n  <h1>Profil Developer</h1>\n  <p>Nama: Alex Coder</p>\n</div>",
    };
  }

  // 3. CSS mode
  const selector =
    challenge.class_id === "css-grid" ||
    challenge.id.startsWith("grid-") ||
    challenge.id.startsWith("gr-")
      ? ".grid-arena"
      : challenge.id.includes("navbar")
      ? ".navbar"
      : challenge.class_id === "css-basics" ||
        challenge.id.startsWith("css-basics-") ||
        challenge.id.startsWith("basics-")
      ? ".box"
      : ".arena";

  if (challenge.syntax_helpers && challenge.syntax_helpers.length > 0) {
    const rules = challenge.syntax_helpers
      .filter((h) => h.includes(":") && !h.startsWith("<"))
      .slice(0, 3)
      .map((r) => `  ${r.endsWith(";") ? r : `${r};`}`)
      .join("\n");
    return {
      isHtml: false,
      fileName: "style.css",
      code: `${selector} {\n${rules || "  /* Properti CSS */"}\n}`,
      description: challenge.target_visual?.description || undefined,
    };
  }

  return {
    isHtml: false,
    fileName: "style.css",
    code: `${selector} {\n  background-color: lightblue;\n}`,
  };
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  challenge,
}) => {
  if (!isOpen) return null;

  const concept: ConceptDemo | undefined =
    challenge?.concept_demo || challenge?.target_visual?.concept_demo || undefined;

  const exampleInfo = useMemo(() => getExampleSnippet(challenge), [challenge]);
  const codeLines = useMemo(() => exampleInfo.code.split("\n"), [exampleInfo.code]);

  const parsedPreview = useMemo(() => {
    if (exampleInfo.isHtml) return null;
    return parseUserStyles(exampleInfo.code);
  }, [exampleInfo]);

  const cleanHint = useMemo(() => {
    if (!challenge?.hint) return null;
    return challenge.hint
      .replace(/\s*\(misal:[^)]+\)\.?/gi, "")
      .replace(/\[Namamu\]/g, "Alex Coder")
      .replace(/\[Umurmu\]/g, "16 Tahun")
      .trim();
  }, [challenge?.hint]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-t-3 sm:border-3 border-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-[0_8px_0_#0f172a] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF08A] border-2 border-slate-900 flex items-center justify-center shadow-[0_2px_0_#0f172a] shrink-0">
              <Sparkles className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#EF4444] text-white font-display font-black text-[10px] uppercase">
                  Checkpoint Teori • Level {challenge?.order_index || 1}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Concept Walkthrough
                </span>
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
                {concept?.conceptTitle || challenge?.title || "Materi & Teori Pembelajaran"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-2 border-transparent hover:border-slate-900 cursor-pointer transition-all shrink-0"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Filosofi & Mengapa Diperlukan */}
        <div className="p-4 bg-sky-50 border-2 border-slate-900 rounded-2xl space-y-2 shadow-[0_2px_0_#0f172a]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-800" />
            <span className="text-xs font-display font-black uppercase tracking-wider text-sky-950">
              Mengapa Ini Diperlukan? (Filosofi &amp; Fungsi)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {concept?.whyItMatters ||
              challenge?.theory ||
              "Pahami tujuan dari konsep arsitektur kode ini sebelum memulai latihan."}
          </p>
        </div>

        {/* What If Without / Konsekuensi Jika Tanpa Pendekatan Ini */}
        {concept?.whatIfWithout && (
          <div className="p-4 bg-rose-50 border-2 border-slate-900 rounded-2xl space-y-2 shadow-[0_2px_0_#0f172a]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Apa Akibatnya Jika Tanpa Pendekatan Ini?
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              {concept.whatIfWithout}
            </p>
          </div>
        )}

        {/* Section 2: Kotak Text Editor Code & Contoh Hasilnya (Side-by-Side) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#EF4444]" />
              Contoh Penerapan &amp; Hasil Tampilan
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Perhatikan hubungan kode &amp; hasilnya
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
            {/* Box 1: Kotak Text Editor Code */}
            <div className="rounded-2xl border-2 border-slate-900 bg-slate-950 overflow-hidden shadow-[0_3px_0_#0f172a] flex flex-col">
              {/* Window Header */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="ml-1.5 text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    {exampleInfo.fileName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Editor Kode
                </span>
              </div>

              {/* Code Body with Line Numbers & Baris Baru */}
              <div className="p-3.5 font-mono text-xs overflow-x-auto flex-1 flex leading-relaxed bg-[#0b1120]">
                <div className="select-none text-slate-600 pr-3 border-r border-slate-800 text-right shrink-0">
                  {codeLines.map((_, i) => (
                    <div key={i} className="leading-5">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="pl-3 flex-1 overflow-x-auto">
                  {codeLines.map((line, i) => (
                    <div key={i} className="leading-5 whitespace-pre">
                      {renderHighlightedLine(line, !exampleInfo.isHtml)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Contoh Hasil Tampilan di Browser */}
            <div className="rounded-2xl border-2 border-slate-900 bg-white overflow-hidden shadow-[0_3px_0_#0f172a] flex flex-col">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100 border-b-2 border-slate-900 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                  </div>
                  <div className="px-2 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono text-slate-500">
                    localhost:3000
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-bold flex items-center gap-1 uppercase tracking-wider">
                  <Monitor className="w-3.5 h-3.5 text-slate-700" />
                  Hasil di Layar
                </span>
              </div>

              {/* Browser Viewport Output */}
              <div className="p-4 bg-white flex-1 overflow-y-auto flex flex-col justify-center min-h-[140px]">
                {exampleInfo.isHtml ? (
                  <div
                    className="space-y-2 text-slate-900"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeUserHtml(exampleInfo.code),
                    }}
                  />
                ) : (
                  <div className="w-full flex items-center justify-center p-3">
                    <div
                      className="px-5 py-4 rounded-xl font-display font-black text-slate-900 text-center transition-all duration-300"
                      style={parsedPreview?.arenaStyle || {}}
                    >
                      <span>Elemen Visual (.box)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Visual Comparison (Tanpa vs Dengan) */}
        {concept?.visualComparison && (
          <div className="space-y-2 pt-1">
            <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800">
              Perbandingan: Tanpa vs Dengan Konsep Ini
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tanpa */}
              <div className="p-3.5 rounded-2xl border-2 border-rose-300 bg-rose-50/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-display font-black text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>
                    {concept.visualComparison.withoutLabel || "Tanpa Konsep Ini"}
                  </span>
                </div>
                <p className="text-xs text-rose-950/80 font-medium leading-relaxed">
                  {concept.visualComparison.withoutDesc}
                </p>
              </div>

              {/* Dengan */}
              <div className="p-3.5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-display font-black text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {concept.visualComparison.withLabel || "Dengan Konsep Ini"}
                  </span>
                </div>
                <p className="text-xs text-emerald-950/80 font-medium leading-relaxed">
                  {concept.visualComparison.withDesc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Key Takeaways (If Available) */}
        {concept?.keyTakeaways && concept.keyTakeaways.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-xs font-display font-black uppercase tracking-wider text-slate-800">
              Prinsip Kunci yang Perlu Diingat:
            </span>
            <div className="space-y-1.5">
              {concept.keyTakeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-start gap-2 shadow-[0_1px_0_#0f172a]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Petunjuk Singkat */}
        {cleanHint && (
          <div className="p-3.5 bg-[#FEF08A] border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed space-y-1 shadow-[0_2px_0_#0f172a]">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lightbulb className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Petunjuk Singkat:</span>
            </div>
            <p>{cleanHint}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-display font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_#991b1b] text-center cursor-pointer active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <span>Paham Konsepnya, Siap Latihan!</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
