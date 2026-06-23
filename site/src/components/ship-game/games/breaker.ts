// breaker — "Chip the wall"
//
// A pixel brick-breaker. Slide a paddle along the bottom; launch a ball up into
// a wall of bricks and clear it brick by brick. Clear the whole wall and the
// wall is rebuilt one notch faster ("SHIPPED ✦") — the course's "a big project
// is just small bricks" message, made playable: every brick is a small finished
// thing, and you only ever chip one at a time.
//
// Unlike the runner-style GameDef games, this is a self-contained GameModule: it
// brings its own pure step/render so the "slide the paddle" verb is expressible.
// It touches no shared engine — only the shared types, HUD chrome, and the
// deterministic RNG pattern (the seed lives in state, never Math.random()).

import { drawFlash, drawIdlePrompt, drawOverPlate, drawScore } from "../hud";
import type {
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

/** Paddle: a short bar near the bottom the player slides left/right. */
const PADDLE_W = 28;
const PADDLE_H = 3;
/** Gap of empty field below the paddle (so a missed ball clearly "drops"). */
const PADDLE_BOTTOM_GAP = 8;
/** Keyboard nudge speed for the paddle, logical px / s. */
const PADDLE_KB_SPEED = 140;

/** Ball is a BALL_SIZE×BALL_SIZE block; collisions treat it as a box of ±BALL_R. */
const BALL_R = 1;
const BALL_SIZE = BALL_R * 2;
/** Base launch speeds (logical px / s); scaled by speedMul as the wall ramps. */
const BALL_VY0 = 95; // upward launch component (magnitude)
const BALL_VX_MAX = 60; // horizontal component at a paddle-edge hit

/** Each cleared wall speeds the ball up by this factor, capped here. */
const SPEED_STEP = 1.12;
const SPEED_CAP = 2.2;

/** Milestone flash lifetime, ms. */
const FLASH_MS = 900;

// --- Brick wall layout ------------------------------------------------------

const BRICK_COLS = 8;
const BRICK_ROWS = 3;
/** Gap (logical px) between bricks, both directions. */
const BRICK_GAP = 2;
/** Top of the first brick row, from the top of the field. */
const BRICK_TOP = 10;
/** Each brick is this tall (>2 so the "scores a brick" hit-test is comfortable). */
const BRICK_H = 4;
/** Side margin reserved left and right of the wall. */
const BRICK_MARGIN = 9;

// --- Types ------------------------------------------------------------------

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  live: boolean;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
}

/**
 * The full game state. Pure data — no DOM, no canvas, no closures over time.
 * Gameplay fields are mutable so `step` can advance in place; the RNG seed lives
 * here so the simulation is deterministic and tests are reproducible.
 */
export interface BreakerState {
  phase: Phase;
  readonly width: number;
  readonly height: number;
  /** 32-bit RNG state. Advanced in place; never read from Math.random(). */
  rng: number;
  score: number;
  stage: number;
  flash: { text: string; ms: number } | null;
  /** Paddle left-edge x. */
  paddleX: number;
  paddleW: number;
  ball: Ball;
  bricks: Brick[];
  /** Difficulty multiplier on ball speed; grows each time the wall is cleared. */
  speedMul: number;
}

// --- Seeded RNG (mulberry32) -----------------------------------------------
// Pure 32-bit PRNG. Advance `state.rng` in place and return a float in [0, 1).
// Same pattern as the shared engine — deterministic given the seed.

function nextRandom(state: BreakerState): number {
  let t = (state.rng + 0x6d2b79f5) | 0;
  state.rng = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// --- Geometry ---------------------------------------------------------------

function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}

