import { expect, test } from "@playwright/test";

const LESSON_URL = "/modules/01-mental-models/01-how-the-web-works";

// Mermaid hydration happens client-side after a dynamic import of the
// (large) mermaid bundle — allow a generous timeout for the first diagram.
const MERMAID_TIMEOUT = 30_000;

test.describe("lesson page", () => {
  test("renders the lesson title and a glossary-anchored vocab link", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await expect(
      page.getByRole("heading", { level: 1, name: "How the web works" }),
    ).toBeVisible();
    expect(
      await page.locator('a[href="/glossary#browser"]').count(),
    ).toBeGreaterThanOrEqual(1);
  });

  test("renders at least one visible mermaid diagram", async ({ page }) => {
    await page.goto(LESSON_URL);
    // The hydrated wrapper class is .mermaid-figure (see lesson-article.tsx).
    const diagrams = page.locator(".mermaid-figure svg");
    await expect(diagrams.first()).toBeVisible({ timeout: MERMAID_TIMEOUT });
    expect(await diagrams.count()).toBeGreaterThanOrEqual(1);
  });

  test("technical diagram stays collapsed until its summary is clicked", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    // Wait for hydration to reach the diagrams before inspecting the details.
    await expect(page.locator(".mermaid-figure svg").first()).toBeVisible({
      timeout: MERMAID_TIMEOUT,
    });

    const details = page.locator("details").first();
    await expect(details).toBeAttached();
    await expect(details).not.toHaveAttribute("open");
    // The app hydrates fences inside the closed <details> too, so the svg may
    // already exist — the contract is that nothing inside is visible yet.
    await expect(details.locator("svg").first()).toBeHidden();

    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open");
    await expect(details.locator("svg").first()).toBeVisible({
      timeout: MERMAID_TIMEOUT,
    });
  });

  test("next-lesson nav points at lesson 02", async ({ page }) => {
    await page.goto(LESSON_URL);
    const nextLink = page.getByRole("link", { name: /Next →/ });
    await expect(nextLink).toHaveAttribute(
      "href",
      "/modules/01-mental-models/02-where-data-lives",
    );
  });

  test("glossary link lands on the anchored term", async ({ page }) => {
    await page.goto(LESSON_URL);
    await page.locator('a[href="/glossary#browser"]').first().click();
    await page.waitForURL(/\/glossary#browser$/);
    await expect(page.locator("#browser")).toBeAttached();
  });
});
