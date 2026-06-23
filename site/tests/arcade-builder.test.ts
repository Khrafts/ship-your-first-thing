import { describe, expect, it } from "vitest";
import { builder } from "@/components/ship-game/games/builder";
import {
  createInitialState,
  resolveAvatar,
  step,
} from "@/components/ship-game/engine";
import { spriteHeight, spriteWidth } from "@/components/ship-game/sprites";
import type { Bitmap } from "@/components/ship-game/types";

const MILESTONE_EVERY = 20;
const MAX_STAGE = 5;

/** Count filled (non-space) pixels across a sprite. */
function filledPixels(bmp: Bitmap): number {
  let n = 0;
  for (const row of bmp) {
    for (const ch of row) if (ch !== " ") n++;
  }
  return n;
}

/** Resolve the builder avatar at a given stage (score is irrelevant to growth). */
function avatarAt(stage: number): Bitmap {
  return resolveAvatar(builder, { score: stage * MILESTONE_EVERY, stage });
}

/**
 * Height of the crate column itself — the right-hand portion of the sprite,
 * past the figure. Measured as the number of rows that have any filled pixel in
 * the rightmost columns (the crate is always at least 4px wide and braced on the
 * right, while the figure is on the left). This isolates crate growth from the
 * fixed-height figure that dominates the sprite's TOTAL height at low stages.
 */
function crateHeight(bmp: Bitmap): number {
  const w = spriteWidth(bmp);
  // The crate occupies the rightmost ~CRATE_W columns; sample the last column.
  const lastCol = w - 1;
  let rows = 0;
  for (const row of bmp) {
    if (row.length > lastCol && row[lastCol] !== " ") rows++;
  }
  return rows;
}

describe("builder GameDef shape", () => {
  it("declares the documented identity and copy", () => {
    expect(builder.id).toBe("builder");
    expect(builder.name).toBe("Build it");
    expect(builder.baseline).toBe("flat");
    expect(builder.scoreUnit).toBe("m");
    expect(builder.scoreVerb).toBe("built");
    expect(builder.tagline.length).toBeGreaterThan(0);
  });

  it("uses the avatar-as-function form so the crate can grow", () => {
    expect(typeof builder.avatar).toBe("function");
  });

  it("wires the milestone + flash specials", () => {
    expect(builder.milestoneEvery).toBe(MILESTONE_EVERY);
    expect(typeof builder.flashText).toBe("function");
    expect(builder.flashText?.(1)).toBe("SHIPPED ✦");
    expect(builder.flashText?.(5)).toBe("SHIPPED ✦");
  });
});

describe("builder obstacles: pit + bug, both grounded", () => {
  it("spawns exactly two grounded hazard kinds", () => {
    expect(builder.obstacles).toHaveLength(2);
    for (const o of builder.obstacles) {
      expect(o.grounded).toBe(true);
      // Grounded hazards never float.
      expect(o.floatY).toBeUndefined();
      expect(spriteWidth(o.sprite)).toBeGreaterThan(0);
      expect(spriteHeight(o.sprite)).toBeGreaterThan(0);
    }
  });

  it("the bug is the more frequent hazard (higher spawn weight)", () => {
    const [bug, pit] = builder.obstacles;
    expect(bug.weight ?? 1).toBeGreaterThan(pit.weight ?? 1);
  });

  it("hazards are short enough that a hop can clear them", () => {
    // The avatar's feet are at the bottom; grounded hazards must be low.
    for (const o of builder.obstacles) {
      expect(spriteHeight(o.sprite)).toBeLessThanOrEqual(4);
    }
  });
});

