"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { THEMES } from "@/lib/theme/themes";
import { cx } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="fixed bottom-5 left-5 z-30 lg:bottom-6 lg:left-6">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Change theme"
        className="flex items-center gap-2 border border-border bg-background/85 px-3 py-2 font-meta text-[10px] uppercase tracking-widest backdrop-blur"
      >
        <span className="text-muted-fg">VISUAL MODE</span>
        <span className="text-foreground">{current.index}</span>
        <span className="audio-pulse-target inline-block h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full mb-2 w-56 border border-border bg-background/95 backdrop-blur"
          >
            <ul>
              {THEMES.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={cx(
                      "flex w-full flex-col items-start gap-0.5 border-b border-border px-3 py-2.5 text-left hover:bg-background-alt",
                      t.id === theme && "bg-background-alt"
                    )}
                  >
                    <span className="font-meta text-[10px] tracking-widest text-muted-fg">
                      {t.index} {t.id === theme && "· ACTIVE"}
                    </span>
                    <span className="font-display text-sm uppercase">{t.name}</span>
                    <span className="font-meta text-[9px] text-muted-fg">{t.descriptor}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                const others = THEMES.filter((t) => t.id !== theme);
                const pick = others[Math.floor(Math.random() * others.length)] ?? THEMES[0];
                setTheme(pick.id);
              }}
              className="w-full px-3 py-2.5 text-left font-meta text-[10px] uppercase tracking-widest text-accent hover:bg-background-alt"
            >
              [ RANDOMIZE ↺ ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
