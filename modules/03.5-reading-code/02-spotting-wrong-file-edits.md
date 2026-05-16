---
title: "Spotting wrong-file edits"
module: "03.5-reading-code"
lesson_number: 02
est_minutes: 35
prereqs: ["01-reading-a-file-tree"]
updated: "2026-05-14"
deviations: []
---

# Spotting wrong-file edits

## Learning objective

By the end of this lesson, you will be able to read an AI agent's diff summary — the filename and the lines-changed counts the agent reports — against the intent of your ask, and judge whether the agent edited the right file, without reading any code.

## Why this matters

You hired a contractor to paint the front bedroom. You left for work; you came home and read the note pinned to the door: "Painted the bedroom — done!" You walked to the front bedroom — still the old color; you walked to the back bedroom — freshly painted. The contractor did paint a bedroom; just not the one you asked for. When an AI agent edits files, it sometimes hands you the same shape of note: it says it touched one place and you walk into a different room. This lesson teaches you to catch that in seconds — you compare; you don't have to paint.

## Core read

Picture the contractor again. The note pinned to the door said "Painted the bedroom — done!" You walked into the front bedroom and into the back bedroom, and the difference between what the note SAID and what the rooms LOOK LIKE is what told you the wrong room got painted. You did not pick up a brush. You compared two surfaces: the note, and the room the note pointed at. AI agents publish the same two surfaces every time they finish an edit pass, and the same comparison catches the same mistake.

