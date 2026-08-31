"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AudioReactivityValue {
  isPlaying: boolean;
  setPlaying: (v: boolean) => void;
}

const AudioReactivityContext = createContext<AudioReactivityValue | null>(null);

export function AudioReactivityProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setPlaying] = useState(false);
  const value = useMemo(() => ({ isPlaying, setPlaying }), [isPlaying]);
  return <AudioReactivityContext.Provider value={value}>{children}</AudioReactivityContext.Provider>;
}

export function useAudioReactivity() {
  const ctx = useContext(AudioReactivityContext);
  if (!ctx) throw new Error("useAudioReactivity must be used within AudioReactivityProvider");
  return ctx;
}

// Toggles a single class on <html> so the rest of the site can respond to "music is
// currently playing" with plain, GPU-cheap CSS -- no per-frame JS needed for a subtle,
// site-wide effect.
export function AudioReactivityBridge() {
  const { isPlaying } = useAudioReactivity();
  useEffect(() => {
    document.documentElement.classList.toggle("audio-live", isPlaying);
  }, [isPlaying]);
  return null;
}
