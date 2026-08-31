"use client";

import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { COLOR_SCHEMES } from "@/lib/theme/colorSchemes";

export function ColorSwitcher() {
  const { colorScheme, setColorScheme } = useAppearance();
  const current = COLOR_SCHEMES.find((c) => c.id === colorScheme) ?? COLOR_SCHEMES[0];
  const index = COLOR_SCHEMES.findIndex((c) => c.id === colorScheme);

  function cycle() {
    const next = COLOR_SCHEMES[(index + 1) % COLOR_SCHEMES.length];
    setColorScheme(next.id);
  }

  return (
    <button
      onClick={cycle}
      data-cursor="CYCLE"
      title={`Color: ${current.name} — ${current.descriptor}`}
      className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-background/85 px-3 py-2 font-meta text-[10px] uppercase tracking-widest backdrop-blur transition-colors hover:border-foreground"
    >
      <span className="text-muted-fg">COLOR</span>
      <span className="rhythm-pulse-target inline-block h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
      <span className="text-foreground">{current.name}</span>
    </button>
  );
}
