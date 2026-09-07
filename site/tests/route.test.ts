import { describe, expect, it } from "vitest";
import { getModules } from "@/lib/content";
import {
  chainLessons,
  hasRouteProgress,
  isRouteComplete,
  lessonRole,
  nextRouteStep,
  moduleRole,
  nextRouteLesson,
  pickResumeLesson,
  routeEntry,
  routePointer,
  routeStops,
} from "@/lib/route";

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

// Route-vs-reference helpers behind the catalog, module landing and lesson
// pages. Same real paths: the regressions these guard are "Module 0 Lesson 6
// points at Module 2 Lesson 3, not Module 1", "Module 2 is mixed", "a
// reference lesson points back to the route, not at the flat next lesson",
// and "gate guidance names the gating lesson, not the previous module".

const M1 = [
  M1_FIRST,
  "modules/01-mental-models/02-where-data-lives.md",
  "modules/01-mental-models/03-who-can-do-what.md",
  "modules/01-mental-models/04-how-it-goes-live.md",
];
const M2_L1 = "modules/02-toolchain/01-your-ai-coding-agent.md";
const M2_L2 = "modules/02-toolchain/02-the-engine-room.md";
const M3_L4 = "modules/03-the-loop/04-steering-and-recovery.md";
const M4_L0 = "modules/04-thread-project/00-the-plan.md";
const M7_LAST = "modules/07-where-next/03-where-to-go-from-here.md";

describe("lessonRole / moduleRole", () => {
  it("marks Module 1 and Module 2 Lessons 1–2 as reference, everything else as route", async () => {
    const modules = await getModules();
    const bySlug = new Map(modules.map((m) => [m.slug, m]));
    expect(moduleRole(bySlug.get("00-welcome")!)).toBe("route");
    expect(moduleRole(bySlug.get("01-mental-models")!)).toBe("reference");
    expect(moduleRole(bySlug.get("02-toolchain")!)).toBe("mixed");
    for (const slug of ["03-the-loop", "04-thread-project", "05-operating", "06-after-live", "07-where-next"]) {
      expect(moduleRole(bySlug.get(slug)!), slug).toBe("route");
    }
    expect(lessonRole("02-toolchain", M2_L1)).toBe("reference");
    expect(lessonRole("02-toolchain", M2_L2)).toBe("reference");
    expect(lessonRole("02-toolchain", M2_L3)).toBe("route");
    expect(lessonRole("01-mental-models", M1_FIRST)).toBe("reference");
    expect(lessonRole("00-welcome", M0[0])).toBe("route");
  });
});

describe("nextRouteLesson — skips reference", () => {
  it("sends Module 0 Lesson 6 straight to Module 2 Lesson 3", async () => {
    expect(nextRouteLesson(await getModules(), M0[5])?.path).toBe(M2_L3);
  });

  it("sends Module 2 Lesson 3 to Module 3 Lesson 1 and walks Module 3 in order", async () => {
    const modules = await getModules();
    expect(nextRouteLesson(modules, M2_L3)?.path).toBe(M3_L1);
    expect(nextRouteLesson(modules, M3_L1)?.path).toBe(M3_L2);
    expect(nextRouteLesson(modules, M3_L4)?.path).toBe(M4_L0);
  });

  it("is null on reference lessons and at the end of the route", async () => {
    const modules = await getModules();
    expect(nextRouteLesson(modules, M2_L2)).toBeNull();
    expect(nextRouteLesson(modules, M1[3])).toBeNull();
    expect(nextRouteLesson(modules, M7_LAST)).toBeNull();
  });
});

