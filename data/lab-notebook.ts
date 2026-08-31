export type LabStatus = "ONGOING" | "TRYING AGAIN" | "SHIPPED" | "ABANDONED";

export interface LabEntry {
  id: string;
  date: string;
  tried: string;
  result: string;
  status: LabStatus;
  tags: string[];
}

// A running log of this site's own construction -- genuinely self-referential, not a
// record of external client work. Add real entries here as they happen.
export const LAB_ENTRIES: LabEntry[] = [
  {
    id: "entry-06",
    date: "31 AUG 2026",
    tried: "Making typography react to the music player.",
    result: "Too much. Words started jittering like they'd had too much coffee.",
    status: "TRYING AGAIN",
    tags: ["MUSIC", "DESIGN"],
  },
  {
    id: "entry-05",
    date: "28 AUG 2026",
    tried: "Laying out the data section as a dashboard grid.",
    result: "Technically fine. Felt like a spreadsheet with better fonts.",
    status: "ABANDONED",
    tags: ["DATA", "DESIGN"],
  },
  {
    id: "entry-04",
    date: "25 AUG 2026",
    tried: "A real correlation engine instead of hardcoded fake charts.",
    result: "It generates a new (fake) dataset on every click. Weirdly satisfying.",
    status: "SHIPPED",
    tags: ["DATA", "CODE"],
  },
  {
    id: "entry-03",
    date: "20 AUG 2026",
    tried: "A custom cursor with too many contextual states.",
    result: "Visitors spent more time reading the cursor than the page.",
    status: "SHIPPED",
    tags: ["CODE", "DESIGN"],
  },
  {
    id: "entry-02",
    date: "14 AUG 2026",
    tried: "Five themes that only swapped colors.",
    result: "Boring. Same site in a different coat of paint.",
    status: "SHIPPED",
    tags: ["DESIGN", "CODE"],
  },
  {
    id: "entry-01",
    date: "05 AUG 2026",
    tried: "Writing the copy for this site without corporate language.",
    result: "Harder than expected. Still catching myself mid-sentence.",
    status: "ONGOING",
    tags: ["WRITING"],
  },
];
