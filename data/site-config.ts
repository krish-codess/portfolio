// Shared across every Hero/*.tsx variant -- one identity, five presentations. Never
// duplicate this into a mode-specific copy; add a field here if a mode needs one more.
export const IDENTITY = {
  first: "KRISH",
  last: "GOHEL",
  full: "KRISH GOHEL",
  tagline: "FULL-STACK DATA SPECIALIST",
  roles: ["SOFTWARE", "DATA", "DESIGN", "DRUMS"],
  cycle: ["KRISH", "DATA", "CODE", "DESIGN", "DRUMS"],
  year: "2026",
  country: "INDIA",
} as const;

export const SITE = {
  name: "Krish Gohel",
  shortName: "KG",
  descriptor: "MULTIDISCIPLINARY DIGITAL PRACTITIONER",
  formula: "DATA × CODE × DESIGN × MUSIC",
  metaDescription:
    "Krish Gohel — a full-stack data specialist, software developer, designer, and musician. An experimental, interactive personal archive.",
  email: "krishnakulgohel544@gmail.com",
  location: "CHENNAI, INDIA",
  discipline: "DATA / SOFTWARE / DESIGN / MUSIC",
  currently: "B.TECH CSE + DATA SCIENCE MINOR, SRM IST",
  interests: "DRUMS, DATA VISUALIZATION, PRODUCT DESIGN",
  resumeUrl: "/resume.pdf",
  aboutParagraphs: [
    "I like building things.",
    "Sometimes they're software. Sometimes they're visual. Sometimes they're data. Sometimes they're music.",
    "Usually they're some combination of all four.",
  ],
} as const;

export const SOCIALS = [
  { label: "RESUME", href: SITE.resumeUrl },
  { label: "EMAIL", href: `mailto:${SITE.email}` },
  { label: "GITHUB", href: "#" },
  { label: "LINKEDIN", href: "#" },
  { label: "INSTAGRAM", href: "#" },
] as const;
