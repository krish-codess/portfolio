"use client";

import { useMemo, useState } from "react";
import { XYPoint } from "@/data/data-figures";
import { scaleLinear } from "@/lib/utils";

const W = 300;
const H = 200;
const PAD = 16;

export function ScatterChart({
  data,
  xLabel,
  yLabel,
  onHover,
  color = "var(--chart-point)",
}: {
  data: XYPoint[];
  xLabel?: string;
  yLabel?: string;
  onHover?: (label: string | null) => void;
  color?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  const { sx, sy, trend } = useMemo(() => {
    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.y);
    const sx = scaleLinear([Math.min(...xs), Math.max(...xs)], [PAD, W - PAD]);
    const sy = scaleLinear([Math.min(...ys), Math.max(...ys)], [H - PAD, PAD]);

    const n = data.length;
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((acc, x, i) => acc + (x - meanX) * (ys[i] - meanY), 0);
    const den = xs.reduce((acc, x) => acc + (x - meanX) ** 2, 0) || 1;
    const slope = num / den;
    const intercept = meanY - slope * meanX;
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const trend = { x1: x0, y1: intercept + slope * x0, x2: x1, y2: intercept + slope * x1 };

    return { sx, sy, trend };
  }, [data]);

  function hover(i: number | null) {
    setActive(i);
    if (!onHover) return;
    if (i === null) return onHover(null);
    const d = data[i];
    onHover(`${xLabel ?? "X"} ${d.x} / ${yLabel ?? "Y"} ${d.y}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Scatter plot of ${yLabel} against ${xLabel}`}>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={PAD} x2={W - PAD} y1={PAD + t * (H - 2 * PAD)} y2={PAD + t * (H - 2 * PAD)} stroke="var(--chart-grid)" strokeWidth={1} />
      ))}
      <line x1={sx(trend.x1)} y1={sy(trend.y1)} x2={sx(trend.x2)} y2={sy(trend.y2)} stroke={color} strokeWidth={1.25} strokeDasharray="3 4" opacity={0.45} />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={sx(d.x)}
          cy={sy(d.y)}
          r={active === i ? 6 : 3.5}
          fill={color}
          fillOpacity={active === i ? 1 : 0.75}
          stroke="var(--bg)"
          strokeWidth={1}
          style={{ transition: "r 0.15s ease, fill-opacity 0.15s ease", cursor: "pointer" }}
          onMouseEnter={() => hover(i)}
          onMouseLeave={() => hover(null)}
          onFocus={() => hover(i)}
          onBlur={() => hover(null)}
          tabIndex={0}
          role="button"
          aria-label={`${xLabel}: ${d.x}, ${yLabel}: ${d.y}`}
        />
      ))}
      <line x1={PAD} x2={PAD} y1={PAD} y2={H - PAD} stroke="var(--chart-axis)" strokeWidth={1} opacity={0.5} />
      <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="var(--chart-axis)" strokeWidth={1} opacity={0.5} />
    </svg>
  );
}
