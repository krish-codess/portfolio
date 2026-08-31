export interface NavItem {
  id: string;
  label: string;
  index: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "intro", label: "INTRO", index: "01" },
  { id: "work", label: "WORK", index: "02" },
  { id: "data", label: "DATA", index: "03" },
  { id: "software", label: "SOFTWARE", index: "04" },
  { id: "design", label: "DESIGN", index: "05" },
  { id: "music", label: "MUSIC", index: "06" },
  { id: "lab", label: "LAB", index: "07" },
  { id: "archive", label: "ARCHIVE", index: "08" },
  { id: "about", label: "ABOUT", index: "09" },
  { id: "contact", label: "CONTACT", index: "10" },
];
