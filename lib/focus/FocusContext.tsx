"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type FocusId = "data" | "code" | "design" | "music";

export const FOCUS_META: Record<FocusId, { label: string; sectionId: string; description: string }> = {
  data: { label: "DATA", sectionId: "data", description: "VISUALIZATIONS, EXPERIMENTS, THE CORRELATION MACHINE" },
  code: { label: "CODE", sectionId: "software", description: "SYSTEMS, STACKS, THE THINGS THAT RUN" },
  design: { label: "DESIGN", sectionId: "design", description: "VISUAL WORK, TYPE, IMAGE" },
  music: { label: "MUSIC", sectionId: "music", description: "TRACKS, WAVEFORMS, SOUND" },
};

interface FocusContextValue {
  focus: FocusId | null;
  setFocus: (id: FocusId | null) => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [focus, setFocus] = useState<FocusId | null>(null);
  const value = useMemo(() => ({ focus, setFocus }), [focus]);
  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error("useFocus must be used within FocusProvider");
  return ctx;
}
