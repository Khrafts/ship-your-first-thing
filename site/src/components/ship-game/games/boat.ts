// boat — "Set sail"
//
// A folded-paper boat rides an animated wave baseline (baseline: "wave") and
// hops over rocks, buoys, and big waves. Score in "nm" (nautical miles). The
// vibe is calmer than the rocket: a slow swell, an origami boat, a forgiving
// reminder that every shipped thing began as a leaky first draft.
//
// All sprites are strictly on/off pixels — any non-space char is ink, a space is
// paper. No hue, no anti-alias-by-color. They are sized to read instantly at the
// low-res backbuffer scale.

import type { GameDef } from "../types";

// The avatar: a little folded-paper boat. The iconic origami silhouette is a
// wide hull with two sharp ends folded UP into points, a solid deck line across
// the middle, and the hull narrowing to a flat bottom that sits on the water. A
// single notch in the deck row reads as the paper crease (folded, not a sail).
// Solid silhouette, because filled pixels read far better than outlines at this
// scale. 11 wide × 8 tall.
//
//   |\               /|     two upturned points (the folded ends)
//   | \             / |
//   |  \           /  |
//   |   \_________/   |
//   |___________________|   the deck line, notched in the middle (the crease)
//    \                 /
//     \_______________/     the hull, flat-bottomed on the swell
//
const BOAT = [
  "#         #",
  "##       ##",
  "###     ###",
  "####   ####",
  "#### # ####",
  "###########",
  " ######### ",
  "  #######  ",
];

// rock — a low, grounded lump. Squat and solid so it reads as "stay grounded,
// this is small but you still must hop." 5 wide × 3 tall.
const ROCK = [
  " ### ",
  "#####",
  "#####",
];

// buoy — a grounded channel marker: a round float on a short post with a little
// topmark, taller than the rock but shorter than the big wave so all three read
// at distinct heights. 5 wide × 5 tall.
const BUOY = [
  "  #  ",
  " ### ",
  "  #  ",
  " ### ",
  " ### ",
];

// big wave — a grounded curling swell, the tallest obstacle: a breaking crest
// over a trough. Reads as a wall of water you must clear. 11 wide × 6 tall.
const BIG_WAVE = [
  "   ####    ",
  "  #    #   ",
  " #      ## ",
  "#         #",
  "##       ##",
  "###########",
];

export const boat: GameDef = {
  id: "boat",
  name: "Set sail",
  tagline: "Catch the swell. Clear the rocks.",
  avatar: BOAT,
  baseline: "wave",
  scoreUnit: "nm",
  scoreVerb: "sailed",
  // Calmer obstacle mix: the small grounded rock is the common beat; the buoy is
  // an occasional mid-height marker; the big wave is the rare, tallest test.
  obstacles: [
    { sprite: ROCK, grounded: true, weight: 4 },
    { sprite: BUOY, grounded: true, weight: 2 },
    { sprite: BIG_WAVE, grounded: true, weight: 1 },
  ],
  gameOverLine: (score) =>
    `${score} nm sailed. Every shipped thing started as a leaky first draft.`,
};

export default boat;
