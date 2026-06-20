import { beforeAll, describe, expect, it } from "vitest";
import { seedUser, setupTestDb } from "./helpers/test-db";
import {
  appendMessage,
  clearConversation,
  loadConversation,
} from "@/lib/chat/messages";

const LESSON = "modules/00-welcome/01-welcome.md";

describe("chat message persistence", () => {
  beforeAll(async () => {
    const db = await setupTestDb();
    await seedUser(db, "u1");
    await seedUser(db, "u2");
  });

  it("returns an empty transcript when nothing is stored", async () => {
    expect(await loadConversation("u1", LESSON)).toEqual([]);
  });

  it("appends and loads messages in insertion order", async () => {
    await appendMessage("u1", LESSON, "user", "what is HTTP?");
    await appendMessage("u1", LESSON, "assistant", "It is how browsers ask for pages.");
    const convo = await loadConversation("u1", LESSON);
    expect(convo.map((m) => [m.role, m.content])).toEqual([
      ["user", "what is HTTP?"],
      ["assistant", "It is how browsers ask for pages."],
    ]);
  });

  it("isolates conversations by user and by lesson", async () => {
    await appendMessage("u2", LESSON, "user", "different user");
    expect(await loadConversation("u1", LESSON)).toHaveLength(2);
    expect(await loadConversation("u1", "modules/00-welcome/02-hardware-check.md")).toEqual([]);
  });

  it("clears only the targeted conversation", async () => {
    await clearConversation("u1", LESSON);
    expect(await loadConversation("u1", LESSON)).toEqual([]);
    expect(await loadConversation("u2", LESSON)).toHaveLength(1);
  });

  it("preserves insertion order for a rapid burst (seq tiebreaker)", async () => {
    // A tight loop makes created_at collide; order must still hold via seq.
    const lesson = "modules/00-welcome/03-cost-path-triage.md";
    const expected = ["m0", "m1", "m2", "m3", "m4", "m5"];
    for (let i = 0; i < expected.length; i += 1) {
      await appendMessage("u1", lesson, i % 2 === 0 ? "user" : "assistant", expected[i]);
    }
    const convo = await loadConversation("u1", lesson);
    expect(convo.map((m) => m.content)).toEqual(expected);
  });
});
