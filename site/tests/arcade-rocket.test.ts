// Tests for the rocket game — "Ship it".
//
// Node-pure (Vitest node env): no DOM, no canvas, no window. We import the real
// `rocket` GameDef and drive it through the shared pure engine. Determinism is
// guaranteed by seeding the RNG (the seed lives in GameState), so every run is
// reproducible.

import { describe, expect, it } from "vitest";
import {
  createInitialState,
  resolveAvatar,
  step,
} from "@/components/ship-game/engine";
import { forEachPixel, spriteHeight, spriteWidth } from "@/components/ship-game/sprites";
import rocket from "@/components/ship-game/games/rocket";
import type { Bitmap } from "@/components/ship-game/types";

// --- helpers ----------------------------------------------------------------

/** Count filled (ink) pixels in a Bitmap. */
function countPixels(bmp: Bitmap): number {
  let n = 0;
  forEachPixel(bmp, () => {
    n += 1;
  });
  return n;
}

// --- GameDef shape ----------------------------------------------------------

describe("rocket GameDef shape", () => {
  it("is the 'rocket' / 'Ship it' game with the locked score contract", () => {
    expect(rocket.id).toBe("rocket");
    expect(rocket.name).toBe("Ship it");
    expect(rocket.scoreUnit).toBe("m");
    expect(rocket.scoreVerb).toBe("shipped");
    expect(rocket.baseline).toBe("flat");
  });

  it("has a non-empty, themed tagline", () => {
    expect(typeof rocket.tagline).toBe("string");
    expect(rocket.tagline.length).toBeGreaterThan(0);
    // The tagline should speak the ship-it-rocket feel, not be a placeholder.
    expect(rocket.tagline.toLowerCase()).toContain("rocket");
  });

  it("uses a fixed avatar Bitmap (no milestone/stage variation)", () => {
    expect(typeof rocket.avatar).not.toBe("function");
    expect(Array.isArray(rocket.avatar)).toBe(true);
  });

  it("declares no milestones (rocket has no crate/stage mechanic)", () => {
    expect(rocket.milestoneEvery).toBeUndefined();
    expect(rocket.flashText).toBeUndefined();
  });
});

// --- gameOverLine -----------------------------------------------------------

describe("rocket gameOverLine", () => {
  it("embeds the score in meters and carries the ship-crash-ship message", () => {
    const line = rocket.gameOverLine(42, 0);
    expect(line).toContain("42 m");
    expect(line).toContain("shipped");
    expect(line.toLowerCase()).toContain("crash");
    // The course-message tie: builders ship again.
    expect(line.toLowerCase()).toContain("ship again");
  });

  it("reflects whatever score it is given", () => {
    expect(rocket.gameOverLine(0, 0)).toContain("0 m");
    expect(rocket.gameOverLine(1337, 0)).toContain("1337 m");
  });
});

// --- Obstacle set: bug · error · wall ---------------------------------------

describe("rocket obstacle set", () => {
  it("has exactly three obstacle kinds (bug, error, wall), all grounded", () => {
    expect(rocket.obstacles).toHaveLength(3);
    for (const ob of rocket.obstacles) {
      expect(ob.grounded).toBe(true);
      // Grounded obstacles sit on the baseline; floatY is irrelevant/unset.
      expect(ob.floatY).toBeUndefined();
    }
  });

  it("every obstacle sprite is a valid, non-empty Bitmap", () => {
    for (const ob of rocket.obstacles) {
      expect(spriteWidth(ob.sprite)).toBeGreaterThan(0);
      expect(spriteHeight(ob.sprite)).toBeGreaterThan(0);
      expect(countPixels(ob.sprite)).toBeGreaterThan(0);
    }
  });

  it("weights the common bug heaviest and the tall wall rarest", () => {
    const [bug, error, wall] = rocket.obstacles;
    expect(bug.weight ?? 1).toBeGreaterThan(error.weight ?? 1);
    expect(error.weight ?? 1).toBeGreaterThan(wall.weight ?? 1);
  });

  it("orders obstacles short → tall (the wall is the tallest commit)", () => {
    const heights = rocket.obstacles.map((o) => spriteHeight(o.sprite));
    const tallest = Math.max(...heights);
    // The last obstacle (wall) is the tallest of the set.
    expect(heights[heights.length - 1]).toBe(tallest);
  });
});

