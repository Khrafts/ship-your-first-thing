# Module 3.5 — Reading code, just enough

Module 3.5 teaches the pattern-recognition floor a non-coder needs to recognize when an AI agent has gone wrong — without writing code from scratch. Four lessons, each strictly observational: reading a file tree, spotting when the AI edited the wrong file, reading an error message back to a file pointer, and recognizing when `'use client'` is missing. The floor is detection. Each lesson stops at "you can spot this"; explaining from first principles is out of scope.

Loop checks across the four lessons most often name `evaluate` — detection is the heart of the evaluate step.

## What this module builds

By the end of this module, you can look at the code surface an AI agent puts in front of you — the file tree, its diff summary, an error message, a file that won't respond — and spot when something is off, without reading or writing a line of code yourself.

Each lesson builds on the last:

- **Lesson 1 — Reading a file tree:** open a Next.js project's file tree, name what each top-level folder is for at a glance, and spot one shape smell (a `pages/` folder and an `app/` folder both present) → sets up Lesson 2 by giving you the project shape that tells you where an edit *should* have landed.
- **Lesson 2 — Spotting wrong-file edits:** read the agent's diff summary against the intent of your ask and judge right-file vs wrong-file in seconds → sets up Lesson 3 by leaving you with the case where the file looked right but the page now shows a red error.
- **Lesson 3 — Error message to file pointer:** scan an error message and find the first line that names one of YOUR files, then paste the whole error back with that pointer named → sets up Lesson 4 by surfacing one error word — `hydration` — that points at a specific fixable symptom.
- **Lesson 4 — `'use client'` and the server/client split:** recognize whether a file needs `'use client'`, name the symptom of a missing one (an interactive element that silently does nothing, or a hydration error), and steer the agent to the fix → sets up the thread project, where you use this observation floor every day.

The thread that ties it together: Module 3.5 is the OBSERVATION floor. In every lesson you observe, recognize, and steer — you spot the smell, name the file, paste the error, point at the symptom. The agent reads the code, decodes the error, and makes the fix. Every code term here (`'use client'`, `hydration`) is a symptom you scan for, never a mechanism you have to understand.

## Reference scaffold

All four M3.5 lessons read from a tiny pre-baked Next.js sample-app at `sample-app/`. The scaffold is REFERENCE ONLY — you do not run it, install it, or modify it. The scaffold ships in your workspace.

## Lessons in this module

1. [`01-reading-a-file-tree.md`](./01-reading-a-file-tree.md) — what folders mean at a glance (annotation exercise)
2. [`02-spotting-wrong-file-edits.md`](./02-spotting-wrong-file-edits.md) — agent-narration vs file-panel divergence (judgment exercise)
3. [`03-error-message-to-file-pointer.md`](./03-error-message-to-file-pointer.md) — find the first line that mentions YOUR file (tracing exercise)
4. [`04-use-client-and-server-split.md`](./04-use-client-and-server-split.md) — symptom: an interactive element that doesn't respond (ask-the-agent exercise)

## Navigation

[← Module 3 — The loop in depth](../03-the-loop/README.md)
[Next: Module 4 — Designing & building the thread project →](../../README.md)
