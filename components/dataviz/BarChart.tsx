"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CategoryPoint } from "@/data/data-figures";
import { scaleLinear } from "@/lib/utils";

const W = 300;
const H = 200;
const PAD_TOP = 12;
const PAD_BOTTOM = 22;
const PAD_SIDE = 8;

export function BarChart({
  data,
  yLabel,
  onHover,
}: {
  data: CategoryPoint[];
  xLabel?: string;
  yLabel?: string;
  onHover?: (label: string | null) => void;
}) {
  const [active, setActive] = useState<number | null>(null);

  const { sy, barWidth, gap } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value)) * 1.15;
    const sy = scaleLinear([0, max], [H - PAD_BOTTOM, PAD_TOP]);
    const gap = 6;
    const barWidth = (W - PAD_SIDE * 2 - gap * (data.length - 1)) / data.length;
    return { sy, barWidth, gap };
  }, [data]);

  function hover(i: number | null) {
    setActive(i);
    if (!onHover) return;
    if (i === null) return onHover(null);
    const d = data[i];
    onHover(`${d.label} ${d.value} ${yLabel ?? ""}`.trim());
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Bar chart of ${yLabel}`}>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={PAD_SIDE} x2={W - PAD_SIDE} y1={PAD_TOP + t * (H - PAD_TOP - PAD_BOTTOM)} y2={PAD_TOP + t * (H - PAD_TOP - PAD_BOTTOM)} stroke="var(--chart-grid)" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const x = PAD_SIDE + i * (barWidth + gap);
        const y = sy(d.value);
        const isActive = active === i;
        return (
          <g key={d.label}>
            <motion.rect
              x={x}
              width={barWidth}
              y={y}
              height={H - PAD_BOTTOM - y}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              fill={isActive ? "var(--chart-annotation)" : "var(--chart-point)"}
              style={{ cursor: "pointer", transition: "fill 0.15s ease", transformOrigin: "bottom", transformBox: "fill-box" }}
              onMouseEnter={() => hover(i)}
              onMouseLeave={() => hover(null)}
              onFocus={() => hover(i)}
              onBlur={() => hover(null)}
              tabIndex={0}
              role="button"
              aria-label={`${d.label}: ${d.value}`}
            />
            <text x={x + barWidth / 2} y={H - PAD_BOTTOM + 13} textAnchor="middle" fill="var(--chart-axis)" fontSize={8} fontFamily="var(--font-mono)">
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1={PAD_SIDE} x2={W - PAD_SIDE} y1={H - PAD_BOTTOM} y2={H - PAD_BOTTOM} stroke="var(--chart-axis)" strokeWidth={1} opacity={0.5} />
    </svg>
  );
}
