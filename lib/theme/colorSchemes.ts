export type ColorSchemeId = "warm" | "mono" | "red" | "blue" | "acid";

export interface ColorSchemeMeta {
  id: ColorSchemeId;
  index: string;
  name: string;
  descriptor: string;
  swatch: string;
}

// COLOR changes hue only -- background, foreground, accent, borders, and the Data Lab's
// categorical chart palette. It never touches typography, spacing, or layout; that's the
// Design Mode's job. See app/globals.css for the actual variable values per [data-color].
export const COLOR_SCHEMES: ColorSchemeMeta[] = [
  { id: "warm", index: "01", name: "WARM", descriptor: "Black / cream / orange-red", swatch: "#e84b32" },
  { id: "mono", index: "02", name: "MONO", descriptor: "Black / white / gray", swatch: "#77736f" },
  { id: "red", index: "03", name: "RED", descriptor: "Black / warm white / red", swatch: "#c81e3a" },
  { id: "blue", index: "04", name: "BLUE", descriptor: "Black / cool white / blue", swatch: "#2f6fed" },
  { id: "acid", index: "05", name: "ACID", descriptor: "Black / off-white / acid green", swatch: "#7cd12b" },
];

export const DEFAULT_COLOR: ColorSchemeId = "warm";
export const COLOR_STORAGE_KEY = "kg-portfolio-color";

export function isColorSchemeId(value: string | null): value is ColorSchemeId {
  return !!value && COLOR_SCHEMES.some((c) => c.id === value);
}
