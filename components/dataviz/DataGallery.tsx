"use client";

import { useState } from "react";
import { DataFigure } from "@/data/data-figures";
import { DataCard } from "./DataCard";
import { DataFigureModal } from "./DataFigureModal";

// A dense editorial grid, not a dashboard: 4 columns on desktop/tablet, 2 on mobile, with
// figures spanning 1 or 2 columns for controlled variation. Every card stays small by
// default -- clicking "+" opens the one expanded view via DataFigureModal.
export function DataGallery({ figures }: { figures: DataFigure[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedIndex = figures.findIndex((f) => f.id === expandedId);
  const expanded = expandedIndex >= 0 ? figures[expandedIndex] : null;

  return (
    <>
      <div data-shell="gallery" className="grid grid-flow-row-dense grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {figures.map((figure, i) => (
          <DataCard key={figure.id} figure={figure} index={i} onExpand={() => setExpandedId(figure.id)} />
        ))}
      </div>
      <DataFigureModal figure={expanded} index={Math.max(expandedIndex, 0)} onClose={() => setExpandedId(null)} />
    </>
  );
}
