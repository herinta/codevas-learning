"use client";

import React, { useState } from "react";
import { Terminal, RefreshCw, Star, Sparkles, Smile, Heart, Zap } from "lucide-react";

export const InteractiveDemo: React.FC = () => {
  const [justifyContent, setJustifyContent] = useState<
    "space-between" | "center" | "flex-start" | "space-around"
  >("space-between");

  const [alignItems, setAlignItems] = useState<"center" | "flex-start" | "flex-end">(
    "center"
  );

  const [gap, setGap] = useState<number>(16);

  const resetValues = () => {
    setJustifyContent("space-between");
    setAlignItems("center");
    setGap(16);
  };

  return (
    <section className="py-20 px-4 bg-[#BAE6FD] border-y-4 border-slate-900 relative" id="demo">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-4 py-1.5 rounded-full bg-[#FEF08A] border-3 border-slate-900 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_3px_0_#0f172a] inline-flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-slate-900" />
            <span>Interactive Demo</span>
          </span>
          <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
            CSS Flexbox Playground
          </h2>
          <p className="mt-3 text-base sm:text-lg font-medium text-slate-800">
            Ubah properti flexbox di panel kontrol dan perhatikan posisi elemen di kanvas secara real-time.
          </p>
        </div>

        {/* Mini Split-Screen Interactive Playground Card */}
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_12px_0_#0f172a] overflow-hidden">
          {/* Playground Top Bar */}
          <div className="bg-[#FEF08A] px-5 py-3.5 border-b-3 border-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-slate-900">
                style.css
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">
                CSS Flexbox Controller
              </span>
              <button
                onClick={resetValues}
                className="px-3.5 py-1.5 rounded-full bg-white text-xs font-mono font-bold border-2 border-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-[0_2px_0_#0f172a] active:translate-y-0.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-800" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            {/* LEFT: Controls & Code Snippet (5 Cols) */}
            <div className="lg:col-span-5 p-6 border-b-3 lg:border-b-0 lg:border-r-3 border-slate-900 bg-[#FFFDF7] flex flex-col justify-between">
              <div className="space-y-6">
                {/* Control 1: Justify Content */}
                <div>
                  <label className="block font-mono font-bold text-xs text-slate-900 mb-2">
                    justify-content:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "space-between",
                        "center",
                        "flex-start",
                        "space-around",
                      ] as const
                    ).map((val) => {
                      const isActive = justifyContent === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setJustifyContent(val)}
                          className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold border-2 border-slate-900 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#EF4444] text-white shadow-[0_3px_0_#991b1b] scale-[1.02]"
                              : "bg-white text-slate-800 hover:bg-[#FEF08A] shadow-[0_2px_0_#0f172a]"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Control 2: Align Items */}
                <div>
                  <label className="block font-mono font-bold text-xs text-slate-900 mb-2">
                    align-items:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        "center",
                        "flex-start",
                        "flex-end",
                      ] as const
                    ).map((val) => {
                      const isActive = alignItems === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setAlignItems(val)}
                          className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold border-2 border-slate-900 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#3B82F6] text-white shadow-[0_3px_0_#1e3a8a] scale-[1.02]"
                              : "bg-white text-slate-800 hover:bg-[#BAE6FD] shadow-[0_2px_0_#0f172a]"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Control 3: Gap Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono font-bold text-xs text-slate-900">
                      gap:
                    </label>
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 bg-[#FEF08A] rounded-full border border-slate-900 text-slate-900">
                      {gap}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={gap}
                    onChange={(e) => setGap(Number(e.target.value))}
                    className="w-full accent-[#EF4444] cursor-pointer h-3 bg-slate-200 rounded-lg border-2 border-slate-900"
                  />
                </div>
              </div>

              {/* Code Preview Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs border-2 border-slate-900 shadow-inner leading-relaxed">
                <span className="text-[#38BDF8] font-bold">.flex-container</span> &#123;
                <br />
                &nbsp;&nbsp;display: <span className="text-[#F472B6] font-bold">flex</span>;
                <br />
                &nbsp;&nbsp;justify-content:{" "}
                <span className="text-[#FACC15] font-black">
                  {justifyContent}
                </span>
                ;
                <br />
                &nbsp;&nbsp;align-items:{" "}
                <span className="text-[#FACC15] font-black">{alignItems}</span>;
                <br />
                &nbsp;&nbsp;gap:{" "}
                <span className="text-[#4ADE80] font-black">{gap}px</span>;
                <br />
                &#125;
              </div>
            </div>

            {/* RIGHT: Live Visual Canvas (7 Cols) */}
            <div className="lg:col-span-7 p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse border border-slate-900"></span>
                    Live Canvas Preview
                  </span>
                  <span className="text-xs font-mono font-black text-slate-900 bg-[#FEF08A] px-3 py-1 rounded-full border border-slate-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                    <span>Real-Time 60 FPS</span>
                  </span>
                </div>

                {/* Target Playground Box with Soft Dots Pattern */}
                <div
                  className="w-full min-h-[300px] bg-[#F8FAFC] rounded-3xl border-3 border-dashed border-slate-400 p-6 flex flex-row transition-all duration-300 relative overflow-hidden"
                  style={{
                    justifyContent,
                    alignItems,
                    gap: `${gap}px`,
                  }}
                >
                  {/* Item 1 */}
                  <div className="w-24 h-26 rounded-2xl bg-[#EF4444] text-white border-3 border-slate-900 shadow-[0_4px_0_#991b1b] flex flex-col items-center justify-center p-2 text-center transform transition-all hover:scale-105 cursor-pointer shrink-0">
                    <span className="font-mono font-black text-sm">
                      Item 1
                    </span>
                    <span className="text-[10px] font-mono opacity-90 bg-black/20 px-1.5 py-0.2 rounded mt-1">#01</span>
                  </div>

                  {/* Item 2 */}
                  <div className="w-24 h-30 rounded-2xl bg-[#3B82F6] text-white border-3 border-slate-900 shadow-[0_4px_0_#1e3a8a] flex flex-col items-center justify-center p-2 text-center transform transition-all hover:scale-105 cursor-pointer shrink-0">
                    <span className="font-mono font-black text-sm">
                      Item 2
                    </span>
                    <span className="text-[10px] font-mono opacity-90 bg-black/20 px-1.5 py-0.2 rounded mt-1">#02</span>
                  </div>

                  {/* Item 3 */}
                  <div className="w-24 h-24 rounded-2xl bg-[#FACC15] text-slate-900 border-3 border-slate-900 shadow-[0_4px_0_#ca8a04] flex flex-col items-center justify-center p-2 text-center transform transition-all hover:scale-105 cursor-pointer shrink-0">
                    <span className="font-mono font-black text-sm">
                      Item 3
                    </span>
                    <span className="text-[10px] font-mono opacity-90 bg-black/10 px-1.5 py-0.2 rounded mt-1">#03</span>
                  </div>
                </div>
              </div>

              {/* Hint below canvas */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 font-medium gap-2">
                <span>
                  💡 <strong>Info:</strong> Klik tombol properti di sebelah kiri untuk melihat tata letak flexbox berubah seketika.
                </span>
                <span className="font-mono text-[#EF4444] font-black shrink-0">
                  ⚡ Real-Time Render
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
