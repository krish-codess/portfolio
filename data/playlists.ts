export interface Playlist {
  id: string;
  index: string;
  title: string;
  description: string;
  url?: string; // add a Spotify/Apple Music link when one exists
}

// PLACEHOLDER DATA -- real playlists go here once linked. No artists or tracks are invented;
// these are just the categories until real listening data / links are provided.
export const PLAYLISTS: Playlist[] = [
  { id: "current-rotation", index: "01", title: "CURRENT ROTATION", description: "WHATEVER'S ON REPEAT RIGHT NOW" },
  { id: "driving", index: "02", title: "DRIVING", description: "FOR GOING SOMEWHERE, ANYWHERE" },
  { id: "late-night", index: "03", title: "LATE NIGHT", description: "FOR WHEN IT'S TOO LATE TO BE AWAKE" },
  { id: "focus", index: "04", title: "FOCUS", description: "FOR WHEN THE CODE NEEDS TO SHIP" },
  { id: "chaotic", index: "05", title: "CHAOTIC", description: "NO GENRE IS SAFE HERE" },
  { id: "drummer-brain", index: "06", title: "DRUMMER BRAIN", description: "LISTENED TO FOR THE DRUMS, SPECIFICALLY" },
];
