import { DataFigure, HeatmapData, NetworkData, XYPoint, CategoryPoint } from "@/data/data-figures";
import { CHART_PALETTE, paletteColor } from "@/lib/theme/chartPalette";
import { ScatterChart } from "./ScatterChart";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { RadialChart } from "./RadialChart";
import { HeatmapChart } from "./HeatmapChart";
import { NetworkChart } from "./NetworkChart";
import { StreamChart } from "./StreamChart";

// Shared by the gallery card, the expanded detail view, and the Surprise Me reveal -- one
// place that maps a figure's `type` to its chart component and its color. Single-series
// charts get one hue from the categorical palette (keyed by the figure's position, so the
// gallery reads as a spread of distinct colors); multi-category charts (bar/radial/network)
// get the whole palette so each bar/segment/node-group reads as its own hue.
export function ChartRenderer({ figure, index, onHover }: { figure: DataFigure; index: number; onHover?: (label: string | null) => void }) {
  const color = paletteColor(index);

  switch (figure.type) {
    case "scatter":
      return <ScatterChart data={figure.data as XYPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={onHover} color={color} />;
    case "line":
      return <LineChart data={figure.data as XYPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={onHover} color={color} />;
    case "bar":
      return <BarChart data={figure.data as CategoryPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={onHover} palette={CHART_PALETTE} />;
    case "radial":
      return <RadialChart data={figure.data as CategoryPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={onHover} palette={CHART_PALETTE} />;
    case "heatmap":
      return <HeatmapChart data={figure.data as HeatmapData} onHover={onHover} color={color} />;
    case "network":
      return <NetworkChart data={figure.data as NetworkData} onHover={onHover} palette={CHART_PALETTE} />;
    case "stream":
      return <StreamChart data={figure.data as XYPoint[]} xLabel={figure.xLabel} yLabel={figure.yLabel} onHover={onHover} color={color} />;
    default:
      return null;
  }
}
