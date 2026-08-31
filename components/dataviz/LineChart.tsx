"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { XYPoint } from "@/data/data-figures";
import { scaleLinear } from "@/lib/utils";

const W = 300;
const H = 200;
const PAD = 16;

export function LineChart({
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

  const { sx, sy, path, area } = useMemo(() => {
    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.y);
    const sx = scaleLinear([Math.min(...xs), Math.max(...xs)], [PAD, W - PAD]);
    const sy = scaleLinear([0, Math.max(...ys) * 1.1], [H - PAD, PAD]);
    const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${sx(d.x)} ${sy(d.y)}`).join(" ");
    const area = `${path} L ${sx(xs[xs.length - 1])} ${H - PAD} L ${sx(xs[0])} ${H - PAD} Z`;
    return { sx, sy, path, area };
  }, [data]);

  function hover(i: number | null) {
    setActive(i);
    if (!onHover) return;
    if (i === null) return onHover(null);
    const d = data[i];
    onHover(`${xLabel ?? "X"} ${d.x} / ${yLabel ?? "Y"} ${d.y}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Line chart of ${yLabel} over ${xLabel}`}>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={PAD} x2={W - PAD} y1={PAD + t * (H - 2 * PAD)} y2={PAD + t * (H - 2 * PAD)} stroke="var(--chart-grid)" strokeWidth={1} />
      ))}
      <path d={area} fill={color} opacity={0.12} />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={sx(d.x)}
          cy={sy(d.y)}
          r={active === i ? 5 : 2.5}
          fill={color}
          style={{ transition: "r 0.15s ease", cursor: "pointer" }}
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
