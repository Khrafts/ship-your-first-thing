import { describe, expect, it } from "vitest";
import {
  getAllLessonRefs,
  getDocHtml,
  getGlossaryHtml,
  getLesson,
  getModule,
  getModules,
  rewriteUrl,
} from "@/lib/content";

// The loader reads the canonical course markdown from the repo root (the
// parent of site/), which is the vitest cwd's parent — same contract as the
// running app.

describe("getModules", () => {
  it("discovers the five live modules in course order", async () => {
    const modules = await getModules();
    expect(modules.map((mod) => mod.number)).toEqual([0, 1, 2, 3, 3.5]);
    expect(modules.map((mod) => mod.slug)).toEqual([
      "00-welcome",
      "01-mental-models",
      "02-toolchain",
      "03-the-loop",
      "03.5-reading-code",
    ]);
  });

  it("parses module titles and strips the Module-N prefix for shortTitle", async () => {
    const mod = await getModule("01-mental-models");
    expect(mod).not.toBeNull();
    expect(mod!.title).toMatch(/^Module 1 — /);
    expect(mod!.shortTitle).not.toMatch(/^Module/);
    expect(mod!.shortTitle.length).toBeGreaterThan(0);
    expect(mod!.description.length).toBeGreaterThan(0);
  });

  it("lists lessons with canonical repo-relative paths and padded numbers", async () => {
    const mod = await getModule("01-mental-models");
    expect(mod!.lessons).toHaveLength(4);
    const first = mod!.lessons[0];
    expect(first.path).toBe("modules/01-mental-models/01-how-the-web-works.md");
    expect(first.lessonSlug).toBe("01-how-the-web-works");
    // YAML parses `lesson_number: 01` as the number 1 — must normalize back.
    expect(first.lessonNumber).toBe("01");
    expect(first.estMinutes).toBeGreaterThan(0);
    expect(mod!.totalMinutes).toBe(
      mod!.lessons.reduce((sum, lesson) => sum + lesson.estMinutes, 0),
    );
  });

  it("returns null for an unknown module", async () => {
    expect(await getModule("99-nope")).toBeNull();
  });
});

describe("getAllLessonRefs", () => {
  it("flattens every module's lessons in course order", async () => {
    const refs = await getAllLessonRefs();
    const modules = await getModules();
    const expected = modules.reduce((sum, mod) => sum + mod.lessonCount, 0);
    expect(refs).toHaveLength(expected);
    expect(refs[0].moduleSlug).toBe("00-welcome");
    expect(refs[refs.length - 1].moduleSlug).toBe("03.5-reading-code");
  });
});

describe("getLesson", () => {
  it("renders mermaid fences as language-mermaid code blocks", async () => {
    const lesson = await getLesson("01-mental-models", "01-how-the-web-works");
    expect(lesson).not.toBeNull();
    expect(lesson!.html).toContain("language-mermaid");
  });

  it("rewrites GLOSSARY callout links onto /glossary anchors", async () => {
    const lesson = await getLesson("01-mental-models", "01-how-the-web-works");
    expect(lesson!.html).toContain('href="/glossary#browser"');
    expect(lesson!.html).not.toContain("GLOSSARY.md");
  });

  it("strips frontmatter and the duplicate h1 from the body", async () => {
    const lesson = await getLesson("01-mental-models", "01-how-the-web-works");
    expect(lesson!.html).not.toContain("est_minutes");
    expect(lesson!.html).not.toContain("<h1");
  });

  it("computes prev/next across module boundaries", async () => {
    const lesson = await getLesson("01-mental-models", "01-how-the-web-works");
    expect(lesson!.prev?.moduleSlug).toBe("00-welcome");
    expect(lesson!.next?.lessonSlug).toBe("02-where-data-lives");

    const firstLesson = await getLesson("00-welcome", "01-welcome");
    expect(firstLesson!.prev).toBeNull();
  });

  it("returns null for an unknown lesson", async () => {
    expect(await getLesson("01-mental-models", "99-made-up")).toBeNull();
  });
});

