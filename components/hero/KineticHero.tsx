"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { clamp } from "@/lib/utils";
import { IDENTITY } from "@/data/site-config";

// Anchored positions as a fraction of the stage box, plus a per-word drift amplitude and
// phase offset so each floats on its own independent, gentle loop. Cursor proximity nudges
// each word slightly further away from the pointer -- readable, not chaotic.
const FLOATERS = [
  { word: IDENTITY.roles[1], x: 0.14, y: 0.22, amp: 10, phase: 0 },
  { word: "CODE", x: 0.82, y: 0.18, amp: 12, phase: 1.4 },
  { word: IDENTITY.roles[2], x: 0.16, y: 0.78, amp: 9, phase: 2.6 },
  { word: IDENTITY.roles[3], x: 0.84, y: 0.76, amp: 11, phase: 4.1 },
];

export function KineticHero() {
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    let t = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };

    const onMove = (e: PointerEvent) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointer.x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      pointer.y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      pointer.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
    };

    const tick = () => {
      t += 0.012;
      const rect = stageRef.current?.getBoundingClientRect();
      FLOATERS.forEach((f, i) => {
        const el = chipRefs.current[i];
        if (!el || !rect) return;
        let dx = Math.sin(t + f.phase) * f.amp;
        let dy = Math.cos(t * 0.8 + f.phase) * f.amp;
        if (pointer.active) {
          const px = f.x - pointer.x;
          const py = f.y - pointer.y;
          const dist = Math.hypot(px, py) || 1;
          if (dist < 0.28) {
            const push = (0.28 - dist) * 60;
            dx += (px / dist) * push;
            dy += (py / dist) * push;
          }
        }
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div ref={stageRef} className="relative flex flex-1 flex-col items-center justify-center overflow-hidden py-10">
      <h1 className="sr-only">{IDENTITY.full} — {IDENTITY.tagline}, Software Developer &amp; Designer</h1>

      <div aria-hidden="true" className="text-center">
        <div className="font-display uppercase leading-[0.85] tracking-tight" style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}>
          {IDENTITY.first}
          <br />
          {IDENTITY.last}
        </div>
        <p className="mt-4 font-meta text-[11px] uppercase tracking-widest text-muted-fg">{IDENTITY.tagline}</p>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        {FLOATERS.map((f, i) => (
          <span
            key={f.word}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className="absolute rounded-[var(--radius)] border border-border px-3 py-1.5 font-display uppercase tracking-tight text-accent will-change-transform"
            style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%`, fontSize: "clamp(1rem, 2.2vw, 1.6rem)" }}
          >
            {f.word}
          </span>
        ))}
      </div>
    </div>
  );
}
