"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DataFigure, HeatmapData, NetworkData, XYPoint, CategoryPoint } from "@/data/data-figures";
import { ScatterChart } from "./ScatterChart";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { RadialChart } from "./RadialChart";
import { HeatmapChart } from "./HeatmapChart";
import { NetworkChart } from "./NetworkChart";
import { StreamChart } from "./StreamChart";

const SPAN_CLASSES: Record<DataFigure["size"], string> = {
  small: "col-span-2 sm:col-span-3 lg:col-span-2",
  medium: "col-span-2 sm:col-span-3 lg:col-span-3",
  wide: "col-span-2 sm:col-span-6 lg:col-span-4",
  featured: "col-span-2 sm:col-span-6 lg:col-span-6 lg:row-span-2",
};

const HEIGHT_CLASSES: Record<DataFigure["size"], string> = {
  small: "min-h-[220px]",
  medium: "min-h-[260px]",
  wide: "min-h-[260px]",
  featured: "min-h-[300px] lg:min-h-[540px]",
};

const TITLE_SIZE: Record<DataFigure["size"], string> = {
  small: "clamp(1.1rem, 2.4vw, 1.4rem)",
  medium: "clamp(1.2rem, 2.6vw, 1.6rem)",
  wide: "clamp(1.3rem, 2.8vw, 1.8rem)",
  featured: "clamp(1.6rem, 3.6vw, 2.6rem)",
};

export function DataCard({ figure, index }: { figure: DataFigure; index: number }) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col border border-border p-4 sm:p-5 ${SPAN_CLASSES[figure.size]} ${HEIGHT_CLASSES[figure.size]}`}
      data-cursor="INSPECT"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-meta text-[10px] uppercase tracking-widest text-accent">
            FIG. {figure.fig} <span className="text-muted-fg">/ {figure.dataset.split("/ ")[1] ?? figure.dataset}</span>
          </div>
          <h3
            className="mt-1.5 font-display uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: TITLE_SIZE[figure.size] }}
          >
            {figure.title}
          </h3>
          {figure.subtitle && (
            <p className="mt-1 truncate font-meta text-[9px] uppercase tracking-wide text-muted-fg">{figure.subtitle}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="font-meta text-[8px] uppercase tracking-widest text-muted-fg">{figure.status}</div>
          <div className="mt-1 min-h-[14px] font-meta text-[10px] text-accent">{hoverLabel ?? ""}</div>
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1">
        {figure.type === "scatter" && (
          <ScatterChart data={figure.data as XYPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={setHoverLabel} />
        )}
        {figure.type === "line" && (
          <LineChart data={figure.data as XYPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={setHoverLabel} />
        )}
        {figure.type === "bar" && (
          <BarChart data={figure.data as CategoryPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={setHoverLabel} />
        )}
        {figure.type === "radial" && (
          <RadialChart data={figure.data as CategoryPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={setHoverLabel} />
        )}
        {figure.type === "heatmap" && <HeatmapChart data={figure.data as HeatmapData} onHover={setHoverLabel} />}
        {figure.type === "network" && <NetworkChart data={figure.data as NetworkData} onHover={setHoverLabel} />}
        {figure.type === "stream" && (
          <StreamChart data={figure.data as XYPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={setHoverLabel} />
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-border pt-2.5">
        <p className="font-meta text-[9px] uppercase leading-snug text-muted-fg">{figure.observation}</p>
        <span className="shrink-0 font-meta text-[9px] text-muted-fg">{figure.date}</span>
      </div>
    </motion.article>
  );
}
