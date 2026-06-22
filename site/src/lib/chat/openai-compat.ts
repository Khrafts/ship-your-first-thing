import type { ChatMessage, ChatProvider } from "./types";
import { ChatProviderError } from "./types";

export interface OpenAICompatibleOptions {
  apiKey: string;
  model: string;
  /** Base URL up to (but not including) `/chat/completions`. */
  baseUrl: string;
  /** Optional attribution headers (OpenRouter uses these; harmless elsewhere). */
  referer?: string;
  title?: string;
  fetchImpl?: typeof fetch;
}

function errorKind(status: number): ChatProviderError["kind"] {
  if (status === 429) return "rate-limit";
  if (status === 402) return "quota";
  if (status === 401 || status === 403) return "config";
  return "upstream";
}

/**
 * A streaming chat provider for any OpenAI-compatible `/chat/completions`
 * endpoint that speaks Server-Sent Events. Gemini, Groq and OpenRouter all
 * expose this same shape, so they differ only by `baseUrl`, key and model.
 */
export function createOpenAICompatibleProvider(opts: OpenAICompatibleOptions): ChatProvider {
  const fetchImpl = opts.fetchImpl ?? fetch;

  return {
    async *stream(messages: ChatMessage[], signal?: AbortSignal) {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      };
      if (opts.referer) headers["HTTP-Referer"] = opts.referer;
      if (opts.title) headers["X-Title"] = opts.title;

      const res = await fetchImpl(`${opts.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ model: opts.model, messages, stream: true }),
        signal,
      });

      if (!res.ok) {
        throw new ChatProviderError(
          `Chat request failed (${res.status})`,
          errorKind(res.status),
          res.status,
        );
      }
      if (!res.body) {
        throw new ChatProviderError("Chat provider returned no body", "upstream");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue; // skip ": comment" keep-alives
          const data = trimmed.slice("data:".length).trim();
          if (data === "[DONE]") return;
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              yield delta;
            }
          } catch {
            // partial/non-JSON line — ignore, more bytes will follow
          }
        }
      }
    },
  };
}
