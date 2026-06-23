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

// Starter questions shown in the empty state. Clicking one fills the composer
// (it does not send) so the learner decides when to ask — matching the course's
// learner-agency tenet.
const CHAT_SUGGESTIONS = [
  "What does this term mean?",
  "Why does this step matter?",
  "What should I try next?",
];

export function LessonChat({ lessonPath, lessonTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const openedRef = useRef(false);
  // True once the user has sent a message; gates the mount-restore overwrite so
  // a fast send (before the restore GET resolves) is never clobbered by a stale
  // pre-send snapshot.
  const startedRef = useRef(false);

  // Focus management: focus the input when the drawer opens, and send focus
  // back to the launch pill when it closes (keyboard users would otherwise be
  // dropped onto <body>).
  useEffect(() => {
    if (open) {
      openedRef.current = true;
      inputRef.current?.focus();
    } else if (openedRef.current) {
      fabRef.current?.focus();
    }
  }, [open]);

  // Restore the saved transcript on mount so the launch pill can read
  // "Continue the chat" before the drawer is ever opened (matches the
  // reference). One lightweight GET per signed-in lesson view.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lesson-chat?lesson=${encodeURIComponent(lessonPath)}`);
        // Don't overwrite messages the user has already started sending: a slow
        // restore could otherwise clobber a just-sent turn with a stale snapshot.
        if (!cancelled && !startedRef.current && res.ok) {
          const data = (await res.json()) as { messages: Msg[] };
          setMessages(data.messages ?? []);
        }
      } catch {
        /* leave the transcript empty if the restore request fails */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonPath]);

  // Persisted expand preference. Read after mount (not via a lazy initializer)
  // so the server-rendered default and the first client render agree — the
  // stored value is reconciled once, avoiding a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe read of a client-only store
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
    startedRef.current = true;
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

  const fillFromSuggestion = useCallback((q: string) => {
    setInput(q);
    inputRef.current?.focus();
  }, []);

  const hasChat = messages.length > 0;

  return (
    <>
      {!open && (
        <button
          ref={fabRef}
          type="button"
          className={styles.fab}
          onClick={() => setOpen(true)}
        >
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
            <button
              type="button"
              onClick={newChat}
              className={styles.action}
              title="New chat"
              disabled={streaming}
            >
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
            <div className={styles.empty}>
              <p className={styles.emptyLead}>Ask anything about this lesson.</p>
              <p className={styles.emptySub}>
                what a term means · why a step matters · what to try next
              </p>
              <div className={styles.chips}>
                {CHAT_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.chip}
                    onClick={() => fillFromSuggestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, idx) => (
            // Assistant HTML is safe: renderAssistantMarkdown is escape-first —
            // every character is HTML-escaped before any markdown transform, so
            // model output can only ever become a fixed allow-list of inert tags
            // (<p> <br> <h1>–<h6> <strong> <em> <code> <pre> <ul> <ol> <li>
            // <blockquote> <hr> <a>). Links are the only tag carrying a URL, and
            // its protocol is allow-list checked (http/https/mailto/relative) —
            // unsafe schemes fall back to inert text. See markdown.ts +
            // tests/chat-markdown.test.ts. User text is rendered as plain text.
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
          <div className={styles.composer}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={onInputChange}
              onKeyDown={onInputKey}
              placeholder="Ask about this lesson…"
              rows={1}
              disabled={streaming}
              aria-label="Message"
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
          <p className={styles.hint}>
            <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
          </p>
        </div>
      </aside>
    </>
  );
}
