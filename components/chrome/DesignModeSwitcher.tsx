"use client";

import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { DESIGN_MODES } from "@/lib/theme/designModes";

export function DesignModeSwitcher() {
  const { designMode, setDesignMode } = useAppearance();
  const current = DESIGN_MODES.find((m) => m.id === designMode) ?? DESIGN_MODES[0];
  const index = DESIGN_MODES.findIndex((m) => m.id === designMode);

  function cycle() {
    const next = DESIGN_MODES[(index + 1) % DESIGN_MODES.length];
    setDesignMode(next.id);
  }

  return (
    <button
      onClick={cycle}
      data-cursor="CYCLE"
      title={`Design mode: ${current.name} — ${current.descriptor}`}
      className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-background/85 px-3 py-2 font-meta text-[10px] uppercase tracking-widest backdrop-blur transition-colors hover:border-foreground"
    >
      <span className="text-muted-fg">MODE</span>
      <span className="text-foreground">{current.index}</span>
    </button>
  );
}
