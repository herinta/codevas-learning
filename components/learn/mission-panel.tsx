"use client";

import React, { useState } from "react";
import {
  Zap,
  BookOpen,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Layers,
  FileCode,
} from "lucide-react";
import { ChallengeData, ConceptDemo } from "./types";

interface MissionPanelProps {
  challenge: ChallengeData | null;
  onOpenTheory?: () => void;
}

interface MissionExample {
  filename: string;
  code: string;
  tip: string;
}

/**
 * Strips raw inline pseudo-syntax like `(misal: <p>Nama: [Namamu]</p>...)`
 * so the instruction prose is clear and references the editor box below.
 */
function cleanInstructionText(text: string): string {
  if (!text) return "";
  return text
    .replace(
      /\s*\(misal:\s*<p>Nama:[^)]+\)\.?\s*Bebas tuliskan nama dan umurmu sendiri!?/gi,
      " Perhatikan format kode pada editor acuan di bawah!"
    )
    .replace(/\s*\(misal:\s*12 Proyek[^)]+\)\.?/gi, " (perhatikan contoh acuan di bawah)")
    .trim();
}

/**
 * Renders instruction with tags and quoted titles highlighted as badges
 */
function FormattedInstruction({ text }: { text: string }) {
  const cleaned = cleanInstructionText(text);
  const tokens = cleaned.split(
    /(<\/?[a-zA-Z0-9_-]+(?:(?:\s+[\w:-]+(?:\s*=\s*(?:".*?"|'.*?'|[^\s>]+))?)*)\s*\/?>|"[^"]+")/g
  );

  return (
    <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-[#FFFDF7] p-4 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_#0f172a]">
      {tokens.map((token, i) => {
        if (!token) return null;
        if (token.startsWith("<") && token.endsWith(">")) {
          return (
            <code
              key={i}
              className="font-mono text-[11px] sm:text-xs font-bold px-1.5 py-0.5 mx-0.5 rounded bg-sky-100 text-sky-950 border border-sky-300 inline-block shadow-2xs"
            >
              {token}
            </code>
          );
        }
        if (token.startsWith('"') && token.endsWith('"') && token.length > 2) {
          return (
            <span
              key={i}
              className="font-bold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-2"
            >
              {token}
            </span>
          );
        }
        return <span key={i}>{token}</span>;
      })}
    </div>
  );
}

/**
 * Formats HTML into cleanly indented separate lines (baris baru)
 */
function prettyFormatHtml(raw: string): string {
  if (!raw) return "";
  let clean = raw.trim();

  // 1. Unescape literal escaped backslash-n (\n or \r\n)
  clean = clean
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // 2. Put newline between closing tag and next opening tag (e.g. </h1><p> or </p><p>)
  clean = clean.replace(/(<\/[a-zA-Z0-9_-]+>)\s*(<)/gi, "$1\n$2");

  // 3. Put newline after block opening tags (e.g. <div><h1>)
  clean = clean.replace(/(<(?:div|section|article|header|footer|nav|ul|ol|main)[^>]*>)\s*(<)/gi, "$1\n$2");

  // 4. Put newline before closing block tags (e.g. </p></div>)
  clean = clean.replace(/(<(?:\/[a-zA-Z0-9_-]+|[^>]+)>)\s*(<\/(?:div|section|article|header|footer|nav|ul|ol|main)>)/gi, "$1\n$2");

  // 5. Any remaining glued tags (><)
  clean = clean.replace(/>\s*(<)/g, ">\n$1");

  const rawLines = clean.split(/\r?\n/);
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
 * Intelligent example code extractor for any level
 */
function getMissionExampleCode(challenge: ChallengeData | null): MissionExample | null {
  if (!challenge) return null;

  const isCss =
    challenge.class_id === "css-basics" ||
    challenge.id.startsWith("css-") ||
    challenge.id.startsWith("basics-");
  const filename = isCss ? "style.css" : "index.html";

  // Level 1 specific clean example
  if (challenge.id === "html-1-raw-content" || challenge.id === "html-1") {
    return {
      filename,
      code: `<h1>Profil Developer</h1>\n<p>Nama: Alex Coder</p>\n<p>Umur: 16 Tahun</p>`,
      tip: "Tuliskan kode seperti contoh di atas ke dalam editor di samping kanan. Kamu bebas menuliskan nama & umurmu sendiri!",
    };
  }

  // Concept demo code example (e.g. from checkpoints)
  const concept =
    challenge.concept_demo ||
    challenge.target_visual?.concept_demo ||
    challenge.conceptDemo;

  if (concept?.codeExample && concept.codeExample.trim()) {
    const raw = concept.codeExample.trim();
    return {
      filename,
      code: isCss ? raw : prettyFormatHtml(raw),
      tip: isCss
        ? "Tuliskan selector dan properti CSS seperti contoh acuan di atas ke dalam editor."
        : "Format struktur tag seperti contoh acuan di atas ke dalam editor.",
    };
  }

  // Syntax helpers fallback
  if (challenge.syntax_helpers && challenge.syntax_helpers.length > 0) {
    const rawJoined = challenge.syntax_helpers
      .map((s) => s.replace(/\\n/g, "\n"))
      .join("\n");
    return {
      filename,
      code: isCss ? rawJoined : prettyFormatHtml(rawJoined),
      tip: "Gunakan tag atau potongan acuan di atas untuk menyelesaikan tantangan.",
    };
  }

  // Target visual preview fallback
  if (challenge.target_visual?.preview && typeof challenge.target_visual.preview === "string") {
    const raw = challenge.target_visual.preview.trim();
    return {
      filename,
      code: isCss ? raw : prettyFormatHtml(raw),
      tip: "Format struktur acuan di atas untuk menghasilkan visual yang diharapkan.",
    };
  }

  return null;
}

/**
 * Lightweight syntax colorizer for the mini editor
 */
function renderHighlightedCodeLine(line: string, isCss: boolean) {
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

  // HTML line highlighting
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

/**
 * Mini Code Editor Component
 */
const MiniCodeEditor: React.FC<{
  example: MissionExample;
  isCss: boolean;
}> = ({ example, isCss }) => {
  const lines = example.code.replace(/\\n/g, "\n").split(/\r?\n/);

  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-slate-950 overflow-hidden shadow-[0_3px_0_#0f172a] text-slate-100">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 pl-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-red-600/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-amber-600/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-emerald-600/80 inline-block" />
          </div>

          {/* Filename Tab */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 text-[11px] font-mono font-medium border border-slate-700/60 ml-1">
            <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{example.filename}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-display font-black text-slate-400 tracking-wider uppercase">
            Contoh Acuan
          </span>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="p-3 font-mono text-xs overflow-x-auto leading-relaxed max-h-52 bg-[#0B0F19]">
        <div className="flex">
          {/* Line Numbers */}
          <div className="select-none text-slate-600 pr-3 border-r border-slate-800 text-right shrink-0">
            {lines.map((_, i) => (
              <div key={i} className="leading-5">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Code Content */}
          <div className="pl-3 flex-1 overflow-x-auto">
            {lines.map((line, i) => (
              <div key={i} className="leading-5 whitespace-pre">
                {renderHighlightedCodeLine(line, isCss)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Footer / Helper Note */}
      <div className="px-3 py-1.5 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-300 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="leading-tight">{example.tip}</span>
      </div>
    </div>
  );
};

export const MissionPanel: React.FC<MissionPanelProps> = ({
  challenge,
  onOpenTheory,
}) => {
  const [showHint, setShowHint] = useState(false);

  const concept: ConceptDemo | undefined =
    challenge?.concept_demo || challenge?.target_visual?.concept_demo || undefined;

  const isCss =
    challenge?.class_id === "css-basics" ||
    Boolean(challenge?.id?.startsWith("css-")) ||
    Boolean(challenge?.id?.startsWith("basics-"));

  const example = getMissionExampleCode(challenge);

  return (
    <div className="lg:col-span-4 border-r-3 border-slate-900 p-6 bg-white overflow-y-auto space-y-6 shadow-xs">
      {/* Mission Box */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-slate-900 text-slate-900 font-display font-black text-xs shadow-[0_2px_0_#0f172a]">
          <Zap className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />
          <span>Panduan Tantangan (+{challenge?.xp_reward} XP)</span>
        </div>
        <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
          {challenge?.title}
        </h2>

        {/* Clean Formatted Instruction */}
        <FormattedInstruction text={challenge?.instruction || ""} />

        {/* Embedded Mini Code Editor Reference Box */}
        {example && <MiniCodeEditor example={example} isCss={isCss} />}
      </div>

      {/* Interstitial Theory Checkpoint & Guided Examples Card */}
      {(concept || challenge?.theory) && (
        <div className="p-4 bg-sky-50 border-3 border-slate-900 rounded-2xl space-y-3 shadow-[0_4px_0_#0f172a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center shadow-xs">
                {concept ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 text-sky-800" />
                )}
              </div>
              <span className="text-xs font-display font-black uppercase tracking-wider text-slate-900">
                {concept ? "Jeda Materi & Demo Visual" : "Materi & Teori Pembelajaran"}
              </span>
            </div>
            {concept && (
              <span className="px-2 py-0.5 rounded-full bg-amber-200 border border-slate-900 text-[10px] font-black text-amber-950 font-mono">
                Checkpoint
              </span>
            )}
          </div>

          {concept?.conceptTitle && (
            <h4 className="font-display font-black text-sm text-slate-900">
              {concept.conceptTitle}
            </h4>
          )}

          <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3 pl-0.5">
            {concept?.whyItMatters || challenge?.theory}
          </p>

          {onOpenTheory && (
            <button
              type="button"
              onClick={onOpenTheory}
              className="w-full mt-1 py-2 px-3 bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-xl font-display font-black text-xs text-slate-900 shadow-[0_2px_0_#0f172a] flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Buka Demo Visual &amp; Contoh Kode</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>
      )}

      {/* Hint Accordion */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs font-display font-black text-slate-800 hover:text-[#EF4444] cursor-pointer transition-colors"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{showHint ? "Sembunyikan Petunjuk" : "Butuh Bantuan? Lihat Petunjuk"}</span>
        </button>
        {showHint && (
          <div className="mt-2 p-3.5 bg-[#FEF08A]/70 border-2 border-slate-900 rounded-xl text-xs text-slate-900 font-medium leading-relaxed shadow-[0_2px_0_#0f172a]">
            {challenge?.hint ||
              "Tuliskan tag HTML atau properti CSS sesuai instruksi di atas."}
          </div>
        )}
      </div>
    </div>
  );
};