// --- Avatar sprite reads as a rocket ----------------------------------------

describe("rocket avatar sprite", () => {
  const sprite = resolveAvatar(rocket, { score: 0, stage: 0 });

  it("is a fixed sprite that does not change with score or stage", () => {
    const early = resolveAvatar(rocket, { score: 0, stage: 0 });
    const late = resolveAvatar(rocket, { score: 9999, stage: 7 });
    expect(late).toBe(early);
  });

  it("is taller than it is wide (a standing rocket silhouette)", () => {
    expect(spriteHeight(sprite)).toBeGreaterThan(spriteWidth(sprite));
  });

  it("has a pointed nose: the top row is narrower than the body below it", () => {
    const topFill = (sprite[0].match(/[^ ]/g) ?? []).length;
    // A nose cone: exactly one lit pixel at the very top.
    expect(topFill).toBe(1);
    // ...and a wider row exists below it (the cone shoulders / hull).
    const widerBelow = sprite
      .slice(1)
      .some((r) => (r.match(/[^ ]/g) ?? []).length > topFill);
    expect(widerBelow).toBe(true);
  });

  it("has fins: a row wider than the hull above it", () => {
    // The hull middle rows are ~3 wide; the fin flare row must exceed that.
    const widths = sprite.map((r) => (r.match(/[^ ]/g) ?? []).length);
    const maxWidth = Math.max(...widths);
    const hullWidth = widths[3]; // a mid-hull row
    expect(maxWidth).toBeGreaterThan(hullWidth);
  });
});

// --- Rocket-specific behavior through the real engine -----------------------

