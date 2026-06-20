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
      let persisted = false;
      try {
        for await (const delta of provider.stream(messages)) {
          acc += delta;
          frame("delta", { text: delta });
        }
        if (acc) {
          await appendMessage(userId, lesson, "assistant", acc);
          persisted = true;
        }
        frame("done", {});
      } catch (err) {
        // Persist the partial reply once. Guarded so a success on the happy
        // path is never re-inserted, and a failure here can't escape start().
        if (acc && !persisted) {
          try {
            await appendMessage(userId, lesson, "assistant", acc);
          } catch {
            /* best-effort: the user turn is saved, so a retry re-asks cleanly */
          }
        }
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
