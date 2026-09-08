// Copy control for `prompt` fences — the text a learner pastes into their
// agent app. Shared by the server transform (src/lib/content/prompt-blocks.ts
// renders the markup) and the client (attachPromptCopy wires the button).
//
// Contract: copy the prompt exactly as written (no label, no button text);
// say "Copied" only after the clipboard really took it; on failure, select
// the prompt so Ctrl+C / ⌘C still works and say so — never a false success.
// This module has no DOM imports at load time so the pure parts run under
// vitest's node environment; only attachPromptCopy touches the document.

export const PROMPT_COPY = {
  /** Visible label above every prompt block. */
  label: "Prompt",
  /** Visible button text. */
  button: "Copy",
  /** Accessible name — contains the visible text so voice control matches it. */
  buttonName: "Copy prompt",
  copied: "Copied",
  failed: "Couldn't copy. The prompt is selected, so press Ctrl+C or ⌘C.",
  /** How long "Copied" stays up before the status clears. */
  resetAfterMs: 2000,
} as const;

/** The fenced text as the author wrote it: a markdown fence always ends in
 *  one newline that is fence syntax, not prompt content. Nothing else is
 *  trimmed — leading spaces and inner blank lines are the author's. */
export function promptText(raw: string): string {
  return raw.endsWith("\n") ? raw.slice(0, -1) : raw;
}

export interface ClipboardLike {
  writeText(text: string): Promise<void>;
}

export interface CopyTextOptions {
  clipboard?: ClipboardLike | null;
  /** Legacy path (document.execCommand("copy") over a selection). Only tried
   *  when the async clipboard is missing or rejects; its boolean is trusted
   *  because the browser reports the real outcome. */
  fallback?: () => boolean;
}

/** Write to the clipboard. Resolves true only on a confirmed write; never throws. */
export async function copyText(text: string, options: CopyTextOptions): Promise<boolean> {
  const { clipboard, fallback } = options;
  if (clipboard) {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy path
    }
  }
  if (fallback) {
    try {
      return fallback() === true;
    } catch {
      return false;
    }
  }
  return false;
}

/** One prompt block, as the copy flow sees it. The DOM adapter below builds
 *  one per block element and caches it, so a block's identity is stable
 *  across clicks; tests build them from plain objects. */
export interface PromptCopyTarget {
  /** Exact text to copy. */
  text: string;
  setStatus(text: string): void;
  /** Select the prompt text so the learner can copy it by hand. */
  select(): void;
  clearSelection(): void;
}

export interface PromptCopySession {
  /** Run one copy attempt against a target and announce the real outcome. */
  run(target: PromptCopyTarget): Promise<void>;
  /** Cancel pending resets and drop any copy still in flight: after this,
   *  nothing the session started touches a target again. */
  dispose(): void;
  readonly disposed: boolean;
}

interface TargetState {
  /** Pending "Copied" reset for this target, if any. */
  reset: ReturnType<typeof setTimeout> | null;
  /** Identity of the latest copy started for this target. A result whose
   *  operation is no longer the latest is stale and is dropped. */
  op: number;
}

/**
 * The copy flow, independent of the DOM. One session per bound container:
 * it owns every timer it starts and every write it awaits, so cleanup on
 * navigation is a single dispose(). Per target it keeps the pending reset
 * (a repeat copy replaces it — the second "Copied" gets its own full
 * interval) and the latest operation id (concurrent writes on one block
 * resolve in any order; only the last click's outcome is announced).
 */
export function createPromptCopySession(
  copy: (target: PromptCopyTarget) => Promise<boolean>,
): PromptCopySession {
  const states = new Map<PromptCopyTarget, TargetState>();
  let disposed = false;

  const stateFor = (target: PromptCopyTarget): TargetState => {
    let state = states.get(target);
    if (!state) {
      state = { reset: null, op: 0 };
      states.set(target, state);
    }
    return state;
  };

  const cancelReset = (state: TargetState) => {
    if (state.reset !== null) {
      clearTimeout(state.reset);
      state.reset = null;
    }
  };

  return {
    get disposed() {
      return disposed;
    },
    async run(target) {
      if (disposed) return;
      const state = stateFor(target);
      cancelReset(state);
      state.op += 1;
      const op = state.op;
      let ok = false;
      try {
        ok = await copy(target);
      } catch {
        ok = false;
      }
      // Late (after dispose) or superseded (a newer click on this block)
      // results must not touch the DOM or start timers.
      if (disposed || state.op !== op) return;
      if (ok) {
        target.clearSelection();
        // Clear first: a live region only re-announces on a change, so a
        // second "Copied" written over an identical "Copied" would be silent.
        target.setStatus("");
        target.setStatus(PROMPT_COPY.copied);
        state.reset = setTimeout(() => {
          state.reset = null;
          if (!disposed) target.setStatus("");
        }, PROMPT_COPY.resetAfterMs);
        return;
      }
      target.select();
      target.setStatus("");
      target.setStatus(PROMPT_COPY.failed);
    },
    dispose() {
      disposed = true;
      for (const state of states.values()) cancelReset(state);
      states.clear();
    },
  };
}