describe("rocket behavior through the engine", () => {
  it("scores in meters and ramps as it taxis (deterministic per seed)", () => {
    const s = createInitialState(rocket, { seed: 1234 });
    expect(s.phase).toBe("idle");
    // A jump launches the round.
    step(s, 1000 / 120, { jump: true }, rocket);
    expect(s.phase).toBe("running");
    const startSpeed = s.speed;
    // Taxi a while, dodging by lifting obstacles out of the path so the round
    // survives long enough to score and ramp.
    for (let i = 0; i < 1000; i++) {
      step(s, 1000 / 120, { jump: false }, rocket);
      s.obstacles.forEach((o) => (o.y = -100));
      if (s.phase === "over") s.phase = "running";
    }
    expect(s.score).toBeGreaterThan(0);
    expect(s.speed).toBeGreaterThan(startSpeed);
    // No milestone mechanic: stage never advances.
    expect(s.stage).toBe(0);
    expect(s.flash).toBeNull();
  });

  it("never advances a milestone stage no matter how far it ships", () => {
    const a = createInitialState(rocket, { seed: 7 });
    const b = createInitialState(rocket, { seed: 7 });
    step(a, 1000 / 120, { jump: true }, rocket);
    step(b, 1000 / 120, { jump: true }, rocket);
    // Same seed ⇒ identical obstacle timeline (reproducibility).
    for (let i = 0; i < 500; i++) {
      step(a, 1000 / 120, { jump: false }, rocket);
      step(b, 1000 / 120, { jump: false }, rocket);
      a.obstacles.forEach((o) => (o.y = -100));
      b.obstacles.forEach((o) => (o.y = -100));
    }
    expect(a.stage).toBe(0);
    expect(b.stage).toBe(0);
    expect(a.obstacles.map((o) => Math.round(o.x))).toEqual(
      b.obstacles.map((o) => Math.round(o.x)),
    );
  });

  it("a jump lifts the rocket clear above the tallest obstacle's top", () => {
    // Behavioral guarantee for "hop over": the jump arc must rise high enough
    // that the avatar's BOTTOM clears the top of the tallest grounded obstacle
    // (the wall). We measure the apex of a real jump and compare it to where a
    // grounded wall's top sits — no fragile horizontal timing involved.
    const s = createInitialState(rocket, { seed: 3 });
    s.phase = "running";
    s.onGround = true;
    s.vy = 0;
    s.avatarY = s.baselineY - s.avatarH;
    s.obstacles = [];

    const wall = rocket.obstacles[2];
    const wallH = spriteHeight(wall.sprite);
    const wallTop = s.baselineY - wallH; // y of the wall's top edge

    // Launch and follow the arc to its apex (avatarY is minimal at the top).
    step(s, 1000 / 120, { jump: true }, rocket);
    let apexY = s.avatarY;
    for (let i = 0; i < 200; i++) {
      step(s, 1000 / 120, { jump: false }, rocket);
      s.obstacles = []; // isolate the physics; ignore spawns for this check
      if (s.avatarY < apexY) apexY = s.avatarY;
      if (s.onGround && i > 4) break; // landed again
    }
    const avatarBottomAtApex = apexY + s.avatarH;
    // Cleared: the avatar's lowest point at apex is above the wall's top.
    expect(avatarBottomAtApex).toBeLessThan(wallTop);
  });

  it("a well-timed hop survives a single approaching obstacle", () => {
    // Sweep the launch moment to confirm SOME timing window clears a grounded
    // wall as it scrolls past — i.e. the hop is physically possible (the engine
    // guarantees a clearable gap, this confirms the rocket can take it).
    function attempt(launchAtX: number): boolean {
      const s = createInitialState(rocket, { seed: 3 });
      s.phase = "running";
      s.onGround = true;
      s.vy = 0;
      s.avatarY = s.baselineY - s.avatarH;
      const wall = rocket.obstacles[2];
      const w = spriteWidth(wall.sprite);
      const h = spriteHeight(wall.sprite);
      s.obstacles = [
        { typeIndex: 2, x: s.width - 1, w, h, y: s.baselineY - h },
      ];
      let jumped = false;
      for (let i = 0; i < 400; i++) {
        const ob = s.obstacles.find((o) => o.typeIndex === 2);
        const jump = !jumped && ob !== undefined && ob.x <= launchAtX;
        if (jump) jumped = true;
        const next = step(s, 1000 / 120, { jump }, rocket);
        s.obstacles = s.obstacles.filter((o) => o.typeIndex === 2);
        if (next.phase === "over") return false;
        if (s.obstacles.every((o) => o.x + o.w < s.avatarX)) return true;
      }
      return false;
    }
    // Try a range of launch points (in logical px ahead of the avatar); at
    // least one must clear the wall.
    const fieldWidth = createInitialState(rocket, { seed: 3 }).width;
    let anyCleared = false;
    for (let lx = fieldWidth; lx >= 40; lx -= 4) {
      if (attempt(lx)) {
        anyCleared = true;
        break;
      }
    }
    expect(anyCleared).toBe(true);
  });

  it("running flat into a grounded obstacle crashes (game over)", () => {
    const s = createInitialState(rocket, { seed: 3 });
    s.phase = "running";
    s.onGround = true;
    s.vy = 0;
    s.avatarY = s.baselineY - s.avatarH;
    const bug = rocket.obstacles[0];
    const w = spriteWidth(bug.sprite);
    const h = spriteHeight(bug.sprite);
    // Plant the bug squarely on the avatar's column at ground level.
    s.obstacles = [
      {
        typeIndex: 0,
        x: s.avatarX,
        w,
        h,
        y: s.baselineY - h,
      },
    ];
    step(s, 1000 / 120, { jump: false }, rocket);
    expect(s.phase).toBe("over");
  });
});
