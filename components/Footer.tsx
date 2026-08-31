"use client";

import { SITE } from "@/data/site-config";
import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { COLOR_SCHEMES } from "@/lib/theme/colorSchemes";
import { DESIGN_MODES } from "@/lib/theme/designModes";
import { formatClock } from "@/lib/utils";
import { useClock } from "@/lib/hooks/useClock";

export function Footer() {
  const now = useClock();
  const { colorScheme, designMode } = useAppearance();
  const colorMeta = COLOR_SCHEMES.find((c) => c.id === colorScheme);
  const modeMeta = DESIGN_MODES.find((m) => m.id === designMode);

  return (
    <footer className="border-t border-border px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-sm uppercase tracking-tight">{SITE.name}</div>
          <div className="mt-1 font-meta text-[10px] text-muted-fg">{SITE.formula}</div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-meta text-[10px] text-muted-fg">
          <span>{now ? formatClock(new Date(now)) : "--:--:--"} LOCAL</span>
          <span>{colorMeta?.name} / {modeMeta?.name}</span>
          <span>VERSION 02.0</span>
          <span>© {now ? new Date(now).getFullYear() : "2026"}</span>
        </div>
      </div>
    </footer>
  );
}
