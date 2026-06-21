import { describe, expect, it } from "vitest";
import { getChatProvider, resolveBackend } from "@/lib/chat/provider";
import { ChatProviderError } from "@/lib/chat/types";

describe("resolveBackend", () => {
  it("honours an explicit CHAT_BACKEND", () => {
    expect(resolveBackend({ CHAT_BACKEND: "mock" })).toBe("mock");
    expect(resolveBackend({ CHAT_BACKEND: "openrouter", OPENROUTER_API_KEY: "k" })).toBe("openrouter");
  });
  it("defaults to openrouter when a key is present, else mock", () => {
    expect(resolveBackend({ OPENROUTER_API_KEY: "k" })).toBe("openrouter");
    expect(resolveBackend({})).toBe("mock");
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
