---
title: "Planning vs execution conversations"
module: "03-the-loop"
lesson_number: 02
est_minutes: 55
prereqs: ["01-introducing-the-loop"]
updated: "2026-05-14"
deviations: []
---

# Planning vs execution conversations

## Learning objective

By the end of this lesson, you will be able to distinguish a planning conversation from an execution conversation with an AI coding agent, and use four slash commands (`/clear`, `/compact` or `/compress`, `/context` or `/stats`, and `/cost`) to keep the session's context window in check.

## Why this matters

Lesson 1 walked one full pass through intent → ask → evaluate → steer. This lesson sharpens the ASK step. There are two MODES of asking an AI agent for help: planning ("don't write code yet — tell me what you'd do") and execution ("now do it"). Beginners conflate them and end up with code that does not match their intent. Naming the split — and using slash commands to keep sessions efficient — is the difference between a 30-minute session and a 3-hour one.

> **Following along:** Run this loop on the agent you picked in Module 0. Both transcripts are shown for reference, but you only need to run your own.

> **Last captured:** 2026-05-14. If transcripts look different in your session, check `WHAT-CHANGED.md`.

## Core read

Every conversation you have with an AI coding agent is one of two shapes.

A **planning conversation** (a one-line definition: a session where you ask the agent to describe what it WOULD do without writing code yet, [→ GLOSSARY](../../GLOSSARY.md#planning-conversation)) is cheap and reversible. You ask for a plan; the agent writes a plan; you read it; you ask a follow-up; you refine. Nothing changes on disk. An **execution conversation** (a one-line definition: a session where you ask the agent to actually make the change, [→ GLOSSARY](../../GLOSSARY.md#execution-conversation)) is expensive — in time, in tokens, in mistakes you have to undo. Every edit might be wrong; every wrong edit takes work to reverse.

The discipline is to plan first, then execute. Even for a small task. Naming the plan explicitly — out loud, as a prompt — improves the execution every time, because the agent's plan is the cheapest place to catch a misunderstanding.

The rest of this lesson walks one planning conversation, one execution conversation, and the four slash commands you use to keep both kinds of session efficient. The worked example continues on `modules/03-the-loop/scratch/index.html`: the file already shows today's date (Lesson 1's loop iteration). This lesson adds a button below the date that shows or hides it when clicked.

### Planning: ask for a plan, not a change

A planning ask names the outcome you want AND tells the agent NOT to edit yet. The sentence "don't write code yet" is the load-bearing one — without it, most modern agents will jump straight to the file.

> Plan: I want to add a button below the date that shows or hides the date when clicked. Don't write code yet — describe what you would change in `modules/03-the-loop/scratch/index.html` and the steps you would take.

That sentence has three parts. First, the word "Plan:" at the start — a literal signal to the agent. Second, the concrete outcome (a button below the date that toggles visibility). Third, the closing constraint ("don't write code yet — describe..."). The agent will respond with a plan, not a diff.

Here is how each agent shaped the plan on the day this lesson was captured.

> **Capture slot — Claude Code planning response.** Replace the bracketed lines below with the verbatim Claude Code transcript from your planning session (see `screenshots/m3/02-planning-vs-execution/CAPTURE.md`).

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the planning
conversation. Show the agent's plan output — the list of steps it proposes for
adding the toggle button, BEFORE it touches the file. Keep it short: the smallest
excerpt that lets the divergence annotation below land. The standalone "Claude Code:"
line above is required by voice-lint check #8 (D-27 dual-agent rendering) — do not
remove it.]
```

> **Capture slot — Gemini CLI planning response.** Replace the bracketed lines below with the verbatim Gemini CLI transcript from your planning session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the planning
conversation. Show the same moment captured above for Claude Code — the plan
output before any edit. The standalone "Gemini CLI:" line above is required by
voice-lint check #8 — do not remove it.]
```

> **Annotation slot — planning divergence.** Replace this blockquote with one or two sentences naming the meaningful difference between the two plans. Examples (pick the one that matches your captures, or write your own): "Claude Code's plan listed four numbered steps and named the JavaScript approach (an event listener on the button toggling a CSS `display` property); Gemini CLI's plan was looser but mentioned the same elements. Both plans are workable; the key is that both agents PAUSED instead of jumping to edit." OR "Both agents proposed nearly identical plans — a button element with an `onclick` handler that toggles the date's visibility. The plans are short because the task is small." Your transcript will look like the one for the agent you picked in Module 0.

