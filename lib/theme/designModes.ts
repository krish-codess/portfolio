export type DesignModeId = "editorial" | "swiss" | "terminal" | "archive" | "kinetic";

export interface DesignModeMeta {
  id: DesignModeId;
  index: string;
  name: string;
  descriptor: string;
}

// DESIGN MODE is not a palette swap -- it is which of five art-directors built this site.
// Content (data/*.ts) never changes between modes; everything about how it's PRESENTED does:
// typeface, case, grid, density, nav placement, card grammar, hero, and the mode switcher's
// own shape. See app/globals.css for [data-mode] and the per-mode Hero/*.tsx components.
export const DESIGN_MODES: DesignModeMeta[] = [
  { id: "editorial", index: "01", name: "EDITORIAL", descriptor: "Brutalist magazine — Anton display, near-black, red" },
  { id: "swiss", index: "02", name: "SWISS", descriptor: "International Typographic Style — strict grid, neutral grotesk" },
  { id: "terminal", index: "03", name: "TERMINAL", descriptor: "Computational console — monospace, dark, command-driven" },
  { id: "archive", index: "04", name: "ARCHIVE", descriptor: "Research notebook — serif, warm paper, marginalia" },
  { id: "kinetic", index: "05", name: "KINETIC", descriptor: "Digital experiment — spatial, motion-led, generative" },
];

export const DEFAULT_MODE: DesignModeId = "editorial";
export const MODE_STORAGE_KEY = "kg-portfolio-mode";

export function isDesignModeId(value: string | null): value is DesignModeId {
  return !!value && DESIGN_MODES.some((m) => m.id === value);
}
