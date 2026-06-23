import { describe, expect, it } from "vitest";
import sorter, { type SorterState } from "@/components/ship-game/games/sorter";
import type { GameInput } from "@/components/ship-game/types";

const NONE: GameInput = { primary: false, left: false, right: false, pointerX: null };
const PRESS: GameInput = { ...NONE, primary: true };

describe("sorter", () => {
  it("starts idle and begins on primary", () => {
    let s = sorter.createState({ seed: 3 });
    expect(sorter.isIdle(s)).toBe(true);
    s = sorter.step(s, 16, PRESS);
    expect(sorter.isIdle(s)).toBe(false);
  });
  it("scores when the tray catches a good item", () => {
    let s = sorter.createState({ seed: 3 });
    s = sorter.step(s, 16, PRESS);
    s.items = [{ x: s.trayX + s.trayW / 2, y: s.height - 12, vy: 60, good: true }];
    const before = sorter.getScore(s);
    s = sorter.step(s, 16, NONE);
    expect(sorter.getScore(s)).toBe(before + 1);
    expect(sorter.isOver(s)).toBe(false);
  });
  it("ends the round when the tray catches a bad item", () => {
    let s = sorter.createState({ seed: 3 });
    s = sorter.step(s, 16, PRESS);
    s.items = [{ x: s.trayX + s.trayW / 2, y: s.height - 12, vy: 60, good: false }];
    s = sorter.step(s, 16, NONE);
    expect(sorter.isOver(s)).toBe(true);
  });
  it("does NOT end when a bad item falls past uncaught", () => {
    let s = sorter.createState({ seed: 3 });
    s = sorter.step(s, 16, PRESS);
    s.trayX = 0; s.items = [{ x: s.width - 2, y: s.height + 6, vy: 60, good: false }];
    s = sorter.step(s, 16, NONE);
    expect(sorter.isOver(s)).toBe(false);
  });
  it("is deterministic for a fixed seed", () => {
    const drive = (n: number) => { let s = sorter.step(sorter.createState({ seed: 5 }), 16, PRESS); for (let i=0;i<n;i++) s = sorter.step(s,16,NONE); return s; };
    expect(drive(50).items.length).toBe(drive(50).items.length);
  });
});
