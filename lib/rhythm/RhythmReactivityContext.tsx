"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface RhythmReactivityValue {
  isPlaying: boolean;
  setPlaying: (v: boolean) => void;
}

const RhythmReactivityContext = createContext<RhythmReactivityValue | null>(null);

export function RhythmReactivityProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setPlaying] = useState(false);
  const value = useMemo(() => ({ isPlaying, setPlaying }), [isPlaying]);
  return <RhythmReactivityContext.Provider value={value}>{children}</RhythmReactivityContext.Provider>;
}

export function useRhythmReactivity() {
  const ctx = useContext(RhythmReactivityContext);
  if (!ctx) throw new Error("useRhythmReactivity must be used within RhythmReactivityProvider");
  return ctx;
}

// Toggles a single class on <html> so the rest of the site can respond to "the rhythm grid
// is running" with plain, GPU-cheap CSS -- no per-frame JS needed for a subtle, site-wide
// effect. Driven by the visual step-sequencer in the Music section, not real audio.
export function RhythmReactivityBridge() {
  const { isPlaying } = useRhythmReactivity();
  useEffect(() => {
    document.documentElement.classList.toggle("rhythm-live", isPlaying);
  }, [isPlaying]);
  return null;
}
