export interface Project {
  slug: string;
  index: string;
  title: string;
  year: string;
  category: string;
  description: string;
  technologies: string[];
  images: string[];
  links: { live?: string; repo?: string };
  featured: boolean;
  caseStudy?: string;
  placeholder: boolean;
}

// PLACEHOLDER DATA — replace with real projects. Keep the schema; edit the content.
export const PROJECTS: Project[] = [
  {
    slug: "project-one",
    index: "01",
    title: "PROJECT ONE",
    year: "2026",
    category: "FULL-STACK / DATA",
    description: "PLACEHOLDER DESCRIPTION — a short editorial summary of what this project is and why it exists.",
    technologies: ["PLACEHOLDER STACK"],
    images: [],
    links: {},
    featured: true,
    placeholder: true,
  },
  {
    slug: "project-two",
    index: "02",
    title: "PROJECT TWO",
    year: "2025",
    category: "SOFTWARE",
    description: "PLACEHOLDER DESCRIPTION — a short editorial summary of what this project is and why it exists.",
    technologies: ["PLACEHOLDER STACK"],
    images: [],
    links: {},
    featured: true,
    placeholder: true,
  },
  {
    slug: "project-three",
    index: "03",
    title: "PROJECT THREE",
    year: "2025",
    category: "DESIGN SYSTEM",
    description: "PLACEHOLDER DESCRIPTION — a short editorial summary of what this project is and why it exists.",
    technologies: ["PLACEHOLDER STACK"],
    images: [],
    links: {},
    featured: false,
    placeholder: true,
  },
  {
    slug: "project-four",
    index: "04",
    title: "PROJECT FOUR",
    year: "2024",
    category: "DATA VISUALIZATION",
    description: "PLACEHOLDER DESCRIPTION — a short editorial summary of what this project is and why it exists.",
    technologies: ["PLACEHOLDER STACK"],
    images: [],
    links: {},
    featured: false,
    placeholder: true,
  },
];
