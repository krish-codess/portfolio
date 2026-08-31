"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { XYPoint } from "@/data/data-figures";
import { scaleLinear } from "@/lib/utils";

const W = 400;
const H = 200;
const PAD = 14;

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

export function StreamChart({
  data,
  xLabel,
  yLabel,
  onHover,
}: {
  data: XYPoint[];
  xLabel?: string;
  yLabel?: string;
  onHover?: (label: string | null) => void;
}) {
  const [active, setActive] = useState<number | null>(null);

  const { points, line, area, echoLine } = useMemo(() => {
    const xs = data.map((d) => d.x);
    const sx = scaleLinear([Math.min(...xs), Math.max(...xs)], [PAD, W - PAD]);
    const sy = scaleLinear([0, 1], [H - PAD - 10, PAD + 20]);

    const points = data.map((d) => ({ x: sx(d.x), y: sy(d.y) }));
    const echoPoints = data.map((d, i) => ({ x: sx(d.x), y: sy(d.y * 0.45) + 6 + (i % 2 === 0 ? 2 : -2) }));

    const line = smoothPath(points);
    const echoLine = smoothPath(echoPoints);
    const baseline = H - PAD;
    const area = `${line} L ${points[points.length - 1].x},${baseline} L ${points[0].x},${baseline} Z`;

    return { points, line, area, echoLine };
  }, [data]);

  function hover(i: number | null) {
    setActive(i);
    if (!onHover) return;
    if (i === null) return onHover(null);
    const d = data[i];
    onHover(`${xLabel ?? "X"} ${d.x} / ${yLabel ?? "Y"} ${d.y.toFixed(2)}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Stream plot of ${yLabel} over ${xLabel}`}>
      <path d={echoLine} fill="none" stroke="var(--chart-annotation)" strokeWidth={1} opacity={0.25} />
      <path d={area} fill="var(--chart-line)" opacity={0.09} />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--chart-line)"
        strokeWidth={1.75}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={active === i ? 5 : 0}
          fill="var(--chart-annotation)"
          style={{ transition: "r 0.15s ease" }}
        />
      ))}
      {points.map((p, i) => (
        <rect
          key={`hit-${i}`}
          x={p.x - 8}
          y={PAD}
          width={16}
          height={H - PAD * 2}
          fill="transparent"
          style={{ cursor: "pointer" }}
          onMouseEnter={() => hover(i)}
          onMouseLeave={() => hover(null)}
          onFocus={() => hover(i)}
          onBlur={() => hover(null)}
          tabIndex={0}
          role="button"
          aria-label={`${xLabel}: ${data[i].x}, ${yLabel}: ${data[i].y}`}
        />
      ))}
    </svg>
  );
}
