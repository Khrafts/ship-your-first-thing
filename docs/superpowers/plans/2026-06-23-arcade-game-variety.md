# Arcade Game Variety Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two repetitive jump-runner games (`rocket`, `boat`) with three different-mechanic games (`breaker`, `sorter`, `shooter`), keep `builder`, so the home arcade carries four distinct popular game concepts that each communicate one thing about the course.

**Architecture:** Promote the single "endless-runner engine + data `GameDef`s" into a **harness + pluggable `GameModule`s**. The harness (canvas sizing, theme colors, fixed-timestep loop, high score, reduced-motion, the pixel font, shared HUD helpers) stays generic; each game brings its own pure `createState`/`step`/`render`. The existing runner becomes one module via `makeRunnerModule(builder)`; the three new games are peer modules. Locking the `GameModule`/`GameInput` interface first (Phase A) makes the three game builds (Phase B) independent and parallelizable.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest (node env, pure logic), Playwright (e2e), pnpm. Canvas 2D, monochrome via CSS custom properties.

## Global Constraints

- **Monochrome only.** Every pixel uses `colors.ink` / `colors.paper` / `colors.faint`. No hue, no hardcoded `#000`/`#fff` in any draw path. Theme flips live via the `.dark`-class `MutationObserver`.
- **Determinism.** The RNG seed lives in each game's state. No `Math.random()` / `Date.now()` in any `step`. Tests seed state and are reproducible.
- **Reduced motion.** Never auto-run. Show a static idle frame; only animate after explicit user input.
- **Accessibility.** Canvas labelled per game (`module.ariaLabel`); keyboard-operable; only stable transitions (idle/running/over) announced in the polite live region — never the per-frame score.
- **Hero copy untouched.** The page `h1` "Ship your first thing.", the `TAGLINE`, and the two CTAs ("Start the course →", "Create an account") stay verbatim — `site/e2e/home.spec.ts` asserts them.
- **Logical field:** 240×80. **Integer pixel scale**, `image-rendering: pixelated`.
- **CSS-module gate:** this change adds no CSS modules (Tailwind utilities only), but run `pnpm build` before claiming done — Turbopack catches site errors that lint/test/typecheck miss.
- **Commit conventions:** conventional commits, scope `site`. Never reference AI in commits/branches/PRs; no `Co-Authored-By`.
- **Commands (run from `site/`):** unit `pnpm test`, typecheck `pnpm typecheck` (or `pnpm exec tsc --noEmit`), build `pnpm build`, e2e `pnpm exec playwright test`.

---

# Phase A — Harness (keystone, sequential)

Goal of Phase A: the arcade still works, with **only `builder`**, running on the new `GameModule` harness. Unit tests green throughout; e2e is updated at the end of Phase C.

### Task A1: Extract the pixel font into `text.ts`

**Files:**
- Create: `site/src/components/ship-game/text.ts`
- Modify: `site/src/components/ship-game/renderer.ts` (remove FONT/drawText/textWidth; import them)
- Test: `site/tests/arcade-text.test.ts`

**Interfaces:**
- Produces: `drawText(ctx, text: string, x: number, y: number, s: number): void`, `textWidth(text: string): number`, `FONT: Record<string, Bitmap>`, `GLYPH_H = 5`, `GLYPH_GAP = 1`.
- Consumes: `blit`, `spriteWidth` from `./sprites`; `Bitmap` from `./types`.

- [ ] **Step 1: Write the failing test** — `site/tests/arcade-text.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { textWidth, FONT, GLYPH_H } from "@/components/ship-game/text";

describe("pixel font", () => {
  it("measures a single glyph plus no trailing gap", () => {
    // "1" is 3px wide in this font; a one-char string has no inter-glyph gap.
    expect(textWidth("1")).toBe(3);
  });
  it("adds a 1px gap between glyphs", () => {
    // "11" = 3 + 1(gap) + 3 = 7
    expect(textWidth("11")).toBe(7);
  });
  it("is case-insensitive (uppercases internally)", () => {
    expect(textWidth("a")).toBe(textWidth("A"));
  });
  it("exposes a 5px glyph height and a digit glyph", () => {
    expect(GLYPH_H).toBe(5);
    expect(FONT["0"]).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `cd site && pnpm test arcade-text` → FAIL ("Cannot find module .../text").

- [ ] **Step 3: Create `text.ts`** — move the font block verbatim out of `renderer.ts`. Cut from `renderer.ts` the `FONT` object (currently lines ~44–89), `GLYPH_H`, `GLYPH_GAP` (~91–92), `textWidth` (~94–102), and `drawText` (~104–118). Paste into `text.ts`:

```ts
// Pixel font + text drawing, shared by every game module.
// A 5×7-ish monochrome font; lowercase reuses uppercase glyphs. Unknown chars
// render blank. Extracted from renderer.ts so non-runner games can label too.
import { blit, spriteWidth } from "./sprites";
import type { Bitmap } from "./types";

export const FONT: Record<string, Bitmap> = {
  /* ...paste the exact FONT map moved from renderer.ts... */
};
export const GLYPH_H = 5;
export const GLYPH_GAP = 1;

export function textWidth(text: string): number {
  let w = 0;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch] ?? FONT[" "];
    w += spriteWidth(g) + GLYPH_GAP;
  }
  return Math.max(0, w - GLYPH_GAP);
}

