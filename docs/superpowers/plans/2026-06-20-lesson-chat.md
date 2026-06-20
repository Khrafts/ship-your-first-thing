# Lesson Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-lesson AI chat (right-hand drawer launched from a bottom-right pill) to the `site/` course platform, grounded in the open lesson's markdown, streamed from a free OpenRouter model, with transcripts persisted per `(user, lesson)`.

**Architecture:** A client `LessonChat` component mounts on signed-in, unlocked lesson pages and talks to a single SSE route handler (`/api/lesson-chat`). The route authenticates, validates the lesson path against the content allowlist, rate-limits per user, persists messages in Postgres, and streams tokens from a swappable chat provider (`mock` for dev/test, `openrouter` for live). All LLM/prompt/persistence logic lives in small, independently-tested modules under `src/lib/chat/`.

**Tech Stack:** Next.js 16.2.9 (App Router, RSC + route handlers), React 19.2.4, Drizzle ORM + Postgres (PGlite fallback), Auth.js v5, vitest (unit), Playwright (e2e). No new npm dependencies — OpenRouter is reached with hand-rolled `fetch` SSE parsing.

## Global Constraints

- **Node `>=22`, pnpm `11.1.2`.** Run all commands from `site/`.
- **No new runtime npm dependencies.** OpenRouter uses global `fetch` + a hand-rolled SSE parser.
- **`getDb()` is a `globalThis`-keyed singleton** — always `await getDb()`; never cache the handle in a module variable.
- **Canonical lesson id is the repo-relative `lesson.path`** (e.g. `modules/01-mental-models/01-how-the-web-works.md`). Every request path is validated against `getAllLessonRefs()`.
- **Signed-in users only.** Every method of the route calls `await auth()` and rejects when `session.user.id` is absent.
- **Monochrome design tokens only.** Components read CSS variables (`--ink`, `--paper`, `--surface`, `--surface-raised`, `--line`, `--line-strong`, `--ink-secondary`, `--ink-faint`, `--ink-disabled`); dark mode is the `.dark` class on `<html>` — never hardcode a hex or a hue.
- **Escape-first rendering.** Model/user text is HTML-escaped before any markdown transform; no unescaped `dangerouslySetInnerHTML` of model output.
- **Default model `deepseek/deepseek-chat-v3-0324:free`**, overridable via `OPENROUTER_MODEL`. Backend selected by `CHAT_BACKEND` (`openrouter` if `OPENROUTER_API_KEY` set, else `mock`).
- **Commits:** conventional, scoped `feat(site):` / `test(site):` / `chore(site):`. **Never reference AI/Claude/Anthropic** in commit messages, branch names, or code comments. No `Co-Authored-By` lines.
- **Branch:** all work lands on `feat/lesson-chat` (already created off `main`).

---

## File structure

```
NEW  src/lib/chat/types.ts        — ChatMessage, ChatProvider, ChatProviderError, ChatBackend, DEFAULT_MODEL
NEW  src/lib/chat/mock.ts         — createMockProvider() (deterministic streaming)
NEW  src/lib/chat/openrouter.ts   — createOpenRouterProvider() (fetch + SSE parse)
NEW  src/lib/chat/provider.ts     — resolveBackend(), getChatProvider() factory
NEW  src/lib/chat/prompt.ts       — TUTOR_PROMPT, buildTutorMessages()
NEW  src/lib/chat/rate-limit.ts   — createRateLimiter() + module singleton
NEW  src/lib/chat/messages.ts     — loadConversation/appendMessage/clearConversation (Drizzle)
NEW  src/app/api/lesson-chat/route.ts — GET/POST/DELETE (SSE on POST)
NEW  src/components/lesson-chat/lesson-chat.tsx   — FAB + drawer client component
NEW  src/components/lesson-chat/markdown.ts       — escape-first minimal-markdown renderer
NEW  src/components/lesson-chat/lesson-chat.module.css — drawer/FAB styles (token-based)
EDIT src/db/schema.ts             — lessonChatMessage table
NEW  drizzle/0002_*.sql           — generated migration
EDIT src/lib/content/index.ts     — getLessonContext()
EDIT src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx — mount <LessonChat>
EDIT .env.example, README.md      — env docs
EDIT playwright.config.ts         — CHAT_BACKEND=mock in webServer env
NEW  tests/helpers/test-db.ts     — in-memory migrated PGlite bound to getDb()
NEW  tests/chat-messages.test.ts, chat-context.test.ts, chat-mock.test.ts,
     chat-prompt.test.ts, chat-openrouter.test.ts, chat-provider.test.ts,
     chat-rate-limit.test.ts, chat-route.test.ts, chat-markdown.test.ts
NEW  e2e/lesson-chat.spec.ts
```

Dependency order: Task 1 (persistence) and Tasks 2–7, 9 (pure modules) are independent. Task 8 (route) depends on 1–7. Task 10 (component) depends on 9. Task 11 (mount/docs) depends on 10. Task 12 (e2e) depends on all.

---

### Task 1: Chat message persistence (schema + migration + helpers)

**Files:**
- Modify: `src/db/schema.ts`
- Create: `drizzle/0002_*.sql` (generated)
- Create: `tests/helpers/test-db.ts`
- Create: `src/lib/chat/messages.ts`
- Test: `tests/chat-messages.test.ts`

**Interfaces:**
- Produces: `schema.lessonChatMessage`; `loadConversation(userId, lessonPath): Promise<StoredMessage[]>`; `appendMessage(userId, lessonPath, role, content): Promise<void>`; `clearConversation(userId, lessonPath): Promise<void>`; `StoredMessage = { role: string; content: string; createdAt: Date }`. `setupTestDb(): Promise<Db>` (test helper).

- [ ] **Step 1: Add the table to the schema**

In `src/db/schema.ts`, add `index` to the `drizzle-orm/pg-core` import and append:

