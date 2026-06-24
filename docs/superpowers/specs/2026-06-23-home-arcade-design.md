# Home Arcade — "Ship It" three-game pixel hero

- **Date:** 2026-06-23
- **Branch:** `feat/home-arcade`
- **Surface:** `site/` (Next.js 16 App Router, React 19, Tailwind v4, monochrome design tokens)

## Goal

Make the landing page open with a **playable, black-and-white, pixelated, one-button
arcade** — Chrome-dino mechanics — that a non-technical visitor can play in three
seconds without instructions. It exists to *communicate a feeling*: building real
things is an iterative loop of **ship → crash → ship again**, and with AI coding
tools an ordinary person can do it. The game-over card carries that message and
points at "Start the course →".

Three games share one engine and one chrome. A switcher cycles between them; each
keeps its own high score.

| # | id | Name (switcher) | Avatar | Hops over | Score unit | Special mechanic |
|---|------|-----------------|--------|-----------|-----------|------------------|
| 1 | `rocket` | **Ship it** | pixel rocket | bug · error · wall | `m` ("shipped") | speed ramps with distance |
| 2 | `boat` | **Set sail** | paper boat | rock · buoy · big wave | `nm` ("sailed") | animated wave baseline |
| 3 | `builder` | **Build it** | builder + crate | pit · bug | `m` ("built") | crate **grows** at milestones → "SHIPPED!" flash |

## Non-goals (YAGNI)

- No backend, no server leaderboard. High scores live in `localStorage` only.
- No sound.
- One button only (Space / ArrowUp / click / tap → jump). No ducking, no second action.
- No level editor, no power-ups beyond the builder's crate growth.
- Does **not** replace or reword the existing hero copy, CTAs, or curriculum — it sits above them.

## Placement & page integration

`page.tsx` stays a **server component**. It renders one client island,
`<ShipGameHero />`, at the top of the page, *wrapping* the existing hero copy:

- The game canvas is the visual centerpiece.
- The existing `h1` "Ship your first thing.", the `TAGLINE` paragraph, and the two
  CTAs ("Start the course →", "Create an account") remain present in the DOM,
  positioned beneath/around the canvas. **These must stay verbatim** — `e2e/home.spec.ts`
  asserts them.
- "How the course works" and "The curriculum" sections remain unchanged below.

The game is a **progressive enhancement**: if JS is disabled or `prefers-reduced-motion`
is set, the page is still a complete, navigable landing page with all copy and CTAs.

## Architecture

```
site/src/components/ship-game/
  types.ts            # GameDef, Bitmap, ObstacleType, GameState (pure types)
  engine.ts           # pure state machine: createInitialState(), step(); NO DOM/canvas import
  sprites.ts          # Bitmap helpers: parse rows → pixel grid, measure, draw-to-ctx helper
  renderer.ts         # draws a GameState to a CanvasRenderingContext2D using theme colors
  registry.ts         # GAMES: readonly GameDef[] (rocket, boat, builder) + default order
  games/
    rocket.ts         # GameDef
    boat.ts           # GameDef
    builder.ts        # GameDef
  use-ship-game.ts    # React hook: canvas ref + rAF loop + input + state, respects reduced-motion
  ShipGameHero.tsx    # 'use client' — frame, headline slot, switcher, scoreboard, game-over card, CTAs
```

Unit tests (Vitest, `environment: "node"`, pure logic only) live in:
```
site/tests/arcade-engine.test.ts     # collision, scoring, difficulty ramp, state machine
site/tests/arcade-rocket.test.ts     # rocket GameDef shape + milestone behavior
site/tests/arcade-boat.test.ts
site/tests/arcade-builder.test.ts    # crate-growth stage progression
```

E2E smoke (Playwright):
```
site/e2e/home-arcade.spec.ts         # canvas present, switcher cycles 3 games, keyboard jump, reduced-motion path
```

### The engine is pure

`engine.ts` exports:

```ts
createInitialState(def: GameDef, opts?: { now?: number }): GameState
step(state: GameState, dtMs: number, input: { jump: boolean }, def: GameDef): GameState
```

- No `window`, `document`, or `canvas` import — so it runs under Vitest's node env.
- `step` advances physics (gravity, jump impulse, ground clamp), spawns/advances
  obstacles (timed, min-gap scales with speed), accumulates score, ramps speed,
  runs AABB collision, and transitions the state machine. Deterministic given a
  seeded RNG carried in `GameState` (no `Math.random()` in the hot path so tests
  are reproducible — seed lives in state).
- State machine: `"idle" → "running" → "over"`. `idle` shows a "press space" prompt
  and does **not** auto-animate gameplay (reduced-motion friendly).

### Rendering reads theme tokens

`renderer.ts` reads `--ink` and `--paper` from the canvas element's computed style
(`getComputedStyle`) once per frame (or on theme change) so the game is correct in
both light and dark mode with zero `dark:` utilities. Backbuffer is **low-res and
integer-scaled** with `image-rendering: pixelated` (CSS) for crisp pixels at any
size. Only two ink levels are used (filled vs. empty) plus an optional faint dither
for the baseline — strictly monochrome, matching the design system's "hierarchy by
value, never hue" rule.

### GameDef interface (complete — covers all three games so game files never touch shared code)