When an AI coding agent edits files, it shows you two things you can scan at a glance. First, the **file panel** (a one-line definition: the editor's source-control or file-tree panel showing which files have just changed, often with an `M` marker or color highlight, [→ GLOSSARY](../../GLOSSARY.md#file-panel)) — a visual list of every file that was touched in the last edit pass. This is the room you walk into. Second, the **diff summary** (a one-line definition: a one-line per-file report from the agent showing the filename and the number of lines added or removed, [→ GLOSSARY](../../GLOSSARY.md#diff-summary)) — what the agent itself prints in the conversation after it finishes. This is the contractor's note.

Together, those two surfaces tell you everything you need to spot a wrong-file edit. You do not have to open the file. You do not have to read the diff. You scan two things: the filename the agent says it touched, and whether that filename makes sense for what you asked for.

### The pattern, named

The pattern is simple. Take the intent you asked for. Take the filename the agent says it edited. Ask yourself: does that filename make sense for the intent?

If you asked for a change to the home page heading and the agent edited the footer, that is a wrong-file edit. Done. The steer is one ask: "You edited the footer; I wanted the heading on the home page. The heading is in `StaticHero.tsx` — please edit there instead."

You do not need to argue with the agent. You do not need to explain why the footer is wrong. You just name the file you actually wanted touched, and the next loop iteration goes there.

### What a diff summary looks like

The diff summary is intentionally minimal. It shows one filename and two numbers. Here are three real-shaped examples:

```
Modified: app/components/InteractiveButton.tsx (+2 lines, -0 lines)
```

```
Modified: app/components/Footer.tsx (+1 line, -1 line)
```

```
Modified: app/components/StaticHero.tsx (+1 line, -1 line)
```

The filename tells you WHERE. The numbers tell you HOW MUCH. A `+2 -0` change is a small add. A `+1 -1` change is a one-line replacement. A `+200 -50` change for what should have been a one-word text edit is a separate kind of smell (the agent did too much) — but for spotting wrong-file edits, the filename alone catches most cases. The line counts are a secondary check.

### Three worked examples, against the sample-app

Open `modules/03.5-reading-code/sample-app/` in your editor's file tree to refresh your memory from Lesson 1. The home page is `app/page.tsx`. The components are in `app/components/`. Three component files live there: `InteractiveButton.tsx`, `StaticHero.tsx`, `Footer.tsx`.

With that shape in mind, here are three (intent, diff-summary) pairs:

**Example 1 — right-file.** Intent: "Add a button to the home page that says hi when clicked." Diff summary: `Modified: app/components/InteractiveButton.tsx (+2 lines, -0 lines)`. Verdict: right-file. The `InteractiveButton.tsx` component is the place a click-handling button lives, and the home page (`page.tsx`) already imports it. The agent added two lines to the button component; that fits the intent.

**Example 2 — wrong-file.** Intent: "Update the home page heading to say Welcome." Diff summary: `Modified: app/components/Footer.tsx (+1 line, -1 line)`. Verdict: wrong-file. The home page heading lives in the hero section (`StaticHero.tsx`), not in the footer. The agent edited a file unrelated to the intent. Steer: "You edited the footer; the heading is in `StaticHero.tsx`. Please edit there instead."

**Example 3 — right-file.** Intent: "Change the hero section message to say something more welcoming." Diff summary: `Modified: app/components/StaticHero.tsx (+1 line, -1 line)`. Verdict: right-file. The hero section IS `StaticHero.tsx`. The agent replaced one line with another in the right file.

Three examples, three judgments. Two scan-it-and-move-on; one catch-and-steer.

### When wrong-file detection passes but the result is still wrong

A right-file judgment does NOT mean the change is correct. It means the agent at least went to the right place. After right-file passes, you still check the page in the browser — does it show what you asked for? That second observation is what Module 3 Lesson 3 covered (visual divergence, output divergence, narration divergence). Module 3.5's next two lessons sharpen the code-side observations further: Lesson 3 reads error messages back to a file pointer when the page errors; Lesson 4 catches one specific symptom — interactive elements that do not respond after an edit — and traces it to a one-line file fix.

Wrong-file detection is the first filter. Pass it, and you move on to the second filter. Fail it, and you steer back before anything else matters.

### What you do NOT do in this lesson

You do not read the diff line by line. You do not analyze whether the +2 lines are correct code. You do not compare the diff against the file's existing structure to spot whether the agent broke something. All of those are deeper code-reading skills — Module 7 ("where to go next") points at them; the thread project in Phases 3 and 4 does not require them.

Wrong-file detection is purely "this filename does not match the intent." That is the floor Module 3.5 holds throughout. If the floor seems narrow, that is by design — the floor catches a large class of failures with one observation. Going deeper is optional, not required.

## Exercise

Plan twenty to twenty-five minutes for this exercise.

1. **Create a scratch file.** Outside the sample-app folder (the repo root or a personal scratch folder is fine), make a new file called `m3.5-l2-scratch.txt`. You do not want to modify the sample-app.

2. **Write your judgment for each pair below.** For each of the three pairs, write three sentences in the scratch file:
   - (a) Your verdict: right-file or wrong-file.
   - (b) Your reasoning in plain English: why does the filename fit (or not fit) the intent?
   - (c) If wrong-file, what would your steer-back ask say? Name the file you actually wanted edited.

3. **Compare with the answer key at the bottom.**

**Pair 1.**
- **Intent:** "Add a button to the home page that says hi when clicked."
- **Diff summary:** `Modified: app/components/InteractiveButton.tsx (+2 lines, -0 lines)`

**Pair 2.**
- **Intent:** "Update the home page heading to say Welcome."
- **Diff summary:** `Modified: app/components/Footer.tsx (+1 line, -1 line)`

**Pair 3.**
- **Intent:** "Change the hero section message to say something more welcoming."
- **Diff summary:** `Modified: app/components/StaticHero.tsx (+1 line, -1 line)`

**Answer key (do not peek before judging):**

- **Pair 1:** RIGHT-FILE. `InteractiveButton.tsx` is the click-handling button component the home page already imports; editing it to handle a new click action fits the intent. The line counts (+2 -0) suggest a small add, which fits "add a button behavior."
- **Pair 2:** WRONG-FILE. The home page heading lives in the hero section (`StaticHero.tsx`), not in the footer. The agent went to the wrong place. Steer: "You edited the footer; the heading is in `StaticHero.tsx`. Please edit there instead."
- **Pair 3:** RIGHT-FILE. The hero section IS `StaticHero.tsx`. The agent edited the right file. The (+1 -1) counts fit a one-line text replacement.

If you judged all three correctly, the floor is there. If you missed one — especially the wrong-file pair — re-read the diff summary, then re-read the intent, then ask yourself one question: "Does the filename name the thing the intent is about?" That is the whole check.

## Checkpoint

You've got this if you can:

1. Read a diff summary — filename plus lines-changed counts — and judge whether it fits the intent of your ask in under ten seconds.
2. Write a one-sentence steer that names the file you actually wanted edited when the agent edited the wrong one.

## Going deeper

Optional, only if you are curious:

- **Module 7** ("where to go next") will eventually cover reading the diff lines themselves — recognizing common AI failure shapes (incomplete edits, accidentally-deleted code, imports that were not updated). The wrong-file detection skill at this lesson's floor is enough for everything through Phase 5.
- **The agent itself** is one ask away from explaining any file in the sample-app. If a filename in a diff summary is unfamiliar, you can paste the filename back to the agent and ask "what does this file do?" — the answer plus the intent comparison is usually enough to judge fit.

## Loop check

> **Loop check — evaluate.** This lesson sharpens the *evaluate* step of the agent loop by adding one more observation pattern: matching the agent's claimed edit (the diff summary) against the intent of the ask. The loop step this lesson reinforces is **evaluate**.

## What you just did

You learned to read a diff summary — filename plus lines-changed counts — against your intent, and to judge whether the agent edited the right file. You practiced three judgments and named one wrong-file edit with a one-sentence steer. The next lesson layers error-message reading on top: when the page shows a red error after an edit, how do you trace it back to a file pointer without reading the rest of the error?

## Navigation

[← Previous: Reading a file tree](./01-reading-a-file-tree.md)
[Next: Error message to file pointer →](./03-error-message-to-file-pointer.md)
