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
    // Copy for days 1-4 is taken from the codetober-2026 READMEs.
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
      // TODO(krish): PARSE has no README yet, so there is no `details` copy to use.
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
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
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
