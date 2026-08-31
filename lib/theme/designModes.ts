export type DesignModeId = "editorial" | "terminal" | "paper" | "digital" | "nocturne";

export interface DesignModeMeta {
  id: DesignModeId;
  index: string;
  name: string;
  descriptor: string;
}

// DESIGN MODE changes the design language -- typography, tracking, radius, grain, motion,
// and structural treatment. It never touches color; that's the Color scheme's job. See
// app/globals.css for the actual variable values per [data-mode].
export const DESIGN_MODES: DesignModeMeta[] = [
  { id: "editorial", index: "01", name: "EDITORIAL", descriptor: "Warm structure, hard type, thin borders" },
  { id: "terminal", index: "02", name: "TERMINAL", descriptor: "Monospace-heavy, technical annotations" },
  { id: "paper", index: "03", name: "PAPER", descriptor: "Newspaper structure, denser rules" },
  { id: "digital", index: "04", name: "DIGITAL", descriptor: "Clean, sharp, interface-oriented" },
  { id: "nocturne", index: "05", name: "NOCTURNE", descriptor: "Slower, spacious, atmospheric" },
];

export const DEFAULT_MODE: DesignModeId = "editorial";
export const MODE_STORAGE_KEY = "kg-portfolio-mode";

export function isDesignModeId(value: string | null): value is DesignModeId {
  return !!value && DESIGN_MODES.some((m) => m.id === value);
}
