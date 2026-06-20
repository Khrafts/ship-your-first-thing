# Lesson Chat — design

**Date:** 2026-06-20 · **Branch:** `feat/lesson-chat` · **Scope:** `site/` (the Next.js course platform)

## Goal

A learner reading a lesson on the course platform can open a chat panel, ask
questions about that lesson, and get answers grounded in the lesson's content.
The look and feel mirror the `daily-lessons` plugin's lesson chat (a right-hand
sliding drawer launched from a bottom-right pill), adapted to this site's
monochrome design tokens and dark mode. The chat is powered by a **free,
open-source LLM via OpenRouter** (default `deepseek/deepseek-chat-v3-0324:free`,
configurable). Transcripts persist per `(user, lesson)` so reopening a lesson
continues the conversation. Delivered on the `feat/lesson-chat` branch.

## What we keep from the `daily-lessons` reference (look & feel)

The reference (`/Users/khrafts/Work/khrafts/daily-lessons`, design at
`docs/superpowers/specs/2026-06-10-lesson-chat-design.md`) defines the UX contract
we reproduce:

- A fixed **bottom-right pill FAB** — "Ask about this lesson", becoming
  "Continue the chat" when a saved transcript exists.
- Clicking slides in a **right-hand drawer** (~420px; full-width on mobile),
  with a header (lesson title + kicker), a scrollable transcript, and a
  textarea + send row.
- **SSE streaming**: a "thinking" shimmer until the first token, then the reply
  streams in live; auto-scroll when the user is near the bottom.
- **Enter sends**, Shift+Enter newlines; the textarea auto-grows.
- Assistant turns render **minimal, escape-first markdown** (code spans/blocks
  with a copy button, bold/em, lists). User turns render as escaped plain text.
- Errors render **inline in the transcript / status line**, never as `alert()`.
- `Esc` or ✕ closes; the transcript survives reopen.

## What we change (and why)

The reference's backend shells out to the **local `claude` CLI** with
`--resume` for conversation state — perfect for a single-user local plugin, but
impossible for a deployed multi-user Next.js server. We therefore:

1. **Swap the backend** for a server-side **OpenRouter** call (OpenAI-compatible
   `/chat/completions`, `stream: true`) behind a small provider abstraction. The
   API key lives server-side only.
2. **Make the LLM stateless-aware.** Unlike `--resume`, OpenRouter keeps no
   conversation state, so every turn re-sends the tutor system prompt + the
   lesson text + the stored message history.
3. **Persist transcripts in Postgres** (the locked decision) keyed by
   `(user, lesson)`, so "Continue the chat" works across reloads and devices.
4. **Gate to signed-in users** (locked decision) to attribute usage for per-user
   rate limiting and protect the shared free-tier quota.
5. **Adopt this site's design tokens** instead of the reference's
   Fraunces/JetBrains palette — the drawer reads `--ink`, `--surface`, `--line`,
   etc., and inherits `.dark` automatically.

## Constraints discovered

**Repo (`site/`):**
- Next.js 16.2.9 (App Router, RSC), React 19.2.4, pnpm, Drizzle + Postgres
  (PGlite fallback when no `DATABASE_URL`), Auth.js v5. No LLM SDK present.
- The lesson route is `src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx`
  (`force-dynamic`). It already resolves `session`, `userId`, unlock state,
  `lesson.path`, and `lesson.title` — so the chat mounts there with everything
  it needs and only when the lesson is **unlocked and the user is signed in**.
- `getLesson()` returns rendered `html`, **not** raw markdown. The chat needs the
  lesson's source text, so we add a `getLessonContext(lessonPath)` helper that
  reads the file, strips frontmatter via `gray-matter`, and returns
  `{ title, body }` capped to a token budget. The page-render path is untouched.
- The canonical lesson identifier across both render surfaces is the
  repo-relative **`lesson.path`** (e.g. `modules/01-mental-models/01-how-the-web-works.md`),
  already used as the `lessonProgress` key. The chat reuses it and validates
  every request path against `getAllLessonRefs()` (same allowlist pattern as
  `toggleLessonComplete`).
- `getDb()` is a `globalThis`-keyed singleton (RSC graph and route-handler graph
  are separate bundles — never cache the handle in a module variable).
- Design tokens: nine CSS variables (`--paper`, `--surface`, `--surface-raised`,
  `--line`, `--line-strong`, `--ink`, `--ink-secondary`, `--ink-faint`,
  `--ink-disabled`); dark mode is a `.dark` class on `<html>` toggled by
  `useTheme()`; fonts are `--font-sans` (Inter), `--font-serif` (Newsreader),
  `--font-mono` (JetBrains Mono).
