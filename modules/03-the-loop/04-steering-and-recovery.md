---
title: "Steering and recovery"
module: "03-the-loop"
lesson_number: 04
est_minutes: 55
prereqs: ["03-reading-plans-recognizing-wrong"]
updated: "2026-05-14"
deviations: []
---

# Steering and recovery

## Learning objective

By the end of this lesson, you will be able to write a steer ask that course-corrects an AI agent's output, recognize when an agent is over-engineering and steer it back to scope, and know when `/clear` and a fresh start is faster than another steer.

## Why this matters

Lessons 1, 2, and 3 named the loop and sharpened ask + evaluate. This last Module 3 lesson closes the cycle. When you have evaluated and the answer is no, the loop's STEER step is what you do next. The skill is rarely dramatic — most steers are one or two short follow-up asks. But recognizing the OTHER failure mode (the agent is over-engineering; or it has lost the plot; or it has dug a hole) is what keeps a session from spiraling into hours of wasted work.

> **Following along:** Run this loop on the agent you picked in Module 0. Both transcripts are shown for reference, but you only need to run your own.

> **Last captured:** 2026-05-14. If transcripts look different in your session, check `WHAT-CHANGED.md`.

## Core read

In Lesson 3 you ran an under-specified ask and the agent hallucinated three book titles. The natural next move is to STEER — to course-correct by writing one more ask that uses what just happened as context. The steer step is rarely a big production. Most of the time it is: "That is not quite right. Here is what I actually wanted: [more specific intent]." Two-thirds of the AI-coding sessions you will run land in one or two steers. The hour-long sessions usually have one moment where steering failed and a clean `/clear`-and-restart would have saved time.

### Steer #1 — fixing the hallucination

Start by steering the L3 hallucination. The agent invented three books; you want a placeholder instead. The ask:

> These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."

Here is what each agent produced on the day this lesson was captured.

> **Capture slot — Claude Code Phase A steer response.** Replace the bracketed lines below with the verbatim Claude Code transcript from your Phase A steer session (see `screenshots/m3/04-steering-and-recovery/CAPTURE.md`).

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the Phase A steer
session. Show the agent's response to the steer ask — typically a short
acknowledgement followed by the edit replacing the three invented titles with the
placeholder text. Keep the standalone "Claude Code:" line above; voice-lint check #8
requires it.]
```

> **Capture slot — Gemini CLI Phase A steer response.** Replace the bracketed lines below with the verbatim Gemini CLI transcript from your Phase A steer session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the Phase A steer
session. Show the same kind of moment captured above for Claude Code — the steer
acknowledgement plus the placeholder-text edit. Keep the standalone "Gemini CLI:"
line above; voice-lint check #8 requires it.]
```

> **Annotation slot — Phase A divergence.** Replace this blockquote with one or two sentences naming the meaningful difference between the two responses. Examples (pick the one that matches your captures, or write your own): "Both agents accepted the steer cleanly and replaced the list with placeholder text in a single edit. One-shot steers like this are the norm — the steer just names the gap and the agent fills it." OR "Claude Code rewrote the entire `<ul>` block with an `<em>` wrapper around the placeholder; Gemini CLI kept the list shape and replaced only the `<li>` contents. Both honored the ask; the shape of the edit differed." Your transcript will look like the one for your chosen agent.

That is the canonical steer pattern: name what was wrong (the agent invented data), state what you wanted instead (placeholder text), and let the agent run the edit. One-shot steers are the most common steer in any session.

### Anatomy of a steer ask

A useful steer ask has three parts:

1. **What was wrong** (one sentence). "The book list is wrong." "The button does not toggle." "The page is blank."
2. **What you actually want** (one sentence). "Replace the books with placeholder text." "Make the click handler hide the date." "Show today's date below the tagline."
3. **Any constraint the agent missed** (one sentence, optional). "No frameworks." "Inline CSS only." "Keep the existing button working."

Anti-pattern: "fix it" — too vague, the agent will guess at what "it" was. Anti-pattern: "use Tailwind CSS, then add Material UI icons, also a 3D bookshelf rendering" — over-specified back at the agent, which often makes the over-engineering worse. The sweet spot is one or two specific sentences. Short steers usually land in one iteration; long steers usually need their own steer.

### Steer #2 — the open-ended ask and over-engineering

Now ask the most open-ended ask you can. The Module 3 Lesson 4 worked-example ask is:

> Make the list look like a real bookshelf.

