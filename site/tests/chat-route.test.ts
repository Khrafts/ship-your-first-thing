import { beforeAll, describe, expect, it, vi } from "vitest";

// getChatProvider reads env at CALL time, so this is effective at test run.
// (No OPENROUTER_API_KEY is set, so it would resolve to mock anyway.)
process.env.CHAT_BACKEND = "mock";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/auth";
import { DELETE, GET, POST } from "@/app/api/lesson-chat/route";
import { seedUser, setupTestDb } from "./helpers/test-db";

const LESSON = "modules/00-welcome/01-welcome.md";
// Configure the single mocked auth() for the next handler call.
const asUser = (id: string | null) =>
  vi.mocked(auth).mockResolvedValue((id ? { user: { id } } : null) as never);

async function readSse(res: Response): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let out = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value);
  }
  return out;
}

const post = (payload: unknown) =>
  POST(
    new Request("http://t/api/lesson-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

describe("/api/lesson-chat", () => {
  beforeAll(async () => {
    const db = await setupTestDb();
    await seedUser(db, "u1");
  });

  it("POST streams a reply and persists both turns", async () => {
    asUser("u1");
    const res = await post({ lesson: LESSON, message: "what is a server?" });
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");
    const body = await readSse(res);
    expect(body).toContain("event: delta");
    expect(body).toContain("event: done");

    asUser("u1");
    const getRes = await GET(
      new Request(`http://t/api/lesson-chat?lesson=${encodeURIComponent(LESSON)}`),
    );
    const data = (await getRes.json()) as { messages: { role: string }[] };
    expect(data.messages.map((m) => m.role)).toEqual(["user", "assistant"]);
  });

  it("rejects an unauthenticated POST with 401", async () => {
    asUser(null);
    const res = await post({ lesson: LESSON, message: "hi" });
    expect(res.status).toBe(401);
  });

  it("rejects an unknown lesson with 404", async () => {
    asUser("u1");
    const res = await post({ lesson: "modules/x/y.md", message: "hi" });
    expect(res.status).toBe(404);
  });

  it("rejects an empty message with 400", async () => {
    asUser("u1");
    const res = await post({ lesson: LESSON, message: "   " });
    expect(res.status).toBe(400);
  });

  it("DELETE clears the conversation", async () => {
    asUser("u1");
    const del = await DELETE(
      new Request("http://t/api/lesson-chat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson: LESSON }),
      }),
    );
    expect(del.status).toBe(200);

    asUser("u1");
    const getRes = await GET(
      new Request(`http://t/api/lesson-chat?lesson=${encodeURIComponent(LESSON)}`),
    );
    const data = (await getRes.json()) as { messages: unknown[] };
    expect(data.messages).toEqual([]);
  });
});
