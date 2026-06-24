// Shared types for the home-page pixel arcade.
//
// This file is the contract the three game files (rocket / boat / builder)
// program against. It is the ONLY shared file a game agent should need to read:
// a GameDef is data-plus-tiny-functions, so a new game never touches the
// engine, renderer, or sprites. Keep these interfaces stable.

/**
 * A pixel sprite expressed as rows of text. Any non-space character is a filled
 * (ink) pixel; a space is empty (paper). Rows may be ragged — sprite helpers
 * measure the widest row. Example:
 *
 *   ["  #  ", " ### ", "#####"]  // a little triangle
 */
export type Bitmap = readonly string[];

/** A single obstacle kind a game can spawn. */
export interface ObstacleType {
  /** Pixel art for the obstacle. */
  readonly sprite: Bitmap;
  /** true: sits on the baseline. false: floats at `floatY` logical px above it. */
  readonly grounded: boolean;
  /** Logical px above the baseline when `!grounded`. Ignored when grounded. */
  readonly floatY?: number;
  /** Spawn weighting relative to siblings (default 1). Higher = more frequent. */
  readonly weight?: number;
}

/** Context handed to a game's avatar function so it can vary the sprite. */
export interface AvatarCtx {
  /** Current score (in the game's score unit). */
  readonly score: number;
  /** Current milestone stage (0-based until the first milestone, then 1..n). */
  readonly stage: number;
}

/**
 * Everything that makes one game distinct. The engine and renderer consume a
 * GameDef; the three game files only ever export one of these.
 */
export interface GameDef {
  readonly id: string;
  /** Switcher label, e.g. "Ship it". */
  readonly name: string;
  /** One short line shown under the switcher. */
  readonly tagline: string;
  /**
   * Either a fixed sprite, or a function of (score, stage) returning a sprite.
   * The function form powers the builder's crate growth.
   */
  readonly avatar: Bitmap | ((ctx: AvatarCtx) => Bitmap);
  /** The obstacle kinds this game spawns. */
  readonly obstacles: readonly ObstacleType[];
  /** "flat" = static ground line; "wave" = renderer animates a sine baseline. */
  readonly baseline: "flat" | "wave";
  /** Unit suffix on the score, e.g. "m" or "nm". */
  readonly scoreUnit: string;
  /** Past-tense verb for the game-over copy, e.g. "shipped" | "sailed" | "built". */
  readonly scoreVerb: string;
  /** Score interval that bumps `stage` and fires a flash. Omit for no milestones. */
  readonly milestoneEvery?: number;
  /** Flash text for a milestone, given the new stage. e.g. () => "SHIPPED ✦". */
  readonly flashText?: (stage: number) => string;
  /** The course-message tie shown on the game-over card. */
  readonly gameOverLine: (score: number, stage: number) => string;
}

/** State-machine phase. */
export type Phase = "idle" | "running" | "over";

/** A live obstacle on the field. `typeIndex` points back into `def.obstacles`. */
export interface LiveObstacle {
  /** Index into the GameDef's `obstacles` array. */
  readonly typeIndex: number;
  /** Logical x of the obstacle's left edge (decreases as it scrolls left). */
  x: number;
  /** Cached sprite width in logical px. */
  readonly w: number;
  /** Cached sprite height in logical px. */
  readonly h: number;
  /** Logical y of the obstacle's TOP edge, measured from the top of the field. */
  y: number;
}

/**
 * The full game state. Pure data — no DOM, no canvas, no closures over time.
 * Everything the engine needs to advance one tick lives here, including the RNG
 * seed, so `step` is deterministic and tests are reproducible.
 */
export interface GameState {
  readonly id: GameDef["id"];
  phase: Phase;

  /** Logical field dimensions (the low-res backbuffer coordinate space). */
  readonly width: number;
  readonly height: number;
  /** Y of the baseline (ground line), measured from the top of the field. */
  readonly baselineY: number;

  /** Avatar left-edge x (fixed) and its vertical position. */
  readonly avatarX: number;
  /** Avatar y of its TOP edge, from the top of the field. */
  avatarY: number;
  /** Vertical velocity in logical px per second. Negative = upward. */
  vy: number;
  /** Whether the avatar is on the ground (can jump). */
  onGround: boolean;
  /** Cached avatar dims for the current stage (recomputed when stage changes). */
  avatarW: number;
  avatarH: number;
  /**
   * Cached avatar sprite for the current (score, stage). Recomputed only on a
   * stage change (and at construction), never per frame — the renderer reads
   * this instead of calling the avatar function on every rAF tick, so the hot
   * path allocates no fresh Bitmap.
   */
  avatarBitmap: Bitmap;

