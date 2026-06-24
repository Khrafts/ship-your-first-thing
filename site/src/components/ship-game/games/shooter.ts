// shooter — "Keep it live"
//
// A Space-Invaders-style pixel shooter. A small cannon slides along the
// baseline at the bottom of the field; bugs and errors march down from the top
// in a formation. Slide left/right (or drag), press fire to knock them down.
// Classic one-bullet-in-flight: you can't spray, so each shot has to count.
//
// The course tie: shipping isn't the finish line. Things keep coming at a live
// app — bugs, errors, the unexpected — and you keep it live by knocking them
// down fast. Let one slip through to your app's baseline and the round is over.
//
// Self-contained GameModule: it brings its own pure step/render and touches no
// shared engine code. Deterministic — the RNG seed lives in state, never
// Math.random()/Date.now(). Monochrome — every pixel is ink/paper/faint.

import { blit } from "../sprites";
import { drawScore, drawFlash, drawIdlePrompt, drawOverPlate } from "../hud";
import type {
  Bitmap,
  GameInput,
  GameModule,
  InitOptions,
  Phase,
  RenderOptions,
} from "../types";

// --- Tunables (logical units; seconds for time-based rates) ----------------

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 80;
const DEFAULT_SEED = 0x9e3779b9; // golden-ratio-ish constant; any nonzero works.

/** Formation shape. */
const ROWS = 2;
const COLS = 6;
const INV_W = 7;
const INV_H = 5;
/** Horizontal distance between invader left edges. */
const COL_GAP = 14;
/** Vertical distance between invader rows. */
const ROW_GAP = 10;
/** Top row's y (logical px from the top of the field). */
const TOP_Y = 8;

/** The cannon. Its width feeds centering and bullet origin. */
const SHIP_W = 11;
/** Cannon's top edge measured up from the bottom of the field. */
const SHIP_BASE_FROM_BOTTOM = 8;

/** Ship slide speed under held left/right, logical px / s. */
const SHIP_SPEED = 140;
/** Bullet travel speed upward, logical px / s. */
const BULLET_SPEED = 180;

/** Base milliseconds between formation march steps (scaled down by speedMul). */
const MARCH_INTERVAL = 550;
/** Horizontal shift per march step, logical px. */
const STEP_X = 6;
/** Vertical drop when the formation reaches a side edge, logical px. */
const DROP_Y = 6;

/** Milestone flash lifetime, ms. */
const FLASH_MS = 900;

// --- Sprites ----------------------------------------------------------------
// A Bitmap is rows of text; any non-space char is a filled (ink) pixel.

// a bug invader, 7x5
const BUG: Bitmap = ["# # # #", " ##### ", "#######", " ##### ", "#  #  #"];
// an error-X invader, 7x5
const ERROR: Bitmap = ["##   ##", " ## ## ", "  ###  ", " ## ## ", "##   ##"];

// the cannon/cursor the player slides, 11x5, pointing up
const SHIP: Bitmap = [
  "     #     ",
  "    ###    ",
  "   #####   ",
  " ######### ",
  "###########",
];
const SHIP_H = SHIP.length;

// --- Geometry helpers -------------------------------------------------------

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Top edge of the cannon (and the "ship row" an invader must not reach). */
function shipRowY(height: number): number {
  return height - SHIP_BASE_FROM_BOTTOM;
}

/** Centered cannon x for a given field width. */
function centerShipX(width: number): number {
  return Math.round((width - SHIP_W) / 2);
}

/** A fresh formation of invaders near the top, evenly spaced and centered. */
function buildFormation(
  width: number,
): { x: number; y: number; w: number; h: number; alive: boolean }[] {
  const formationW = (COLS - 1) * COL_GAP + INV_W;
  const startX = Math.round((width - formationW) / 2);
  const invaders: {
    x: number;
    y: number;
    w: number;
    h: number;
    alive: boolean;
  }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      invaders.push({
        x: startX + c * COL_GAP,
        y: TOP_Y + r * ROW_GAP,
        w: INV_W,
        h: INV_H,
        alive: true,
      });
    }
  }
  return invaders;
}

