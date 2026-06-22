import { describe, expect, it } from "vitest";
import { createFallbackProvider } from "@/lib/chat/fallback";
import { type ChatProvider, ChatProviderError } from "@/lib/chat/types";

/** A provider that streams the given chunks in order. */
function fromChunks(chunks: string[]): ChatProvider {
  return {
    async *stream() {
      for (const c of chunks) yield c;
    },
  };
}

/** A provider whose stream rejects on the first read — i.e. before any token. */
function throwsBeforeFirstToken(err: unknown): ChatProvider {
  return {
    stream() {
      return {
        [Symbol.asyncIterator]() {
          return { next: () => Promise.reject(err) };
        },
      };
    },
  };
}

/** A provider that must never be streamed; calling stream() fails the test. */
function neverCalled(): ChatProvider {
  return {
    stream() {
      throw new Error("fallback should not have been invoked");
    },
  };
}

async function collect(it: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const d of it) out += d;
  return out;
}

describe("fallback provider", () => {
  it("uses the primary when it streams successfully", async () => {
    const provider = createFallbackProvider(fromChunks(["Hel", "lo"]), neverCalled());
    expect(await collect(provider.stream([]))).toBe("Hello");
  });

  it("falls back when the primary errors before the first token", async () => {
    const provider = createFallbackProvider(
      throwsBeforeFirstToken(new ChatProviderError("rate limited", "rate-limit", 429)),
      fromChunks(["wor", "ld"]),
    );
    expect(await collect(provider.stream([]))).toBe("world");
  });

  it("does not fall back once the primary has yielded a token", async () => {
    const primary: ChatProvider = {
      async *stream() {
        yield "Hel";
        throw new ChatProviderError("mid-stream boom", "upstream");
      },
    };
    const provider = createFallbackProvider(primary, neverCalled());
    const out: string[] = [];
    await expect(
      (async () => {
        for await (const d of provider.stream([])) out.push(d);
      })(),
    ).rejects.toThrow("mid-stream boom");
    expect(out).toEqual(["Hel"]);
  });
});
