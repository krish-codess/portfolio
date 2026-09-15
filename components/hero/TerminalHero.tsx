"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { IDENTITY } from "@/data/site-config";

const LINES = [IDENTITY.tagline, "SOFTWARE DEVELOPER", "DESIGNER", "DRUMMER / MUSIC LISTENER"];
const LINE_DELAY_MS = 380;

export function TerminalHero() {
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(reducedMotion ? LINES.length : 0);

  useEffect(() => {
    if (reducedMotion || revealed >= LINES.length) return;
    const t = window.setTimeout(() => setRevealed((n) => n + 1), LINE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [revealed, reducedMotion]);

  const shown = reducedMotion ? LINES.length : revealed;

  return (
    <div className="flex flex-1 flex-col justify-center py-10 font-meta sm:py-16">
      <h1 className="sr-only">{IDENTITY.full} — {IDENTITY.tagline}, Software Developer &amp; Designer</h1>

      <div aria-hidden="true" className="mx-auto w-full max-w-2xl">
        <div className="text-[13px] uppercase tracking-wide text-muted-fg sm:text-[15px]">
          <span className="text-accent">krish@portfolio</span>:~$ whoami
        </div>

        <div className="mt-6 space-y-3">
          {LINES.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0 }}
              animate={{ opacity: i < shown ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="uppercase tracking-tight text-foreground"
              style={{ fontSize: i === 0 ? "clamp(1.6rem, 5vw, 3rem)" : "clamp(1rem, 3vw, 1.6rem)" }}
            >
              {i < shown ? line : ""}
            </motion.div>
          ))}
        </div>

        <motion.span
          aria-hidden="true"
          className="mt-6 inline-block h-5 w-2.5 bg-accent align-middle sm:h-6 sm:w-3"
          animate={reducedMotion ? {} : { opacity: [1, 1, 0, 0] }}
          transition={reducedMotion ? {} : { duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      </div>
    </div>
  );
}
