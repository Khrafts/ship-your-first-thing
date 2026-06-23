// The renderer. Draws a GameState to a 2D context in strict monochrome.
//
// Colors are READ from the canvas element's computed style (--ink / --paper /
// --ink-faint), so the game flips with the site's light/dark theme toggle with
// zero `dark:` utilities. The backbuffer is the LOGICAL field (low-res); we set
// the canvas's backing store to logicalSize × scale and draw filled rects at
// integer scale, then CSS `image-rendering: pixelated` keeps the pixels crisp.

import { blit, spriteHeight, spriteWidth } from "./sprites";
import type { Bitmap, GameDef, GameState } from "./types";

export interface ThemeColors {
  ink: string;
  paper: string;
  faint: string;
}

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

// 5×7 pixel font for scores / prompts. Lowercase reuses uppercase glyphs; the
// few punctuation marks we need are included. Unknown chars render as a blank.
const FONT: Record<string, Bitmap> = {
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

const GLYPH_H = 5;
const GLYPH_GAP = 1;

/** Total pixel width of a string in the 5×7 font at scale 1. */
function textWidth(text: string): number {
  let w = 0;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch] ?? FONT[" "];
    w += spriteWidth(g) + GLYPH_GAP;
  }
  return Math.max(0, w - GLYPH_GAP);
}

/** Draw a string in the pixel font at logical (x, y), top-left, given pixelScale. */
function drawText(
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

/** Baseline y for the wave variant at a given column + time. */
function waveOffset(col: number, elapsedMs: number): number {
  const phase = elapsedMs / 360;
  return Math.round(Math.sin(col / 14 + phase) * 2);
}

export interface RenderOptions {
  /** Integer pixels-per-logical-pixel. */
  readonly scale: number;
  /** Theme colors (read once per frame by the hook and passed in). */
  readonly colors: ThemeColors;
  /**
   * When reduced-motion is active and the round is idle, draw a static prompt
   * frame. The hook passes this so the renderer never has to know about media
   * queries.
   */
  readonly reducedMotion?: boolean;
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
  blit(
    ctx,
    avatar,
    state.avatarX * s,
    Math.round(state.avatarY) * s,
    s,
  );

  // --- Score (top-right, mono pixel font) ---
  const scoreStr = `${state.score}${def.scoreUnit}`.toUpperCase();
  ctx.fillStyle = colors.ink;
  const scoreW = textWidth(scoreStr) * s;
  drawText(ctx, scoreStr, W - scoreW - 4 * s, 4 * s, s);

  // --- Flash text (milestone celebration), centered ---
  if (state.flash) {
    const fade = state.flash.ms < 250 ? colors.faint : colors.ink;
    ctx.fillStyle = fade;
    const t = state.flash.text;
    const tw = textWidth(t) * s;
    drawText(ctx, t, (W - tw) / 2, Math.round(state.height * 0.32) * s, s);
  }

  // --- Idle / reduced-motion prompt ---
  if (state.phase === "idle") {
    ctx.fillStyle = colors.ink;
    const prompt = "PRESS SPACE";
    const pw = textWidth(prompt) * s;
    drawText(
      ctx,
      prompt,
      (W - pw) / 2,
      Math.round(state.height * 0.42) * s,
      s,
    );
    const sub = "TO PLAY";
    const sw = textWidth(sub) * s;
    ctx.fillStyle = colors.faint;
    drawText(ctx, sub, (W - sw) / 2, Math.round(state.height * 0.42 + 8) * s, s);
  }

  // --- Over: dim the field and stamp the avatar — the card carries the copy ---
  if (state.phase === "over") {
    ctx.fillStyle = colors.ink;
    const over = "CRASHED";
    const ow = textWidth(over) * s;
    // A small inverted plate so the word reads on the busy field.
    const plateW = ow + 8 * s;
    const plateH = (GLYPH_H + 6) * s;
    const px = (W - plateW) / 2;
    const py = Math.round(state.height * 0.36) * s;
    ctx.fillStyle = colors.ink;
    ctx.fillRect(px, py, plateW, plateH);
    ctx.fillStyle = colors.paper;
    drawText(ctx, over, px + 4 * s, py + 3 * s, s);
  }
}

/** Exposed for tests / tooling that want to measure a label. */
export const __fontInternals = { textWidth, FONT, GLYPH_H, spriteHeight };
