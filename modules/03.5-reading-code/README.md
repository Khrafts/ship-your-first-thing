# Module 3.5 — Reading code, just enough

Module 3.5 teaches the pattern-recognition floor a non-coder needs to recognize when an AI agent has gone wrong — without writing code from scratch. Four lessons, each strictly observational (per D-33): reading a file tree, spotting when the AI edited the wrong file, reading an error message back to a file pointer, and recognizing when `'use client'` is missing. The floor is detection. Each lesson stops at "you can spot this"; explaining from first principles is out of scope.

Loop checks across the four lessons most often name `evaluate` — detection is the heart of the evaluate step (planner's judgment per RESEARCH.md Pattern 5).

## Reference scaffold

All four M3.5 lessons read from a tiny pre-baked Next.js sample-app at `sample-app/` (per D-34). The scaffold is REFERENCE ONLY — you do not run it, install it, or modify it. The scaffold ships in Plan 02-02; Plan 02-13 onward authors lessons against it.

## Lessons in this module

1. [`01-reading-a-file-tree.md`](./01-reading-a-file-tree.md) — what folders mean at a glance (annotation exercise) *(Plan 02-13)*
2. [`02-spotting-wrong-file-edits.md`](./02-spotting-wrong-file-edits.md) — agent-narration vs file-panel divergence (judgment exercise) *(Plan 02-14)*
3. [`03-error-message-to-file-pointer.md`](./03-error-message-to-file-pointer.md) — find the first line that mentions YOUR file (tracing exercise) *(Plan 02-15)*
4. [`04-use-client-and-server-split.md`](./04-use-client-and-server-split.md) — symptom: an interactive element that doesn't respond (ask-the-agent exercise) *(Plan 02-16)*

## Navigation

[← Module 3 — The loop in depth](../03-the-loop/README.md)
[Next: Module 4 — Designing & building the thread project (lands in Phase 3) →](../../README.md)
