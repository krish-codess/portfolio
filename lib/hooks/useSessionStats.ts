"use client";

import { useEffect, useRef, useState } from "react";

interface SessionStats {
  sessionSeconds: number;
  scrollMeters: number;
  pointerMeters: number;
}

// All measurements are local to this browser tab. Nothing here is transmitted anywhere —
// it exists purely as a playful, self-referential instrument panel.
export function useSessionStats(): SessionStats {
  const [stats, setStats] = useState<SessionStats>({ sessionSeconds: 0, scrollMeters: 0, pointerMeters: 0 });
  const scrollAccum = useRef(0);
  const pointerAccum = useRef(0);
  const lastScrollY = useRef(0);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      scrollAccum.current += Math.abs(y - lastScrollY.current);
      lastScrollY.current = y;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (lastPointer.current) {
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        pointerAccum.current += Math.sqrt(dx * dx + dy * dy);
      }
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const interval = setInterval(() => {
      const px = 96 / 2.54 / 100; // rough px-per-meter assuming ~96dpi
      setStats({
        sessionSeconds: Math.floor((Date.now() - startedAt.current) / 1000),
        scrollMeters: scrollAccum.current / (px * 100),
        pointerMeters: pointerAccum.current / (px * 100),
      });
    }, 1000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      clearInterval(interval);
    };
  }, []);

  return stats;
}
