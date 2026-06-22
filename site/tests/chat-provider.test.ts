import { describe, expect, it, vi } from "vitest";
import { getChatProvider, resolveBackend } from "@/lib/chat/provider";
import { ChatProviderError, DEFAULT_MODEL } from "@/lib/chat/types";

function sseResponse(chunks: string[], init?: ResponseInit): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
  return new Response(stream, init);
}

async function collect(it: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const d of it) out += d;
  return out;
}

describe("DEFAULT_MODEL", () => {
  // Regression guard: the free model the chat defaults to must be one OpenRouter
  // actually still serves. `deepseek/deepseek-chat-v3-0324:free` was retired and
  // every request 404'd, surfacing as the generic "chat ran into a problem".
  it("is a free model and not the retired deepseek id", () => {
    expect(DEFAULT_MODEL).toMatch(/:free$/);
    expect(DEFAULT_MODEL).not.toBe("deepseek/deepseek-chat-v3-0324:free");
  });
});

describe("resolveBackend", () => {
  it("honours an explicit CHAT_BACKEND", () => {
    expect(resolveBackend({ CHAT_BACKEND: "mock" })).toBe("mock");
    expect(resolveBackend({ CHAT_BACKEND: "openrouter", OPENROUTER_API_KEY: "k" })).toBe("openrouter");
  });
  it("defaults to openrouter when a key is present, else mock", () => {
    expect(resolveBackend({ OPENROUTER_API_KEY: "k" })).toBe("openrouter");
    expect(resolveBackend({})).toBe("mock");
  });
  it("prefers gemini, then groq, then openrouter when several keys exist", () => {
    expect(
      resolveBackend({ GEMINI_API_KEY: "g", GROQ_API_KEY: "q", OPENROUTER_API_KEY: "o" }),
    ).toBe("gemini");
    expect(resolveBackend({ GROQ_API_KEY: "q", OPENROUTER_API_KEY: "o" })).toBe("groq");
  });
});

describe("getChatProvider fallback chain", () => {
  it("falls back from Gemini to Groq when Gemini is rate-limited", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(
        sseResponse([
          'data: {"choices":[{"delta":{"content":"from groq"}}]}\n\n',
          "data: [DONE]\n\n",
        ]),
      );
    const provider = getChatProvider(
      { GEMINI_API_KEY: "g", GROQ_API_KEY: "q" },
      { fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    expect(await collect(provider.stream([{ role: "user", content: "hi" }]))).toBe("from groq");
    expect(String(fetchImpl.mock.calls[0][0])).toContain("generativelanguage.googleapis.com");
    expect(String(fetchImpl.mock.calls[1][0])).toContain("api.groq.com");
  });

  it("uses Gemini's default model when GEMINI_MODEL is unset", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(sseResponse(["data: [DONE]\n\n"]));
    const provider = getChatProvider(
      { GEMINI_API_KEY: "g" },
      { fetchImpl: fetchImpl as unknown as typeof fetch },
    );
    await collect(provider.stream([{ role: "user", content: "hi" }]));
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body as string);
    expect(body.model).toBe("gemini-2.5-flash");
  });
});

describe("getChatProvider", () => {
  it("returns a streaming mock provider for the mock backend", () => {
    const provider = getChatProvider({ CHAT_BACKEND: "mock" });
    expect(typeof provider.stream).toBe("function");
  });
  it("throws a config error when openrouter is selected without a key", () => {
    expect(() => getChatProvider({ CHAT_BACKEND: "openrouter" })).toThrow(ChatProviderError);
  });
  it("returns an openrouter provider when configured", () => {
    const provider = getChatProvider({ OPENROUTER_API_KEY: "k" });
    expect(typeof provider.stream).toBe("function");
  });
});