/** Y of the paddle's TOP edge, derived from the field height. */
function paddleTopY(height: number): number {
  return height - PADDLE_BOTTOM_GAP - PADDLE_H;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function ballBox(ball: Ball): Box {
  return { x: ball.x - BALL_R, y: ball.y - BALL_R, w: BALL_SIZE, h: BALL_SIZE };
}

function overlap(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

// --- Brick wall -------------------------------------------------------------

/** Build a fresh, fully-alive wall sized to the field width. */
function buildBricks(width: number): Brick[] {
  const totalGaps = (BRICK_COLS - 1) * BRICK_GAP;
  const brickW = (width - 2 * BRICK_MARGIN - totalGaps) / BRICK_COLS;
  const bricks: Brick[] = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    const y = BRICK_TOP + row * (BRICK_H + BRICK_GAP);
    for (let col = 0; col < BRICK_COLS; col++) {
      const x = BRICK_MARGIN + col * (brickW + BRICK_GAP);
      bricks.push({ x, y, w: brickW, h: BRICK_H, alive: true });
    }
  }
  return bricks;
}

// --- Ball helpers -----------------------------------------------------------

/** Rest the (dead) ball centered just above the paddle. */
function restBallOnPaddle(state: BreakerState): void {
  state.ball.x = state.paddleX + state.paddleW / 2;
  state.ball.y = paddleTopY(state.height) - BALL_R;
}

/** Launch the ball upward at a seeded angle, scaled by the current speedMul. */
function launchBall(state: BreakerState): void {
  const spread = nextRandom(state) * 2 - 1; // -1 .. 1
  state.ball = {
    x: state.paddleX + state.paddleW / 2,
    y: paddleTopY(state.height) - BALL_R,
    vx: spread * BALL_VX_MAX * state.speedMul,
    vy: -BALL_VY0 * state.speedMul,
    live: true,
  };
}

/** Move the paddle from pointer (absolute) or held left/right (relative). */
function movePaddle(state: BreakerState, dt: number, input: GameInput): void {
  const maxX = state.width - state.paddleW;
  if (input.pointerX != null) {
    state.paddleX = clamp(input.pointerX - state.paddleW / 2, 0, maxX);
  } else {
    if (input.left) state.paddleX -= PADDLE_KB_SPEED * dt;
    if (input.right) state.paddleX += PADDLE_KB_SPEED * dt;
    state.paddleX = clamp(state.paddleX, 0, maxX);
  }
}

// --- State construction -----------------------------------------------------

function createState(opts: InitOptions): BreakerState {
  const width = opts.width ?? DEFAULT_WIDTH;
  const height = opts.height ?? DEFAULT_HEIGHT;
  const seed = (opts.seed ?? DEFAULT_SEED) | 0;

  const paddleX = (width - PADDLE_W) / 2;
  const state: BreakerState = {
    phase: "idle",
    width,
    height,
    // Seed must be nonzero for mulberry32 to be lively; coerce 0 → DEFAULT.
    rng: seed === 0 ? DEFAULT_SEED : seed,
    score: 0,
    stage: 0,
    flash: null,
    paddleX,
    paddleW: PADDLE_W,
    ball: {
      x: paddleX + PADDLE_W / 2,
      y: paddleTopY(height) - BALL_R,
      vx: 0,
      vy: 0,
      live: false,
    },
    bricks: buildBricks(width),
    speedMul: 1,
  };
  return state;
}

// --- The step function ------------------------------------------------------

function step(state: BreakerState, dtMs: number, input: GameInput): BreakerState {
  const dt = Math.min(Math.max(dtMs, 0), 50) / 1000; // seconds

  // ----- idle: a press launches the ball and starts the round -----
  if (state.phase === "idle") {
    if (!input.primary) {
      // Let the paddle track the pointer while waiting; the ball rides it.
      movePaddle(state, dt, input);
      restBallOnPaddle(state);
      return state;
    }
    state.phase = "running";
    launchBall(state);
    // Fall through to the running block so the paddle moves on the launch frame.
  } else if (state.phase === "over") {
    // ----- over: a press rebuilds the wall and starts again -----
    if (!input.primary) return state;
    const fresh = createState({
      seed: state.rng,
      width: state.width,
      height: state.height,
    });
    Object.assign(state, fresh);
    state.phase = "running";
    launchBall(state);
    // Fall through to the running block.
  }

  // ----- running -----
  movePaddle(state, dt, input);

  const ball = state.ball;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  // Reflect off the side walls and the ceiling.
  if (ball.x < BALL_R) {
    ball.x = BALL_R;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x > state.width - BALL_R) {
    ball.x = state.width - BALL_R;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y < BALL_R) {
    ball.y = BALL_R;
    ball.vy = Math.abs(ball.vy);
  }

  // Paddle bounce: only while descending and overlapping the paddle row. The
  // horizontal kick depends on where the ball struck, so edge hits angle out.
  const pTop = paddleTopY(state.height);
  const paddleBox: Box = {
    x: state.paddleX,
    y: pTop,
    w: state.paddleW,
    h: PADDLE_H,
  };
  if (ball.vy > 0 && overlap(ballBox(ball), paddleBox)) {
    const rel = clamp(
      (ball.x - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2),
      -1,
      1,
    );
    ball.vy = -Math.abs(ball.vy);
    ball.vx = rel * BALL_VX_MAX * state.speedMul;
    ball.y = pTop - BALL_R; // lift clear so it can't re-trigger next frame
  }

  // Brick collision (one brick per frame): chip it, score it, bounce vertically.
  const bb = ballBox(ball);
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (overlap(bb, brick)) {
      brick.alive = false;
      state.score += 1;
      ball.vy = -ball.vy;
      break;
    }
  }

  // Wall cleared → ship it: celebrate, rebuild, speed up.
  if (state.bricks.every((b) => !b.alive)) {
    state.stage += 1;
    state.flash = { text: "SHIPPED ✦", ms: FLASH_MS };
    const prevMul = state.speedMul;
    state.speedMul = Math.min(state.speedMul * SPEED_STEP, SPEED_CAP);
    const factor = state.speedMul / prevMul;
    ball.vx *= factor;
    ball.vy *= factor;
    state.bricks = buildBricks(state.width);
  }

  // Ball slipped below the paddle → round over.
  if (ball.y > state.height) {
    state.phase = "over";
  }

  // Flash countdown.
  if (state.flash) {
    state.flash.ms -= dtMs;
    if (state.flash.ms <= 0) state.flash = null;
  }

  return state;
}

