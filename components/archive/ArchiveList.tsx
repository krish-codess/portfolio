"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ARCHIVE_ITEMS, ArchiveCategory } from "@/data/archive";
import { cx } from "@/lib/utils";

const CATEGORIES: (ArchiveCategory | "ALL")[] = ["ALL", "DATA", "CODE", "DESIGN", "MUSIC", "EXPERIMENT"];

export function ArchiveList() {
  const [filter, setFilter] = useState<ArchiveCategory | "ALL">("ALL");

  const grouped = useMemo(() => {
    const filtered = filter === "ALL" ? ARCHIVE_ITEMS : ARCHIVE_ITEMS.filter((i) => i.category === filter);
    const byYear = new Map<string, typeof ARCHIVE_ITEMS>();
    filtered.forEach((item) => {
      const list = byYear.get(item.year) ?? [];
      list.push(item);
      byYear.set(item.year, list);
    });
    return Array.from(byYear.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filter]);

  return (
    // Kept clear of the far-right edge on purpose -- the fixed section nav is vertically
    // centered and would otherwise sit on top of a right-aligned category column.
    <div className="max-w-3xl">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter archive by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={cx(
              "border px-3 py-1.5 font-meta text-[10px] uppercase tracking-widest transition-colors duration-200",
              filter === c ? "border-accent text-accent" : "border-border text-muted-fg hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {grouped.length === 0 && <p className="font-meta text-[11px] text-muted-fg">NOTHING FILED UNDER THIS YET.</p>}
        {grouped.map(([year, items]) => (
          <div key={year} className="mb-8 last:mb-0">
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl tracking-tight">{year}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <ul className="mt-3 border-t border-border">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between gap-4 border-b border-border py-3 font-meta text-[12px]"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-muted-fg">{item.index}</span>
                    <span className="uppercase tracking-wide text-foreground">{item.title}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-accent">{item.category}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
