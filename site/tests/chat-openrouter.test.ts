import { describe, expect, it, vi } from "vitest";
import { createOpenRouterProvider } from "@/lib/chat/openrouter";
import { ChatProviderError } from "@/lib/chat/types";

/** Build a Response whose body streams the given byte chunks (one per read). */
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

describe("openrouter provider", () => {
  it("parses delta content across SSE frames and stops at [DONE]", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        ": OPENROUTER PROCESSING\n\n",
        'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    );
    const provider = createOpenRouterProvider({
      apiKey: "k",
      model: "m",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await collect(provider.stream([{ role: "user", content: "hi" }]))).toBe("Hello");
  });

  it("handles a delta split across two read chunks", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'data: {"choices":[{"delta":{"content":"wor',
        'ld"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    );
    const provider = createOpenRouterProvider({
      apiKey: "k",
      model: "m",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await collect(provider.stream([{ role: "user", content: "hi" }]))).toBe("world");
  });

  it("throws a rate-limit ChatProviderError on HTTP 429", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("nope", { status: 429 }));
    const provider = createOpenRouterProvider({
      apiKey: "k",
      model: "m",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(collect(provider.stream([{ role: "user", content: "hi" }]))).rejects.toMatchObject({
      name: "ChatProviderError",
      kind: "rate-limit",
      status: 429,
    });
    expect(ChatProviderError).toBeDefined();
  });

  it("sends the model, messages, key and stream flag", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(sseResponse(["data: [DONE]\n\n"]));
    const provider = createOpenRouterProvider({
      apiKey: "secret",
      model: "deepseek/deepseek-chat-v3-0324:free",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await collect(provider.stream([{ role: "user", content: "hi" }]));
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toContain("/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("deepseek/deepseek-chat-v3-0324:free");
    expect(body.stream).toBe(true);
    expect(body.messages).toEqual([{ role: "user", content: "hi" }]);
  });
});
