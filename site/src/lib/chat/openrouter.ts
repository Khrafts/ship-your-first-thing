import { createOpenAICompatibleProvider } from "./openai-compat";
import type { ChatProvider } from "./types";

export interface OpenRouterOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  referer?: string;
  title?: string;
  fetchImpl?: typeof fetch;
}

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * OpenRouter is a plain OpenAI-compatible endpoint; this is a thin alias over
 * the shared provider that pins OpenRouter's default base URL.
 */
export function createOpenRouterProvider(opts: OpenRouterOptions): ChatProvider {
  return createOpenAICompatibleProvider({
    ...opts,
    baseUrl: opts.baseUrl ?? DEFAULT_BASE_URL,
  });
}
