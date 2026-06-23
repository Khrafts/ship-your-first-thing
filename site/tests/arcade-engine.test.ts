import { describe, expect, it } from "vitest";
import {
  aabbOverlap,
  createInitialState,
  resolveAvatar,
  startRound,
  step,
} from "@/components/ship-game/engine";
import { spriteHeight, spriteWidth } from "@/components/ship-game/sprites";
import type { GameDef, GameState } from "@/components/ship-game/types";

// A minimal, fully-controlled GameDef so tests don't depend on the real games'
// content. One grounded obstacle, no milestones.
const TEST_DEF: GameDef = {
  id: "rocket",
  name: "Test",
  tagline: "t",
  avatar: ["##", "##", "##"],
  baseline: "flat",
  scoreUnit: "m",
  scoreVerb: "shipped",
  obstacles: [{ sprite: ["####", "####", "####", "####"], grounded: true }],
  gameOverLine: (n) => `over ${n}`,
};

// A def with a milestone so we can exercise stage + flash + avatar growth.
const MILESTONE_DEF: GameDef = {
  id: "builder",
  name: "Build",
  tagline: "t",
  avatar: (ctx) => {
    // Taller per stage so we can assert the bottom stays anchored.
    const h = 3 + ctx.stage;
    return Array.from({ length: h }, () => "##");
  },
  baseline: "flat",
  scoreUnit: "m",
  scoreVerb: "built",
  milestoneEvery: 5,
  flashText: () => "SHIPPED",
  obstacles: [{ sprite: ["#"], grounded: false, floatY: 60 }],
  gameOverLine: (_n, s) => `stage ${s}`,
};

/** Run `step` repeatedly with no jump, fixed dt, until predicate or cap. */
function run(
  state: GameState,
  def: GameDef,
  steps: number,
  jumpOn: (i: number) => boolean = () => false,
  dt = 1000 / 120,
): GameState {
  for (let i = 0; i < steps; i++) {
    step(state, dt, { jump: jumpOn(i) }, def);
  }
  return state;
}

describe("AABB collision", () => {
  it("reports overlap when boxes intersect", () => {
    expect(
      aabbOverlap(
        { x: 0, y: 0, w: 10, h: 10 },
        { x: 5, y: 5, w: 10, h: 10 },
      ),
    ).toBe(true);
  });

  it("reports no overlap when boxes are clear (touching edges don't count)", () => {
    expect(
      aabbOverlap(
        { x: 0, y: 0, w: 10, h: 10 },
        { x: 10, y: 0, w: 10, h: 10 },
      ),
    ).toBe(false);
    expect(
      aabbOverlap(
        { x: 0, y: 0, w: 10, h: 10 },
        { x: 20, y: 20, w: 5, h: 5 },
      ),
    ).toBe(false);
  });
});

describe("state machine: idle → running → over", () => {
  it("starts idle and does not move obstacles or score until a jump", () => {
    const s = createInitialState(TEST_DEF, { seed: 12345 });
    expect(s.phase).toBe("idle");
    run(s, TEST_DEF, 200); // no jump input
    expect(s.phase).toBe("idle");
    expect(s.score).toBe(0);
    expect(s.obstacles.length).toBe(0);
  });

  it("a jump in idle transitions to running", () => {
    const s = createInitialState(TEST_DEF, { seed: 12345 });
    step(s, 1000 / 120, { jump: true }, TEST_DEF);
    expect(s.phase).toBe("running");
    expect(s.onGround).toBe(false); // the starting jump also hops
  });

  it("collision with an overlapping obstacle transitions running → over", () => {
    const s = createInitialState(TEST_DEF, { seed: 7 });
    // Put the round in a controlled grounded state (no starting-hop motion).
    s.phase = "running";
    s.onGround = true;
    s.vy = 0;
    s.avatarY = s.baselineY - s.avatarH;
    // Plant an obstacle squarely on the avatar's column, on the ground. One
    // step (no jump) must detect the AABB overlap and end the round.
    s.obstacles = [
      {
        typeIndex: 0,
        x: s.avatarX,
        y: s.baselineY - s.avatarH,
        w: s.avatarW,
        h: s.avatarH,
      },
    ];
    step(s, 1000 / 120, { jump: false }, TEST_DEF);
    expect(s.phase).toBe("over");
  });

  it("a clear obstacle (well below the avatar's path) does not end the round", () => {
    const s = createInitialState(TEST_DEF, { seed: 7 });
    s.phase = "running";
    s.onGround = true;
    s.avatarY = s.baselineY - s.avatarH;
    // Obstacle far to the right of the avatar — no overlap.
    s.obstacles = [
      {
        typeIndex: 0,
        x: s.avatarX + 80,
        y: s.baselineY - s.avatarH,
        w: s.avatarW,
        h: s.avatarH,
      },
    ];
    step(s, 1000 / 120, { jump: false }, TEST_DEF);
    expect(s.phase).toBe("running");
  });

  it("a jump in over restarts a fresh running round", () => {
    const s = createInitialState(TEST_DEF, { seed: 7 });
    s.phase = "over";
    s.score = 99;
    step(s, 1000 / 120, { jump: true }, TEST_DEF);
    expect(s.phase).toBe("running");
    expect(s.score).toBe(0);
  });
});