export function drawText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, s: number,
): void {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch] ?? FONT[" "];
    blit(ctx, g, cx, y, s);
    cx += (spriteWidth(g) + GLYPH_GAP) * s;
  }
}
```

- [ ] **Step 4: Update `renderer.ts`** — add `import { drawText, textWidth, FONT, GLYPH_H } from "./text";` and delete the moved definitions. Update the `__fontInternals` export to re-export from text: `export const __fontInternals = { textWidth, FONT, GLYPH_H, spriteHeight };` (keep `spriteHeight` import).

- [ ] **Step 5: Run tests** — `cd site && pnpm test arcade-text arcade-engine` → PASS. `pnpm typecheck` → clean.

- [ ] **Step 6: Commit**

```bash
git add site/src/components/ship-game/text.ts site/src/components/ship-game/renderer.ts site/tests/arcade-text.test.ts
git commit -m "refactor(site): extract pixel font into shared text.ts"
```

---

### Task A2: Extract shared HUD helpers into `hud.ts`

**Files:**
- Create: `site/src/components/ship-game/hud.ts`
- Modify: `site/src/components/ship-game/renderer.ts` (use the helpers)

**Interfaces:**
- Consumes: `drawText`, `textWidth`, `GLYPH_H` from `./text`; `ThemeColors` from `./renderer` (or move `ThemeColors` to `./types` — see step 1).
- Produces (all game-agnostic — primitives only, no `GameState`):
  - `drawScore(ctx, label: string, fieldW: number, s: number, colors: ThemeColors): void` — top-right.
  - `drawFlash(ctx, text: string, ms: number, fieldW: number, fieldH: number, s: number, colors: ThemeColors): void` — centered; fades to `faint` when `ms < 250`.
  - `drawIdlePrompt(ctx, main: string, sub: string, fieldW: number, fieldH: number, s: number, colors: ThemeColors): void` — centered prompt + faint sub.
  - `drawOverPlate(ctx, text: string, fieldW: number, fieldH: number, s: number, colors: ThemeColors): void` — inverted plate.

- [ ] **Step 1: Move `ThemeColors` to `types.ts`** to avoid a `renderer ↔ hud` import cycle. In `types.ts` add:

```ts
export interface ThemeColors { ink: string; paper: string; faint: string; }
```
In `renderer.ts` replace the local `ThemeColors` interface with `import type { ThemeColors } from "./types";` and `export type { ThemeColors };` (keep the named export so existing importers — `use-ship-game.ts` — are unaffected).

- [ ] **Step 2: Create `hud.ts`** — lift the score/flash/idle/over draw blocks out of `renderer.ts`'s `render()` (currently the score block ~200–204, flash ~206–213, idle ~215–231, over ~233–247) into parameterized helpers:

```ts
// Shared HUD bits every game composes: score, milestone flash, idle prompt,
// game-over plate. Primitives only (no GameState) so any module can call them.
import { drawText, textWidth, GLYPH_H } from "./text";
import type { ThemeColors } from "./types";

export function drawScore(ctx: CanvasRenderingContext2D, label: string, fieldW: number, s: number, colors: ThemeColors): void {
  ctx.fillStyle = colors.ink;
  const w = textWidth(label.toUpperCase()) * s;
  drawText(ctx, label, fieldW * s - w - 4 * s, 4 * s, s);
}

export function drawFlash(ctx: CanvasRenderingContext2D, text: string, ms: number, fieldW: number, fieldH: number, s: number, colors: ThemeColors): void {
  ctx.fillStyle = ms < 250 ? colors.faint : colors.ink;
  const tw = textWidth(text) * s;
  drawText(ctx, text, (fieldW * s - tw) / 2, Math.round(fieldH * 0.32) * s, s);
}

export function drawIdlePrompt(ctx: CanvasRenderingContext2D, main: string, sub: string, fieldW: number, fieldH: number, s: number, colors: ThemeColors): void {
  const W = fieldW * s;
  ctx.fillStyle = colors.ink;
  const pw = textWidth(main) * s;
  drawText(ctx, main, (W - pw) / 2, Math.round(fieldH * 0.42) * s, s);
  ctx.fillStyle = colors.faint;
  const sw = textWidth(sub) * s;
  drawText(ctx, sub, (W - sw) / 2, Math.round(fieldH * 0.42 + 8) * s, s);
}

export function drawOverPlate(ctx: CanvasRenderingContext2D, text: string, fieldW: number, fieldH: number, s: number, colors: ThemeColors): void {
  const W = fieldW * s;
  const ow = textWidth(text) * s;
  const plateW = ow + 8 * s;
  const plateH = (GLYPH_H + 6) * s;
  const px = (W - plateW) / 2;
  const py = Math.round(fieldH * 0.36) * s;
  ctx.fillStyle = colors.ink;
  ctx.fillRect(px, py, plateW, plateH);
  ctx.fillStyle = colors.paper;
  drawText(ctx, text, px + 4 * s, py + 3 * s, s);
}
```

- [ ] **Step 3: Rewrite `renderer.ts` `render()`** to call the helpers for the score/flash/idle/over sections (pass `state.score+def.scoreUnit`, `state.flash.text/ms`, `"PRESS SPACE"/"TO PLAY"`, `"CRASHED"`, and `state.width/height`). Keep the baseline/ground/obstacle/avatar drawing inline (runner-specific).

- [ ] **Step 4: Verify** — `cd site && pnpm test arcade-engine arcade-text && pnpm typecheck` → all green (HUD has no unit test; it's exercised by e2e + typecheck, matching the existing renderer's test boundary).

- [ ] **Step 5: Commit**

```bash
git add site/src/components/ship-game/hud.ts site/src/components/ship-game/renderer.ts site/src/components/ship-game/types.ts
git commit -m "refactor(site): extract shared HUD helpers into hud.ts"
```

---

### Task A3: Define `GameModule` + generalized `GameInput` in `types.ts`

**Files:**
- Modify: `site/src/components/ship-game/types.ts`

**Interfaces:**
- Produces: `GameModule<S>`, `AnyGameModule`, the new `GameInput` shape, `RenderOptions` (re-exported), `ThemeColors` (already added in A2).
- Consumes: existing `InitOptions`, `Bitmap`.

- [ ] **Step 1: Replace `GameInput`** (currently `{ jump }`) with:

```ts
/** Per-frame input shared by all games. Each module reads only what it needs. */
export interface GameInput {
  /** Edge-triggered primary press: runner=jump/start, breaker=launch, sorter=start,
   *  shooter=fire; ALL games: restart when over. */
  readonly primary: boolean;
  /** Held movement. */
  readonly left: boolean;
  readonly right: boolean;
  /** Logical-x of an active pointer/touch (drag-to-move), or null. */
  readonly pointerX: number | null;
}
```

- [ ] **Step 2: Add `RenderOptions` to types** (so modules don't import it from renderer). Move/duplicate:

```ts
export interface RenderOptions {
  readonly scale: number;
  readonly colors: ThemeColors;
  readonly reducedMotion?: boolean;
}
```
Update `renderer.ts` to `import type { RenderOptions } from "./types"` and `export type { RenderOptions }`.

- [ ] **Step 3: Add the `GameModule` interface:**

```ts
/** A self-contained game the harness drives. S is the game's private state type. */
export interface GameModule<S = unknown> {
  readonly id: string;
  readonly name: string;        // switcher label
  readonly tagline: string;
  readonly scoreUnit: string;   // suffix on the score (may be "")
  readonly highScoreId: string; // localStorage suffix
  readonly ariaLabel: string;   // canvas aria-label
  readonly controlsHint: string;