- Tests: vitest (`pnpm test`) for units, Playwright (`pnpm e2e`) for browser. The
  e2e suite runs against PGlite (no external services) and signs in via the
  `signUp()` helper. We mirror the reference's **mock backend** so e2e and units
  run with no API key and zero token spend.

**OpenRouter free tier (researched 2026-06):**
- Free models (`:free` suffix) are capped at **~20 requests/minute and ~50
  requests/day** on a single key, rising to ~1,000/day only after a one-time $10
  credit purchase. **This is the binding constraint.** A shared server key on the
  pure free tier is demo-grade. The design therefore (a) rate-limits per user and
  (b) degrades gracefully on `429`, surfacing a friendly "the chat is busy / daily
  limit reached — try again later" message inline.
- OpenAI-compatible: `POST https://openrouter.ai/api/v1/chat/completions`,
  `Authorization: Bearer $OPENROUTER_API_KEY`, body `{ model, messages, stream }`,
  recommended `HTTP-Referer` + `X-Title` headers. Streaming is SSE with
  `data: {choices:[{delta:{content}}]}` lines and a `[DONE]` sentinel.

## Locked decisions

| Decision | Choice | Consequence |
|---|---|---|
| History persistence | **Postgres** | New `lesson_chat_message` table + Drizzle migration; transcript restores on reopen. |
| Access | **Signed-in only** | Chat mounts only when `userId` present; route returns 401 otherwise; per-user rate limiting. |
| Default model | **`deepseek/deepseek-chat-v3-0324:free`** | Env-overridable via `OPENROUTER_MODEL`. |
| Backend abstraction | **`mock` + `openrouter`** | `CHAT_BACKEND=mock` (default when no key) for dev/test; `openrouter` when `OPENROUTER_API_KEY` is set. |

## Architecture

```
┌─────────────────────────────────────┐   POST /api/lesson-chat (SSE)   ┌──────────────────────────┐
│ Lesson page (RSC, signed-in+unlocked)│ ──────────────────────────────▶ │ route handler (server)   │
│   └─ <LessonChat> (client)           │ ◀────────────────────────────── │  auth · validate · limit │
│        FAB + drawer, SSE reader      │       delta… delta… done        │  persist · stream        │
└─────────────────────────────────────┘                                  └────────┬─────────────────┘
                                                                                   │ provider.stream(messages)
                                                                                   ▼
                                                              ┌─ mock (deterministic, dev/test)
                                                              └─ openrouter (fetch → OpenAI-compatible SSE)
```

### Components / files

**New — server library (`src/lib/chat/`)**
- `provider.ts` — `ChatProvider` interface (`stream(messages, opts): AsyncIterable<string>`)
  + `getChatProvider()` factory selecting mock vs openrouter from env.
- `openrouter.ts` — `fetch`-based streaming against the OpenAI-compatible
  endpoint; parses `data:` SSE lines, yields content deltas; maps non-200 (esp.
  429/402) to a typed `ChatError`. No new npm dependency (hand-rolled SSE parse).
- `mock.ts` — deterministic streaming responder (lesson-title-aware canned reply,
  emitted token-by-token) so tests are fast and key-free.
- `prompt.ts` — `buildTutorMessages({ lessonTitle, lessonBody, history, userMessage })`:
  assembles `[{role:'system', tutor+lesson}, ...history, {role:'user', message}]`,
  capping lesson body and trimming history to a token budget.
- `rate-limit.ts` — per-user in-memory sliding-window limiter (`N`/min, `M`/day)
  as the first guard; OpenRouter's own 429 is the backstop. Documented as
  single-instance; a DB-backed limiter is a noted future extension.
- `messages.ts` — persistence helpers over the new table: `loadConversation`,
  `appendMessage`, `clearConversation`.

**New — API route**
- `src/app/api/lesson-chat/route.ts` — `GET` (restore transcript) +
  `POST` (run one streamed turn) + `DELETE` (clear / "New chat"). Auth-gated,
  path-validated, rate-limited; `POST` returns a `ReadableStream` SSE response.

**New — UI (`src/components/lesson-chat/`)**
- `lesson-chat.tsx` (client) — the FAB + drawer shell, state, SSE reader, send
  loop, restore-on-open, "New chat", expand toggle (localStorage). Mounted in
  `page.tsx` for signed-in + unlocked lessons.
