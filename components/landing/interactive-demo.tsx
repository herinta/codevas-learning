"use client";

import React, { useState } from "react";
import { Terminal, RefreshCw, Star, Code, Layers, Sparkles } from "lucide-react";

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
    <section className="py-20 px-4 bg-[#6EE7B7] border-y-4 border-on-surface relative" id="demo">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-4 py-1.5 rounded-full bg-surface-container-lowest border-2 border-on-surface text-on-surface font-display font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#2e1a28]">
            Uji Coba Langsung
          </span>
          <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight">
            Coba Atur Layout Sendiri!
          </h2>
          <p className="mt-3 text-base sm:text-lg font-medium text-on-surface/85">
            Pilih properti CSS Flexbox di sebelah kiri dan perhatikan perubahan instan di kanvas sebelah kanan.
          </p>
        </div>

        {/* Mini Split-Screen Interactive Playground Card */}
        <div className="bg-surface-container-lowest rounded-2xl border-4 border-on-surface shadow-[0_12px_0_#2e1a28] overflow-hidden">
          {/* Playground Top Bar */}
          <div className="bg-surface-container-high px-4 py-3 border-b-2 border-on-surface flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-secondary" />
              <span className="font-mono text-sm font-bold text-on-surface">
                playground_mini.css
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-label font-bold text-on-surface-variant hidden sm:inline">
                Live CSS Controller
              </span>
              <button
                onClick={resetValues}
                className="px-3 py-1 rounded-full bg-surface-container-lowest text-xs font-bold border border-on-surface hover:bg-surface-container transition-all flex items-center gap-1.5 shadow-[0_2px_0_#2e1a28] active:translate-y-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-secondary" />
                <span>Reset Nilai</span>
              </button>
            </div>
          </div>

          {/* Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            {/* LEFT: Controls & Code Snippet (5 Cols) */}
            <div className="lg:col-span-5 p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface bg-surface-container-low flex flex-col justify-between">
              <div className="space-y-6">
                {/* Control 1: Justify Content */}
                <div>
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-on-surface mb-2">
                    1. justify-content:
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
                          className={`px-3 py-2 rounded-xl text-xs font-bold border-2 border-on-surface transition-all ${
                            isActive
                              ? "bg-primary text-white shadow-[0_3px_0_#2e1a28] scale-[1.02]"
                              : "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_2px_0_#2e1a28]"
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
                  <label className="block font-display font-bold text-xs uppercase tracking-wider text-on-surface mb-2">
                    2. align-items:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { key: "center", label: "center" },
                        { key: "flex-start", label: "start" },
                        { key: "flex-end", label: "end" },
                      ] as const
                    ).map(({ key, label }) => {
                      const isActive = alignItems === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setAlignItems(key)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border-2 border-on-surface transition-all ${
                            isActive
                              ? "bg-primary text-white shadow-[0_3px_0_#2e1a28] scale-[1.02]"
                              : "bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[0_2px_0_#2e1a28]"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Control 3: Gap Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-display font-bold text-xs uppercase tracking-wider text-on-surface">
                      3. gap (jarak antar candy):
                    </label>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-surface-container-highest rounded border border-on-surface">
                      {gap}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={gap}
                    onChange={(e) => setGap(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer h-2 bg-surface-container-highest rounded-lg border border-on-surface"
                  />
                </div>
              </div>

              {/* Code Preview Box */}
              <div className="mt-6 p-3.5 rounded-xl bg-on-surface text-surface-container-lowest font-mono text-xs border border-outline-variant shadow-inner">
                <span className="text-[#f080c0]">.candy-container</span> &#123;
                <br />
                &nbsp;&nbsp;display: <span className="text-[#80d0f0]">flex</span>;
                <br />
                &nbsp;&nbsp;justify-content:{" "}
                <span className="text-[#ffd600] font-bold">
                  {justifyContent}
                </span>
                ;
                <br />
                &nbsp;&nbsp;align-items:{" "}
                <span className="text-[#ffd600] font-bold">{alignItems}</span>;
                <br />
                &nbsp;&nbsp;gap:{" "}
                <span className="text-[#ffd600] font-bold">{gap}px</span>;
                <br />
                &#125;
              </div>
            </div>

            {/* RIGHT: Live Visual Canvas (7 Cols) */}
            <div className="lg:col-span-7 p-6 bg-surface-container-lowest flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label font-bold text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Visual Render Canvas (Flex Parent)
                  </span>
                  <span className="text-xs font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full border border-secondary/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Live Preview</span>
                  </span>
                </div>

                {/* Target Playground Box with Blueprint Grid */}
                <div
                  className="w-full min-h-[300px] bg-surface-container rounded-2xl border-2 border-dashed border-outline p-6 flex flex-row transition-all duration-300 blueprint-grid"
                  style={{
                    justifyContent,
                    alignItems,
                    gap: `${gap}px`,
                  }}
                >
                  {/* Item 1: Candy Pink */}
                  <div className="w-20 sm:w-24 h-24 rounded-2xl bg-primary text-white border-2 border-on-surface shadow-[0_4px_0_#2e1a28] flex flex-col items-center justify-center p-2 text-center transform transition-all hover:scale-105 cursor-pointer shrink-0">
                    <Star className="w-6 h-6 fill-white" />
                    <span className="font-display font-black text-xs mt-1">
                      Item 01
                    </span>
                    <span className="text-[10px] font-mono opacity-80">CSS</span>
                  </div>

                  {/* Item 2: Candy Purple */}
                  <div className="w-20 sm:w-24 h-28 rounded-2xl bg-secondary text-white border-2 border-on-surface shadow-[0_4px_0_#2e1a28] flex flex-col items-center justify-center p-2 text-center transform transition-all hover:scale-105 cursor-pointer shrink-0">
                    <Code className="w-6 h-6" />
                    <span className="font-display font-black text-xs mt-1">
                      Item 02
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      React
                    </span>
                  </div>

                  {/* Item 3: Candy Sky Blue */}
                  <div className="w-20 sm:w-24 h-20 rounded-2xl bg-tertiary text-white border-2 border-on-surface shadow-[0_4px_0_#2e1a28] flex flex-col items-center justify-center p-2 text-center transform transition-all hover:scale-105 cursor-pointer shrink-0">
                    <Layers className="w-6 h-6" />
                    <span className="font-display font-black text-xs mt-1">
                      Item 03
                    </span>
                    <span className="text-[10px] font-mono opacity-80">Flex</span>
                  </div>
                </div>
              </div>

              {/* Hint below canvas */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-on-surface-variant font-medium gap-2">
                <span>
                  💡 Klik tombol di sebelah kiri untuk melihat kotak berpindah
                  posisi secara langsung.
                </span>
                <span className="font-mono text-primary font-bold shrink-0">
                  100% Client-Side Render
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