```ts
// Per-lesson AI chat transcript, one implicit conversation per (user, lesson).
// lessonPath is the canonical repo-relative markdown path (same key as
// lessonProgress). "New chat" deletes this user's rows for the lesson.
export const lessonChatMessage = pgTable(
  "lesson_chat_message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonPath: text("lesson_path").notNull(),
    role: text("role").notNull(), // 'user' | 'assistant'
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("lesson_chat_user_lesson_idx").on(
      table.userId,
      table.lessonPath,
      table.createdAt,
    ),
  ],
);
```

- [ ] **Step 2: Generate the migration**

Run: `pnpm db:generate`
Expected: creates `drizzle/0002_<name>.sql` containing `CREATE TABLE "lesson_chat_message"` and updates `drizzle/meta/_journal.json` + a new snapshot. Inspect the SQL to confirm the table + index.

- [ ] **Step 3: Write the test-db helper**

Create `tests/helpers/test-db.ts`:

```ts
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "@/db/schema";
import type { Db } from "@/db";

const DB_KEY = Symbol.for("ship-your-first-thing.db.promise");

/**
 * Fresh in-memory PGlite with all migrations applied, bound to the same
 * globalThis slot getDb() reads — so code under test that calls getDb()
 * transparently uses this database. Returns the handle for direct seeding.
 */
export async function setupTestDb(): Promise<Db> {
  const client = new PGlite(); // in-memory; gone when the process exits
  const db = drizzle(client, { schema }) as unknown as Db;
  await migrate(db as never, {
    migrationsFolder: path.resolve(__dirname, "..", "..", "drizzle"),
  });
  (globalThis as Record<symbol, unknown>)[DB_KEY] = Promise.resolve(db);
  return db;
}

/** Insert a user row so foreign keys (user_id) are satisfiable. */
export async function seedUser(db: Db, id = "u-test"): Promise<string> {
  await db
    .insert(schema.users)
    .values({ id, email: `${id}@example.com` })
    .onConflictDoNothing();
  return id;
}
```

- [ ] **Step 4: Write the failing persistence test**

Create `tests/chat-messages.test.ts`:

