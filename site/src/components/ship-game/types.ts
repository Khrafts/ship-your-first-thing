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
  readonly id: "rocket" | "boat" | "builder";
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

/** Per-frame input. One button only. */
export interface GameInput {
  /** True on the frame the jump was requested (edge-triggered by the caller). */
  readonly jump: boolean;
}

/** Options for createInitialState. */
export interface InitOptions {
  /** Seed for the RNG. Defaults to a fixed constant for reproducibility. */
  readonly seed?: number;
  /** Logical field width (default 240). */
  readonly width?: number;
  /** Logical field height (default 80). */
  readonly height?: number;
}
