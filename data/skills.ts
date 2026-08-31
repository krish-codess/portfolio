export interface SkillGroup {
  category: "DATA" | "SOFTWARE" | "DESIGN" | "MUSIC";
  items: string[];
}

// Only real, explicitly-provided skills belong here. Placeholders mark what's missing —
// replace each "PLACEHOLDER" line with actual skills before publishing.
export const SKILLS: SkillGroup[] = [
  { category: "DATA", items: ["PLACEHOLDER — e.g. Machine Learning", "PLACEHOLDER — e.g. Data Analysis", "PLACEHOLDER — e.g. Visualization"] },
  { category: "SOFTWARE", items: ["PLACEHOLDER — e.g. Frontend", "PLACEHOLDER — e.g. Backend", "PLACEHOLDER — e.g. APIs / Databases"] },
  { category: "DESIGN", items: ["PLACEHOLDER — e.g. UI / UX", "PLACEHOLDER — e.g. Typography", "PLACEHOLDER — e.g. Visual Systems"] },
  { category: "MUSIC", items: ["PLACEHOLDER — e.g. Production", "PLACEHOLDER — e.g. Performance"] },
];
