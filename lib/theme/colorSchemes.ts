export type ColorSchemeId = "warm" | "mono" | "red" | "blue" | "acid" | "violet" | "teal" | "amber" | "rose" | "forest";

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
  { id: "violet", index: "06", name: "VIOLET", descriptor: "Black / lavender white / violet", swatch: "#7c3aed" },
  { id: "teal", index: "07", name: "TEAL", descriptor: "Black / cool white / teal", swatch: "#0d9488" },
  { id: "amber", index: "08", name: "AMBER", descriptor: "Black / cream / amber gold", swatch: "#d99a10" },
  { id: "rose", index: "09", name: "ROSE", descriptor: "Black / warm white / rose pink", swatch: "#e0468e" },
  { id: "forest", index: "10", name: "FOREST", descriptor: "Black / off-white / forest green", swatch: "#1f7a3d" },
];

export const DEFAULT_COLOR: ColorSchemeId = "warm";
export const COLOR_STORAGE_KEY = "kg-portfolio-color";

export function isColorSchemeId(value: string | null): value is ColorSchemeId {
  return !!value && COLOR_SCHEMES.some((c) => c.id === value);
}
