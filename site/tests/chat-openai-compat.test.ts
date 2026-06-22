import { describe, expect, it, vi } from "vitest";
import { createOpenAICompatibleProvider } from "@/lib/chat/openai-compat";

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

describe("openai-compatible provider", () => {
  it("posts to the configured base URL with bearer auth and parses deltas", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":" there"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    );
    const provider = createOpenAICompatibleProvider({
      apiKey: "g-key",
      model: "gemini-2.5-flash",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await collect(provider.stream([{ role: "user", content: "hi" }]))).toBe("Hi there");
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    );
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer g-key");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("gemini-2.5-flash");
    expect(body.stream).toBe(true);
  });

  it("maps HTTP 429 to a rate-limit ChatProviderError", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("slow down", { status: 429 }));
    const provider = createOpenAICompatibleProvider({
      apiKey: "k",
      model: "llama-3.3-70b-versatile",
      baseUrl: "https://api.groq.com/openai/v1",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(collect(provider.stream([{ role: "user", content: "hi" }]))).rejects.toMatchObject({
      name: "ChatProviderError",
      kind: "rate-limit",
      status: 429,
    });
  });
});