```ts
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
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `pnpm test chat-messages`
Expected: FAIL — `@/lib/chat/messages` not found.

- [ ] **Step 6: Implement the persistence helpers**

Create `src/lib/chat/messages.ts`:

```ts
import { and, asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export interface StoredMessage {
  role: string;
  content: string;
  createdAt: Date;
}

function rowKey(userId: string, lessonPath: string) {
  return and(
    eq(schema.lessonChatMessage.userId, userId),
    eq(schema.lessonChatMessage.lessonPath, lessonPath),
  );
}

export async function loadConversation(
  userId: string,
  lessonPath: string,
): Promise<StoredMessage[]> {
  const db = await getDb();
  return db
    .select({
      role: schema.lessonChatMessage.role,
      content: schema.lessonChatMessage.content,
      createdAt: schema.lessonChatMessage.createdAt,
    })
    .from(schema.lessonChatMessage)
    .where(rowKey(userId, lessonPath))
    .orderBy(asc(schema.lessonChatMessage.createdAt));
}

export async function appendMessage(
  userId: string,
  lessonPath: string,
  role: "user" | "assistant",
  content: string,
): Promise<void> {
  const db = await getDb();
  await db
    .insert(schema.lessonChatMessage)
    .values({ userId, lessonPath, role, content });
}

export async function clearConversation(
  userId: string,
  lessonPath: string,
): Promise<void> {
  const db = await getDb();
  await db.delete(schema.lessonChatMessage).where(rowKey(userId, lessonPath));
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `pnpm test chat-messages`
Expected: PASS (4 tests).

- [ ] **Step 8: Commit**

```bash
git add src/db/schema.ts drizzle/ tests/helpers/test-db.ts src/lib/chat/messages.ts tests/chat-messages.test.ts
git commit -m "feat(site): persist per-lesson chat messages"
```

---

### Task 2: Lesson context loader

**Files:**
- Modify: `src/lib/content/index.ts`
- Test: `tests/chat-context.test.ts`

**Interfaces:**
- Produces: `getLessonContext(lessonPath: string): Promise<{ title: string; body: string } | null>`; `LESSON_CONTEXT_CAP` (number).

- [ ] **Step 1: Write the failing test**

Create `tests/chat-context.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getLessonContext, LESSON_CONTEXT_CAP } from "@/lib/content";

describe("getLessonContext", () => {
  it("returns the title and raw markdown body for a known lesson", async () => {
    const ctx = await getLessonContext("modules/00-welcome/01-welcome.md");
    expect(ctx).not.toBeNull();
    expect(ctx!.title.length).toBeGreaterThan(0);
    expect(ctx!.body.length).toBeGreaterThan(0);
    // body is source markdown (frontmatter stripped), not rendered HTML
    expect(ctx!.body).not.toContain("<p>");
    expect(ctx!.body).not.toMatch(/^---/);
  });

  it("caps the body at LESSON_CONTEXT_CAP characters", async () => {
    const ctx = await getLessonContext("modules/00-welcome/01-welcome.md");
    expect(ctx!.body.length).toBeLessThanOrEqual(LESSON_CONTEXT_CAP);
  });

  it("returns null for an unknown lesson path", async () => {
    expect(await getLessonContext("modules/does-not/exist.md")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-context`
Expected: FAIL — `getLessonContext` is not exported.

- [ ] **Step 3: Implement getLessonContext**

In `src/lib/content/index.ts`, add near the other public functions (after `getLesson`):

```ts
/** Hard cap on lesson text sent to the chat model (keeps the prompt bounded). */
export const LESSON_CONTEXT_CAP = 12_000;

/**
 * Lesson title + raw markdown body for the chat tutor's context. Validates the
 * path against the lesson allowlist (so the chat can never read arbitrary
 * files), strips frontmatter, and caps the body length. Returns null for
 * unknown paths.
 */
export async function getLessonContext(
  lessonPath: string,
): Promise<{ title: string; body: string } | null> {
  const refs = await getAllLessonRefs();
  const ref = refs.find((r) => r.path === lessonPath);
  if (!ref) {
    return null;
  }
  const raw = await readFile(path.join(contentRoot(), ref.path), "utf8");
  const { data, content } = matter(raw);
  const title = String(data.title ?? ref.title ?? "").trim();
  const body = content.trim().slice(0, LESSON_CONTEXT_CAP);
  return { title, body };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-context`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/content/index.ts tests/chat-context.test.ts
git commit -m "feat(site): expose lesson markdown as chat context"
```

---

### Task 3: Chat types + mock provider

**Files:**
- Create: `src/lib/chat/types.ts`
- Create: `src/lib/chat/mock.ts`
- Test: `tests/chat-mock.test.ts`

**Interfaces:**
- Produces: `ChatMessage = { role: "system" | "user" | "assistant"; content: string }`; `interface ChatProvider { stream(messages: ChatMessage[], signal?: AbortSignal): AsyncIterable<string> }`; `class ChatProviderError extends Error { status?: number; kind?: ChatErrorKind }`; `type ChatErrorKind = "rate-limit" | "quota" | "config" | "upstream"`; `type ChatBackend = "openrouter" | "mock"`; `DEFAULT_MODEL` (string); `createMockProvider(): ChatProvider`.

- [ ] **Step 1: Write the types module**

Create `src/lib/chat/types.ts`:

```ts
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
```

- [ ] **Step 2: Write the failing mock test**

Create `tests/chat-mock.test.ts`:

```ts
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test chat-mock`
Expected: FAIL — `@/lib/chat/mock` not found.

- [ ] **Step 4: Implement the mock provider**

Create `src/lib/chat/mock.ts`:

```ts
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test chat-mock`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/chat/types.ts src/lib/chat/mock.ts tests/chat-mock.test.ts
git commit -m "feat(site): add chat provider types and mock backend"
```

---

### Task 4: Tutor prompt assembly

**Files:**
- Create: `src/lib/chat/prompt.ts`
- Test: `tests/chat-prompt.test.ts`

**Interfaces:**
- Consumes: `ChatMessage` from `./types`.
- Produces: `TUTOR_PROMPT` (string); `MAX_HISTORY_TURNS` (number); `buildTutorMessages(args: { lessonTitle: string; lessonBody: string; history: { role: string; content: string }[]; userMessage: string }): ChatMessage[]`.

- [ ] **Step 1: Write the failing test**

Create `tests/chat-prompt.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-prompt`
Expected: FAIL — `@/lib/chat/prompt` not found.

- [ ] **Step 3: Implement the prompt builder**

Create `src/lib/chat/prompt.ts`:

```ts
import type { ChatMessage } from "./types";

/** How many trailing history messages to resend (OpenRouter is stateless). */
export const MAX_HISTORY_TURNS = 12;

export const TUTOR_PROMPT = [
  "You are a friendly tutor built into a course that teaches a non-technical",
  "beginner to ship their first deployed app with the help of AI coding tools.",
  "You sit in a chat panel beside the lesson the learner is reading.",
  "",
  "How to answer:",
  "- Ground every answer in THIS lesson first; the lesson text is provided below.",
  "- Explain in plain language. Define any technical term the moment you use it.",
  "- Match a beginner's level: no unexplained jargon, no assumed prior knowledge.",
  "- If the lesson does not cover something, say so plainly and suggest where it",
  "  might come later — never invent lesson content that is not there.",
  "- Be concise and warm. Use markdown sparingly (short lists, inline code,",
  "  fenced code blocks only when showing code).",
  "- Avoid empty reassurance like 'just a few clicks' or 'simply' — name the real",
  "  step instead.",
  "- Never reveal or repeat secrets, API keys, tokens, or passwords from any source.",
].join("\n");

interface BuildArgs {
  lessonTitle: string;
  lessonBody: string;
  history: { role: string; content: string }[];
  userMessage: string;
}

export function buildTutorMessages({
  lessonTitle,
  lessonBody,
  history,
  userMessage,
}: BuildArgs): ChatMessage[] {
  const system: ChatMessage = {
    role: "system",
    content: `${TUTOR_PROMPT}\n\nLESSON: ${lessonTitle}\n---\n${lessonBody}\n---`,
  };
  const trimmed = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
  return [system, ...trimmed, { role: "user", content: userMessage }];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-prompt`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/chat/prompt.ts tests/chat-prompt.test.ts
git commit -m "feat(site): assemble lesson-grounded tutor prompt"
```

---

### Task 5: OpenRouter streaming provider

**Files:**
- Create: `src/lib/chat/openrouter.ts`
- Test: `tests/chat-openrouter.test.ts`

**Interfaces:**
- Consumes: `ChatMessage`, `ChatProvider`, `ChatProviderError` from `./types`.
- Produces: `createOpenRouterProvider(opts: OpenRouterOptions): ChatProvider`; `OpenRouterOptions = { apiKey: string; model: string; baseUrl?: string; referer?: string; title?: string; fetchImpl?: typeof fetch }`.

- [ ] **Step 1: Write the failing test**

Create `tests/chat-openrouter.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createOpenRouterProvider } from "@/lib/chat/openrouter";
import { ChatProviderError } from "@/lib/chat/types";

/** Build a Response whose body streams the given byte chunks (one per read). */
function sseResponse(chunks: string[], init?: ResponseInit): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
  return new Response(stream, init);
}

async function collect(it: AsyncIterable<string>): Promise<string> {
  let out = "";
  for await (const d of it) out += d;
  return out;
}

