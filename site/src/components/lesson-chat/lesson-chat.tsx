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
  const fabRef = useRef<HTMLButtonElement>(null);
  const openedRef = useRef(false);

  // Focus management: send focus back to the launch pill when the drawer closes
  // (keyboard users would otherwise be dropped onto <body>).
  useEffect(() => {
    if (open) {
      openedRef.current = true;
    } else if (openedRef.current) {
      fabRef.current?.focus();
    }
  }, [open]);

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
            // Assistant HTML is safe: renderAssistantMarkdown is escape-first —
            // every character is HTML-escaped before any markdown transform, so
            // model output can only ever become a fixed allow-list of inert tags
            // (<p> <strong> <em> <code> <pre> <ul> <li>). See markdown.ts +
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
