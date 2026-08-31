export type ThemeId = "editorial" | "terminal" | "chrome" | "paper" | "nocturne";

export interface ThemeMeta {
  id: ThemeId;
  index: string;
  name: string;
  descriptor: string;
}

export const THEMES: ThemeMeta[] = [
  { id: "editorial", index: "01", name: "EDITORIAL", descriptor: "Warm paper / hard type / orange-red" },
  { id: "terminal", index: "02", name: "TERMINAL", descriptor: "Near-black / monospace / acid green" },
  { id: "chrome", index: "03", name: "CHROME", descriptor: "Silver / digital / cool blue" },
  { id: "paper", index: "04", name: "PAPER", descriptor: "Newspaper / warm ink / red" },
  { id: "nocturne", index: "05", name: "NOCTURNE", descriptor: "Dark / atmospheric / violet" },
];

export const DEFAULT_THEME: ThemeId = "editorial";
export const THEME_STORAGE_KEY = "kg-portfolio-theme";

export function isThemeId(value: string | null): value is ThemeId {
  return !!value && THEMES.some((t) => t.id === value);
}
