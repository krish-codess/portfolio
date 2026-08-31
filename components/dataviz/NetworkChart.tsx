"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { NetworkData, NetworkNode } from "@/data/data-figures";

const W = 400;
const H = 220;
const CX = W / 2;
const CY = H / 2;

// Rounded to 2dp -- raw trig output can differ in its last bits between the server's and
// the browser's math libraries, which would otherwise trip a hydration mismatch.
function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function NetworkChart({ data, onHover }: { data: NetworkData; onHover?: (label: string | null) => void }) {
  const [active, setActive] = useState<string | null>(null);

  const positions = useMemo(() => {
    const groups = Array.from(new Set(data.nodes.map((n) => n.group))).sort();
    const byGroup = new Map<number, NetworkNode[]>();
    groups.forEach((g) => byGroup.set(g, data.nodes.filter((n) => n.group === g)));

    const pos = new Map<string, { x: number; y: number }>();
    groups.forEach((g, gi) => {
      const clusterAngle = gi * (360 / groups.length) + 45;
      const rad = (clusterAngle * Math.PI) / 180;
      const clusterCx = CX + Math.cos(rad) * 118;
      const clusterCy = CY + Math.sin(rad) * 68;
      const nodes = byGroup.get(g)!;
      nodes.forEach((node, ni) => {
        if (nodes.length === 1) {
          pos.set(node.id, { x: round(clusterCx), y: round(clusterCy) });
          return;
        }
        const a = (ni / nodes.length) * 360 + gi * 30;
        const nr = (a * Math.PI) / 180;
        pos.set(node.id, {
          x: round(clusterCx + Math.cos(nr) * 26),
          y: round(clusterCy + Math.sin(nr) * 26),
        });
      });
    });
    return pos;
  }, [data.nodes]);

  const degree = useMemo(() => {
    const d = new Map<string, number>();
    data.edges.forEach((e) => {
      d.set(e.source, (d.get(e.source) ?? 0) + 1);
      d.set(e.target, (d.get(e.target) ?? 0) + 1);
    });
    return d;
  }, [data.edges]);

  const connected = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    data.edges.forEach((e) => {
      if (e.source === active) set.add(e.target);
      if (e.target === active) set.add(e.source);
    });
    return set;
  }, [active, data.edges]);

  function hover(id: string | null) {
    setActive(id);
    if (!onHover) return;
    if (!id) return onHover(null);
    const node = data.nodes.find((n) => n.id === id);
    onHover(node ? `${node.label} — ${degree.get(id) ?? 0} CONNECTIONS` : null);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Network diagram of connections between disciplines">
      {data.edges.map((e, i) => {
        const a = positions.get(e.source);
        const b = positions.get(e.target);
        if (!a || !b) return null;
        const dim = connected && !(connected.has(e.source) && connected.has(e.target));
        return (
          <motion.line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--chart-line)"
            strokeWidth={0.75 + e.weight * 1.5}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: dim ? 0.08 : 0.25 + e.weight * 0.35 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
          />
        );
      })}
      {data.nodes.map((node, i) => {
        const p = positions.get(node.id);
        if (!p) return null;
        const isActive = active === node.id;
        const dim = connected && !connected.has(node.id);
        const r = 4 + (degree.get(node.id) ?? 0) * 1.1;
        return (
          <g key={node.id}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={isActive ? "var(--chart-annotation)" : "var(--chart-point)"}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: dim ? 0.25 : 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              style={{ cursor: "pointer", transformOrigin: `${p.x}px ${p.y}px`, transition: "fill 0.15s ease" }}
              onMouseEnter={() => hover(node.id)}
              onMouseLeave={() => hover(null)}
              onFocus={() => hover(node.id)}
              onBlur={() => hover(null)}
              tabIndex={0}
              role="button"
              aria-label={node.label}
            />
            <text
              x={p.x}
              y={p.y - r - 5}
              textAnchor="middle"
              fill="var(--chart-label)"
              fontSize={8.5}
              fontFamily="var(--font-mono)"
              opacity={dim ? 0.3 : 0.85}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
