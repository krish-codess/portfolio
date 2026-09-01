"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CategoryPoint } from "@/data/data-figures";

const SIZE = 200;
const CENTER = SIZE / 2;
const R_INNER = 26;
const R_OUTER = 88;

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

function sectorPath(startAngle: number, endAngle: number, rOuter: number) {
  const p0 = polar(CENTER, CENTER, R_INNER, startAngle);
  const p1 = polar(CENTER, CENTER, rOuter, startAngle);
  const p2 = polar(CENTER, CENTER, rOuter, endAngle);
  const p3 = polar(CENTER, CENTER, R_INNER, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${p0.x} ${p0.y} Z`;
}

export function RadialChart({
  data,
  yLabel,
  onHover,
  palette = ["var(--chart-point)"],
}: {
  data: CategoryPoint[];
  xLabel?: string;
  yLabel?: string;
  onHover?: (label: string | null) => void;
  palette?: string[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const gap = 4;
  const slice = 360 / data.length;

  function hover(i: number | null) {
    setActive(i);
    if (!onHover) return;
    if (i === null) return onHover(null);
    const d = data[i];
    onHover(`${d.label} ${d.value}${yLabel?.includes("%") ? "%" : ""}`);
  }

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto block h-full w-full max-h-full max-w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Radial chart of ${yLabel}`}>
      {[0.33, 0.66, 1].map((t) => (
        <circle key={t} cx={CENTER} cy={CENTER} r={R_INNER + t * (R_OUTER - R_INNER)} fill="none" stroke="var(--chart-grid)" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const max = d.max ?? 100;
        const start = i * slice + gap / 2;
        const end = (i + 1) * slice - gap / 2;
        const rOuter = R_INNER + (d.value / max) * (R_OUTER - R_INNER);
        const isActive = active === i;
        return (
          <motion.path
            key={d.label}
            d={sectorPath(start, end, rOuter)}
            fill={palette[i % palette.length]}
            fillOpacity={isActive ? 1 : 0.85}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            style={{ cursor: "pointer", transition: "fill-opacity 0.15s ease" }}
            onMouseEnter={() => hover(i)}
            onMouseLeave={() => hover(null)}
            onFocus={() => hover(i)}
            onBlur={() => hover(null)}
            tabIndex={0}
            role="button"
            aria-label={`${d.label}: ${d.value}`}
          />
        );
      })}
      <text x={CENTER} y={CENTER + 4} textAnchor="middle" fill="var(--chart-label)" fontSize={13} fontFamily="var(--font-display)">
        {active !== null ? `${data[active].value}` : "—"}
      </text>
    </svg>
  );
}
