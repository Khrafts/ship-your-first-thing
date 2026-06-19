# Capture brief — Module 3 Lesson 2 (`02-planning-vs-execution.md`)

This file lists the transcripts and screenshots the lesson needs from real paired Claude Code + Gemini CLI sessions, per D-28 (real captures, not idealized). The lesson body at `modules/03-the-loop/02-planning-vs-execution.md` was shipped with explicit capture-slot placeholders that this brief tells you how to fill.

Lesson plan: `.planning/phases/02-toolchain-the-loop/02-10-PLAN.md` (Task 1).

## Setup

1. Open the repo in your Codespace.
2. Confirm `modules/03-the-loop/scratch/index.html` is in its **post-L1 state**: the `<script>` body contains the code that displays today's date below the tagline, but NO button yet. If the lesson commit landed the post-L2 representative example, reset it for capture:

   ```bash
   git show HEAD~1:modules/03-the-loop/scratch/index.html > modules/03-the-loop/scratch/index.html
   ```

   (`HEAD~1` is the M3 L1 ship — the post-L1 representative state shipped in Plan 02-09. Adjust the ref if commits have landed on top.) Restore the lesson-shipped post-L2 version when you finish capturing.

3. Open VS Code's Live Preview on the file (right-click → Show Preview). You should see the name, tagline, and today's date below the tagline. No button yet.

## The three capture phases

The lesson covers planning, execution, and slash-command literacy. The captures are structured in three phases per agent.

### Phase A — Planning conversation (per agent)

Both agents receive the same one-line planning ask:

> Plan: I want to add a button below the date that shows or hides the date when clicked. Don't write code yet — describe what you would change in `modules/03-the-loop/scratch/index.html` and the steps you would take.

Capture the agent's plan response. The agent should NOT edit the file at this point — its output should be a list of steps or a paragraph describing the change.

### Phase B — Execution conversation (per agent, same session as Phase A)

In the same session immediately after Phase A, type:

> OK, please proceed with the plan.

Capture the agent's execution response — the edit (diff, file-panel narration, or short prose) the agent produced.

### Phase C — Slash command demonstrations

In Claude Code (one session is enough for this phase; can be done after Phases A + B):

- Type `/context` — capture the output.
- Type `/cost` — capture the output.
- Type `/clear` — capture what happens (the conversation history wipes).

In Gemini CLI (one session):

- Type `/stats` — capture the output.
- Type `/compress` — capture the output.
- Type `/clear` — capture the output.

The lesson body has dedicated capture slots for `/context` (Claude Code) and `/stats` (Gemini CLI) — those are the load-bearing ones. The other four (`/cost`, `/clear` × 2, `/compress`) are optional; you can either work them in as additional `text` blocks or keep them as reference notes in this brief for future contributors.

Run the two sessions in separate terminal panels (or one after the other in the same terminal — but `/clear` between agents if same-terminal, so the contexts do not bleed).

## What to capture per agent

For each agent (Claude Code and Gemini CLI), record:

| Item                                                          | Required? | Notes                                                                                                                                            |
| ------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phase A planning response                                     | **Yes**   | The agent's plan output — list of steps or paragraph, BEFORE any edit. Capture the full plan; the lesson can trim to the cleanest excerpt.       |
| Phase B execution response                                    | **Yes**   | The agent's edit (diff, file-panel narration, or short prose describing the change).                                                             |
| Phase C `/context` (Claude Code) OR `/stats` (Gemini CLI)     | **Yes**   | The verbatim text the command emits in your session. The lesson body has dedicated slots for these two; the other slash-command outputs are optional. |
| Phase C `/cost`, `/clear`, `/compress` outputs                | Optional  | Keep for reference notes. If a contributor wants to land additional `text` blocks for these, the slots can be added in a follow-up PR.            |
| One instructive planning divergence                           | **Yes**   | One sentence describing where the two agents shaped the same plan differently — e.g., one listed four numbered steps, the other wrote a paragraph; one named the JavaScript approach, the other stayed at outcome-level. |
| One instructive execution divergence                          | **Yes**   | One sentence describing where the two agents produced different code — e.g., inline `onclick` vs `addEventListener`; `style.display` vs a CSS class toggle. |
| The browser preview after the edit                            | Yes       | Screenshot of the Live Preview tab showing the page with a button below the date that toggles the date's visibility. PNG, 1200–1600 px wide.     |
| The final `<script>` body                                     | **Yes**   | The verbatim JavaScript one of the agents produced. Pick the cleaner of the two (or the agent you ran yourself). Copy this into `modules/03-the-loop/scratch/index.html` — replacing the representative example currently shipped. |

## Required screenshots

