export type ArchiveCategory = "DATA" | "CODE" | "DESIGN" | "MUSIC" | "EXPERIMENT";

export interface ArchiveItem {
  id: string;
  year: string;
  index: string;
  title: string;
  category: ArchiveCategory;
  placeholder: boolean;
}

// PLACEHOLDER DATA -- generic category labels, not specific claimed work. Replace titles
// with real archive entries as they accumulate.
export const ARCHIVE_ITEMS: ArchiveItem[] = [
  { id: "a-2026-07", year: "2026", index: "07", title: "DATA EXPERIMENT", category: "EXPERIMENT", placeholder: true },
  { id: "a-2026-06", year: "2026", index: "06", title: "POSTER SERIES", category: "DESIGN", placeholder: true },
  { id: "a-2026-05", year: "2026", index: "05", title: "WEB APP", category: "CODE", placeholder: true },
  { id: "a-2026-04", year: "2026", index: "04", title: "TRACK / SESSION", category: "MUSIC", placeholder: true },
  { id: "a-2026-03", year: "2026", index: "03", title: "ML MODEL", category: "DATA", placeholder: true },
  { id: "a-2026-02", year: "2026", index: "02", title: "UI EXPERIMENT", category: "DESIGN", placeholder: true },
  { id: "a-2026-01", year: "2026", index: "01", title: "EXPERIMENT", category: "EXPERIMENT", placeholder: true },
  { id: "a-2025-04", year: "2025", index: "04", title: "VISUAL SYSTEM", category: "DESIGN", placeholder: true },
  { id: "a-2025-03", year: "2025", index: "03", title: "DATASET", category: "DATA", placeholder: true },
  { id: "a-2025-02", year: "2025", index: "02", title: "SOUND SKETCH", category: "MUSIC", placeholder: true },
  { id: "a-2025-01", year: "2025", index: "01", title: "SYSTEM / TOOL", category: "CODE", placeholder: true },
];
