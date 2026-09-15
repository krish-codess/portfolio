"use client";

import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { IDENTITY } from "@/data/site-config";
import { EditorialHero } from "@/components/hero/EditorialHero";
import { SwissHero } from "@/components/hero/SwissHero";
import { TerminalHero } from "@/components/hero/TerminalHero";
import { ArchiveHero } from "@/components/hero/ArchiveHero";
import { KineticHero } from "@/components/hero/KineticHero";

// One content system, five hero presentations -- all five read from the same IDENTITY
// object (data/site-config.ts). Only the outer chrome (the live dot, the closing metadata
// line) is shared; the actual hero composition is delegated entirely to the active mode's
// component, since Swiss/Terminal/Archive need a fundamentally different structure than a
// centered morphing word, not just a re-skinned one.
export function Hero() {
  const { designMode } = useAppearance();

  return (
    <section id="intro" className="relative mx-auto flex min-h-svh w-full max-w-[1760px] flex-col overflow-hidden px-5 pt-5 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-end">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      </div>

      {designMode === "editorial" && <EditorialHero />}
      {designMode === "swiss" && <SwissHero />}
      {designMode === "terminal" && <TerminalHero />}
      {designMode === "archive" && <ArchiveHero />}
      {designMode === "kinetic" && <KineticHero />}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4 font-meta text-[9px] uppercase tracking-widest text-muted-fg">
        <span>{IDENTITY.full} — {IDENTITY.tagline}</span>
        <span className="hidden items-center gap-2 sm:flex">
          SCROLL
          <span className="inline-block animate-bounce">↓</span>
        </span>
      </div>
    </section>
  );
}
