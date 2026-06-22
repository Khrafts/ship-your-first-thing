import { createFallbackProvider } from "./fallback";
import { createMockProvider } from "./mock";
import { createOpenAICompatibleProvider } from "./openai-compat";
import {
  type ChatBackend,
  type ChatProvider,
  ChatProviderError,
  PROVIDER_PRIORITY,
  PROVIDERS,
} from "./types";

/** Just the env keys we read — `process.env` and test stubs both satisfy it. */
type EnvLike = Record<string, string | undefined>;
type RealBackend = (typeof PROVIDER_PRIORITY)[number];

interface ProviderOpts {
  /** Injectable for tests; production uses the global fetch. */
  fetchImpl?: typeof fetch;
}

function hasKey(env: EnvLike, backend: RealBackend): boolean {
  return Boolean(env[PROVIDERS[backend].keyEnv]?.trim());
}

/** Real backends whose API key is present, in priority order. */
function availableBackends(env: EnvLike): RealBackend[] {
  return PROVIDER_PRIORITY.filter((b) => hasKey(env, b));
}

export function resolveBackend(env: EnvLike): ChatBackend {
  const explicit = env.CHAT_BACKEND?.trim().toLowerCase();
  if (
    explicit === "mock" ||
    explicit === "gemini" ||
    explicit === "groq" ||
    explicit === "openrouter"
  ) {
    return explicit;
  }
  return availableBackends(env)[0] ?? "mock";
}

function makeProvider(backend: RealBackend, env: EnvLike, opts: ProviderOpts): ChatProvider {
  const cfg = PROVIDERS[backend];
  const apiKey = env[cfg.keyEnv]?.trim();
  if (!apiKey) {
    throw new ChatProviderError("chat is not configured", "config");
  }
  const isOpenRouter = backend === "openrouter";
  return createOpenAICompatibleProvider({
    apiKey,
    model: env[cfg.modelEnv]?.trim() || cfg.defaultModel,
    baseUrl: (isOpenRouter && env.OPENROUTER_BASE_URL?.trim()) || cfg.baseUrl,
    // OpenRouter uses attribution headers; they're harmless on other endpoints.
    referer: isOpenRouter
      ? env.OPENROUTER_REFERER?.trim() || env.APP_URL?.trim() || undefined
      : undefined,
    title: isOpenRouter ? "Ship Your First Thing" : undefined,
    fetchImpl: opts.fetchImpl,
  });
}

export function getChatProvider(env: EnvLike = process.env, opts: ProviderOpts = {}): ChatProvider {
  const explicit = env.CHAT_BACKEND?.trim().toLowerCase();
  if (explicit === "mock") return createMockProvider();
  if (explicit === "gemini" || explicit === "groq" || explicit === "openrouter") {
    return makeProvider(explicit, env, opts);
  }

  const chain = availableBackends(env);
  if (chain.length === 0) return createMockProvider();

  // Highest-priority backend is primary; the rest become ordered fallbacks.
  const providers = chain.map((b) => makeProvider(b, env, opts));
  return providers.reduceRight((fallback, primary) => createFallbackProvider(primary, fallback));
}
