"use client";

import { useClock } from "@/lib/hooks/useClock";
import { Meta } from "@/components/typography/Meta";

interface Metric {
  label: string;
  base: number;
  amplitude: number;
  phase: number;
}

// Personality devices, not scientific measurements. Values drift slowly and deterministically
// from the clock -- no randomness, just a small sense that the panel is "alive".
const METRICS: Metric[] = [
  { label: "CREATIVITY", base: 78, amplitude: 14, phase: 0 },
  { label: "FOCUS", base: 45, amplitude: 22, phase: 1.4 },
  { label: "CURIOSITY", base: 92, amplitude: 6, phase: 2.6 },
  { label: "SLEEP", base: 30, amplitude: 18, phase: 4.1 },
  { label: "COFFEE", base: 20, amplitude: 25, phase: 5.3 },
];

export function SystemStatus() {
  const now = useClock();
  const t = now / 60000; // slow drift, one cycle roughly every few minutes

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-meta text-[11px] uppercase tracking-widest text-accent">SYSTEM STATUS</h3>
        <Meta>NOT SCIENTIFIC</Meta>
      </div>
      <dl className="mt-4 space-y-2.5">
        {METRICS.map((m) => {
          const value = now ? Math.round(m.base + Math.sin(t + m.phase) * m.amplitude) : m.base;
          const clamped = Math.min(99, Math.max(1, value));
          return (
            <div key={m.label} className="flex items-center gap-3">
              <dt className="w-20 shrink-0 font-meta text-[10px] uppercase tracking-widest text-muted-fg">{m.label}</dt>
              <div className="h-px flex-1 bg-border">
                <div className="h-px bg-accent transition-[width] duration-1000 ease-linear" style={{ width: `${clamped}%` }} />
              </div>
              <dd className="w-9 shrink-0 text-right font-meta text-[10px] tabular-nums text-foreground">{clamped}%</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
