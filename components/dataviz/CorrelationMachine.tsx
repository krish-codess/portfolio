"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CORRELATION_VARIABLES, generateCorrelation, interpretR, CorrelationResult } from "@/lib/correlationEngine";
import { ScatterChart } from "./ScatterChart";
import { Meta } from "@/components/typography/Meta";

export function CorrelationMachine() {
  const [varA, setVarA] = useState<string>(CORRELATION_VARIABLES[2]);
  const [varB, setVarB] = useState<string>(CORRELATION_VARIABLES[13]);
  const [result, setResult] = useState<CorrelationResult | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  function generate() {
    setResult(generateCorrelation(varA, varB));
    setRunCount((c) => c + 1);
  }

  return (
    <div className="border border-border p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Meta className="text-accent">EXPERIMENT / 01</Meta>
          <h3 className="mt-2 font-display uppercase leading-[0.95] tracking-tight" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}>
            CORRELATION
            <br />
            MACHINE
          </h3>
        </div>
        <Meta>EXPERIMENTAL DATA</Meta>
      </div>

      <p className="mt-4 max-w-lg font-meta text-[11px] leading-relaxed text-muted-fg">
        Pick two variables. The machine generates an illustrative dataset and fits a line through it.
        Nothing here is measured -- it is a demonstration of the tool, not a claim about my life.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <label className="flex-1">
          <span className="block font-meta text-[10px] uppercase tracking-widest text-muted-fg">CORRELATE</span>
          <select
            value={varA}
            onChange={(e) => setVarA(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2 font-display text-lg uppercase tracking-tight outline-none"
          >
            {CORRELATION_VARIABLES.filter((v) => v !== varB).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <span className="hidden pb-3 font-meta text-xs text-muted-fg sm:block">WITH</span>

        <label className="flex-1">
          <span className="block font-meta text-[10px] uppercase tracking-widest text-muted-fg">WITH</span>
          <select
            value={varB}
            onChange={(e) => setVarB(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2 font-display text-lg uppercase tracking-tight outline-none"
          >
            {CORRELATION_VARIABLES.filter((v) => v !== varA).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={generate}
          className="shrink-0 border border-border px-6 py-3 font-meta text-[11px] uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
        >
          GENERATE ↗
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={runCount}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-8">
              <div className="h-[260px] sm:h-[320px]">
                <ScatterChart data={result.points} xLabel={varA} yLabel={varB} onHover={setHoverLabel} />
              </div>
              <div className="mt-2 font-meta text-[10px] text-accent">{hoverLabel ?? " "}</div>
            </div>
            <div className="flex flex-col justify-between lg:col-span-4">
              <div>
                <Meta>PEARSON r</Meta>
                <div className="mt-1 font-display text-5xl tracking-tight">
                  {result.r > 0 ? "+" : ""}
                  {result.r.toFixed(2)}
                </div>
                <p className="mt-3 font-meta text-[11px] uppercase tracking-wide text-foreground">{interpretR(result.r)}</p>
              </div>
              <p className="mt-6 border-t border-border pt-4 font-meta text-[10px] leading-relaxed text-muted-fg">
                CORRELATION DOES NOT IMPLY CAUSATION. {varA} AND {varB} HAVE NEVER MET.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
