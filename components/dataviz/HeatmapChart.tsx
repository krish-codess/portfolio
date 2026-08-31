"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeatmapData } from "@/data/data-figures";

const W = 300;
const H = 200;
const PAD_LEFT = 26;
const PAD_TOP = 6;
const PAD_BOTTOM = 6;
const PAD_RIGHT = 6;

export function HeatmapChart({ data, onHover }: { data: HeatmapData; onHover?: (label: string | null) => void }) {
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);
  const cols = data.cols.length;
  const rows = data.rows.length;
  const cellW = (W - PAD_LEFT - PAD_RIGHT) / cols;
  const cellH = (H - PAD_TOP - PAD_BOTTOM) / rows;

  function hover(r: number | null, c?: number) {
    if (r === null || c === undefined) {
      setActive(null);
      onHover?.(null);
      return;
    }
    setActive({ r, c });
    const cell = data.cells.find((cell) => cell.row === r && cell.col === c);
    onHover?.(`${data.rows[r]} ${data.cols[c]}H — ${Math.round((cell?.value ?? 0) * 100)}%`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Heatmap of activity by hour and day">
      {data.rows.map((label, r) => (
        <text key={label} x={PAD_LEFT - 6} y={PAD_TOP + r * cellH + cellH / 2 + 3} textAnchor="end" fill="var(--chart-axis)" fontSize={7.5} fontFamily="var(--font-mono)">
          {label}
        </text>
      ))}
      {data.cells.map((cell) => {
        const isActive = active?.r === cell.row && active?.c === cell.col;
        return (
          <motion.rect
            key={`${cell.row}-${cell.col}`}
            x={PAD_LEFT + cell.col * cellW + 1}
            y={PAD_TOP + cell.row * cellH + 1}
            width={cellW - 2}
            height={cellH - 2}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: (cell.row * data.cols.length + cell.col) * 0.008 }}
            fill={isActive ? "var(--chart-annotation)" : "var(--chart-point)"}
            fillOpacity={isActive ? 1 : 0.15 + cell.value * 0.75}
            style={{ cursor: "pointer", transition: "fill-opacity 0.15s ease" }}
            onMouseEnter={() => hover(cell.row, cell.col)}
            onMouseLeave={() => hover(null)}
            onFocus={() => hover(cell.row, cell.col)}
            onBlur={() => hover(null)}
            tabIndex={0}
            role="button"
            aria-label={`${data.rows[cell.row]} ${data.cols[cell.col]}h: ${Math.round(cell.value * 100)}%`}
          />
        );
      })}
    </svg>
  );
}
