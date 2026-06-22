export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatErrorKind = "rate-limit" | "quota" | "config" | "upstream";

export class ChatProviderError extends Error {
  status?: number;
  kind: ChatErrorKind;
  constructor(message: string, kind: ChatErrorKind = "upstream", status?: number) {
    super(message);
    this.name = "ChatProviderError";
    this.kind = kind;
    this.status = status;
  }
}

export interface ChatProvider {
  /** Yields response text deltas as they arrive. */
  stream(messages: ChatMessage[], signal?: AbortSignal): AsyncIterable<string>;
}

export type ChatBackend = "gemini" | "groq" | "openrouter" | "mock";

/**
 * Real providers in priority order. The default chat backend is the highest-
 * priority provider whose API key is present; any lower-priority providers with
 * keys become automatic fallbacks. All three are OpenAI-compatible endpoints.
 */
export const PROVIDERS = {
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    keyEnv: "GEMINI_API_KEY",
    modelEnv: "GEMINI_MODEL",
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    keyEnv: "GROQ_API_KEY",
    modelEnv: "GROQ_MODEL",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "qwen/qwen3-next-80b-a3b-instruct:free",
    keyEnv: "OPENROUTER_API_KEY",
    modelEnv: "OPENROUTER_MODEL",
  },
} as const;

/** Priority order for choosing the primary backend and the fallback chain. */
export const PROVIDER_PRIORITY = ["gemini", "groq", "openrouter"] as const;

/** Back-compat alias: the OpenRouter free-model default. */
export const DEFAULT_MODEL = PROVIDERS.openrouter.defaultModel;
