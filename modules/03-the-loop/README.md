# Module 3 — The loop in depth

Module 3 names the durable AI-coding loop end-to-end: **intent → ask → evaluate → steer**. Four lessons, one step each.

Every lesson runs the same worked example on one practice page — a page your agent creates for you in Lesson 1 and you watch change in your browser after every iteration. Each exchange is shown twice, in parallel: once as it looks in Claude Code desktop, once as it looks in the ChatGPT desktop app with Codex. You run only the app you picked in Module 0. The second panel is there so you can see the same loop landing on a different surface — the loop, not the panel, is the point of the module.

Loop checks across the four lessons name `intent`, `ask`, `evaluate`, `steer` — one per lesson, in order.

## What this module builds

By the end of this module, you can run the durable AI-coding loop — intent → ask → evaluate → steer — with any agent: knowing what you want, asking for it well, judging whether what came back matches, and course-correcting when it doesn't.

Each lesson builds on the last:

- **Lesson 1 — Introducing the loop:** name the four loop steps in order, have your agent build the practice page from one sentence, and run one complete iteration on it → sets up Lesson 2 by leaving the `ask` step as the one to sharpen first.
- **Lesson 2 — Planning vs execution conversations:** tell a "plan it, don't build it yet" ask apart from a "now go ahead" ask, and know when and how to start a fresh conversation when a long session starts sliding → sets up Lesson 3 by giving you a plan to compare the agent's actual output against.
- **Lesson 3 — Reading plans + recognizing wrong output:** run five observation patterns that flag wrong output — including an answer the agent confidently invented — without ever reading code → sets up Lesson 4 by leaving you holding a wrong result you now need to fix.
- **Lesson 4 — Steering and recovery:** write a three-part steer that course-corrects the agent, catch it doing far more than you asked and pull it back to scope, go back to a saved version once on purpose and check what it gave back, and know when a fresh conversation beats another steer → sets up Module 4, where you put the loop to work building the thread project.

The thread that ties it together: the four steps are durable and the app around them is not. The window changes, the buttons change, the agent's name changes. Knowing what you want, asking for it, checking what came back, and saying what should be different — those four moves carry to whatever you end up working with next.

## Lessons in this module

1. [`01-introducing-the-loop.md`](./01-introducing-the-loop.md) — intent → ask → evaluate → steer, end to end, on a page your agent builds for you
2. [`02-planning-vs-execution.md`](./02-planning-vs-execution.md) — planning asks vs execution asks, and the fresh-conversation move when a session gets muddy
3. [`03-reading-plans-recognizing-wrong.md`](./03-reading-plans-recognizing-wrong.md) — the `evaluate` step in depth; five observation patterns, no code reading
4. [`04-steering-and-recovery.md`](./04-steering-and-recovery.md) — the `steer` step in depth; the three-part steer, over-scoped answers, the way back to a saved version, and when to start over

## Worked example

All four lessons move the same practice page forward, one iteration at a time. There is nothing to download and nothing waiting for you in a folder somewhere: in Lesson 1 you ask your agent to make the page — a folder called `loop-practice` with one page in it called `index.html`, showing your name and a one-line tagline — and to open it in your browser.

From there the state chain runs across the module. Lesson 1 adds today's date below the tagline. Lesson 2 adds a button that shows and hides the date. Lesson 3 asks for a list of three favorite books and gets back three the agent made up. Lesson 4 steers that list back to placeholder text and saves it, lets a loose ask put a wooden background on it, goes back to that save on purpose and checks the placeholder came back, then gives the list its look from a fresh conversation and saves the page finished.

The page is throwaway on purpose. It exists to give the loop something small and visible to practice on, where a wrong answer costs you nothing. Lesson 4 says so at the end: your real project starts in Module 4, and by then you can ask your agent to delete the practice folder or keep it as a souvenir.

## Navigation

[← Module 2 — Your agent and the machinery it drives](../02-toolchain/README.md)
[Next: Module 4 — Designing & building the thread project →](../04-thread-project/README.md)
