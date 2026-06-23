// sorter — "Ship the good"
//
// A catch-and-sort game. Good edits (✓) and bugs fall from the top; a tray you
// slide along the bottom catches them. Catch a good edit → it ships (+1). Let a
// bug fall past → fine, that is the correct call. But catch a bug → you shipped
// it, and the round ends. The whole game is the course's thesis in one verb:
// the falling stream is what the agent produces; the player is the judgment that
// decides what makes it into the box.
//
// This is a self-contained GameModule: it brings its own pure step/render and
// touches no shared engine code. The RNG seed lives in state (mulberry32, copied
// from engine.ts) so every round is reproducible — never Math.random()/Date.now().
// Monochrome throughout: every pixel is colors.ink / colors.paper / colors.faint.

import { drawScore, drawFlash, drawIdlePrompt, drawOverPlate } from "../hud";
import { blit, spriteWidth } from "../sprites";
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

/** Tray geometry: a shallow open box near the bottom of the field. */
const TRAY_W = 30;
/** Distance of the tray's top from the bottom of the field. */
const TRAY_FROM_BOTTOM = 12;

/** Base fall speed (logical px / s) for a freshly spawned item, pre-ramp. */
const BASE_FALL_SPEED = 40;
/** Cap on the fall-speed multiplier so late game stays catchable. */
const MAX_SPEED_MUL = 2.2;
/** Fall-speed multiplier gained per good shipped. */
const SPEED_RAMP = 0.03;

/** Delay (ms) before the first item drops, so the round opens calmly. */
const INITIAL_SPAWN_DELAY = 600;
/** Base ms between spawns; shrinks as the score climbs. */
const BASE_SPAWN_MS = 950;
/** Spawn interval never drops below this (ms). */
const MIN_SPAWN_MS = 420;
/** ms shaved off the spawn interval per good shipped. */
const SPAWN_DECAY = 9;

/** An item is good when nextRandom() clears this threshold (≈60% good). */
const GOOD_THRESHOLD = 0.4;
/** Horizontal margin (logical px) kept clear of the field edges when spawning. */
const SPAWN_MARGIN = 8;

/** Tray slide speed under keyboard nudges (logical px / s). */
const TRAY_SPEED = 150;

/** Every N good shipped bumps the stage and fires a celebratory flash. */
const MILESTONE_EVERY = 10;
const MILESTONE_FLASH = "SHIPPED ✦";
/** Flash text lifetime, ms. */
const FLASH_MS = 900;

// --- Sprites (pixel art; any non-space char is a filled ink pixel) ----------

/** A good edit: a tidy check-mark. 5 wide × 4 tall. */
const GOOD: Bitmap = [
  "    #",
  "   # ",
  "# #  ",
  " #   ",
];

/** A bug: antennae, a round body, legs splayed at the bottom. 5 wide × 4 tall. */
const BUG: Bitmap = [
  "#   #",
  " ### ",
  "#####",
  "# # #",
];

// --- State -----------------------------------------------------------------

/** One falling item. Mutable: the step loop advances `y` in place. */
interface SorterItem {
  x: number;
  y: number;
  vy: number;
  good: boolean;
}

/**
 * The full sorter state. Pure data — no DOM, no canvas. Gameplay fields are
 * mutable (the step loop advances them in place); the RNG seed lives here so the
 * simulation is deterministic for a given seed.
 */
export interface SorterState {
  phase: Phase;
  width: number;
  height: number;
  /** 32-bit RNG state (mulberry32). Never read from Math.random(). */
  rng: number;
  score: number;
  stage: number;
  flash: { text: string; ms: number } | null;
  /** Tray left edge (logical x). */
  trayX: number;
  /** Tray width (logical px). */
  trayW: number;
  items: SorterItem[];
  /** ms until the next item drops. */
  spawnTimer: number;
  /** Fall-speed multiplier, ramps up with score. */
  speedMul: number;
}

// --- Seeded RNG (mulberry32) — copied from engine.ts ------------------------

function nextRandom(state: SorterState): number {
  let t = (state.rng + 0x6d2b79f5) | 0;
  state.rng = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}

/** Y of the tray's top edge for a given field height. */
function trayTop(state: SorterState): number {
  return state.height - TRAY_FROM_BOTTOM;
}

// --- Construction -----------------------------------------------------------

function createState(opts: InitOptions): SorterState {
  const width = opts.width ?? DEFAULT_WIDTH;
  const height = opts.height ?? DEFAULT_HEIGHT;
  const seed = (opts.seed ?? DEFAULT_SEED) | 0;
  return {
    phase: "idle",
    width,
    height,
    // Seed must be nonzero for mulberry32 to be lively; coerce 0 → DEFAULT.
    rng: seed === 0 ? DEFAULT_SEED : seed,
    score: 0,
    stage: 0,
    flash: null,
    trayX: Math.round((width - TRAY_W) / 2),
    trayW: TRAY_W,
    items: [],
    spawnTimer: INITIAL_SPAWN_DELAY,
    speedMul: 1,
  };
}

/** Reset the field for a fresh round, keeping the RNG lineage (deterministic). */
function startRound(state: SorterState): void {
  state.phase = "running";
  state.score = 0;
  state.stage = 0;
  state.flash = null;
  state.trayX = Math.round((state.width - state.trayW) / 2);
  state.items = [];
  state.spawnTimer = INITIAL_SPAWN_DELAY;
  state.speedMul = 1;
}

// --- Step -------------------------------------------------------------------

