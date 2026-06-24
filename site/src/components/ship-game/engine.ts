// The pure game engine.
//
// No window / document / canvas import — this whole module runs under Vitest's
// node environment, and every game's behavior is reproducible because the RNG
// seed lives in GameState (never Math.random() / Date.now() in the hot path).
//
// Coordinate space: a low-res LOGICAL field, width × height pixels, origin at
// top-left, y growing downward. The renderer integer-scales this to the canvas.
// The avatar sits at a fixed x; obstacles scroll right-to-left. "Ground" is the
// baseline; the avatar's BOTTOM rests on it when on the ground.

import {
  spriteHeight,
  spriteWidth,
} from "./sprites";
import type {
  AvatarCtx,
  Bitmap,
  GameDef,
  GameInput,
  GameState,
  InitOptions,
  LiveObstacle,
} from "./types";

// --- Tunables (logical units; seconds for time-based rates) ----------------

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 80;
const DEFAULT_SEED = 0x9e3779b9; // golden-ratio-ish constant; any nonzero works.

/** Baseline distance up from the bottom of the field. */
const BASELINE_FROM_BOTTOM = 14;

/** Gravity, logical px / s². Tuned so a jump feels snappy at ~60fps. */
const GRAVITY = 1400;
/** Upward impulse on jump, logical px / s (negative = up). */
const JUMP_VELOCITY = -430;

/** Starting scroll speed, logical px / s. */
const BASE_SPEED = 90;
/** Speed gained per score point, logical px / s. Ramps difficulty. */
const SPEED_PER_SCORE = 0.55;
/** Hard cap so late game stays playable. */
const MAX_SPEED = 320;

/** Score accrues this many points per logical px scrolled. */
const SCORE_PER_PX = 0.08;

/** Base milliseconds between spawn opportunities at BASE_SPEED. */
const BASE_SPAWN_MS = 1100;
/** Random jitter added to each spawn interval (ms), scaled by RNG. */
const SPAWN_JITTER_MS = 700;
/**
 * Minimum horizontal gap (logical px) the engine guarantees between an
 * obstacle's spawn and the previous one, so a jump is always physically
 * possible. Scales DOWN as speed rises but never below MIN_GAP_FLOOR.
 */
const MIN_GAP_BASE = 120;
const MIN_GAP_FLOOR = 78;

/** Flash text lifetime, ms. */
const FLASH_MS = 900;

/** Forgiving collision inset (logical px) so pixel corners don't feel unfair. */
const HITBOX_INSET = 2;

// --- Seeded RNG (mulberry32) -----------------------------------------------
// Pure 32-bit PRNG. We advance `state.rng` in place and return a float in
// [0, 1). Deterministic given the seed — that is the whole point.

