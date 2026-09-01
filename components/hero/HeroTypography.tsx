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

// min(vh, vw) so the longest word ("ANALYZE") never overflows a narrow phone -- the vh term
// drives size on wide/short screens, the vw term takes over and shrinks it on tall/narrow
// ones -- and the whole composition is centered, so it never competes with the fixed nav
// rail for space on any screen width.
const HERO_SIZE = "clamp(2.2rem, min(16vh, 12.5vw), 15rem)";

// The name is dead-centered on purpose: centered content can never collide with the fixed
// section rail regardless of viewport width or aspect ratio, which edge-bleeding text could.
// Both lines carry a small cursor-driven parallax. GOHEL stays in the accessibility tree at
// all times; the cycling word is a decorative, aria-hidden overlay on top of it.
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
      targetX = clamp(e.clientX / window.innerWidth - 0.5, -0.5, 0.5);
    };

    const tick = () => {
      posX += (targetX - posX) * 0.06;
      const shiftPx = posX * 14; // subtle, symmetric, px only -- no percentage base offset
      if (krishRef.current) krishRef.current.style.transform = `translate3d(${-shiftPx}px, 0, 0)`;
      if (gohelRef.current) gohelRef.current.style.transform = `translate3d(${shiftPx}px, 0, 0)`;
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
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
      <h1 className="sr-only">Krish Gohel</h1>

      <div
        ref={krishRef}
        aria-hidden="true"
        className="select-none whitespace-nowrap font-display uppercase leading-[0.78] tracking-tighter will-change-transform"
        style={{ fontSize: HERO_SIZE }}
      >
        KRISH
      </div>

      <div className="relative z-10 my-3 flex flex-col items-center gap-1.5 px-1 font-meta text-[10px] uppercase tracking-widest text-muted-fg sm:my-5">
        <span style={{ transition: "opacity 0.25s ease" }}>{current.caption ?? "MULTIDISCIPLINARY DIGITAL PRACTITIONER"}</span>
        <span>DATA × CODE × DESIGN × MUSIC</span>
      </div>

      <div
        ref={gohelRef}
        className="relative flex justify-center will-change-transform"
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
      >
        <button
          onMouseDown={(e) => {
            // Guards against the browser's native "scroll focused element into view" firing
            // synchronously as part of focus assignment, before onClick ever runs.
            // preventDefault() on mousedown stops the button taking focus via click at all
            // (Tab still focuses it normally for keyboard users; onClick still fires).
            e.preventDefault();
          }}
          onClick={advance}
          data-cursor="SWAP"
          aria-label="Reveal the four disciplines behind the name"
          className="relative select-none whitespace-nowrap text-center font-display uppercase leading-[0.78] tracking-tighter"
          style={{ fontSize: HERO_SIZE }}
        >
          <span aria-hidden="true" style={{ opacity: current.word === "GOHEL" ? 1 : 0, transition: "opacity 0.3s ease" }}>
            GOHEL
          </span>
          {/* Every word is always mounted and cross-fades via opacity -- no mount/unmount
              cycle, which sidesteps a layout-corrupting interaction we found between
              AnimatePresence exit animations and this element's transform. */}
          {/* Centered independently of the button's own width (which is sized to "GOHEL",
              the only normal-flow content) via left-1/2 + translateX(-50%) -- inset-0 here
              would tie each overlay's box to GOHEL's width, so a longer word like "ANALYZE"
              wasn't reliably centering within it. */}
          {WORDS.slice(1).map((w) => {
            const isActive = current.word === w.word;
            return (
              <span
                key={w.word}
                aria-hidden="true"
                className="absolute left-1/2 top-0 bg-background text-accent"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translateX(-50%) translateY(${isActive ? 0 : -10}px)`,
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  pointerEvents: "none",
                }}
              >
                {w.word}
              </span>
            );
          })}
        </button>
      </div>
    </div>
  );
}
