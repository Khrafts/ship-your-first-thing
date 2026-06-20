import type { ChatMessage, ChatProvider } from "./types";

/** Pull the lesson title out of the system prompt for grounded mock replies. */
function lessonTitle(messages: ChatMessage[]): string {
  const system = messages.find((m) => m.role === "system")?.content ?? "";
  const match = system.match(/LESSON:\s*(.+)/);
  return match ? match[1].trim() : "this lesson";
}

/**
 * Deterministic streaming responder used in dev and tests. No network, no key,
 * no token spend. Emits one word per delta so streaming UI can be exercised.
 */
export function createMockProvider(): ChatProvider {
  return {
    async *stream(messages: ChatMessage[]): AsyncIterable<string> {
      const lastUser =
        [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
      const reply =
        `Here's a quick answer grounded in "${lessonTitle(messages)}". ` +
        `You asked: ${lastUser} ` +
        `This is a mock tutor reply used for local development and tests.`;
      for (const word of reply.split(" ")) {
        yield `${word} `;
      }
    },
  };
}
