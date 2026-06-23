// The game registry. The switcher cycles these in this exact order.
//
// A game is now a GameModule (its own pure step/render), not data consumed by
// one engine. The endless runner (builder) plugs in via makeRunnerModule; the
// three peer games (breaker / sorter / shooter) are added in Phase B.

import builder from "./games/builder";
import { makeRunnerModule } from "./games/runner-module";
import type { AnyGameModule } from "./types";

/** All games, in switcher order. Phase B prepends breaker → sorter → shooter. */
export const GAMES: readonly AnyGameModule[] = [
  makeRunnerModule(builder),
] as const;

/** The default game shown on first load. */
export const DEFAULT_GAME_ID: string = GAMES[0].id;

/** Look up a game by id; falls back to the default. */
export function getGame(id: string): AnyGameModule {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
