"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DATA_FIGURES } from "@/data/data-figures";
import { PLAYLISTS } from "@/data/playlists";
import { ChartRenderer } from "@/components/dataviz/ChartRenderer";
import { Meta } from "@/components/typography/Meta";
import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { DesignModeId } from "@/lib/theme/designModes";

type Result = { kind: "data"; index: number } | { kind: "music"; index: number };

// The control is the same feature everywhere (random data figure OR a real playlist -- never
// an invented song) -- only the label changes to match the active mode's own vocabulary.
const RANDOM_LABEL: Record<DesignModeId, string> = {
  editorial: "RANDOM ↗",
  swiss: "RANDOM / 01",
  terminal: "$ random",
  archive: "RANDOM ENTRY",
  kinetic: "⟳ RANDOM",
};

function scrollToData() {
  document.getElementById("data")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToMusic() {
  document.getElementById("music")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Visible on the page, not tucked into a menu -- one click surfaces either a random data
// artifact or a random playlist recommendation. Both outcomes render with whatever
// color/design mode is currently active, so the result always belongs to the site.
export function SurpriseMe() {
  const { designMode } = useAppearance();
  const [result, setResult] = useState<Result | null>(null);
  const [open, setOpen] = useState(false);

  function roll() {
    const wantsData = Math.random() < 0.5;
    if (wantsData) {
      setResult({ kind: "data", index: Math.floor(Math.random() * DATA_FIGURES.length) });
    } else {
      setResult({ kind: "music", index: Math.floor(Math.random() * PLAYLISTS.length) });
    }
    setOpen(true);
  }

  const figure = result?.kind === "data" ? DATA_FIGURES[result.index] : null;
  const playlist = result?.kind === "music" ? PLAYLISTS[result.index] : null;

  return (
    <div className="fixed bottom-5 right-5 z-30 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {open && (figure || playlist) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="paper-stack absolute bottom-full right-0 mb-2 w-[min(88vw,340px)] rounded-[var(--radius)] border border-border bg-background p-4"
          >
            <div className="flex items-center justify-between">
              <Meta className="text-accent">{figure ? "DATA ARTIFACT" : "FROM THE PLAYLISTS"}</Meta>
              <button onClick={() => setOpen(false)} aria-label="Dismiss" className="font-meta text-sm text-muted-fg hover:text-foreground">
                ×
              </button>
            </div>

            {figure && (
              <>
                <div className="mt-2 font-meta text-[9px] uppercase tracking-widest text-muted-fg">FIG. {figure.fig}</div>
                <h4 className="mt-1 font-display text-lg uppercase leading-none tracking-tight">{figure.title}</h4>
                <div className="mt-3 h-[110px]">
                  <ChartRenderer figure={figure} index={result!.index} />
                </div>
                <p className="mt-2 font-meta text-[9px] uppercase leading-relaxed text-muted-fg">{figure.observation}</p>
                <button onClick={scrollToData} data-cursor="OPEN ↗" className="mt-3 font-meta text-[10px] text-accent">
                  VIEW IN THE DATA LAB ↗
                </button>
              </>
            )}

            {playlist && (
              <>
                <div className="mt-2 font-meta text-[9px] uppercase tracking-widest text-muted-fg">PLAYLIST / {playlist.index}</div>
                <h4 className="mt-1 font-display text-lg uppercase leading-none tracking-tight">{playlist.title}</h4>
                <p className="mt-2 font-meta text-[9px] uppercase leading-relaxed text-muted-fg">{playlist.description}</p>
                {playlist.url ? (
                  <a href={playlist.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN ↗" className="mt-3 inline-block font-meta text-[10px] text-accent">
                    OPEN / LISTEN ↗
                  </a>
                ) : (
                  <button onClick={scrollToMusic} data-cursor="OPEN ↗" className="mt-3 font-meta text-[10px] text-accent">
                    SEE ALL PLAYLISTS ↗
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={roll}
        data-cursor="ROLL"
        className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-background/85 px-3 py-2 font-meta text-[10px] uppercase tracking-widest backdrop-blur transition-colors hover:border-accent hover:text-accent"
      >
        <span>{RANDOM_LABEL[designMode]}</span>
      </button>
    </div>
  );
}