describe("scoring increases with time and speed", () => {
  it("score grows monotonically while running", () => {
    const s = createInitialState(TEST_DEF, { seed: 999 });
    step(s, 1000 / 120, { jump: true }, TEST_DEF);
    const early = (() => {
      run(s, TEST_DEF, 60);
      return s.score;
    })();
    run(s, TEST_DEF, 240);
    const later = s.score;
    expect(later).toBeGreaterThan(early);
    expect(early).toBeGreaterThan(0);
  });

  it("more elapsed time yields a higher score (same seed)", () => {
    const short = createInitialState(TEST_DEF, { seed: 42 });
    step(short, 1000 / 120, { jump: true }, TEST_DEF);
    run(short, TEST_DEF, 50);

    const long = createInitialState(TEST_DEF, { seed: 42 });
    step(long, 1000 / 120, { jump: true }, TEST_DEF);
    run(long, TEST_DEF, 300);

    expect(long.score).toBeGreaterThan(short.score);
  });
});

describe("difficulty ramp: speed grows with score", () => {
  it("speed increases as the score rises", () => {
    const s = createInitialState(TEST_DEF, { seed: 3 });
    step(s, 1000 / 120, { jump: true }, TEST_DEF);
    const startSpeed = s.speed;
    // Avoid collisions by clearing obstacles each step (we only test ramp here).
    for (let i = 0; i < 1200; i++) {
      step(s, 1000 / 120, { jump: false }, TEST_DEF);
      s.obstacles = [];
      if (s.phase === "over") s.phase = "running";
    }
    expect(s.score).toBeGreaterThan(0);
    expect(s.speed).toBeGreaterThan(startSpeed);
  });

  it("speed is clamped to a maximum", () => {
    const s = createInitialState(TEST_DEF, { seed: 3 });
    s.phase = "running";
    s.score = 100000;
    s.distance = 100000 / 0.08;
    step(s, 1000 / 120, { jump: false }, TEST_DEF);
    s.obstacles = [];
    expect(s.speed).toBeLessThanOrEqual(320);
  });
});

describe("physics: jump + gravity + ground clamp", () => {
  it("a jump leaves the ground then returns to it", () => {
    const s = createInitialState(TEST_DEF, { seed: 1 });
    step(s, 1000 / 120, { jump: true }, TEST_DEF); // start + hop
    const groundY = s.baselineY - s.avatarH;
    // Mid-air shortly after launch.
    run(s, TEST_DEF, 8, () => false, 1000 / 120);
    expect(s.avatarY).toBeLessThan(groundY);
    // Clear obstacles so we don't game-over mid-flight; let gravity land it.
    for (let i = 0; i < 120; i++) {
      step(s, 1000 / 120, { jump: false }, TEST_DEF);
      s.obstacles = [];
      if (s.phase === "over") s.phase = "running";
    }
    expect(s.onGround).toBe(true);
    expect(Math.round(s.avatarY)).toBe(groundY);
  });

  it("a jump only fires from the ground (no double-jump)", () => {
    const s = createInitialState(TEST_DEF, { seed: 1 });
    step(s, 1000 / 120, { jump: true }, TEST_DEF); // start + hop
    run(s, TEST_DEF, 4);
    const vyMidAir = s.vy;
    // A second jump while airborne must not re-impulse upward.
    step(s, 1000 / 120, { jump: true }, TEST_DEF);
    s.obstacles = [];
    expect(s.vy).toBeGreaterThan(vyMidAir - 1); // not a fresh -430 impulse
  });
});

