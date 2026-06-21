import { describe, expect, it } from "vitest";
import { getLessonContext, LESSON_CONTEXT_CAP } from "@/lib/content";

describe("getLessonContext", () => {
  it("returns the title and raw markdown body for a known lesson", async () => {
    const ctx = await getLessonContext("modules/00-welcome/01-welcome.md");
    expect(ctx).not.toBeNull();
    expect(ctx!.title.length).toBeGreaterThan(0);
    expect(ctx!.body.length).toBeGreaterThan(0);
    // body is source markdown (frontmatter stripped), not rendered HTML
    expect(ctx!.body).not.toContain("<p>");
    expect(ctx!.body).not.toMatch(/^---/);
  });

  it("caps the body at LESSON_CONTEXT_CAP characters", async () => {
    const ctx = await getLessonContext("modules/00-welcome/01-welcome.md");
    expect(ctx!.body.length).toBeLessThanOrEqual(LESSON_CONTEXT_CAP);
  });

  it("returns null for an unknown lesson path", async () => {
    expect(await getLessonContext("modules/does-not/exist.md")).toBeNull();
  });
});
