import { expect, test, type Page } from "@playwright/test";
import {
  COMPLETE_LABEL,
  COMPLETED_PATTERN,
  completeModuleZero,
  FIRST_LESSON_URL,
  signUp,
  uniqueEmail,
} from "./helpers";

const LESSON_URL = "/modules/01-mental-models/01-how-the-web-works";

// Mermaid hydration happens client-side after a dynamic import of the
// (large) mermaid bundle — allow a generous timeout for the first diagram.
const MERMAID_TIMEOUT = 30_000;

/** The desktop lesson rail (module-sidebar.tsx) — visible at the suite's
 *  default 1280x720 viewport (the component hides below lg / 1024px). */
function sidebar(page: Page) {
  return page.getByRole("complementary", { name: "Lessons in this module" });
}

test.describe("lesson page (signed out)", () => {
  test("first lesson of the course is open and carries glossary links", async ({
    page,
  }) => {
    await page.goto(FIRST_LESSON_URL);
    await expect(
      page.getByRole("heading", { level: 1, name: "Welcome" }),
    ).toBeVisible();
    expect(
      await page.locator('article a[href^="/glossary#"]').count(),
    ).toBeGreaterThanOrEqual(1);
  });

  test("a later lesson shows the locked card instead of the body", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    // Title and meta stay visible — the gate is pacing, not secrecy.
    await expect(
      page.getByRole("heading", { level: 1, name: "How the web works" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "This lesson is locked" }),
    ).toBeVisible();
    // No lesson body: no diagrams, and a pointer back to the course start.
    expect(await page.locator(".mermaid-figure").count()).toBe(0);
    await expect(
      page.locator(`article a[href="${FIRST_LESSON_URL}"]`),
    ).toBeVisible();
  });

  test("sidebar lists module 0's five lessons; current row marked, rest locked", async ({
    page,
  }) => {
    await page.goto(FIRST_LESSON_URL);
    const rail = sidebar(page);
    await expect(rail).toBeVisible();

    const rows = rail.locator("ol > li");
    await expect(rows).toHaveCount(5);

    // The lesson being viewed carries aria-current="page".
    const current = rail.locator('[aria-current="page"]');
    await expect(current).toBeVisible();
    await expect(current).toContainText("Welcome");

    // Signed out, nothing beyond the first lesson is unlocked: the other
    // four rows are aria-disabled lock rows, and no lesson row is an anchor.
    await expect(rail.locator('ol [aria-disabled="true"]')).toHaveCount(4);
    expect(await rail.locator("ol a").count()).toBe(0);
  });
});

// The rendering contracts below need the mental-models lesson unlocked, so
// the whole block shares one signed-in page that completed Module 0 once.
// Serial mode: state (Module 0 completion) is shared, and the final test
// mutates this user's progress.
test.describe("lesson page (unlocked)", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120_000);
    page = await browser.newPage();
    await signUp(page, {
      name: "Lesson Reader",
      email: uniqueEmail("lesson"),
      password: "lesson-pass-1",
    });
    await completeModuleZero(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("renders the lesson title and a glossary-anchored vocab link", async () => {
    await page.goto(LESSON_URL);
    await expect(
      page.getByRole("heading", { level: 1, name: "How the web works" }),
    ).toBeVisible();
    expect(
      await page.locator('a[href="/glossary#browser"]').count(),
    ).toBeGreaterThanOrEqual(1);
  });

  test("renders at least one visible mermaid diagram", async () => {
    await page.goto(LESSON_URL);
    // The hydrated wrapper class is .mermaid-figure (see lesson-article.tsx).
    const diagrams = page.locator(".mermaid-figure svg");
    await expect(diagrams.first()).toBeVisible({ timeout: MERMAID_TIMEOUT });
    expect(await diagrams.count()).toBeGreaterThanOrEqual(1);
  });

  test("technical diagram stays collapsed until its summary is clicked", async () => {
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

  test("glossary link lands on the anchored term", async () => {
    await page.goto(LESSON_URL);
    await page.locator('a[href="/glossary#browser"]').first().click();
    await page.waitForURL(/\/glossary#browser$/);
    await expect(page.locator("#browser")).toBeAttached();
  });

  test("sidebar shows module 1's four lessons with completion count and locks", async () => {
    await page.goto(LESSON_URL);
    const rail = sidebar(page);
    await expect(rail).toBeVisible();

    const rows = rail.locator("ol > li");
    await expect(rows).toHaveCount(4);
    await expect(rail.locator('[aria-current="page"]')).toContainText(
      "How the web works",
    );
    // Signed in: the rail shows the module completion counter. This lesson
    // isn't complete yet, so the three later lessons are still locked rows.
    await expect(rail.getByText("0/4 complete")).toBeVisible();
    await expect(rail.locator('ol [aria-disabled="true"]')).toHaveCount(3);
  });

  test("mark-complete control renders before the prev/next nav", async () => {
    await page.goto(LESSON_URL);
    const button = page.getByRole("button", {
      name: COMPLETE_LABEL,
      exact: true,
    });
    await expect(button).toBeVisible();
    // The article's last <nav> is the prev/next footer (the first is the
    // breadcrumb above the title).
    const footerNav = page.locator("article nav").last();
    await expect(footerNav).toContainText("Next →");

    const navHandle = await footerNav.elementHandle();
    const position = await button.evaluate(
      (btn, nav) => btn.compareDocumentPosition(nav as Node),
      navHandle,
    );
    // DOCUMENT_POSITION_FOLLOWING (4): the nav comes after the button.
    expect(position & 4).toBeTruthy();
  });

  // Runs last in the serial block: it mutates completion state for this user.
  test("next-lesson nav locks until this lesson is complete, then links lesson 02", async () => {
    await page.goto(LESSON_URL);
    // Not yet complete — the next card is a locked placeholder, not a link.
    await expect(
      page.getByText("Mark this lesson complete to unlock"),
    ).toBeVisible();
    expect(
      await page
        .locator('article a[href="/modules/01-mental-models/02-where-data-lives"]')
        .count(),
    ).toBe(0);

    await page
      .getByRole("button", { name: COMPLETE_LABEL, exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: COMPLETED_PATTERN }),
    ).toBeVisible();

    const nextLink = page.getByRole("link", { name: /Next →/ });
    await expect(nextLink).toHaveAttribute(
      "href",
      "/modules/01-mental-models/02-where-data-lives",
    );
  });
});
