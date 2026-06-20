import { createMockProvider } from "./mock";
import { createOpenRouterProvider } from "./openrouter";
import { type ChatBackend, type ChatProvider, ChatProviderError, DEFAULT_MODEL } from "./types";

export function resolveBackend(env: NodeJS.ProcessEnv): ChatBackend {
  const explicit = env.CHAT_BACKEND?.trim().toLowerCase();
  if (explicit === "mock" || explicit === "openrouter") {
    return explicit;
  }
  return env.OPENROUTER_API_KEY ? "openrouter" : "mock";
}

export function getChatProvider(env: NodeJS.ProcessEnv = process.env): ChatProvider {
  if (resolveBackend(env) === "mock") {
    return createMockProvider();
  }
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new ChatProviderError("chat is not configured", "config");
  }
  return createOpenRouterProvider({
    apiKey,
    model: env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
    baseUrl: env.OPENROUTER_BASE_URL?.trim() || undefined,
    referer: env.OPENROUTER_REFERER?.trim() || env.APP_URL?.trim() || undefined,
    title: "Ship Your First Thing",
  });
}