// ---------------------------------------------------------------------------
// DOM adapter
// ---------------------------------------------------------------------------

const BLOCK_SELECTOR = "[data-prompt-block]";
const BUTTON_SELECTOR = "[data-prompt-copy]";

function selectContents(code: Element): Selection | null {
  const selection = code.ownerDocument.getSelection();
  if (!selection || !code.isConnected) return null;
  const range = code.ownerDocument.createRange();
  range.selectNodeContents(code);
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}

function targetFor(block: HTMLElement, announce: (status: HTMLElement, text: string) => void): PromptCopyTarget | null {
  const code = block.querySelector("pre code");
  const status = block.querySelector<HTMLElement>(".prompt-copy-status");
  if (!code || !status) return null;
  return {
    text: promptText(code.textContent ?? ""),
    setStatus(text) {
      announce(status, text);
    },
    select() {
      selectContents(code);
    },
    clearSelection() {
      const selection = code.ownerDocument.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (code.contains(range.commonAncestorContainer)) selection.removeAllRanges();
      }
    },
  };
}

/** Legacy copy: select the prompt, ask the browser to copy the selection. */
function execCommandCopy(block: HTMLElement): boolean {
  const code = block.querySelector("pre code");
  if (!code) return false;
  const doc = code.ownerDocument;
  if (typeof doc.execCommand !== "function") return false;
  const selection = selectContents(code);
  if (!selection) return false;
  return doc.execCommand("copy");
}

/**
 * Progressive enhancement for every prompt block inside `container`: reveal
 * the (server-rendered, hidden) copy buttons and handle their clicks by
 * delegation. Targets are cached per block element so repeat clicks share
 * one identity (and one pending reset). Returns a cleanup that removes the
 * listener and disposes the session, so a write still in flight during a
 * navigation resolves into nothing. Safe to call again after the
 * container's HTML is replaced.
 */
export function attachPromptCopy(container: HTMLElement): () => void {
  const view = container.ownerDocument.defaultView;
  const clipboard: ClipboardLike | null = view?.navigator?.clipboard ?? null;
  const targets = new WeakMap<HTMLElement, PromptCopyTarget>();
  const blocks = new WeakMap<PromptCopyTarget, HTMLElement>();
  const frames = new Map<HTMLElement, number>();
  const announce = (status: HTMLElement, text: string) => {
    const pending = frames.get(status);
    if (pending !== undefined) view?.cancelAnimationFrame(pending);
    frames.delete(status);
    status.textContent = "";
    if (!text || !view) return;
    // Let the empty live region paint before a repeated announcement.
    frames.set(status, view.requestAnimationFrame(() => {
      frames.set(status, view.requestAnimationFrame(() => {
        frames.delete(status);
        if (!session.disposed && status.isConnected) status.textContent = text;
      }));
    }));
  };
  const session = createPromptCopySession((target) =>
    copyText(target.text, {
      clipboard,
      fallback: () => {
        const block = blocks.get(target);
        return !session.disposed && block ? execCommandCopy(block) : false;
      },
    }),
  );

  for (const button of container.querySelectorAll<HTMLElement>(BUTTON_SELECTOR)) {
    button.hidden = false;
  }

  const onClick = (event: MouseEvent) => {
    const origin = event.target as Element | null;
    const button = origin?.closest?.(BUTTON_SELECTOR);
    if (!button) return;
    const block = button.closest<HTMLElement>(BLOCK_SELECTOR);
    if (!block) return;
    let target = targets.get(block);
    if (!target) {
      target = targetFor(block, announce) ?? undefined;
      if (!target) return;
      targets.set(block, target);
      blocks.set(target, block);
    }
    event.preventDefault();
    void session.run(target);
  };

  container.addEventListener("click", onClick);
  return () => {
    container.removeEventListener("click", onClick);
    session.dispose();
    for (const frame of frames.values()) view?.cancelAnimationFrame(frame);
    frames.clear();
  };
}
