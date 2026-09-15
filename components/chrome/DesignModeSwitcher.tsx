"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { DESIGN_MODES, DesignModeId } from "@/lib/theme/designModes";
import { cx } from "@/lib/utils";

// Per-mode labels for the trigger itself -- the switcher's own chrome should look like it
// belongs to whichever world is currently active, not like a settings widget bolted on top.
const TRIGGER_LABEL: Record<DesignModeId, string> = {
  editorial: "MODE",
  swiss: "MODE /",
  terminal: "$ mode",
  archive: "MODE —",
  kinetic: "MODE ◎",
};

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export function DesignModeSwitcher() {
  const { designMode, setDesignMode } = useAppearance();
  const [open, setOpen] = useState(false);
  const current = DESIGN_MODES.find((m) => m.id === designMode) ?? DESIGN_MODES[0];

  // Keyboard shortcuts 1-5, ignored while the visitor is typing anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= DESIGN_MODES.length) {
        setDesignMode(DESIGN_MODES[n - 1].id);
        setOpen(false);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDesignMode]);

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="Design mode"
            className="absolute bottom-full left-0 mb-2 w-[min(88vw,300px)] border border-border bg-background p-1.5"
          >
            {DESIGN_MODES.map((m) => {
              const isActive = m.id === designMode;
              return (
                <button
                  key={m.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setDesignMode(m.id);
                    setOpen(false);
                  }}
                  className={cx(
                    "flex w-full items-baseline justify-between gap-3 px-2.5 py-2 text-left font-meta text-[11px] uppercase tracking-widest transition-colors",
                    isActive ? "text-accent" : "text-muted-fg hover:text-foreground"
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="tabular-nums">{m.index}</span>
                    <span>{m.name}</span>
                  </span>
                  <span className="hidden text-[9px] tabular-nums text-muted-fg sm:inline">{m.index[1]}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-cursor="MODE"
        title={`Design mode: ${current.name} — ${current.descriptor} (press 1-5)`}
        className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-background/85 px-3 py-2 font-meta text-[10px] uppercase tracking-widest backdrop-blur transition-colors hover:border-foreground"
      >
        <span className="text-muted-fg">{TRIGGER_LABEL[designMode]}</span>
        <span className="text-foreground">{current.name}</span>
      </button>
    </div>
  );
}
