"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RHYTHM_PATTERN, RHYTHM_BPM, RhythmLane } from "@/data/rhythm";
import { createDrumSynth, DrumSynth, LANE_SOUND } from "@/lib/rhythm/drumSynth";
import { useRhythmReactivity } from "@/lib/rhythm/RhythmReactivityContext";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { CHART_PALETTE } from "@/lib/theme/chartPalette";
import { Meta } from "@/components/typography/Meta";

const STEPS = 16;
const MIN_BPM = 50;
const MAX_BPM = 200;
const DEFAULT_BPM = RHYTHM_BPM;

function clonePattern(pattern: RhythmLane[]): RhythmLane[] {
  return pattern.map((lane) => ({ ...lane, steps: [...lane.steps] }));
}

function randomPattern(pattern: RhythmLane[]): RhythmLane[] {
  // Biased density per lane so a random roll still sounds like a plausible beat rather than
  // noise -- kick/snare sparse, hi-hat dense, tom/cymbal rare accents.
  const density: Record<string, number> = { kick: 0.25, snare: 0.2, hihat: 0.55, tom: 0.12, cymbal: 0.08 };
  return pattern.map((lane) => ({
    ...lane,
    steps: Array.from({ length: STEPS }, () => Math.random() < (density[lane.id] ?? 0.2)),
  }));
}

function emptyPattern(pattern: RhythmLane[]): RhythmLane[] {
  return pattern.map((lane) => ({ ...lane, steps: Array(STEPS).fill(false) }));
}

// A real, EDITABLE step sequencer: click any cell to rewrite the pattern, drag the tempo
// slider to change speed, and press play to hear it -- actual synthesized kick/snare/hi-
// hat/tom/cymbal hits via the Web Audio API (see lib/rhythm/drumSynth.ts), not samples.
// Sound only ever starts from this explicit click. Its play state also drives the site's
// rhythm-reactive CSS pulses elsewhere.
export function RhythmGrid() {
  const [pattern, setPattern] = useState<RhythmLane[]>(() => clonePattern(RHYTHM_PATTERN));
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [step, setStep] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const { setPlaying } = useRhythmReactivity();

  const stepRef = useRef(0);
  const patternRef = useRef(pattern);
  const mutedRef = useRef(muted);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<DrumSynth | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const stepMs = useMemo(() => 60000 / bpm / 4, [bpm]);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    mutedRef.current = muted;
    if (masterGainRef.current) masterGainRef.current.gain.value = muted ? 0 : 0.8;
  }, [muted]);

  useEffect(() => {
    setPlaying(isPlaying);
    return () => setPlaying(false);
  }, [isPlaying, setPlaying]);

  function ensureAudio() {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = mutedRef.current ? 0 : 0.8;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = gain;
      synthRef.current = createDrumSynth(ctx, gain);
    }
    return audioCtxRef.current;
  }

  function playStep(stepIndex: number, time: number) {
    const synth = synthRef.current;
    if (!synth) return;
    patternRef.current.forEach((lane) => {
      if (lane.steps[stepIndex]) synth[LANE_SOUND[lane.id]](time);
    });
  }

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;
    const id = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % STEPS;
      setStep(stepRef.current);
      const ctx = audioCtxRef.current;
      if (ctx) playStep(stepRef.current, ctx.currentTime);
    }, stepMs);
    return () => clearInterval(id);
  }, [isPlaying, reducedMotion, stepMs]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  function toggle() {
    if (!isPlaying) {
      const ctx = ensureAudio();
      if (ctx.state === "suspended") ctx.resume();
      stepRef.current = 0;
      setStep(0);
      playStep(0, ctx.currentTime);
    }
    setIsPlaying((v) => !v);
  }

  function toggleStep(laneIndex: number, stepIndex: number) {
    setPattern((prev) =>
      prev.map((lane, li) => (li !== laneIndex ? lane : { ...lane, steps: lane.steps.map((v, si) => (si === stepIndex ? !v : v)) }))
    );
  }

  return (
    <div className="paper-stack rounded-[var(--radius)] border border-border p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Meta>{isPlaying ? "RUNNING" : "STOPPED"}</Meta>
        <Meta>CUSTOM PATTERN · SYNTHESIZED DRUMS</Meta>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="shrink-0 font-meta text-[9px] uppercase tracking-widest text-muted-fg">TEMPO</span>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          step={1}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          aria-label="Tempo in beats per minute"
          className="h-1 flex-1 cursor-pointer accent-[var(--accent)]"
        />
        <span className="w-16 shrink-0 text-right font-meta text-[10px] tabular-nums text-foreground">{bpm} BPM</span>
      </div>

      <div className="mt-5 space-y-1.5">
        {pattern.map((lane, li) => (
          <div key={lane.id} className="flex items-center gap-2 sm:gap-3">
            <span className="w-11 shrink-0 font-meta text-[8px] uppercase tracking-widest text-muted-fg sm:w-14 sm:text-[9px]">
              {lane.label}
            </span>
            <div className="grid flex-1 grid-cols-[repeat(16,minmax(0,1fr))] gap-[3px] sm:gap-1">
              {lane.steps.map((active, si) => {
                const isCurrent = isPlaying && si === step;
                return (
                  <button
                    key={si}
                    onClick={() => toggleStep(li, si)}
                    aria-pressed={active}
                    aria-label={`${lane.label}, step ${si + 1}, ${active ? "on" : "off"}`}
                    className="aspect-square w-full cursor-pointer rounded-[1px] hover:ring-1 hover:ring-foreground"
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

      <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
        <button
          onClick={toggle}
          data-cursor={isPlaying ? "STOP" : "RUN"}
          aria-label={isPlaying ? "Stop rhythm pattern" : "Play rhythm pattern"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border font-display text-sm"
        >
          {isPlaying ? "■" : "▶"}
        </button>
        <button
          onClick={() => setMuted((m) => !m)}
          data-cursor={muted ? "UNMUTE" : "MUTE"}
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
          className="shrink-0 font-meta text-[10px] uppercase tracking-widest text-muted-fg hover:text-foreground"
        >
          {muted ? "MUTED" : "SOUND ON"}
        </button>
        <span className="h-4 w-px bg-border" aria-hidden="true" />
        <button
          onClick={() => setPattern((prev) => randomPattern(prev))}
          className="shrink-0 font-meta text-[10px] uppercase tracking-widest text-muted-fg hover:text-accent"
        >
          RANDOM
        </button>
        <button
          onClick={() => setPattern((prev) => emptyPattern(prev))}
          className="shrink-0 font-meta text-[10px] uppercase tracking-widest text-muted-fg hover:text-accent"
        >
          CLEAR
        </button>
        <button
          onClick={() => {
            setPattern(clonePattern(RHYTHM_PATTERN));
            setBpm(DEFAULT_BPM);
          }}
          className="shrink-0 font-meta text-[10px] uppercase tracking-widest text-muted-fg hover:text-accent"
        >
          RESET
        </button>
      </div>

      <p className="mt-4 font-meta text-[10px] leading-relaxed text-muted-fg">
        Click any step to rewrite the pattern, drag tempo to change speed. Synthesized live, not
        a recording -- I play real drums; this is a sketch of one groove.
      </p>
    </div>
  );
}
