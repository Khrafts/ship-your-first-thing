import { describe, expect, it } from "vitest";
import {
  isTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeInitScript,
} from "@/lib/theme";

describe("resolveTheme", () => {
  it("pins an explicit light or dark choice regardless of the OS", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("defers to the OS preference when the choice is 'system'", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("isTheme", () => {
  it("accepts the three valid modes", () => {
    expect(isTheme("system")).toBe(true);
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
  });

  it("rejects anything else, including stale or malformed storage values", () => {
    expect(isTheme("nonsense")).toBe(false);
    expect(isTheme("")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
    expect(isTheme(42)).toBe(false);
  });
});

describe("themeInitScript", () => {
  const script = themeInitScript();

  it("reads the persisted choice from the agreed storage key", () => {
    expect(script).toContain(JSON.stringify(THEME_STORAGE_KEY));
    expect(script).toContain("localStorage.getItem");
  });

  it("falls back to the OS color-scheme preference", () => {
    expect(script).toContain("prefers-color-scheme: dark");
  });

  it("toggles the dark class on the document element", () => {
    expect(script).toContain("classList.toggle");
  });

  it("is wrapped so a storage exception can never break first paint", () => {
    expect(script).toContain("try");
    expect(script).toContain("catch");
  });

  // Execute the (DOM-free-once-injected) script against fakes and assert it
  // sets the dark class for exactly the cases the React provider would —
  // resolveTheme(isTheme(stored) ? stored : "system", osDark) === "dark". The
  // two paths MUST agree or returning users see a flash of the wrong theme.
  function runInitScript(stored: string | null, osDark: boolean): boolean {
    let darkClass = false;
    const fakeWindow = {
      matchMedia: () => ({ matches: osDark }),
    };
    const fakeLocalStorage = { getItem: () => stored };
    const fakeDocument = {
      documentElement: {
        classList: {
          toggle: (_cls: string, on: boolean) => {
            darkClass = on;
          },
        },
      },
    };
    new Function("window", "localStorage", "document", script)(
      fakeWindow,
      fakeLocalStorage,
      fakeDocument,
    );
    return darkClass;
  }

  function providerResolvesDark(stored: string | null, osDark: boolean): boolean {
    const choice = isTheme(stored) ? stored : "system";
    return resolveTheme(choice, osDark) === "dark";
  }

  const storedValues = ["light", "dark", "system", null, "", "nonsense"];
  for (const stored of storedValues) {
    for (const osDark of [true, false]) {
      it(`matches the provider for stored=${JSON.stringify(stored)}, osDark=${osDark}`, () => {
        expect(runInitScript(stored, osDark)).toBe(
          providerResolvesDark(stored, osDark),
        );
      });
    }
  }
});
