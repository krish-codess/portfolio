"use client";

import { IDENTITY } from "@/data/site-config";

// Swiss doesn't morph or cycle -- an information poster is static by definition. Precision
// comes from alignment, not motion.
export function SwissHero() {
  return (
    <div className="flex flex-1 flex-col justify-center py-10 sm:py-16">
      <h1 className="sr-only">{IDENTITY.full} — {IDENTITY.tagline}, Software Developer &amp; Designer</h1>

      <div className="grid grid-cols-12 gap-x-4 gap-y-10 border-t border-border pt-6">
        <div className="col-span-12 sm:col-span-3">
          <p className="font-meta text-[11px] uppercase leading-relaxed tracking-widest text-muted-fg">
            {IDENTITY.tagline}
          </p>
        </div>
        <div className="col-span-12 sm:col-span-9" aria-hidden="true">
          <div
            className="font-display uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
          >
            {IDENTITY.first}
            <br />
            {IDENTITY.last}
          </div>
        </div>

        <div className="col-span-6 sm:col-span-3">
          <ol className="space-y-1 border-t border-border pt-3 font-meta text-[12px] uppercase tracking-wide text-foreground">
            {IDENTITY.roles.map((role, i) => (
              <li key={role} className="flex gap-3">
                <span className="text-muted-fg">0{i + 1}</span>
                {role}
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-6 sm:col-span-3 sm:col-start-10">
          <div className="border-t border-border pt-3 text-right font-meta text-[12px] uppercase tracking-wide text-foreground">
            <div>{IDENTITY.year}</div>
            <div className="text-muted-fg">{IDENTITY.country}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
