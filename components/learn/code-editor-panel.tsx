"use client";

import React, { useRef, useMemo } from "react";
import { RotateCcw, FileCode, Sparkles } from "lucide-react";
import { getScopedCss } from "./style-parser";

interface CodeEditorPanelProps {
  cssCode: string;
  setCssCode: (code: string | ((prev: string) => string)) => void;
  shuffledHelpers?: string[];
  onToggleHelper?: (snippet: string) => void;
  onReset: () => void;
  isHtmlMode: boolean;
  sizeMode?: "compact" | "desktop";
}

/**
 * Real-time syntax colorizer for HTML & CSS lines
 */
function renderHighlightedCodeLine(line: string, isCss: boolean) {
  if (!line) return <span>&nbsp;</span>;

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

  // HTML syntax tokenization with support for complete and in-progress tags
  const parts = line.split(
    /(<\/?[a-zA-Z0-9_-]+(?:(?:\s+[\w:-]+(?:\s*=\s*(?:".*?"|'.*?'|[^\s>]+))?)*)\s*\/?>|<\/?[a-zA-Z0-9_-]*)/g
  );

  return (
    <span>
      {parts.map((part, idx) => {
        if (!part) return null;

        // Fully-formed tag: e.g. <div class="..."> or </div>
        if (part.startsWith("<") && part.endsWith(">")) {
          const isClosing = part.startsWith("</");
          const tagContent = isClosing ? part.slice(2, -1) : part.slice(1, -1);
          const firstSpaceIdx = tagContent.indexOf(" ");

          if (firstSpaceIdx === -1) {
            return (
              <span key={idx} className="text-sky-400 font-semibold">
                &lt;{isClosing ? "/" : ""}
                <span className="text-pink-400 font-bold">{tagContent}</span>
                &gt;
              </span>
            );
          }

          const tagName = tagContent.slice(0, firstSpaceIdx);
          const attrs = tagContent.slice(firstSpaceIdx);

          return (
            <span key={idx} className="text-sky-400 font-semibold">
              &lt;
              <span className="text-pink-400 font-bold">{tagName}</span>
              <span className="text-amber-200">{attrs}</span>
              &gt;
            </span>
          );
        }

        // Incomplete closing tag (e.g. </ or </div)
        if (part.startsWith("</")) {
          const rest = part.slice(2);
          return (
            <span key={idx} className="text-sky-400 font-semibold">
              &lt;/
              <span className="text-pink-400 font-bold">{rest}</span>
            </span>
          );
        }

        // Incomplete opening tag (e.g. < or <div)
        if (part.startsWith("<")) {
          const rest = part.slice(1);
          return (
            <span key={idx} className="text-sky-400 font-semibold">
              &lt;
              <span className="text-pink-400 font-bold">{rest}</span>
            </span>
          );
        }

        // Standard text content
        return (
          <span key={idx} className="text-slate-100 font-medium">
            {part}
          </span>
        );
      })}
    </span>
  );
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  cssCode,
  setCssCode,
  onReset,
  isHtmlMode,
  sizeMode = "desktop",
}) => {
  const isCompact = sizeMode === "compact";
  const scopedCss = getScopedCss(cssCode);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Split lines dynamically
  const lines = useMemo(() => {
    const rawLines = cssCode.split(/\r?\n/);
    return rawLines.length === 0 ? [""] : rawLines;
  }, [cssCode]);

  // Synchronize scroll of textarea with preview layer and line numbers gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = target.scrollTop;
      preRef.current.scrollLeft = target.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop;
    }
  };

  // Keyboard enhancements (Tab key inserts 2 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const next = cssCode.substring(0, start) + "  " + cssCode.substring(end);
      setCssCode(next);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <>
      {/* Scoped Dynamic Styles for Live Arena */}
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
        ${!isHtmlMode ? scopedCss : ""}
      `}</style>

      {/* Editor Box (Styled with macOS window dots, tab pill, line numbers gutter, and syntax highlighting) */}
      <div
        className={`rounded-2xl border-2 sm:border-3 border-slate-900 overflow-hidden bg-slate-950 flex flex-col ${
          isCompact
            ? "flex-1 shadow-[0_3px_0_#0f172a]"
            : "shadow-[0_5px_0_#0f172a]"
        }`}
      >
        {/* Editor Window Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            {/* macOS Window Dots */}
            <div className="flex items-center gap-1.5 pl-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-red-600/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-amber-600/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-emerald-600/80 inline-block" />
            </div>

            {/* Active Filename Tab Pill */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 text-[11px] font-mono font-medium border border-slate-700/60 ml-1">
              <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{isHtmlMode ? "index.html" : "style.css"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display font-black text-slate-400 tracking-wider uppercase hidden sm:inline">
              Kotak Jawaban
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] sm:text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50"
              title="Reset kode awal"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Editor Body: Line Numbers Gutter + Real-time Highlighted Canvas */}
        <div
          className={`flex font-mono text-xs sm:text-sm bg-[#0B0F19] ${
            isCompact ? "h-36 sm:h-44" : "h-64 sm:h-72"
          }`}
        >
          {/* 1. Line Numbers Gutter */}
          <div
            ref={lineNumbersRef}
            className="w-9 sm:w-11 select-none text-slate-600 text-right pr-2.5 border-r border-slate-800 bg-[#070A12] py-3 pl-1.5 overflow-hidden shrink-0"
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-6 h-6 font-mono text-xs sm:text-sm">
                {i + 1}
              </div>
            ))}
          </div>

          {/* 2. Interactive Code Canvas with Layered Syntax Highlighting */}
          <div className="relative flex-1 min-w-0 h-full overflow-hidden">
            {/* Syntax-Highlighted Preview (Underneath) */}
            <pre
              ref={preRef}
              aria-hidden="true"
              className="absolute inset-0 m-0 p-3 pointer-events-none whitespace-pre font-mono text-xs sm:text-sm leading-6 overflow-hidden select-none"
              style={{ tabSize: 2 }}
            >
              {lines.map((line, i) => (
                <div key={i} className="leading-6 h-6 whitespace-pre">
                  {line ? renderHighlightedCodeLine(line, !isHtmlMode) : <span>&nbsp;</span>}
                </div>
              ))}
            </pre>

            {/* Native Interactive Textarea (On Top) */}
            <textarea
              id={isCompact ? "code-editor-mobile" : "code-editor-desktop"}
              ref={textareaRef}
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="absolute inset-0 w-full h-full m-0 p-3 bg-transparent text-transparent caret-sky-400 placeholder:text-slate-600 focus:outline-none resize-none whitespace-pre font-mono text-xs sm:text-sm leading-6 overflow-auto selection:bg-sky-400/25 selection:text-transparent"
              placeholder={isHtmlMode ? "Ketik kode HTML di sini..." : ".arena {\n  display: flex;\n}"}
              style={{ tabSize: 2 }}
            />
          </div>
        </div>

        {/* Editor Footer / Helper Note */}
        <div className="px-3 py-1.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-medium shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate text-[10px] sm:text-[11px]">
              {isHtmlMode
                ? "Ketik tag lengkap dengan pembuka dan penutupnya."
                : "Tuliskan aturan CSS yang sesuai dengan target."}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
            {lines.length} baris
          </span>
        </div>
      </div>
    </>
  );
};
