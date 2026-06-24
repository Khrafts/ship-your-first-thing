import { describe, expect, it } from "vitest";
import breaker, { type BreakerState } from "@/components/ship-game/games/breaker";
import type { GameInput } from "@/components/ship-game/types";

const NONE: GameInput = { primary: false, left: false, right: false, pointerX: null };
const PRESS: GameInput = { ...NONE, primary: true };
const run = (s: BreakerState, n: number, input: GameInput = NONE) => {
  for (let i = 0; i < n; i++) s = breaker.step(s, 16, input);
  return s;
};

describe("breaker", () => {
  it("starts idle with a wall of bricks and a dead ball", () => {
    const s = breaker.createState({ seed: 7 });
    expect(breaker.isIdle(s)).toBe(true);
    expect(s.bricks.some((b) => b.alive)).toBe(true);
    expect(s.ball.live).toBe(false);
  });
  it("launches the ball on primary", () => {
    let s = breaker.createState({ seed: 7 });
    s = breaker.step(s, 16, PRESS);
    expect(s.ball.live).toBe(true);
    expect(breaker.isIdle(s)).toBe(false);
  });
  it("moves the paddle toward pointerX", () => {
    let s = breaker.createState({ seed: 7 });
    const startX = s.paddleX;
    s = run(s, 20, { ...PRESS, pointerX: s.width });
    expect(s.paddleX).toBeGreaterThan(startX);
  });
  it("ends the round when the ball falls below the paddle", () => {
    let s = breaker.createState({ seed: 7 });
    s = breaker.step(s, 16, PRESS);
    s.ball = { ...s.ball, x: s.width / 2, y: s.height + 5, vx: 0, vy: 200, live: true };
    s = breaker.step(s, 16, NONE);
    expect(breaker.isOver(s)).toBe(true);
  });
  it("scores and removes a brick on contact", () => {
    let s = breaker.createState({ seed: 7 });
    s = breaker.step(s, 16, PRESS);
    const brick = s.bricks.find((b) => b.alive)!;
    s.ball = { ...s.ball, x: brick.x + brick.w / 2, y: brick.y + brick.h - 1, vx: 0, vy: -120, live: true };
    const before = breaker.getScore(s);
    s = breaker.step(s, 16, NONE);
    expect(breaker.getScore(s)).toBe(before + 1);
  });
  it("is deterministic for a fixed seed", () => {
    const a = run(breaker.step(breaker.createState({ seed: 9 }), 16, PRESS), 40);
    const b = run(breaker.step(breaker.createState({ seed: 9 }), 16, PRESS), 40);
    expect(breaker.getScore(a)).toBe(breaker.getScore(b));
    expect(a.ball.x).toBeCloseTo(b.ball.x);
  });
});
