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

export type ChatBackend = "openrouter" | "mock";

export const DEFAULT_MODEL = "deepseek/deepseek-chat-v3-0324:free";
