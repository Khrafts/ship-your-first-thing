// boat — "Set sail" — GameDef shape + special-behavior coverage.
//
// Node-pure: imports only the game def, the pure engine, and pure sprite
// helpers. No DOM, no canvas, no Math.random()/Date.now() in the assertions —
// the engine carries its seed, so every run here is reproducible.

import { describe, expect, it } from "vitest";
import boat from "@/components/ship-game/games/boat";
import {
  createInitialState,
  resolveAvatar,
  step,
} from "@/components/ship-game/engine";
import { forEachPixel, spriteHeight, spriteWidth } from "@/components/ship-game/sprites";

/** Count filled pixels in a Bitmap. */
function pixelCount(bmp: readonly string[]): number {
  let n = 0;
  forEachPixel(bmp, () => n++);
  return n;
}

describe("boat GameDef: identity & themed copy", () => {
  it("has the boat id and switcher name", () => {
    expect(boat.id).toBe("boat");
    expect(boat.name).toBe("Set sail");
  });

  it("scores in nautical miles with the 'sailed' verb", () => {
    expect(boat.scoreUnit).toBe("nm");
    expect(boat.scoreVerb).toBe("sailed");
  });

  it("carries a short, non-empty tagline", () => {
    expect(typeof boat.tagline).toBe("string");
    expect(boat.tagline.length).toBeGreaterThan(0);
    expect(boat.tagline.length).toBeLessThan(60);
  });

  it("game-over line ties the score to the course's first-draft message", () => {
    const line = boat.gameOverLine(42, 0);
    expect(line).toContain("42");
    expect(line).toContain("nm");
    expect(line.toLowerCase()).toContain("sailed");
    expect(line.toLowerCase()).toContain("first draft");
    // The number must be the actual score, not a hardcoded value.
    expect(boat.gameOverLine(7, 0)).toContain("7");
    expect(boat.gameOverLine(7, 0)).not.toContain("42");
  });

  it("does not reference any AI/assistant brand in its copy", () => {
    const blob = [boat.name, boat.tagline, boat.gameOverLine(1, 0)]
      .join(" ")
      .toLowerCase();
    for (const banned of ["claude", "anthropic", "ai ", "openai", "gpt"]) {
      expect(blob).not.toContain(banned);
    }
  });
});

describe("boat special mechanic: the wave baseline", () => {
  it("uses the animated wave baseline (not a flat ground line)", () => {
    expect(boat.baseline).toBe("wave");
  });
});

describe("boat avatar: a folded paper boat", () => {
  it("exposes a fixed Bitmap avatar (not a stage-varying function)", () => {
    expect(typeof boat.avatar).not.toBe("function");
  });

  it("resolves to the same sprite regardless of score/stage", () => {
    const a = resolveAvatar(boat, { score: 0, stage: 0 });
    const b = resolveAvatar(boat, { score: 999, stage: 4 });
    expect(a).toBe(b);
  });

  it("the boat sprite reads as a small, wider-than-tall craft", () => {
    const sprite = resolveAvatar(boat, { score: 0, stage: 0 });
    const w = spriteWidth(sprite);
    const h = spriteHeight(sprite);
    // Boats are wider than they are tall.
    expect(w).toBeGreaterThan(h);
    // Small enough to read at the low-res backbuffer, big enough for a fair hitbox.
    expect(w).toBeGreaterThanOrEqual(8);
    expect(w).toBeLessThanOrEqual(20);
    expect(h).toBeGreaterThanOrEqual(5);
    expect(h).toBeLessThanOrEqual(12);
  });

  it("is a solid silhouette (densely filled), so it reads in pure black/white", () => {
    const sprite = resolveAvatar(boat, { score: 0, stage: 0 });
    const area = spriteWidth(sprite) * spriteHeight(sprite);
    const filled = pixelCount(sprite);
    // A solid origami silhouette fills a healthy fraction of its bounding box —
    // not a sparse outline that would vanish at small size.
    expect(filled / area).toBeGreaterThan(0.5);
  });

  it("has two upturned points (top row narrower than the deck row)", () => {
    const sprite = resolveAvatar(boat, { score: 0, stage: 0 }) as readonly string[];
    const filledInRow = (row: string) =>
      [...row].filter((c) => c !== " " && c !== "").length;
    const topFilled = filledInRow(sprite[0]);
    const maxFilled = Math.max(...sprite.map(filledInRow));
    // The folded ends mean the top row is two thin points, far less filled than
    // the boat's widest (deck) row.
    expect(topFilled).toBeLessThan(maxFilled);
    expect(topFilled).toBeGreaterThanOrEqual(2);
  });
});