// --- Rendering --------------------------------------------------------------

function render(
  ctx: CanvasRenderingContext2D,
  state: BreakerState,
  opts: RenderOptions,
): void {
  const s = opts.scale;
  const { colors } = opts;
  const { width, height } = state;

  // Background.
  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, width * s, height * s);

  // Bricks.
  ctx.fillStyle = colors.ink;
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    ctx.fillRect(
      Math.round(brick.x) * s,
      Math.round(brick.y) * s,
      Math.round(brick.w) * s,
      Math.round(brick.h) * s,
    );
  }

  // Paddle.
  ctx.fillRect(
    Math.round(state.paddleX) * s,
    paddleTopY(height) * s,
    state.paddleW * s,
    PADDLE_H * s,
  );

  // Ball (hidden only once the round is over and it has fallen away).
  if (state.phase !== "over") {
    ctx.fillRect(
      Math.round(state.ball.x - BALL_R) * s,
      Math.round(state.ball.y - BALL_R) * s,
      BALL_SIZE * s,
      BALL_SIZE * s,
    );
  }

  // Chrome.
  drawScore(ctx, `${state.score}`, width, s, colors);
  if (state.flash) {
    drawFlash(ctx, state.flash.text, state.flash.ms, width, height, s, colors);
  }
  if (state.phase === "idle") {
    drawIdlePrompt(ctx, "SLIDE + SPACE", "TO PLAY", width, height, s, colors);
  }
  if (state.phase === "over") {
    drawOverPlate(ctx, "DROPPED", width, height, s, colors);
  }
}

// --- Module -----------------------------------------------------------------

const breaker: GameModule<BreakerState> = {
  id: "breaker",
  name: "Chip the wall",
  tagline: "Slide the paddle. Clear the wall, brick by brick.",
  scoreUnit: "",
  highScoreId: "breaker",
  ariaLabel:
    "Chip the wall: a pixel brick-breaker. Slide with the arrow keys or your finger; press space to launch the ball. The course links are below.",
  controlsHint: "Slide left/right; press space to launch.",

  createState,
  step,
  render,

  getScore: (state) => state.score,
  getStage: (state) => state.stage,
  hasMilestones: () => true,
  isIdle: (state) => state.phase === "idle",
  isOver: (state) => state.phase === "over",
  gameOverLine: (state) =>
    `You chipped ${state.score} bricks before the ball slipped. A big project is just small bricks — chip the next one.`,
};

export default breaker;
