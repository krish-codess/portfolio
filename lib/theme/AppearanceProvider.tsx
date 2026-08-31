"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { ColorSchemeId, COLOR_STORAGE_KEY, DEFAULT_COLOR, isColorSchemeId } from "./colorSchemes";
import { DesignModeId, MODE_STORAGE_KEY, DEFAULT_MODE, isDesignModeId } from "./designModes";

interface AppearanceContextValue {
  colorScheme: ColorSchemeId;
  setColorScheme: (id: ColorSchemeId) => void;
  designMode: DesignModeId;
  setDesignMode: (id: DesignModeId) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

// Two independent attributes on <html>, set before hydration so there's no flash. They are
// deliberately separate DOM attributes (not one combined value) so the two axes can never
// accidentally become coupled.
export const APPEARANCE_INIT_SCRIPT = `
(function () {
  try {
    var color = localStorage.getItem("${COLOR_STORAGE_KEY}") || "${DEFAULT_COLOR}";
    var mode = localStorage.getItem("${MODE_STORAGE_KEY}") || "${DEFAULT_MODE}";
    document.documentElement.setAttribute("data-color", color);
    document.documentElement.setAttribute("data-mode", mode);
  } catch (e) {
    document.documentElement.setAttribute("data-color", "${DEFAULT_COLOR}");
    document.documentElement.setAttribute("data-mode", "${DEFAULT_MODE}");
  }
})();
`;

function subscribeToAttribute(attr: string) {
  return (callback: () => void) => {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: [attr] });
    return () => observer.disconnect();
  };
}

const subscribeColor = subscribeToAttribute("data-color");
const subscribeMode = subscribeToAttribute("data-mode");

function getColorSnapshot(): ColorSchemeId {
  const attr = document.documentElement.getAttribute("data-color");
  return isColorSchemeId(attr) ? attr : DEFAULT_COLOR;
}

function getModeSnapshot(): DesignModeId {
  const attr = document.documentElement.getAttribute("data-mode");
  return isDesignModeId(attr) ? attr : DEFAULT_MODE;
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useSyncExternalStore(subscribeColor, getColorSnapshot, () => DEFAULT_COLOR);
  const designMode = useSyncExternalStore(subscribeMode, getModeSnapshot, () => DEFAULT_MODE);

  const setColorScheme = useCallback((id: ColorSchemeId) => {
    document.documentElement.setAttribute("data-color", id);
    try {
      localStorage.setItem(COLOR_STORAGE_KEY, id);
    } catch {
      // storage unavailable, color still applies for this session
    }
  }, []);

  const setDesignMode = useCallback((id: DesignModeId) => {
    document.documentElement.setAttribute("data-mode", id);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, id);
    } catch {
      // storage unavailable, mode still applies for this session
    }
  }, []);

  const value = useMemo(
    () => ({ colorScheme, setColorScheme, designMode, setDesignMode }),
    [colorScheme, setColorScheme, designMode, setDesignMode]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used within AppearanceProvider");
  return ctx;
}
