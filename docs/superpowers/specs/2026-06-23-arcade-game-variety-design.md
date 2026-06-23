# Home Arcade — game variety (replace the two repetitive runners, add a shooter)

- **Date:** 2026-06-23
- **Branch:** `feat/home-arcade`
- **Surface:** `site/` (Next.js 16 App Router, React 19, Tailwind v4, monochrome design tokens)
- **Supersedes (partially):** `2026-06-23-home-arcade-design.md` — that spec shipped a 3-game,
  one-mechanic arcade. This spec evolves it.

## Why

The shipped arcade has three games (`rocket`, `boat`, `builder`) but **one verb**: press a button
to jump over scrolling obstacles. `engine.ts` *is* that mechanic; a `GameDef` only changes the
costume (avatar sprite, obstacle list, baseline style, copy). The three games therefore feel
identical, which defeats the point of a switcher.

This change makes the arcade carry **four genuinely different popular game concepts**, each
communicating one distinct thing about the course. It keeps `builder` (the one non-repetitive
game — it has the growing crate) and replaces `rocket` + `boat` with three new mechanics.

## The four games (final)

| # | id | Name (switcher) | Concept (popular game) | Primary controls | Course message (load-bearing) |
|---|------|-----------------|-----------------------|------------------|-------------------------------|
| 1 | `breaker` | **Chip the wall** | Breakout / brick-breaker | slide paddle ◀▶ + launch | A scary-big project is just small bricks. Chip the next one; a missed bounce just means you serve again. |
| 2 | `sorter`  | **Ship the good** | catch-and-sort | slide tray ◀▶ | The agent builds; **you** steer — catch the good edits, let the bugs drop. (The smell-test, as a game.) |
| 3 | `shooter` | **Keep it live** | Space Invaders | slide ◀▶ + fire | Shipped isn't done. Problems keep coming at your live app — knock them down and keep shipping fixes. |
| 4 | `builder` | **Build it** *(kept)* | endless runner (jump) | jump | You ship by finishing. Every milestone is a thing actually shipped (the growing crate). |

**Switcher order (default first):** `breaker → sorter → shooter → builder`. The default game on
first load is `breaker` (most instantly legible/approachable). Order and default are a one-line
change in `registry.ts`.

Each game keeps its own `localStorage` high score, keyed by id.

### Why these messages (and why no overlap)

