"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DataFigure } from "@/data/data-figures";
import { ChartRenderer } from "./ChartRenderer";
import { Meta } from "@/components/typography/Meta";

function ModalContent({ figure, index, onClose }: { figure: DataFigure; index: number; onClose: () => void }) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="paper-stack relative grid w-full max-w-3xl grid-cols-1 gap-6 rounded-[var(--radius)] border border-border bg-background p-6 sm:grid-cols-12 sm:p-8"
    >
      <div className="sm:col-span-4">
        <Meta className="text-accent">FIG. {figure.fig}</Meta>
        <h3 className="mt-3 font-display uppercase leading-[0.95] tracking-tight" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}>
          {figure.title}
        </h3>
        {figure.subtitle && <p className="mt-2 font-meta text-[10px] uppercase tracking-wide text-muted-fg">{figure.subtitle}</p>}

        <dl className="mt-6 space-y-3 border-t border-border pt-4 font-meta text-[10px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-fg">OBSERVATION</dt>
            <dd className="text-right text-foreground">{figure.observation}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-fg">STATUS</dt>
            <dd className="text-right text-accent">{figure.status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-fg">DATASET</dt>
            <dd className="text-right text-foreground">{figure.dataset}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-fg">DATE</dt>
            <dd className="text-right text-foreground">{figure.date}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-fg">SOURCE</dt>
            <dd className="text-right text-foreground">{figure.source}</dd>
          </div>
        </dl>

        <div className="mt-6 min-h-[16px] font-meta text-[10px] text-accent">{hoverLabel ?? ""}</div>
      </div>

      <div className="flex min-h-[260px] sm:col-span-8 sm:min-h-[360px]">
        <div className="flex-1">
          <ChartRenderer figure={figure} index={index} onHover={setHoverLabel} />
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 font-meta text-lg text-muted-fg hover:text-foreground sm:right-6 sm:top-6"
      >
        ×
      </button>
    </motion.div>
  );
}

export function DataFigureModal({
  figure,
  index,
  onClose,
}: {
  figure: DataFigure | null;
  index: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {figure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${figure.title}, expanded`}
        >
          <ModalContent key={figure.id} figure={figure} index={index} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
