import { describe, expect, it, vi } from "vitest";
import {
  PROMPT_COPY,
  copyText,
  createPromptCopySession,
  promptText,
  type PromptCopyTarget,
} from "@/lib/prompt-copy";

// The copy control's whole contract in one place: copy the exact prompt
// text, say "Copied" only when the clipboard really took it, and on failure
// leave the learner with the text selected so Ctrl+C / ⌘C still works.

describe("promptText", () => {
  it("drops the single trailing newline a fenced block ends with", () => {
    expect(promptText("Make me a page.\n")).toBe("Make me a page.");
  });

  it("keeps every other character exactly, including inner newlines and indentation", () => {
    const raw = "Line one.\n\n  - item\n\tTabbed\n";
    expect(promptText(raw)).toBe("Line one.\n\n  - item\n\tTabbed");
  });

  it("does not trim anything else", () => {
    expect(promptText("  spaced  ")).toBe("  spaced  ");
    expect(promptText("two\n\n")).toBe("two\n");
    expect(promptText("")).toBe("");
  });
});

describe("copyText", () => {
  it("reports success only after the clipboard write resolves", async () => {
    const writeText = vi.fn(async () => undefined);
    await expect(copyText("hi", { clipboard: { writeText } })).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hi");
  });

  it("reports failure, never throws, when the clipboard write rejects", async () => {
    const clipboard = { writeText: vi.fn(async () => { throw new Error("denied"); }) };
    await expect(copyText("hi", { clipboard })).resolves.toBe(false);
  });

  it("reports failure when there is no clipboard and no fallback", async () => {
    await expect(copyText("hi", { clipboard: null })).resolves.toBe(false);
    await expect(copyText("hi", { clipboard: undefined })).resolves.toBe(false);
  });

  it("falls back to the legacy copy command only when the clipboard is missing or fails", async () => {
    const fallback = vi.fn(() => true);
    await expect(copyText("hi", { clipboard: null, fallback })).resolves.toBe(true);

    const rejecting = { writeText: vi.fn(async () => { throw new Error("denied"); }) };
    await expect(copyText("hi", { clipboard: rejecting, fallback })).resolves.toBe(true);

    const working = { writeText: vi.fn(async () => undefined) };
    fallback.mockClear();
    await expect(copyText("hi", { clipboard: working, fallback })).resolves.toBe(true);
    expect(fallback).not.toHaveBeenCalled();
  });

  it("treats a false or throwing fallback as failure", async () => {
    await expect(copyText("hi", { clipboard: null, fallback: () => false })).resolves.toBe(false);
    await expect(
      copyText("hi", { clipboard: null, fallback: () => { throw new Error("no"); } }),
    ).resolves.toBe(false);
  });
});

interface Recorded extends PromptCopyTarget {
  status: string[];
  selected: number;
  cleared: number;
}

function target(text = "Make me a page."): Recorded {
  const t: Recorded = {
    text,
    status: [],
    selected: 0,
    cleared: 0,
    setStatus(value) { t.status.push(value); },
    select() { t.selected += 1; },
    clearSelection() { t.cleared += 1; },
  };
  return t;
}

function last(t: Recorded): string | undefined {
  return t.status[t.status.length - 1];
}

