export interface CodetoberProject {
  day: number;
  // Everything below is optional -- a bare { day } renders as an intentional "PROJECT TBD" slot.
  title?: string;
  description?: string;
  technologies?: string[];
  // Set by hand when the project ships. A date passing never completes a project on its own.
  status?: "completed" | "upcoming";
  github?: string;
  demo?: string;
  // Path under /public, e.g. "/codetober/day-05.png".
  image?: string;
  // Longer copy for the detail page. Blank lines split paragraphs.
  details?: string;
  learned?: string;
  featured?: boolean;
}

export interface CodetoberEdition {
  year: number;
  projects: CodetoberProject[];
}

// DAILY UPDATE: find the day, fill it in, set status: "completed", save. Nothing else to touch.
//
//   {
//     day: 5,
//     title: "FOLDER",
//     description: "API monitoring dashboard.",
//     technologies: ["Node.js", "Express", "SQLite"],
//     status: "completed",
//     github: `${REPO}/FOLDER`,
//     demo: "https://...",
//     image: "/codetober/day-05.png",
//     details: "What I built...",
//     learned: "What I learned...",
//   },
//
// Nothing here is invented: a day stays "PROJECT TBD" until it's real.

// The source lives in the codetober-2026 repository, one folder per project; this file only
// holds metadata and links into it.
const REPO = "https://github.com/krish-codess/codetober-2026/tree/main";

