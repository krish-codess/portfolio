"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { ColorSchemeId, COLOR_STORAGE_KEY, DEFAULT_COLOR, isColorSchemeId } from "./colorSchemes";

interface AppearanceContextValue {
  colorScheme: ColorSchemeId;
  setColorScheme: (id: ColorSchemeId) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

// Set before hydration so there's no flash of the wrong accent.
export const APPEARANCE_INIT_SCRIPT = `
(function () {
  try {
    var color = localStorage.getItem("${COLOR_STORAGE_KEY}") || "${DEFAULT_COLOR}";
    document.documentElement.setAttribute("data-color", color);
  } catch (e) {
    document.documentElement.setAttribute("data-color", "${DEFAULT_COLOR}");
  }
})();
`;

function subscribeColor(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color"] });
  return () => observer.disconnect();
}

function getColorSnapshot(): ColorSchemeId {
  const attr = document.documentElement.getAttribute("data-color");
  return isColorSchemeId(attr) ? attr : DEFAULT_COLOR;
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useSyncExternalStore(subscribeColor, getColorSnapshot, () => DEFAULT_COLOR);

  const setColorScheme = useCallback((id: ColorSchemeId) => {
    document.documentElement.setAttribute("data-color", id);
    try {
      localStorage.setItem(COLOR_STORAGE_KEY, id);
    } catch {
      // storage unavailable, color still applies for this session
    }
  }, []);

  const value = useMemo(() => ({ colorScheme, setColorScheme }), [colorScheme, setColorScheme]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used within AppearanceProvider");
  return ctx;
}
