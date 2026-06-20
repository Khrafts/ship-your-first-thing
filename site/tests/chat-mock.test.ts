import { describe, expect, it } from "vitest";
import { createMockProvider } from "@/lib/chat/mock";
import type { ChatMessage } from "@/lib/chat/types";

async function collect(it: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const delta of it) out += delta;
  return out;
}

describe("mock chat provider", () => {
  const messages: ChatMessage[] = [
    { role: "system", content: "LESSON: How the web works\n---\nbody\n---" },
    { role: "user", content: "what is a server?" },
  ];

  it("streams a non-empty reply in multiple deltas", async () => {
    const provider = createMockProvider();
    const deltas: string[] = [];
    for await (const d of provider.stream(messages)) deltas.push(d);
    expect(deltas.length).toBeGreaterThan(1);
    expect(deltas.join("")).not.toHaveLength(0);
  });

  it("is deterministic and echoes the lesson title for grounding", async () => {
    const a = await collect(createMockProvider().stream(messages));
    const b = await collect(createMockProvider().stream(messages));
    expect(a).toEqual(b);
    expect(a).toContain("How the web works");
  });
});
