import { describe, expect, it } from "vitest";
import { makeRunnerModule } from "@/components/ship-game/games/runner-module";
import builder from "@/components/ship-game/games/builder";
import type { GameInput } from "@/components/ship-game/types";

const press = (p: boolean): GameInput => ({
  primary: p,
  left: false,
  right: false,
  pointerX: null,
});

describe("runner module (builder)", () => {
  it("exposes module metadata derived from the def", () => {
    const m = makeRunnerModule(builder);
    expect(m.id).toBe("builder");
    expect(m.name).toBe("Build it");
    expect(m.highScoreId).toBe("builder");
    // builder has milestoneEvery, so it reports milestones.
    expect(m.hasMilestones(m.createState({}))).toBe(true);
  });

  it("starts idle, runs on primary, and scores over distance", () => {
    const m = makeRunnerModule(builder);
    let s = m.createState({ seed: 123 });
    expect(m.isIdle(s)).toBe(true);
    s = m.step(s, 16, press(true)); // start the round
    for (let i = 0; i < 60; i++) s = m.step(s, 16, press(false));
    expect(m.getScore(s)).toBeGreaterThan(0);
    // The round is no longer idle (running or already over after 60 steps).
    expect(m.isIdle(s)).toBe(false);
  });

  it("produces a non-empty game-over line", () => {
    const m = makeRunnerModule(builder);
    const s = m.createState({});
    expect(m.gameOverLine(s).length).toBeGreaterThan(0);
  });
});
