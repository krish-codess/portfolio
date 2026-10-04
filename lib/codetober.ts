import type { CodetoberEdition, CodetoberProject } from "@/data/codetober";

export type CodetoberState = "shipped" | "today" | "upcoming" | "pending";

export const pad2 = (n: number) => String(n).padStart(2, "0");

// Which day of the edition `now` falls on: 0 before October, 1-31 during, 32 once it's over.
// Dev only: NEXT_PUBLIC_CODETOBER_PREVIEW_DAY=20 in .env.local previews any day.
// ponytail: uses the visitor's local date, so "today" can differ by a day across timezones.
// Pin to a fixed UTC offset here if that ever matters.
export function getCodetoberDay(year: number, now = new Date()): number {
  const preview = Number(process.env.NEXT_PUBLIC_CODETOBER_PREVIEW_DAY);
  if (process.env.NODE_ENV !== "production" && preview >= 1) return preview;
  const y = now.getFullYear();
  const m = now.getMonth(); // October is 9
  if (y < year || (y === year && m < 9)) return 0;
  if (y > year || m > 9) return 32;
  return now.getDate();
}

// Completion comes from the data; the calendar only decides today / upcoming / pending.
export function getCodetoberState(project: CodetoberProject, today: number): CodetoberState {
  if (project.status === "completed") return "shipped";
  if (project.day === today) return "today";
  return project.day > today ? "upcoming" : "pending";
}

// A shipped project gets a detail page once it has a title to put on it.
export function hasDetail(project: CodetoberProject): boolean {
  return project.status === "completed" && Boolean(project.title);
}

export function getCodetoberStats(edition: CodetoberEdition, today: number) {
  const total = edition.projects.length;
  const shipped = edition.projects.filter((p) => p.status === "completed").length;
  return {
    total,
    shipped,
    upcoming: edition.projects.filter((p) => getCodetoberState(p, today) === "upcoming").length,
    percent: Math.round((shipped / total) * 100),
  };
}