Both plans will be workable. Neither is wrong. The point of running the planning conversation is not to choose between competing plans — it is to give yourself a chance to read what the agent intends BEFORE it does it. If the plan does something you did not want (e.g., "I will rewrite the `<h1>` to add a button there"), now is the cheapest moment to correct course.

### Execution: tell it to proceed

Once the plan looks right, you tell the agent to do it.

> OK, please proceed with the plan.

That is the whole prompt. You do not need to re-state the task — the agent has the plan in its conversation history. The agent will now edit the file.

> **Capture slot — Claude Code execution response.** Replace the bracketed lines below with the verbatim Claude Code transcript from your execution session.

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the execution
conversation. Show the agent's edit — the diff summary, the file panel state, or
the narration of what it changed — whichever shape is most instructive. Keep it
short: the meaningful divergence is usually a one- or two-line transcript snippet.
The standalone "Claude Code:" line above is required by voice-lint check #8 —
do not remove it.]
```

> **Capture slot — Gemini CLI execution response.** Replace the bracketed lines below with the verbatim Gemini CLI transcript from your execution session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the execution
conversation. Same moment captured above for Claude Code — the edit (diff, file-panel
narration, or short prose) the agent produced. The standalone "Gemini CLI:" line above
is required by voice-lint check #8 — do not remove it.]
```

> **Annotation slot — execution divergence.** Replace this blockquote with one or two sentences naming the meaningful difference between the two edits. Examples: "Claude Code added an `<button>` element with an inline `onclick` handler; Gemini CLI used `addEventListener` attached after the button was created. Both produced working toggles." OR "Both agents produced nearly identical code: a button element, a click handler, and `style.display` toggling. The convergence is the lesson — small specific intents produce small specific edits." Your transcript will look like the one for your chosen agent.

Open the Live Preview tab. Click the button. The date should appear or disappear depending on its current state. If it does, the loop closed on this iteration. If not, steer (the topic of Lesson 4).

### The context window — and four slash commands that manage it

