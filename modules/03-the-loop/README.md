# Module 3 — The loop in depth

Module 3 names the durable AI-coding loop end-to-end: **intent → ask → evaluate → steer**. Four lessons unpack the loop, one per step. Every M3 lesson runs the same worked example on a single self-contained `scratch/index.html`, shown in parallel on both Claude Code AND Gemini CLI so the loop is taught as durable across agents. You run only the agent you picked in Module 0; the other agent's transcript is shown as reference.

Loop checks across the four lessons name `intent`, `ask`, `evaluate`, `steer` — one per lesson, in order.

## What this module builds

By the end of this module, you can run the durable AI-coding loop — intent → ask → evaluate → steer — on any agent: knowing what you want, asking for it well, judging whether the output matches, and course-correcting when it doesn't.

Each lesson builds on the last:

- **Lesson 1 — Introducing the loop:** name the four loop steps in order and run one complete iteration on the scratch starter → sets up Lesson 2 by leaving the `ask` step as the one to sharpen first.
- **Lesson 2 — Planning vs execution:** tell a "plan it, don't build it yet" ask apart from a "now do it" ask, and use four slash commands to keep a session's working memory in check → sets up Lesson 3 by giving you a plan to compare the agent's actual output against.
- **Lesson 3 — Reading plans, recognizing wrong:** run five observation patterns to spot wrong output — including a hallucinated answer — without reading the code → sets up Lesson 4 by leaving you holding a wrong result you now need to fix.
- **Lesson 4 — Steering and recovery:** write a three-part steer that course-corrects the agent, catch it over-engineering an open-ended ask, and know when `/clear` and a fresh start beats another steer → sets up Module 3.5, where you add the code-reading floor on top of this observation-only loop.

The thread that ties it together: Module 3 is about the durable loop — intent → ask → evaluate → steer. The keystrokes change as agents evolve; the four steps do not. Name them once, on two different agents, and the skill carries to whatever agent comes next.

## Lessons in this module

1. [`01-introducing-the-loop.md`](./01-introducing-the-loop.md) — intent → ask → evaluate → steer end-to-end
2. [`02-planning-vs-execution.md`](./02-planning-vs-execution.md) — when each conversation mode is right; `/clear`, `/compact`, `/context`, `/cost`, `/compress`, `/stats`; context-window discipline
3. [`03-reading-plans-recognizing-wrong.md`](./03-reading-plans-recognizing-wrong.md) — the `evaluate` step in depth; observation-based detection
4. [`04-steering-and-recovery.md`](./04-steering-and-recovery.md) — the `steer` step in depth; feeding errors back; when to start over

## Worked example

All four M3 lessons progress a single self-contained `scratch/index.html` across iterations. The starter ships with the course; M3 L4 ends with: "you can delete the scratch directory now — your real project starts in Module 4."

## Navigation

[← Module 2 — The developer toolchain](../02-toolchain/README.md)
[Next: Module 3.5 — Reading code, just enough →](../03.5-reading-code/README.md)