export const CODETOBER_2026: CodetoberEdition = {
  year: 2026,
  projects: [
    // Copy is taken from the codetober-2026 READMEs.
    {
      day: 1,
      title: "EMIT",
      description: "The Last Ticket: an on-sale ticketing system with a virtual waiting room, event-sourced inventory and expiring holds, built so nothing is oversold.",
      technologies: ["Java 17", "Spring Boot", "PostgreSQL", "Kafka", "Redis", "React", "TypeScript", "Kubernetes"],
      status: "completed",
      github: `${REPO}/EMIT`,
      details:
        "Ten thousand people hit refresh for twelve hundred tickets at exactly 10:00:00. Nobody gets oversold, and nobody sees a spinner forever.\n\nStock changes and reservations are events applied to per-inventory aggregates with optimistic version checks. A virtual waiting room throttles admission, an available-to-promise projection serves reads, and an expiry sweeper releases abandoned holds.",
    },
    {
      day: 2,
      title: "PARSE",
      description: "Hierarchical, multilingual feedback classification with active learning.",
      technologies: ["Python", "FastAPI", "scikit-learn", "ONNX Runtime", "PostgreSQL", "React", "TypeScript"],
      status: "completed",
      github: `${REPO}/PARSE`,
      details:
        "Sorts multilingual customer feedback into a 241-node, three-level taxonomy (domain, entity, attribute), with a labelling loop that decides what a person should label next and a taxonomy that can change without throwing labels away.\n\nMeasured on real review text in 12 languages (M-ABSA), with results reported as measured, including the negative one: active learning did not beat random sampling here. A child label implies its parent by construction and by database trigger.",
    },
    {
      day: 3,
      title: "TRANSFORM",
      description: "Gold Standard: a consumer price index for video game economies, on real EVE Online market data and a simulated shard.",
      technologies: ["Python", "Dagster", "PostgreSQL", "React"],
      status: "completed",
      github: `${REPO}/TRANSFORM`,
      details:
        "Auction-house data goes into a columnar store. A volume-weighted basket of goods then produces a chain-linked Laspeyres price index per server and across servers. Robust estimators reject manipulated listings, and patch notes are joined onto the timeline so a price shock can be attributed to a specific change.\n\nIt runs on real EVE Online market data (ESI) and on a calibrated simulated shard, whose ground truth proves the estimators work.",
    },
    {
      day: 4,
      title: "VALIDATE",
      description: "tydlc: property-based testing for data pipelines, with failures shrunk to a minimal dataset.",
      technologies: ["Python", "PostgreSQL", "DuckDB"],
      status: "completed",
      github: `${REPO}/VALIDATE`,
      details:
        "tydlc generates thousands of hostile but referentially valid rows, runs a real transformation pipeline over them, checks properties of the transformation (not fixed expected outputs), discovers the invariants the pipeline actually relies on, and shrinks every failure to the smallest dataset that still breaks.",
    },
    {
      day: 5,
      title: "SHIP",
      description: "shipd: a zero-downtime schema migration controller. Plans a diff against the live schema and applies it as expand/contract with lock guards and auto-revert, while two application versions keep serving traffic.",
      technologies: ["Go", "pgroll", "PostgreSQL", "React", "TypeScript", "Prometheus", "Grafana"],
      status: "completed",
      github: `${REPO}/SHIP`,
      details:
        "A controller that changes a PostgreSQL schema while the application keeps writing to it. You describe the schema you want; shipd diffs it against the live one, plans an expand/contract migration, shows the locks each step takes, and drives it with pgroll. A guard watches locks and errors the whole time and reverts the migration if the application starts to suffer.\n\nThe demonstration is an order table whose amount column is free text and has to become amount_cents bigint, while application version v1 keeps writing text and v2 starts writing integers.",
    },
    {
      day: 6,
      title: "LAKE",
      description: "The Compression Bake-Off: one dataset, every format and codec, measured in bytes read and dollars.",
      technologies: ["Python", "PyArrow", "DuckDB", "Polars", "FastAPI", "React", "TypeScript"],
      status: "completed",
      github: `${REPO}/LAKE`,
      details:
        "One CSV, written as 24 variants across CSV, Parquet, ORC and Avro, every codec, several row-group and stripe sizes. A fixed query workload runs against each one and records wall time (cold and warm), bytes actually read from storage, and read calls. A cost model turns that into monthly cloud spend for a workload you describe.",
    },
    {
      day: 7,
      title: "MEASURE",
      description: "Your App, Wrapped: a year-in-review for every user, with percentile claims that are true by construction.",
      technologies: ["Python", "dbt", "DuckDB", "FastAPI", "PostgreSQL", "React", "TypeScript"],
      status: "completed",
      github: `${REPO}/MEASURE`,
      details:
        "A batch pipeline turns a year of usage events into per-user aggregates, ranks each user against the population with quantile sketches, picks the most interesting things that are genuinely true about each person, and serves the result as an animated story with share cards rendered on the server.\n\nA quantile sketch per metric proposes thresholds, and one hash aggregation then counts exactly how many users clear each one, so a user in the top 5.2% is told \"top 10%\". Before a run can be published, an audit re-checks every number and every claim against the warehouse. One violation and nothing is published.",
    },
    {
      day: 8,
      title: "VISION",
      description: "Squeeze: compress a vision model for edge boards and measure the real accuracy, latency and power tradeoff.",
      technologies: ["Python", "PyTorch", "ONNX Runtime", "OpenVINO", "FastAPI", "SQLite", "React", "TypeScript"],
      status: "completed",
      github: `${REPO}/VISION`,
      details:
        "A ResNet-50 teacher is pruned, a MobileNetV3-Small student is distilled from it, and both are quantized to INT8. Every step is exported to ONNX and re-checked against an accuracy gate before it counts.\n\nThe surviving models are packed per device together with a single-file benchmark harness; the harness uploads what it measured to an API, and a web explorer plots accuracy against cost for each target.",
    },
    {
      day: 9,
      title: "RENDER",
      description: "A Million Dots: every point of a 1.19-million-token embedding space, drawn on the GPU, with a lasso that reports statistics while the mouse button is still down.",
      technologies: ["Python", "UMAP", "DuckDB", "FastAPI", "regl", "DuckDB-WASM", "React", "TypeScript"],
      status: "completed",
      github: `${REPO}/RENDER`,
      details:
        "A batch pipeline projects the vectors to 2-D (PCA as the baseline, UMAP variants) and cuts each projection into level-of-detail tiles served as binary buffers. The page draws them with regl as instanced triangles into a floating-point target and tone-maps the accumulated density.\n\nA web worker holds a quadtree over the loaded points for hover and lasso; DuckDB-WASM holds the metadata and describes the selected tokens. After the files are downloaded, nothing talks to a server.",
    },
    {
      day: 10,
      title: "INFER",
      description: "Who actually needed the discount: uplift modelling on randomized experiments, turned into a budget-constrained targeting policy.",
      technologies: ["Python", "EconML", "scikit-learn", "FastAPI", "PostgreSQL", "React", "TypeScript"],
      status: "completed",
      github: `${REPO}/INFER`,
      details:
        "A promotion sent to everyone is mostly spent on people who would have bought anyway, and some of it on people it puts off.\n\nThis system takes a randomized experiment, trains several uplift learners on identical data, compares them on Qini and uplift curves (never on classification accuracy), finds the segments the treatment hurts, and turns the best model into a budget-constrained targeting policy that is valued against treating everyone and treating no one, then exported for activation.",
    },
    {
      day: 11,
      title: "INGEST",
      description: "Ghost Fleet: track ships in real time from AIS, and catch the ones that switch off their transponders and vanish.",
      technologies: ["Python", "Kafka", "PostgreSQL", "PostGIS", "FastAPI", "deck.gl", "React", "TypeScript", "Prometheus", "Grafana"],
      status: "completed",
      github: `${REPO}/INGEST`,
      details:
        "Async collectors hold long-lived connections to AIS providers, decode NMEA sentences and push positions into Kafka. A consumer group deduplicates them into PostGIS.\n\nA gap detector separates receiver coverage holes from vessels that deliberately went dark, and scores reappearances that would have needed an impossible speed. A deck.gl map shows the live fleet and replays any vessel's track.",
    },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
  ],
};