function spawnItem(state: SorterState): void {
  // Two RNG draws, in a fixed order, so a fixed seed replays identically.
  const span = state.width - SPAWN_MARGIN * 2;
  const x = SPAWN_MARGIN + nextRandom(state) * span;
  const good = nextRandom(state) > GOOD_THRESHOLD;
  state.items.push({ x, y: 0, vy: BASE_FALL_SPEED * state.speedMul, good });
}

function step(state: SorterState, dtMs: number, input: GameInput): SorterState {
  const dt = Math.min(Math.max(dtMs, 0), 50) / 1000; // seconds

  // idle / over: a primary press starts (or restarts) the round.
  if (state.phase === "idle" || state.phase === "over") {
    if (input.primary) startRound(state);
    return state;
  }

  // ----- running -----

  // Move the tray: a pointer drags it directly; otherwise left/right nudge it.
  if (input.pointerX != null) {
    state.trayX = clamp(
      input.pointerX - state.trayW / 2,
      0,
      state.width - state.trayW,
    );
  } else {
    let dir = 0;
    if (input.left) dir -= 1;
    if (input.right) dir += 1;
    state.trayX = clamp(
      state.trayX + dir * TRAY_SPEED * dt,
      0,
      state.width - state.trayW,
    );
  }

  // Spawn: when the timer drains, drop one item and reschedule (faster as the
  // score climbs, so the stream tightens but never below the floor).
  state.spawnTimer -= dtMs;
  if (state.spawnTimer <= 0) {
    spawnItem(state);
    state.spawnTimer = Math.max(MIN_SPAWN_MS, BASE_SPAWN_MS - state.score * SPAWN_DECAY);
  }

  // Move items, then resolve catches and fall-throughs.
  const trayY = trayTop(state);
  const kept: SorterItem[] = [];
  for (const item of state.items) {
    item.y += item.vy * dt;

    const overTray =
      item.y >= trayY &&
      item.x >= state.trayX &&
      item.x <= state.trayX + state.trayW;

    if (state.phase === "running" && overTray) {
      if (item.good) {
        // Shipped a good edit.
        state.score += 1;
        const newStage = Math.floor(state.score / MILESTONE_EVERY);
        if (newStage > state.stage) {
          state.stage = newStage;
          state.flash = { text: MILESTONE_FLASH, ms: FLASH_MS };
        }
        state.speedMul = Math.min(MAX_SPEED_MUL, 1 + state.score * SPEED_RAMP);
        continue; // consumed
      }
      // Caught a bug — you shipped it. Round ends; keep it visible in the tray.
      state.phase = "over";
      kept.push(item);
      continue;
    }

    if (item.y > state.height) continue; // fell past, uncaught — correctly dropped
    kept.push(item);
  }
  state.items = kept;

  // Flash countdown.
  if (state.flash) {
    state.flash.ms -= dtMs;
    if (state.flash.ms <= 0) state.flash = null;
  }

  return state;
}

// --- Render -----------------------------------------------------------------

function render(
  ctx: CanvasRenderingContext2D,
  state: SorterState,
  opts: RenderOptions,
): void {
  const s = opts.scale;
  const { colors } = opts;
  const W = state.width;
  const H = state.height;

  // Background.
  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, W * s, H * s);

  // Falling items.
  ctx.fillStyle = colors.ink;
  for (const item of state.items) {
    const bmp = item.good ? GOOD : BUG;
    const w = spriteWidth(bmp);
    blit(ctx, bmp, (item.x - w / 2) * s, item.y * s, s);
  }

  // Tray: a shallow open box (floor + two short side walls).
  const ty = trayTop(state) * s;
  const tx = state.trayX * s;
  const tw = state.trayW * s;
  ctx.fillStyle = colors.ink;
  ctx.fillRect(tx, ty + 4 * s, tw, 2 * s); // floor
  ctx.fillRect(tx, ty, 2 * s, 6 * s); // left wall
  ctx.fillRect(tx + tw - 2 * s, ty, 2 * s, 6 * s); // right wall

  // Score readout.
  drawScore(ctx, `${state.score}${sorter.scoreUnit}`, W, s, colors);

  // Milestone flash.
  if (state.flash) {
    drawFlash(ctx, state.flash.text, state.flash.ms, W, H, s, colors);
  }

  // Phase chrome.
  if (state.phase === "idle") {
    drawIdlePrompt(ctx, "SLIDE TO PLAY", "CATCH ✓ DROP ✗", W, H, s, colors);
  } else if (state.phase === "over") {
    drawOverPlate(ctx, "SHIPPED A BUG", W, H, s, colors);
  }
}

// --- Module -----------------------------------------------------------------

const sorter: GameModule<SorterState> = {
  id: "sorter",
  name: "Ship the good",
  tagline: "Catch the good edits. Let the bugs drop.",
  scoreUnit: "",
  highScoreId: "sorter",
  ariaLabel:
    "Ship the good: a pixel sorting game. Slide with the arrow keys or your finger to catch the good edits and let the bugs drop. The course links are below.",
  controlsHint: "Slide left/right to catch the good, drop the bad.",
  createState,
  step,
  render,
  getScore: (state) => state.score,
  getStage: (state) => state.stage,
  hasMilestones: () => true,
  isIdle: (state) => state.phase === "idle",
  isOver: (state) => state.phase === "over",
  gameOverLine: (state) =>
    `You shipped ${state.score} good edits, then caught a bug. The agent builds — you decide what ships.`,
};

export default sorter;
