// Bitmap (pixel-art) helpers.
//
// A Bitmap is rows of text where any non-space character is a filled pixel.
// These helpers measure a Bitmap and blit it to a 2D context at an integer
// scale. The measuring functions are pure (no DOM) so the engine can use them;
// the blit helper touches a CanvasRenderingContext2D and is only called by the
// renderer.

import type { Bitmap } from "./types";

/** A filled pixel is any non-space, non-empty character. */
function isFilled(ch: string): boolean {
  return ch !== " " && ch !== "";
}

/** Width of the widest row, in pixels. */
export function spriteWidth(bmp: Bitmap): number {
  let w = 0;
  for (const row of bmp) {
    if (row.length > w) w = row.length;
  }
  return w;
}

/** Height of the sprite, in pixels (number of rows). */
export function spriteHeight(bmp: Bitmap): number {
  return bmp.length;
}

/**
 * Iterate the filled pixels of a Bitmap. Calls `fn(col, row)` for each filled
 * cell. Pure — used by both the renderer (to draw) and tests.
 */
export function forEachPixel(
  bmp: Bitmap,
  fn: (col: number, row: number) => void,
): void {
  for (let row = 0; row < bmp.length; row++) {
    const line = bmp[row];
    for (let col = 0; col < line.length; col++) {
      if (isFilled(line[col])) fn(col, row);
    }
  }
}

/**
 * Blit a Bitmap onto a 2D context. Each filled pixel becomes a `scale × scale`
 * rectangle in the current fillStyle. `(x, y)` is the top-left of the sprite in
 * device pixels; `scale` is the integer pixel size. The caller sets fillStyle
 * (so theme ink is honored) before calling.
 */
export function blit(
  ctx: CanvasRenderingContext2D,
  bmp: Bitmap,
  x: number,
  y: number,
  scale: number,
): void {
  forEachPixel(bmp, (col, row) => {
    ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
  });
}
