"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DataFigure } from "@/data/data-figures";
import { ChartRenderer } from "./ChartRenderer";

const SPAN_CLASSES: Record<DataFigure["size"], string> = {
  small: "col-span-1",
  medium: "col-span-1",
  wide: "col-span-2",
  featured: "col-span-2",
};

const HEIGHT_CLASSES: Record<DataFigure["size"], string> = {
  small: "min-h-[148px]",
  medium: "min-h-[192px]",
  wide: "min-h-[150px]",
  featured: "min-h-[230px]",
};

const TITLE_SIZE: Record<DataFigure["size"], string> = {
  small: "clamp(0.85rem, 1.6vw, 1.05rem)",
  medium: "clamp(0.9rem, 1.8vw, 1.15rem)",
  wide: "clamp(0.95rem, 1.8vw, 1.2rem)",
  featured: "clamp(1.15rem, 2.4vw, 1.6rem)",
};

export function DataCard({
  figure,
  index,
  onExpand,
}: {
  figure: DataFigure;
  index: number;
  onExpand: () => void;
}) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const compact = figure.size === "small";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.25), ease: [0.16, 1, 0.3, 1] }}
      className={`paper-stack group relative flex flex-col rounded-[var(--radius)] border border-border/70 p-2.5 transition-colors hover:border-border sm:p-3 ${SPAN_CLASSES[figure.size]} ${HEIGHT_CLASSES[figure.size]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-meta text-[8px] uppercase tracking-widest text-accent">FIG. {figure.fig}</div>
          <h3
            className="mt-1 font-display uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: TITLE_SIZE[figure.size] }}
          >
            {figure.title}
          </h3>
        </div>
        <button
          onClick={onExpand}
          data-cursor="EXPAND"
          aria-label={`Expand ${figure.title}`}
          className="shrink-0 border border-border/0 px-1.5 py-0.5 font-meta text-[10px] text-muted-fg opacity-0 transition-opacity hover:text-accent group-hover:opacity-100 group-focus-within:opacity-100"
        >
          +
        </button>
      </div>

      <div className="mt-1.5 min-h-0 flex-1">
        <ChartRenderer figure={figure} index={index} onHover={setHoverLabel} />
      </div>

      {!compact && (
        <div className="mt-1.5 flex items-end justify-between gap-2 font-meta text-[8px] uppercase leading-snug text-muted-fg">
          <span className="truncate">{hoverLabel ?? figure.observation}</span>
          <span className="shrink-0 text-accent">{figure.status.split(" ")[0]}</span>
        </div>
      )}
    </motion.article>
  );
}