| Slot                                          | Filename suggestion                                                       | What it shows                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Claude Code planning response                 | `01-claude-code-planning.png` (optional — transcript text alone is sufficient if formatting renders cleanly) | The terminal panel after Claude Code's planning response is complete; the plan visible before any edit. |
| Gemini CLI planning response                  | `02-gemini-cli-planning.png` (optional)                                   | The terminal panel after Gemini CLI's planning response is complete; same content shape.               |
| Claude Code execution response                | `03-claude-code-execution.png` (optional)                                 | The terminal panel after Claude Code's execution response is complete; diff or file-change visible.    |
| Gemini CLI execution response                 | `04-gemini-cli-execution.png` (optional)                                  | Same as above, for Gemini CLI.                                                                         |
| Browser preview after toggle works            | `05-browser-preview-button-toggling-date.png` (**required**)              | The Live Preview tab showing the button below the date. Capture two states if you want: one with the date visible, one hidden (filename suffix `-visible.png` / `-hidden.png`). |
| Claude Code `/context` output                 | `06-claude-code-context-output.png` (optional)                            | The terminal after typing `/context`; the usage report.                                                |
| Gemini CLI `/stats` output                    | `07-gemini-cli-stats-output.png` (optional)                               | The terminal after typing `/stats`; the stats output.                                                  |

All PNGs go in this directory (`screenshots/m3/02-planning-vs-execution/`). Use kebab-case filenames; prefix with `01-`, `02-`, etc. for ordering.

## What to do with the captures

1. **Replace the planning-transcript placeholders** in `modules/03-the-loop/02-planning-vs-execution.md` (the two `[Replace this block ...]` slots inside the planning-section `text Claude Code: ... ` and `text Gemini CLI: ... ` fenced blocks). Keep the `Claude Code:` and `Gemini CLI:` standalone-line labels — voice-lint check #8 requires them.
2. **Replace the planning-divergence annotation** (the `> **Annotation slot — planning divergence.**` blockquote) with one or two sentences naming the meaningful difference between the two plans.
3. **Replace the execution-transcript placeholders** (the two `[Replace this block ...]` slots inside the execution-section fenced blocks). Keep the standalone agent-name labels.
4. **Replace the execution-divergence annotation** (the `> **Annotation slot — execution divergence.**` blockquote) with one or two sentences naming the meaningful difference between the two edits.
5. **Replace the slash-command output placeholders** (the two `[Replace this block ...]` slots inside the `/context` and `/stats` fenced blocks). Keep the standalone agent-name labels.
6. **Update `modules/03-the-loop/scratch/index.html`** with the verbatim final `<script>` body. The shipped version is a representative example using `document.createElement('button')` plus an event listener that toggles `dateEl.style.display`; replace it with what your chosen agent actually wrote. Update the comment header to name the capture date.
7. **(Optional) embed the browser-preview screenshot.** If you have the screenshot at `screenshots/m3/02-planning-vs-execution/05-browser-preview-button-toggling-date.png` (or similar), you can embed it inline in the lesson's execution-divergence section or in the "What you just did" section with descriptive alt text: `![Browser preview showing the button below the date](../../screenshots/m3/02-planning-vs-execution/05-browser-preview-button-toggling-date.png)`.
8. **Update the lesson's `Last captured:` date** if you re-run capture on a different date than the lesson's existing `updated:` date.
9. **Run `./scripts/voice-lint.sh`** — exit 0 is required. Check #8 (m3-dual-agent) needs both `Claude Code:` and `Gemini CLI:` standalone-line labels.
10. **Commit** with a message like:

    ```text
    docs(02-10): replace M3 L2 capture placeholders with verbatim transcripts

    - Planning conversation captured 2026-MM-DD (Claude Code + Gemini CLI)
    - Execution conversation captured 2026-MM-DD (Claude Code + Gemini CLI)
    - /context + /stats output captured 2026-MM-DD
    - scratch/index.html <script> body = verbatim output from [agent]
    - browser-preview screenshot added (button toggling date)
    ```

## Why the placeholders exist

The lesson author cannot ship synthetic transcripts as if they were real (D-28). The shipped lesson body therefore uses explicit placeholder slots with the `Claude Code:` and `Gemini CLI:` standalone-line labels present (so voice-lint passes structurally) and bracketed content the lesson author replaces with the verbatim capture. This separates the lesson SHAPE (which is autonomous) from the lesson CONTENT (which requires running two real agent sessions). When the captures land, the lesson reads as one continuous worked example with no remaining placeholders.

## Pointers

- Lesson body: `modules/03-the-loop/02-planning-vs-execution.md`
- Scratch post-L1 state (the starting point for L2 captures): `modules/03-the-loop/scratch/index.html` at the `HEAD~1` commit from this plan's ship
- L1 capture brief for the parallel pattern: `screenshots/m3/01-introducing-the-loop/CAPTURE.md`
- Screenshot conventions: `screenshots/README.md`
- D-25 / D-27 / D-28 rationale: `.planning/phases/02-toolchain-the-loop/02-CONTEXT.md`
- D-24 loop-step assignments (L2 names `ask`): same file
- The slash command set + the `/tokens` migration: `WHAT-CHANGED.md` 2026-05-14 slash-command migration entry; `CHEATSHEET.md` `## AI prompts` + `## Token discipline` sections
