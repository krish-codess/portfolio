export interface CodetoberProject {
  day: number;
  // Everything below is optional -- a bare { day } renders as an intentional "PROJECT TBD" slot.
  title?: string;
  description?: string;
  technologies?: string[];
  // Set by hand when the project ships. A date passing never completes a project on its own.
  status?: "completed";
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
//     title: "API Pulse",
//     description: "API monitoring dashboard.",
//     technologies: ["Node.js", "Express", "SQLite"],
//     status: "completed",
//     github: "https://github.com/USERNAME/codetober-2026/tree/main/day-05-api-pulse",
//     demo: "https://...",
//     image: "/codetober/day-05.png",
//     details: "What I built...",
//     learned: "What I learned...",
//   },
//
// Nothing here is invented: a day stays "PROJECT TBD" until it's real.
export const CODETOBER_2026: CodetoberEdition = {
  year: 2026,
  projects: [
    // TODO(krish): days 1-4 are shipped but not written up yet -- add title, description,
    // technologies and github. They count toward progress now; each card becomes clickable
    // once it has a title.
    { day: 1, status: "completed" },
    { day: 2, status: "completed" },
    { day: 3, status: "completed" },
    { day: 4, status: "completed" },
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
