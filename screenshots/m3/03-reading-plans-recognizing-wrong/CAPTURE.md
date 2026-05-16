# Capture brief — Module 3 Lesson 3 (`03-reading-plans-recognizing-wrong.md`)

This file lists the transcripts and screenshots the lesson needs from real paired Claude Code + Gemini CLI sessions, per D-28 (real captures, not idealized). The lesson body at `modules/03-the-loop/03-reading-plans-recognizing-wrong.md` was shipped with explicit capture-slot placeholders that this brief tells you how to fill.

Lesson plan: `.planning/phases/02-toolchain-the-loop/02-11-PLAN.md` (Task 1).

## What is different about L3

L3's lesson body is built around a single ask that is engineered to FAIL in an instructive way. The ask — "Add a list of 3 favorite books below the button." — is deliberately under-specified: the agent has no way of knowing the learner's favorite books, so it will invent three titles. That invention is the lesson's whole point. **You are capturing the hallucination. Do NOT clean it up — the lesson SHIPS the invented titles verbatim because recognizing them is what the lesson teaches.**

Module 3 Lesson 4 walks through the steer that replaces the hallucinated titles with placeholder text. L3 captures the hallucination; L4 captures the recovery. Both lessons need their captures to read as one continuous worked example, so capture L3 + L4 in the same session if you can.

## Setup

1. Open the repo in your Codespace.
2. Confirm `modules/03-the-loop/scratch/index.html` is in its **post-L2 state**: the file contains today's date (L1) AND a button that hides or shows the date (L2), but NO list yet. If the lesson commit landed the post-L3 representative example, reset it for capture:

   ```bash
   git show HEAD~2:modules/03-the-loop/scratch/index.html > modules/03-the-loop/scratch/index.html
   ```

   (`HEAD~2` is the M3 L2 ship — the post-L2 representative state shipped in Plan 02-10. Adjust the ref if commits have landed on top.) Restore the lesson-shipped post-L3 version when you finish capturing.

3. Open VS Code's Live Preview on the file (right-click → Show Preview). You should see the name, tagline, today's date, and a button labeled "Hide date" or "Show date." No list yet.

## The capture

Both agents receive the same one-line L3 ask, verbatim:

> Add a list of 3 favorite books below the button.

That sentence is the load-bearing one. Do NOT pre-specify the three books. Do NOT tell the agent which kind of books you like. Do NOT mention genres. The whole point is that the agent has nothing to go on — and watching what it does is the lesson.

Run the ask in a SEPARATE session for each agent (use `/clear` if running back-to-back in the same terminal, so the contexts do not bleed across agents). Capture what each agent produces.

## What to capture per agent

For each agent (Claude Code and Gemini CLI), record:

| Item                                                          | Required? | Notes                                                                                                                                                                                                                       |
| ------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The agent's response to the L3 ask                            | **Yes**   | The full response: any planning surface (some agents will plan first; others will jump straight to the edit), the diff or file-panel narration, and ANY prose around the three titles ("I'll add your favorite books," etc.). The narration matters as much as the titles — observation pattern #4 (narration divergence) needs it. |
| The three specific book titles the agent invented             | **Yes**   | Verbatim. These ship in the lesson body and in `modules/03-the-loop/scratch/index.html`.                                                                                                                                    |
| One instructive divergence between the two agents             | **Yes**   | One sentence describing where the two agents diverged. Examples: one picked classic-canon titles, the other picked contemporary; one named them in its narration first and then edited, the other edited without naming them; one stopped after listing two titles (plan-vs-actual divergence) before you caught it.    |
| The browser preview after the edit                            | Recommended | Screenshot of the Live Preview tab showing the list of three hallucinated titles below the button. PNG, 1200–1600 px wide. This is the "evaluation surface" the lesson teaches the learner to read.                       |
| The final HTML body (or `<script>` body)                      | **Yes**   | The verbatim HTML or JavaScript one of the agents produced. Pick the cleaner of the two (or the agent you ran yourself). Copy this into `modules/03-the-loop/scratch/index.html` — replacing the representative example currently shipped. Most agents will edit the HTML body directly with a static `<ul>`; some will use JavaScript to inject the list — either is fine, both produce the same evaluation surface. |

## Recommended screenshots

| Slot                                          | Filename suggestion                                                       | What it shows                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Claude Code response                          | `01-claude-code-response.png` (optional — transcript text alone is sufficient if formatting renders cleanly) | The terminal panel after Claude Code completed its edit; the three invented titles visible.            |
| Gemini CLI response                           | `02-gemini-cli-response.png` (optional)                                   | The terminal panel after Gemini CLI completed its edit; same content shape.                            |
| Browser preview with hallucinated list visible | `03-browser-preview-hallucinated-list.png` (**recommended**)              | The Live Preview tab showing the three invented book titles below the button. This is the "page is the ground truth" surface the lesson teaches the learner to read. |

