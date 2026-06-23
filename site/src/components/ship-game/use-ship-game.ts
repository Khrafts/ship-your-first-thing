"use client";

// The React harness that drives one GameModule on a canvas.
//
// Responsibilities:
//   - own a <canvas> ref and keep its backing store sized to logical × scale,
//     with `image-rendering: pixelated` so the low-res field stays crisp.
//   - run a fixed-timestep requestAnimationFrame loop with an accumulator, so
//     physics are framerate-independent and deterministic.
//   - collect the shared GameInput each tick: a primary press (Space / ArrowUp /
//     click / tap / Enter-restart), held left/right (Arrow keys / A,D), and a
//     pointerX for drag-to-move (paddle / tray / ship). Each module reads only
//     what it needs.
//   - respect prefers-reduced-motion: never auto-run; show a static idle frame
//     and only start animating after explicit user input.
//   - read/write a per-game localStorage high score, guarded for private mode.
//
// Design note: the loop is ref-driven. React state mirrors ONLY the few values
// the chrome renders (phase / score / stage / highScore). All hot-path data
// lives in refs, so the rAF callback never closes over stale React state and we
// never call setState in a way that cascades renders. Callbacks are declared in
// strict top-down order (no forward references) to keep the React compiler's
// memoization intact.

import { useCallback, useEffect, useRef, useState } from "react";
import { readThemeColors, type ThemeColors } from "./renderer";
import type { AnyGameModule, GameInput, Phase } from "./types";

const LOGICAL_W = 240;
const LOGICAL_H = 80;
const FIXED_DT = 1000 / 120; // physics tick (ms); 120Hz for smoothness.
const MAX_FRAME_MS = 250; // clamp huge gaps (tab away) to avoid spiral-of-death.

const FALLBACK_COLORS: ThemeColors = {
  ink: "#09090b",
  paper: "#ffffff",
  faint: "#71717a",
};

function highScoreKey(id: string): string {
  return `syft.arcade.highscore.${id}`;
}

function readHighScore(id: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(highScoreKey(id));
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0; // private mode / disabled storage.
  }
}

function writeHighScore(id: string, score: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(highScoreKey(id), String(score));
  } catch {
    // ignore — high score is a nicety, never a hard dependency.
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Choose an integer scale that fits the canvas's CSS box. */
function pickScale(cssWidth: number): number {
  if (cssWidth <= 0) return 2;
  const raw = Math.floor(cssWidth / LOGICAL_W);
  return Math.max(2, Math.min(6, raw));
}

/** Phase derived from a module's idle/over predicates. */
function phaseOf(mod: AnyGameModule, state: unknown): Phase {
  if (mod.isOver(state)) return "over";
  if (mod.isIdle(state)) return "idle";
  return "running";
}

export interface UseShipGameResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  phase: Phase;
  score: number;
  stage: number;
  highScore: number;
  /** Whether to show the "stage x/5" scoreboard slot for this game. */
  hasMilestones: boolean;
  /** The game-over line for the current module + finished state (empty unless over). */
  overLine: string;
  /** True if reduced-motion is active (UI can show a static hint). */
  reducedMotion: boolean;
  /** Imperative controls for chrome buttons. */
  jump: () => void;
  restart: () => void;
}

