import type { ChatMessage, ChatProvider } from "./types";

/**
 * Wrap a primary provider so that, if it fails *before streaming any tokens*,
 * a fallback provider serves the answer instead. Once the primary has yielded
 * even one token we stay with it: you can't cleanly swap providers mid-sentence,
 * so a mid-stream failure propagates rather than restarting from the fallback.
 */
export function createFallbackProvider(
  primary: ChatProvider,
  fallback: ChatProvider,
): ChatProvider {
  return {
    async *stream(messages: ChatMessage[], signal?: AbortSignal) {
      const iterator = primary.stream(messages, signal)[Symbol.asyncIterator]();

      let first: IteratorResult<string>;
      try {
        first = await iterator.next();
      } catch {
        // Primary failed before producing anything — hand off to the fallback.
        yield* fallback.stream(messages, signal);
        return;
      }

      // Primary produced something (or completed cleanly). From here on we are
      // committed to the primary: a later error propagates to the caller.
      if (first.done) return;
      yield first.value;
      while (true) {
        const next = await iterator.next();
        if (next.done) return;
        yield next.value;
      }
    },
  };
}