- `markdown.ts` — escape-first minimal-markdown renderer for assistant turns
  (no `dangerouslySetInnerHTML` of model output without escaping first).
- styles via a co-located CSS module or `src/styles/` block using the site tokens.

**Changed**
- `src/lib/content/index.ts` — add `getLessonContext(lessonPath)`.
- `src/db/schema.ts` — add `lessonChatMessage`.
- `drizzle/` — generated migration.
- `src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx` — mount `<LessonChat>`.
- `.env.example`, `site/README.md` — document `OPENROUTER_API_KEY`,
  `OPENROUTER_MODEL`, `CHAT_BACKEND`.

## Data model

One table; one implicit conversation per `(user, lesson)` (v1 keeps a single
active thread — "New chat" clears it. Multi-conversation history, as in the
reference's v2, is a documented future extension, not v1 scope).

```ts
export const lessonChatMessage = pgTable(
  "lesson_chat_message",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonPath: text("lesson_path").notNull(),         // canonical repo-relative path
    role: text("role").notNull(),                      // 'user' | 'assistant'
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("lesson_chat_user_lesson_idx").on(t.userId, t.lessonPath, t.createdAt)],
);
```

Restore = select where `(userId, lessonPath)` ordered by `createdAt`. "New chat"
= delete those rows. A dead JWT hitting the `user_id` FK is treated as
unauthenticated (same try/catch pattern as `toggleLessonComplete`).

## API contract — `/api/lesson-chat`

All methods: `await auth()`; no `userId` → `401`. `lesson` must be in
`getAllLessonRefs()` → else `404 {error:"unknown-lesson"}`.

- **GET `?lesson=<path>`** → `200 { messages: [{role, content, createdAt}] }`
  (this user's transcript for the lesson; `[]` if none).
- **POST** `{ lesson, message }` (JSON):
  - Validates non-empty `message` (≤ a sane max length) → else `400`.
  - Per-user rate-limit → over limit → `429 {error:"rate-limited"}`.
  - Persists the user message; assembles messages via `prompt.ts`; calls
    `provider.stream(...)`.
  - Responds **SSE**: `event: delta\ndata: {"text":"…"}` per token, then
    `event: done\ndata: {}`. On provider failure mid-stream:
    `event: error\ndata: {"message":"…"}` (the user message stays persisted so
    retry is one click); the assistant message is persisted only if any text
    arrived.
- **DELETE** `{ lesson }` → clears the conversation → `200 {ok:true}`.

Headers on SSE: `Content-Type: text/event-stream`, `Cache-Control: no-cache`,
`Connection: keep-alive`.

## Lesson context & tutor prompt (pedagogy)

The system prompt must respect the course's voice so the tutor never undermines
the lessons:

- **Ground every answer in this lesson first**; consult only what's provided.
- **Never invent lesson content** that isn't there; if unknown, say so and point
  back to the lesson or a later module.
- **Match the audience floor** — explain in plain language, define any technical
  term on first use, avoid jargon the lesson itself defers (the course teaches a
  non-coder). No "tutorial fiction" ("just a few clicks", "simply").
- **Be concise and warm**; use markdown sparingly (short lists, code spans).
- **Never echo secrets** (API keys, tokens) from any source.

Format: `<TUTOR_PROMPT>\n\nLESSON: <title>\n---\n<lessonBody (capped ~12k chars)>\n---`.
History is trimmed to a turn/token budget so old turns don't crowd out the lesson.

## Security & abuse

- Server-only API key; never shipped to the client.
- Auth gate + path allowlist (no arbitrary content injection / path traversal).
- Per-user rate limit; graceful `429` passthrough from OpenRouter.
- Assistant + user text rendered escape-first in the DOM (XSS-safe), matching the
  reference's escape-first rule.
- Request body size + message length caps.

## UI / UX detail (mapped to this site)

- **FAB**: fixed bottom-right pill, `border border-ink`, `rounded-full`,
  `bg-paper text-ink`, hover inverts to `bg-ink text-paper`; font-mono uppercase
  micro-label. Hidden on print and below the lesson when locked/signed-out.
- **Drawer**: fixed right, `w-[420px]` (`w-full` ≤640px), `h-screen`,
  `border-l border-ink`, `bg-paper`, slide via `translate-x` + 280ms easing;
  `visibility` toggled so it's not focusable when closed.
- **Header**: kicker (font-mono, `text-ink-faint`) "Lesson chat", title
  (`text-ink`, truncate), action buttons (New chat, expand, close ✕).
- **Transcript**: `role="log" aria-live="polite"`. User turn = font-mono,
  `text-ink-secondary` label "You". Assistant turn = font-serif body, "Tutor"
  label, minimal-markdown. Code blocks: `bg-surface border-line rounded`, copy
  button.
- **Thinking state**: three pulsing dots in a status line.
- **Input row**: borderless auto-grow `<textarea>` (`bg-transparent`),
  placeholder "Ask about this lesson…", send button (font-mono uppercase,
  disabled when empty/busy).
- **States**: empty (no messages), loading/streaming, error (inline red via
  `text-ink` + an error treatment that survives dark mode — using a subtle
  border/label rather than hue, consistent with the monochrome system), rate-limited.
- **Reduced motion**: respects the global `prefers-reduced-motion` rule already
  in `globals.css`.

## Error handling

| Case | Behavior |
|---|---|
| Not signed in | FAB not rendered; API `401`. |
| Unknown lesson path | API `404`. |
| Empty / oversized message | API `400`; input guards client-side too. |
| Per-user rate limit | API `429`; drawer shows "You're sending messages quickly — give it a moment." |
| OpenRouter 429 / 402 (quota) | `error` SSE event; drawer shows "The free chat is at its limit right now — try again later." User message retained. |
| Provider/network failure | `error` SSE event with a generic message; retry is one click. |
| Resolved backend is `openrouter` but no `OPENROUTER_API_KEY` | The route returns a clear "chat is not configured" error (visible, not silent). With no key and no explicit `CHAT_BACKEND`, resolution falls back to `mock`, so local dev still works key-free. |

## Configuration (env)

| Var | Purpose | Default |
|---|---|---|
| `OPENROUTER_API_KEY` | Server-side OpenRouter key | unset (chat disabled / mock) |
| `OPENROUTER_MODEL` | Model id | `deepseek/deepseek-chat-v3-0324:free` |
| `CHAT_BACKEND` | `openrouter` \| `mock` | `openrouter` if key set, else `mock` |
| `OPENROUTER_BASE_URL` | Endpoint override | `https://openrouter.ai/api/v1` |
| `CHAT_RATE_PER_MIN` / `CHAT_RATE_PER_DAY` | Per-user limits | `10` / `40` |

## Testing strategy

- **Unit (vitest):** prompt assembly + capping/trimming; mock provider streaming;
  OpenRouter SSE parsing against synthetic chunk fixtures (incl. `[DONE]`, split
  chunks, error status); rate limiter window behavior; `getLessonContext`
  (frontmatter strip + cap); persistence helpers (append/load/clear) on PGlite;
  path validation.
- **E2E (Playwright, `CHAT_BACKEND=mock`):** sign in via `signUp()`; open a lesson;
  FAB visible; open drawer; send → streamed mock reply appears; reload → transcript
  restored ("Continue the chat"); New chat clears; signed-out viewer sees no FAB.
- **No live tokens in CI.** A manual live smoke (real key, one turn) is a
  developer step, documented in the README.

## Out of scope (YAGNI for v1)

- Multi-conversation history browser / switch / per-lesson archive (reference v2).
  The schema is simple on purpose; this is an additive future change.
- Rich markdown (tables, images) in assistant turns beyond code/lists/emphasis.
- Cross-instance distributed rate limiting (in-memory is fine for current scale).
- Voice, attachments, retrieval over other lessons.

## File-by-file change list

```
NEW  site/src/lib/chat/provider.ts
NEW  site/src/lib/chat/openrouter.ts
NEW  site/src/lib/chat/mock.ts
NEW  site/src/lib/chat/prompt.ts
NEW  site/src/lib/chat/rate-limit.ts
NEW  site/src/lib/chat/messages.ts
NEW  site/src/app/api/lesson-chat/route.ts
NEW  site/src/components/lesson-chat/lesson-chat.tsx
NEW  site/src/components/lesson-chat/markdown.ts
NEW  site/src/components/lesson-chat/lesson-chat.module.css   (or styles/ block)
EDIT site/src/lib/content/index.ts        (getLessonContext)
EDIT site/src/db/schema.ts                (lessonChatMessage)
NEW  site/drizzle/0002_*.sql              (generated migration)
EDIT site/src/app/modules/[moduleSlug]/[lessonSlug]/page.tsx  (mount)
EDIT site/.env.example, site/README.md    (env docs)
NEW  site/tests/chat-*.test.ts            (unit)
NEW  site/e2e/lesson-chat.spec.ts         (e2e)
```
