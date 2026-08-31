"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cx } from "@/lib/utils";

const ROWS = [
  { verb: "BUILD", caption: "SOFTWARE & SYSTEMS" },
  { verb: "ANALYZE", caption: "DATA & PATTERNS" },
  { verb: "DESIGN", caption: "VISUALS & TYPE" },
  { verb: "PLAY", caption: "SOUND & RHYTHM" },
];

export function IdentityCycler() {
  const [active, setActive] = useState(0);
  const hoveringRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      if (!hoveringRef.current) setActive((a) => (a + 1) % ROWS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => (hoveringRef.current = true)}
      onMouseLeave={() => (hoveringRef.current = false)}
    >
      {ROWS.map((row, i) => {
        const isActive = i === active;
        return (
          <button
            key={row.verb}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="group relative flex w-full items-baseline gap-4 border-b border-border py-2 text-left sm:gap-8 sm:py-3"
            data-cursor="EXPLORE"
          >
            <span className="w-6 shrink-0 font-meta text-[11px] text-muted-fg sm:w-8">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={cx(
                "font-display uppercase leading-[0.9] tracking-tight transition-[color] duration-300 will-change-transform"
              )}
              style={{
                fontSize: "clamp(2.4rem, 9vw, 6.5rem)",
                transform: isActive ? "scale(1)" : "scale(0.62)",
                transformOrigin: "left center",
                color: isActive ? "var(--accent)" : "var(--fg)",
                opacity: isActive ? 1 : 0.42,
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), color 0.4s ease, opacity 0.4s ease",
              }}
            >
              I {row.verb}
            </span>
            <motion.span
              className="ml-auto hidden shrink-0 font-meta text-[11px] text-muted-fg sm:block"
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 12 }}
              transition={{ duration: 0.35 }}
            >
              {row.caption}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
