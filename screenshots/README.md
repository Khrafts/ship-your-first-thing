# Screenshots

Shared image assets for course lessons that need a visual moment prose can't carry — today that means the Module 4 build chunks, where the learner operates a dashboard screen themselves. Module 3 ships no screenshots: its reshoot (2026-08-16) shows each ask as a prose conversation panel instead, once per agent app. Lessons reference images via repo-relative paths from the lesson's location, e.g. `![alt text](../../screenshots/m4/02-sign-in/confirm-email-off.png)`.

## Convention

- **Path shape:** `screenshots/m<module>/<lesson-slug>/<descriptive-name>.png` where `<lesson-slug>` matches the lesson filename without `.md` (e.g., `02-sign-in`) and `<descriptive-name>` is a short kebab-case description of what the screenshot shows (e.g., `confirm-email-off`, `run-migration`).
- **Format:** PNG. Lossless. Resize to a reasonable display width (typically 1200–1600 px wide) before commit.
- **Alt text is mandatory.** Every `![...](...)` reference in a lesson MUST include descriptive alt text — both for accessibility AND because alt text is the LESSON-08 staleness mitigation if the screenshot itself rots faster than the surrounding prose.
- **Front-matter `updated:` ties the screenshot to a date.** A screenshot's freshness is governed by its lesson's `updated:` field. When you recapture a screenshot, bump the lesson's `updated:` date AND add a thin entry to `WHAT-CHANGED.md` (one batched entry per PR — see `CONTRIBUTING.md` § Adding a WHAT-CHANGED entry).

## Why a separate directory

Diagrams (`diagrams/`) are Mermaid sources that the renderer interprets — they're text and the freshness story is the lesson body itself. Screenshots are binary assets that decay independently (a dashboard redesign silently invalidates them). Keeping them in their own directory makes the per-lesson sub-folders greppable for staleness audits at phase close.

## Subdirectories

Sub-folders are created lazily, one per lesson that ships an image. A lesson that ships none has no
sub-folder. The Module 4 sub-folders today, renumbered with their lessons on 2026-08-17:

- `m4/02-sign-in/` — the Supabase Authentication screen (was `m4/01-sign-in/`)
- `m4/03-profile/` — the SQL Editor run, and its destructive-operation dialog (was `m4/02-profile/`)
- `m4/04-posts/` — the SQL Editor run for the posts chunk
- `m4/05-follow/` — the SQL Editor run for the follow chunk
- `m4/07-comments/` — the SQL Editor run for the comments chunk, and its destructive-operation dialog

`00-the-plan`, `01-hello-world-deploy`, `06-feed`, and `08-likes-and-go-live` ship no screenshots, so
they have no sub-folder.
