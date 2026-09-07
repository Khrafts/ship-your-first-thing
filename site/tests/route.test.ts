import { describe, expect, it } from "vitest";
import { getModules } from "@/lib/content";
import { chainLessons, pickResumeLesson } from "@/lib/route";

// Resume must follow the practical route (real lesson paths): a learner who
// finished Module 0 and skipped Module 1 is sent to Module 2 Lesson 3, not
// back to Module 1; one who is mid-Module 3 stays in Module 3.

const M0 = [
  "modules/00-welcome/01-welcome.md",
  "modules/00-welcome/02-hardware-check.md",
  "modules/00-welcome/03-cost-path-triage.md",
  "modules/00-welcome/04-account-creation.md",
  "modules/00-welcome/05-install-your-agent-app.md",
  "modules/00-welcome/06-build-your-first-thing.md",
];
const M1_FIRST = "modules/01-mental-models/01-how-the-web-works.md";
const M2_L3 = "modules/02-toolchain/03-the-save-system.md";
const M3_L1 = "modules/03-the-loop/01-introducing-the-loop.md";
const M3_L2 = "modules/03-the-loop/02-planning-vs-execution.md";

describe("pickResumeLesson — practical route", () => {
  it("starts at Module 0 Lesson 1 with no progress", async () => {
    expect(pickResumeLesson(await getModules(), new Set())?.path).toBe(M0[0]);
  });

  it("sends a learner who finished Module 0 (Module 1 untouched) to Module 2 Lesson 3", async () => {
    expect(pickResumeLesson(await getModules(), new Set(M0))?.path).toBe(M2_L3);
  });

  it("keeps a learner mid-Module 3 in Module 3, with Module 1 and M2 L1–L2 untouched", async () => {
    const completed = new Set([...M0, M2_L3, M3_L1]);
    expect(pickResumeLesson(await getModules(), completed)?.path).toBe(M3_L2);
  });

  it("offers reference lessons only once the whole route is complete", async () => {
    const modules = await getModules();
    const completed = new Set(chainLessons(modules).map((l) => l.path));
    expect(pickResumeLesson(modules, completed)?.path).toBe(M1_FIRST);
    const everything = new Set(modules.flatMap((m) => m.lessons.map((l) => l.path)));
    expect(pickResumeLesson(modules, everything)).toBeNull();
  });
});
