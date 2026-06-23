// Pixel font + text drawing, shared by every game module.
//
// A 5×7 monochrome font for scores / prompts / flashes. Lowercase reuses
// uppercase glyphs; the few punctuation marks we need are included. Unknown
// chars render as a blank. Extracted from renderer.ts so non-runner games
// (breaker / sorter / shooter) can label too without importing the runner.

import { blit, spriteWidth } from "./sprites";
import type { Bitmap } from "./types";

export const FONT: Record<string, Bitmap> = {
  "0": ["###", "# #", "# #", "# #", "###"],
  "1": [" # ", "## ", " # ", " # ", "###"],
  "2": ["###", "  #", "###", "#  ", "###"],
  "3": ["###", "  #", "###", "  #", "###"],
  "4": ["# #", "# #", "###", "  #", "  #"],
  "5": ["###", "#  ", "###", "  #", "###"],
  "6": ["###", "#  ", "###", "# #", "###"],
  "7": ["###", "  #", "  #", " # ", " # "],
  "8": ["###", "# #", "###", "# #", "###"],
  "9": ["###", "# #", "###", "  #", "###"],
  A: ["###", "# #", "###", "# #", "# #"],
  B: ["## ", "# #", "## ", "# #", "## "],
  C: ["###", "#  ", "#  ", "#  ", "###"],
  D: ["## ", "# #", "# #", "# #", "## "],
  E: ["###", "#  ", "## ", "#  ", "###"],
  F: ["###", "#  ", "## ", "#  ", "#  "],
  G: ["###", "#  ", "# #", "# #", "###"],
  H: ["# #", "# #", "###", "# #", "# #"],
  I: ["###", " # ", " # ", " # ", "###"],
  J: ["###", "  #", "  #", "# #", "###"],
  K: ["# #", "# #", "## ", "# #", "# #"],
  L: ["#  ", "#  ", "#  ", "#  ", "###"],
  M: ["# #", "###", "###", "# #", "# #"],
  N: ["# #", "###", "###", "###", "# #"],
  O: ["###", "# #", "# #", "# #", "###"],
  P: ["###", "# #", "###", "#  ", "#  "],
  Q: ["###", "# #", "# #", "###", "  #"],
  R: ["## ", "# #", "## ", "# #", "# #"],
  S: ["###", "#  ", "###", "  #", "###"],
  T: ["###", " # ", " # ", " # ", " # "],
  U: ["# #", "# #", "# #", "# #", "###"],
  V: ["# #", "# #", "# #", "# #", " # "],
  W: ["# #", "# #", "###", "###", "# #"],
  X: ["# #", "# #", " # ", "# #", "# #"],
  Y: ["# #", "# #", " # ", " # ", " # "],
  Z: ["###", "  #", " # ", "#  ", "###"],
  " ": ["   ", "   ", "   ", "   ", "   "],
  ".": ["  ", "  ", "  ", "  ", " #"],
  "/": ["  #", "  #", " # ", "#  ", "#  "],
  ":": [" ", "#", " ", "#", " "],
  "!": ["#", "#", "#", " ", "#"],
  "+": ["   ", " # ", "###", " # ", "   "],
  "→": ["    ", "  # ", "####", "  # ", "    "],
  "✦": ["  #  ", "# # #", " ### ", "# # #", "  #  "],
};

export const GLYPH_H = 5;
export const GLYPH_GAP = 1;

/** Total pixel width of a string in the 5×7 font at scale 1. */
export function textWidth(text: string): number {
  let w = 0;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch] ?? FONT[" "];
    w += spriteWidth(g) + GLYPH_GAP;
  }
  return Math.max(0, w - GLYPH_GAP);
}

/** Draw a string in the pixel font at logical (x, y), top-left, given pixelScale. */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  s: number,
): void {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch] ?? FONT[" "];
    blit(ctx, g, cx, y, s);
    cx += (spriteWidth(g) + GLYPH_GAP) * s;
  }
}
