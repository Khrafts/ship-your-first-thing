import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Rendered-surface coverage for the catalog, module landing and lesson page
// against the REAL course markdown, with only the session and the progress
// table stubbed. The regression these guard: every one of these surfaces
// used to decide "Start here" vs. "Your next step / your route continues at"
// from "has this learner completed anything", so completing a single
// reference lesson (Module 1, Module 2 Lessons 1–2) — which is not on the
// practical route — made the page claim route progress that did not exist.

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/progress", () => ({
  getCompletedLessonPaths: vi.fn(),
  getModuleProgressMap: vi.fn(async () => new Map()),
}));
// Client-only pieces of the lesson page: none of them carries the copy under
// test, and the completion button needs the app router.
vi.mock("@/components/lesson-article", () => ({
  LessonArticle: () => <div data-testid="lesson-article" />,
}));
vi.mock("@/components/lesson-complete-button", () => ({
  LessonCompleteButton: () => <button type="button">Mark lesson complete</button>,
}));
vi.mock("@/components/lesson-chat/lesson-chat", () => ({
  LessonChat: () => null,
}));

import { auth } from "@/auth";
import { getCompletedLessonPaths } from "@/lib/progress";
import ModulesPage from "@/app/modules/page";
import ModulePage from "@/app/modules/[moduleSlug]/page";
import LessonPage from "@/app/modules/[moduleSlug]/[lessonSlug]/page";

const M0_L1 = "modules/00-welcome/01-welcome.md";
const M0_L1_URL = "/modules/00-welcome/01-welcome";
const M2_L3_URL = "/modules/02-toolchain/03-the-save-system";
const M1 = [
  "modules/01-mental-models/01-how-the-web-works.md",
  "modules/01-mental-models/02-where-data-lives.md",
  "modules/01-mental-models/03-who-can-do-what.md",
  "modules/01-mental-models/04-how-it-goes-live.md",
];
const M2_L1 = "modules/02-toolchain/01-your-ai-coding-agent.md";

/** Configure the viewer: null = signed out; otherwise a user with `completed`. */
function viewer(completed: string[] | null) {
  vi.mocked(auth).mockResolvedValue(
    (completed ? { user: { id: "u1" } } : null) as never,
  );
  vi.mocked(getCompletedLessonPaths).mockResolvedValue(new Set(completed ?? []));
}

// The pages are async server components; awaiting them yields a plain
// element tree that react-dom/server can render.
const renderCatalog = async () => renderToStaticMarkup(await ModulesPage());
const renderModule = async (moduleSlug: string) =>
  renderToStaticMarkup(await ModulePage({ params: Promise.resolve({ moduleSlug }) }));
const renderLesson = async (moduleSlug: string, lessonSlug: string) =>
  renderToStaticMarkup(
    await LessonPage({ params: Promise.resolve({ moduleSlug, lessonSlug }) }),
  );

/** Outer HTML of the first element carrying data-testid="…". */
function testIdHtml(html: string, id: string): string {
  const start = html.indexOf(`data-testid="${id}"`);
  if (start === -1) return "";
  const open = html.lastIndexOf("<", start);
  const tag = html.slice(open + 1, start).trim().split(/\s/)[0];
  // Walk to the matching close tag by counting this tag name's opens/closes.
  let depth = 0;
  const re = new RegExp(`<(/?)${tag}(?=[\\s>])`, "g");
  re.lastIndex = open;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(open, html.indexOf(">", m.index) + 1);
  }
  return html.slice(open);
}

