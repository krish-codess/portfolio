"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { clamp } from "@/lib/utils";

interface WordState {
  word: string;
  caption: string;
  tone: "fg" | "accent";
}

// KRISH anchors identity (off-white); everything else is a discipline, stamped in the
// hero's fixed red. DRUMS is deliberately captioned "not production" -- see AGENTS-level
// instruction: plays drums and listens widely, does not produce/compose/sing.
const WORDS: WordState[] = [
  { word: "KRISH", caption: "FULL-STACK DATA SPECIALIST", tone: "fg" },
  { word: "DATA", caption: "PATTERNS, PIPELINES, ANALYSIS", tone: "accent" },
  { word: "CODE", caption: "SYSTEMS THAT RUN", tone: "accent" },
  { word: "DESIGN", caption: "FORM WITH INTENT", tone: "accent" },
  { word: "DRUMS", caption: "RHYTHM — NOT PRODUCTION", tone: "accent" },
];

const CYCLE_MS = 2400;

// Each word gets its own size so short words (DATA, CODE) fill the viewport just as
// aggressively as long ones (DESIGN) -- the point is that every state feels like it's
// pushing against the frame, not that every word shares one safe, conservative size.
function sizeForWord(word: string) {
  const vw = (96 / (word.length * 0.66)).toFixed(1);
  return `clamp(3.6rem, min(${vw}vw, 58vh), 30rem)`;
}

const letterVariants = {
  initial: { scaleY: 0.12, y: "45%", opacity: 0 },
  animate: (i: number) => ({
    scaleY: 1,
    y: "0%",
    opacity: 1,
    transition: { delay: i * 0.028, type: "spring" as const, stiffness: 440, damping: 15, mass: 0.9 },
  }),
  exit: (i: number) => ({
    scaleY: 0.1,
    y: "-35%",
    opacity: 0,
    transition: { delay: i * 0.014, duration: 0.16, ease: [0.7, 0, 0.84, 0] as const },
  }),
};

export function HeroTypography() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const hoveringRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const current = WORDS[index];

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      if (!hoveringRef.current) setIndex((i) => (i + 1) % WORDS.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Cursor-driven tilt + a transient skew on fast scroll, composed into one transform and
  // written directly to the DOM node every frame -- no React re-render in the animation
  // loop itself, matching the perf pattern already used elsewhere on this site.
  useEffect(() => {
    if (reducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let posX = 0;
    let posY = 0;
    let lastScrollY = window.scrollY;
    let scrollSkew = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = clamp(e.clientX / window.innerWidth - 0.5, -0.5, 0.5);
      targetY = clamp(e.clientY / window.innerHeight - 0.5, -0.5, 0.5);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      scrollSkew = clamp(scrollSkew + delta * 0.6, -8, 8);
    };

    const tick = () => {
      posX += (targetX - posX) * 0.06;
      posY += (targetY - posY) * 0.06;
      scrollSkew += (0 - scrollSkew) * 0.12;

      const rotateY = posX * 7;
      const rotateX = -posY * 5;
      const shiftPx = posX * 12;

      if (stageRef.current) {
        stageRef.current.style.transform = `perspective(1400px) translate3d(${shiftPx}px, 0, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) skewX(${scrollSkew}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  function advance() {
    setIndex((i) => (i + 1) % WORDS.length);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
      <h1 className="sr-only">Krish Gohel — Full-Stack Data Specialist, Software Developer &amp; Designer</h1>

      <div
        ref={stageRef}
        className="relative flex w-full items-center justify-center will-change-transform"
        style={{ height: "min(58vh, 30rem)", transformStyle: "preserve-3d" }}
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
      >
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={advance}
          data-cursor="NEXT"
          aria-label="Cycle through Krish's disciplines"
          className="absolute inset-0 flex items-center justify-center"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={current.word}
              className="absolute inset-0 flex select-none items-center justify-center whitespace-nowrap uppercase leading-[0.82] tracking-tight"
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: sizeForWord(current.word),
                color: current.tone === "accent" ? "var(--accent)" : "var(--fg)",
              }}
              aria-hidden="true"
            >
              {current.word.split("").map((ch, i) => (
                <motion.span
                  key={`${current.word}-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ display: "inline-block", transformOrigin: "bottom" }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <div className="relative z-10 mt-4 flex flex-col items-center gap-1.5 px-1 font-meta text-[10px] uppercase tracking-widest text-muted-fg sm:mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.caption}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {current.caption}
          </motion.span>
        </AnimatePresence>
        <span>DATA × CODE × DESIGN × MUSIC</span>
      </div>
    </div>
  );
}
