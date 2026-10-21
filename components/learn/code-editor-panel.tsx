"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
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

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  cssCode,
  setCssCode,
  onReset,
  isHtmlMode,
  sizeMode = "desktop",
}) => {
  const isCompact = sizeMode === "compact";
  const scopedCss = getScopedCss(cssCode);

  return (
    <>
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

      {/* Code Editor Window Header */}
      {!isCompact && (
        <div className="flex items-center justify-between pt-1">
          <span className="font-display font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            {isHtmlMode ? "HTML Editor" : "CSS Editor"}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-display font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset kode awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Editor Box */}
      <div
        className={`rounded-2xl border-3 border-slate-900 overflow-hidden bg-[#1e1e2e] flex flex-col ${
          isCompact
            ? "flex-1 shadow-[0_4px_0_#0f172a]"
            : "shadow-[0_6px_0_#0f172a]"
        }`}
      >
        <div className="bg-[#181825] px-3 py-1.5 sm:py-2 border-b border-[#313244] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] sm:text-[11px] font-mono text-[#a6adc8] ml-1 sm:ml-1.5">
              {isHtmlMode ? "index.html" : "style.css"}
            </span>
          </div>
          {isCompact ? (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] font-bold text-[#a6adc8] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          ) : (
            <span className="text-[10px] font-mono text-[#6c7086]">Live Eval</span>
          )}
        </div>

        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          rows={isCompact ? undefined : 8}
          spellCheck={false}
          className={`w-full bg-transparent text-[#cdd6f4] font-mono focus:outline-none resize-none leading-relaxed ${
            isCompact
              ? "flex-1 p-2 text-xs overflow-y-auto"
              : "p-3 sm:p-4 text-xs sm:text-sm"
          }`}
          placeholder={isHtmlMode ? "Ketik kode HTML di sini..." : ".arena {\n  display: flex;\n}"}
        />
      </div>
    </>
  );
};