/** Visible text of that element: tags stripped, entities decoded. */
function testIdText(html: string, id: string): string {
  return testIdHtml(html, id)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

beforeEach(() => {
  vi.mocked(auth).mockReset();
  vi.mocked(getCompletedLessonPaths).mockReset();
});

describe("reference-only completion before Module 0 is not route progress", () => {
  it("catalog: the next-step card still says “Start here” and points at Module 0 Lesson 1", async () => {
    viewer([M1[0]]);
    const html = await renderCatalog();
    const card = testIdText(html, "catalog-next");
    expect(card).toContain("Start here");
    expect(card).not.toContain("Your next step");
    expect(testIdHtml(html, "catalog-next")).toContain(`href="${M0_L1_URL}"`);
  });

  it("catalog: every reference lesson complete, nothing on the chain — still “Start here”", async () => {
    viewer([...M1, M2_L1, "modules/02-toolchain/02-the-engine-room.md"]);
    const card = testIdText(await renderCatalog(), "catalog-next");
    expect(card).toContain("Start here");
    expect(card).not.toContain("Your next step");
    expect(card).not.toContain("Route finished");
  });

  it("catalog: a completed route lesson does flip the card to “Your next step”", async () => {
    viewer([M0_L1]);
    const card = testIdText(await renderCatalog(), "catalog-next");
    expect(card).toContain("Your next step");
    expect(card).not.toContain("Start here");
  });

  it("Module 0 landing: “Start here”, not “Next up in this module”", async () => {
    viewer([M1[0]]);
    const box = testIdText(await renderModule("00-welcome"), "module-next");
    expect(box).toContain("Start here");
    expect(box).not.toContain("Next up in this module");
    expect(box).not.toContain("route continues");
  });

  it("Module 1 landing (a reference lesson done): “The practical route starts at”, not “continues at”", async () => {
    viewer([M1[0]]);
    const html = await renderModule("01-mental-models");
    const box = testIdText(html, "module-next");
    expect(box).toContain("The practical route starts at");
    expect(box).not.toContain("continues at");
    expect(testIdHtml(html, "module-next")).toContain(`href="${M0_L1_URL}"`);
  });

  it("Module 1 landing (all of Module 1 done): finished-module copy says the route starts, not continues", async () => {
    viewer(M1);
    const box = testIdText(await renderModule("01-mental-models"), "module-next");
    expect(box).toContain("You've finished this module — the practical route starts at");
    expect(box).not.toContain("your route continues at");
  });

  it("Module 1 landing after a route lesson: “Your route continues at” is honest", async () => {
    viewer([M0_L1, M1[0]]);
    const box = testIdText(await renderModule("01-mental-models"), "module-next");
    expect(box).toContain("Your route continues at");
    expect(box).not.toContain("starts at");
  });

  it("lesson page: a reference lesson read after completing another says the route starts, not continues", async () => {
    viewer([M1[0]]);
    const html = await renderLesson("01-mental-models", "02-where-data-lives");
    const card = testIdText(html, "practical-next");
    expect(card).toContain("The practical route starts at");
    expect(card).not.toContain("Your route continues at");
    expect(testIdHtml(html, "practical-next")).toContain(`href="${M0_L1_URL}"`);
  });

  it("lesson page: the same reference lesson after a route lesson says the route continues", async () => {
    viewer([M0_L1, M1[0]]);
    const card = testIdText(
      await renderLesson("01-mental-models", "02-where-data-lives"),
      "practical-next",
    );
    expect(card).toContain("Your route continues at");
  });
});

describe("Module 0 Lesson 6 practical-next card", () => {
  it("signed out: no completion control, so the card explains sign-in-to-record and links it", async () => {
    viewer(null);
    const html = await renderLesson("00-welcome", "06-build-your-first-thing");
    expect(html).not.toContain("Mark lesson complete");
    const card = testIdHtml(html, "practical-next");
    expect(card).toContain(`href="${M2_L3_URL}"`);
    expect(card).toContain('href="/signin"');
    const text = testIdText(html, "practical-next");
    expect(text).toContain("Practical next step");
    expect(text).toContain("recording needs an account");
    expect(text).not.toContain("Unlocks when you mark this lesson complete");
  });

  it("signed in, not yet complete: keeps the mark-complete instruction and no sign-in link", async () => {
    viewer([]);
    const html = await renderLesson("00-welcome", "06-build-your-first-thing");
    expect(html).toContain("Mark lesson complete");
    const card = testIdHtml(html, "practical-next");
    expect(card).toContain(`href="${M2_L3_URL}"`);
    expect(card).not.toContain('href="/signin"');
    expect(testIdText(html, "practical-next")).toContain(
      "Unlocks when you mark this lesson complete",
    );
  });

  it("signed in with Module 0 complete: the save lesson is open and the card says so", async () => {
    viewer([
      M0_L1,
      "modules/00-welcome/02-hardware-check.md",
      "modules/00-welcome/03-cost-path-triage.md",
      "modules/00-welcome/04-account-creation.md",
      "modules/00-welcome/05-install-your-agent-app.md",
      "modules/00-welcome/06-build-your-first-thing.md",
    ]);
    const text = testIdText(
      await renderLesson("00-welcome", "06-build-your-first-thing"),
      "practical-next",
    );
    expect(text).toContain("The lesson this course recommends you do next");
  });
});

// Sanity: the URLs the assertions use are ones the pages really render, so a
// renamed lesson fails loudly here rather than silently passing a
// not-contains check above.
describe("fixture paths", () => {
  it("the catalog links Module 0, its first lesson and the save lesson", async () => {
    viewer(null);
    const html = await renderCatalog();
    expect(html).toContain('href="/modules/00-welcome"');
    expect(html).toContain(`href="${M0_L1_URL}"`);
    expect(html).toContain(`href="${M2_L3_URL}"`);
  });
});
