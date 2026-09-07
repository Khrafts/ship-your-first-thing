import { describe, expect, it } from "vitest";
import { getModules } from "@/lib/content";
import { computeUnlockState, gatingLesson } from "@/lib/unlock";

// The progression boundary that serves the build-first entry, tested against
// the REAL course content (the loader reads ../modules): Module 0 open to
// everyone, Module 1 + Module 2 Lessons 1–2 on demand, and the gating chain
// M0 L1 … M0 L6 → M2 L3 → M3 L1 → M3 L2 → … in flat course order.

const M0 = [
  "modules/00-welcome/01-welcome.md",
  "modules/00-welcome/02-hardware-check.md",
  "modules/00-welcome/03-cost-path-triage.md",
  "modules/00-welcome/04-account-creation.md",
  "modules/00-welcome/05-install-your-agent-app.md",
  "modules/00-welcome/06-build-your-first-thing.md",
];
const M1_FIRST = "modules/01-mental-models/01-how-the-web-works.md";
const M2_L1 = "modules/02-toolchain/01-your-ai-coding-agent.md";
const M2_L2 = "modules/02-toolchain/02-the-engine-room.md";
const M2_L3 = "modules/02-toolchain/03-the-save-system.md";
const M3_L1 = "modules/03-the-loop/01-introducing-the-loop.md";
const M3_L2 = "modules/03-the-loop/02-planning-vs-execution.md";
const M4_L0 = "modules/04-thread-project/00-the-plan.md";

describe("computeUnlockState — real course paths", () => {
  it("the real lesson paths this suite names all exist", async () => {
    const paths = new Set((await getModules()).flatMap((m) => m.lessons.map((l) => l.path)));
    for (const p of [...M0, M1_FIRST, M2_L1, M2_L2, M2_L3, M3_L1, M3_L2, M4_L0]) {
      expect(paths.has(p), p).toBe(true);
    }
  });

  it("signed out: Module 0, Module 1 and Module 2 Lessons 1–2 are readable; M2 L3 and beyond are locked", async () => {
    const state = computeUnlockState(await getModules(), new Set());
    for (const p of M0) expect(state.unlockedLessons.has(p), p).toBe(true);
    expect(state.unlockedLessons.has(M1_FIRST)).toBe(true);
    expect(state.unlockedLessons.has(M2_L1)).toBe(true);
    expect(state.unlockedLessons.has(M2_L2)).toBe(true);
    expect(state.unlockedLessons.has(M2_L3)).toBe(false);
    expect(state.unlockedLessons.has(M3_L1)).toBe(false);
    expect(state.unlockedLessons.has(M4_L0)).toBe(false);
    expect(state.unlockedModules.has("00-welcome")).toBe(true);
    expect(state.unlockedModules.has("01-mental-models")).toBe(true);
    expect(state.unlockedModules.has("03-the-loop")).toBe(false);
  });

  it("completing Module 0 (nothing else) opens M2 L3 directly", async () => {
    const modules = await getModules();
    // Five of six done: still locked.
    const almost = computeUnlockState(modules, new Set(M0.slice(0, 5)));
    expect(almost.unlockedLessons.has(M2_L3)).toBe(false);
    // All six done, Module 1 and M2 L1–L2 untouched: M2 L3 opens, M3 does not.
    const done = computeUnlockState(modules, new Set(M0));
    expect(done.unlockedLessons.has(M2_L3)).toBe(true);
    expect(done.unlockedLessons.has(M3_L1)).toBe(false);
  });

  it("completing M2 L3 opens M3 L1; M3 then unlocks one lesson at a time", async () => {
    const modules = await getModules();
    const completed = new Set([...M0, M2_L3]);
    const state = computeUnlockState(modules, completed);
    expect(state.unlockedLessons.has(M3_L1)).toBe(true);
    expect(state.unlockedModules.has("03-the-loop")).toBe(true);
    expect(state.unlockedLessons.has(M3_L2)).toBe(false);
    completed.add(M3_L1);
    expect(computeUnlockState(modules, completed).unlockedLessons.has(M3_L2)).toBe(true);
  });

  it("names the chain gate, not the flat-order neighbour", async () => {
    const modules = await getModules();
    expect(gatingLesson(modules, M2_L3)?.path).toBe(M0[5]);
    expect(gatingLesson(modules, M3_L1)?.path).toBe(M2_L3);
    expect(gatingLesson(modules, M3_L2)?.path).toBe(M3_L1);
    expect(gatingLesson(modules, M0[0])).toBeNull();
    expect(gatingLesson(modules, M0[3])).toBeNull();
    expect(gatingLesson(modules, M1_FIRST)).toBeNull();
    expect(gatingLesson(modules, M2_L1)).toBeNull();
  });

  it("never re-locks a completed lesson when an earlier one is un-completed", async () => {
    const state = computeUnlockState(await getModules(), new Set([M3_L1]));
    expect(state.unlockedLessons.has(M3_L1)).toBe(true);
    expect(state.unlockedLessons.has(M2_L3)).toBe(false);
  });
});