```ts
export type Bitmap = readonly string[]; // rows; any non-space char = filled pixel

export interface ObstacleType {
  readonly sprite: Bitmap;
  readonly grounded: boolean;     // true: sits on baseline; false: floats at a y offset
  readonly floatY?: number;       // logical px above baseline when !grounded
  readonly weight?: number;       // spawn weighting (default 1)
}

export interface AvatarCtx { readonly score: number; readonly stage: number; }

export interface GameDef {
  readonly id: "rocket" | "boat" | "builder";
  readonly name: string;          // switcher label, e.g. "Ship it"
  readonly tagline: string;       // one short line shown under the switcher
  readonly avatar: Bitmap | ((ctx: AvatarCtx) => Bitmap); // function form → crate growth
  readonly obstacles: readonly ObstacleType[];
  readonly baseline: "flat" | "wave";
  readonly scoreUnit: string;     // "m" | "nm"
  readonly scoreVerb: string;     // "shipped" | "sailed" | "built"
  readonly milestoneEvery?: number;           // score interval that bumps `stage` + fires a flash
  readonly flashText?: (stage: number) => string; // e.g. () => "SHIPPED ✦"
  readonly gameOverLine: (score: number, stage: number) => string; // course-message tie
}
```

- **Builder crate growth** = `avatar` as a function returning a taller crate per `stage`;
  `milestoneEvery` bumps `stage`; `flashText` returns "SHIPPED ✦".
- **Boat waves** = `baseline: "wave"` (renderer animates a sine baseline).
- **Rocket** = plain `flat` baseline, `avatar` Bitmap, three grounded/floating obstacles.

## The three games (content)

1. **rocket — "Ship it"**: rocket taxis a launchpad. Obstacles: small `bug` (grounded),
   `error` X (grounded), tall `wall` (grounded). `gameOverLine`:
   *"You shipped {n} m before it crashed. Real builders ship, crash, and ship again."*
2. **boat — "Set sail"**: paper boat on a wave baseline. Obstacles: `rock` (grounded),
   `buoy` (grounded), `big wave` (grounded, taller). `gameOverLine`:
   *"{n} nm sailed. Every shipped thing started as a leaky first draft."*
3. **builder — "Build it"**: builder hauls a crate that grows every `milestoneEvery` m
   (stages 1→5), flashing "SHIPPED ✦". Obstacles: `pit` (a gap — modeled as a grounded
   spike the hop clears) and `bug`. `gameOverLine`:
   *"Your crate reached stage {stage}/5 before the stumble. You ship by finishing — keep going."*

## Controls & accessibility

- **Input:** Space / ArrowUp / click on canvas / touch → `jump`. Enter or click on
  game-over → restart.
- **No scroll trap:** keydown for Space is captured **only when the canvas/game is
  focused or hovered and a round is active**; otherwise Space scrolls the page normally.
  `e.preventDefault()` only in the captured case.
- **Reduced motion:** when `prefers-reduced-motion: reduce`, the loop does not auto-run;
  the canvas shows a static framed start screen ("Press space to play"). Starting a
  round on explicit input is allowed; we simply never animate without intent.
- **Keyboard reachable:** canvas (or its wrapper) is focusable (`tabIndex={0}`) with a
  visible focus ring; `aria-label` describes the game; a visually-hidden text fallback
  states the score and that the real course links are below.
- **Switcher:** rendered as real `<button>`s (or a radio group) with `aria-pressed`;
  Left/Right arrows cycle when the switcher is focused.

## Persistence

`localStorage` key per game: `syft.arcade.highscore.<id>`. Read on mount, written on
game-over when beaten. Guard for `localStorage` unavailability (private mode / SSR).

## Testing

- `pnpm typecheck` — clean.
- `pnpm build` — clean (Turbopack; the only check that parses Tailwind/CSS correctly).
- `pnpm test` (Vitest) — engine + per-game logic, all node-pure.
- `pnpm e2e` (Playwright) — `home-arcade.spec.ts` smoke + the existing `home.spec.ts`
  must still pass unchanged.

## Build orchestration (workflow)

1. **Foundation** (1 agent): build `types/engine/sprites/renderer/registry`, three
   *working-but-rough* `GameDef`s, `use-ship-game` hook, `ShipGameHero`, and wire
   `page.tsx`. Deliver a state where `pnpm typecheck` + `pnpm build` pass and all
   three games are selectable and playable. Add `arcade-engine.test.ts`.
2. **Games** (3 agents, parallel): each polishes one `games/<id>.ts` (sprites,
   obstacle variety, themed copy, milestone/crate for builder) and writes
   `tests/arcade-<id>.test.ts`. Edits **only** its own game file + its test — never
   shared files (the interface above is complete enough that it never needs to).
3. **Integration** (1 agent): run typecheck + build + vitest; ensure registry lists
   all three; confirm existing hero copy/CTAs/curriculum preserved; add
   `e2e/home-arcade.spec.ts`; fix any breakage.
4. **Review** (parallel dimensions): correctness/bugs · a11y + reduced-motion +
   scroll-trap · theme-token/dark-mode correctness · touch/mobile + perf.
5. **Fix** (1 agent): apply confirmed findings; re-run typecheck + build + test.

Orchestrator verifies the running app (dev server + screenshot) and commits.