  /** Live obstacles, left-to-right is newest-to-oldest spawn order not guaranteed. */
  obstacles: LiveObstacle[];

  /** Current horizontal scroll speed in logical px per second. */
  speed: number;
  /** Fractional distance accumulator; floor() of it is the integer score. */
  distance: number;
  /** Integer score in the game's unit. */
  score: number;
  /** Milestone stage: 0 before the first milestone, then 1, 2, … */
  stage: number;

  /** ms until the next obstacle may spawn. */
  spawnTimer: number;

  /** Active flash text (milestone celebration) and ms remaining, or null. */
  flash: { text: string; ms: number } | null;

  /** Total elapsed running time in ms (drives wave animation phase, etc.). */
  elapsedMs: number;

  /** 32-bit RNG state. Advanced by the engine; never read from Math.random(). */
  rng: number;
}

/**
 * Per-frame input shared by every game. The harness fills all fields each tick;
 * each module reads only what it needs (the runner uses `primary`; the paddle /
 * tray / shooter games also use `left`/`right`/`pointerX`).
 */
export interface GameInput {
  /**
   * Edge-triggered primary press (the old one-button `jump`). Meaning per game:
   * runner = jump / start, breaker = launch, sorter = start, shooter = fire; in
   * ALL games it also restarts a finished round.
   */
  readonly primary: boolean;
  /** Held movement (paddle / tray / shooter ship). */
  readonly left: boolean;
  readonly right: boolean;
  /** Logical-x of an active pointer/touch (drag-to-move), or null when absent. */
  readonly pointerX: number | null;
}

/** Options for createInitialState / a module's createState. */
export interface InitOptions {
  /** Seed for the RNG. Defaults to a fixed constant for reproducibility. */
  readonly seed?: number;
  /** Logical field width (default 240). */
  readonly width?: number;
  /** Logical field height (default 80). */
  readonly height?: number;
}

// --- The harness ⇄ game boundary -------------------------------------------
// Below here is the contract the React harness (use-ship-game.ts) drives and
// the contract a game module satisfies. A game is NOT data consumed by one
// engine anymore — it is a small module that brings its own pure step/render,
// so different *verbs* (jump vs. paddle vs. catch vs. shoot) are expressible.

/** Monochrome theme tokens, read off the canvas's computed style each round. */
export interface ThemeColors {
  ink: string;
  paper: string;
  faint: string;
}

/** What the harness passes a module's render() each frame. */
export interface RenderOptions {
  /** Integer pixels-per-logical-pixel. */
  readonly scale: number;
  /** Theme colors (read by the hook, passed in — never re-read per frame). */
  readonly colors: ThemeColors;
  /**
   * When reduced-motion is active and the round is idle, the hook asks for a
   * static prompt frame. Modules may ignore this (the idle phase already draws
   * a static frame); it exists so the renderer never has to know about media
   * queries.
   */
  readonly reducedMotion?: boolean;
}

/**
 * A self-contained game the harness drives. `S` is the game's private state
 * type — opaque to the harness, which only ever touches it through the methods
 * below. Author each module against its concrete `S`; store heterogeneous
 * modules as `AnyGameModule`.
 */
export interface GameModule<S = unknown> {
  /** Stable id; also the default localStorage high-score suffix. */
  readonly id: string;
  /** Switcher label, e.g. "Chip the wall". */
  readonly name: string;
  /** One short line shown under the switcher. */
  readonly tagline: string;
  /** Suffix appended to the score (may be ""). */
  readonly scoreUnit: string;
  /** localStorage high-score key suffix. */
  readonly highScoreId: string;
  /** Per-game canvas aria-label (describes this game's controls). */
  readonly ariaLabel: string;
  /** Short control hint for sighted hints / docs. */
  readonly controlsHint: string;

  /** Pure, deterministic. The RNG seed lives in S; never Math.random()/Date.now(). */
  createState(opts: InitOptions): S;
  step(state: S, dtMs: number, input: GameInput): S;
  render(ctx: CanvasRenderingContext2D, state: S, opts: RenderOptions): void;

  // Chrome accessors — the React chrome reads these, never S's internals.
  getScore(state: S): number;
  /** Milestone stage (0 when the game has no milestones). */
  getStage(state: S): number;
  /** Whether to show the "stage x/5" scoreboard slot. */
  hasMilestones(state: S): boolean;
  isIdle(state: S): boolean;
  isOver(state: S): boolean;
  gameOverLine(state: S): string;
}

/**
 * Existential for heterogeneous lists/refs. A `GameModule<BreakerState>` is NOT
 * assignable to `GameModule<unknown>` (method parameters are contravariant), so
 * the registry and the hook hold modules as `GameModule<any>`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- intentional existential over the private state type
export type AnyGameModule = GameModule<any>;
