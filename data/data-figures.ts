export type ChartType = "scatter" | "line" | "bar" | "radial" | "heatmap" | "network" | "stream";
export type FigureSize = "small" | "medium" | "wide" | "featured";
export type DataStatus = "ILLUSTRATIVE DATA" | "SAMPLE DATA" | "PLACEHOLDER DATA" | "EXPERIMENTAL DATA" | "PERSONAL DATA";

export interface XYPoint {
  x: number;
  y: number;
  label?: string;
}

export interface CategoryPoint {
  label: string;
  value: number;
  max?: number;
}

export interface HeatCell {
  row: number;
  col: number;
  value: number; // 0..1
}

export interface NetworkNode {
  id: string;
  label: string;
  group: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number; // 0..1
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface HeatmapData {
  rows: string[];
  cols: string[];
  cells: HeatCell[];
}

export interface DataFigure {
  id: string;
  fig: string;
  dataset: string;
  title: string;
  subtitle?: string;
  type: ChartType;
  size: FigureSize;
  xLabel?: string;
  yLabel?: string;
  observation: string;
  status: DataStatus;
  date: string;
  source: string;
  data: XYPoint[] | CategoryPoint[] | HeatmapData | NetworkData;
}

// Every dataset below is fabricated for demonstration and clearly labeled as such. None of
// it is a real personal measurement yet -- replace `data` arrays with logged data once
// collected, and update `status` to match (e.g. "PERSONAL DATA" once it's real).
export const DATA_FIGURES: DataFigure[] = [
  {
    id: "work-rhythms",
    fig: "01",
    dataset: "DATASET / 001",
    title: "WORK RHYTHMS",
    subtitle: "OUTPUT BY HOUR, ONE COMPOSITE SESSION",
    type: "line",
    size: "wide",
    xLabel: "HOUR",
    yLabel: "LINES WRITTEN",
    observation: "OUTPUT PEAKS WELL AFTER MIDNIGHT.",
    status: "ILLUSTRATIVE DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL COMMIT TIMESTAMPS",
    data: [
      { x: 0, y: 40 }, { x: 2, y: 12 }, { x: 4, y: 4 }, { x: 6, y: 2 },
      { x: 8, y: 18 }, { x: 10, y: 46 }, { x: 12, y: 30 }, { x: 14, y: 52 },
      { x: 16, y: 64 }, { x: 18, y: 38 }, { x: 20, y: 58 }, { x: 22, y: 90 },
      { x: 23, y: 120 },
    ],
  },
  {
    id: "attention",
    fig: "02",
    dataset: "DATASET / 002",
    title: "ATTENTION",
    subtitle: "TABS VS. PRODUCTIVITY",
    type: "scatter",
    size: "small",
    xLabel: "TABS",
    yLabel: "PRODUCTIVITY",
    observation: "THE CORRELATION IS REGRETTABLE.",
    status: "ILLUSTRATIVE DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL BROWSER SESSION",
    data: [
      { x: 3, y: 9 }, { x: 8, y: 7.4 }, { x: 15, y: 6.1 }, { x: 24, y: 4.6 },
      { x: 33, y: 3.4 }, { x: 47, y: 2.1 }, { x: 61, y: 1.2 }, { x: 74, y: 0.6 },
    ],
  },
  {
    id: "influence-map",
    fig: "03",
    dataset: "DATASET / 003",
    title: "INFLUENCE MAP",
    subtitle: "HOW THE FOUR DISCIPLINES CONNECT",
    type: "network",
    size: "featured",
    observation: "NOTHING HERE IS ISOLATED FROM ANYTHING ELSE.",
    status: "PERSONAL DATA",
    date: "31.08.26",
    source: "SELF-ASSESSED, ROUGHLY HONEST",
    data: {
      nodes: [
        { id: "data", label: "DATA", group: 0 },
        { id: "code", label: "CODE", group: 1 },
        { id: "design", label: "DESIGN", group: 2 },
        { id: "music", label: "MUSIC", group: 3 },
        { id: "analysis", label: "ANALYSIS", group: 0 },
        { id: "systems", label: "SYSTEMS", group: 1 },
        { id: "typography", label: "TYPE", group: 2 },
        { id: "rhythm", label: "RHYTHM", group: 3 },
        { id: "pattern", label: "PATTERN", group: 0 },
      ],
      edges: [
        { source: "data", target: "analysis", weight: 0.9 },
        { source: "data", target: "pattern", weight: 0.8 },
        { source: "code", target: "systems", weight: 0.9 },
        { source: "design", target: "typography", weight: 0.9 },
        { source: "music", target: "rhythm", weight: 0.9 },
        { source: "pattern", target: "music", weight: 0.6 },
        { source: "pattern", target: "design", weight: 0.55 },
        { source: "systems", target: "design", weight: 0.5 },
        { source: "analysis", target: "code", weight: 0.6 },
        { source: "rhythm", target: "code", weight: 0.45 },
        { source: "typography", target: "data", weight: 0.35 },
      ],
    },
  },
  {
    id: "screen-activity",
    fig: "04",
    dataset: "DATASET / 004",
    title: "SCREEN ACTIVITY",
    subtitle: "HOUR × DAY INTENSITY",
    type: "heatmap",
    size: "medium",
    observation: "WEDNESDAY NIGHTS ARE UNUSUALLY ACTIVE.",
    status: "SAMPLE DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL ACTIVITY LOG",
    data: {
      rows: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      cols: ["06", "10", "14", "18", "22", "02"],
      cells: (() => {
        const seedByDay = [0.3, 0.4, 0.9, 0.5, 0.6, 0.35, 0.25];
        const cells: HeatCell[] = [];
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < 6; c++) {
            const base = seedByDay[r];
            const curve = Math.sin((c / 5) * Math.PI);
            cells.push({ row: r, col: c, value: Math.min(1, Math.max(0.05, base * (0.4 + curve))) });
          }
        }
        return cells;
      })(),
    },
  },
  {
    id: "design-loops",
    fig: "05",
    dataset: "DATASET / 005",
    title: "DESIGN LOOPS",
    subtitle: "FIGMA OPENS BEFORE DESIGNING",
    type: "line",
    size: "medium",
    xLabel: "MINUTES",
    yLabel: "CUMULATIVE OPENS",
    observation: "DESIGN BEGINS AT THE FOURTH OPEN.",
    status: "PLACEHOLDER DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL APP FOCUS LOG",
    data: [
      { x: 0, y: 1 }, { x: 5, y: 2 }, { x: 10, y: 3 }, { x: 17, y: 4 },
      { x: 22, y: 4 }, { x: 30, y: 4 }, { x: 45, y: 4 },
    ],
  },
  {
    id: "night-drift",
    fig: "06",
    dataset: "DATASET / 006",
    title: "NIGHT DRIFT",
    subtitle: '"ONE LAST THING" PROBABILITY',
    type: "radial",
    size: "small",
    observation: "APPROACHES CERTAINTY BY HOUR THREE.",
    status: "EXPERIMENTAL DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL SLEEP LOG",
    data: [
      { label: "+0H", value: 20, max: 100 },
      { label: "+1H", value: 45, max: 100 },
      { label: "+2H", value: 68, max: 100 },
      { label: "+3H", value: 86, max: 100 },
      { label: "+4H", value: 95, max: 100 },
      { label: "+5H", value: 99, max: 100 },
    ],
  },
  {
    id: "listening-patterns",
    fig: "07",
    dataset: "DATASET / 007",
    title: "LISTENING PATTERNS",
    subtitle: "ENERGY OF WHAT'S PLAYING, ACROSS A SESSION",
    type: "stream",
    size: "wide",
    xLabel: "MINUTES",
    yLabel: "ENERGY",
    observation: "SLOWER TRACKS CLUSTER AROUND DEADLINES.",
    status: "ILLUSTRATIVE DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL LISTENING HISTORY",
    data: [
      { x: 0, y: 0.3 }, { x: 10, y: 0.5 }, { x: 20, y: 0.8 }, { x: 30, y: 0.65 },
      { x: 40, y: 0.9 }, { x: 50, y: 0.7 }, { x: 60, y: 0.4 }, { x: 70, y: 0.35 },
      { x: 80, y: 0.55 }, { x: 90, y: 0.3 }, { x: 100, y: 0.2 },
    ],
  },
  {
    id: "focus-curve",
    fig: "08",
    dataset: "DATASET / 008",
    title: "FOCUS CURVE",
    subtitle: "CAFFEINE VS. CODE QUALITY",
    type: "scatter",
    size: "small",
    xLabel: "MG",
    yLabel: "QUALITY",
    observation: "THERE IS AN OPTIMUM. IT IS NARROW.",
    status: "ILLUSTRATIVE DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL SELF-ASSESSMENT",
    data: [
      { x: 0, y: 4.5 }, { x: 80, y: 7.1 }, { x: 160, y: 8.9 }, { x: 240, y: 7.0 },
      { x: 320, y: 4.1 }, { x: 400, y: 1.8 },
    ],
  },
  {
    id: "creative-output",
    fig: "09",
    dataset: "DATASET / 009",
    title: "CREATIVE OUTPUT",
    subtitle: "IDEAS SHIPPED, BY DAY",
    type: "bar",
    size: "medium",
    xLabel: "DAY",
    yLabel: "SHIPPED",
    observation: "MOST IDEAS DIE ON A TUESDAY.",
    status: "SAMPLE DATA",
    date: "31.08.26",
    source: "HYPOTHETICAL PROJECT LOG",
    data: [
      { label: "MON", value: 2 }, { label: "TUE", value: 1 }, { label: "WED", value: 4 },
      { label: "THU", value: 3 }, { label: "FRI", value: 5 }, { label: "SAT", value: 3 },
      { label: "SUN", value: 2 },
    ],
  },
];
