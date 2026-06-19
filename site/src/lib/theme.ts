// Theme model for the site's light/dark support.
//
// The user picks one of three modes. "system" defers to the OS via
// prefers-color-scheme; "light"/"dark" pin the choice. The *resolved* theme is
// always "light" or "dark" — that concrete value is what drives the `.dark`
// class on <html> (and the token overrides in app/globals.css).
//
// Everything here is pure and DOM-free so it can be unit-tested in node and
// reused by both the React provider and the pre-paint init script. The actual
// DOM mutation lives in components/theme-provider.tsx.

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

/** localStorage key holding the user's chosen mode. */
export const THEME_STORAGE_KEY = "syft-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/** Collapse a (possibly "system") choice into the theme to actually apply. */
export function resolveTheme(
  theme: Theme,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (theme === "system") return systemPrefersDark ? "dark" : "light";
  return theme;
}

/**
 * A self-contained script string, injected into <head> and run before first
 * paint, that sets the correct theme on <html> so there is no flash of the
 * wrong colours. It MUST resolve identically to the React provider, which uses
 * resolveTheme(isTheme(stored) ? stored : "system", …): an explicit
 * "dark"/"light" wins, and anything else — null, "system", or a stale/corrupt
 * value — follows the OS. (An earlier version forced light for unrecognised
 * values, which disagreed with the provider and flashed light→dark on a
 * dark-OS machine; `follow` below closes that.) color-scheme is owned by the
 * `.dark` rule in globals.css, which this class toggle triggers before paint —
 * so the script only sets the class. Written in plain ES5 (it runs before the
 * bundle) and wrapped in try/catch so a blocked or absent localStorage can
 * never break rendering. Injected via dangerouslySetInnerHTML in app/layout.tsx.
 */
export function themeInitScript(): string {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  return `(function(){try{var k=${key};var c=localStorage.getItem(k);var follow=c!=="dark"&&c!=="light";var dark=c==="dark"||(follow&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;
}