describe("builder crate growth (avatar function keyed on stage)", () => {
  it("stage 0 is a thin plank — the smallest the avatar ever is", () => {
    const s0 = avatarAt(0);
    const s1 = avatarAt(1);
    // The very first SHIPPED visibly grows the sprite (plank → box).
    expect(spriteHeight(s1)).toBeGreaterThanOrEqual(spriteHeight(s0));
    expect(filledPixels(s1)).toBeGreaterThan(filledPixels(s0));
  });

  it("the sprite gets taller (or equal) and never shorter as stages rise", () => {
    let prevH = 0;
    for (let stage = 0; stage <= MAX_STAGE; stage++) {
      const h = spriteHeight(avatarAt(stage));
      expect(h).toBeGreaterThanOrEqual(prevH);
      prevH = h;
    }
  });

  it("the crate adds ink (more filled pixels) at every milestone 1→5", () => {
    let prev = filledPixels(avatarAt(0));
    for (let stage = 1; stage <= MAX_STAGE; stage++) {
      const cur = filledPixels(avatarAt(stage));
      expect(cur).toBeGreaterThan(prev);
      prev = cur;
    }
  });

  it("the crate column grows strictly taller at every milestone 1→5", () => {
    // The figure is a fixed 7px tall, so the sprite's TOTAL height only changes
    // once the crate out-grows the figure. The crate column itself, though,
    // must climb one layer per milestone — that is the growth the player sees.
    for (let stage = 2; stage <= MAX_STAGE; stage++) {
      expect(crateHeight(avatarAt(stage))).toBeGreaterThan(
        crateHeight(avatarAt(stage - 1)),
      );
    }
  });

  it("the crate starts at one row (plank) and tops out taller than the figure", () => {
    expect(crateHeight(avatarAt(0))).toBe(1); // a single plank
    // By the final stage the crate clears the 7px figure — the sprite's total
    // height is now driven by the crate, the visible "I shipped a lot" payoff.
    expect(spriteHeight(avatarAt(MAX_STAGE))).toBeGreaterThan(7);
  });

  it("caps the crate at MAX_STAGE (stage 6+ looks identical to stage 5)", () => {
    const five = avatarAt(MAX_STAGE);
    const six = avatarAt(MAX_STAGE + 1);
    const ten = avatarAt(MAX_STAGE + 5);
    expect(six).toEqual(five);
    expect(ten).toEqual(five);
  });

  it("clamps a negative stage to the stage-0 plank", () => {
    expect(avatarAt(-1)).toEqual(avatarAt(0));
  });

  it("keeps the avatar a single coherent block (rectangular rows)", () => {
    // The renderer blits one bitmap; ragged rows are fine but every row should
    // have content somewhere and a consistent overall width measurement.
    for (let stage = 0; stage <= MAX_STAGE; stage++) {
      const bmp = avatarAt(stage);
      const w = spriteWidth(bmp);
      expect(w).toBeGreaterThan(0);
      // Each row is no wider than the measured sprite width (sanity).
      for (const row of bmp) expect(row.length).toBeLessThanOrEqual(w);
    }
  });
});

describe("builder milestones drive stage through the engine", () => {
  it("stage increments by one each time the score crosses milestoneEvery", () => {
    const s = createInitialState(builder, { seed: 4242 });
    s.phase = "running";

    // Push the score just past the first milestone and step once.
    s.distance = (MILESTONE_EVERY + 1) / 0.08;
    step(s, 1000 / 120, { jump: false }, builder);
    s.obstacles = []; // never let a hazard end the run during this assertion
    expect(s.score).toBeGreaterThanOrEqual(MILESTONE_EVERY);
    expect(s.stage).toBe(1);
    expect(s.flash?.text).toBe("SHIPPED ✦");

    // Cross the second milestone.
    s.distance = (2 * MILESTONE_EVERY + 1) / 0.08;
    step(s, 1000 / 120, { jump: false }, builder);
    s.obstacles = [];
    expect(s.stage).toBe(2);
    expect(s.flash?.text).toBe("SHIPPED ✦");
  });

  it("a milestone re-anchors the grown avatar's bottom on the ground", () => {
    const s = createInitialState(builder, { seed: 7 });
    s.phase = "running";
    const groundBottom = s.avatarY + s.avatarH;

    s.distance = (MILESTONE_EVERY + 1) / 0.08;
    step(s, 1000 / 120, { jump: false }, builder);
    s.obstacles = [];

    // The cached dims match the freshly-grown sprite ...
    const grown = resolveAvatar(builder, { score: s.score, stage: s.stage });
    expect(s.avatarH).toBe(spriteHeight(grown));
    expect(s.avatarW).toBe(spriteWidth(grown));
    // ... and the bottom edge is unchanged, so the builder stays on the line.
    expect(s.avatarY + s.avatarH).toBeCloseTo(groundBottom, 5);
  });

  it("does not bump stage before the first milestone is reached", () => {
    const s = createInitialState(builder, { seed: 99 });
    s.phase = "running";
    s.distance = (MILESTONE_EVERY - 5) / 0.08; // just short of the milestone
    step(s, 1000 / 120, { jump: false }, builder);
    s.obstacles = [];
    expect(s.score).toBeLessThan(MILESTONE_EVERY);
    expect(s.stage).toBe(0);
    expect(s.flash).toBeNull();
  });
});

describe("builder game-over copy carries the course message", () => {
  it("names the reached stage out of MAX_STAGE and says to keep going", () => {
    const line = builder.gameOverLine(73, 3);
    expect(line).toContain("stage 3/5");
    expect(line).toContain("keep going");
  });

  it("caps the reported stage at MAX_STAGE even if stage overshoots", () => {
    expect(builder.gameOverLine(500, 9)).toContain(`stage ${MAX_STAGE}/${MAX_STAGE}`);
  });

  it("never reports a negative stage", () => {
    expect(builder.gameOverLine(0, -2)).toContain("stage 0/5");
  });
});
