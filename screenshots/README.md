# Screenshots

Shared image assets for course lessons that need a visual moment prose plus fenced code blocks can't carry — for V1, this is exclusively Module 3 transcript-capture work (per D-26). Lessons reference images via repo-relative paths from the lesson's location, e.g. `![alt text](../../screenshots/m3/01-introducing-the-loop/claude-code-first-plan.png)`.

## Convention

- **Path shape:** `screenshots/m3/<lesson-slug>/<descriptive-name>.png` where `<lesson-slug>` matches the lesson filename without `.md` (e.g., `01-introducing-the-loop`) and `<descriptive-name>` is a short kebab-case description of what the screenshot shows (e.g., `claude-code-first-plan`, `gemini-cli-edit-applied`, `browser-blank-after-third-ask`).
- **Format:** PNG. Lossless. Resize to a reasonable display width (typically 1200–1600 px wide) before commit.
- **Alt text is mandatory.** Every `![...](...)` reference in a lesson MUST include descriptive alt text — both for accessibility AND because alt text is the LESSON-08 staleness mitigation if the screenshot itself rots faster than the surrounding prose.
- **Front-matter `updated:` ties the screenshot to a date.** A screenshot's freshness is governed by its lesson's `updated:` field. When you recapture a screenshot, bump the lesson's `updated:` date AND add an entry to `WHAT-CHANGED.md` per D-39.

## Why a separate directory

Diagrams (`diagrams/`) are Mermaid sources that the renderer interprets — they're text and the freshness story is the lesson body itself. Screenshots are binary assets that decay independently (a UI change in Claude Code 1.x or Gemini CLI 0.x silently invalidates them). Keeping them in their own directory makes the per-lesson sub-folders greppable for staleness audits during D-39 phase close.

## Subdirectories

Sub-folders are created lazily per M3 lesson. The four M3 lesson sub-folders are pre-created with `.gitkeep` so git tracks them before the first PNG lands.
