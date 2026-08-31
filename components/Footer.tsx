"use client";

import { SITE } from "@/data/site-config";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { THEMES } from "@/lib/theme/themes";
import { formatClock } from "@/lib/utils";
import { useClock } from "@/lib/hooks/useClock";

export function Footer() {
  const now = useClock();
  const { theme } = useTheme();
  const themeMeta = THEMES.find((t) => t.id === theme);

  return (
    <footer className="border-t border-border px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-sm uppercase tracking-tight">{SITE.name}</div>
          <div className="mt-1 font-meta text-[10px] text-muted-fg">{SITE.formula}</div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-meta text-[10px] text-muted-fg">
          <span>{now ? formatClock(new Date(now)) : "--:--:--"} LOCAL</span>
          <span>THEME {themeMeta?.name}</span>
          <span>VERSION 01.0</span>
          <span>© {now ? new Date(now).getFullYear() : "2026"}</span>
        </div>
      </div>
    </footer>
  );
}
