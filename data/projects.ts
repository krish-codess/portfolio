export interface Project {
  slug: string;
  index: string;
  title: string;
  year: string;
  category: string;
  tagline: string;
  // Card copy, ~25-45 words. Everything longer lives on the detail page.
  description: string;
  technologies: string[];
  links: { live?: string; repo?: string };
  featured: boolean;
  visual: "spark" | "campuspay" | "rul" | "codetober";
  // Primary CTA. No href = the project's own /work/[slug] page.
  cta: { label: string; href?: string };
  // Ownership, stated only as far as the commit history supports it.
  role?: string;
  problem: string;
  highlights: string[];
  workflow?: string[];
  decisions?: string[];
  evidence: string;
  // Codetober only: module titles, resolved against data/codetober.ts.
  modules?: string[];
}

// Every claim below was checked against the project's own source/README (Oct 2026).
// A repo link only appears once the repository is public -- private ones are noted inline.
export const PROJECTS: Project[] = [
  {
    slug: "spark-engine",
    index: "01",
    title: "SPARK ENGINE",
    year: "2026",
    category: "AI ANALYTICS / DATA ENGINEERING",
    tagline: "Ask questions. Query data. Discover answers.",
    description:
      "A voice-first desktop analytics app: ask a question out loud, get SQL, a result table and a chart. Queries run on DuckDB across CSV, Excel, MySQL, PostgreSQL and SQLite, and a failing query is retried with the database error fed back.",
    technologies: ["TypeScript", "Electron", "Next.js", "DuckDB", "LLMs", "Expo"],
    // Repo is private (github.com/tanisheesh/SPARK-Engine): add links.repo once it's public.
    links: {},
    featured: true,
    visual: "spark",
    cta: { label: "VIEW PROJECT" },
    role: "Team project (Team Binary Beast). I built the Android companion app and the WebSocket relay that lets it query the desktop engine remotely.",
    problem:
      "Answering a quick question about your own data usually means opening a SQL client, remembering the schema and writing the query by hand. SPARK lets you just ask, while the data stays on your machine.",
    highlights: [
      "Natural-language and voice questions translated to SQL by an LLM (Groq in the cloud, or a local llama.cpp model).",
      "One local DuckDB engine over uploaded CSV and Excel files plus live MySQL, PostgreSQL and SQLite connections.",
      "Self-healing SQL: up to three attempts, each retry carrying the previous database error back to the model.",
      "Every answer shows its evidence: the generated SQL and the rows behind the chart.",
      "A Studio panel of follow-up actions on any result, each either computed from the rows already returned or run as a fresh query; ER diagrams (Chen and Crow's-foot) drawn from the schema.",
      "Android companion that sends a sentence and receives the answer, at most 20 preview rows and the SQL. No dataset ever leaves the desktop.",
    ],
    workflow: [
      "Voice / text question",
      "Schema-aware prompt to the LLM",
      "SQL executed on DuckDB",
      "On error: retry with error context (max 3)",
      "Table, chart and SQL returned as evidence",
    ],
    decisions: [
      "Desktop-first (Electron) so DuckDB and database drivers run next to the data instead of on a server.",
      "The relay stores nothing and both sides dial out, so the phone reaches the desktop without exposing a port, DuckDB or the uploads folder.",
      "Privacy levels gate network access before any call to a cloud model.",
    ],
    evidence:
      "Working Electron app with source-registry, DuckDB client and retry loop in the codebase; the relay ships with its own tests. No public demo or usage numbers.",
  },
  {
    slug: "campuspay",
    index: "02",
    title: "CAMPUSPAY",
    year: "2026",
    category: "FINTECH / FULL-STACK",
    tagline: "Making campus payments simpler and more transparent.",
    description:
      "A closed-loop campus payment prototype where the card is identity, not money: the backend authenticates a tap, row-locks the wallet, debits it atomically and writes an immutable ledger entry. Simulated campus credits only.",
    technologies: ["FastAPI", "PostgreSQL", "SQLAlchemy", "React", "TypeScript", "Docker"],
    // Repo is private (github.com/krish-codess/CampusPay): add links.repo once it's public.
    links: {},
    featured: false,
    visual: "campuspay",
    cta: { label: "VIEW PROJECT" },
    problem:
      "Campus payments are split across cash, cards and UPI with no single record of who paid what. The interesting part is not the tap, it's guaranteeing a balance can never go wrong under concurrent requests.",
    highlights: [
      "Student wallets, top-ups, itemized merchant checkout, refunds and an immutable transaction ledger.",
      "Role-based access for students, merchants and admins, enforced server-side with JWT auth.",
      "Atomic, row-locked debits with idempotency keys, so a retried or duplicated request can't charge twice.",
      "Lost card -> block -> replace -> pay again, handled as a first-class admin workflow.",
      "Merchant POS with a simulated NFC tap that calls the same authorize endpoint a hardware terminal would.",
    ],
    workflow: ["Card tap (identity)", "Terminal token auth", "Wallet row lock", "Atomic debit", "Immutable ledger entry"],
    decisions: [
      "The card is never the source of truth for a balance; the backend is.",
      "Tests run against real PostgreSQL, not SQLite, because the locking and idempotency guarantees depend on Postgres transaction semantics.",
      "ESP32 + PN532 reference firmware is documented but has not been tested on physical hardware.",
    ],
    evidence:
      "Pytest suite covering auth/RBAC, wallet top-ups, payment failures, order-amount tampering, duplicate idempotency keys, true concurrent requests, refunds and cross-tenant boundaries. Runs with one docker compose command. Academic prototype, not a certified financial system.",
  },
  {
    slug: "jet-engine-rul",
    index: "03",
    title: "JET ENGINE RUL",
    year: "2026",
    category: "MACHINE LEARNING / PREDICTIVE MAINTENANCE",
    tagline: "Predicting machine failure before it happens.",
    description:
      "Predicts remaining useful life for NASA C-MAPSS FD001 turbofans from 21 sensor channels. Six base learners with different inductive biases feed three combiners: static average, a Bayesian Ridge stacker and a hand-derived gating network.",
    technologies: ["Python", "NumPy", "scikit-learn", "LightGBM", "CatBoost", "NGBoost"],
    // No public repository yet: add links.repo when it's pushed.
    links: {},
    featured: false,
    visual: "rul",
    cta: { label: "VIEW RESEARCH" },
    problem:
      "Engines are maintained on fixed schedules or after they fail. Estimating how many cycles an engine has left, with an uncertainty band, lets maintenance be planned from its actual condition.",
    highlights: [
      "Constant sensor channels screened out on the training set; every kept sensor gets a 10-cycle rolling mean, rolling std and drift from its first cycle.",
      "Piecewise RUL target capped at 125 cycles, applied consistently across training and evaluation.",
      "Six base models: NGBoost, LightGBM, CatBoost, Gaussian Process, Extreme Learning Machine and Echo State Network.",
      "Engine-grouped (GroupKFold) out-of-fold predictions, so no engine leaks across folds.",
      "Confidence-gated mixture-of-experts: per-sample softmax weights, backprop derived by hand in NumPy and checked against finite differences.",
      "Rule-based maintenance advisory per engine (severity, interval, driving sensors), with an optional LLM upgrade.",
    ],
    workflow: ["FD001 sensors", "Screen + engineer features", "6 base models (OOF)", "Average / stack / gate", "RMSE, MAE, R², PHM08"],
    decisions: [
      "Scored with the asymmetric PHM08 metric, not just RMSE, because late predictions are worse than early ones.",
      "Reported honestly: the static average won on test RMSE (14.10); the gate generalized most predictably (smallest val-to-test gap).",
    ],
    evidence:
      "Test set of all 100 FD001 engines, one prediction each. Static average: RMSE 14.10, MAE 10.68, R² 0.876, PHM08 314.7. Best single model (LightGBM): RMSE 14.71.",
  },
  {
    slug: "codetober-2026",
    index: "04",
    title: "CODETOBER 2026",
    year: "2026",
    category: "DATA ENGINEERING / DAILY BUILDS",
    tagline: "Thirty-one prompts. A month of building real systems.",
    description:
      "One system a day through October. Four data-engineering builds stand out: property-based pipeline testing, zero-downtime Postgres migrations, a file-format compression bake-off and per-user percentile metrics that are true by construction.",
    technologies: ["Python", "Go", "DuckDB", "PostgreSQL", "dbt", "PyArrow"],
    links: { repo: "https://github.com/krish-codess/codetober-2026" },
    featured: false,
    visual: "codetober",
    cta: { label: "EXPLORE MODULES", href: "/#codetober" },
    problem: "",
    highlights: [],
    evidence: "",
    modules: ["LAKE", "VALIDATE", "MEASURE", "SHIP"],
  },
];
