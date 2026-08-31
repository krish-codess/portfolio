"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, ThemeId, isThemeId } from "./themes";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored || "${DEFAULT_THEME}";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME}");
  }
})();
`;

// The <html data-theme> attribute (set by the blocking init script above, before
// hydration) is the single source of truth. A MutationObserver keeps React in sync with
// it instead of mirroring it into separate React state.
function subscribeToThemeAttribute(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getThemeSnapshot(): ThemeId {
  const attr = document.documentElement.getAttribute("data-theme");
  return isThemeId(attr) ? attr : DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToThemeAttribute, getThemeSnapshot, () => DEFAULT_THEME);

  const setTheme = useCallback((id: ThemeId) => {
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // storage unavailable, theme still applies for this session
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
