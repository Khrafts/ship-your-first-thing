"use client";

// Owns the live theme state for the app. The pre-paint script in app/layout.tsx
// has already set the correct `.dark` class on <html> before this mounts, so
// there is no flash; this provider then keeps the DOM in step as the user
// toggles, follows the OS while the choice is "system", and mirrors changes
// made in other tabs.
//
// Both inputs — the persisted choice (localStorage) and the OS preference
// (matchMedia) — are external mutable sources, so we read them through
// useSyncExternalStore rather than mirroring them into state inside an effect.
// That is the idiomatic React 19 approach: it avoids cascading renders and
// handles the server/client snapshot difference without hydration warnings.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  isTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

interface ThemeContextValue {
  /** The user's chosen mode — may be "system". */
  theme: Theme;
  /** The concrete theme currently applied to the document. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = "(prefers-color-scheme: dark)";
// localStorage's "storage" event only fires in *other* tabs, so setTheme
// dispatches this to notify the store in the current tab.
const THEME_EVENT = "syft:theme-change";

// --- external store: the persisted theme choice ---

function subscribeChoice(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getChoiceSnapshot(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : "system";
}

function getChoiceServerSnapshot(): Theme {
  // The server cannot know the user's choice, so it renders "system" for
  // everyone. The pre-paint init script still applies the correct *theme* to
  // <html> before paint, so there is no flash of the wrong colours — but the
  // header toggle's icon/label hydrate as "system" and catch up to the stored
  // choice in the commit right after hydration. That brief control-state flip
  // is accepted: making it server-accurate would need a cookie, which would opt
  // the otherwise-static pages into per-request rendering.
  return "system";
}

// --- external store: the OS colour-scheme preference ---

let darkMedia: MediaQueryList | null = null;
function getDarkMedia(): MediaQueryList {
  if (!darkMedia) darkMedia = window.matchMedia(DARK_QUERY);
  return darkMedia;
}

function subscribeSystem(callback: () => void): () => void {
  const media = getDarkMedia();
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemSnapshot(): boolean {
  return getDarkMedia().matches;
}

function getSystemServerSnapshot(): boolean {
  return false;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeChoice,
    getChoiceSnapshot,
    getChoiceServerSnapshot,
  );
  const systemPrefersDark = useSyncExternalStore(
    subscribeSystem,
    getSystemSnapshot,
    getSystemServerSnapshot,
  );

  const resolvedTheme: ResolvedTheme = resolveTheme(theme, systemPrefersDark);

  // Sync the resolved theme to the document. This is the allowed effect shape:
  // it pushes React state out to an external system (the DOM) and calls no
  // setState, so it cannot cascade. Only the class is toggled; `color-scheme`
  // follows from the `.dark` rule in globals.css (single source of truth).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; the dispatch below still updates this tab.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
