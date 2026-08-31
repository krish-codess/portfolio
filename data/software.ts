export interface SoftwareProject {
  index: string;
  title: string;
  year: string;
  frontend?: string;
  backend?: string;
  database?: string;
  api?: string;
  infrastructure?: string;
  language?: string;
  description: string;
  status: "SHIPPED" | "IN PROGRESS" | "ARCHIVED";
  placeholder: boolean;
}

// PLACEHOLDER DATA — replace with real systems/software work.
export const SOFTWARE_PROJECTS: SoftwareProject[] = [
  {
    index: "S01",
    title: "SYSTEM ONE",
    year: "2026",
    frontend: "PLACEHOLDER",
    backend: "PLACEHOLDER",
    database: "PLACEHOLDER",
    api: "REST / PLACEHOLDER",
    infrastructure: "PLACEHOLDER",
    language: "PLACEHOLDER",
    description: "PLACEHOLDER — a technical system description goes here.",
    status: "IN PROGRESS",
    placeholder: true,
  },
  {
    index: "S02",
    title: "SYSTEM TWO",
    year: "2025",
    frontend: "PLACEHOLDER",
    backend: "PLACEHOLDER",
    database: "PLACEHOLDER",
    api: "PLACEHOLDER",
    infrastructure: "PLACEHOLDER",
    language: "PLACEHOLDER",
    description: "PLACEHOLDER — a technical system description goes here.",
    status: "SHIPPED",
    placeholder: true,
  },
  {
    index: "S03",
    title: "SYSTEM THREE",
    year: "2024",
    frontend: "PLACEHOLDER",
    backend: "PLACEHOLDER",
    database: "PLACEHOLDER",
    api: "PLACEHOLDER",
    infrastructure: "PLACEHOLDER",
    language: "PLACEHOLDER",
    description: "PLACEHOLDER — a technical system description goes here.",
    status: "ARCHIVED",
    placeholder: true,
  },
];
