export interface DesignWork {
  index: string;
  title: string;
  medium: string;
  year: string;
  size: "large" | "medium" | "small";
  hue: number; // used to generate a placeholder gradient swatch, deg 0-360
  placeholder: boolean;
}

// PLACEHOLDER DATA — replace hue-based swatches with real images once available.
export const DESIGN_WORKS: DesignWork[] = [
  { index: "D01", title: "VISUAL SYSTEM ONE", medium: "BRAND / TYPE", year: "2026", size: "large", hue: 14, placeholder: true },
  { index: "D02", title: "POSTER SERIES", medium: "PRINT", year: "2025", size: "medium", hue: 210, placeholder: true },
  { index: "D03", title: "UI EXPLORATION", medium: "INTERFACE", year: "2025", size: "medium", hue: 265, placeholder: true },
  { index: "D04", title: "TYPE EXPERIMENT", medium: "TYPOGRAPHY", year: "2024", size: "small", hue: 40, placeholder: true },
  { index: "D05", title: "SOCIAL SYSTEM", medium: "SOCIAL / BRAND", year: "2024", size: "small", hue: 340, placeholder: true },
];
