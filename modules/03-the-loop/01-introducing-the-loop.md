---
title: "Introducing the loop"
module: "03-the-loop"
lesson_number: 01
est_minutes: 50
prereqs: ["06-ai-coding-agents"]
updated: "2026-05-14"
deviations: []
---

# Introducing the loop

## Learning objective

By the end of this lesson, you will be able to name the four steps of the AI-coding loop (intent → ask → evaluate → steer) and run one complete iteration of them on the scratch starter, using the agent you picked in Module 0.

## Why this matters

Module 2 named the tools. This lesson names the moves. The loop is the durable shape of every AI-coding session — every fix, every new feature, every recovery. The keystrokes change as agents evolve; the loop does not. Once you can name the four steps, you can spot which step is going wrong in any session you run.

> **Following along:** Run this loop on the agent you picked in Module 0. Both transcripts are shown for reference, but you only need to run your own.

> **Last captured:** 2026-05-14. If transcripts look different in your session, check `WHAT-CHANGED.md`.

## Core read

AI coding agents look magical until you have used one for an hour, at which point you realize they are predictable: every session moves through four steps.

**intent** (a one-line definition: knowing what you are trying to build before you start asking, [→ GLOSSARY](../../GLOSSARY.md#intent)). **ask** (a one-line definition: writing a specific request the agent can act on, [→ GLOSSARY](../../GLOSSARY.md#ask)). **evaluate** (a one-line definition: reading the agent's output and deciding if it matches your intent, [→ GLOSSARY](../../GLOSSARY.md#evaluate)). **steer** (a one-line definition: course-correcting when the agent's output is off, [→ GLOSSARY](../../GLOSSARY.md#steer)). Together, the four-step shape is called the **agent loop** (a one-line definition: the iterative cycle of intent → ask → evaluate → steer, repeated until your task is done, [→ GLOSSARY](../../GLOSSARY.md#agent-loop)). Module 1's mental models taught you the SHAPE of software; this module teaches you the SHAPE of working with an AI agent to build software.

Here is what a steer sounds like in practice — if the date appeared above the tagline instead of below, you would say: "The date appeared above the tagline — it should be below." The steer step is a short, concrete sentence that names what you saw and names what should be different. You will run this lesson's example without needing to steer; the sample shows the shape.

The text you type to the agent at each ask is called a **prompt** (a one-line definition: the specific text you send to an AI agent describing what you want, [→ GLOSSARY](../../GLOSSARY.md#prompt)). A specific prompt produces specific output; a vague prompt produces vague output. The loop is the discipline of getting from vague to specific without rewriting from scratch every time.

The rest of this lesson walks one complete iteration on `modules/03-the-loop/scratch/index.html` — the starter file that ships with this course. You will see one full pass through the four steps with both agents shown side by side, then run it yourself on the one you picked.

### 1. intent

Before you type anything: what do you actually want?

Open `modules/03-the-loop/scratch/index.html` in your IDE. It is a small page with two placeholders — a name and a tagline — and an empty `<script>` block. The page renders almost nothing if you open the preview right now; that is on purpose, because every Module 3 lesson is one iteration of the loop adding one visible piece.

Your intent for this lesson: **add today's date below the tagline.**

Notice the shape of that sentence. It names a concrete change (add today's date) in a concrete location (below the tagline). It is not "make the page nicer." It is not "add some dynamic content." The work of the intent step is BEING SPECIFIC about what done looks like, in your head, before you open your mouth.

A clear intent is the cheapest part of the loop. Spend two minutes here and you save twenty minutes of steering later.

### 2. ask

Now you type.

Open a terminal panel in your Codespace (`` Ctrl+` `` if it is not already visible). Start your agent — `claude` if you picked Path 1 or Path 3 in Module 0, `gemini` if you picked Path 2. The smallest ask:

> Add today's date below the tagline in `modules/03-the-loop/scratch/index.html`.

That is your prompt. Notice it does not say "use JavaScript." It does not say "use `toLocaleDateString`." It does not say "put it in a `<p>` tag." The ask names the OUTCOME you want; the HOW is the agent's job.

The agent's first response is where the two agents diverge in interesting ways. Here is what each one did on the day this lesson was captured.

> **Capture slot — Claude Code first response.** Replace the bracketed lines below with the verbatim transcript from your Claude Code session (see `screenshots/m3/01-introducing-the-loop/CAPTURE.md`).

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the capture session.
Show the agent's planning surface — what it proposes BEFORE editing — plus either its
diff/file-panel output OR its narration of the edit, depending on which is more
instructive. Keep it short: the smallest excerpt that lets the divergence annotation
below land. The standalone "Claude Code:" line above is required by voice-lint
check #8 (D-27 dual-agent rendering) — do not remove it.]
```

> **Capture slot — Gemini CLI first response.** Replace the bracketed lines below with the verbatim transcript from your Gemini CLI session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the capture session.
Show the same kind of moment captured above for Claude Code — the planning surface
and the edit (or its narration). The standalone "Gemini CLI:" line above is required
by voice-lint check #8 — do not remove it.]
```

> **Annotation slot — divergence.** Replace this blockquote with one or two sentences naming the meaningful difference between the two transcripts above. Examples (pick the one that matches your captures, or write your own): "Claude Code asked for confirmation before editing; Gemini CLI proceeded directly to the change. Same intent, different shape, same loop." OR "Claude Code used `toLocaleDateString()`; Gemini CLI built the string by hand with `getMonth()` + `getDate()` + `getFullYear()`. Two different routes to the same outcome." Your transcript will look like the one for the agent you picked in Module 0.

Both agents will produce something specific. Neither is wrong. The divergence is the lesson: the loop is the same on both surfaces, but the keystrokes and the framing are not. That is why this course teaches every M3 lesson on both agents — the loop is durable; the keystrokes are not.

### 3. evaluate

Now you look at what the agent produced. Two questions, in order:

1. **Did the file actually change?** Open `modules/03-the-loop/scratch/index.html`. Look at the `<script>` block. Is there real JavaScript there now, or did the agent only describe what it would do without doing it? Most modern agents will make the edit; some will pause for confirmation first. Either is fine — what matters is that you READ what changed.
2. **Does the page show what you wanted?** Open the file in VS Code's Live Preview (right-click → Show Preview). Today's date should appear below the tagline. If it does, the loop closed in one iteration. If it does not, you steer.

> **Capture slot — evaluate moment.** Replace the next sentence with what you actually observed during the capture session. Example: "In both sessions, the agent produced a small JavaScript snippet that inserts today's date after the tagline; the browser preview shows today's date below the tagline as expected." If a screenshot of the browser preview is in `screenshots/m3/01-introducing-the-loop/`, embed it here with descriptive alt text.

Evaluate is the cheapest place to catch wrong output. The agent is going to be confidently wrong sometimes — that is unavoidable. The skill is noticing it before you commit, deploy, or build on top of it. Module 3 Lesson 3 teaches the evaluate step in depth; for now, the discipline is simply: stop, look, decide.

### 4. steer

When evaluate says no, you steer.

The steer step is one more ask — but informed by what just went wrong. "The date is showing yesterday's date — please use the local timezone." "The date appeared above the tagline — it should be below." "You added the date but also rewrote my `<h1>`; please leave that alone." Steering is just intent → ask again, with the agent's previous output as new context.

> **Capture slot — steer moment.** Pick the description that matches what your capture session actually showed:
>
> - **If neither agent needed steering:** "In this iteration, no steer was needed — both agents produced working output on the first ask. That is the common case for tiny intents like this one. Module 3 Lessons 3 and 4 walk through what steering looks like when the agent gets it wrong."
> - **If one or both agents needed steering:** "In this iteration, [Claude Code | Gemini CLI]'s first output [briefly describe what was wrong]; the steer was [the exact follow-up prompt the lesson author typed]. The agent's second response [resolved it / required another steer]." Keep it to two or three sentences.

That is the loop end-to-end. Four steps, one iteration. Most real tasks chain several iterations: ask → evaluate → small steer → ask again → evaluate → done. The next three M3 lessons unpack each step: Lesson 2 is the ask step in depth (planning vs execution conversations, slash commands, context discipline); Lesson 3 is the evaluate step in depth (reading plans, spotting wrong output); Lesson 4 is the steer step in depth (feeding errors back, when to start over).

The course teaches the loop on two agents because the LOOP is durable; the keystrokes are not. Claude Code today, Gemini CLI today, some other agent next year — the four steps stay the same. Naming them once, on two different surfaces, makes the skill portable.

## Exercise

Run this exact loop on YOUR chosen agent. Plan twenty to twenty-five minutes.

1. **Reset** your `modules/03-the-loop/scratch/index.html` if you have already edited it. In VS Code's source-control panel, right-click the file → Discard changes; or from the terminal, run `git checkout modules/03-the-loop/scratch/index.html`. You want to start from the empty-`<script>` state.
2. **Open the file** in your IDE. Open Live Preview on it (right-click → Show Preview). You should see a blank-ish page with the name and tagline placeholders.
3. **Open your agent.** Type `claude` (Path 1 or Path 3) or `gemini` (Path 2) in the terminal.
4. **Ask the smallest ask:** "Add today's date below the tagline in `modules/03-the-loop/scratch/index.html`." Type that sentence; nothing else.
5. **Evaluate.** Switch to the Live Preview tab. Does the page now show today's date below the tagline? If yes, the loop closed in one iteration.
6. **(If no) Steer.** One follow-up ask describing what went wrong. Keep it short. Watch the agent's second response. Re-evaluate.
7. **Stop.** When the date renders correctly, the iteration is done.

When you finish, write three sentences in a scratch file (any plain-text note will do):

- What shape did your agent's first response take? (Did it plan first, edit directly, ask for confirmation?)
- Did you need to steer? If so, what was the follow-up ask?
- What is one thing you noticed about your agent's behavior that surprised you?

Do not commit the `scratch/index.html` change yet. The file evolves across all four M3 lessons; we will commit at module close.

## Checkpoint

You've got this if you can:

1. Name the four loop steps in order without looking at the lesson.
2. Run one iteration on your chosen agent and decide whether you needed to steer.

## Going deeper

Optional, only if you are curious:

- **Module 3 Lesson 2** covers the ask step in depth — specifically, the difference between planning conversations and execution conversations, and the slash commands you use to keep sessions efficient. `CHEATSHEET.md` already lists the slash commands this course teaches under `## AI prompts` and `## Token discipline`, if you want a preview.
- **Anthropic's prompting guide** at `https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview` covers prompt-writing in general. Most of it is for API users building products with Claude; the parts about being specific apply to agent sessions too.
- **Google's Gemini CLI README** at `https://github.com/google-gemini/gemini-cli` lists the CLI's first-use commands and configuration. Skim it; do not try to absorb the configuration details — Module 3 lands the ones you actually need.

## Loop check

> **Loop check — intent.** Module 3 Lesson 1 names all four loop steps, but the step this lesson reinforces is *intent* — because every other step depends on the intent being clear. You ran one iteration with a sharp intent ("add today's date below the tagline"); the agent's clarity tracked your intent's clarity. The loop step this lesson reinforces is **intent**: knowing what you are trying to build before you start asking.

## What you just did

You met the agent loop end-to-end. You ran one iteration on a real worked example, on the agent you picked in Module 0. The next three lessons unpack the loop step by step on the same scratch starter — Lesson 2 (ask), Lesson 3 (evaluate), Lesson 4 (steer). By the end of Module 3, you will have run four iterations on the same file and seen what each step looks like in depth.

## Navigation

[← Previous: AI coding agents](../02-toolchain/06-ai-coding-agents.md)
[Next: Planning vs execution conversations →](./02-planning-vs-execution.md)
