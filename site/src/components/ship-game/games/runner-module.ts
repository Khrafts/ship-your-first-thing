// Wraps the endless-runner engine (engine.ts) + renderer (renderer.ts) as a
// GameModule, so a runner GameDef (builder) plugs into the same harness as the
// new peer games (breaker / sorter / shooter). The runner's physics and render
// are unchanged — this only adapts the data-plus-engine shape to the module
// interface the harness now drives.

import { createInitialState, step as runnerStep } from "../engine";
import { render as runnerRender } from "../renderer";
import type {
  GameDef,
  GameInput,
  GameModule,
  GameState,
  InitOptions,
  RenderOptions,
} from "../types";

export function makeRunnerModule(def: GameDef): GameModule<GameState> {
  return {
    id: def.id,
    name: def.name,
    tagline: def.tagline,
    scoreUnit: def.scoreUnit,
    highScoreId: def.id,
    ariaLabel:
      `${def.name}: a one-button pixel jumping game. ` +
      `Press space or arrow up to jump. The course links are below.`,
    controlsHint: "Press space or arrow up to jump.",

    createState: (opts: InitOptions) => createInitialState(def, opts),
    step: (s: GameState, dtMs: number, input: GameInput) =>
      runnerStep(s, dtMs, input, def),
    render: (ctx: CanvasRenderingContext2D, s: GameState, opts: RenderOptions) =>
      runnerRender(ctx, s, def, opts),

    getScore: (s) => s.score,
    getStage: (s) => s.stage,
    hasMilestones: () => Boolean(def.milestoneEvery && def.milestoneEvery > 0),
    isIdle: (s) => s.phase === "idle",
    isOver: (s) => s.phase === "over",
    gameOverLine: (s) => def.gameOverLine(s.score, s.stage),
  };
}
