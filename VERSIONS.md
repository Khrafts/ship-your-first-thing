# VERSIONS.md — Pinned tool versions

**Last verified:** 2026-08-15
**Cadence:** Re-verified quarterly (see `CONTRIBUTING.md` for the smoke-test ritual).

This is the single source of truth for every tool the course is verified against. When a tool releases a new version, the course is *not* automatically updated to it; the maintainer re-verifies the lesson flows against the new version, then updates this table and notes the change in `WHAT-CHANGED.md`.

## Agent apps

| App | Version | Path | Notes | Last verified |
|---|---|---|---|---|
| Claude Code desktop | verified working 2026-08-15 | Path 1 | The paid track's agent app, opening in its own window. Default Manual mode: it proposes a change and waits — nothing touches your files until you accept. | 2026-08-15 |
| ChatGPT desktop app (Codex) | verified working 2026-08-15 | Path 2 | The free track's agent — Codex is the mode you switch to next to the message box. Free "for a limited time" per OpenAI's own wording; the paid ChatGPT tiers keep it working the same way if that changes. | 2026-08-15 |
| ~~Gemini CLI~~ | retired 2026-08-12 | was Path 2 | Replaced as the free-track agent by Codex, inside the ChatGPT desktop app. See [Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md). | 2026-08-12 |

> **Note:** Neither app has a captured version *number* yet. "Verified working 2026-08-15" records the date the install flow and approval-prompt behavior were last confirmed against the vendors' own documentation and the install lessons ([Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md), [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md)), not a version string read off the app itself. A hands-on install pass still needs to capture the actual number from each app's own About or Settings screen.

> **Note:** Windows installs of Claude Code desktop need **git** installed separately — from [git-scm.com/downloads/win](https://git-scm.com/downloads/win) — before local sessions work, then the app needs a restart. Most Macs already have git. You never open git yourself; your agent operates it for you once it's installed. See [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md).

## Thread project stack (the app you build in Module 4)

| Tool | Pinned version | Notes | Last verified |
|---|---|---|---|
| Next.js | 16.x (App Router) | Async `cookies()` / `headers()` / `params` is the breaking-change surface AI agents trained pre-2026 will get wrong | 2026-05-08 |
| TypeScript | 5.x | Used for thread project; AI agents use types as guardrails | 2026-05-08 |
| `@supabase/ssr` | ^0.5 | Use the new `sb_publishable_…` / `sb_secret_…` key naming from day one (legacy `anon`/`service_role` removed end-2026) | 2026-05-08 |
| Supabase dashboard (SQL Editor) | n/a (web dashboard) | Database changes are pasted by hand: the agent writes a SQL file, the learner runs it from the Supabase dashboard's SQL Editor, one query tab per chunk — no CLI, no `supabase/migrations/` directory | 2026-08-17 |
| Vercel dashboard | n/a (web dashboard) | Deploy target — the agent deploys by saving/pushing, Vercel rebuilds the live copy automatically; the learner's only touchpoint is the dashboard's settings screen, read once to check an environment variable such as `NEXT_PUBLIC_SUPABASE_URL` | 2026-08-17 |
| `zod` | ^3.x | Form validation for thread project | 2026-05-08 |

## Course platform stack (`site/`)

The course site lives in `site/` (built; deploys to Railway, where it will serve at `https://shipyourfirstthing.com`) and is not part of any lesson flow — these rows are for orientation only. Auth is email+password credentials (not magic-link email). See `WHAT-CHANGED.md` (2026-06-11 entry) for the decision summary.

| Tool | Pinned version | Notes | Last verified |
|---|---|---|---|
| Next.js (site) | 16.2.9 (App Router) | Renders the course markdown; lessons stay canonical on github.com | 2026-06-11 |
| Drizzle ORM | ^0.45 | Postgres schema + migrations (run at container boot, never during build) | 2026-06-11 |
| Auth.js (`next-auth`) | 5.0.0-beta | Credentials provider; four core tables kept so OAuth/magic-link can be added without migration | 2026-06-11 |
| `pg` | ^8.21 | Postgres driver | 2026-06-11 |
| Railway | n/a (managed) | Deploy target — repo-root `railway.json` + `site/Dockerfile` | 2026-06-11 |

## How to update this table

1. When you re-verify a tool or app against a new version, change its row's `Last verified` cell to the new date.
2. If the change affects lessons, also update affected lessons' front-matter `updated:` field and add an entry to `WHAT-CHANGED.md`.
3. If a tool or app is deprecated or replaced, do NOT delete the row — strike it through and link to its replacement, so historical reading still makes sense.
4. For the two agent apps, only replace "verified working YYYY-MM-DD" with an actual version number once a hands-on install captures it straight from the app's own About or Settings screen — an evidence pass, never a guess from a changelog.

See `CONTRIBUTING.md` for the quarterly smoke-test ritual that surfaces freshness issues.
