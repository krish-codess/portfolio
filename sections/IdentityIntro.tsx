"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { cx } from "@/lib/utils";

const ITEMS = [
  { id: "data", label: "DATA", tagline: "PATTERNS IN NOISE" },
  { id: "code", label: "CODE", tagline: "SYSTEMS THAT RUN" },
  { id: "design", label: "DESIGN", tagline: "FORM WITH INTENT" },
  { id: "music", label: "MUSIC", tagline: "TIME, ORGANIZED" },
] as const;

function DataDecoration() {
  const points = [8, 22, 14, 30, 18, 34, 26, 40, 30];
  return (
    <svg viewBox="0 0 120 48" className="h-12 w-32">
      <polyline
        points={points.map((p, i) => `${i * 15},${48 - p}`).join(" ")}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={i * 15}
          cy={48 - p}
          r={2}
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
        />
      ))}
    </svg>
  );
}

function CodeDecoration() {
  const lines = ["const build = () => {", "  return curiosity", "}"];
  return (
    <div className="font-meta text-[11px] leading-relaxed text-accent">
      {lines.map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          {l}
          {i === lines.length - 1 && <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-accent align-middle" />}
        </motion.div>
      ))}
    </div>
  );
}

function DesignDecoration() {
  const shapes = [
    { shape: "circle", x: 0 },
    { shape: "square", x: 26 },
    { shape: "triangle", x: 52 },
  ];
  return (
    <div className="relative h-12 w-24">
      {shapes.map((s, i) => (
        <motion.div
          key={s.shape}
          className="absolute top-1/2"
          style={{ left: s.x }}
          initial={{ y: 0, rotate: 0 }}
          animate={{ y: [-6, 6, -2, 0][i % 4], rotate: i % 2 ? 45 : -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {s.shape === "circle" && <span className="block h-5 w-5 -translate-y-1/2 rounded-full border border-accent" />}
          {s.shape === "square" && <span className="block h-5 w-5 -translate-y-1/2 border border-accent" />}
          {s.shape === "triangle" && (
            <span
              className="block -translate-y-1/2"
              style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "17px solid var(--accent)" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function MusicDecoration() {
  const bars = [6, 14, 22, 12, 28, 18, 9, 24];
  return (
    <div className="flex h-12 items-end gap-1">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1.5 bg-accent"
          initial={{ height: 4 }}
          animate={{ height: [4, h, 6, h * 0.7, 4] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const DECORATIONS: Record<string, React.ComponentType> = {
  data: DataDecoration,
  code: CodeDecoration,
  design: DesignDecoration,
  music: MusicDecoration,
};

export function IdentityIntro() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="—" label="FOUR DISCIPLINES, ONE SYSTEM" />
      </Reveal>

      <div className="mt-10">
        {ITEMS.map((item, i) => {
          const Decoration = DECORATIONS[item.id];
          const isHovered = hovered === item.id;
          return (
            <Reveal key={item.id} delay={i * 0.05}>
              <button
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(item.id)}
                onBlur={() => setHovered(null)}
                className="group relative flex w-full items-center justify-between gap-6 border-b border-border py-6 text-left sm:py-8"
              >
                <span
                  className={cx(
                    "font-display uppercase leading-none tracking-tight transition-colors duration-300"
                  )}
                  style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", color: isHovered ? "var(--accent)" : "var(--fg)" }}
                >
                  {item.label}
                </span>

                <span className="hidden font-meta text-[11px] text-muted-fg sm:block">{item.tagline}</span>

                <div className="flex h-12 w-32 shrink-0 items-center justify-end">
                  <AnimatePresence mode="wait">
                    {isHovered && (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Decoration />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
