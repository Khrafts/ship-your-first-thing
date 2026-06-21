import { describe, expect, it } from "vitest";
import { buildTutorMessages, MAX_HISTORY_TURNS, TUTOR_PROMPT } from "@/lib/chat/prompt";

describe("buildTutorMessages", () => {
  const base = {
    lessonTitle: "How the web works",
    lessonBody: "A browser asks a server for a page.",
    history: [],
    userMessage: "what is a server?",
  };

  it("puts the tutor prompt + lesson into a leading system message", () => {
    const msgs = buildTutorMessages(base);
    expect(msgs[0].role).toBe("system");
    expect(msgs[0].content).toContain(TUTOR_PROMPT);
    expect(msgs[0].content).toContain("How the web works");
    expect(msgs[0].content).toContain("A browser asks a server for a page.");
  });

  it("ends with the new user message", () => {
    const msgs = buildTutorMessages(base);
    expect(msgs.at(-1)).toEqual({ role: "user", content: "what is a server?" });
  });

  it("includes prior history between system and the new message", () => {
    const msgs = buildTutorMessages({
      ...base,
      history: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello" },
      ],
    });
    expect(msgs.map((m) => m.role)).toEqual(["system", "user", "assistant", "user"]);
  });

  it("trims history to the last MAX_HISTORY_TURNS messages", () => {
    const history = Array.from({ length: MAX_HISTORY_TURNS + 6 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `m${i}`,
    }));
    const msgs = buildTutorMessages({ ...base, history });
    // system + trimmed history + new user message
    expect(msgs.length).toBe(1 + MAX_HISTORY_TURNS + 1);
  });

  it("drops any non user/assistant roles from history", () => {
    const msgs = buildTutorMessages({
      ...base,
      history: [{ role: "system", content: "sneaky" }],
    });
    expect(msgs.some((m) => m.content === "sneaky")).toBe(false);
  });
});
