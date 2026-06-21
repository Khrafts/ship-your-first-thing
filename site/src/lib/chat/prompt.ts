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
