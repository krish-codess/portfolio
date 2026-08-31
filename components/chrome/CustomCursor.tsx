"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";

const IDLE_THRESHOLD_MS = 14000;
const IDLE_CHECK_INTERVAL_MS = 2500;
const EASTER_EGG_CHANCE = 0.3;
const EASTER_EGG_LABEL = "WHY ARE YOU HERE?";
const EASTER_EGG_DURATION_MS = 2600;

// Cursor is a progressive enhancement layer only: it activates for fine-pointer desktop
// input, respects reduced-motion, and the site is fully usable without it.
export function CustomCursor() {
  const isFine = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const active = isFine && !reducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("custom-cursor-active");
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [active]);

  useEffect(() => {
    if (!active) return;

    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let lastMoveAt = Date.now();
    let currentLabel: string | null = null;

    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX, y: e.clientY };
      lastMoveAt = Date.now();
      const hovered = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      currentLabel = hovered?.dataset.cursor ?? null;
      setEasterEgg(false);
      setLabel(currentLabel);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    // A rare, discoverable easter egg: if the cursor sits still over ambient empty space
    // for a while, it occasionally wonders why you're still here.
    const idleCheck = setInterval(() => {
      const idleFor = Date.now() - lastMoveAt;
      if (idleFor > IDLE_THRESHOLD_MS && currentLabel === "..." && Math.random() < EASTER_EGG_CHANCE) {
        setEasterEgg(true);
        window.setTimeout(() => setEasterEgg(false), EASTER_EGG_DURATION_MS);
      }
    }, IDLE_CHECK_INTERVAL_MS);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
      clearInterval(idleCheck);
    };
  }, [active]);

  if (!active) return null;

  const displayLabel = easterEgg ? EASTER_EGG_LABEL : label;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center will-change-transform"
      style={{ transition: "width 0.2s ease, height 0.2s ease" }}
    >
      <div
        className="flex items-center justify-center whitespace-nowrap rounded-full font-meta text-[10px] uppercase transition-all duration-200 ease-out"
        style={{
          width: displayLabel ? "auto" : pressed ? 10 : 14,
          height: displayLabel ? 34 : pressed ? 10 : 14,
          padding: displayLabel ? "0 14px" : 0,
          background: "var(--fg)",
          color: "var(--bg)",
          mixBlendMode: "var(--cursor-blend)" as React.CSSProperties["mixBlendMode"],
        }}
      >
        {displayLabel}
      </div>
    </div>
  );
}