describe("getGlossaryHtml", () => {
  it("turns ### term headings into id anchors", async () => {
    const html = await getGlossaryHtml();
    expect(html).toContain('id="browser"');
    expect(html).toContain('id="server"');
  });

  it("rewrites lesson back-references onto site routes", async () => {
    const html = await getGlossaryHtml();
    expect(html).toContain('href="/modules/01-mental-models/01-how-the-web-works"');
  });
});

describe("getDocHtml", () => {
  it("renders setup and routes module links onto the site", async () => {
    const doc = await getDocHtml("setup");
    expect(doc).not.toBeNull();
    expect(doc!.title).toBe("Setup");
    expect(doc!.html).toContain('href="/modules/00-welcome"');
  });

  it("returns html plus the h1 title for budget", async () => {
    const doc = await getDocHtml("budget");
    expect(doc).not.toBeNull();
    expect(doc!.title).toContain("BUDGET.md");
    expect(doc!.html.length).toBeGreaterThan(0);
    // The leading h1 is dropped — the page renders its own h1 chrome.
    expect(doc!.html).not.toContain("<h1");
  });

  it("renders the freshness log with its collapsed history intact", async () => {
    const doc = await getDocHtml("what-changed");
    expect(doc).not.toBeNull();
    expect(doc!.title).toBe("WHAT-CHANGED.md — Freshness log");
    // The live region and the collapsed historical entries both survive the pipeline.
    expect(doc!.html).toContain("Fast answers");
    expect(doc!.html).toContain("<details>");
    expect(doc!.html).toContain("V1 baseline");
  });

  it("returns null for a slug outside the whitelist", async () => {
    expect(await getDocHtml("nope")).toBeNull();
  });
});

describe("rewriteUrl", () => {
  const fromLesson = "modules/01-mental-models";

  it("maps glossary callouts from lesson depth", () => {
    expect(rewriteUrl("../../GLOSSARY.md#browser", fromLesson)).toBe(
      "/glossary#browser",
    );
  });

  it("maps sibling lessons and module READMEs", () => {
    expect(rewriteUrl("./02-where-data-lives.md", fromLesson)).toBe(
      "/modules/01-mental-models/02-where-data-lives",
    );
    expect(rewriteUrl("../02-toolchain/README.md", fromLesson)).toBe(
      "/modules/02-toolchain",
    );
  });

  it("maps the course README and SETUP.md", () => {
    expect(rewriteUrl("../../README.md", fromLesson)).toBe("/modules");
    expect(rewriteUrl("../../SETUP.md", fromLesson)).toBe("/docs/setup");
  });

  it("maps root docs onto /docs routes, preserving fragments", () => {
    expect(rewriteUrl("../../BUDGET.md", "modules/00-welcome")).toBe(
      "/docs/budget",
    );
    expect(rewriteUrl("../../BUDGET.md#path-1", "modules/00-welcome")).toBe(
      "/docs/budget#path-1",
    );
    expect(rewriteUrl("../../CHEATSHEET.md", fromLesson)).toBe(
      "/docs/cheatsheet",
    );
    expect(rewriteUrl("../../COMMON-ISSUES.md", fromLesson)).toBe(
      "/docs/common-issues",
    );
    // The "Last captured" freshness banners in every M3 lesson link here.
    expect(rewriteUrl("../../WHAT-CHANGED.md", fromLesson)).toBe(
      "/docs/what-changed",
    );
  });

  it("falls back to GitHub for repo files the site does not render", () => {
    expect(rewriteUrl("../../lesson-template.md", fromLesson)).toMatch(
      /^https:\/\/github\.com\/.+\/blob\/main\/lesson-template\.md$/,
    );
  });

  it("leaves absolute URLs and pure anchors alone", () => {
    expect(rewriteUrl("https://example.com/a", fromLesson)).toBe(
      "https://example.com/a",
    );
    expect(rewriteUrl("#core-read", fromLesson)).toBe("#core-read");
  });
});