All PNGs go in this directory (`screenshots/m3/03-reading-plans-recognizing-wrong/`). Use kebab-case filenames; prefix with `01-`, `02-`, etc. for ordering.

## What to do with the captures

1. **Replace the Claude Code transcript placeholder** in `modules/03-the-loop/03-reading-plans-recognizing-wrong.md` (the `[Replace this block ...]` inside the ` ```text Claude Code: ... ``` ` fenced block). Keep the standalone `Claude Code:` label — voice-lint check #8 requires it.
2. **Replace the Gemini CLI transcript placeholder** (the `[Replace this block ...]` inside the ` ```text Gemini CLI: ... ``` ` fenced block). Keep the standalone `Gemini CLI:` label.
3. **Replace the divergence annotation** (the `> **Annotation slot — divergence.**` blockquote) with one or two sentences naming the meaningful difference between the two book lists or the two responses.
4. **Update `modules/03-the-loop/scratch/index.html`** with the verbatim final HTML or `<script>` body. The shipped version is a representative example: a static `<ul>` with three "classic" titles. Replace it with what your chosen agent actually wrote. Update the comment header to name the capture date and the agent whose output you used.
5. **DO NOT clean up the hallucination.** The lesson SHIPS the invented titles verbatim because recognizing them is the pedagogy. M3 L4 (next lesson) is what walks through replacing them with placeholder text. If the agent invented "1984," "To Kill a Mockingbird," and "The Great Gatsby," that is what ships — invented titles and all.
6. **(Optional) embed the browser-preview screenshot.** If you have the screenshot at `screenshots/m3/03-reading-plans-recognizing-wrong/03-browser-preview-hallucinated-list.png` (or similar), you can embed it inline in the lesson's "Where the L3 capture trips a pattern" section with descriptive alt text: `![Browser preview showing three invented book titles below the button](../../screenshots/m3/03-reading-plans-recognizing-wrong/03-browser-preview-hallucinated-list.png)`.
7. **Update the lesson's `Last captured:` date** if you re-run capture on a different date than the lesson's existing `updated:` date.
8. **Run `./scripts/voice-lint.sh`** — exit 0 is required. Check #8 (m3-dual-agent) needs both `Claude Code:` and `Gemini CLI:` standalone-line labels.
9. **Commit** with a message like:

   ```text
   docs(02-11): replace M3 L3 capture placeholders with verbatim transcripts

   - L3 hallucination ask captured 2026-MM-DD (Claude Code + Gemini CLI)
   - Three invented book titles per agent recorded verbatim
   - scratch/index.html book list = verbatim output from [agent]
   - browser-preview screenshot added (hallucinated list visible)
   ```

## Why the placeholders exist

The lesson author cannot ship synthetic transcripts as if they were real (D-28). The shipped lesson body therefore uses explicit placeholder slots with the `Claude Code:` and `Gemini CLI:` standalone-line labels present (so voice-lint passes structurally) and bracketed content the lesson author replaces with the verbatim capture. This separates the lesson SHAPE (which is autonomous) from the lesson CONTENT (which requires running two real agent sessions and capturing the hallucinations). When the captures land, the lesson reads as one continuous worked example with no remaining placeholders.

## What this lesson does NOT capture

Per D-33 (M3.5 floor), L3 does NOT capture code-reading recovery. If the captured session contains the agent describing a stack trace, file panel changes, diff summaries, or `'use client'` directives, those are NOT what the lesson teaches. Trim the captured transcript to keep the OBSERVATION moments (visual / output / plan-vs-actual / narration / error messages) — those are L3's territory. The code-reading moments belong to M3.5 lessons; do not import them here.

## Pointers

- Lesson body: `modules/03-the-loop/03-reading-plans-recognizing-wrong.md`
- Scratch post-L2 state (the starting point for L3 captures): `modules/03-the-loop/scratch/index.html` at the `HEAD~2` commit from this plan's ship
- L1 capture brief for the parallel pattern: `screenshots/m3/01-introducing-the-loop/CAPTURE.md`
- L2 capture brief for the multi-phase capture pattern: `screenshots/m3/02-planning-vs-execution/CAPTURE.md`
- Screenshot conventions: `screenshots/README.md`
- D-25 / D-27 / D-28 / D-30 / D-33 rationale: `.planning/phases/02-toolchain-the-loop/02-CONTEXT.md`
- D-24 loop-step assignments (L3 names `evaluate`): same file
- Hallucination GLOSSARY anchor: `GLOSSARY.md#hallucination`
