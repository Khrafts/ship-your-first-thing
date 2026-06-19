"use client";

// Header control that cycles the theme: system → light → dark → system. A
// single compact button keeps the editorial header uncluttered; the icon shows
// the *current* mode and the aria-label announces both the current mode and
// what activating will do, so it stays usable for keyboard and screen-reader
// users (the icon alone never carries the meaning).

import { useTheme } from "@/components/theme-provider";
import { nextTheme, type Theme } from "@/lib/theme";

const LABEL: Record<Theme, string> = {
  system: "system",
  light: "light",
  dark: "dark",
};

const ICON: Record<Theme, React.ReactNode> = {
  system: <MonitorIcon />,
  light: <SunIcon />,
  dark: <MoonIcon />,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const upcoming = nextTheme(theme);

  return (
    <>
      <button
        type="button"
        onClick={() => setTheme(upcoming)}
        // The "Theme:" prefix is the locator e2e/theme.spec.ts uses to find this
        // control — reword it deliberately, not by accident.
        aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[upcoming]}.`}
        title={`Theme: ${LABEL[theme]} (switch to ${LABEL[upcoming]})`}
        className="inline-flex h-14 w-11 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150 hover:text-ink"
      >
        {ICON[theme]}
      </button>
      {/* Polite confirmation for screen readers: whether a focused button
          re-announces its own changed accessible name on activation is
          inconsistent across SR/browser pairs, so we announce the new mode
          explicitly. */}
      <span aria-live="polite" className="sr-only">
        {`Theme: ${LABEL[theme]}`}
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

function MonitorIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
