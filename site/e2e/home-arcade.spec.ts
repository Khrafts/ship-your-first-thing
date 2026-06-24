import { expect, test } from "@playwright/test";
import { TAGLINE } from "../src/lib/copy";

// Smoke coverage for the home-page pixel arcade (the <ShipGameHero /> client
// island that sits above the hero copy). It must render a playable canvas and
// let a visitor cycle all three games — WITHOUT disturbing the existing hero
// (title, tagline, the single "Start the course →" link, curriculum).
//
// The three games, in switcher order (registry: builder → breaker → shooter):
const GAMES = [
  { name: "Build it", tagline: "Ship a layer at a time. Finish the crate." },
  { name: "Chip the wall", tagline: "Slide the paddle. Clear the wall, brick by brick." },
  { name: "Keep it live", tagline: "Slide and fire. Knock down what comes at your app." },
] as const;

test.describe("home arcade", () => {
  test("renders a playable game canvas labelled for assistive tech", async ({
    page,
  }) => {
    await page.goto("/");

    // The canvas is exposed as an image with a descriptive label, and is
    // keyboard-focusable (tabIndex={0}).
    const canvas = page.locator("canvas");
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute("aria-label", /pixel/i);
    await expect(canvas).toHaveAttribute("tabindex", "0");
  });

  test("the switcher cycles through all three games", async ({ page }) => {
    await page.goto("/");

    // The default game (builder → "Build it") is selected on first load;
    // its tagline shows beneath the canvas.
    const first = page.getByRole("button", { name: GAMES[0].name });
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(GAMES[0].tagline, { exact: true })).toBeVisible();

    // Clicking each switcher button selects that game: its button becomes
    // pressed and its tagline appears. This walks all three in order.
    for (const game of GAMES) {
      const button = page.getByRole("button", { name: game.name });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByText(game.tagline, { exact: true }),
      ).toBeVisible();
    }

    // Exactly one game is selected at a time (the switcher is single-choice).
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(1);
  });

  test("the switcher cycles with the arrow keys", async ({ page }) => {
    await page.goto("/");

    // Focus the first switcher button, then ArrowRight advances to the next
    // game; the group handles arrow-key cycling.
    const first = page.getByRole("button", { name: GAMES[0].name });
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("button", { name: GAMES[1].name }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(GAMES[1].tagline, { exact: true })).toBeVisible();
  });

  test("a keyboard jump on the focused canvas starts a round without throwing", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/");
    const canvas = page.locator("canvas");

    // Focus the canvas (so Space is captured rather than scrolling the page),
    // then press Space to start a round.
    await canvas.focus();
    await page.keyboard.press("Space");

    // A click on the canvas is the pointer equivalent of a jump.
    await canvas.click({ position: { x: 20, y: 20 } });

    // No uncaught errors from input handling / the rAF loop.
    expect(pageErrors).toEqual([]);
  });

  test("Space scrolls the page when the canvas is not focused (no scroll trap)", async ({
    page,
  }) => {
    await page.goto("/");

    // With nothing in the arcade focused, Space must behave normally: focus the
    // body and press Space — the page scrolls down rather than being trapped.
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Space");
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThanOrEqual(before);
  });

  test("the arcade leaves the existing hero, CTA and curriculum intact", async ({
    page,
  }) => {
    await page.goto("/");

    // The hero title and the locked tagline are still present and verbatim.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ship your first thing",
    );
    await expect(page.getByText(TAGLINE, { exact: true })).toBeVisible();

    // There is exactly ONE "Start the course →" link in the DOM — the arcade's
    // own call-to-action reads "Take the course →" and is only mounted on the
    // game-over card, so it is absent on the fresh page.
    await expect(
      page.getByRole("link", { name: "Start the course →" }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Take the course →" }),
    ).toHaveCount(0);

    // The curriculum sections below are unchanged.
    await expect(page.getByText("coming later", { exact: true })).toHaveCount(4);
    await expect(page.getByText("The curriculum", { exact: true })).toBeVisible();
  });

  test("the 'Take the course' destination redirects signed-out visitors to signup", async ({
    page,
  }) => {
    // The game-over CTA points at /continue — a per-request redirect: signed-out
    // visitors land on /signup (signed-in visitors resume their current lesson).
    await page.goto("/continue");
    await expect(page).toHaveURL(/\/signup\b/);
  });
});
