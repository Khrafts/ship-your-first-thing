// The game registry. The switcher cycles these in this exact order.

import boat from "./games/boat";
import builder from "./games/builder";
import rocket from "./games/rocket";
import type { GameDef } from "./types";

/** All games, in switcher order: rocket → boat → builder. */
export const GAMES: readonly GameDef[] = [rocket, boat, builder] as const;

/** The default game shown on first load. */
export const DEFAULT_GAME_ID: GameDef["id"] = "rocket";

/** Look up a game by id; falls back to the default. */
export function getGame(id: string): GameDef {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
