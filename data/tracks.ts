export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  src?: string; // path under /public/audio — leave undefined until a real file exists
}

// PLACEHOLDER DATA — no audio files are loaded yet. Add files to /public/audio and set
// `src` to enable real playback; until then the player runs a generated placeholder tone.
export const TRACKS: Track[] = [
  { id: "t1", title: "UNTITLED SESSION", artist: "Krish Gohel", duration: 161 },
  { id: "t2", title: "PLACEHOLDER TRACK TWO", artist: "Krish Gohel", duration: 204 },
  { id: "t3", title: "PLACEHOLDER TRACK THREE", artist: "Krish Gohel", duration: 138 },
];
