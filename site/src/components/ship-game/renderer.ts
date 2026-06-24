// The runner renderer. Draws a runner GameState to a 2D context in strict
// monochrome. (The new games — breaker / sorter / shooter — bring their own
// render(); this file is the endless-runner's, used via runner-module.ts.)
//
// Colors are READ from the canvas element's computed style (--ink / --paper /
// --ink-faint), so the game flips with the site's light/dark theme toggle with
// zero `dark:` utilities. The backbuffer is the LOGICAL field (low-res); we set
// the canvas's backing store to logicalSize × scale and draw filled rects at
// integer scale, then CSS `image-rendering: pixelated` keeps the pixels crisp.

import { drawScore, drawFlash, drawIdlePrompt, drawOverPlate } from "./hud";
import { blit, spriteHeight } from "./sprites";
import { FONT, GLYPH_H, textWidth } from "./text";
import type {
  Bitmap,
  GameDef,
  GameState,
  RenderOptions,
  ThemeColors,
} from "./types";

// Re-export the shared types so existing importers (use-ship-game.ts) are
// unaffected by their move into types.ts.
export type { RenderOptions, ThemeColors };

const FALLBACK: ThemeColors = {
  ink: "#09090b",
  paper: "#ffffff",
  faint: "#71717a",
};

/**
 * Read the monochrome tokens off an element's computed style. Falls back to the
 * light-theme constants if the variables aren't resolvable (e.g. before CSS
 * loads). NEVER hardcodes #000/#fff into the draw path — that is why this exists.
 */
export function readThemeColors(el: HTMLElement): ThemeColors {
  if (typeof window === "undefined") return FALLBACK;
  const cs = window.getComputedStyle(el);
  const ink = cs.getPropertyValue("--ink").trim();
  const paper = cs.getPropertyValue("--paper").trim();
  const faint = cs.getPropertyValue("--ink-faint").trim();
  return {
    ink: ink || FALLBACK.ink,
    paper: paper || FALLBACK.paper,
    faint: faint || FALLBACK.faint,
  };
}

/** Baseline y for the wave variant at a given column + time. */
function waveOffset(col: number, elapsedMs: number): number {
  const phase = elapsedMs / 360;
  return Math.round(Math.sin(col / 14 + phase) * 2);
}

/**
 * Render `state` to the context. Assumes the canvas backing store is exactly
 * `state.width * scale` × `state.height * scale` device pixels and that the
 * context is NOT pre-scaled (we multiply coordinates by `scale` ourselves so
 * every rect lands on an integer device pixel — the crisp-pixel guarantee).
 */
export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  def: GameDef,
  opts: RenderOptions,
): void {
  const { scale: s, colors } = opts;
  const W = state.width * s;
  const H = state.height * s;

  // Paper background.
  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, W, H);

  // --- Baseline ---
  ctx.fillStyle = colors.ink;
  if (def.baseline === "wave") {
    for (let col = 0; col < state.width; col++) {
      const yy = state.baselineY + waveOffset(col, state.elapsedMs);
      ctx.fillRect(col * s, yy * s, s, s);
    }
  } else {
    ctx.fillRect(0, state.baselineY * s, W, s);
  }

  // Faint ground texture: sparse dashes below the baseline that scroll with the
  // world, selling motion. Strictly value, never hue.
  ctx.fillStyle = colors.faint;
  const scroll = Math.floor(state.distance) % 12;
  for (let col = -scroll; col < state.width; col += 12) {
    if (col < 0) continue;
    const yy = state.baselineY + 4;
    ctx.fillRect(col * s, yy * s, 3 * s, s);
  }

  // --- Obstacles ---
  ctx.fillStyle = colors.ink;
  for (const ob of state.obstacles) {
    const type = def.obstacles[ob.typeIndex];
    blit(ctx, type.sprite, Math.round(ob.x) * s, Math.round(ob.y) * s, s);
  }

  // --- Avatar ---
  // Read the cached sprite off state (recomputed by the engine only on a stage
  // change), never rebuild it here — this is the per-frame hot path.
  const avatar: Bitmap = state.avatarBitmap;
  ctx.fillStyle = colors.ink;
  blit(ctx, avatar, state.avatarX * s, Math.round(state.avatarY) * s, s);

  // --- Score (top-right, mono pixel font) ---
  drawScore(ctx, `${state.score}${def.scoreUnit}`, state.width, s, colors);

  // --- Flash text (milestone celebration), centered ---
  if (state.flash) {
    drawFlash(ctx, state.flash.text, state.flash.ms, state.width, state.height, s, colors);
  }

  // --- Idle prompt ---
  if (state.phase === "idle") {
    drawIdlePrompt(ctx, "PRESS SPACE", "TO PLAY", state.width, state.height, s, colors);
  }

  // --- Over: stamp the field — the card carries the copy ---
  if (state.phase === "over") {
    drawOverPlate(ctx, "CRASHED", state.width, state.height, s, colors);
  }
}

/** Exposed for tests / tooling that want to measure a label. */
export const __fontInternals = { textWidth, FONT, GLYPH_H, spriteHeight };
