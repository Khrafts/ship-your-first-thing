"use client";

// The visible arcade: a pixel canvas, a game switcher, a mono scoreboard, the
// game-over card (mounted ONLY when the round is over), and the per-game
// tagline. Strictly black-and-white — every color comes from the design tokens.
//
// This is a client island embedded at the top of the (server) home page. It
// must not touch or reword the existing hero copy / CTAs / curriculum; its own
// call-to-action uses different text ("Take the course →") to avoid colliding
// with the page's single "Start the course →" link that e2e asserts on.

import Link from "next/link";
import { useCallback, useState } from "react";
import { GAMES } from "./registry";
import { useShipGame } from "./use-ship-game";

export default function ShipGameHero() {
  const [gameIndex, setGameIndex] = useState(0);
  const mod = GAMES[gameIndex];
  const {
    canvasRef,
    containerRef,
    phase,
    score,
    stage,
    highScore,
    hasMilestones,
    overLine,
    reducedMotion,
    jump,
    restart,
  } = useShipGame(mod);

  const selectGame = useCallback((index: number) => {
    setGameIndex(((index % GAMES.length) + GAMES.length) % GAMES.length);
  }, []);

  // Arrow-key cycling on the switcher.
  const onSwitcherKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        selectGame(gameIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        selectGame(gameIndex - 1);
      }
    },
    [gameIndex, selectGame],
  );

  return (
    <section
      className="mx-auto max-w-3xl pt-12 sm:pt-16"
      aria-label="Mini arcade — play while you decide"
    >
      {/* Switcher: real buttons, aria-pressed, arrow-key cycling. */}
      <div
        role="group"
        aria-label="Choose a game"
        onKeyDown={onSwitcherKey}
        className="mb-3 flex items-center gap-2"
      >
        <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          arcade
        </span>
        {GAMES.map((g, i) => {
          const active = i === gameIndex;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectGame(i)}
              className={[
                "rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors duration-150",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong text-ink-secondary hover:border-ink hover:text-ink",
              ].join(" ")}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      {/* The framed canvas. Focusable, labelled, with a visible focus ring. */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-md border border-line-strong bg-paper"
      >
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={mod.ariaLabel}
          className="block w-full cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-ink"
          // touch-action: none suppresses double-tap-zoom and tap-scroll on
          // touch devices (preventDefault on pointerdown alone does NOT — touch
          // gesture suppression is governed by this CSS property). The canvas
          // captures all pointer input, so disabling browser gestures on it is
          // safe and keeps tap-to-jump from zooming/scrolling the page.
          style={{ imageRendering: "pixelated", touchAction: "none" }}
        />

        {/* Visually-hidden live region: announce only STABLE transitions. The
            per-frame score is deliberately NOT announced here — score mirrors
            the rAF loop and changes dozens of times a second, which would flood
            a polite live region and make the page unusable for screen-reader
            users mid-round. The final score is announced once on game-over. */}
        <span aria-live="polite" className="sr-only">
          {phase === "running"
            ? "Round in progress."
            : phase === "over"
              ? `Game over. ${score} ${mod.scoreUnit}.`
              : "Press a key or tap to play."}
        </span>

        {/* Game-over card — mounted ONLY when state === "over". */}
        {phase === "over" && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/85 px-4 backdrop-blur-[1px]">
            <div className="max-w-sm rounded-md border border-ink bg-paper p-4 text-center shadow-sm">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                round over
              </p>
              <p className="mt-2 font-serif text-base leading-snug text-ink">
                {overLine}
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <Link
                  href="/continue"
                  className="inline-flex h-9 items-center rounded-md bg-ink px-4 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary"
                >
                  Take the course →
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[11px] uppercase tracking-wide text-ink-secondary underline underline-offset-2 transition-colors duration-150 hover:text-ink"
                >
                  Play again (enter)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tagline + scoreboard row. */}
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-xs text-ink-secondary">{mod.tagline}</p>
        <p className="font-mono text-xs text-ink-faint">
          <span className="text-ink">
            {score}
            {mod.scoreUnit}
          </span>{" "}
          · best {highScore}
          {mod.scoreUnit}
          {hasMilestones ? ` · stage ${Math.min(stage, 5)}/5` : ""}
        </p>
      </div>

      {/* A static hint when reduced-motion is on (no auto-animation). */}
      {reducedMotion && phase === "idle" && (
        <p className="mt-1 font-mono text-[10px] text-ink-faint">
          Motion is reduced — the game stays still until you press a key or tap.
        </p>
      )}

      {/* Nudge that the real content is below — keeps the arcade from reading as
          the whole page for keyboard / screen-reader users. */}
      <button
        type="button"
        onClick={jump}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        jump
      </button>
    </section>
  );
}