  createState(opts: InitOptions): S;
  step(state: S, dtMs: number, input: GameInput): S;
  render(ctx: CanvasRenderingContext2D, state: S, opts: RenderOptions): void;

  getScore(state: S): number;
  getStage(state: S): number;       // 0 if no milestones
  hasMilestones(state: S): boolean; // drives the "stage x/5" scoreboard
  isIdle(state: S): boolean;
  isOver(state: S): boolean;
  gameOverLine(state: S): string;
}

/** Existential for heterogeneous lists/refs (method params are contravariant,
 *  so GameModule<Specific> is NOT assignable to GameModule<unknown>). */
export type AnyGameModule = GameModule<any>;
```

- [ ] **Step 4: Loosen `GameDef["id"]`** from the `"rocket" | "boat" | "builder"` union to `string` (rocket/boat are being deleted; builder keeps working). Update the `GameState.id` field type to `string` too.

- [ ] **Step 5: Verify** — `cd site && pnpm typecheck`. Expect errors only where `engine.ts`/tests still reference `input.jump` — fixed in A4. Commit after A4 (these are co-dependent).

---

### Task A4: Rename runner input `jump → primary` (engine + test)

**Files:**
- Modify: `site/src/components/ship-game/engine.ts` (3 reads of `input.jump` → `input.primary`: in the idle branch, the over branch, and the running jump)
- Modify: `site/tests/arcade-engine.test.ts` (all `{ jump: true/false }` → `{ primary: ... }`)

- [ ] **Step 1: Update the test first** — replace every `{ jump: true }`/`{ jump: false }` literal in `arcade-engine.test.ts` with `{ primary: true, left: false, right: false, pointerX: null }` / `{ primary: false, left: false, right: false, pointerX: null }`. (Add a local helper `const press = (p: boolean): GameInput => ({ primary: p, left: false, right: false, pointerX: null });` and use `press(true)`/`press(false)`.)

- [ ] **Step 2: Run test to verify it fails** — `cd site && pnpm test arcade-engine` → FAIL (engine still reads `input.jump`, now `undefined` → no jumps occur).

- [ ] **Step 3: Update `engine.ts`** — change the three `input.jump` reads to `input.primary` (idle-start ~line 292, over-restart ~line 308, running-jump ~line 321).

- [ ] **Step 4: Run tests** — `cd site && pnpm test arcade-engine` → PASS. `pnpm typecheck` → clean (modulo registry/hook, fixed later).

- [ ] **Step 5: Commit**

```bash
git add site/src/components/ship-game/types.ts site/src/components/ship-game/engine.ts site/src/components/ship-game/renderer.ts site/tests/arcade-engine.test.ts
git commit -m "feat(site): add GameModule + generalized GameInput; runner jump→primary"
```

---

### Task A5: Wrap the runner as a `GameModule` (`runner-module.ts`)

**Files:**
- Create: `site/src/components/ship-game/games/runner-module.ts`
- Test: `site/tests/arcade-runner-module.test.ts`

**Interfaces:**
- Consumes: `createInitialState`, `startRound`, `step` (engine), `render` (renderer), `GameDef`, `GameState`, `GameModule`, `InitOptions`.
- Produces: `makeRunnerModule(def: GameDef): GameModule<GameState>`.

- [ ] **Step 1: Write the failing test** — `site/tests/arcade-runner-module.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { makeRunnerModule } from "@/components/ship-game/games/runner-module";
import builder from "@/components/ship-game/games/builder";
import type { GameInput } from "@/components/ship-game/types";

const press = (p: boolean): GameInput => ({ primary: p, left: false, right: false, pointerX: null });

