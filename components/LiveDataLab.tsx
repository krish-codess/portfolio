"use client";

import { useSessionStats } from "@/lib/hooks/useSessionStats";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { THEMES } from "@/lib/theme/themes";
import { formatTime } from "@/lib/utils";
import { DATA_FIGURES } from "@/data/data-figures";
import { Meta } from "@/components/typography/Meta";

export function LiveDataLab({ visitedCount, totalSections }: { visitedCount: number; totalSections: number }) {
  const stats = useSessionStats();
  const { theme } = useTheme();
  const themeMeta = THEMES.find((t) => t.id === theme);
  const dataPoints = DATA_FIGURES.reduce((acc, f) => {
    if (Array.isArray(f.data)) return acc + f.data.length;
    if ("cells" in f.data) return acc + f.data.cells.length;
    return acc + f.data.nodes.length + f.data.edges.length;
  }, 0);

  const rows: [string, string][] = [
    ["SESSION TIME", formatTime(stats.sessionSeconds)],
    ["SECTIONS VISITED", `${visitedCount} / ${totalSections}`],
    ["SCROLL DISTANCE", `${stats.scrollMeters.toFixed(1)} M`],
    ["CURSOR TRAVEL", `${stats.pointerMeters.toFixed(1)} M`],
    ["ACTIVE THEME", themeMeta?.name ?? "—"],
    ["DATA POINTS ON PAGE", String(dataPoints)],
  ];

  return (
    <div className="border border-border p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-display text-xl uppercase tracking-tight">PERSONAL ANALYTICS</h4>
        <Meta>LIVE / LOCAL ONLY</Meta>
      </div>
      <p className="mt-3 max-w-md font-meta text-[11px] text-muted-fg">
        Measured in this browser tab only. Nothing here is stored or sent anywhere — it resets when you leave.
      </p>
      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b border-border py-2 font-meta text-[11px]">
            <dt className="text-muted-fg">{label}</dt>
            <dd className="tabular-nums text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
