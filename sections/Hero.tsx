"use client";

import { formatClock } from "@/lib/utils";
import { useClock } from "@/lib/hooks/useClock";
import { HeroTypography } from "@/components/hero/HeroTypography";
import { NAV_ITEMS } from "@/data/nav";

export function Hero() {
  const now = useClock();

  return (
    <section id="intro" className="relative flex min-h-svh flex-col overflow-hidden px-5 pt-5 sm:px-8 sm:pt-8">
      {/* browser-window style framing, reinterpreted */}
      <div className="flex items-center justify-between border border-border px-4 py-2.5 font-meta text-[11px] uppercase tracking-widest text-muted-fg">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full border border-muted-fg" />
          <span className="h-2 w-2 rounded-full border border-muted-fg" />
          <span className="h-2 w-2 rounded-full border border-muted-fg" />
        </div>
        <div className="hidden border border-border px-4 py-1 sm:block">krishgohel.dev</div>
        <div className="tabular-nums">{now ? formatClock(new Date(now)) : "--:--:--"}</div>
      </div>

      <HeroTypography />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4 font-meta text-[10px] uppercase tracking-widest text-muted-fg">
        <span>
          INDEX / 01 — {String(NAV_ITEMS.length).padStart(2, "0")}
        </span>
        <span className="flex items-center gap-2">
          SCROLL
          <span className="inline-block animate-bounce">↓</span>
        </span>
        <span>VERSION 02.0</span>
      </div>
    </section>
  );
}
