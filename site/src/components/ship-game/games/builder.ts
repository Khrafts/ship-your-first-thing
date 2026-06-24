// builder — "Build it"
//
// A pixel builder hauls a crate that GROWS at every milestone (stages 1→5),
// flashing "SHIPPED ✦" each time. The figure faces right toward the obstacles
// coming at it; the crate is braced in front, growing UPWARD layer by layer so
// the whole sprite gets taller. The engine re-anchors the avatar's bottom on a
// stage change, so the builder's feet never sink through the ground.
//
// It hops over two hazards: a "pit" (a gap in the work, modeled as a grounded
// spike cluster the hop clears — the shared engine keeps one flat ground line,
// so a pit is drawn as a hazard ON the line rather than a hole carved INTO it)
// and a "bug". Score is in "m" ("built").
//
// This is the game that carries the course's message most directly: you ship by
// finishing. Every milestone is a thing actually shipped — the crate is the
// visible, growing record of it. So the crate growth must be satisfying and
// legible at small size, and the game-over copy must tie back to "keep going".
//
// This file exercises all three GameDef "specials":
//   - avatar as a function of (score, stage)  → crate growth
//   - milestoneEvery                            → bumps `stage`
//   - flashText                                 → the "SHIPPED ✦" celebration
// It touches no shared code — a GameDef is data plus tiny pure functions.

import type { AvatarCtx, Bitmap, GameDef } from "../types";

/** Crate tops out at five stacked layers — five things shipped. */
const MAX_STAGE = 5;

/** Score interval between milestones (one shipped crate layer per interval). */
const MILESTONE_EVERY = 20;

// --- The builder figure -----------------------------------------------------
// 5 wide × 7 tall, bottom-anchored. A round head, a torso, one arm braced
// forward (to the right) under the crate, and two legs caught mid-stride so the
// figure reads as *walking while carrying*. Pure on/off pixels — no character is
// load-bearing except as "filled vs. empty", and it reads at a single glance.
const FIGURE: Bitmap = [
  " ##  ", // head
  " ##  ",
  "#### ", // shoulder + arm reaching forward to brace the crate
  " ##  ", // torso
  " ##  ",
  " ##  ",
  "# #  ", // two legs, mid-stride
];

const FIGURE_W = 5;
/** Crate is 6 wide; a 1px gap column separates it from the figure's arm. */
const CRATE_W = 6;
const GAP = 1;
/** Each shipped layer is this many rows tall. */
const BAND_H = 2;

/**
 * Build the crate's pixel rows for a given stage.
 *
 * - Stage 0 (nothing shipped yet): a single thin plank — the raw material, just
 *   picked up. So the FIRST milestone visibly jumps from "plank" to "box".
 * - Stage N ≥ 1: N stacked 2px layers. Every layer starts with a solid seam row
 *   and the body rows are hollow (`#    #`), so the stacked layers read as
 *   distinct boxes rather than one tall smear — the growth stays legible.
 */
function crateRows(stage: number): string[] {
  if (stage <= 0) return ["#".repeat(CRATE_W)]; // 1px plank

  const crateH = stage * BAND_H;
  const rows: string[] = [];
  for (let r = 0; r < crateH; r++) {
    const isAbsTop = r === 0;
    const isAbsBottom = r === crateH - 1;
    const isSeam = r % BAND_H === 0; // first row of each stacked layer
    if (isAbsTop || isAbsBottom || isSeam) {
      rows.push("#".repeat(CRATE_W)); // solid edge / seam line
    } else {
      rows.push("#" + " ".repeat(CRATE_W - 2) + "#"); // hollow layer body
    }
  }
  return rows;
}

/**
 * Resolve the avatar sprite for the current (score, stage). The figure keeps a
 * fixed height at the bottom-left; the crate grows upward at the bottom-right.
 * The total sprite is the taller of the two, with both bottom-aligned, so the
 * builder always stands on the ground while the crate towers above it.
 */
function buildAvatar(ctx: AvatarCtx): Bitmap {
  const stage = Math.min(Math.max(ctx.stage, 0), MAX_STAGE);
  const figureH = FIGURE.length;
  const crate = crateRows(stage);
  const crateH = crate.length;
  const totalH = Math.max(figureH, crateH);

  const rows: string[] = [];
  for (let r = 0; r < totalH; r++) {
    const figRow = r - (totalH - figureH);
    const figCells = figRow >= 0 ? FIGURE[figRow] : " ".repeat(FIGURE_W);

    const crateRow = r - (totalH - crateH);
    const crateCells = crateRow >= 0 ? crate[crateRow] : " ".repeat(CRATE_W);

    rows.push(figCells.padEnd(FIGURE_W, " ") + " ".repeat(GAP) + crateCells);
  }
  return rows;
}

// --- Obstacles --------------------------------------------------------------

// A "bug": a little insect — antennae up top, a body, legs splayed at the
// bottom. Small and grounded; the common hazard. 5 wide × 4 tall.
const BUG: Bitmap = [
  "#   #", // antennae
  " ### ", // body top
  "#####", // body
  "# # #", // legs
];

// A "pit": a gap in the work. We can't carve a hole into the single flat ground
// line, so we draw it as a jagged spike cluster sitting ON the line — a hazard
// the hop must clear. The spiked top reads as "broken ground / a gap you'd fall
// into". 5 wide × 3 tall, a touch wider than the bug so it's a clear "bigger,
// jump earlier" cue.
const PIT: Bitmap = [
  "# # #", // jagged spikes
  "#####",
  "#####",
];

export const builder: GameDef = {
  id: "builder",
  name: "Build it",
  tagline: "Ship a layer at a time. Finish the crate.",
  avatar: buildAvatar,
  baseline: "flat",
  scoreUnit: "m",
  scoreVerb: "built",
  milestoneEvery: MILESTONE_EVERY,
  flashText: () => "SHIPPED ✦",
  // The bug is the frequent, twitchy hazard; the pit is the bigger, rarer one
  // you have to read early. Weighted so the rhythm is "lots of small hops, the
  // occasional committed leap".
  obstacles: [
    { sprite: BUG, grounded: true, weight: 3 },
    { sprite: PIT, grounded: true, weight: 2 },
  ],
  gameOverLine: (_score, stage) => {
    const capped = Math.min(Math.max(stage, 0), MAX_STAGE);
    return `Your crate reached stage ${capped}/${MAX_STAGE} before the stumble. You ship by finishing — keep going.`;
  },
};

export default builder;
