import { XYPoint } from "@/data/data-figures";

export const CORRELATION_VARIABLES = [
  "COFFEE",
  "SLEEP",
  "SONGS LISTENED",
  "CHROME TABS",
  "SCREEN TIME",
  "FIGMA OPENS",
  "GITHUB ACTIVITY",
  "CODING HOURS",
  "SNACKS",
  "TIME OF DAY",
  "BUGS FIXED",
  "SANITY",
  "DESIGN OUTPUT",
  "PRODUCTIVITY",
] as const;

export type CorrelationVariable = (typeof CORRELATION_VARIABLES)[number];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function mulberry32(seed: number) {
  let s = seed;
  return function rng() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function pearson(points: XYPoint[]) {
  const n = points.length;
  const mx = points.reduce((a, p) => a + p.x, 0) / n;
  const my = points.reduce((a, p) => a + p.y, 0) / n;
  const num = points.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0);
  const denX = Math.sqrt(points.reduce((a, p) => a + (p.x - mx) ** 2, 0));
  const denY = Math.sqrt(points.reduce((a, p) => a + (p.y - my) ** 2, 0));
  return num / (denX * denY || 1);
}

export interface CorrelationResult {
  points: XYPoint[];
  r: number;
}

export function generateCorrelation(a: string, b: string): CorrelationResult {
  const seed = hashString(`${a}|${b}`);
  const rng = mulberry32(seed);
  const targetR = rng() * 1.7 - 0.85;

  const points: XYPoint[] = [];
  for (let i = 0; i < 22; i++) {
    const x = gaussian(rng);
    const y = targetR * x + Math.sqrt(Math.max(0, 1 - targetR * targetR)) * gaussian(rng);
    points.push({
      x: Math.round((50 + x * 16) * 10) / 10,
      y: Math.round((50 + y * 16) * 10) / 10,
    });
  }

  return { points, r: Math.round(pearson(points) * 100) / 100 };
}

export function interpretR(r: number) {
  const abs = Math.abs(r);
  if (abs < 0.15) return "NO MEANINGFUL RELATIONSHIP";
  if (abs < 0.4) return r > 0 ? "WEAK POSITIVE DRIFT" : "WEAK NEGATIVE DRIFT";
  if (abs < 0.7) return r > 0 ? "MODERATE POSITIVE TREND" : "MODERATE NEGATIVE TREND";
  return r > 0 ? "STRONG POSITIVE TREND" : "STRONG NEGATIVE TREND";
}
