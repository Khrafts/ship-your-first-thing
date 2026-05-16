---
title: "Reading plans + recognizing wrong output"
module: "03-the-loop"
lesson_number: 03
est_minutes: 50
prereqs: ["02-planning-vs-execution"]
updated: "2026-05-14"
deviations: []
---

# Reading plans + recognizing wrong output

## Learning objective

By the end of this lesson, you will be able to name five observation patterns that tell you the AI agent produced wrong output, and apply them to a real captured session without reading the code.

## Why this matters

Lesson 2 sharpened how you ASK. This lesson sharpens how you EVALUATE — how to know whether the agent's output matches your intent. The catch: you cannot always tell by reading the code. Module 3.5 covers code-level recognition; this lesson stays at the OBSERVATION floor. What you can always do is look at the page, read the agent's narration, compare its plan against its output, and notice when something the agent says it did is invisible. Five observation patterns carry you through almost every M3+ session.

> **Following along:** Run this loop on the agent you picked in Module 0. Both transcripts are shown for reference, but you only need to run your own.

> **Last captured:** 2026-05-14. If transcripts look different in your session, check `WHAT-CHANGED.md`.

## Core read

AI agents are confident. They will write code that "works" (in the sense of running without errors) but produces the wrong thing. They will say they did something they did not. They will invent details that look plausible — book titles, function names, file paths, configuration values — but are not real. The skill of the EVALUATE step is recognizing wrong output WITHOUT having to read the code line by line. Module 3.5 picks up code-level recognition; this lesson holds the observation floor.