// --- State ------------------------------------------------------------------

export interface ShooterState {
  phase: Phase;
  readonly width: number;
  readonly height: number;
  rng: number;
  score: number;
  stage: number;
  flash: { text: string; ms: number } | null;
  shipX: number;
  shipW: number;
  bullet: { x: number; y: number; live: boolean } | null;
  invaders: { x: number; y: number; w: number; h: number; alive: boolean }[];
  dir: 1 | -1;
  stepTimer: number;
  speedMul: number;
}

/** Reset the field and start a running round (used from idle/over). */
function beginRound(state: ShooterState): void {
  state.phase = "running";
  state.score = 0;
  state.stage = 0;
  state.flash = null;
  state.dir = 1;
  state.speedMul = 1;
  state.stepTimer = MARCH_INTERVAL;
  state.shipX = centerShipX(state.width);
  state.invaders = buildFormation(state.width);
  // Classic one-bullet-in-flight: the first press both starts AND fires, so the
  // round opens with a shot already climbing toward the formation.
  state.bullet = {
    x: state.shipX + state.shipW / 2,
    y: shipRowY(state.height),
    live: true,
  };
}

// --- The module -------------------------------------------------------------

const shooter: GameModule<ShooterState> = {
  id: "shooter",
  name: "Keep it live",
  tagline: "Slide and fire. Knock down what comes at your app.",
  scoreUnit: "",
  highScoreId: "shooter",
  ariaLabel:
    "Keep it live: a pixel space-shooter. Slide with the arrow keys or your finger; press space to fire at the incoming problems. The course links are below.",
  controlsHint: "Slide left/right; press space to fire.",

  createState(opts: InitOptions): ShooterState {
    const width = opts.width ?? DEFAULT_WIDTH;
    const height = opts.height ?? DEFAULT_HEIGHT;
    const seed = (opts.seed ?? DEFAULT_SEED) | 0;
    return {
      phase: "idle",
      width,
      height,
      // Seed must be nonzero to stay lively; coerce 0 → DEFAULT.
      rng: seed === 0 ? DEFAULT_SEED : seed,
      score: 0,
      stage: 0,
      flash: null,
      shipX: centerShipX(width),
      shipW: SHIP_W,
      bullet: null,
      invaders: buildFormation(width),
      dir: 1,
      stepTimer: MARCH_INTERVAL,
      speedMul: 1,
    };
  },

  step(state: ShooterState, dtMs: number, input: GameInput): ShooterState {
    // Clamp dt so a tab-switch can't teleport the formation through the line.
    const dt = Math.min(Math.max(dtMs, 0), 50) / 1000; // seconds

    // ----- idle / over: a press (re)starts the round and fires immediately ---
    if (state.phase === "idle" || state.phase === "over") {
      if (input.primary) beginRound(state);
      return state;
    }

    // ----- running -----
    const maxX = state.width - state.shipW;

    // Move the cannon: pointer drag takes priority over held arrows.
    if (input.pointerX != null) {
      state.shipX = clamp(input.pointerX - state.shipW / 2, 0, maxX);
    } else if (input.left && !input.right) {
      state.shipX = clamp(state.shipX - SHIP_SPEED * dt, 0, maxX);
    } else if (input.right && !input.left) {
      state.shipX = clamp(state.shipX + SHIP_SPEED * dt, 0, maxX);
    }

    // Fire: only when nothing is already in flight (one bullet at a time).
    if (input.primary && (state.bullet === null || !state.bullet.live)) {
      state.bullet = {
        x: state.shipX + state.shipW / 2,
        y: shipRowY(state.height),
        live: true,
      };
    }

    // Advance the bullet, then test it against the formation. Move-before-test
    // so a shot spawned ON an invader's edge still lands the hit this frame.
    if (state.bullet && state.bullet.live) {
      state.bullet.y -= BULLET_SPEED * dt;
      if (state.bullet.y < 0) state.bullet.live = false;
    }
    if (state.bullet && state.bullet.live) {
      const bx = state.bullet.x;
      const by = state.bullet.y;
      for (const inv of state.invaders) {
        if (!inv.alive) continue;
        if (
          bx >= inv.x &&
          bx < inv.x + inv.w &&
          by >= inv.y &&
          by < inv.y + inv.h
        ) {
          inv.alive = false;
          state.bullet.live = false;
          state.score++;
          break;
        }
      }
    }

    // Formation march: shift sideways on each tick; on a side edge, flip and
    // drop the whole formation a row toward the cannon.
    state.stepTimer -= dtMs;
    if (state.stepTimer <= 0) {
      let hitEdge = false;
      for (const inv of state.invaders) {
        if (!inv.alive) continue;
        const nx = inv.x + state.dir * STEP_X;
        if (nx < 0 || nx + inv.w > state.width) {
          hitEdge = true;
          break;
        }
      }
      if (hitEdge) {
        state.dir = state.dir === 1 ? -1 : 1;
        for (const inv of state.invaders) {
          if (inv.alive) inv.y += DROP_Y;
        }
      } else {
        for (const inv of state.invaders) {
          if (inv.alive) inv.x += state.dir * STEP_X;
        }
      }
      state.stepTimer = MARCH_INTERVAL / state.speedMul;
    }

    // Wave cleared: a thing shipped. Flash, respawn faster, keep going.
    if (!state.invaders.some((inv) => inv.alive)) {
      state.stage++;
      state.flash = { text: "SHIPPED ✦", ms: FLASH_MS };
      state.invaders = buildFormation(state.width);
      state.speedMul = Math.min(state.speedMul * 1.15, 2.5);
      state.dir = 1;
      state.stepTimer = MARCH_INTERVAL / state.speedMul;
    }

    // Lose: an invader's bottom reaches the cannon's row.
    const rowY = shipRowY(state.height);
    for (const inv of state.invaders) {
      if (inv.alive && inv.y + inv.h >= rowY) {
        state.phase = "over";
        break;
      }
    }

    // Flash countdown.
    if (state.flash) {
      state.flash.ms -= dtMs;
      if (state.flash.ms <= 0) state.flash = null;
    }

    return state;
  },

  render(
    ctx: CanvasRenderingContext2D,
    state: ShooterState,
    opts: RenderOptions,
  ): void {
    const s = opts.scale;
    const { colors } = opts;
    const { width, height } = state;

    // Background.
    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, width * s, height * s);

    const rowY = shipRowY(height);

    // The cannon's baseline (the line a slipped-through invader breaches).
    ctx.fillStyle = colors.faint;
    ctx.fillRect(0, (rowY + SHIP_H) * s, width * s, s);

    // Invaders — alternate bug / error so it reads as "bugs and errors marching".
    ctx.fillStyle = colors.ink;
    state.invaders.forEach((inv, i) => {
      if (!inv.alive) return;
      blit(ctx, i % 2 === 0 ? BUG : ERROR, inv.x * s, inv.y * s, s);
    });

    // The cannon.
    ctx.fillStyle = colors.ink;
    blit(ctx, SHIP, state.shipX * s, rowY * s, s);

    // The shot in flight: a short bright column.
    if (state.bullet && state.bullet.live) {
      ctx.fillStyle = colors.ink;
      ctx.fillRect(
        Math.round(state.bullet.x) * s,
        Math.round(state.bullet.y) * s,
        s,
        3 * s,
      );
    }

    // HUD.
    drawScore(ctx, String(state.score), width, s, colors);
    if (state.flash) {
      drawFlash(ctx, state.flash.text, state.flash.ms, width, height, s, colors);
    }
    if (state.phase === "idle") {
      drawIdlePrompt(ctx, "SLIDE + FIRE", "TO PLAY", width, height, s, colors);
    }
    if (state.phase === "over") {
      drawOverPlate(ctx, "BREACHED", width, height, s, colors);
    }
  },

  getScore: (state) => state.score,
  getStage: (state) => state.stage,
  hasMilestones: () => true,
  isIdle: (state) => state.phase === "idle",
  isOver: (state) => state.phase === "over",
  gameOverLine: (state) =>
    `You knocked down ${state.score} before one slipped through. Shipped isn't done — you keep it live by fixing fast.`,
};

export default shooter;
