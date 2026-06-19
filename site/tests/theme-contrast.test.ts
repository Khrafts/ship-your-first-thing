import { describe, expect, it } from "vitest";

// These values MIRROR the `.dark` token block in src/app/globals.css. They are
// duplicated here on purpose: this file is the contract that dark mode stays
// WCAG-readable. If you change a dark token in globals.css, change it here too
// — and the assertions below will tell you whether the new value still passes.
const DARK = {
  paper: "#09090b",
  surface: "#18181b",
  surfaceRaised: "#27272a",
  ink: "#fafafa",
  inkSecondary: "#a1a1aa",
  inkFaint: "#8b8b93",
} as const;

// The original light tokens (:root in globals.css). Guarded here too so the
// documented light-mode ratios can't silently drift.
const LIGHT = {
  paper: "#ffffff",
  surface: "#fafafa",
  surfaceRaised: "#f4f4f5",
  ink: "#09090b",
  inkSecondary: "#52525b",
  inkFaint: "#71717a",
} as const;

/** WCAG relative luminance for an sRGB hex colour. */
function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/** WCAG contrast ratio between two hex colours (1:1 … 21:1). */
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe("dark theme contrast (WCAG AA)", () => {
  it("primary text clears AAA (7:1) on the page background", () => {
    expect(contrast(DARK.ink, DARK.paper)).toBeGreaterThanOrEqual(7);
  });

  it("secondary text clears AA normal (4.5:1) on the page background", () => {
    expect(contrast(DARK.inkSecondary, DARK.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("faint text clears AA normal (4.5:1) — it is used at small sizes", () => {
    // text-ink-faint appears on text-xs mono labels (see src/app/page.tsx), so
    // it must meet the normal-text bar, not just the 3:1 large-text floor.
    expect(contrast(DARK.inkFaint, DARK.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("primary text stays readable on raised surfaces", () => {
    expect(contrast(DARK.ink, DARK.surface)).toBeGreaterThanOrEqual(7);
    expect(contrast(DARK.ink, DARK.surfaceRaised)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps a perceptible hierarchy gap between secondary and faint text", () => {
    // Faint should read as quieter than secondary; if they collapse together
    // the grey-scale hierarchy the design depends on is lost.
    expect(contrast(DARK.inkSecondary, DARK.paper)).toBeGreaterThan(
      contrast(DARK.inkFaint, DARK.paper),
    );
  });
});

describe("light theme contrast (WCAG AA)", () => {
  it("primary text clears AAA (7:1) on the page background", () => {
    expect(contrast(LIGHT.ink, LIGHT.paper)).toBeGreaterThanOrEqual(7);
  });

  it("secondary text clears AA normal (4.5:1) on the page background", () => {
    expect(contrast(LIGHT.inkSecondary, LIGHT.paper)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("faint text clears AA normal (4.5:1) — it is used at small sizes", () => {
    expect(contrast(LIGHT.inkFaint, LIGHT.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("primary text stays readable on raised surfaces", () => {
    expect(contrast(LIGHT.ink, LIGHT.surface)).toBeGreaterThanOrEqual(7);
    expect(contrast(LIGHT.ink, LIGHT.surfaceRaised)).toBeGreaterThanOrEqual(4.5);
  });
});
