import { Project } from "@/data/projects";
import { CODETOBER_2026 } from "@/data/codetober";
import { scaleLinear } from "@/lib/utils";

// Each preview says what it is. Mockups are never passed off as screenshots, and the RUL
// figure only draws numbers that exist in the project's dataset and results files.
export const VISUAL_CAPTION: Record<Project["visual"], string> = {
  spark: "ILLUSTRATIVE MOCKUP · SAMPLE DATA, NOT A SCREENSHOT",
  campuspay: "ILLUSTRATIVE MOCKUP · SEEDED DEMO VALUES",
  rul: "REAL DATA · FD001 ENGINE 1, SENSOR 11 · REPORTED TEST RMSE",
  codetober: "SHIPPED DAYS · UPDATED AS EACH BUILD LANDS",
};

const panel = "border border-border bg-[var(--bg)]";

function SparkVisual() {
  const bars = [
    ["NORTH", 12.4],
    ["WEST", 18.9],
    ["SOUTH", 9.1],
    ["EAST", 15.2],
    ["CENTRAL", 6.7],
  ] as const;
  return (
    <div className="grid h-full gap-3 p-3 font-meta text-[10px] uppercase sm:grid-cols-5 sm:p-4">
      <div className="flex flex-col gap-3 sm:col-span-2">
        <div className={`${panel} p-3`}>
          <div className="flex items-center gap-2 text-muted-fg">
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden className="text-accent">
              <rect x="3" y="0" width="4" height="8" rx="2" fill="currentColor" />
              <path d="M1 6a4 4 0 0 0 8 0M5 10v2" stroke="currentColor" fill="none" />
            </svg>
            ASK
          </div>
          <p className="mt-2 normal-case leading-snug text-[12px]" style={{ letterSpacing: 0 }}>
            Which region grew fastest last quarter?
          </p>
        </div>
        <div className={`${panel} space-y-1.5 p-3 text-muted-fg`}>
          <div>✓ SCHEMA LOADED</div>
          <div>
            <span className="text-accent">↻</span> ATTEMPT 2/3 · ERROR FED BACK
          </div>
          <div>✓ 5 ROWS</div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-muted-fg">
          {["CSV", "XLSX", "MYSQL", "PG", "SQLITE"].map((s) => (
            <span key={s} className="border border-border px-1.5 py-0.5">
              {s}
            </span>
          ))}
          <span className="text-accent">→ DUCKDB</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:col-span-3">
        <pre className={`${panel} overflow-hidden p-3 normal-case leading-relaxed`} style={{ letterSpacing: 0 }}>
          <span className="text-accent">SELECT</span> region, growth_pct{"\n"}
          <span className="text-accent">FROM</span> quarterly_sales{"\n"}
          <span className="text-accent">ORDER BY</span> growth_pct <span className="text-accent">DESC</span>;
        </pre>
        <div className={`${panel} flex-1 p-3`}>
          <svg viewBox="0 0 200 92" className="h-full w-full" aria-hidden>
            {bars.map(([label, v], i) => {
              const w = (v / 20) * 120;
              const y = i * 18;
              return (
                <g key={label}>
                  <text x="0" y={y + 10} fontSize="7" fill="var(--muted)" fontFamily="inherit">
                    {label}
                  </text>
                  <rect x="44" y={y + 3} width={w} height="9" fill={i === 1 ? "var(--accent)" : "var(--chart-grid)"} stroke="var(--border)" />
                  <text x={48 + w} y={y + 10} fontSize="7" fill="var(--fg)" fontFamily="inherit">
                    {v}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

function CampusPayVisual() {
  // Wallet values are the README's seeded demo account; the transactions are sample rows.
  const txns = [
    ["CANTEEN · 2 ITEMS", "−₹60.00"],
    ["LIBRARY PRINTS", "−₹12.00"],
    ["WALLET TOP-UP", "+₹200.00"],
  ];
  return (
    <div className="space-y-3 p-3 font-meta text-[10px] uppercase sm:p-4">
      <div className={`${panel} flex items-end justify-between p-4`}>
        <div>
          <div className="text-muted-fg">CAMPUS WALLET</div>
          <div className="mt-2 font-display text-3xl normal-case tracking-tight">₹500.00</div>
        </div>
        <div className="text-right text-muted-fg">
          STUDENT ONE
          <br />
          CARD-DEMO-001
        </div>
      </div>
      <ul className={`${panel} divide-y divide-[var(--border)]`}>
        {txns.map(([label, amt]) => (
          <li key={label} className="flex justify-between px-3 py-2">
            <span className="text-muted-fg">{label}</span>
            <span className={amt.startsWith("+") ? "text-accent" : ""}>{amt}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-1 text-muted-fg">
        {["TAP", "AUTH", "LOCK", "DEBIT", "LEDGER"].map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            {i > 0 && <span className="text-accent">→</span>}
            <span className="border border-border px-1.5 py-0.5">{s}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// train_FD001.txt, engine 1 (192 cycles): sensor 11, 10-cycle rolling mean, every 6th cycle.
const SENSOR_11 = [
  47.47, 47.31, 47.22, 47.24, 47.26, 47.34, 47.33, 47.29, 47.32, 47.28, 47.29, 47.36, 47.36, 47.37, 47.39, 47.35, 47.42,
  47.48, 47.5, 47.48, 47.48, 47.55, 47.58, 47.58, 47.56, 47.61, 47.66, 47.74, 47.83, 47.92, 47.97, 48.05, 48.14,
];
// results/metrics_table.csv, test rows.
const TEST_RMSE = [
  ["STATIC AVG", 14.1],
  ["GATED MOE", 14.42],
  ["STACKER", 14.48],
  ["LIGHTGBM", 14.71],
  ["GP", 14.77],
  ["CATBOOST", 14.84],
  ["NGBOOST", 15.03],
  ["ESN", 15.14],
  ["ELM", 17.16],
] as const;

function RulVisual() {
  const W = 520;
  const H = 120;
  const cycles = 192;
  const x = scaleLinear([0, cycles], [0, W]);
  const ySensor = scaleLinear([47.1, 48.2], [H - 4, 4]);
  const yRul = scaleLinear([0, 125], [H - 4, 4]);
  const step = cycles / (SENSOR_11.length - 1);
  const sensorPath = SENSOR_11.map((v, i) => `${i ? "L" : "M"}${x(i * step).toFixed(1)},${ySensor(v).toFixed(1)}`).join("");
  // True piecewise target: min(125, 192 - cycle).
  const rulPath = `M${x(0)},${yRul(125)}L${x(cycles - 125)},${yRul(125)}L${x(cycles)},${yRul(0)}`;
  // Bars start at RMSE 12 so the differences are visible; the label says so.
  const pct = scaleLinear([12, 18], [0, 100]);

  return (
    <div className="space-y-3 p-3 font-meta text-[10px] uppercase sm:p-4">
      <div className={`${panel} p-3`}>
        <div className="flex flex-wrap justify-between gap-x-4 text-muted-fg">
          <span>SENSOR 11 · ROLLING MEAN</span>
          <span>
            <span className="text-accent">━</span> SENSOR <span className="ml-2">┅</span> CAPPED RUL
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-3 h-28 w-full" aria-hidden>
          {[0, 0.5, 1].map((t) => (
            <line key={t} x1="0" x2={W} y1={4 + t * (H - 8)} y2={4 + t * (H - 8)} stroke="var(--chart-grid)" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={rulPath} fill="none" stroke="var(--muted)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          <path d={sensorPath} fill="none" stroke="var(--accent)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-1 flex justify-between text-muted-fg">
          <span>CYCLE 0</span>
          <span>FAILURE · 192</span>
        </div>
      </div>
      <div className={`${panel} p-3`}>
        <div className="text-muted-fg">TEST RMSE · 100 ENGINES · LOWER IS BETTER · AXIS FROM 12</div>
        <ul className="mt-3 space-y-1">
          {TEST_RMSE.map(([label, v], i) => (
            <li key={label} className="grid grid-cols-[5.5rem_1fr] items-center gap-2">
              <span className="text-muted-fg">{label}</span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 border border-border" style={{ width: `${pct(v) * 0.8}%`, background: i === 0 ? "var(--accent)" : "var(--chart-grid)" }} />
                {v.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CodetoberVisual() {
  const shipped = CODETOBER_2026.projects.filter((p) => p.status === "completed").length;
  return (
    <div className="p-3 font-meta text-[10px] uppercase sm:p-4">
      <div className="flex justify-between text-muted-fg">
        <span>OCT 01 — 31</span>
        <span>
          <span className="text-accent">{shipped}</span> / {CODETOBER_2026.projects.length} SHIPPED
        </span>
      </div>
      <div className="mt-2 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-[2px]" aria-hidden>
        {CODETOBER_2026.projects.map((p) => (
          <span key={p.day} className="h-4" style={{ background: p.status === "completed" ? "var(--accent)" : "var(--chart-grid)" }} />
        ))}
      </div>
    </div>
  );
}

export function ProjectVisual({ visual }: { visual: Project["visual"] }) {
  if (visual === "spark") return <SparkVisual />;
  if (visual === "campuspay") return <CampusPayVisual />;
  if (visual === "rul") return <RulVisual />;
  return <CodetoberVisual />;
}