/** A copy whose outcome the test decides later. */
function deferred() {
  let resolve!: (ok: boolean) => void;
  let reject!: (err: unknown) => void;
  const promise = new Promise<boolean>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

const succeed = async () => true;
const fail = async () => false;

describe("createPromptCopySession", () => {
  it("on success: announces Copied, clears any selection, and resets the status later", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      const session = createPromptCopySession(succeed);
      await session.run(t);
      expect(t.status).toEqual(["", PROMPT_COPY.copied]);
      expect(t.cleared).toBe(1);
      expect(t.selected).toBe(0);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs);
      expect(t.status).toEqual(["", PROMPT_COPY.copied, ""]);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("on failure: never says Copied, selects the prompt, and leaves the notice up", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      await createPromptCopySession(fail).run(t);
      expect(t.status).toEqual(["", PROMPT_COPY.failed]);
      expect(t.selected).toBe(1);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs * 5);
      expect(last(t)).toBe(PROMPT_COPY.failed);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("a copy that throws counts as failure", async () => {
    const t = target();
    await createPromptCopySession(async () => { throw new Error("boom"); }).run(t);
    expect(last(t)).toBe(PROMPT_COPY.failed);
  });

  it("copies exactly the target text", async () => {
    const copy = vi.fn<(t: PromptCopyTarget) => Promise<boolean>>(succeed);
    const t = target("  keep\nme  ");
    await createPromptCopySession(copy).run(t);
    expect(copy).toHaveBeenCalledWith(t);
    expect(copy.mock.calls[0]?.[0].text).toBe("  keep\nme  ");
  });

  // Regression (R1 correction 1): the reset used to be keyed by a target
  // object rebuilt on every click, so a second click could never cancel the
  // first click's reset and its "Copied" was cut short by the earlier timer.
  it("a rapid second copy on the same block keeps its own full Copied interval", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      const session = createPromptCopySession(succeed);
      await session.run(t);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs / 2);
      await session.run(t);
      expect(t.status).toEqual(["", PROMPT_COPY.copied, "", PROMPT_COPY.copied]);
      expect(vi.getTimerCount()).toBe(1); // the first reset was replaced, not stacked
      // Where the FIRST reset would have fired: still Copied.
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs / 2 + 1);
      expect(last(t)).toBe(PROMPT_COPY.copied);
      // The second interval ends on its own schedule.
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs / 2);
      expect(last(t)).toBe("");
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("targets are independent: one block's reset never clears another's notice", async () => {
    vi.useFakeTimers();
    try {
      const a = target("A");
      const b = target("B");
      const session = createPromptCopySession(succeed);
      await session.run(a);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs / 2);
      await session.run(b);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs / 2 + 1);
      expect(last(a)).toBe("");
      expect(last(b)).toBe(PROMPT_COPY.copied);
    } finally {
      vi.useRealTimers();
    }
  });

  it("a copy that fails after a success replaces the Copied notice and cancels its reset", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      let ok = true;
      const session = createPromptCopySession(async () => ok);
      await session.run(t);
      ok = false;
      await session.run(t);
      expect(last(t)).toBe(PROMPT_COPY.failed);
      expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs * 2);
      expect(last(t)).toBe(PROMPT_COPY.failed);
    } finally {
      vi.useRealTimers();
    }
  });

  // Regression (R1 correction 2): a clipboard write that resolves after the
  // binding is cleaned up (navigation) used to write status text into
  // detached DOM and start a timer nobody owned.
  it("a write that resolves after dispose touches nothing and starts no timer", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      const pending = deferred();
      const session = createPromptCopySession(() => pending.promise);
      const run = session.run(t);
      session.dispose();
      expect(session.disposed).toBe(true);
      pending.resolve(true);
      await run;
      expect(t.status).toEqual([]);
      expect(t.cleared).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("a write that fails after dispose selects nothing", async () => {
    const t = target();
    const pending = deferred();
    const session = createPromptCopySession(() => pending.promise);
    const run = session.run(t);
    session.dispose();
    pending.reject(new Error("denied"));
    await run;
    expect(t.status).toEqual([]);
    expect(t.selected).toBe(0);
  });

  it("dispose cancels a pending Copied reset; run after dispose is a no-op", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      const copy = vi.fn(succeed);
      const session = createPromptCopySession(copy);
      await session.run(t);
      expect(vi.getTimerCount()).toBe(1);
      session.dispose();
      expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(PROMPT_COPY.resetAfterMs * 2);
      expect(last(t)).toBe(PROMPT_COPY.copied); // no late "" write into a dead container
      await session.run(t);
      expect(copy).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("concurrent writes on one block: only the latest click's outcome is announced", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      const first = deferred();
      const second = deferred();
      const queue = [first, second];
      const session = createPromptCopySession(() => queue.shift()!.promise);
      const runA = session.run(t);
      const runB = session.run(t);
      // The earlier write lands first, successfully — but it is stale.
      first.resolve(true);
      await runA;
      expect(t.status).toEqual([]);
      expect(vi.getTimerCount()).toBe(0);
      // The latest write fails: that is the truth about the last click.
      second.resolve(false);
      await runB;
      expect(t.status).toEqual(["", PROMPT_COPY.failed]);
      expect(t.selected).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("concurrent writes resolving out of order: a stale failure never overrides the latest success", async () => {
    vi.useFakeTimers();
    try {
      const t = target();
      const first = deferred();
      const second = deferred();
      const queue = [first, second];
      const session = createPromptCopySession(() => queue.shift()!.promise);
      const runA = session.run(t);
      const runB = session.run(t);
      second.resolve(true);
      await runB;
      expect(last(t)).toBe(PROMPT_COPY.copied);
      expect(vi.getTimerCount()).toBe(1);
      first.resolve(false);
      await runA;
      expect(last(t)).toBe(PROMPT_COPY.copied);
      expect(t.selected).toBe(0);
      expect(vi.getTimerCount()).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