describe("obstacle spawning is deterministic for a seed", () => {
  it("two runs with the same seed produce identical obstacle timelines", () => {
    const a = createInitialState(TEST_DEF, { seed: 555 });
    const b = createInitialState(TEST_DEF, { seed: 555 });
    step(a, 1000 / 120, { jump: true }, TEST_DEF);
    step(b, 1000 / 120, { jump: true }, TEST_DEF);
    for (let i = 0; i < 400; i++) {
      step(a, 1000 / 120, { jump: false }, TEST_DEF);
      step(b, 1000 / 120, { jump: false }, TEST_DEF);
      // Don't let collisions stop one but not the other.
      a.obstacles.forEach((o) => (o.y = -100));
      b.obstacles.forEach((o) => (o.y = -100));
    }
    expect(a.obstacles.length).toBe(b.obstacles.length);
    expect(a.obstacles.map((o) => Math.round(o.x))).toEqual(
      b.obstacles.map((o) => Math.round(o.x)),
    );
  });

  it("spawns at least one obstacle within a few seconds", () => {
    const s = createInitialState(TEST_DEF, { seed: 8 });
    step(s, 1000 / 120, { jump: true }, TEST_DEF);
    let sawObstacle = false;
    for (let i = 0; i < 600; i++) {
      step(s, 1000 / 120, { jump: false }, TEST_DEF);
      s.obstacles.forEach((o) => (o.y = -100)); // dodge so the round survives
      if (s.obstacles.length > 0) sawObstacle = true;
    }
    expect(sawObstacle).toBe(true);
  });
});

describe("milestones: stage, flash, avatar growth", () => {
  it("bumps stage and fires a flash at the milestone score", () => {
    const s = createInitialState(MILESTONE_DEF, { seed: 2 });
    s.phase = "running";
    // Force the score across the first milestone (5).
    s.distance = 6 / 0.08;
    step(s, 1000 / 120, { jump: false }, MILESTONE_DEF);
    s.obstacles = [];
    expect(s.score).toBeGreaterThanOrEqual(5);
    expect(s.stage).toBe(1);
    expect(s.flash?.text).toBe("SHIPPED");
  });

  it("grows the avatar at a milestone while keeping its bottom on the ground", () => {
    const s = createInitialState(MILESTONE_DEF, { seed: 2 });
    s.phase = "running";
    const groundBottom = s.avatarY + s.avatarH;
    s.distance = 6 / 0.08;
    step(s, 1000 / 120, { jump: false }, MILESTONE_DEF);
    s.obstacles = [];
    // Stage-1 avatar is one row taller; the bottom must be unchanged.
    expect(s.avatarH).toBe(spriteHeight(resolveAvatar(MILESTONE_DEF, {
      score: s.score,
      stage: s.stage,
    })));
    expect(s.avatarY + s.avatarH).toBeCloseTo(groundBottom, 5);
  });
});

describe("createInitialState / startRound", () => {
  it("places the avatar bottom on the baseline", () => {
    const s = createInitialState(TEST_DEF, { seed: 1 });
    expect(s.avatarY + s.avatarH).toBe(s.baselineY);
    expect(s.avatarW).toBe(spriteWidth(TEST_DEF.avatar as readonly string[]));
  });

  it("startRound yields a running, zeroed state with a fresh seed lineage", () => {
    const s = createInitialState(TEST_DEF, { seed: 77 });
    s.score = 50;
    s.phase = "over";
    const r = startRound(s, TEST_DEF);
    expect(r.phase).toBe("running");
    expect(r.score).toBe(0);
    expect(r.obstacles.length).toBe(0);
  });

  it("coerces a zero seed to a nonzero RNG state", () => {
    const s = createInitialState(TEST_DEF, { seed: 0 });
    expect(s.rng).not.toBe(0);
  });
});