describe("runner module (builder)", () => {
  it("exposes module metadata from the def", () => {
    const m = makeRunnerModule(builder);
    expect(m.id).toBe("builder");
    expect(m.name).toBe("Build it");
    expect(m.highScoreId).toBe("builder");
    expect(m.hasMilestones(m.createState({}))).toBe(true);
  });
  it("starts idle, runs on primary, scores over distance", () => {
    const m = makeRunnerModule(builder);
    let s = m.createState({ seed: 123 });
    expect(m.isIdle(s)).toBe(true);
    s = m.step(s, 16, press(true));       // start
    for (let i = 0; i < 60; i++) s = m.step(s, 16, press(false));
    expect(m.getScore(s)).toBeGreaterThan(0);
    expect(m.isOver(s) || !m.isIdle(s)).toBe(true);
  });
  it("produces a non-empty game-over line", () => {
    const m = makeRunnerModule(builder);
    const s = m.createState({});
    expect(m.gameOverLine(s).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `cd site && pnpm test arcade-runner-module` → FAIL (module missing).

- [ ] **Step 3: Implement `runner-module.ts`:**

```ts
// Wraps the endless-runner engine (engine.ts) + renderer (renderer.ts) as a
// GameModule, so a runner GameDef (builder) plugs into the same harness as the
// new peer games. The runner's physics/render are unchanged — only adapted.
import { createInitialState, step as runnerStep } from "../engine";
import { render as runnerRender } from "../renderer";
import type { GameDef, GameInput, GameModule, GameState, InitOptions, RenderOptions } from "../types";

export function makeRunnerModule(def: GameDef): GameModule<GameState> {
  return {
    id: def.id,
    name: def.name,
    tagline: def.tagline,
    scoreUnit: def.scoreUnit,
    highScoreId: def.id,
    ariaLabel: `${def.name}: a one-button pixel jumping game. Press space or arrow up to jump. The course links are below.`,
    controlsHint: "Press space or arrow up to jump.",
    createState: (opts: InitOptions) => createInitialState(def, opts),
    step: (s: GameState, dtMs: number, input: GameInput) => runnerStep(s, dtMs, input, def),
    render: (ctx: CanvasRenderingContext2D, s: GameState, opts: RenderOptions) => runnerRender(ctx, s, def, opts),
    getScore: (s) => s.score,
    getStage: (s) => s.stage,
    hasMilestones: () => Boolean(def.milestoneEvery && def.milestoneEvery > 0),
    isIdle: (s) => s.phase === "idle",
    isOver: (s) => s.phase === "over",
    gameOverLine: (s) => def.gameOverLine(s.score, s.stage),
  };
}
```

- [ ] **Step 4: Run tests** — `cd site && pnpm test arcade-runner-module arcade-builder` → PASS.

- [ ] **Step 5: Commit**

```bash
git add site/src/components/ship-game/games/runner-module.ts site/tests/arcade-runner-module.test.ts
git commit -m "feat(site): wrap endless runner as a GameModule (builder)"
```

---

### Task A6: Point the registry at modules (builder only, temporarily)

**Files:**
- Modify: `site/src/components/ship-game/registry.ts`

- [ ] **Step 1: Rewrite `registry.ts`:**

```ts
import builder from "./games/builder";
import { makeRunnerModule } from "./games/runner-module";
import type { AnyGameModule } from "./types";

// Switcher order. Phase B inserts breaker, sorter, shooter ahead of builder.
export const GAMES: readonly AnyGameModule[] = [makeRunnerModule(builder)] as const;
export const DEFAULT_GAME_ID = GAMES[0].id;
export function getGame(id: string): AnyGameModule {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
```

- [ ] **Step 2: Verify** — `pnpm typecheck` (hook/Hero still reference old shapes; fixed in A7/A8). Commit with A8.

---

### Task A7: Drive a `GameModule` from the harness (`use-ship-game.ts`)

**Files:**
- Modify: `site/src/components/ship-game/use-ship-game.ts`

**Interfaces:**
- Consumes: `AnyGameModule`, `GameInput`, `GameState` (typed loosely as the module's state), `ThemeColors`.
- Produces: `useShipGame(module: AnyGameModule): UseShipGameResult` (same result shape; `stage`/`hasMilestones` derived via the module).

- [ ] **Step 1: Change the signature** from `useShipGame(def: GameDef)` to `useShipGame(mod: AnyGameModule)`. Rename internal `def`/`defRef` → `mod`/`modRef`.

- [ ] **Step 2: State construction** — `stateRef = useRef<unknown>(mod.createState({}))`. Everywhere the loop reads `step(stateRef.current, FIXED_DT, {jump}, def)` replace with `stateRef.current = mod.step(stateRef.current, FIXED_DT, input, ...)` where `input` is the full `GameInput` (next step). Replace `render(ctx, stateRef.current, def, {...})` with `modRef.current.render(ctx, stateRef.current, {...})`.

- [ ] **Step 3: Collect generalized input.** Add refs: `const leftRef = useRef(false); const rightRef = useRef(false); const pointerXRef = useRef<number | null>(null);`. In the loop, build:

```ts
const input: GameInput = {
  primary: jumpQueuedRef.current,
  left: leftRef.current,
  right: rightRef.current,
  pointerX: pointerXRef.current,
};
jumpQueuedRef.current = false;
```

- [ ] **Step 4: Keyboard.** In the global keydown handler, in addition to Space/ArrowUp (→ `primary`) and Enter (→ restart): on `keydown` set `leftRef.current=true` for `ArrowLeft`/`KeyA`, `rightRef.current=true` for `ArrowRight`/`KeyD`; add a `keyup` listener clearing them. Only treat left/right as game input when `interactiveRef.current` (hover/focus), and `preventDefault` arrow keys only when a round is running (so arrows still scroll otherwise). **Keep** the existing no-scroll-trap Space logic intact.

- [ ] **Step 5: Pointer move → pointerX.** On the canvas add a `pointermove` listener: when the pointer is over/down, set `pointerXRef.current = (e.offsetX / canvas.clientWidth) * LOGICAL_W` (logical-x). Clear to `null` on `pointerleave`/`pointerup`-off. (Paddle/tray/ship follow the finger.)

- [ ] **Step 6: Replace per-game accessors.** Mirror React state via the module: `setPhase(mod.isOver(s) ? "over" : mod.isIdle(s) ? "idle" : "running")`, `setScore(mod.getScore(s))`, `setStage(mod.getStage(s))`. High score keyed by `mod.highScoreId`. The reset effect uses `mod.createState({})` and `mod` deps.

- [ ] **Step 7: Verify** — `pnpm typecheck`. Commit with A8.

---

### Task A8: Read the `GameModule` in the chrome (`ShipGameHero.tsx`)

**Files:**
- Modify: `site/src/components/ship-game/ShipGameHero.tsx`

- [ ] **Step 1:** `const mod = GAMES[gameIndex];` Pass `mod` to `useShipGame(mod)`. Switcher maps `GAMES` → `mod.name` (unchanged structure, now N buttons).
- [ ] **Step 2:** Canvas `aria-label={mod.ariaLabel}` (delete the hardcoded "one-button pixel jumping game / hop the boat" string).
- [ ] **Step 3:** Scoreboard: replace `def.milestoneEvery ? ...` with the hook-exposed `hasMilestones` (add `hasMilestones: mod.hasMilestones(...)` — simplest: expose `hasMilestones: boolean` from the hook, computed from the current module + state). Show `stage ${Math.min(stage,5)}/5` only when true.
- [ ] **Step 4:** Tagline `{mod.tagline}`; scoreUnit `{mod.scoreUnit}`; game-over copy `{gameOverLine}` (expose `gameOverLine: string` from the hook via `mod.gameOverLine(state)` at over, or pass score/stage — simplest: hook returns `overLine: string`). Live-region wording becomes control-agnostic: `"Press a key or tap to play."`.
- [ ] **Step 5: Verify + build** — `cd site && pnpm typecheck && pnpm build` → clean. Manual: `pnpm dev`, the arcade shows **builder only**, plays on space, flips with the theme toggle, restarts on Enter.
- [ ] **Step 6: Commit**

```bash
git add site/src/components/ship-game/registry.ts site/src/components/ship-game/use-ship-game.ts site/src/components/ship-game/ShipGameHero.tsx
git commit -m "feat(site): drive the arcade through the GameModule harness"
```

**Phase A done when:** `pnpm test && pnpm typecheck && pnpm build` all pass and the home arcade plays `builder` on the new harness.

---

# Phase B — The three games (parallelizable; each depends only on Phase A)

Each game is one module file + one node-pure test. `step` is fully TDD-tested; `render` is type-checked + e2e-smoked (matching the runner's test boundary). Each task ends by inserting its module into `registry.ts` `GAMES`.

Shared conventions for all three:
- `createState(opts)`: seed RNG from `opts.seed ?? DEFAULT_SEED`; field `opts.width ?? 240 × opts.height ?? 80`; phase starts `"idle"`.
- Use a local `mulberry32`-style `nextRandom(state)` (copy the pattern from `engine.ts` lines 72–78) — RNG state lives in the game state.
- `step` clamps `dt = min(max(dtMs,0),50)/1000`. Phase machine: `idle` → `primary` starts; `over` → `primary` restarts; `running` advances.
- Movement: if `pointerX != null` move toward it; else `left`/`right` nudge. Clamp to field.
- Difficulty ramps with score. Milestone every N → `flash {text:"SHIPPED ✦", ms:900}`, bump `stage`.
- `render` uses `colors` (never hardcoded), `blit` for sprites, and the `hud.ts` helpers for score/flash/idle/over. Draw a baseline where it suits the game.
- One mistake ⇒ `phase="over"`.

### Task B1: `breaker` — "Chip the wall" (Breakout)

**Files:**
- Create: `site/src/components/ship-game/games/breaker.ts`
- Test: `site/tests/arcade-breaker.test.ts`
- Modify: `site/src/components/ship-game/registry.ts` (prepend `breaker`)

**Interfaces:**
- Produces: `default` export `breaker: GameModule<BreakerState>` and `export interface BreakerState { phase: Phase; width; height; rng; score; stage; flash; paddleX; paddleW; ball:{x;y;vx;vy;live:boolean}; bricks: {x;y;w;h;alive:boolean}[]; speedMul; }`.
- Consumes: `GameModule`, `GameInput`, `InitOptions`, `RenderOptions`, `Phase`, `ThemeColors`; `blit`; `hud.ts` helpers.

State/mechanic (full `step` is authored against the tests below):
- Wall: build a grid of bricks (e.g. cols spanning the field width with a margin, 3 rows near the top). `alive` flips false on hit.
- Paddle: near the bottom; `paddleX` moves via `pointerX`/`left`/`right`, clamped `[0, width-paddleW]`.
- Ball: `live=false` until `primary` (idle/serve) launches it from the paddle with a seeded upward angle. Integrate `x+=vx*dt`, `y+=vy*dt`. Reflect off left/right (`vx=-vx`) and top (`vy=-vy`). Paddle hit: when descending ball overlaps paddle, `vy=-|vy|` and `vx` gets a deflection proportional to `(ball.x - paddleCenter)/(paddleW/2)`.
- Brick hit: AABB ball vs alive brick → `alive=false`, reflect `vy`, `score++`. Clearing all bricks → `stage++`, flash, respawn a fresh wall, `speedMul *= 1.12` (cap).
- Ball below field bottom → `phase="over"`.
- `getScore=score`, `getStage=stage`, `hasMilestones=()=>true`, idle/over from phase.
- `gameOverLine`: ``You chipped ${score} bricks before the ball slipped. A big project is just small bricks — chip the next one.``
- `ariaLabel`: `"Chip the wall: a pixel brick-breaker. Slide with the arrow keys or your finger; press space to launch the ball. The course links are below."`; `controlsHint`: `"Slide left/right; press space to launch."`; `name:"Chip the wall"`, `tagline:"Slide the paddle. Clear the wall, brick by brick."`, `scoreUnit:""`, `id:"breaker"`, `highScoreId:"breaker"`.

- [ ] **Step 1: Write the failing test** — `site/tests/arcade-breaker.test.ts`

```ts
import { describe, expect, it } from "vitest";
import breaker, { type BreakerState } from "@/components/ship-game/games/breaker";
import type { GameInput } from "@/components/ship-game/types";

const NONE: GameInput = { primary: false, left: false, right: false, pointerX: null };
const PRESS: GameInput = { ...NONE, primary: true };
const run = (s: BreakerState, n: number, input: GameInput = NONE) => {
  for (let i = 0; i < n; i++) s = breaker.step(s, 16, input);
  return s;
};

describe("breaker", () => {
  it("starts idle with a wall of bricks and a dead ball", () => {
    const s = breaker.createState({ seed: 7 });
    expect(breaker.isIdle(s)).toBe(true);
    expect(s.bricks.some((b) => b.alive)).toBe(true);
    expect(s.ball.live).toBe(false);
  });
  it("launches the ball on primary", () => {
    let s = breaker.createState({ seed: 7 });
    s = breaker.step(s, 16, PRESS);
    expect(s.ball.live).toBe(true);
    expect(breaker.isIdle(s)).toBe(false);
  });
  it("moves the paddle toward pointerX", () => {
    let s = breaker.createState({ seed: 7 });
    const startX = s.paddleX;
    s = run(s, 20, { ...PRESS, pointerX: s.width }); // launch + steer right
    expect(s.paddleX).toBeGreaterThan(startX);
  });
  it("ends the round when the ball falls below the paddle", () => {
    let s = breaker.createState({ seed: 7 });
    s = breaker.step(s, 16, PRESS);
    s.ball = { ...s.ball, x: s.width / 2, y: s.height + 5, vx: 0, vy: 200, live: true };
    s = breaker.step(s, 16, NONE);
    expect(breaker.isOver(s)).toBe(true);
  });
  it("scores and removes a brick on contact", () => {
    let s = breaker.createState({ seed: 7 });
    s = breaker.step(s, 16, PRESS);
    const brick = s.bricks.find((b) => b.alive)!;
    s.ball = { ...s.ball, x: brick.x + brick.w / 2, y: brick.y + brick.h - 1, vx: 0, vy: -120, live: true };
    const before = breaker.getScore(s);
    s = breaker.step(s, 16, NONE);
    expect(breaker.getScore(s)).toBe(before + 1);
  });
  it("is deterministic for a fixed seed", () => {
    const a = run(breaker.step(breaker.createState({ seed: 9 }), 16, PRESS), 40);
    const b = run(breaker.step(breaker.createState({ seed: 9 }), 16, PRESS), 40);
    expect(breaker.getScore(a)).toBe(breaker.getScore(b));
    expect(a.ball.x).toBeCloseTo(b.ball.x);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `cd site && pnpm test arcade-breaker` → FAIL (module missing).
- [ ] **Step 3: Implement `breaker.ts`** — author `BreakerState`, `createState`, `step` (mechanic above), `render` (paper bg; bricks as filled rects via `blit` or `ctx.fillRect`; paddle bar; ball pixel; `drawScore`/`drawFlash`/`drawIdlePrompt("SLIDE + SPACE","TO PLAY")`/`drawOverPlate("DROPPED")`), and the `GameModule` accessors. Drive everything off the tests until green.
- [ ] **Step 4: Run tests** — `cd site && pnpm test arcade-breaker` → PASS. `pnpm typecheck` → clean.
- [ ] **Step 5: Insert into registry** — `import breaker from "./games/breaker";` and prepend to `GAMES`: `[breaker, makeRunnerModule(builder)]`.
- [ ] **Step 6: Commit**

```bash
git add site/src/components/ship-game/games/breaker.ts site/tests/arcade-breaker.test.ts site/src/components/ship-game/registry.ts
git commit -m "feat(site): add Chip the wall (brick-breaker) game"
```

---

### Task B2: `sorter` — "Ship the good" (catch-and-sort)

**Files:**
- Create: `site/src/components/ship-game/games/sorter.ts`
- Test: `site/tests/arcade-sorter.test.ts`
- Modify: `site/src/components/ship-game/registry.ts`

**Interfaces:**
- Produces: `default sorter: GameModule<SorterState>`, `export interface SorterState { phase; width; height; rng; score; stage; flash; trayX; trayW; items: {x;y;vy;good:boolean}[]; spawnTimer; speedMul; }`.

State/mechanic:
- Tray near the bottom; moves via `pointerX`/`left`/`right`, clamped.
- Items spawn from the top at random x (seeded), each `good` (≈60%) or bad (≈40%) by weight; fall at `vy = base*speedMul`. `spawnTimer` schedules spawns; `speedMul`/spawn-rate ramp with score.
- Tray catches an item (AABB at tray height): **good** → `score++` (and remove); **bad** → `phase="over"`. An item passing the bottom uncaught is removed: bad = fine, good = no penalty (forgiving).
- Milestone every N good caught → `stage++`, flash.
- `gameOverLine`: ``You shipped ${score} good edits, then caught a bug. The agent builds — you decide what ships.``
- `name:"Ship the good"`, `tagline:"Catch the good edits. Let the bugs drop."`, `id/highScoreId:"sorter"`, `scoreUnit:""`, ariaLabel describing slide controls + "catch ✓, drop ✗".

- [ ] **Step 1: Write the failing test** — `site/tests/arcade-sorter.test.ts`

```ts
import { describe, expect, it } from "vitest";
import sorter, { type SorterState } from "@/components/ship-game/games/sorter";
import type { GameInput } from "@/components/ship-game/types";

const NONE: GameInput = { primary: false, left: false, right: false, pointerX: null };
const PRESS: GameInput = { ...NONE, primary: true };

describe("sorter", () => {
  it("starts idle and begins on primary", () => {
    let s = sorter.createState({ seed: 3 });
    expect(sorter.isIdle(s)).toBe(true);
    s = sorter.step(s, 16, PRESS);
    expect(sorter.isIdle(s)).toBe(false);
  });
  it("scores when the tray catches a good item", () => {
    let s = sorter.createState({ seed: 3 });
    s = sorter.step(s, 16, PRESS);
    s.items = [{ x: s.trayX + s.trayW / 2, y: s.height - 12, vy: 60, good: true }];
    const before = sorter.getScore(s);
    s = sorter.step(s, 16, NONE);
    expect(sorter.getScore(s)).toBe(before + 1);
    expect(sorter.isOver(s)).toBe(false);
  });
  it("ends the round when the tray catches a bad item", () => {
    let s = sorter.createState({ seed: 3 });
    s = sorter.step(s, 16, PRESS);
    s.items = [{ x: s.trayX + s.trayW / 2, y: s.height - 12, vy: 60, good: false }];
    s = sorter.step(s, 16, NONE);
    expect(sorter.isOver(s)).toBe(true);
  });
  it("does NOT end when a bad item falls past uncaught", () => {
    let s = sorter.createState({ seed: 3 });
    s = sorter.step(s, 16, PRESS);
    s.trayX = 0; s.items = [{ x: s.width - 2, y: s.height + 6, vy: 60, good: false }];
    s = sorter.step(s, 16, NONE);
    expect(sorter.isOver(s)).toBe(false);
  });
  it("is deterministic for a fixed seed", () => {
    const drive = (n: number) => { let s = sorter.step(sorter.createState({ seed: 5 }), 16, PRESS); for (let i=0;i<n;i++) s = sorter.step(s,16,NONE); return s; };
    expect(drive(50).items.length).toBe(drive(50).items.length);
  });
});
```

- [ ] **Step 2: Verify fail** — `cd site && pnpm test arcade-sorter` → FAIL.
- [ ] **Step 3: Implement `sorter.ts`** (mechanic above; render: tray bar, good = check sprite, bad = small bug/✗ sprite, HUD helpers with idle prompt "SLIDE TO PLAY", over plate "SHIPPED A BUG").
- [ ] **Step 4: Tests pass** — `pnpm test arcade-sorter && pnpm typecheck`.
- [ ] **Step 5: Registry** — prepend so order is `[breaker, sorter, makeRunnerModule(builder)]` (final order set in Phase C).
- [ ] **Step 6: Commit** — `git commit -m "feat(site): add Ship the good (catch-and-sort) game"`.

---

### Task B3: `shooter` — "Keep it live" (Space Invaders)

**Files:**
- Create: `site/src/components/ship-game/games/shooter.ts`
- Test: `site/tests/arcade-shooter.test.ts`
- Modify: `site/src/components/ship-game/registry.ts`

**Interfaces:**
- Produces: `default shooter: GameModule<ShooterState>`, `export interface ShooterState { phase; width; height; rng; score; stage; flash; shipX; shipW; bullet: {x;y;live:boolean} | null; invaders: {x;y;w;h;alive:boolean}[]; dir: 1|-1; stepTimer; speedMul; }`.

State/mechanic:
- Ship on the baseline; moves via `pointerX`/`left`/`right`.
- `primary` fires when `bullet` is null/dead (classic one-in-flight); bullet travels up (`y -= speed*dt`); off top → cleared.
- Invaders: a small formation (e.g. 2 rows × 6). On `stepTimer`, the whole formation shifts by `dir`; at an edge it flips `dir` and drops one row. Bullet AABB vs alive invader → both removed, `score++`. Clearing all → `stage++`, flash, respawn faster wave (`speedMul`).
- Any alive invader reaching the ship's row (`y + h >= shipY`) → `phase="over"`.
- v1: invaders don't fire back.
- `gameOverLine`: ``You knocked down ${score} before one slipped through. Shipped isn't done — you keep it live by fixing fast.``
- `name:"Keep it live"`, `tagline:"Slide and fire. Knock down what comes at your app."`, `id/highScoreId:"shooter"`, `scoreUnit:""`, ariaLabel describing slide + space-to-fire. Reuse the rocket BUG/ERROR sprite shapes for invaders (copy the bitmaps into this file — rocket.ts is being deleted).

- [ ] **Step 1: Write the failing test** — `site/tests/arcade-shooter.test.ts`

```ts
import { describe, expect, it } from "vitest";
import shooter, { type ShooterState } from "@/components/ship-game/games/shooter";
import type { GameInput } from "@/components/ship-game/types";

const NONE: GameInput = { primary: false, left: false, right: false, pointerX: null };
const FIRE: GameInput = { ...NONE, primary: true };

describe("shooter", () => {
  it("starts idle with a formation and begins on primary", () => {
    let s = shooter.createState({ seed: 2 });
    expect(shooter.isIdle(s)).toBe(true);
    expect(s.invaders.some((i) => i.alive)).toBe(true);
    s = shooter.step(s, 16, FIRE);
    expect(shooter.isIdle(s)).toBe(false);
  });
  it("fires at most one bullet in flight", () => {
    let s = shooter.createState({ seed: 2 });
    s = shooter.step(s, 16, FIRE);   // start + fire
    const had = s.bullet?.live === true;
    s = shooter.step(s, 16, FIRE);   // second press ignored while live
    expect(had).toBe(true);
    expect(s.bullet?.live).toBe(true);
  });
  it("destroys an invader and scores on a bullet hit", () => {
    let s = shooter.createState({ seed: 2 });
    s = shooter.step(s, 16, FIRE);
    const inv = s.invaders.find((i) => i.alive)!;
    s.bullet = { x: inv.x + inv.w / 2, y: inv.y + inv.h, live: true };
    const before = shooter.getScore(s);
    s = shooter.step(s, 16, NONE);
    expect(shooter.getScore(s)).toBe(before + 1);
  });
  it("ends the round when an invader reaches the ship row", () => {
    let s = shooter.createState({ seed: 2 });
    s = shooter.step(s, 16, FIRE);
    s.invaders = s.invaders.map((i) => ({ ...i, y: s.height }));
    s = shooter.step(s, 16, NONE);
    expect(shooter.isOver(s)).toBe(true);
  });
  it("is deterministic for a fixed seed", () => {
    const drive = () => { let s = shooter.step(shooter.createState({ seed: 4 }), 16, FIRE); for (let i=0;i<30;i++) s = shooter.step(s,16,NONE); return s; };
    expect(drive().invaders.filter(i=>i.alive).length).toBe(drive().invaders.filter(i=>i.alive).length);
  });
});
```

- [ ] **Step 2: Verify fail** — `cd site && pnpm test arcade-shooter` → FAIL.
- [ ] **Step 3: Implement `shooter.ts`** (mechanic above; render: ship sprite, bullet pixel, invader sprites via `blit`, baseline, HUD helpers, idle "SLIDE + FIRE", over plate "BREACHED").
- [ ] **Step 4: Tests pass** — `pnpm test arcade-shooter && pnpm typecheck`.
- [ ] **Step 5: Registry** — insert so order is `[breaker, sorter, shooter, makeRunnerModule(builder)]`.
- [ ] **Step 6: Commit** — `git commit -m "feat(site): add Keep it live (space-invaders) game"`.

---

# Phase C — Cleanup, integration, gate

### Task C1: Delete the retired runner games + tests; lock final registry order

**Files:**
- Delete: `site/src/components/ship-game/games/rocket.ts`, `games/boat.ts`, `tests/arcade-rocket.test.ts`, `tests/arcade-boat.test.ts`
- Modify: `site/src/components/ship-game/registry.ts` (confirm order `[breaker, sorter, shooter, makeRunnerModule(builder)]`, `DEFAULT_GAME_ID = "breaker"`)

- [ ] **Step 1:** `git rm` the four files.
- [ ] **Step 2:** Grep for stragglers: `cd site && grep -rn "rocket\|boat" src tests e2e` → only expect matches inside `shooter.ts` comments (the copied BUG/ERROR bitmaps) and none importing the deleted files.
- [ ] **Step 3:** `pnpm test && pnpm typecheck` → all green.
- [ ] **Step 4: Commit** — `git commit -m "refactor(site): remove retired rocket and boat runner games"`.

### Task C2: Update the e2e smoke for four games

**Files:**
- Modify: `site/e2e/home-arcade.spec.ts`

- [ ] **Step 1:** Replace the `GAMES` array with the four new entries (exact `name` + `tagline` strings from each module). Update the comment ("registry: breaker → sorter → shooter → builder").
- [ ] **Step 2:** Update the canvas `aria-label` assertion: it currently asserts `/one-button pixel/i`. Change to assert the label is present and non-empty (e.g. `await expect(canvas).toHaveAttribute("aria-label", /pixel/i)`), since the default game (`breaker`) is no longer "one-button". Keep the `tabindex="0"` and single-canvas assertions.
- [ ] **Step 3:** The "cycles through all three games" test → rename to four and assert `GAMES.length === 4`; the loop already walks the array. Keep the "exactly one pressed" and reduced-motion + keyboard tests.
- [ ] **Step 4:** Confirm the existing-hero assertions (title/tagline/"Start the course →") are untouched.
- [ ] **Step 5: Run e2e** — `cd site && pnpm exec playwright test home-arcade` → PASS (and `home.spec.ts` still PASS).
- [ ] **Step 6: Commit** — `git commit -m "test(site): update arcade e2e for four games"`.

### Task C3: Full gate + memory

- [ ] **Step 1:** From repo root, `./scripts/voice-lint.sh` → exit 0 (this change touches no lessons; just confirm no regression).
- [ ] **Step 2:** `cd site && pnpm test && pnpm typecheck && pnpm build && pnpm exec playwright test` → all green. **`pnpm build` is mandatory** (CSS-module/Turbopack gate).
- [ ] **Step 3:** Manual smoke (`pnpm dev`): all four switcher buttons work; each game plays with its controls (jump / slide+launch / slide / slide+fire); each flips with the theme toggle; high scores persist per game; reduced-motion shows a static idle frame.
- [ ] **Step 4:** Update the `project_home_arcade_feature` memory file to describe four games + the harness/`GameModule` architecture.

---

## Self-Review

**Spec coverage:** four games ✓ (B1/B2/B3 + kept builder via A5); harness/`GameModule` ✓ (A3); generalized input ✓ (A3/A4/A7); `text.ts`+`hud.ts` extraction ✓ (A1/A2); chrome de-hardcoding ✓ (A8); delete rocket/boat ✓ (C1); tests added/deleted/updated ✓ (A/B/C); e2e ✓ (C2); constraints (monochrome/determinism/reduced-motion/a11y/build gate/hero-untouched) carried in Global Constraints + per-task render/test notes.

**Placeholder scan:** the three game `render` bodies and full `step` bodies are specified by mechanic + pinned by full TDD test code (the codebase's test boundary unit-tests `step`, not canvas `render`); no "TBD"/"handle edge cases" left. Game-over copy strings are given verbatim.

**Type consistency:** `GameModule`/`AnyGameModule`/`GameInput{primary,left,right,pointerX}`/`RenderOptions`/`ThemeColors` are defined once in `types.ts` (A2/A3) and consumed unchanged by A5–A8 and B1–B3. `makeRunnerModule` signature matches its use in `registry.ts`. Per-game state interfaces are exported from their modules and imported by their tests.
