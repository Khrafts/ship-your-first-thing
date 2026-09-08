# VERSIONS.md — Pinned tool versions

**Last verified:** 2026-09-08 — the newest row date below. Each row carries its own; this line reports the most recent of them, not a sweep of the whole file.
**Cadence:** Re-verified quarterly (see `CONTRIBUTING.md` for the smoke-test ritual). A row is past cadence once its own *Last verified* date is more than a quarter old; those rows carry **(past cadence)** in that cell. The marker means the pinned version has not been re-checked since its date — not that it is known to be wrong.

This is the single source of truth for every tool the course is verified against. When a tool releases a new version, the course is *not* automatically updated to it; the maintainer re-verifies the lesson flows against the new version, then updates this table.

## Agent apps

| App | Version | Path | Notes | Last verified |
|---|---|---|---|---|
| Claude Code desktop (the Claude desktop app's Code tab) | UI captured 2026-09-08 on macOS | Path 1 | Paid (Pro or above). Downloads for macOS, Windows, Linux (beta). Windows needs Git installed first for local sessions. Starts in Auto on Pro; the course sets Manual. Source: code.claude.com/docs/en/desktop-quickstart. | 2026-09-08 |
| Codex, inside the ChatGPT desktop app | UI captured 2026-09-08 on macOS | Path 2 | Included on every ChatGPT plan including Free; allowance measured per five-hour window. macOS, Windows, Linux. developers.openai.com/codex/app redirects to learn.chatgpt.com/docs/app, so the ChatGPT app is the download. Source: learn.chatgpt.com/docs/app, learn.chatgpt.com/codex/pricing. | 2026-09-08 |
| OpenCode desktop | UI captured 2026-09-08 on macOS | Path 3 | Open source; desktop labelled beta on opencode.ai. macOS (Apple Silicon, Intel), Windows x64, Linux .deb/.rpm. Free models "for a limited time", may learn from prompts; Go plan $10/month optional. Opens a folder with no Git present. Source: opencode.ai, opencode.ai/download, opencode.ai/docs/zen/, opencode.ai/docs/go/. | 2026-09-08 |
| ~~Gemini CLI~~ | retired 2026-08-12 | was Path 2 | Replaced by Codex inside the ChatGPT desktop app. | 2026-08-12 |

> **Note:** No app has a captured version *number* yet. "UI captured 2026-09-08" records the date the first-session screens in [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md) were captured from the real macOS app and the install claims were checked against the vendors' pages listed in each row. It is not a fresh-install trial and not a version string read off an About screen. Windows and Linux flows are taken from the vendors' download pages, not run.

## Thread project stack (the app you build in Module 4)

| Tool | Pinned version | Notes | Last verified |
|---|---|---|---|
| Next.js | 16.x (App Router) | Async `cookies()` / `headers()` / `params` is the breaking-change surface AI agents trained pre-2026 will get wrong | 2026-05-08 **(past cadence)** |
| TypeScript | 5.x | Used for thread project; AI agents use types as guardrails | 2026-05-08 **(past cadence)** |
| `@supabase/ssr` | ^0.5 | Use the new `sb_publishable_…` / `sb_secret_…` key naming from day one (legacy `anon`/`service_role` removed end-2026) | 2026-05-08 **(past cadence)** |
| Supabase dashboard (SQL Editor) | n/a (web dashboard) | Database changes are pasted by hand: the agent writes a SQL file, the learner runs it from the Supabase dashboard's SQL Editor, one query tab per chunk — no CLI, no `supabase/migrations/` directory | 2026-08-17 |
| Vercel dashboard | n/a (web dashboard) | Deploy target — the agent deploys by saving/pushing, Vercel rebuilds the live copy automatically; the learner's only touchpoint is the dashboard's settings screen, read once to check an environment variable such as `NEXT_PUBLIC_SUPABASE_URL` | 2026-08-17 |
| `zod` | ^3.x | Form validation for thread project | 2026-05-08 **(past cadence)** |

> **Note:** The rows marked **(past cadence)** were last verified 2026-05-08 and are overdue against the quarterly cadence above — nobody has re-verified them since that date. Their dates are left alone on purpose: moving a date forward would claim a check that never happened. What the table pins is still what Module 4's lessons were written against.

## Course platform stack (`site/`)

The course site lives in `site/` (deploys to Railway, where it will serve at `https://shipyourfirstthing.com`) and is not part of any lesson flow — these rows are for orientation only.

| Tool | Pinned version | Notes | Last verified |
|---|---|---|---|
| Next.js (site) | 16.2.9 (App Router) | Renders the course markdown; lessons stay canonical on github.com | 2026-06-11 |
| Drizzle ORM | ^0.45 | Postgres schema + migrations (run at container boot, never during build) | 2026-06-11 |
| Auth.js (`next-auth`) | 5.0.0-beta | Credentials provider; four core tables kept so OAuth/magic-link can be added without migration | 2026-06-11 |
| `pg` | ^8.21 | Postgres driver | 2026-06-11 |
| Railway | n/a (managed) | Deploy target — repo-root `railway.json` + `site/Dockerfile` | 2026-06-11 |

## How to update this table

1. When you re-verify a tool or app against a new version, change its row's `Last verified` cell to the new date — and if that date is now the newest in the file, update the `Last verified` line at the top to match. Drop the **(past cadence)** marker from that cell in the same edit, and add it to any row whose date has crossed a quarter since the last pass.
2. If the change affects lessons, also update affected lessons' front-matter `updated:` field.
3. If a tool or app is deprecated or replaced, do NOT delete the row — strike it through and link to its replacement, so historical reading still makes sense.
4. For the agent apps, only replace "UI captured YYYY-MM-DD" with an actual version number once a hands-on install captures it straight from the app's own About or Settings screen — an evidence pass, never a guess from a changelog.

See `CONTRIBUTING.md` for the quarterly smoke-test ritual that surfaces freshness issues.
