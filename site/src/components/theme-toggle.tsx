"use client";

// Header control that flips between light and dark in a single click.
//
// Deliberately binary — no "system" stop in the control. A 3-way cycle made the
// common "I'm in dark, give me light" action take two clicks and surfaced a
// confusing intermediate state (on a dark-OS machine the "system" step looks
// identical to dark, so the click appears to do nothing). First-visit default
// still follows the OS: the provider starts in "system" and tracks the OS until
// this toggle pins an explicit light/dark choice.
//
// The icon shows the destination: a moon in light mode ("switch to dark"), a
// sun in dark mode ("switch to light"), matching the aria-label so the icon and
// the announced action always agree.

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const target = isDark ? "light" : "dark";

  return (
    <>
      <button
        type="button"
        onClick={() => setTheme(target)}
        // e2e/theme.spec.ts locates this control by its "Switch to … theme"
        // label — reword deliberately, not by accident.
        aria-label={`Switch to ${target} theme`}
        title={`Switch to ${target} theme`}
        className="inline-flex h-14 w-11 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150 hover:text-ink"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
      {/* Polite confirmation for screen readers: whether a focused button
          re-announces its own changed accessible name on activation is
          inconsistent across SR/browser pairs, so we announce the new mode. */}
      <span aria-live="polite" className="sr-only">
        {isDark ? "Dark theme" : "Light theme"}
      </span>
    </>
  );
}

// Icons: 18px, 1.5 stroke, currentColor — sized and coloured by the button.
const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