describe("boat obstacles: rock / buoy / big wave", () => {
  it("spawns exactly three obstacle kinds, all grounded", () => {
    expect(boat.obstacles).toHaveLength(3);
    for (const o of boat.obstacles) {
      expect(o.grounded).toBe(true);
      expect(o.floatY).toBeUndefined();
    }
  });

  it("orders them rock → buoy → big wave by increasing height", () => {
    const [rock, buoy, bigWave] = boat.obstacles.map((o) => o.sprite);
    expect(spriteHeight(rock)).toBeLessThan(spriteHeight(buoy));
    expect(spriteHeight(buoy)).toBeLessThan(spriteHeight(bigWave));
  });

  it("the big wave is the widest obstacle (a wall of water)", () => {
    const widths = boat.obstacles.map((o) => spriteWidth(o.sprite));
    const bigWaveWidth = widths[2];
    expect(bigWaveWidth).toBe(Math.max(...widths));
  });

  it("weights favor the small rock and make the big wave the rarest", () => {
    const [rock, buoy, bigWave] = boat.obstacles.map((o) => o.weight ?? 1);
    expect(rock).toBeGreaterThan(buoy);
    expect(buoy).toBeGreaterThan(bigWave);
  });

  it("every obstacle clears the avatar's max jump height (all are hoppable)", () => {
    // Engine: JUMP_VELOCITY = -430, GRAVITY = 1400 → peak ≈ 430^2 / (2*1400).
    const peak = (430 * 430) / (2 * 1400); // ~66 logical px
    for (const o of boat.obstacles) {
      expect(spriteHeight(o.sprite)).toBeLessThan(peak);
    }
  });

  it("has no milestone machinery (calmer game, no crate growth / flash)", () => {
    expect(boat.milestoneEvery).toBeUndefined();
    expect(boat.flashText).toBeUndefined();
  });
});

describe("boat runs deterministically under the pure engine", () => {
  it("starts idle, then a jump begins a running round that scores in nm", () => {
    const s = createInitialState(boat, { seed: 4242 });
    expect(s.id).toBe("boat");
    expect(s.phase).toBe("idle");

    // A jump from idle starts the round.
    step(s, 1000 / 120, { jump: true }, boat);
    expect(s.phase).toBe("running");

    // Dodge any spawned obstacles so the round survives, and accrue score.
    for (let i = 0; i < 240; i++) {
      step(s, 1000 / 120, { jump: false }, boat);
      s.obstacles.forEach((o) => (o.y = -100));
    }
    expect(s.score).toBeGreaterThan(0);
  });

  it("two runs with the same seed produce identical obstacle timelines", () => {
    const a = createInitialState(boat, { seed: 1357 });
    const b = createInitialState(boat, { seed: 1357 });
    step(a, 1000 / 120, { jump: true }, boat);
    step(b, 1000 / 120, { jump: true }, boat);
    for (let i = 0; i < 400; i++) {
      step(a, 1000 / 120, { jump: false }, boat);
      step(b, 1000 / 120, { jump: false }, boat);
      a.obstacles.forEach((o) => (o.y = -100)); // survive
      b.obstacles.forEach((o) => (o.y = -100));
    }
    expect(a.obstacles.map((o) => o.typeIndex)).toEqual(
      b.obstacles.map((o) => o.typeIndex),
    );
    expect(a.obstacles.map((o) => Math.round(o.x))).toEqual(
      b.obstacles.map((o) => Math.round(o.x)),
    );
  });

  it("spawns only valid obstacle indices for this game", () => {
    const s = createInitialState(boat, { seed: 31 });
    step(s, 1000 / 120, { jump: true }, boat);
    let saw = false;
    for (let i = 0; i < 1200; i++) {
      step(s, 1000 / 120, { jump: false }, boat);
      s.obstacles.forEach((o) => {
        expect(o.typeIndex).toBeGreaterThanOrEqual(0);
        expect(o.typeIndex).toBeLessThan(boat.obstacles.length);
        saw = true;
        o.y = -100; // survive
      });
    }
    expect(saw).toBe(true);
  });
});
