"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { clamp } from "@/lib/utils";

const WORDS = [
  { word: "GOHEL", caption: null },
  { word: "BUILD", caption: "SOFTWARE & SYSTEMS" },
  { word: "ANALYZE", caption: "DATA & PATTERNS" },
  { word: "DESIGN", caption: "VISUALS & TYPE" },
  { word: "PLAY", caption: "SOUND & RHYTHM" },
] as const;

const HERO_SIZE = "clamp(4.2rem, 17vh, 15rem)";

// The name itself is the composition: KRISH bleeds off the left edge, the surname bleeds
// off the right and doubles as an interactive surface that reveals the four identities.
// Both lines carry a subtle cursor-driven parallax. GOHEL stays in the accessibility tree
// at all times; the cycling word is a decorative, aria-hidden overlay on top of it.
export function HeroTypography() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const hoveringRef = useRef(false);
  const krishRef = useRef<HTMLDivElement>(null);
  const gohelRef = useRef<HTMLDivElement>(null);

  const current = WORDS[index];

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      if (!hoveringRef.current) setIndex((i) => (i + 1) % WORDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let targetX = 0;
    let posX = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      // Clamped defensively: a click on the GOHEL button (which intentionally bleeds past
      // the viewport edge) can report a clientX outside [0, innerWidth], which would
      // otherwise push this outside its intended -0.5..0.5 range.
      targetX = clamp(e.clientX / window.innerWidth - 0.5, -0.5, 0.5);
    };

    const tick = () => {
      posX += (targetX - posX) * 0.06;
      const shiftPx = posX * 18; // subtle, px
      if (krishRef.current) krishRef.current.style.transform = `translate3d(calc(-6% - ${shiftPx}px), 0, 0)`;
      if (gohelRef.current) gohelRef.current.style.transform = `translate3d(calc(6% + ${shiftPx}px), 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  function advance() {
    setIndex((i) => (i + 1) % WORDS.length);
  }

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden">
      <h1 className="sr-only">Krish Gohel</h1>

      <div
        ref={krishRef}
        aria-hidden="true"
        className="select-none whitespace-nowrap font-display uppercase leading-[0.78] tracking-tighter will-change-transform"
        style={{ fontSize: HERO_SIZE, transform: "translate3d(-6%, 0, 0)" }}
      >
        KRISH
      </div>

      <div className="relative z-10 my-3 grid grid-cols-[1fr_auto] items-center gap-3 px-1 font-meta text-[10px] uppercase tracking-widest text-muted-fg sm:my-5">
        <span style={{ transition: "opacity 0.25s ease" }}>{current.caption ?? "MULTIDISCIPLINARY DIGITAL PRACTITIONER"}</span>
        <span className="hidden sm:inline">DATA × CODE × DESIGN × MUSIC</span>
      </div>

      <div
        ref={gohelRef}
        className="relative flex justify-end"
        style={{ transform: "translate3d(6%, 0, 0)" }}
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
      >
        <button
          onMouseDown={(e) => {
            // The text bleeds past the viewport edge on purpose. A mouse click focuses the
            // button, and the browser's native "scroll focused element into view" runs
            // synchronously as part of that focus step -- before onClick ever fires -- so
            // it fights the intentional crop no matter what onClick does afterward.
            // preventDefault() on mousedown stops the button from taking focus via click at
            // all (Tab still focuses it normally for keyboard users; onClick still fires).
            e.preventDefault();
          }}
          onClick={advance}
          data-cursor="SWAP"
          aria-label="Reveal the four disciplines behind the name"
          className="relative select-none whitespace-nowrap text-right font-display uppercase leading-[0.78] tracking-tighter"
          style={{ fontSize: HERO_SIZE }}
        >
          <span aria-hidden="true" style={{ opacity: current.word === "GOHEL" ? 1 : 0, transition: "opacity 0.3s ease" }}>
            GOHEL
          </span>
          {/* Every word is always mounted and cross-fades via opacity -- no mount/unmount
              cycle, which sidesteps a layout-corrupting interaction we found between
              AnimatePresence exit animations and this element's viewport-bleeding transform. */}
          {WORDS.slice(1).map((w) => (
            <span
              key={w.word}
              aria-hidden="true"
              className="absolute inset-0 bg-background text-accent"
              style={{
                opacity: current.word === w.word ? 1 : 0,
                transform: current.word === w.word ? "translateY(0)" : "translateY(-10px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                pointerEvents: "none",
              }}
            >
              {w.word}
            </span>
          ))}
        </button>
      </div>
    </div>
  );
}
