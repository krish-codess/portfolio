"use client";

import { SITE } from "@/data/site-config";
import { IdentityCycler } from "@/components/hero/IdentityCycler";
import { formatClock } from "@/lib/utils";
import { useClock } from "@/lib/hooks/useClock";

export function Hero() {
  const now = useClock();

  return (
    <section id="intro" className="relative flex min-h-svh flex-col px-5 pt-5 sm:px-8 sm:pt-8">
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

      <div className="flex flex-1 flex-col py-8 sm:justify-between sm:py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h1 className="font-display uppercase leading-[0.85] tracking-tight" style={{ fontSize: "clamp(2.8rem, 9vw, 6rem)" }}>
            {SITE.name}
          </h1>
          <p className="max-w-[16rem] font-meta text-[11px] uppercase tracking-widest text-muted-fg sm:text-right">
            {SITE.descriptor}
            <br />
            {SITE.formula}
          </p>
        </div>

        <div className="mt-14 sm:mt-12">
          <IdentityCycler />
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-4 font-meta text-[10px] uppercase tracking-widest text-muted-fg sm:mt-0">
          <span>INDEX / 01 — 08</span>
          <span className="flex items-center gap-2">
            SCROLL
            <span className="inline-block animate-bounce">↓</span>
          </span>
          <span>VERSION 01.0</span>
        </div>
      </div>
    </section>
  );
}
