// Shared HUD bits every game composes: the score readout, the milestone flash,
// the idle prompt, and the game-over plate. Primitives only (no GameState) so
// any module — runner, breaker, sorter, shooter — draws a consistent chrome.
//
// Strictly value, never hue: every helper takes ThemeColors and fills with
// ink / paper / faint. Lifted out of renderer.ts so the new games reuse it.

import { drawText, textWidth, GLYPH_H } from "./text";
import type { ThemeColors } from "./types";

/** Score readout, top-right of the field. `label` is the full string (e.g. "120M"). */
export function drawScore(
  ctx: CanvasRenderingContext2D,
  label: string,
  fieldW: number,
  s: number,
  colors: ThemeColors,
): void {
  ctx.fillStyle = colors.ink;
  const text = label.toUpperCase();
  const w = textWidth(text) * s;
  drawText(ctx, text, fieldW * s - w - 4 * s, 4 * s, s);
}

/** Centered milestone flash; fades to faint in its last 250ms. */
export function drawFlash(
  ctx: CanvasRenderingContext2D,
  text: string,
  ms: number,
  fieldW: number,
  fieldH: number,
  s: number,
  colors: ThemeColors,
): void {
  ctx.fillStyle = ms < 250 ? colors.faint : colors.ink;
  const tw = textWidth(text) * s;
  drawText(ctx, text, (fieldW * s - tw) / 2, Math.round(fieldH * 0.32) * s, s);
}

/** Centered idle prompt: a bold main line and a faint sub line beneath it. */
export function drawIdlePrompt(
  ctx: CanvasRenderingContext2D,
  main: string,
  sub: string,
  fieldW: number,
  fieldH: number,
  s: number,
  colors: ThemeColors,
): void {
  const W = fieldW * s;
  ctx.fillStyle = colors.ink;
  const pw = textWidth(main) * s;
  drawText(ctx, main, (W - pw) / 2, Math.round(fieldH * 0.42) * s, s);
  ctx.fillStyle = colors.faint;
  const sw = textWidth(sub) * s;
  drawText(ctx, sub, (W - sw) / 2, Math.round(fieldH * 0.42 + 8) * s, s);
}

/** Inverted plate stamped over the field on game-over (the card carries the copy). */
export function drawOverPlate(
  ctx: CanvasRenderingContext2D,
  text: string,
  fieldW: number,
  fieldH: number,
  s: number,
  colors: ThemeColors,
): void {
  const W = fieldW * s;
  const ow = textWidth(text) * s;
  const plateW = ow + 8 * s;
  const plateH = (GLYPH_H + 6) * s;
  const px = (W - plateW) / 2;
  const py = Math.round(fieldH * 0.36) * s;
  ctx.fillStyle = colors.ink;
  ctx.fillRect(px, py, plateW, plateH);
  ctx.fillStyle = colors.paper;
  drawText(ctx, text, px + 4 * s, py + 3 * s, s);
}