The most common failure shape has a name. A **hallucination** (a one-line definition: when an AI agent produces specific details that look correct but were invented — book titles, function names, API endpoints, file paths the agent has no way of knowing, [→ GLOSSARY](../../GLOSSARY.md#hallucination)) is the failure that fools beginners most often. The output looks plausible because the agent is fluent at producing plausible-looking text; the catch is that plausibility does not mean accuracy.

This lesson walks one deliberately under-specified ask and watches both agents hallucinate together. The worked example continues on `modules/03-the-loop/scratch/index.html`: the file already shows today's date and a button that hides or shows it (Lessons 1 and 2). The new ask is short and under-specified:

> Add a list of 3 favorite books below the button.

Read that ask. Nothing about it tells the agent which three books — because the agent has no way of knowing your favorite books. There is no file in the project that names them. There is no past message in the conversation that lists them. There is nothing the agent could possibly look up. So what happens?

Here is what each agent produced on the day this lesson was captured.

> **Capture slot — Claude Code response.** Replace the bracketed lines below with the verbatim Claude Code transcript from your L3 session (see `screenshots/m3/03-reading-plans-recognizing-wrong/CAPTURE.md`).

```text
Claude Code:
[Replace this block with the verbatim Claude Code transcript from the L3 session.
Show enough of the agent's output to see (a) the three book titles it invented and
(b) any narration around them — e.g., "I'll add a list of your favorite books" or
similar. Keep the standalone "Claude Code:" line above; voice-lint check #8 requires
it.]
```

> **Capture slot — Gemini CLI response.** Replace the bracketed lines below with the verbatim Gemini CLI transcript from your L3 session.

```text
Gemini CLI:
[Replace this block with the verbatim Gemini CLI transcript from the L3 session.
Show the same kind of moment captured above for Claude Code — the three invented book
titles plus any narration around them. Keep the standalone "Gemini CLI:" line above;
voice-lint check #8 requires it.]
```

> **Annotation slot — divergence.** Replace this blockquote with one or two sentences naming the meaningful difference between the two book lists. Examples (pick the one that matches your captures, or write your own): "Claude Code invented three classic-canon titles I have never read; Gemini CLI invented three contemporary titles that sound plausible but I have never said are my favorites. Both produced valid HTML; both invented the data." OR "Both agents converged on three of the same widely-cited titles — neither of which is mine. The convergence is the lesson: when an agent has nothing to go on, it reaches for the most-cited candidates and presents them as if specified." Your transcript will look like the one for your chosen agent.

Notice what just happened. The agent had no way of knowing which three books to pick, so it picked three. The page now contains plausible-looking content that has nothing to do with you. The CODE works (the list renders correctly); the OUTPUT does not match your intent. That is hallucination — and it is invisible if you only check "did the page change."

### Five observation patterns

Five observation patterns surface wrong output. You do not need to read code for any of them.

**1. Visual divergence.** You asked for X; the page shows nothing where X should be. Example: "I asked for the date in the page; the page is blank." The page is the ground truth. If the page does not show what you wanted, the EVALUATE step says no — regardless of how good the agent's prose was.

**2. Output divergence.** Something IS there, but it is wrong. Example, and the canonical L3 case: "I asked for a list of 3 favorite books; the agent picked 3 books I have never read." Or: "I asked for today's date; the page shows yesterday's date / a date in the wrong timezone / the word `undefined`." The shape is right; the content is wrong.

**3. Plan-vs-actual divergence.** The agent's plan listed N steps; the agent executed fewer or different steps. Example: "The plan said: 1. open the file, 2. add a list element, 3. add three list items with book titles, 4. style them. The agent did steps 1, 2, and 3 — but skipped step 4 and did not mention skipping it." Read the PLAN. Compare it to what the agent says it DID. Look for the gap.

**4. Narration divergence.** The agent says it did something the page does not show. Example: "The agent said: I added a button to clear the list. There is no button on the page." Trust the page, not the narration. The agent's prose is sometimes confident about edits it did not actually make.

**5. Error messages.** The browser's preview tab shows a red error icon, or the console panel shows a wall of red text. You do not need to read the details — that is M3.5 territory. The observation is just: "there is something red where there should not be." Copy the visible error text and paste it back to the agent (Lesson 4 covers feeding errors back as the STEER step).

### Where the L3 capture trips a pattern

In the captured session above, observation pattern #2 (output divergence) is what flags the problem. The book list IS there. The shape is right. The content is wrong — these are not your favorite books, because the agent never had your favorite books to work from. The right next move is the STEER step (Lesson 4): tell the agent "These books are not actually my favorites. Replace with placeholder text that reads 'add your three favorite books here.'" That is a real-world steer that produces actual learner-shaped output.

If your capture happened to surface a different pattern — say, the agent stopped after listing two of the three books (plan-vs-actual divergence) — pattern #3 is the one that caught it. Same skill, different surface. The patterns are not exclusive; one capture may surface two or three of them. The point is naming the one that flagged the problem first.

### Why agents hallucinate — briefly

The deep "why" of hallucination — that AI agents predict plausible text rather than retrieve verified facts — is Module 7 / where-to-go-next material. For the loop, the WHY does not matter. The skill is RECOGNITION: when the agent invents specifics it could not possibly know, you have hit a hallucination. Name it; move to the steer step.

### What this lesson does not teach

This lesson does NOT teach you to read the agent's code edits to find bugs. That is Module 3.5. The point of M3 L3 is that you can recognize most wrong output WITHOUT reading code. The agent invented book titles; you did not have to read the list element to know that. The page IS the evaluation surface.

### Reading the agent's plan as one of the observations

Reading the agent's PLAN is one of the five observations — pattern #3 (plan-vs-actual divergence). When you start an execution conversation by reading the plan first (Lesson 2's discipline), you can flag missing steps BEFORE the agent edits. Example: "You listed step 4 as 'style the list'; I do not see styling in your edit. Please add the styling step." That is plan-vs-actual divergence caught BEFORE the loop wastes work on it. Lessons 2 and 3 are paired by design: planning conversations give you something to compare against in the evaluate step.

Five patterns. Visual / output / plan-vs-actual / narration / error message. Module 3.5 layers code-reading detection on top of these. Module 5 hand-curates three real bug walkthroughs against the deployed thread project. The five patterns from this lesson carry you through everything until then.

## Exercise

Run the L3 ask on your chosen agent. Plan twenty to twenty-five minutes.

1. **Confirm** that `modules/03-the-loop/scratch/index.html` shows today's date below the tagline AND a button that hides or shows it (the Lesson 2 state). If it does not, run Lesson 2's exercise first.
2. **Open your agent.** Type `claude` (Path 1 or Path 3) or `gemini` (Path 2) in the terminal. Open the scratch file in VS Code's Live Preview (right-click → Show Preview).
3. **Type the L3 ask, verbatim:** `Add a list of 3 favorite books below the button.`
4. **Watch the agent edit.** Wait for it to finish. Switch to the Live Preview tab.
5. **Evaluate using the five observation patterns,** in order:

   - **Visual divergence:** is there a list on the page below the button? (Probably yes — modern agents will produce visible output.)
   - **Output divergence:** are these your actual favorite books? (Almost certainly no.)
   - **Plan-vs-actual divergence:** did the agent describe a plan? Did its action match? Did it stop early or do extra?
   - **Narration divergence:** what did the agent say it did, and does the page reflect it?
   - **Error messages:** is the page rendering cleanly? Any red anywhere?

6. **Write three sentences** in a scratch file (any plain-text note):

   - Which observation pattern caught the problem first.
   - What the agent invented (the three specific titles).
   - What your next ask — the STEER step, next lesson — would be.

Do not commit `scratch/index.html` yet. Lesson 4 progresses the same file further.

## Checkpoint

You've got this if you can:

1. Name the five observation patterns without looking.
2. Apply at least one of them to your captured L3 session and identify the wrongness.

## Going deeper

Optional, only if you are curious:

- **Module 3.5** picks up where this lesson stops: code-level recognition (reading folders, recognizing wrong-file edits, reading an error message back to a file pointer). The four M3.5 lessons stay strictly at "you can detect this symptom" — they do not teach explanation from first principles.
- **Module 5** ships three hand-curated "watch the AI fail" walkthroughs against the deployed thread project. Together, the three layers (M3 L3 observation / M3.5 code reading / M5 case studies) cover the recognize-wrong skill end-to-end. This lesson is the OBSERVATION floor.
- **Anthropic's hallucination explainer** at `https://www.anthropic.com/research` (search for "hallucination") covers the deep "why." Most of it is for product builders; the parts about why specific-but-invented output happens apply to agent sessions too.

## Loop check

> **Loop check — evaluate.** Module 3 Lesson 3 sharpens the *evaluate* step of the agent loop. Five observation patterns turn "is the agent right?" from a vague question into a checklist you can run after every ask. The next lesson teaches the *steer* step. The loop step this lesson reinforces is **evaluate**.

## What you just did

You ran an ask that was deliberately under-specified, watched the agent hallucinate three book titles, and named the observation pattern that flagged the problem. You saw that the EVALUATE step is not about reading code — it is about looking at the page, the narration, and the plan, and noticing the gap between what the agent said it did and what is actually there. Lesson 4 covers what you DO with that recognition: the STEER step.

## Navigation

[← Previous: Planning vs execution conversations](./02-planning-vs-execution.md)
[Next: Steering + recovery →](./04-steering-and-recovery.md)
