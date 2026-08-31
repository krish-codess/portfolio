"use client";

import { useEffect, useRef, useState } from "react";
import { RHYTHM_PATTERN, RHYTHM_BPM } from "@/data/rhythm";
import { useRhythmReactivity } from "@/lib/rhythm/RhythmReactivityContext";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { CHART_PALETTE } from "@/lib/theme/chartPalette";
import { Meta } from "@/components/typography/Meta";

const STEP_MS = 60000 / RHYTHM_BPM / 4; // sixteenth notes

// A purely visual step sequencer -- no audio is generated or implied. It's a metaphor for
// "I think in rhythms," and its play state drives the site's rhythm-reactive CSS pulses.
export function RhythmGrid() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const { setPlaying } = useRhythmReactivity();
  const stepRef = useRef(0);

  useEffect(() => {
    setPlaying(isPlaying);
    return () => setPlaying(false);
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const id = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % 16;
      setStep(stepRef.current);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [isPlaying, reducedMotion]);

  function toggle() {
    if (!isPlaying) {
      stepRef.current = 0;
      setStep(0);
    }
    setIsPlaying((v) => !v);
  }

  return (
    <div className="paper-stack rounded-[var(--radius)] border border-border p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <Meta>{isPlaying ? "RUNNING" : "STOPPED"}</Meta>
        <Meta>{RHYTHM_BPM} BPM · VISUAL ONLY, NO AUDIO</Meta>
      </div>

      <div className="mt-5 space-y-1.5">
        {RHYTHM_PATTERN.map((lane, li) => (
          <div key={lane.id} className="flex items-center gap-3">
            <span className="w-14 shrink-0 font-meta text-[9px] uppercase tracking-widest text-muted-fg">{lane.label}</span>
            <div className="grid flex-1 grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
              {lane.steps.map((active, si) => {
                const isCurrent = isPlaying && si === step;
                return (
                  <span
                    key={si}
                    className="aspect-square w-full rounded-[1px]"
                    style={{
                      background: active ? CHART_PALETTE[li % CHART_PALETTE.length] : "var(--border)",
                      opacity: active ? (isCurrent ? 1 : 0.75) : isCurrent ? 0.5 : 0.35,
                      transform: isCurrent ? "scale(1.15)" : "scale(1)",
                      transition: "transform 60ms linear, opacity 60ms linear",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={toggle}
          data-cursor={isPlaying ? "STOP" : "RUN"}
          aria-label={isPlaying ? "Stop rhythm pattern" : "Run rhythm pattern"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border font-display text-sm"
        >
          {isPlaying ? "■" : "▶"}
        </button>
        <p className="font-meta text-[10px] leading-relaxed text-muted-fg">
          A step sequencer, not a recording. I play drums -- this is just a diagram of one pattern.
        </p>
      </div>
    </div>
  );
}
