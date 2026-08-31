"use client";

import { useMemo } from "react";

const GOLDEN_ANGLE = 2.399963;

export function Waveform({ energy, isPlaying, bars = 48 }: { energy: number; isPlaying: boolean; bars?: number }) {
  // Deterministic pseudo-random phases (golden-angle spacing) instead of Math.random(),
  // so the render stays pure -- purely decorative variation, not real randomness.
  const phases = useMemo(() => Array.from({ length: bars }, (_, i) => (i * GOLDEN_ANGLE) % (Math.PI * 2)), [bars]);

  return (
    <div className="flex h-16 items-center gap-[3px]" role="img" aria-label={isPlaying ? "Audio waveform, playing" : "Audio waveform, paused"}>
      {phases.map((phase, i) => {
        const base = 0.12 + 0.5 * Math.abs(Math.sin(phase + i * 0.4));
        const height = isPlaying ? Math.max(6, (base + energy * 1.4) * 56) : 5 + base * 8;
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-accent"
            style={{
              height,
              opacity: isPlaying ? 0.55 + energy * 0.45 : 0.35,
              transition: "height 90ms linear, opacity 200ms ease",
            }}
          />
        );
      })}
    </div>
  );
}
