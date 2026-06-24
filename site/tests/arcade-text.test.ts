import { describe, expect, it } from "vitest";
import { textWidth, FONT, GLYPH_H } from "@/components/ship-game/text";

// The pixel font is shared by every game module (scores / prompts / flashes).
// These pin the measuring contract the HUD helpers rely on for centering.
describe("pixel font", () => {
  it("measures a single glyph with no trailing gap", () => {
    // "1" is 3px wide; a one-char string has no inter-glyph gap.
    expect(textWidth("1")).toBe(3);
  });

  it("adds a 1px gap between glyphs", () => {
    // "11" = 3 + 1 (gap) + 3 = 7
    expect(textWidth("11")).toBe(7);
  });

  it("is case-insensitive (uppercases internally)", () => {
    expect(textWidth("a")).toBe(textWidth("A"));
  });

  it("exposes a 5px glyph height and a digit glyph", () => {
    expect(GLYPH_H).toBe(5);
    expect(FONT["0"]).toBeTruthy();
  });
});
