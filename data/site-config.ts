export const SITE = {
  name: "Krish Gohel",
  shortName: "KG",
  descriptor: "MULTIDISCIPLINARY DIGITAL PRACTITIONER",
  formula: "DATA × CODE × DESIGN × MUSIC",
  metaDescription:
    "Krish Gohel — a full-stack data specialist, software developer, designer, and musician. An experimental, interactive personal archive.",
  email: "krishnakulgohel544@gmail.com",
  location: "PLACEHOLDER — CITY, COUNTRY",
  discipline: "DATA / SOFTWARE / DESIGN / MUSIC",
  currently: "PLACEHOLDER — CURRENTLY BUILDING SOMETHING",
  interests: "PLACEHOLDER — ADD INTERESTS",
  aboutParagraphs: [
    "I like building things.",
    "Sometimes they're software. Sometimes they're visual. Sometimes they're data. Sometimes they're music.",
    "Usually they're some combination of all four.",
  ],
} as const;

export const SOCIALS = [
  { label: "EMAIL", href: `mailto:${SITE.email}` },
  { label: "GITHUB", href: "#" },
  { label: "LINKEDIN", href: "#" },
  { label: "INSTAGRAM", href: "#" },
] as const;
