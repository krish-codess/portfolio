export interface NavItem {
  id: string;
  label: string;
  index: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "intro", label: "INTRO", index: "01" },
  { id: "work", label: "WORK", index: "02" },
  { id: "data", label: "DATA", index: "03" },
  { id: "music", label: "MUSIC", index: "04" },
  { id: "lab", label: "LAB", index: "05" },
  { id: "archive", label: "ARCHIVE", index: "06" },
  { id: "about", label: "ABOUT", index: "07" },
  { id: "contact", label: "CONTACT", index: "08" },
];