function nextRandom(state: GameState): number {
  let t = (state.rng + 0x6d2b79f5) | 0;
  state.rng = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// --- Avatar helpers ---------------------------------------------------------

/** Resolve the avatar Bitmap for the current (score, stage). */
export function resolveAvatar(def: GameDef, ctx: AvatarCtx): Bitmap {
  return typeof def.avatar === "function" ? def.avatar(ctx) : def.avatar;
}

function avatarCtx(state: GameState): AvatarCtx {
  return { score: state.score, stage: state.stage };
}

// --- State construction -----------------------------------------------------

export function createInitialState(
  def: GameDef,
  opts: InitOptions = {},
): GameState {
  const width = opts.width ?? DEFAULT_WIDTH;
  const height = opts.height ?? DEFAULT_HEIGHT;
  const baselineY = height - BASELINE_FROM_BOTTOM;
  const seed = (opts.seed ?? DEFAULT_SEED) | 0;

  const initialAvatar = resolveAvatar(def, { score: 0, stage: 0 });
  const avatarW = spriteWidth(initialAvatar);
  const avatarH = spriteHeight(initialAvatar);
  const avatarX = Math.round(width * 0.12);

  return {
    id: def.id,
    phase: "idle",
    width,
    height,
    baselineY,
    avatarX,
    avatarY: baselineY - avatarH,
    vy: 0,
    onGround: true,
    avatarW,
    avatarH,
    avatarBitmap: initialAvatar,
    obstacles: [],
    speed: BASE_SPEED,
    distance: 0,
    score: 0,
    stage: 0,
    spawnTimer: BASE_SPAWN_MS,
    flash: null,
    elapsedMs: 0,
    // Seed must be nonzero for mulberry32 to be lively; coerce 0 → DEFAULT.
    rng: seed === 0 ? DEFAULT_SEED : seed,
  };
}

/** Begin a round from idle/over. Resets the field but keeps the chosen seed lineage. */
export function startRound(state: GameState, def: GameDef): GameState {
  const fresh = createInitialState(def, {
    seed: state.rng,
    width: state.width,
    height: state.height,
  });
  fresh.phase = "running";
  return fresh;
}

// --- Geometry ---------------------------------------------------------------

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Axis-aligned bounding-box overlap test. */
export function aabbOverlap(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Shrink a box symmetrically by `inset` on each side, but never past collapse:
 * the inset is capped so a tiny sprite keeps a positive hitbox. This keeps pixel
 * corners from feeling unfair on real (large) sprites without breaking small
 * ones used in tests.
 */
function insetBox(x: number, y: number, w: number, h: number): Box {
  const ix = Math.min(HITBOX_INSET, Math.max(0, (w - 1) / 2));
  const iy = Math.min(HITBOX_INSET, Math.max(0, (h - 1) / 2));
  return { x: x + ix, y: y + iy, w: w - ix * 2, h: h - iy * 2 };
}

function avatarBox(state: GameState): Box {
  return insetBox(state.avatarX, state.avatarY, state.avatarW, state.avatarH);
}

function obstacleBox(ob: LiveObstacle): Box {
  return insetBox(ob.x, ob.y, ob.w, ob.h);
}

// --- Spawning ---------------------------------------------------------------

/** Pick an obstacle type index by weight using the seeded RNG. */
function pickObstacleType(state: GameState, def: GameDef): number {
  const obs = def.obstacles;
  if (obs.length === 1) return 0;
  let total = 0;
  for (const o of obs) total += o.weight ?? 1;
  let r = nextRandom(state) * total;
  for (let i = 0; i < obs.length; i++) {
    r -= obs[i].weight ?? 1;
    if (r <= 0) return i;
  }
  return obs.length - 1;
}

/** Current minimum spawn gap (logical px), shrinking as speed rises. */
function minGap(state: GameState): number {
  const speedFrac = (state.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
  const gap = MIN_GAP_BASE - (MIN_GAP_BASE - MIN_GAP_FLOOR) * clamp01(speedFrac);
  return gap;
}

/** Right-most obstacle's left edge, or null if the field is empty. */
function rightmostX(state: GameState): number | null {
  let max: number | null = null;
  for (const ob of state.obstacles) {
    if (max === null || ob.x > max) max = ob.x;
  }
  return max;
}

function trySpawn(state: GameState, def: GameDef): void {
  const typeIndex = pickObstacleType(state, def);
  const type = def.obstacles[typeIndex];
  const w = spriteWidth(type.sprite);
  const h = spriteHeight(type.sprite);

  // Enforce the minimum gap so a jump is always possible.
  const rm = rightmostX(state);
  if (rm !== null && state.width - rm < minGap(state)) {
    // Too close to the last one — defer; try again shortly.
    state.spawnTimer = Math.max(state.spawnTimer, 120);
    return;
  }

  const y = type.grounded
    ? state.baselineY - h
    : state.baselineY - (type.floatY ?? 0) - h;

  state.obstacles.push({ typeIndex, x: state.width, w, h, y });

  // Schedule the next spawn opportunity, scaled inversely with speed so the
  // cadence in *distance* stays roughly constant as the world scrolls faster.
  const speedScale = BASE_SPEED / state.speed;
  const jitter = nextRandom(state) * SPAWN_JITTER_MS;
  state.spawnTimer = (BASE_SPAWN_MS + jitter) * speedScale;
}

// --- Milestones -------------------------------------------------------------

function updateMilestone(state: GameState, def: GameDef): void {
  if (!def.milestoneEvery || def.milestoneEvery <= 0) return;
  const newStage = Math.floor(state.score / def.milestoneEvery);
  if (newStage > state.stage) {
    state.stage = newStage;
    if (def.flashText) {
      state.flash = { text: def.flashText(newStage), ms: FLASH_MS };
    }
    // Stage change may grow the avatar (builder crate). Recompute the sprite
    // ONCE here (the only point the avatar can change) and cache it on state, so
    // the renderer never rebuilds it per frame. Recompute dims and keep the
    // avatar's BOTTOM anchored so it doesn't sink through the ground.
    const bmp = resolveAvatar(def, avatarCtx(state));
    const newH = spriteHeight(bmp);
    const newW = spriteWidth(bmp);
    const bottom = state.avatarY + state.avatarH;
    state.avatarBitmap = bmp;
    state.avatarH = newH;
    state.avatarW = newW;
    state.avatarY = bottom - newH;
  }
}

// --- The step function ------------------------------------------------------

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Advance the simulation by `dtMs` milliseconds. Pure: returns the same mutated
 * object (callers may treat it as in-place; React callers replace the ref).
 *
 * `input.primary` is edge-triggered by the caller — true only on the frame the
 * jump was requested.
 */
export function step(
  state: GameState,
  dtMs: number,
  input: GameInput,
  def: GameDef,
): GameState {
  // Clamp dt so a tab-switch / breakpoint can't teleport obstacles through the
  // avatar. The hook feeds fixed-size ticks; this is belt-and-suspenders.
  const dt = Math.min(Math.max(dtMs, 0), 50) / 1000; // seconds

  // ----- idle: a jump starts the round -----
  if (state.phase === "idle") {
    if (input.primary) {
      const started = startRound(state, def);
      // Mutate `state` to match `started` is awkward; instead the engine
      // returns `started` and the caller adopts it. We do an in-place adoption
      // for callers that keep the same reference (tests use the return value).
      Object.assign(state, started);
      // Give the freshly-started avatar its jump impulse this very frame so the
      // first press both starts AND hops — feels responsive.
      state.vy = JUMP_VELOCITY;
      state.onGround = false;
    }
    return state;
  }

  // ----- over: a jump restarts -----
  if (state.phase === "over") {
    if (input.primary) {
      const started = startRound(state, def);
      Object.assign(state, started);
      state.vy = JUMP_VELOCITY;
      state.onGround = false;
    }
    return state;
  }

  // ----- running -----
  state.elapsedMs += dtMs;

  // Jump (only from the ground).
  if (input.primary && state.onGround) {
    state.vy = JUMP_VELOCITY;
    state.onGround = false;
  }

  // Integrate vertical motion.
  state.vy += GRAVITY * dt;
  state.avatarY += state.vy * dt;

  // Ground clamp.
  const groundTop = state.baselineY - state.avatarH;
  if (state.avatarY >= groundTop) {
    state.avatarY = groundTop;
    state.vy = 0;
    state.onGround = true;
  }

  // Speed ramps with score (difficulty).
  state.speed = Math.min(
    MAX_SPEED,
    BASE_SPEED + state.score * SPEED_PER_SCORE,
  );

  // Scroll obstacles left; score accrues with distance traveled.
  const dx = state.speed * dt;
  state.distance += dx;
  state.score = Math.floor(state.distance * SCORE_PER_PX);

  for (const ob of state.obstacles) {
    ob.x -= dx;
  }
  // Cull off-screen obstacles (fully past the left edge).
  state.obstacles = state.obstacles.filter((ob) => ob.x + ob.w > -2);

  // Milestones (stage bump + flash + possible avatar growth).
  updateMilestone(state, def);

  // Spawning.
  state.spawnTimer -= dtMs;
  if (state.spawnTimer <= 0) {
    trySpawn(state, def);
  }

  // Flash countdown.
  if (state.flash) {
    state.flash.ms -= dtMs;
    if (state.flash.ms <= 0) state.flash = null;
  }

  // Collision → game over.
  const ab = avatarBox(state);
  for (const ob of state.obstacles) {
    if (aabbOverlap(ab, obstacleBox(ob))) {
      state.phase = "over";
      break;
    }
  }

  return state;
}

// Re-export tunables that the renderer/hook want to read so there is a single
// source of truth (e.g. baseline placement matches between engine and renderer).
export const ENGINE_CONSTANTS = {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  BASELINE_FROM_BOTTOM,
  BASE_SPEED,
  MAX_SPEED,
} as const;
