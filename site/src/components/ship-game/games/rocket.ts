// rocket — "Ship it"
//
// A pixel rocket taxis a launchpad and hops over the things that crash a real
// ship: a bug, an error, a wall of work. Flat baseline; speed ramps with
// distance (handled by the shared engine). Score in "m", verb "shipped".
//
// This file is data-plus-tiny-functions only — it programs against the GameDef
// contract in ../types and never touches the engine, renderer, or sprites.
//
// Pixel convention (see types.ts): any non-space character is a filled (ink)
// pixel; a space is empty (paper). Strictly two values — a pixel is on or off,
// no hue, no anti-aliasing. The avatar faces right (obstacles scroll in from
// the right) but is drawn nose-UP so a jump reads as a launch.

import type { Bitmap, GameDef } from "../types";

// --- Avatar -----------------------------------------------------------------

// The rocket. 7 wide × 11 tall. Read top-to-bottom: a one-pixel nose cone, a
// flared cone shoulder, a porthole punched out of the body, two swept fins at
// the base, and a forked exhaust flame underneath. The silhouette is meant to
// be unmistakable at this size: pointed top, fat middle, fins kicking out,
// flame trailing down.
//
//   row 0   nose tip
//   row 1-2 cone shoulders widening
//   row 3-6 hull, with a hollow porthole at rows 4-5
//   row 7   fin flare (widest line — the fins kick out past the hull)
//   row 8   fin tips
//   row 9-10 exhaust flame (forked, narrows to two points)
const ROCKET: Bitmap = [
  "   #   ",
  "  ###  ",
  "  ###  ",
  "  ###  ",
  "  # #  ",
  "  # #  ",
  "  ###  ",
  "## # ##",
  "#  #  #",
  "  # #  ",
  "  # #  ",
];

// --- Obstacles --------------------------------------------------------------

// A small bug blob, grounded. Six legs and two antennae poking off a round
// body — the classic "creepy-crawly" read at tiny size. 7 wide × 5 tall.
const BUG: Bitmap = [
  "# # # #",
  " ##### ",
  "#######",
  " ##### ",
  "#  #  #",
];

// An error mark: a bold X, grounded. Drawn thick so the diagonal reads as a
// deliberate "X / cross-out", not noise. 7 wide × 5 tall.
const ERROR: Bitmap = [
  "##   ##",
  " ## ## ",
  "  ###  ",
  " ## ## ",
  "##   ##",
];

// A wall: a tall brick bar, grounded — the big one you must commit to clearing.
// Offset-row brick pattern so it reads as masonry. 6 wide × 11 tall (matches
// the rocket's height, so a flat-footed run into it is unmissable).
const WALL: Bitmap = [
  "######",
  "# ## #",
  "######",
  "## # #",
  "######",
  "# ## #",
  "######",
  "## # #",
  "######",
  "# ## #",
  "######",
];

// --- The game ---------------------------------------------------------------

export const rocket: GameDef = {
  id: "rocket",
  name: "Ship it",
  tagline: "Taxi the launchpad. Hop the bugs. Ship the rocket.",
  avatar: ROCKET,
  baseline: "flat",
  scoreUnit: "m",
  scoreVerb: "shipped",
  // Weighting: the small bug is the bread-and-butter hop (common), the error X
  // is a touch rarer, and the tall wall is the rare big commit. Total weight 8.
  obstacles: [
    { sprite: BUG, grounded: true, weight: 4 },
    { sprite: ERROR, grounded: true, weight: 3 },
    { sprite: WALL, grounded: true, weight: 1 },
  ],
  gameOverLine: (score) =>
    `You shipped ${score} m before it crashed. ` +
    `Real builders ship, crash, and ship again.`,
};

export default rocket;
