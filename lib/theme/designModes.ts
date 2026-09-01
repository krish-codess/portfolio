export type DesignModeId = "editorial" | "terminal" | "paper" | "digital" | "nocturne";

export interface DesignModeMeta {
  id: DesignModeId;
  index: string;
  name: string;
  descriptor: string;
}

// DESIGN MODE changes the design language -- typography, density, borders, radius, grain,
// motion, and (for terminal/nocturne only) the surface itself goes dark, independent of
// whatever accent hue the Color scheme supplies. See app/globals.css for [data-mode].
export const DESIGN_MODES: DesignModeMeta[] = [
  { id: "editorial", index: "01", name: "EDITORIAL", descriptor: "Warm paper, hard type, thin borders" },
  { id: "terminal", index: "02", name: "TERMINAL", descriptor: "Dark, dense, monospace, dashed rules, scanlines" },
  { id: "paper", index: "03", name: "PAPER", descriptor: "Newspaper structure, denser rules" },
  { id: "digital", index: "04", name: "DIGITAL", descriptor: "Clean, rounded, soft shadows, compact" },
  { id: "nocturne", index: "05", name: "NOCTURNE", descriptor: "Dark, spacious, atmospheric glow" },
];

export const DEFAULT_MODE: DesignModeId = "editorial";
export const MODE_STORAGE_KEY = "kg-portfolio-mode";

export function isDesignModeId(value: string | null): value is DesignModeId {
  return !!value && DESIGN_MODES.some((m) => m.id === value);
}