Every AI agent has a **context window** (a one-line definition: the amount of text the agent can see at once — your conversation history plus any file content it has loaded, [→ GLOSSARY](../../GLOSSARY.md#context-window)). The window is finite. As your session grows, older messages stay in scope until the window fills, at which point the agent forgets the middle. Long sessions on a single task become less coherent because the agent has effectively forgotten what it agreed to do an hour ago.

The cure is not "be patient." The cure is the four slash commands every agent ships with.

The **`/clear`** command (a one-line definition: reset the conversation history; start a fresh session inside the same agent invocation, [→ GLOSSARY](../../GLOSSARY.md#slash-clear)) is the heaviest hammer. Use it between unrelated tasks. The keystroke is the same on both Claude Code AND Gemini CLI.

The **`/compact`** command (a one-line definition: Claude Code's command to compress conversation history without losing the gist, [→ GLOSSARY](../../GLOSSARY.md#slash-compact)) summarizes the long stuff and keeps the summary in scope. Gemini CLI's equivalent is **`/compress`** (a one-line definition: Gemini CLI's equivalent of Claude Code's `/compact`, [→ GLOSSARY](../../GLOSSARY.md#slash-compress)) — same purpose, different keystroke.

The **`/context`** command (a one-line definition: Claude Code's command to show how much of the context window is currently in use, [→ GLOSSARY](../../GLOSSARY.md#slash-context)) reports current window usage. Gemini CLI's equivalent is **`/stats`** (a one-line definition: Gemini CLI's equivalent of Claude Code's `/context`; reports conversation statistics including token usage, [→ GLOSSARY](../../GLOSSARY.md#slash-stats)).

The **`/cost`** command (a one-line definition: Claude Code's command to show running session spend in dollars, [→ GLOSSARY](../../GLOSSARY.md#slash-cost)) is most relevant to Path 3 (Anthropic API token-careful) learners. On Gemini CLI's free tier, there is no spend to show; `/stats` covers rate-limit usage instead.

A historical note: you may see `/tokens` referenced in older notes or third-party blog posts. It is the deprecated name for what is now split into `/context` (window usage) and `/cost` (spend). The Plan 02-02 entry in `WHAT-CHANGED.md` documents the migration; the canonical commands in this course are `/context` and `/cost`. If your agent does not recognize `/tokens`, use `/context` instead.

### When to reach for each

`/clear` between unrelated tasks. `/compact` (or `/compress`) when one task is dragging on and you want to keep the gist but free space. `/context` (or `/stats`) when you are curious how much room is left. `/cost` (on Claude Code) when you want to see spend so far.

The `CHEATSHEET.md` has all six commands listed under `## AI prompts` and `## Token discipline` — that file is the keystroke reference; this lesson is the framing. Module 7 covers other commands worth knowing (`/init`, `/model`, `/memory`); for M3 and M4, the four-command kit carries every session.

Here is what `/context` looks like on Claude Code, and what `/stats` looks like on Gemini CLI, on the day this lesson was captured.

> **Capture slot — Claude Code `/context` output.** Replace the bracketed lines below with the verbatim output from typing `/context` in your Claude Code session.

```text
Claude Code:
[Replace this block with the verbatim output of typing `/context` in Claude Code.
The output is usually a short summary of context-window usage (e.g., a percentage,
the number of tokens used and remaining). Keep the standalone "Claude Code:" line
above — voice-lint check #8 requires it.]
```

> **Capture slot — Gemini CLI `/stats` output.** Replace the bracketed lines below with the verbatim output from typing `/stats` in your Gemini CLI session.

```text
Gemini CLI:
[Replace this block with the verbatim output of typing `/stats` in Gemini CLI.
The output usually includes token usage and rate-limit information. Keep the
standalone "Gemini CLI:" line above — voice-lint check #8 requires it.]
```

Both surfaces show roughly the same thing — how much of the agent's working memory is currently occupied by this conversation. When usage drifts above 50% on a single task, consider `/compact` (or `/compress`) before you keep going.

Planning + execution split + four slash commands = the ASK step's full kit. The next lesson is the EVALUATE step: reading the agent's output and recognizing when it is wrong without reading code line by line.

## Exercise

Run a planning conversation, then an execution conversation, then practice three slash commands. Plan twenty to thirty minutes.

1. **Confirm** that `modules/03-the-loop/scratch/index.html` shows today's date below the tagline (the Lesson 1 state). If it does not, run Lesson 1's exercise first.
2. **Open your agent** in your Codespace terminal. Open the scratch file in VS Code's Live Preview (right-click → Show Preview).
3. **Planning ask:** Type — verbatim — `Plan: I want to add a button below the date that shows or hides the date when clicked. Don't write code yet — describe what you would change in modules/03-the-loop/scratch/index.html and the steps you would take.` Read the plan the agent gives you. If anything is unclear, ask one follow-up question.
4. **Execution ask:** Type `OK, please proceed with the plan.` Watch the edit happen. Open the Live Preview tab; click the button. The date should toggle.
5. **`/clear`** — type it. The conversation history wipes. Then type `/context` (or `/stats` on Gemini CLI) and confirm the usage dropped close to zero.
6. **Write three sentences** in a scratch file (any plain-text note):

   - One thing your agent's PLAN noticed that you did not.
   - One thing your agent's execution did that you did not expect.
   - What `/context` (or `/stats`) showed before and after `/clear`.

Do not commit the `scratch/index.html` change yet. Lessons 3 and 4 progress the same file further.

## Checkpoint

You've got this if you can:

1. Explain in one sentence the difference between a planning conversation and an execution conversation.
2. Name the four core slash commands your agent supports.

## Going deeper

Optional, only if you are curious:

- **Claude Code has more commands worth knowing later:** `/init` (scaffold a `CLAUDE.md` for the project), `/memory` (set persistent context across sessions), `/model` (switch between model variants like Sonnet, Opus, Haiku). The full surface is at `https://docs.claude.com/en/docs/agents-and-tools/claude-code/overview`.
- **Gemini CLI has its own extras:** `/tools` (list available tools the agent can call), `/extensions` (manage MCP servers), `/quit` (exit the session cleanly). The full surface is at `https://github.com/google-gemini/gemini-cli`.
- **Module 7** will land the translation table — the per-agent equivalents of every command this course names — when you need it.

## Loop check

> **Loop check — ask.** Module 3 Lesson 2 sharpens the *ask* step of the agent loop. Planning before executing — and managing the context window with `/clear`, `/compact` (or `/compress`), `/context` (or `/stats`), and `/cost` — is what makes an ask clear. The next lesson teaches the *evaluate* step. The loop step this lesson reinforces is **ask**.

## What you just did

You learned to split asks into planning and execution modes. You ran one planning conversation and one execution conversation back to back on the same scratch file. You met four slash commands that turn long, drifting sessions into efficient ones. The scratch starter now has a working show-and-hide button — and you saw two different agents shape the same task two different ways.

## Navigation

[← Previous: Introducing the loop](./01-introducing-the-loop.md)
[Next: Reading plans + recognizing wrong output →](./03-reading-plans-recognizing-wrong.md)
