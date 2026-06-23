import { describe, expect, it } from "vitest";
import shooter, { type ShooterState } from "@/components/ship-game/games/shooter";
import type { GameInput } from "@/components/ship-game/types";

const NONE: GameInput = { primary: false, left: false, right: false, pointerX: null };
const FIRE: GameInput = { ...NONE, primary: true };

describe("shooter", () => {
  it("starts idle with a formation and begins on primary", () => {
    let s = shooter.createState({ seed: 2 });
    expect(shooter.isIdle(s)).toBe(true);
    expect(s.invaders.some((i) => i.alive)).toBe(true);
    s = shooter.step(s, 16, FIRE);
    expect(shooter.isIdle(s)).toBe(false);
  });
  it("fires at most one bullet in flight", () => {
    let s = shooter.createState({ seed: 2 });
    s = shooter.step(s, 16, FIRE);
    const had = s.bullet?.live === true;
    s = shooter.step(s, 16, FIRE);
    expect(had).toBe(true);
    expect(s.bullet?.live).toBe(true);
  });
  it("destroys an invader and scores on a bullet hit", () => {
    let s = shooter.createState({ seed: 2 });
    s = shooter.step(s, 16, FIRE);
    const inv = s.invaders.find((i) => i.alive)!;
    s.bullet = { x: inv.x + inv.w / 2, y: inv.y + inv.h, live: true };
    const before = shooter.getScore(s);
    s = shooter.step(s, 16, NONE);
    expect(shooter.getScore(s)).toBe(before + 1);
  });
  it("ends the round when an invader reaches the ship row", () => {
    let s = shooter.createState({ seed: 2 });
    s = shooter.step(s, 16, FIRE);
    s.invaders = s.invaders.map((i) => ({ ...i, y: s.height }));
    s = shooter.step(s, 16, NONE);
    expect(shooter.isOver(s)).toBe(true);
  });
  it("is deterministic for a fixed seed", () => {
    const drive = () => { let s = shooter.step(shooter.createState({ seed: 4 }), 16, FIRE); for (let i=0;i<30;i++) s = shooter.step(s,16,NONE); return s; };
    expect(drive().invaders.filter(i=>i.alive).length).toBe(drive().invaders.filter(i=>i.alive).length);
  });
});
