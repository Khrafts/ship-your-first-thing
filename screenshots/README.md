# Screenshots

Shared image assets for course lessons that need a visual moment prose can't carry. Today that means two kinds: the Module 4 build chunks, where the learner operates a dashboard screen themselves, and one example page each in Module 0 Lesson 6 and Module 3 Lesson 4, showing what the learner's own page might look like. Agent conversations are shown as prose panels in the lessons, never as screenshots. Lessons reference images via repo-relative paths from the lesson's location, e.g. `![alt text](../../screenshots/m4/02-sign-in/confirm-email-off.png)`.

## Convention

- **Path shape:** `screenshots/m<module>/<lesson-slug>/<descriptive-name>.png` where `<lesson-slug>` matches the lesson filename without `.md` (e.g., `02-sign-in`) and `<descriptive-name>` is a short kebab-case description of what the screenshot shows (e.g., `confirm-email-off`, `run-migration`).
- **Format:** PNG. Lossless. Resize to a reasonable display width (typically 1200–1600 px wide) before commit.
- **Alt text is mandatory.** Every `![...](...)` reference in a lesson MUST include descriptive alt text — both for accessibility AND because alt text is the LESSON-08 staleness mitigation if the screenshot itself rots faster than the surrounding prose.
- **Front-matter `updated:` ties the screenshot to a date.** A screenshot's freshness is governed by its lesson's `updated:` field. When you recapture a screenshot, bump the lesson's `updated:` date. Do not add an entry to `WHAT-CHANGED.md`: that log closed on 2026-08-22 (see the root `README.md` and `CONTRIBUTING.md`).

## Why a separate directory

Diagrams (`diagrams/`) are Mermaid sources that the renderer interprets — they're text and the freshness story is the lesson body itself. Screenshots are binary assets that decay independently (a dashboard redesign silently invalidates them). Keeping them in their own directory makes the per-lesson sub-folders greppable for staleness audits at phase close.

## Subdirectories

Sub-folders are created lazily, one per lesson that ships an image. A lesson that ships none has no
sub-folder. The sub-folders today:

- `m0/06-build-your-first-thing/` — an example checklist page (fictional sample items)
- `m3/04-steering-and-recovery/` — an example practice page as it looks after going back to the saved version (fictional name and date)
- `m4/02-sign-in/` — the Supabase Authentication screen (was `m4/01-sign-in/`)
- `m4/03-profile/` — the SQL Editor run, and its destructive-operation dialog (was `m4/02-profile/`)
- `m4/04-posts/` — the SQL Editor run for the posts chunk
- `m4/05-follow/` — the SQL Editor run for the follow chunk
- `m4/07-comments/` — the SQL Editor run for the comments chunk, and its destructive-operation dialog

The Module 4 sub-folders were renumbered with their lessons on 2026-08-17. `00-the-plan`, `01-hello-world-deploy`, `06-feed`, and `08-likes-and-go-live` ship no screenshots, so
they have no sub-folder.

## Two kinds of image, and what each is evidence of

- **Dashboard captures (`m4/`)** show a real screen the learner operates themselves. They are evidence of what that screen looked like on the lesson's `updated:` date.
- **Example pages (`m0/`, `m3/`)** are fictional demo pages built from the lesson text alone, with made-up sample data, and captured page-only in a browser. They are not a learner's session, not a maintainer's Desktop, and not evidence of any agent conversation, in Claude Code desktop, Codex, or anywhere else. Any lesson that shows one must caption it as one possible example and say the learner's page may differ.
