# Capture brief — Module 3 Lesson 4 (`04-steering-and-recovery.md`)

This file lists the transcripts and screenshots the lesson needs from real paired Claude Code + Gemini CLI sessions, per D-28 (real captures, not idealized). The lesson body at `modules/03-the-loop/04-steering-and-recovery.md` was shipped with explicit capture-slot placeholders that this brief tells you how to fill.

Lesson plan: `.planning/phases/02-toolchain-the-loop/02-12-PLAN.md` (Task 1).

## What is different about L4

L4 is the closing M3 lesson. The capture is three-phase by design: Phase A captures a "normal" steer (fixing the L3 hallucination), Phase B captures an OVER-ENGINEERED response to an open-ended ask, and Phase C captures the scope-steer that brings the agent back to a tight constraint. Phase B is the load-bearing capture — over-engineering is the most-common steer-needed failure shape beyond hallucination, and the lesson uses it as the primary teaching moment.

Like L3, L4 is engineered around real failure. Phase B's ask — "Make the list look like a real bookshelf." — is deliberately open-ended; the agent will reach for frameworks, libraries, image lookups, or multi-file refactors. **That over-engineering is the lesson's point.** Capture it verbatim. Do not edit the agent's response to make it look more reasonable. The scope-steer in Phase C is what recovers from it.

Module 3 ends after this lesson. The lesson body includes the D-31 finale note: "you can delete the scratch directory now — your real project starts in Module 4."

## Setup

1. Open the repo in your Codespace.
2. Confirm `modules/03-the-loop/scratch/index.html` is in its **post-L3 state**: the file contains today's date (L1) + a button that hides or shows the date (L2) + a `<ul>` with three hallucinated book titles (L3). If the lesson commit landed the post-L4 representative example (placeholder text + inline bookshelf CSS), reset it for capture:

   ```bash
   git show HEAD~2:modules/03-the-loop/scratch/index.html > modules/03-the-loop/scratch/index.html
   ```

   (`HEAD~2` is the M3 L3 ship — the post-L3 representative state shipped in Plan 02-11. Adjust the ref if commits have landed on top.) Restore the lesson-shipped post-L4 version when you finish capturing.

3. Open VS Code's Live Preview on the file (right-click → Show Preview). You should see the name, tagline, today's date, a button labeled "Hide date" or "Show date," and a `<ul>` with three hallucinated book titles.

## The capture — three phases per agent

