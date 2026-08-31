// The Data Lab's categorical palette -- six hues that come from the active COLOR scheme
// (see [data-color] in globals.css), so "colorful data artifacts" always stay governed by
// whatever color the visitor has chosen, per figure not per chart type.
export const CHART_PALETTE = [
  "var(--chart-cat-1)",
  "var(--chart-cat-2)",
  "var(--chart-cat-3)",
  "var(--chart-cat-4)",
  "var(--chart-cat-5)",
  "var(--chart-cat-6)",
];

export function paletteColor(index: number) {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}