describe("openrouter provider", () => {
  it("parses delta content across SSE frames and stops at [DONE]", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        ': OPENROUTER PROCESSING\n\n',
        'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    );
    const provider = createOpenRouterProvider({
      apiKey: "k",
      model: "m",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await collect(provider.stream([{ role: "user", content: "hi" }]))).toBe("Hello");
  });

  it("handles a delta split across two read chunks", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'data: {"choices":[{"delta":{"content":"wor',
        'ld"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    );
    const provider = createOpenRouterProvider({
      apiKey: "k",
      model: "m",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(await collect(provider.stream([{ role: "user", content: "hi" }]))).toBe("world");
  });

  it("throws a rate-limit ChatProviderError on HTTP 429", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("nope", { status: 429 }));
    const provider = createOpenRouterProvider({
      apiKey: "k",
      model: "m",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(collect(provider.stream([{ role: "user", content: "hi" }]))).rejects.toMatchObject({
      name: "ChatProviderError",
      kind: "rate-limit",
      status: 429,
    });
    expect(ChatProviderError).toBeDefined();
  });

  it("sends the model, messages, key and stream flag", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(sseResponse(["data: [DONE]\n\n"]));
    const provider = createOpenRouterProvider({
      apiKey: "secret",
      model: "deepseek/deepseek-chat-v3-0324:free",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await collect(provider.stream([{ role: "user", content: "hi" }]));
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toContain("/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("deepseek/deepseek-chat-v3-0324:free");
    expect(body.stream).toBe(true);
    expect(body.messages).toEqual([{ role: "user", content: "hi" }]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-openrouter`
Expected: FAIL — `@/lib/chat/openrouter` not found.

- [ ] **Step 3: Implement the OpenRouter provider**

Create `src/lib/chat/openrouter.ts`:

```ts
import type { ChatMessage, ChatProvider } from "./types";
import { ChatProviderError } from "./types";

export interface OpenRouterOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  referer?: string;
  title?: string;
  fetchImpl?: typeof fetch;
}

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

function errorKind(status: number): ChatProviderError["kind"] {
  if (status === 429) return "rate-limit";
  if (status === 402) return "quota";
  if (status === 401 || status === 403) return "config";
  return "upstream";
}

export function createOpenRouterProvider(opts: OpenRouterOptions): ChatProvider {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL;

  return {
    async *stream(messages: ChatMessage[], signal?: AbortSignal) {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      };
      if (opts.referer) headers["HTTP-Referer"] = opts.referer;
      if (opts.title) headers["X-Title"] = opts.title;

      const res = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ model: opts.model, messages, stream: true }),
        signal,
      });

      if (!res.ok) {
        throw new ChatProviderError(
          `OpenRouter request failed (${res.status})`,
          errorKind(res.status),
          res.status,
        );
      }
      if (!res.body) {
        throw new ChatProviderError("OpenRouter returned no body", "upstream");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue; // skip ": comment" keep-alives
          const data = trimmed.slice("data:".length).trim();
          if (data === "[DONE]") return;
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              yield delta;
            }
          } catch {
            // partial/non-JSON line — ignore, more bytes will follow
          }
        }
      }
    },
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-openrouter`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/chat/openrouter.ts tests/chat-openrouter.test.ts
git commit -m "feat(site): stream chat completions from OpenRouter"
```

---

### Task 6: Provider factory

**Files:**
- Create: `src/lib/chat/provider.ts`
- Test: `tests/chat-provider.test.ts`

**Interfaces:**
- Consumes: `createMockProvider` (Task 3), `createOpenRouterProvider` (Task 5), types (Task 3).
- Produces: `resolveBackend(env: NodeJS.ProcessEnv): ChatBackend`; `getChatProvider(env?: NodeJS.ProcessEnv): ChatProvider` (throws `ChatProviderError` kind `config` when openrouter is selected without a key).

- [ ] **Step 1: Write the failing test**

Create `tests/chat-provider.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-provider`
Expected: FAIL — `@/lib/chat/provider` not found.

- [ ] **Step 3: Implement the factory**

Create `src/lib/chat/provider.ts`:

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-provider`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/chat/provider.ts tests/chat-provider.test.ts
git commit -m "feat(site): select chat backend from environment"
```

---

### Task 7: Per-user rate limiter

**Files:**
- Create: `src/lib/chat/rate-limit.ts`
- Test: `tests/chat-rate-limit.test.ts`

**Interfaces:**
- Produces: `createRateLimiter(opts: { perMin: number; perDay: number; now?: () => number }): { check(userId: string): { ok: boolean; retryAfterSec?: number } }`; `chatRateLimiter` (module singleton reading `CHAT_RATE_PER_MIN`/`CHAT_RATE_PER_DAY`).

- [ ] **Step 1: Write the failing test**

Create `tests/chat-rate-limit.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/chat/rate-limit";

describe("rate limiter", () => {
  it("allows up to perMin requests then blocks within the minute", () => {
    let t = 1_000_000;
    const rl = createRateLimiter({ perMin: 2, perDay: 100, now: () => t });
    expect(rl.check("u").ok).toBe(true);
    expect(rl.check("u").ok).toBe(true);
    const blocked = rl.check("u");
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("recovers after the minute window passes", () => {
    let t = 0;
    const rl = createRateLimiter({ perMin: 1, perDay: 100, now: () => t });
    expect(rl.check("u").ok).toBe(true);
    expect(rl.check("u").ok).toBe(false);
    t += 61_000;
    expect(rl.check("u").ok).toBe(true);
  });

  it("enforces the daily cap independently of the minute cap", () => {
    let t = 0;
    const rl = createRateLimiter({ perMin: 100, perDay: 2, now: () => t });
    expect(rl.check("u").ok).toBe(true);
    t += 2_000;
    expect(rl.check("u").ok).toBe(true);
    t += 2_000;
    expect(rl.check("u").ok).toBe(false);
  });

  it("tracks users independently", () => {
    let t = 0;
    const rl = createRateLimiter({ perMin: 1, perDay: 10, now: () => t });
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("b").ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-rate-limit`
Expected: FAIL — `@/lib/chat/rate-limit` not found.

- [ ] **Step 3: Implement the limiter**

Create `src/lib/chat/rate-limit.ts`:

```ts
interface RateLimiterOptions {
  perMin: number;
  perDay: number;
  now?: () => number;
}

export interface RateDecision {
  ok: boolean;
  retryAfterSec?: number;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * 60_000;

/**
 * In-memory per-user sliding-window limiter. Single-instance only (fine at
 * current scale); OpenRouter's own 429 is the cross-instance backstop. Keeps a
 * timestamp list per user, pruned to the last day on each check.
 */
export function createRateLimiter({ perMin, perDay, now = () => Date.now() }: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  return {
    check(userId: string): RateDecision {
      const t = now();
      const recent = (hits.get(userId) ?? []).filter((ts) => t - ts < DAY);
      const inMinute = recent.filter((ts) => t - ts < MINUTE).length;
      const inDay = recent.length;

      if (inMinute >= perMin) {
        const oldestInWindow = recent.find((ts) => t - ts < MINUTE) ?? t;
        return { ok: false, retryAfterSec: Math.ceil((MINUTE - (t - oldestInWindow)) / 1000) };
      }
      if (inDay >= perDay) {
        return { ok: false, retryAfterSec: Math.ceil((DAY - (t - recent[0])) / 1000) };
      }
      recent.push(t);
      hits.set(userId, recent);
      return { ok: true };
    },
  };
}

function envInt(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

/** Process-wide singleton used by the route. */
export const chatRateLimiter = createRateLimiter({
  perMin: envInt("CHAT_RATE_PER_MIN", 10),
  perDay: envInt("CHAT_RATE_PER_DAY", 40),
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-rate-limit`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/chat/rate-limit.ts tests/chat-rate-limit.test.ts
git commit -m "feat(site): rate-limit lesson chat per user"
```

---

### Task 8: Lesson chat API route

**Files:**
- Create: `src/app/api/lesson-chat/route.ts`
- Test: `tests/chat-route.test.ts`

**Interfaces:**
- Consumes: `auth` (`@/auth`), `getLessonContext` (Task 2), `loadConversation`/`appendMessage`/`clearConversation` (Task 1), `buildTutorMessages` (Task 4), `getChatProvider` (Task 6), `chatRateLimiter` (Task 7), `ChatProviderError` (Task 3).
- Produces: `GET`, `POST`, `DELETE` route handlers. SSE framing on POST: `event: delta\ndata: {"text":"…"}\n\n`, terminal `event: done\ndata: {}\n\n` or `event: error\ndata: {"message":"…"}\n\n`.

> **Note on test isolation:** the route test mocks `@/auth` (configured per-call via `vi.mocked(auth).mockResolvedValue`), imports the route handlers statically, and uses `setupTestDb()` + `seedUser()`. `getChatProvider()` reads env at call time, so `process.env.CHAT_BACKEND = "mock"` is effective; the default rate limit (10/min) comfortably covers the single successful POST in this suite (the 401/404/400 paths return before the limiter runs).

- [ ] **Step 1: Write the failing test**

Create `tests/chat-route.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-route`
Expected: FAIL — route module not found.

- [ ] **Step 3: Implement the route**

Create `src/app/api/lesson-chat/route.ts`:

```ts
import { auth } from "@/auth";
import {
  appendMessage,
  clearConversation,
  loadConversation,
} from "@/lib/chat/messages";
import { buildTutorMessages } from "@/lib/chat/prompt";
import { getChatProvider } from "@/lib/chat/provider";
import { chatRateLimiter } from "@/lib/chat/rate-limit";
import { ChatProviderError } from "@/lib/chat/types";
import { getLessonContext } from "@/lib/content";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LEN = 4_000;

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function friendlyError(err: unknown): string {
  if (err instanceof ChatProviderError) {
    if (err.kind === "rate-limit" || err.kind === "quota") {
      return "The free chat is at its limit right now — please try again later.";
    }
    if (err.kind === "config") {
      return "Chat isn't configured on this server yet.";
    }
  }
  return "The chat ran into a problem. Please try again.";
}

export async function GET(req: Request): Promise<Response> {
  const userId = await currentUserId();
  if (!userId) return json(401, { error: "unauthenticated" });

  const lesson = new URL(req.url).searchParams.get("lesson");
  if (!lesson) return json(400, { error: "bad-request" });
  if (!(await getLessonContext(lesson))) return json(404, { error: "unknown-lesson" });

  const messages = await loadConversation(userId, lesson);
  return json(200, {
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
}

export async function POST(req: Request): Promise<Response> {
  const userId = await currentUserId();
  if (!userId) return json(401, { error: "unauthenticated" });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "bad-request" });
  }
  const lesson = (body as { lesson?: unknown }).lesson;
  const message = (body as { message?: unknown }).message;
  if (typeof lesson !== "string" || typeof message !== "string" || !message.trim()) {
    return json(400, { error: "bad-request" });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return json(400, { error: "too-long" });
  }

  const ctx = await getLessonContext(lesson);
  if (!ctx) return json(404, { error: "unknown-lesson" });

  const decision = chatRateLimiter.check(userId);
  if (!decision.ok) {
    return json(429, { error: "rate-limited", retryAfterSec: decision.retryAfterSec });
  }

  // Resolve the provider BEFORE persisting, so a misconfig is a clean 503.
  let provider;
  try {
    provider = getChatProvider();
  } catch (err) {
    return json(503, { error: "not-configured", message: friendlyError(err) });
  }

  const history = await loadConversation(userId, lesson);
  await appendMessage(userId, lesson, "user", message);
  const messages = buildTutorMessages({
    lessonTitle: ctx.title,
    lessonBody: ctx.body,
    history,
    userMessage: message,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const frame = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      let acc = "";
      try {
        for await (const delta of provider.stream(messages)) {
          acc += delta;
          frame("delta", { text: delta });
        }
        if (acc) await appendMessage(userId, lesson, "assistant", acc);
        frame("done", {});
      } catch (err) {
        if (acc) await appendMessage(userId, lesson, "assistant", acc);
        frame("error", { message: friendlyError(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function DELETE(req: Request): Promise<Response> {
  const userId = await currentUserId();
  if (!userId) return json(401, { error: "unauthenticated" });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "bad-request" });
  }
  const lesson = (body as { lesson?: unknown }).lesson;
  if (typeof lesson !== "string") return json(400, { error: "bad-request" });
  if (!(await getLessonContext(lesson))) return json(404, { error: "unknown-lesson" });

  await clearConversation(userId, lesson);
  return json(200, { ok: true });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-route`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/lesson-chat/route.ts tests/chat-route.test.ts
git commit -m "feat(site): add streaming lesson-chat API route"
```

---

### Task 9: Assistant markdown renderer (escape-first)

**Files:**
- Create: `src/components/lesson-chat/markdown.ts`
- Test: `tests/chat-markdown.test.ts`

**Interfaces:**
- Produces: `renderAssistantMarkdown(src: string): string` (returns a safe HTML string; all source text is HTML-escaped before any markdown transform).

- [ ] **Step 1: Write the failing test**

Create `tests/chat-markdown.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { renderAssistantMarkdown } from "@/components/lesson-chat/markdown";

describe("renderAssistantMarkdown", () => {
  it("escapes raw HTML so model output cannot inject markup", () => {
    const html = renderAssistantMarkdown("<img src=x onerror=alert(1)> hello");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("renders **bold** and `inline code`", () => {
    const html = renderAssistantMarkdown("use **npm** and the `dev` script");
    expect(html).toContain("<strong>npm</strong>");
    expect(html).toContain("<code>dev</code>");
  });

  it("renders a fenced code block, escaping its contents", () => {
    const html = renderAssistantMarkdown("```\n<b>x</b>\n```");
    expect(html).toContain("<pre>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).not.toContain("<b>x</b>");
  });

  it("does not apply bold/italic inside code", () => {
    const html = renderAssistantMarkdown("`**not bold**`");
    expect(html).toContain("<code>**not bold**</code>");
    expect(html).not.toContain("<strong>");
  });

  it("renders bullet lists", () => {
    const html = renderAssistantMarkdown("- one\n- two");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain("<li>two</li>");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test chat-markdown`
Expected: FAIL — `@/components/lesson-chat/markdown` not found.

- [ ] **Step 3: Implement the renderer**

Create `src/components/lesson-chat/markdown.ts`:

```ts
// Escape-first minimal markdown for assistant turns. Everything is HTML-escaped
// before any transform, so no model output can become live markup. Supports
// fenced code blocks, inline code, bold, italics, and bullet lists — nothing
// that can carry a URL or raw HTML.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(escaped: string): string {
  // Operates on already-escaped text; never reintroduces raw HTML.
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

export function renderAssistantMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith("```")) {
      closeList();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // Bullet list item
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${inlineWithCode(bullet[1])}</li>`);
      i += 1;
      continue;
    }

    closeList();
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    out.push(`<p>${inlineWithCode(line)}</p>`);
    i += 1;
  }
  closeList();
  return out.join("");
}

// Inline code first (so its contents are escaped and shielded from bold/italic),
// then escape the rest and apply emphasis.
function inlineWithCode(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }
      return inline(escapeHtml(part));
    })
    .join("");
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test chat-markdown`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/lesson-chat/markdown.ts tests/chat-markdown.test.ts
git commit -m "feat(site): escape-first markdown for chat replies"
```

---

### Task 10: LessonChat client component + styles

> **UI sub-skill:** before finalizing the styling in this task, use the `ui-ux-pro-max` skill to review/refine the drawer + FAB against the site's monochrome tokens and dark mode. The code below is a working baseline; ui-ux-pro-max polishes spacing, motion, and states.

**Files:**
- Create: `src/components/lesson-chat/lesson-chat.tsx`
- Create: `src/components/lesson-chat/lesson-chat.module.css`

**Interfaces:**
- Consumes: `renderAssistantMarkdown` (Task 9); the `/api/lesson-chat` contract (Task 8).
- Produces: `LessonChat({ lessonPath, lessonTitle }: { lessonPath: string; lessonTitle: string })`.

- [ ] **Step 1: Write the component**

Create `src/components/lesson-chat/lesson-chat.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { renderAssistantMarkdown } from "./markdown";
import styles from "./lesson-chat.module.css";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  lessonPath: string;
  lessonTitle: string;
}

interface Frame {
  event: string;
  data: { text?: string; message?: string };
}

function parseFrame(raw: string): Frame | null {
  const lines = raw.split("\n");
  let event = "message";
  let data = "";
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return null;
  try {
    return { event, data: JSON.parse(data) };
  } catch {
    return null;
  }
}

export function LessonChat({ lessonPath, lessonTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore the transcript the first time the drawer opens.
  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lesson-chat?lesson=${encodeURIComponent(lessonPath)}`);
        if (!cancelled && res.ok) {
          const data = (await res.json()) as { messages: Msg[] };
          setMessages(data.messages ?? []);
        }
      } finally {
        if (!cancelled) {
          setLoaded(true);
          inputRef.current?.focus();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, loaded, lessonPath]);

  // Persisted expand preference.
  useEffect(() => {
    setExpanded(localStorage.getItem("lesson-chat-expanded") === "1");
  }, []);

  // Auto-scroll to the newest content.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingText]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("lesson-chat-expanded", next ? "1" : "0");
      return next;
    });
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setStreaming(true);
    setStreamingText("");
    let acc = "";
    try {
      const res = await fetch("/api/lesson-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson: lessonPath, message: text }),
      });
      if (!res.ok || !res.body) {
        setError(
          res.status === 429
            ? "You're sending messages quickly — give it a moment."
            : "The chat couldn't respond. Please try again.",
        );
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const raw of frames) {
          const frame = parseFrame(raw);
          if (!frame) continue;
          if (frame.event === "delta") {
            acc += frame.data.text ?? "";
            setStreamingText(acc);
          } else if (frame.event === "error") {
            setError(frame.data.message ?? "The chat ran into a problem.");
          }
        }
      }
    } catch {
      setError("The chat couldn't respond. Please try again.");
    } finally {
      if (acc) setMessages((m) => [...m, { role: "assistant", content: acc }]);
      setStreamingText("");
      setStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, streaming, lessonPath]);

  const newChat = useCallback(async () => {
    setError(null);
    setMessages([]);
    setStreamingText("");
    try {
      await fetch("/api/lesson-chat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson: lessonPath }),
      });
    } catch {
      /* local state already cleared; ignore */
    }
    inputRef.current?.focus();
  }, [lessonPath]);

  const onInputKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const hasChat = messages.length > 0;

  return (
    <>
      {!open && (
        <button type="button" className={styles.fab} onClick={() => setOpen(true)}>
          {hasChat ? "Continue the chat" : "Ask about this lesson"}
        </button>
      )}

      <aside
        className={styles.panel}
        data-open={open}
        data-expanded={expanded}
        aria-hidden={!open}
        aria-label="Lesson chat"
      >
        <header className={styles.head}>
          <div className={styles.heading}>
            <span className={styles.kicker}>Lesson chat</span>
            <span className={styles.title}>{lessonTitle}</span>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={newChat} className={styles.action} title="New chat">
              New chat
            </button>
            <button
              type="button"
              onClick={toggleExpand}
              className={styles.action}
              aria-pressed={expanded}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={styles.action}
              title="Close"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </header>

        <div className={styles.messages} ref={scrollRef} role="log" aria-live="polite">
          {!hasChat && !streaming && (
            <p className={styles.empty}>
              Ask anything about this lesson — what a term means, why a step
              matters, or what to try next.
            </p>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "user" ? styles.msgUser : styles.msgAssistant}>
              <span className={styles.who}>{m.role === "user" ? "You" : "Tutor"}</span>
              {m.role === "user" ? (
                <p className={styles.body}>{m.content}</p>
              ) : (
                <div
                  className={styles.body}
                  dangerouslySetInnerHTML={{ __html: renderAssistantMarkdown(m.content) }}
                />
              )}
            </div>
          ))}
          {streaming && (
            <div className={styles.msgAssistant}>
              <span className={styles.who}>Tutor</span>
              {streamingText ? (
                <div
                  className={styles.body}
                  dangerouslySetInnerHTML={{ __html: renderAssistantMarkdown(streamingText) }}
                />
              ) : (
                <span className={styles.dots} aria-label="Thinking">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKey}
            placeholder="Ask about this lesson…"
            rows={1}
            disabled={streaming}
          />
          <button
            type="button"
            className={styles.send}
            onClick={send}
            disabled={!input.trim() || streaming}
          >
            Send
          </button>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Write the styles**

Create `src/components/lesson-chat/lesson-chat.module.css` (all colors via tokens; dark mode inherits):

```css
.fab {
  position: fixed;
  right: 1.4rem;
  bottom: 1.4rem;
  z-index: 60;
  border: 1.5px solid var(--ink);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
  padding: 0.6rem 1.05rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.fab:hover {
  background: var(--ink);
  color: var(--paper);
  transform: translateY(-1px);
}

.panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  width: 420px;
  max-width: 100vw;
  height: 100vh;
  background: var(--paper);
  border-left: 1.5px solid var(--ink);
  transform: translateX(100%);
  visibility: hidden;
  transition: transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    width 0.28s cubic-bezier(0.2, 0.7, 0.2, 1), visibility 0s 0.28s;
}
.panel[data-open="true"] {
  transform: translateX(0);
  visibility: visible;
  transition: transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    width 0.28s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.panel[data-expanded="true"] {
  width: 720px;
}
@media (max-width: 640px) {
  .panel,
  .panel[data-expanded="true"] {
    width: 100vw;
  }
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-bottom: 1.5px solid var(--ink);
}
.heading {
  min-width: 0;
}
.kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
}
.title {
  display: block;
  font-family: var(--font-serif);
  font-size: 0.98rem;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.actions {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}
.action {
  border: 1px solid var(--line-strong);
  background: var(--paper);
  color: var(--ink-secondary);
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.action:hover {
  background: var(--ink);
  color: var(--paper);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.1rem;
}
.empty {
  color: var(--ink-faint);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.5;
}
.msgUser,
.msgAssistant {
  padding: 0.9rem 0;
  border-top: 1px solid var(--line);
}
.msgUser:first-child,
.msgAssistant:first-child {
  border-top: none;
}
.who {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  margin-bottom: 0.35rem;
}
.msgUser .body {
  font-family: var(--font-mono);
  font-size: 0.84rem;
  color: var(--ink-secondary);
  white-space: pre-wrap;
}
.msgAssistant .body {
  font-family: var(--font-serif);
  font-size: 0.96rem;
  line-height: 1.55;
  color: var(--ink);
}
.body :global(pre) {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.7rem 0.8rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.82rem;
}
.body :global(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--surface-raised);
  border-radius: 3px;
  padding: 0.05rem 0.3rem;
}
.body :global(pre code) {
  background: none;
  padding: 0;
}
.body :global(ul) {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}

.dots {
  display: inline-flex;
  gap: 0.25rem;
}
.dots i {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--ink-faint);
  animation: lc-pulse 1.2s ease-in-out infinite;
}
.dots i:nth-child(2) {
  animation-delay: 0.15s;
}
.dots i:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes lc-pulse {
  0%, 80%, 100% {
    opacity: 0.25;
  }
  40% {
    opacity: 1;
  }
}

.error {
  margin-top: 0.75rem;
  border-left: 2px solid var(--ink);
  padding: 0.5rem 0.7rem;
  background: var(--surface);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--ink-secondary);
}

.inputRow {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  padding: 0.8rem 1.1rem;
  border-top: 1.5px solid var(--ink);
}
.input {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.45;
  max-height: 160px;
}
.input::placeholder {
  color: var(--ink-faint);
}
.send {
  border: 1px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
  border-radius: 5px;
  padding: 0.4rem 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.send:hover:not(:disabled) {
  background: var(--ink);
  color: var(--paper);
}
.send:disabled {
  color: var(--ink-disabled);
  border-color: var(--line);
  cursor: default;
}

@media print {
  .fab,
  .panel {
    display: none !important;
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: no errors from `src/components/lesson-chat/`.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson-chat/lesson-chat.tsx src/components/lesson-chat/lesson-chat.module.css
git commit -m "feat(site): lesson chat drawer component"
```

---

### Task 11: Mount the chat + env/config docs

**Files:**
- Modify: `src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx`
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `playwright.config.ts`

**Interfaces:**
- Consumes: `LessonChat` (Task 10).

- [ ] **Step 1: Mount the component on unlocked, signed-in lessons**

In `src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx`, add the import:

```ts
import { LessonChat } from "@/components/lesson-chat/lesson-chat";
```

Then, inside the final `return (...)` (the unlocked branch), immediately before the closing `</article>` of the main content (after the `<nav>` prev/next block), add:

```tsx
        {userId && (
          <LessonChat lessonPath={lesson.path} lessonTitle={lesson.title} />
        )}
```

(The component renders a fixed-position FAB + drawer, so its placement in the tree only affects when it mounts — signed-in and unlocked — not its layout.)

- [ ] **Step 2: Document the environment variables**

Append to `.env.example`:

```bash
# --- Lesson chat (per-lesson AI tutor) ---
# Free models live at https://openrouter.ai (key required; free tier ~50 req/day).
# With no key, chat falls back to a deterministic mock so dev/test work offline.
OPENROUTER_API_KEY=
# Model id; any OpenRouter ":free" model works. Default if unset:
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
# Force a backend: "openrouter" or "mock". Default: openrouter if key set, else mock.
CHAT_BACKEND=
# Optional endpoint + attribution overrides.
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_REFERER=
# Per-user rate limits (the free tier is small — keep these modest).
CHAT_RATE_PER_MIN=10
CHAT_RATE_PER_DAY=40
```

- [ ] **Step 3: Document the feature in the site README**

In `README.md`, add a short "Lesson chat" section under the existing configuration/feature notes:

```markdown
## Lesson chat

Each unlocked lesson shows an "Ask about this lesson" pill (signed-in users)
that opens a chat drawer. Answers are grounded in that lesson's text and
streamed from a free OpenRouter model. Transcripts persist per user + lesson.

Set `OPENROUTER_API_KEY` to enable the live model (free tier ~50 requests/day;
a one-time $10 credit purchase raises it to ~1000/day). With no key the chat
uses a deterministic mock, so local dev and the test suite need no key and
spend no tokens. Config: `OPENROUTER_MODEL`, `CHAT_BACKEND`,
`CHAT_RATE_PER_MIN`, `CHAT_RATE_PER_DAY` (see `.env.example`).
```

- [ ] **Step 4: Make the e2e server use the mock backend**

In `playwright.config.ts`, add to the `webServer.env` block:

```ts
      // Lesson chat runs against the deterministic mock in e2e — no key, no tokens.
      CHAT_BACKEND: "mock",
```

- [ ] **Step 5: Typecheck + unit tests**

Run: `pnpm typecheck && pnpm test`
Expected: typecheck clean; all unit tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/modules/ .env.example README.md playwright.config.ts
git commit -m "feat(site): mount lesson chat and document configuration"
```

---

### Task 12: End-to-end test

**Files:**
- Create: `e2e/lesson-chat.spec.ts`

**Interfaces:**
- Consumes: `signUp`, `uniqueEmail`, `FIRST_LESSON_URL` from `e2e/helpers.ts`.

- [ ] **Step 1: Write the e2e spec**

Create `e2e/lesson-chat.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { FIRST_LESSON_URL, signUp, uniqueEmail } from "./helpers";

test.describe("lesson chat", () => {
  test("signed-in learner can chat, and the transcript persists", async ({ page }) => {
    await signUp(page, {
      name: "Chat Learner",
      email: uniqueEmail("chat"),
      password: "correct-horse-battery",
    });

    await page.goto(FIRST_LESSON_URL);

    const fab = page.getByRole("button", { name: "Ask about this lesson" });
    await expect(fab).toBeVisible();
    await fab.click();

    const input = page.getByPlaceholder("Ask about this lesson…");
    await input.fill("What will I learn here?");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    // Mock backend streams a deterministic reply containing "mock tutor reply".
    await expect(page.getByText(/mock tutor reply/i)).toBeVisible();
    await expect(page.getByText("What will I learn here?")).toBeVisible();

    // Reload → transcript restored, FAB now says "Continue the chat".
    await page.reload();
    await expect(page.getByRole("button", { name: "Continue the chat" })).toBeVisible();
    await page.getByRole("button", { name: "Continue the chat" }).click();
    await expect(page.getByText("What will I learn here?")).toBeVisible();

    // New chat clears the transcript.
    await page.getByRole("button", { name: "New chat" }).click();
    await expect(page.getByText("What will I learn here?")).toHaveCount(0);
  });

  test("signed-out viewer sees no chat affordance", async ({ page }) => {
    await page.goto(FIRST_LESSON_URL);
    await expect(page.getByRole("button", { name: "Ask about this lesson" })).toHaveCount(0);
  });
});
```

- [ ] **Step 2: Build and run the e2e suite**

Run: `pnpm e2e:full -- lesson-chat`
Expected: both tests PASS (production build, PGlite, mock chat backend).

- [ ] **Step 3: Commit**

```bash
git add e2e/lesson-chat.spec.ts
git commit -m "test(site): e2e lesson chat flow"
```

---

## Final verification

- [ ] `pnpm typecheck` — clean.
- [ ] `pnpm lint` — clean.
- [ ] `pnpm test` — all unit suites pass.
- [ ] `pnpm e2e:full` — full e2e suite passes (chat + existing specs).
- [ ] Manual live smoke (optional, needs a real key): set `OPENROUTER_API_KEY`, run `pnpm dev`, open a lesson, send a message, confirm a streamed real reply.

## Self-review notes (author)

- **Spec coverage:** persistence (T1), context (T2), provider+mock (T3,T6), prompt/pedagogy (T4), OpenRouter+streaming (T5), rate limit (T7), route+SSE+auth+validation (T8), escape-first rendering (T9), drawer UI matching the reference (T10), mount+gating+env docs (T11), e2e (T12). Security (auth gate, path allowlist, escape-first, key server-only, body caps) is spread across T2/T8/T9. Error handling table → T8 `friendlyError` + component states (T10).
- **Out of scope (per spec):** multi-conversation history browser, rich tables/images in replies, distributed rate limiting. The schema stays single-conversation-per-lesson.
- **Type consistency:** `ChatMessage`/`ChatProvider`/`ChatProviderError` defined once in `types.ts`; `getChatProvider`/`resolveBackend` names match across T6 and T8; `loadConversation`/`appendMessage`/`clearConversation` signatures match across T1 and T8; `renderAssistantMarkdown` matches across T9 and T10.
```