Run all three phases in the SAME session per agent (no `/clear` between phases — context carries from Phase A into B and B into C). If you run both agents, use a fresh session per agent (use `/clear` if running back-to-back in the same terminal so the two agents' contexts do not bleed).

### Phase A — Steer the L3 hallucination

Verbatim ask:

> These books are not actually my favorites. Please replace with placeholder text saying "add your three favorite books here."

Expected shape: a short acknowledgement plus a one-shot edit that replaces the three `<li>` contents with placeholder text. This is the "canonical light steer" the lesson teaches first.

### Phase B — The open-ended ask (load-bearing capture)

Verbatim ask:

> Make the list look like a real bookshelf.

Do NOT pre-specify framework / library / inline-CSS-only / no-images. The whole point is that "real bookshelf" is open enough that the agent reaches for over-engineered solutions. Typical shapes you may see:

- Suggesting Tailwind CSS or another framework install
- Suggesting external image lookups for book covers
- Suggesting 3D / shadow / perspective effects
- Suggesting a multi-file refactor (a new `bookshelf.css`, a new `book-cover.js`)
- Suggesting JavaScript that fetches book covers from an API

Capture the FULL response. The over-engineering is the teaching surface, and trimming the response shrinks the lesson's payoff.

### Phase C — Steer back to scope

Verbatim ask (immediately after Phase B in the same session):

> Too much. I just want simple inline CSS to give the list a wooden background and some line spacing. No frameworks.

Expected shape: a scaled-back edit applying inline CSS to the `<ul>` element — a brown / wooden background color, a line-height bump, no framework references. This is the canonical scope-steer the lesson teaches as the recovery move.

### (Optional) Phase D — `/clear` and start over

If during Phase B the agent went so far that even Phase C did not bring it back, you can capture the `/clear` moment as a fourth phase. The lesson body has a paragraph on this scenario but does NOT have dedicated capture slots for it — if you have a great Phase D moment, you can extend the lesson with one extra paired block; otherwise the existing `/clear` paragraph is enough.

## What to capture per agent

For each agent (Claude Code and Gemini CLI), record:

| Item                                                          | Required? | Notes                                                                                                                                                                                                                       |
| ------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase A response (steer the hallucination)                    | **Yes**   | The agent's response to the placeholder-text ask. Typically short — one or two sentences of acknowledgement plus the edit. Both agents usually one-shot this.                                                                |
| Phase B response (over-engineering)                           | **Yes**   | The agent's response to the open-ended "real bookshelf" ask. This is the load-bearing capture — keep the full response so the over-shoot is visible. Note which shape your agent reached for (framework, image lookup, refactor, etc.). |
| Phase C response (scope-steer)                                | **Yes**   | The agent's response to the "no frameworks, inline CSS only" scope-steer. Should scale back to a simple inline-styled `<ul>`.                                                                                                |
| Phase A / B / C divergence annotations                        | **Yes**   | One sentence per phase naming the meaningful difference between the two agents. Examples are in the lesson body's annotation slot blockquotes — pick the one that matches your captures or write your own.                  |
| The browser preview after Phase C                             | Recommended | Screenshot of the Live Preview tab showing the styled bookshelf list (wooden background, placeholder text, line spacing). PNG, 1200–1600 px wide. This is the "page is the ground truth" surface for the closing lesson.   |
| The final HTML body / `<ul>` element                          | **Yes**   | The verbatim HTML (or `<script>` body, if your agent went that route) one of the agents produced for Phase C. Pick the cleaner of the two (or the agent you ran yourself). Copy this into `modules/03-the-loop/scratch/index.html` — replacing the representative example currently shipped. |

## Recommended screenshots

| Slot                                                  | Filename suggestion                                                       | What it shows                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Phase A — placeholder text edit (after the steer)     | `01-phase-a-placeholder-edit.png` (optional)                              | Live Preview tab after the hallucination was steered out — the `<ul>` now shows placeholder text.      |
| Phase B — over-engineering response                   | `02-phase-b-over-engineering.png` (**recommended**)                       | The terminal panel showing the over-engineered response — framework suggestion, image lookup, etc. The load-bearing capture for the lesson's pedagogy. |
| Phase C — scope-steer result (wooden bookshelf)       | `03-phase-c-bookshelf-styled.png` (**recommended**)                       | Live Preview tab showing the final wooden-bookshelf-styled list. This is what "Module 3 ends with" looks like in the browser. |
| (Optional) Phase D — `/clear` and tighter restart     | `04-phase-d-clear-restart.png` (optional)                                 | The terminal panel just after `/clear`, showing the fresh session and the tighter restart ask.          |

All PNGs go in this directory (`screenshots/m3/04-steering-and-recovery/`). Use kebab-case filenames; prefix with `01-`, `02-`, etc. for ordering.

## What to do with the captures

1. **Replace the Claude Code Phase A placeholder** in `modules/03-the-loop/04-steering-and-recovery.md` (the `[Replace this block ...]` inside the first ` ```text Claude Code: ... ``` ` fenced block). Keep the standalone `Claude Code:` label — voice-lint check #8 requires it.
2. **Replace the Gemini CLI Phase A placeholder** (the `[Replace this block ...]` inside the first ` ```text Gemini CLI: ... ``` ` fenced block). Keep the standalone `Gemini CLI:` label.
3. **Replace the Phase A divergence annotation** with one or two sentences naming the meaningful difference between the two responses.
4. **Repeat steps 1–3 for Phase B and Phase C** — six transcript placeholders + three divergence annotations total.
5. **Update `modules/03-the-loop/scratch/index.html`** with the verbatim final HTML from your Phase C capture. The shipped version is a representative example: a `<ul>` with placeholder text and inline CSS (wooden background, line spacing). Replace it with what your chosen agent actually wrote. Update the comment header to name the capture date and the agent whose output you used.
6. **(Optional) embed the browser-preview screenshot** in the lesson's Phase C section. Suggested alt text: `![Browser preview showing the final wooden-bookshelf-styled list after the scope-steer](../../screenshots/m3/04-steering-and-recovery/03-phase-c-bookshelf-styled.png)`.
7. **Update the lesson's `Last captured:` date** if you re-run capture on a different date than the lesson's existing `updated:` date.
8. **Run `./scripts/voice-lint.sh`** — exit 0 is required. Check #8 (m3-dual-agent) needs both `Claude Code:` and `Gemini CLI:` standalone-line labels.
9. **Commit** with a message like:

   ```text
   docs(02-12): replace M3 L4 capture placeholders with verbatim transcripts

   - L4 three-phase capture run 2026-MM-DD (Claude Code + Gemini CLI)
   - Phase A (steer hallucination): one-shot placeholder edit captured
   - Phase B (over-engineering): full response captured verbatim — [framework/refactor/etc.]
   - Phase C (scope-steer): inline-CSS bookshelf captured
   - scratch/index.html final body = verbatim output from [agent]
   - browser-preview screenshot added (wooden bookshelf visible)
   ```

10. **Module 3 is now complete.** You can delete `modules/03-the-loop/scratch/` if you want — the D-31 finale note in the lesson body says so. The scratch starter was always throwaway by design. Module 3.5's reference scaffold (`modules/03.5-reading-code/sample-app/`) is unrelated and is read-only.

## Why the placeholders exist

The lesson author cannot ship synthetic transcripts as if they were real (D-28). The shipped lesson body therefore uses explicit placeholder slots with the `Claude Code:` and `Gemini CLI:` standalone-line labels present (so voice-lint passes structurally) and bracketed content the lesson author replaces with the verbatim capture. This separates the lesson SHAPE (which is autonomous) from the lesson CONTENT (which requires running real paired agent sessions and capturing the steers + over-engineering). When the captures land, the lesson reads as one continuous worked example with no remaining placeholders.

## What this lesson does NOT capture

Per D-33 (M3.5 floor), L4 does NOT capture code-reading recovery. If the captured session contains the agent describing a file panel, diff summary, or `'use client'` directive while explaining the over-engineering, those are NOT what the lesson teaches. Trim the captured transcript to keep the STEER moments (the three-part ask, the scope constraint, the `/clear` decision) — those are L4's territory. The code-reading moments belong to M3.5 lessons; do not import them here.

Per D-31, the lesson includes the throwaway-by-design finale note. Do NOT capture material that suggests the scratch project should be carried forward — Module 4 starts a fresh project. The scratch is closed at the end of L4 by design.

## Pointers

- Lesson body: `modules/03-the-loop/04-steering-and-recovery.md`
- Scratch post-L3 state (the starting point for L4 captures): `modules/03-the-loop/scratch/index.html` at the `HEAD~2` commit from this plan's ship
- L1 capture brief for the parallel pattern: `screenshots/m3/01-introducing-the-loop/CAPTURE.md`
- L2 capture brief for the multi-phase capture pattern: `screenshots/m3/02-planning-vs-execution/CAPTURE.md`
- L3 capture brief for the engineered-failure pattern: `screenshots/m3/03-reading-plans-recognizing-wrong/CAPTURE.md`
- Screenshot conventions: `screenshots/README.md`
- D-24 / D-25 / D-27 / D-28 / D-31 rationale: `.planning/phases/02-toolchain-the-loop/02-CONTEXT.md`
- D-24 loop-step assignments (L4 names `steer`): same file
- Over-engineering GLOSSARY anchor: `GLOSSARY.md#over-engineering`
