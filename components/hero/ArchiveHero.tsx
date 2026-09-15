"use client";

import { IDENTITY } from "@/data/site-config";

// A title page, not a hero in the software-portfolio sense -- static, centered, serif.
export function ArchiveHero() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center py-16 text-center">
      <h1 className="sr-only">{IDENTITY.full} — {IDENTITY.tagline}, Software Developer &amp; Designer</h1>

      {/* Registration-mark corners -- a printer's crop mark, not a decoration borrowed from
          nowhere. */}
      <span aria-hidden="true" className="absolute left-4 top-4 h-4 w-4 border-l border-t border-border sm:left-6 sm:top-6" />
      <span aria-hidden="true" className="absolute right-4 top-4 h-4 w-4 border-r border-t border-border sm:right-6 sm:top-6" />
      <span aria-hidden="true" className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-border sm:bottom-6 sm:left-6" />
      <span aria-hidden="true" className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-border sm:bottom-6 sm:right-6" />

      <div aria-hidden="true">
        <div className="font-display uppercase leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)" }}>
          {IDENTITY.full}
        </div>

        <p className="mt-6 font-meta text-[11px] uppercase tracking-[0.3em] text-muted-fg">A PERSONAL ARCHIVE OF</p>

        <p className="mt-3 font-display italic leading-tight" style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}>
          DATA / CODE / DESIGN / RHYTHM
        </p>

        <p className="mt-8 font-meta text-[11px] uppercase tracking-widest text-muted-fg">
          VOL. 01 — {IDENTITY.year}
        </p>
      </div>
    </div>
  );
}
