export interface RhythmLane {
  id: string;
  label: string;
  steps: boolean[];
}

// A simple illustrative beat pattern -- a visual metaphor for "I think in rhythms," not a
// real recording and not a claim of composed music. 16 steps, four bars of sixteenth notes.
export const RHYTHM_PATTERN: RhythmLane[] = [
  {
    id: "kick",
    label: "KICK",
    steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  },
  {
    id: "snare",
    label: "SNARE",
    steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  },
  {
    id: "hihat",
    label: "HI-HAT",
    steps: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  },
  {
    id: "tom",
    label: "TOM",
    steps: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, true],
  },
  {
    id: "cymbal",
    label: "CYMBAL",
    steps: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  },
];

export const RHYTHM_BPM = 96;
