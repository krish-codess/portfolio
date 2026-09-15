"use client";

import { HeroTypography } from "@/components/hero/HeroTypography";

export function Hero() {
  return (
    <section id="intro" className="relative mx-auto flex min-h-svh w-full max-w-[1760px] flex-col overflow-hidden px-5 pt-5 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-end">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      </div>

      <HeroTypography />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4 font-meta text-[9px] uppercase tracking-widest text-muted-fg">
        <span>KRISH GOHEL — FULL-STACK DATA SPECIALIST</span>
        <span className="hidden items-center gap-2 sm:flex">
          SCROLL
          <span className="inline-block animate-bounce">↓</span>
        </span>
      </div>
    </section>
  );
}