export function useShipGame(mod: AnyGameModule): UseShipGameResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Live mutable state for the loop; React state mirrors only what the UI shows.
  const stateRef = useRef<unknown>(mod.createState({}));
  const modRef = useRef<AnyGameModule>(mod);
  const colorsRef = useRef<ThemeColors>(FALLBACK_COLORS);
  const scaleRef = useRef<number>(2);
  // False until the backing store has been sized at least once. Lets resize()
  // skip the canvas-clearing width/height reassignment when the scale is
  // unchanged, so a no-op ResizeObserver callback can't blank a live frame.
  const sizedRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const accumRef = useRef<number>(0);
  // Edge-triggered primary request: set by input handlers, consumed by the loop.
  const primaryQueuedRef = useRef<boolean>(false);
  // Held movement; set on keydown, cleared on keyup.
  const leftRef = useRef<boolean>(false);
  const rightRef = useRef<boolean>(false);
  // Logical-x of an active pointer/touch (drag-to-move), or null.
  const pointerXRef = useRef<number | null>(null);
  // Hover/focus gate for the no-scroll-trap key capture.
  const interactiveRef = useRef<boolean>(false);
  // The high-score-to-display, kept in a ref so the loop can update it without
  // reading React state, and mirrored into state on change.
  const highScoreRef = useRef<number>(0);
  // Holds the rAF callback so the loop can reschedule itself without the
  // callback referencing its own (not-yet-initialized) binding.
  const tickRef = useRef<(ts: number) => void>(() => {});

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Adjust state during render when the chosen game changes (React's documented
  // pattern for deriving state from a changed prop — cheaper and cascade-free
  // versus resetting inside an effect). `prevGameId` is React state. The
  // imperative canvas / loop reset still happens in an effect below; this only
  // resets the mirrored React values the chrome renders.
  const [prevGameId, setPrevGameId] = useState<string>(mod.id);
  if (prevGameId !== mod.id) {
    setPrevGameId(mod.id);
    setPhase("idle");
    setScore(0);
    setStage(0);
    // High score is loaded from storage in the reset effect below (on mount AND
    // on game change) — not read here, to avoid a localStorage read during
    // render and so a returning player's best shows on the very first paint.
  }

  // hasMilestones is module-constant (its implementations ignore state), so it
  // is safe to derive during render. overLine is only meaningful when over, and
  // is guarded by `phase` so we never call gameOverLine on a mismatched state
  // mid game-switch (phase resets to idle on switch, so the over card is hidden).
  const hasMilestones = mod.hasMilestones(stateRef.current);
  const overLine = phase === "over" ? mod.gameOverLine(stateRef.current) : "";

  // --- Sizing + theme color read (no React state; pure ref/DOM work) -----
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const box = containerRef.current ?? canvas;
    const cssWidth = box.clientWidth || LOGICAL_W * 2;
    const scale = pickScale(cssWidth);
    // Reassigning canvas.width/height CLEARS the backing store, so only do it
    // when the scale actually changed (or on the very first sizing). This lets
    // a ResizeObserver fire freely — a width change that doesn't cross an
    // integer-scale boundary won't blank a live or paused frame.
    if (!sizedRef.current || scale !== scaleRef.current) {
      scaleRef.current = scale;
      // We already integer-scale; an extra device-pixel-ratio would blur pixels.
      canvas.width = LOGICAL_W * scale;
      canvas.height = LOGICAL_H * scale;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      sizedRef.current = true;
    }
    colorsRef.current = readThemeColors(canvas);
  }, []);

  // Draw the current frame once (used while the loop is paused: idle/over).
  const drawOnce = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    colorsRef.current = readThemeColors(canvas);
    modRef.current.render(ctx, stateRef.current, {
      scale: scaleRef.current,
      colors: colorsRef.current,
      reducedMotion: prefersReducedMotion(),
    });
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // The fixed-timestep loop. Declared before startLoop (which references it) and
  // before any effect, so the compiler sees a clean forward-free graph.
  const tick = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (lastTsRef.current === 0) lastTsRef.current = ts;
    let frameMs = ts - lastTsRef.current;
    lastTsRef.current = ts;
    if (frameMs > MAX_FRAME_MS) frameMs = MAX_FRAME_MS;
    accumRef.current += frameMs;

    const m = modRef.current;
    while (accumRef.current >= FIXED_DT) {
      const input: GameInput = {
        primary: primaryQueuedRef.current,
        left: leftRef.current,
        right: rightRef.current,
        pointerX: pointerXRef.current,
      };
      primaryQueuedRef.current = false; // edge-triggered: consume the press.
      stateRef.current = m.step(stateRef.current, FIXED_DT, input);
      accumRef.current -= FIXED_DT;
    }

    // colorsRef is kept current by the theme-change observer (and by
    // resize/drawOnce), so we do NOT call getComputedStyle here — reading it
    // every frame forces a style recalc and is the canonical per-frame
    // getComputedStyle anti-pattern. A mid-game theme flip is picked up by the
    // MutationObserver below, which updates colorsRef before the next frame.
    m.render(ctx, stateRef.current, {
      scale: scaleRef.current,
      colors: colorsRef.current,
    });

    const st = stateRef.current;
    const ph = phaseOf(m, st);
    setPhase(ph);
    setScore(m.getScore(st));
    setStage(m.getStage(st));

    if (ph === "over") {
      const prev = readHighScore(m.highScoreId);
      const sc = m.getScore(st);
      const best = sc > prev ? sc : prev;
      if (sc > prev) writeHighScore(m.highScoreId, sc);
      if (best !== highScoreRef.current) {
        highScoreRef.current = best;
        setHighScore(best);
      }
      // Stop and stamp the final frame.
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    rafRef.current = requestAnimationFrame((next) => tickRef.current(next));
  }, []);

  // Keep the ref pointing at the latest tick so the loop reschedules through it.
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return; // already running.
    // Read theme colors once at start (the per-frame read was removed); the
    // observer keeps colorsRef current for the rest of the round.
    const canvas = canvasRef.current;
    if (canvas) colorsRef.current = readThemeColors(canvas);
    lastTsRef.current = 0;
    accumRef.current = 0;
    rafRef.current = requestAnimationFrame((ts) => tickRef.current(ts));
  }, []);

  // --- Public controls -----
  const jump = useCallback(() => {
    primaryQueuedRef.current = true;
    const m = modRef.current;
    const ph = phaseOf(m, stateRef.current);
    // Starting / restarting a round needs the loop running. Reduced-motion is
    // respected because we only ever start on explicit input (this call).
    if (ph === "idle" || ph === "over") startLoop();
  }, [startLoop]);

  const restart = useCallback(() => {
    const m = modRef.current;
    stateRef.current = m.createState({});
    setPhase("idle");
    setScore(0);
    setStage(0);
    primaryQueuedRef.current = true; // immediately start a fresh round.
    startLoop();
  }, [startLoop]);

  // --- Imperative reset when the chosen game changes -----
  // The mirrored React state was already reset during render (above); here we
  // only touch external systems: the module state, the loop, and the canvas.
  useEffect(() => {
    modRef.current = mod;
    stateRef.current = mod.createState({});
    accumRef.current = 0;
    primaryQueuedRef.current = false;
    leftRef.current = false;
    rightRef.current = false;
    pointerXRef.current = null;
    // Load this game's stored best on mount and on game change, so a returning
    // player sees their real "best" on the first paint. readHighScore is
    // SSR-safe and storage-guarded.
    const best = readHighScore(mod.highScoreId);
    highScoreRef.current = best;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe read of a client-only store
    setHighScore(best);
    stopLoop();
    resize();
    drawOnce();
  }, [mod, resize, drawOnce, stopLoop]);

  // --- Track reduced-motion (live) -----
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // --- Container resize (ResizeObserver) + window resize -----
  // The backing store is sized from the container's clientWidth, which can change
  // WITHOUT a window 'resize' event — a late web-font reflow, a sibling section
  // shifting, the scrollbar or chat drawer appearing. A ResizeObserver on the
  // container catches all of those; resize() is guarded so an unchanged scale
  // doesn't clear a live frame. The window listener stays as a belt-and-braces
  // signal (and covers the rare case the container ref isn't ready yet).
  useEffect(() => {
    const onResize = () => {
      resize();
      if (rafRef.current === null) drawOnce();
    };
    let ro: ResizeObserver | null = null;
    const container = containerRef.current;
    if (container && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(container);
    }
    window.addEventListener("resize", onResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [resize, drawOnce]);

  // --- Theme change: repaint paused frames; refresh colors for the loop -----
  // The site toggle flips light/dark by adding/removing `.dark` on <html> — it
  // does NOT track prefers-color-scheme once pinned, so a matchMedia listener
  // would miss it. Watch the class attribute instead. This keeps colorsRef
  // current WITHOUT reading getComputedStyle every frame, and repaints the idle
  // / reduced-motion / over frames (where no loop is running) so they flip with
  // the toggle instead of freezing on stale colors.
  useEffect(() => {
    if (typeof window === "undefined" || !("MutationObserver" in window)) return;
    const html = document.documentElement;
    const obs = new MutationObserver(() => {
      const canvas = canvasRef.current;
      if (canvas) colorsRef.current = readThemeColors(canvas);
      if (rafRef.current === null) drawOnce();
    });
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [drawOnce]);

  // --- Global keydown / keyup (no scroll trap) -----
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const m = modRef.current;
      const ph = phaseOf(m, stateRef.current);
      const isPrimaryKey = e.code === "Space" || e.code === "ArrowUp";
      const isRestartKey = e.code === "Enter";
      const isLeftKey = e.code === "ArrowLeft" || e.code === "KeyA";
      const isRightKey = e.code === "ArrowRight" || e.code === "KeyD";

      // Not focused/hovered → let keys pass (Space scrolls, arrows do whatever).
      if (!interactiveRef.current) return;

      if (isLeftKey || isRightKey) {
        if (isLeftKey) leftRef.current = true;
        if (isRightKey) rightRef.current = true;
        // Only swallow the arrow (and keep the page from scrolling) during an
        // active round; otherwise let it behave normally.
        if (ph === "running") e.preventDefault();
        return;
      }

      if (isPrimaryKey) {
        if (ph === "running") {
          // An active round always captures Space (hover OR focus) so the press
          // doesn't also scroll the page.
          if (e.code === "Space") e.preventDefault();
          primaryQueuedRef.current = true;
        } else if (document.activeElement === canvasRef.current) {
          // Idle / over: only a *focused* canvas starts a round on Space. Mere
          // hover must let Space fall through and scroll the page (no scroll
          // trap) — so we do NOT preventDefault on the hover-but-idle path.
          if (e.code === "Space") e.preventDefault();
          jump(); // start / restart
        }
        // else: hovered (not focused) while idle/over → let Space scroll.
      } else if (isRestartKey && ph === "over") {
        e.preventDefault();
        restart();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") leftRef.current = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") rightRef.current = false;
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [jump, restart]);

  // --- Canvas pointer / focus listeners + initial sizing -----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resize();
    drawOnce();

    const setPointerX = (e: PointerEvent) => {
      const w = canvas.clientWidth || LOGICAL_W;
      pointerXRef.current = (e.offsetX / w) * LOGICAL_W;
    };

    const onEnter = () => {
      interactiveRef.current = true;
    };
    const onLeave = () => {
      if (document.activeElement !== canvas) interactiveRef.current = false;
      pointerXRef.current = null; // stop following once the cursor leaves.
    };
    const onFocus = () => {
      interactiveRef.current = true;
    };
    const onBlur = () => {
      interactiveRef.current = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      setPointerX(e);
      jump(); // primary: start / launch / fire / restart
      canvas.focus();
    };
    const onPointerMove = (e: PointerEvent) => {
      setPointerX(e);
    };
    const onPointerUp = () => {
      // Release: hand control back to the keyboard (touch end / click release).
      pointerXRef.current = null;
    };

    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("focus", onFocus);
    canvas.addEventListener("blur", onBlur);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);

    return () => {
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("focus", onFocus);
      canvas.removeEventListener("blur", onBlur);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, [jump, resize, drawOnce]);

  // --- Stop the loop on unmount -----
  useEffect(() => stopLoop, [stopLoop]);

  return {
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
  };
}