Open-ended asks are a magnet for **over-engineering** (a one-line definition: when an AI agent does MORE than asked — adding frameworks, libraries, image lookups, fancy effects — because the ask did not bound the scope, [→ GLOSSARY](../../GLOSSARY.md#over-engineering)). Agents tend to read "look like a real bookshelf" as "rebuild this with a UI framework." Watch what each agent did with that ask.

> **Capture slot — Claude Code Phase B over-engineering response.** Replace the bracketed lines below with the verbatim Claude Code transcript from your Phase B session.

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the Phase B
open-ended ask. Show the full over-engineering response — typical shapes include
suggesting a CSS framework like Tailwind, suggesting image lookups for book covers,
suggesting fancy 3D shelf effects, or proposing a multi-file refactor. The whole
response is the teaching surface; keep enough of it to show the over-shoot. Keep
the standalone "Claude Code:" line above; voice-lint check #8 requires it.]
```

> **Capture slot — Gemini CLI Phase B over-engineering response.** Replace the bracketed lines below with the verbatim Gemini CLI transcript from your Phase B session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the Phase B
open-ended ask. Show the same kind of moment captured above for Claude Code — the
over-engineering response in full enough detail to make the over-shoot visible.
Keep the standalone "Gemini CLI:" line above; voice-lint check #8 requires it.]
```

> **Annotation slot — Phase B divergence.** Replace this blockquote with one or two sentences naming the meaningful difference between the two over-engineering responses. Examples (pick the one that matches your captures, or write your own): "Claude Code suggested installing Tailwind CSS and looking up book-cover images from an external service; Gemini CLI suggested CSS Grid with custom wooden-background images. Both interpreted 'real bookshelf' as a redesign rather than light styling. That is the recognize-wrong moment for over-engineering." OR "Both agents proposed multi-file changes — a `styles.css` file, a `bookshelf.css` file, a `book-cover.js` lookup — for a one-line styling ask. The convergence is the lesson: open-ended asks invite over-shoot regardless of which agent runs them." Your transcript will look like the one for your chosen agent.

The point is not that the agent was being unhelpful — it was being TOO helpful, in the direction you did not want. Recognizing over-engineering is its own observation skill. The shape: the agent's response is bigger than the task, the agent's plan has more steps than the task needs, and the keywords are framework / library / install / refactor when none of those was asked for.

### The steer-back-to-scope move

Steer back to scope. The follow-up ask:

> Too much. I just want simple inline CSS to give the list a wooden background and some line spacing. No frameworks.

Three sentences. Names the over-shoot, restates the intent with tighter scope, and rules out the framework path. Watch how the agents scale back.

> **Capture slot — Claude Code Phase C scope-steer response.** Replace the bracketed lines below with the verbatim Claude Code transcript from your Phase C session.

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the Phase C
scope-steer session. Show the agent's scaled-back response — typically a short
inline-CSS edit on the `<ul>` element with a wooden background color and some
line spacing. Keep the standalone "Claude Code:" line above; voice-lint check #8
requires it.]
```

> **Capture slot — Gemini CLI Phase C scope-steer response.** Replace the bracketed lines below with the verbatim Gemini CLI transcript from your Phase C session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the Phase C
scope-steer session. Show the same kind of moment captured above for Claude Code —
the scaled-back inline-CSS edit. Keep the standalone "Gemini CLI:" line above;
voice-lint check #8 requires it.]
```

> **Annotation slot — Phase C divergence.** Replace this blockquote with one or two sentences naming what each agent scaled back to. Examples: "Claude Code dropped the framework suggestion and applied an inline `style` attribute on the `<ul>` with a brown background and 1.5em line height. Gemini CLI did the same but used a `<style>` block in the `<head>` instead of inline attributes. Both honored 'no frameworks'; the shape of the styling differed slightly." OR "Both agents converged on a `style` attribute with a wooden-brown background color and adjusted line spacing. The convergence is the lesson: tight scope language ('inline CSS', 'no frameworks') produces tight edits." Your transcript will look like the one for your chosen agent.

That is the canonical steer pattern at full size: name the over-shoot, restate intent with tighter scope, rule out the path you did not want. The result usually lands in one iteration.

### When steering fails — `/clear` and start over

Sometimes steering is not working. The agent keeps over-engineering despite your scope constraint, or it is stuck in a loop where every steer makes the code WORSE. The right move is `/clear`. The conversation history wipes; the agent loses memory of the hole it dug; you start fresh with a sharper initial ask that bounds the scope from the start.

`/clear` is not failure. It is hygiene. Think of it the way you think of restarting a meeting that has gone in circles — sometimes the fastest path forward is a fresh page. Lesson 2 introduced `/clear` as part of context-window discipline; this lesson uses the same command for the same reason. The token-and-cost angle from Lesson 2 (`/clear` resets the context so you stop paying for stale history) is the same angle here (`/clear` resets the context so you stop fighting stale assumptions).

Example fresh ask after `/clear`:

> I have an HTML file with a `<ul>` of placeholder text. Add inline CSS — no frameworks, no images — to give the `<ul>` a wooden background color and ~1.5em line height. Nothing else.

That is a tighter ask than "make it look like a bookshelf," and it does the work the original ask was trying to do — without leaving the agent any room to over-engineer. The "nothing else" line is doing a lot of work: it explicitly forbids the framework / refactor / multi-file paths that the open-ended version invited.

### Feeding errors back

The second steer pattern is errors. When something throws an error — a red icon on the browser preview tab, a wall of red in the console panel, a yellow warning the agent's narration referenced — you do not need to read the details to fix it. Reading error messages back to a file pointer is Module 3.5 territory. The simplest steer is:

> I see this error: [paste the visible error text]. What should I do?

The agent already has the rest of the conversation as context — it knows what file you were editing, what change just happened, what the original intent was. With the error text added, its next ask is usually accurate. Even when it is not, the back-and-forth converges fast: paste error, get fix, paste new error if one appears, repeat. Two or three iterations is normal. More than five is the signal that `/clear` would be faster than another iteration.

### When to start over — the bigger `/clear`

If a SESSION is going poorly across many iterations — the agent is confused about file paths, contradicting earlier statements, repeating mistakes — the steer is bigger: end the session. Close the agent. Open a fresh terminal. Run the agent again. Start from intent.

The cost of starting fresh is one or two minutes; the cost of fighting through a confused session is often an hour or more. Module 7 covers session hygiene patterns in more detail. For now, the heuristic is: when the loop has stopped converging — every steer makes the agent more confident and more wrong — close the door, walk away, come back fresh.

### The loop closes

Module 3 ends here. You have run all four loop steps on the same scratch starter: intent → ask → evaluate → steer. You have watched two agents shape the same task differently. You have named the moves you can re-bind to any agent that comes next.

> **Note:** You can delete the `modules/03-the-loop/scratch/` directory now — your real project starts in Module 4. The scratch starter was always throwaway by design (D-31). The loop you learned in Module 3 carries forward; the file you ran it on does not.

## Exercise

Run the Lesson 4 sequence on your chosen agent. Plan twenty to twenty-five minutes.

1. **Steer #1 — fix the hallucination.** From the post-Lesson-3 state of `modules/03-the-loop/scratch/index.html` (today's date + toggle button + hallucinated book list), type: `These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."`
2. **Steer #2 — open-ended.** Type: `Make the list look like a real bookshelf.` Watch what your agent suggests. Is it over-engineering? Note the shape — framework suggestion, image lookup, multi-file refactor.
3. **Steer back to scope.** Type: `Too much. I just want simple inline CSS to give the list a wooden background and some line spacing. No frameworks.` Watch the agent scale back.
4. **`/clear` practice.** Type `/clear` to wipe the session. Open a new session with a tighter initial ask: `I have an HTML file with a <ul> of placeholder text. Add inline CSS — no frameworks, no images — to give the <ul> a wooden background color and ~1.5em line height. Nothing else.` Notice how the tighter initial ask removes the over-engineering temptation.
5. **Write four sentences** in a scratch note:
   - What your agent suggested initially for "make it look like a bookshelf."
   - How you steered back to scope.
   - What the tighter post-`/clear` ask produced.
   - Which approach (steer or restart) felt cleaner on this task.

You can commit the final state of `modules/03-the-loop/scratch/index.html` if you want a record of where Module 3 ended — or you can delete the scratch directory entirely. Module 4 starts a fresh project.

## Checkpoint

You've got this if you can:

1. Write a steer ask in three parts (what was wrong, what you wanted, any constraint).
2. Recognize when an agent is over-engineering and write the scope-steer that names the limit.
3. Decide when `/clear` is faster than another steer.

## Going deeper

Optional, only if you are curious:

- **Module 5** ships three hand-curated "watch the AI fail" walkthroughs against the deployed thread project. Each one names a smell test you should have caught and the recovery prompt that worked. The walkthroughs are the case-study layer on top of the observation + steering skills Module 3 just taught.
- **Module 6** covers steering during bug fixes against a live deployed product. The pressure shape is different — a real bug means a real user is affected — but the loop is the same: observe, name what is wrong, steer.
- **Module 7** covers session hygiene patterns: when to `/clear`, when to switch agents, when to step away from the keyboard entirely. The patterns generalize beyond AI coding to any tight-feedback-loop tool.

## Loop check

> **Loop check — steer.** Module 3 Lesson 4 sharpens the *steer* step of the agent loop. Three-part steer asks + recognizing over-engineering + `/clear` as a hygiene move round out the loop. The loop step this lesson reinforces is **steer**.

## What you just did

You closed the loop. You steered an agent away from a hallucination, recognized over-engineering on an open-ended ask, steered back to scope, and practiced the `/clear`-and-restart move. You have now run the full intent → ask → evaluate → steer cycle end-to-end on two agents (or one, if you are on a single path) and seen each step in depth. Module 3.5 (next) teaches the code-reading floor — pattern recognition for non-coders. Then Phase 3 starts the thread project.

## Navigation

[← Previous: Reading plans + recognizing wrong output](./03-reading-plans-recognizing-wrong.md)
[Next: Module 3.5 — Reading code, just enough →](../03.5-reading-code/README.md)
