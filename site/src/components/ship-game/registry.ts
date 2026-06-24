// The game registry. The switcher cycles these in this exact order.
//
// A game is a GameModule (its own pure step/render), not data consumed by one
// engine. The endless runner (builder) plugs in via makeRunnerModule; the two
// peer games bring genuinely different mechanics. Each game communicates one
// thing about the course:
//   builder  — you ship by finishing
//   breaker  — break a big project into small bricks
//   shooter  — shipped isn't done; keep knocking down what comes at your app

import breaker from "./games/breaker";
import builder from "./games/builder";
import { makeRunnerModule } from "./games/runner-module";
import shooter from "./games/shooter";
import type { AnyGameModule } from "./types";

/** All games, in switcher order (Build it first). */
export const GAMES: readonly AnyGameModule[] = [
  makeRunnerModule(builder),
  breaker,
  shooter,
] as const;

/** The default game shown on first load. */
export const DEFAULT_GAME_ID: string = GAMES[0].id;

/** Look up a game by id; falls back to the default. */
export function getGame(id: string): AnyGameModule {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
