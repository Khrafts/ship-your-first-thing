# Capture brief — Module 3 Lesson 1 (`01-introducing-the-loop.md`)

This file lists the transcripts and screenshots the lesson needs from real paired Claude Code + Gemini CLI sessions, per D-28 (real captures, not idealized). The lesson body at `modules/03-the-loop/01-introducing-the-loop.md` was shipped with explicit capture-slot placeholders that this brief tells you how to fill.

Lesson plan: `.planning/phases/02-toolchain-the-loop/02-09-PLAN.md` (Task 1).

## Setup

1. Open the repo in your Codespace.
2. Confirm `modules/03-the-loop/scratch/index.html` is in its **starter state**: `<script>` body contains only the two comment lines from Plan 02-02. If it is not (the lesson commit landed a representative example body), reset it for capture:

   ```bash
   git show HEAD:modules/03-the-loop/scratch/index.html > /tmp/scratch-current.html
   git show 3ce3b87:modules/03-the-loop/scratch/index.html > modules/03-the-loop/scratch/index.html
   ```

   (`3ce3b87` is the Plan 02-02 starter-ship commit.) Restore the lesson-shipped version when you finish capturing.

3. Open VS Code's Live Preview on the file (right-click → Show Preview). You should see a near-blank page with `{your name}` and `{your tagline}`.

## The task (verbatim)

Both agents receive the same one-line ask:

> Add today's date below the tagline in `modules/03-the-loop/scratch/index.html`.

Run the two sessions in separate terminal panels (or one after the other in the same terminal — but `/clear` between them if same-terminal, so the contexts do not bleed).

## What to capture per agent

For each agent (Claude Code and Gemini CLI), record:

| Item                                            | Required? | Notes                                                                                                                                            |
| ----------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| The agent's first response                      | **Yes**   | The planning surface — what it proposes BEFORE editing (or its narration if it edits directly).                                                  |
| The edit (diff, file-panel screenshot, or narration) | **Yes**   | Whichever shape is more instructive for that agent. Diff is best; the file panel showing the change is fine; the agent's narration of the edit also works. |
| The browser preview after the edit              | Yes       | Screenshot of the Live Preview tab showing today's date below the tagline. PNG, 1200–1600 px wide.                                               |
| One instructive divergence                      | **Yes**   | One sentence describing where the two agents shaped the same intent differently — e.g., one asked for confirmation, the other proceeded; one used `toLocaleDateString()`, the other used string concatenation. |
| Whether steering was needed                     | Yes       | If both agents got it right on the first ask, note that. If one or both needed a steer, capture the steer prompt and the agent's second response. |
| The final `<script>` body                       | **Yes**   | The verbatim JavaScript one of the agents produced. Pick the cleaner of the two (or the agent you ran yourself). Copy this into `modules/03-the-loop/scratch/index.html` — replacing the representative example currently shipped. |

## Required screenshots

| Slot                                         | Filename suggestion                                            | What it shows                                                                                          |
| -------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Claude Code first response                   | `01-claude-code-first-response.png` (optional — transcript text alone is sufficient if formatting renders cleanly) | The terminal panel after Claude Code's first response is complete; planning surface + edit narration visible. |
| Gemini CLI first response                    | `02-gemini-cli-first-response.png` (optional — same as above)  | The terminal panel after Gemini CLI's first response is complete; same content shape.                  |
| Browser preview after edit applied           | `03-browser-preview-date-below-tagline.png` (**required**)     | The Live Preview tab showing the page with today's date rendered below the tagline.                    |
| (Optional) Steer moment                      | `04-steer-prompt-and-second-response.png`                      | Only if a steer was needed in capture; the steer prompt + the agent's second response.                 |

All PNGs go in this directory (`screenshots/m3/01-introducing-the-loop/`). Use kebab-case filenames; prefix with `01-`, `02-`, etc. for ordering.

## What to do with the captures

1. **Replace the transcript placeholders** in `modules/03-the-loop/01-introducing-the-loop.md` (the two `[Replace this block ...]` slots inside the ` ```text Claude Code: ... ``` ` and ` ```text Gemini CLI: ... ``` ` fenced blocks). Keep the `Claude Code:` and `Gemini CLI:` standalone-line labels — voice-lint check #8 requires them.
2. **Replace the divergence annotation** (the `> **Annotation slot — divergence.**` blockquote in the ask section) with one or two sentences naming the meaningful difference.
3. **Replace the evaluate moment** (the `> **Capture slot — evaluate moment.**` blockquote in the evaluate section) with what you actually observed. If you have the browser-preview screenshot, embed it inline with descriptive alt text: `![Browser preview showing today's date below the tagline](../../screenshots/m3/01-introducing-the-loop/03-browser-preview-date-below-tagline.png)`.
4. **Replace the steer moment** (the `> **Capture slot — steer moment.**` blockquote in the steer section) with whichever bullet matched your session — "no steer needed" OR a 2–3-sentence steer description.
5. **Update `modules/03-the-loop/scratch/index.html`** with the verbatim final `<script>` body. The shipped version is a representative `toLocaleDateString()` example; replace it with what your chosen agent actually wrote.
6. **Update the lesson's `Last captured:` date** if you re-run capture on a different date than the lesson's existing `updated:` date.
7. **Run `./scripts/voice-lint.sh`** — exit 0 is required. Check #8 (m3-dual-agent) needs both `Claude Code:` and `Gemini CLI:` standalone-line labels.
8. **Commit** with a message like:

   ```text
   docs(02-09): replace M3 L1 capture placeholders with verbatim transcripts

   - Claude Code transcript captured 2026-MM-DD
   - Gemini CLI transcript captured 2026-MM-DD
   - scratch/index.html <script> body = verbatim output from [agent]
   - browser-preview screenshot added
   ```

## Why the placeholders exist

The lesson author cannot ship synthetic transcripts as if they were real (D-28). The shipped lesson body therefore uses explicit placeholder slots with the `Claude Code:` and `Gemini CLI:` standalone-line labels present (so voice-lint passes structurally) and bracketed content the lesson author replaces with the verbatim capture. This separates the lesson SHAPE (which is autonomous) from the lesson CONTENT (which requires running two real agent sessions). When the captures land, the lesson reads as one continuous worked example with no remaining placeholders.

## Pointers

- Lesson body: `modules/03-the-loop/01-introducing-the-loop.md`
- Scratch starter (Plan 02-02): `modules/03-the-loop/scratch/index.html`
- Screenshot conventions: `screenshots/README.md`
- D-25 / D-27 / D-28 rationale: `.planning/phases/02-toolchain-the-loop/02-CONTEXT.md`
- Worked-example task across M3 lessons (D-31): the same `02-CONTEXT.md`