- `builder` = **finish** (persistence to completion).
- `breaker` = **decompose** (break a big thing into small shippable hits).
- `sorter` = **discriminate** (the human-in-the-loop: spot and reject bad agent output — the
  course's actual subject; currently *no* game says this).
- `shooter` = **maintain / resilience** (re-carries the original `rocket`'s "ship → crash → ship
  again" soul in a fresh mechanic).

Bugs appear in both `sorter` (something you *drop*) and `shooter` (something you *shoot*). The
actions are opposite, so the messages stay crisp; sprites are visually distinct (a check vs. an X,
a falling bug vs. a marching invader).

## Architecture: from "one engine + data" to "harness + pluggable modules"

The current design cannot express different *verbs* as data. We promote the engine into a **harness
plus pluggable game modules**. The harness stays generic; each game brings its own rules.

### Reusable harness (stays generic — ~60% of today's code)

- Theme-aware monochrome rendering: read `--ink` / `--paper` / `--ink-faint` off the canvas, flip
  on the `.dark` class via `MutationObserver`. **Never hardcode `#000`/`#fff` in a draw path.**
- The 5×7 pixel font + `drawText` / `textWidth` (extracted to a shared `text.ts`).
- Shared HUD helpers (extracted to `hud.ts`): `drawScore`, `drawIdlePrompt`, `drawOverPlate`,
  `drawFlash` — each game composes these so the chrome stays consistent.
- `blit` + `spriteWidth` / `spriteHeight` / `forEachPixel` (existing `sprites.ts`, unchanged).
- The fixed-timestep `requestAnimationFrame` accumulator loop (in `use-ship-game.ts`).
- Per-game `localStorage` high score (guarded for private mode), reduced-motion handling
  (never auto-run; static idle frame; only animate after explicit input), canvas sizing +
  integer pixel scale + `image-rendering: pixelated`.

### New abstraction: `GameModule`

A game is no longer data consumed by one engine — it's a small module the harness drives. Defined
in `types.ts`:

```ts
export interface GameModule<S = unknown> {
  readonly id: string;                 // "breaker" | "sorter" | "shooter" | "builder"
  readonly name: string;               // switcher label, e.g. "Chip the wall"
  readonly tagline: string;            // one line under the switcher
  readonly scoreUnit: string;          // suffix on the score (may be "")
  readonly highScoreId: string;        // localStorage key suffix (defaults to id)

  /** Accessibility: per-game canvas label + a short control hint string. */
  readonly ariaLabel: string;
  readonly controlsHint: string;       // e.g. "Slide left/right, press space to fire."

  /** Pure, deterministic lifecycle. RNG seed lives in S; never Math.random()/Date.now(). */
  createState(opts: InitOptions): S;
  step(state: S, dtMs: number, input: GameInput): S;
  render(ctx: CanvasRenderingContext2D, state: S, opts: RenderOptions): void;

  /** Chrome accessors (the React chrome reads these, never S's internals). */
  getScore(state: S): number;
  getStage(state: S): number;          // 0 when the game has no milestones
  hasMilestones(state: S): boolean;    // drives the "stage x/5" scoreboard slot
  isIdle(state: S): boolean;
  isOver(state: S): boolean;
  gameOverLine(state: S): string;
}
```

### Generalized input

`GameInput` grows from one button to a tiny shared vocabulary. Each module reads only what it needs;
the harness fills all fields every tick.

```ts
export interface GameInput {
  /** Edge-triggered primary press (was `jump`). runner=jump/start; breaker=launch/serve;
   *  sorter=start only; shooter=fire; all=restart when over. */
  readonly primary: boolean;
  /** Held movement (paddle / tray / shooter ship). */
  readonly left: boolean;
  readonly right: boolean;
  /** Logical-x of an active pointer/touch (for drag-to-move), or null. */
  readonly pointerX: number | null;
}
```

The existing runner's `jump` becomes `primary`. (`engine.ts` and its tests update accordingly.)

### Module inventory after the change

```
site/src/components/ship-game/
  types.ts            # + GameModule, generalized GameInput; GameDef.id loosened to string
  sprites.ts          # unchanged
  text.ts             # NEW: FONT + drawText + textWidth (extracted from renderer.ts)
  hud.ts              # NEW: drawScore/drawIdlePrompt/drawOverPlate/drawFlash (extracted/generalized)
  engine.ts           # unchanged physics; `jump`→`primary`; still the runner's pure step
  renderer.ts         # runner render only; imports text.ts + hud.ts
  registry.ts         # GAMES: GameModule[] = [breaker, sorter, shooter, runnerModule(builder)]
  games/
    builder.ts        # KEPT (GameDef)
    runner-module.ts  # NEW: makeRunnerModule(def: GameDef): GameModule  (wraps engine+renderer)
    breaker.ts        # NEW: GameModule (own state/step/render)
    sorter.ts         # NEW: GameModule
    shooter.ts        # NEW: GameModule
    rocket.ts         # DELETED
    boat.ts           # DELETED
  use-ship-game.ts    # harness: collects GameInput, drives module.step/render + chrome accessors
  ShipGameHero.tsx    # switcher/scoreboard/over-card read GameModule (no hardcoded "jump"/"one-button")
```

`builder` stays a `GameDef` consumed by `makeRunnerModule(builder)`, so the runner engine and the
crate-growth/milestone logic are preserved verbatim — only wrapped to satisfy `GameModule`.

## Per-game mechanics

All games: logical field 240×80, strict on/off pixels, seeded RNG in state, theme colors passed in,
difficulty ramps with score, reduced-motion safe (no auto-run), one mistake ends the round (parity
with the runner), milestone flash reuses "SHIPPED ✦".

### `breaker` — "Chip the wall" (Breakout)

- A wall of bricks across the top (e.g. 8 cols × 3 rows). A paddle near the bottom you move with
  `left`/`right` or `pointerX`. A ball with `vx/vy`.
- `primary` from idle **launches** the ball off the paddle (seeded launch angle). Ball bounces off
  side/top walls and the paddle; paddle deflection angle depends on where it hits (classic).
- Hitting a brick removes it and scores. Clearing the wall = a milestone (flash "SHIPPED ✦") and a
  fresh, slightly faster wall respawns → endless.
- Dropping the ball below the paddle = **over**.
- Score = bricks broken. Stage = walls cleared.
- `gameOverLine`: e.g. *"You chipped N bricks before the ball slipped. A big project is just small
  bricks — chip the next one."*

### `sorter` — "Ship the good" (catch-and-sort)

- A tray at the bottom you move with `left`/`right` or `pointerX`. Items fall from the top: **good**
  (a check `✓` sprite) and **bad** (a bug/`✗` sprite), mixed by weight, speed ramping with score.
- Catch a **good** item → score++. Catch a **bad** item → **over** (you shipped a bug). Letting a
  **bad** item fall past is correct (no penalty). Missing a **good** item is forgiving (no death) —
  the fatal mistake is *shipping the bad*, which is the smell-test failure the course teaches.
- Every N good items caught = milestone flash.
- Score = good items shipped. Stage = milestones.
- `gameOverLine`: e.g. *"You shipped N good edits, then caught a bug. The agent builds — you decide
  what ships."*

### `shooter` — "Keep it live" (Space Invaders)

- Your ship sits on the baseline; `left`/`right` or `pointerX` moves it. `primary` **fires** a bullet
  upward (classic one-bullet-in-flight constraint keeps it strategic and cheap).
- A small formation of "problems" (bugs/errors — reuse the rocket sprites) marches side-to-side and
  steps down at the edges. A bullet hitting one removes it and scores.
- Clearing the formation = milestone flash; a fresh, faster wave spawns → endless.
- A problem reaching your row (or touching your ship) = **over**.
- v1: invaders do **not** fire back (keeps determinism + scope tight; downward pressure comes from
  the descent). Noted as a possible later add.
- Score = problems knocked down. Stage = waves cleared.
- `gameOverLine`: e.g. *"You knocked down N before one slipped through. Shipped isn't done — you keep
  it live by fixing fast."*

### `builder` — "Build it" (kept, unchanged behavior)

Endless runner via `makeRunnerModule(builder)`. Crate grows at milestones, "SHIPPED ✦" flash. Jump
maps to `primary`.

## React chrome (`ShipGameHero.tsx`) changes

- Switcher renders `GAMES.map(m => m.name)` (now four buttons). Arrow-key cycling unchanged.
- Canvas `aria-label` comes from `module.ariaLabel` (per game) — **remove** the hardcoded
  "one-button pixel jumping game" string.
- Scoreboard "stage x/5" slot shows only when `module.hasMilestones(state)`.
- Game-over card uses `module.gameOverLine(state)`; CTA "Take the course →" unchanged.
- Live region announces stable transitions only (idle/running/over) — keep the per-frame score out of
  the polite region (existing rule). Wording becomes control-agnostic ("Press a key or tap to play.").
- It still must not touch/reword the page hero copy or CTAs (`e2e/home.spec.ts` asserts those).

## Harness (`use-ship-game.ts`) changes

- Collect the full `GameInput` each tick: `primary` (edge-triggered from Space/ArrowUp/Enter-restart/
  click/tap), `left`/`right` (held, from ArrowLeft/ArrowRight + A/D), `pointerX` (logical-x of an
  active pointer/touch, mapped through the current scale).
- Drive the active `GameModule`: `createState` on mount/switch, `step` in the fixed loop, `render`
  each frame; mirror `getScore`/`getStage`/`isOver`/`isIdle` into React state for the chrome.
- High score keyed by `module.highScoreId`. Reduced-motion, theme MutationObserver, ResizeObserver,
  no-scroll-trap Space capture, pointer/focus interactivity gate — all preserved.
- Keep the per-frame `getComputedStyle` anti-pattern fix (colors read on start + theme-change only).

## Testing

Vitest (node env, pure logic, seeded determinism) + Playwright e2e smoke.

- **Keep:** `arcade-engine.test.ts` (runner physics; update `jump`→`primary`),
  `arcade-builder.test.ts` (crate growth; drive via runner-module or engine directly).
- **Delete:** `arcade-rocket.test.ts`, `arcade-boat.test.ts`.
- **Add:**
  - `arcade-breaker.test.ts` — launch from idle; ball bounces off paddle/walls; brick removed +
    scored on hit; wall-clear bumps stage + flashes; ball drop ⇒ over; determinism from seed.
  - `arcade-sorter.test.ts` — catch good ⇒ score++; catch bad ⇒ over; bad falls past ⇒ safe; speed
    ramps; milestone bump; determinism.
  - `arcade-shooter.test.ts` — fire removes one-in-flight constraint respected; bullet hits invader ⇒
    removed + scored; formation steps at edges; invader reaching baseline ⇒ over; wave-clear bumps
    stage; determinism.
- **Update:** `e2e/home-arcade.spec.ts` — new GAMES list (four names + taglines), assert the switcher
  cycles **four** games, update the canvas `aria-label` assertion (no longer "one-button pixel"),
  keep the reduced-motion + keyboard paths and the "existing hero untouched" assertions.

## Constraints / invariants (do not regress)

1. **Monochrome only** — every pixel uses `colors.ink/paper/faint`; no hue, no hardcoded hex in draw
   paths. Theme flips live via the `.dark` MutationObserver.
2. **Determinism** — RNG seed lives in each game's state; no `Math.random()` / `Date.now()` in any
   `step`. Tests are reproducible.
3. **Reduced motion** — never auto-run; show a static idle frame; only animate after explicit input.
4. **Accessibility** — canvas labelled per game; keyboard-operable; transitions (not per-frame score)
   announced in the polite live region.
5. **CSS-module gate** — none of this adds CSS modules (Tailwind utility classes only), but run
   `pnpm build` before claiming done (Turbopack is the only thing that catches some site errors).
6. **Hero copy untouched** — the page `h1`, `TAGLINE`, and the two CTAs stay verbatim.

## Non-goals (YAGNI)

- No backend / server leaderboard (high scores stay in `localStorage`).
- No sound.
- No invader return-fire in `shooter` v1.
- No multi-ball, power-ups, or level editor in `breaker`.
- No change to the page hero copy, CTAs, curriculum, or "How the course works" sections.

## Blast-radius summary

Delete 2 game files + 2 test files; add 4 game/module files + 3 test files + 2 shared files
(`text.ts`, `hud.ts`); edit `types.ts`, `engine.ts`, `renderer.ts`, `registry.ts`,
`use-ship-game.ts`, `ShipGameHero.tsx`, and `e2e/home-arcade.spec.ts`. Update the
`project_home_arcade_feature` memory after merge.