describe("routePointer — practical next vs. return to the route", () => {
  it("on a route lesson, points at the next route lesson regardless of progress", async () => {
    const modules = await getModules();
    expect(routePointer(modules, "00-welcome", M0[5], new Set())).toEqual({
      kind: "next-step",
      lesson: expect.objectContaining({ path: M2_L3 }),
    });
    expect(routePointer(modules, "02-toolchain", M2_L3, new Set(M0))).toEqual({
      kind: "next-step",
      lesson: expect.objectContaining({ path: M3_L1 }),
    });
    expect(routePointer(modules, "07-where-next", M7_LAST, new Set())).toBeNull();
  });

  it("on a reference lesson, points back to where this learner's route continues", async () => {
    const modules = await getModules();
    // Signed out / no progress: the start of the route, not Module 1 Lesson 2.
    expect(routePointer(modules, "01-mental-models", M1_FIRST, new Set())).toEqual({
      kind: "return",
      lesson: expect.objectContaining({ path: M0[0] }),
    });
    // Mixed Module 2 state: Module 0 done, Lessons 1–2 open on demand → the
    // save lesson, not "the next lesson in Module 2" by accident.
    expect(routePointer(modules, "02-toolchain", M2_L2, new Set(M0))).toEqual({
      kind: "return",
      lesson: expect.objectContaining({ path: M2_L3 }),
    });
    // Reading Module 1 from the middle of Module 3 returns to Module 3.
    expect(
      routePointer(modules, "01-mental-models", M1[2], new Set([...M0, M2_L3, M3_L1])),
    ).toEqual({ kind: "return", lesson: expect.objectContaining({ path: M3_L2 }) });
  });

  it("once the route is complete, a reference lesson never points at another reference lesson as the route", async () => {
    const modules = await getModules();
    // Every route lesson done; Module 1 Lessons 1–2 still unread. Viewing
    // Lesson 2, the resume fallback would offer Lesson 1 — but that is more
    // reference, not "where your route continues", so there is no pointer.
    const routeDone = new Set(chainLessons(modules).map((l) => l.path));
    const everythingButTwo = new Set(
      modules.flatMap((m) => m.lessons.map((l) => l.path)).filter((p) => p !== M1[0] && p !== M1[1]),
    );
    expect(isRouteComplete(modules, routeDone)).toBe(true);
    expect(isRouteComplete(modules, everythingButTwo)).toBe(true);
    expect(nextRouteStep(modules, everythingButTwo)).toBeNull();
    expect(pickResumeLesson(modules, everythingButTwo)?.path).toBe(M1[0]);
    expect(routePointer(modules, "01-mental-models", M1[1], everythingButTwo)).toBeNull();
    expect(routePointer(modules, "01-mental-models", M1[0], everythingButTwo)).toBeNull();
    expect(routePointer(modules, "01-mental-models", M1[1], routeDone)).toBeNull();
    // A route lesson at the end of the route has no next step either.
    expect(routePointer(modules, "07-where-next", M7_LAST, routeDone)).toBeNull();
  });

  it("nextRouteStep agrees with resume while the route is unfinished and stops when it is", async () => {
    const modules = await getModules();
    for (const completed of [new Set<string>(), new Set(M0), new Set([...M0, M2_L3, M3_L1])]) {
      expect(nextRouteStep(modules, completed)?.path).toBe(pickResumeLesson(modules, completed)?.path);
      expect(isRouteComplete(modules, completed)).toBe(false);
    }
    // Un-completing an earlier route lesson re-opens the route at that lesson.
    const gap = new Set(chainLessons(modules).map((l) => l.path));
    gap.delete(M3_L2);
    expect(nextRouteStep(modules, gap)?.path).toBe(M3_L2);
  });
});

describe("hasRouteProgress — completing reference is not route progress", () => {
  it("is false with no progress and false when only reference lessons are complete", async () => {
    const modules = await getModules();
    expect(hasRouteProgress(modules, new Set())).toBe(false);
    // Every reference lesson done, nothing on the chain: the route has not
    // been started, so no surface may say it "continues".
    const referenceOnly = new Set([...M1, M2_L1, M2_L2]);
    expect(hasRouteProgress(modules, referenceOnly)).toBe(false);
    expect(hasRouteProgress(modules, new Set([M1_FIRST]))).toBe(false);
    // The resume pick for that learner is still the very first route lesson.
    expect(nextRouteStep(modules, referenceOnly)?.path).toBe(M0[0]);
    expect(pickResumeLesson(modules, referenceOnly)?.path).toBe(M0[0]);
  });

  it("is true as soon as any route lesson is complete, and stays true through the finished route", async () => {
    const modules = await getModules();
    expect(hasRouteProgress(modules, new Set([M0[0]]))).toBe(true);
    // Module 0 is fully open, so a lesson can be completed out of order.
    expect(hasRouteProgress(modules, new Set([M0[2]]))).toBe(true);
    expect(hasRouteProgress(modules, new Set([...M0, M2_L3, M3_L1]))).toBe(true);
    const routeDone = new Set(chainLessons(modules).map((l) => l.path));
    expect(hasRouteProgress(modules, routeDone)).toBe(true);
    expect(isRouteComplete(modules, routeDone)).toBe(true);
  });
});

describe("routeEntry — the lesson a module's route actually opens after", () => {
  it("names the gating lesson, not the previous module", async () => {
    const modules = await getModules();
    const bySlug = new Map(modules.map((m) => [m.slug, m]));
    const m0 = routeEntry(modules, bySlug.get("00-welcome")!);
    expect(m0?.entry.path).toBe(M0[0]);
    expect(m0?.gate).toBeNull();
    expect(routeEntry(modules, bySlug.get("01-mental-models")!)).toBeNull();
    const m2 = routeEntry(modules, bySlug.get("02-toolchain")!);
    expect(m2?.entry.path).toBe(M2_L3);
    expect(m2?.gate?.path).toBe(M0[5]);
    const m3 = routeEntry(modules, bySlug.get("03-the-loop")!);
    expect(m3?.entry.path).toBe(M3_L1);
    expect(m3?.gate?.path).toBe(M2_L3);
    const m4 = routeEntry(modules, bySlug.get("04-thread-project")!);
    expect(m4?.gate?.path).toBe(M3_L4);
  });
});

describe("routeStops — the catalog's route strip", () => {
  it("lists Module 0, then the save lesson alone, then Modules 3–7; Module 1 is absent", async () => {
    const modules = await getModules();
    const stops = routeStops(modules).map((stop) =>
      stop.kind === "module" ? stop.module.slug : `${stop.module.slug}:${stop.lesson.path}`,
    );
    expect(stops).toEqual([
      "00-welcome",
      `02-toolchain:${M2_L3}`,
      "03-the-loop",
      "04-thread-project",
      "05-operating",
      "06-after-live",
      "07-where-next",
    ]);
  });
});
