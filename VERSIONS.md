# VERSIONS.md — Pinned tool versions

**Last verified:** 2026-05-14
**Cadence:** Re-verified quarterly (see `CONTRIBUTING.md` for the smoke-test ritual).

This is the single source of truth for every tool the course is verified against. When a tool releases a new version, the course is *not* automatically updated to it; the maintainer re-verifies the lesson flows against the new version, then updates this table and notes the change in `WHAT-CHANGED.md`.

## Required tools

| Tool | Pinned version | Purpose | Last verified |
|---|---|---|---|
| GitHub Codespaces (default image) | `mcr.microsoft.com/devcontainers/universal:2` | Quick-start environment | 2026-05-08 |
| Node.js | 20.x LTS | Runtime for the thread project; M2 L3 (`03-runtime-node.md`) teaches `node --version` verification | 2026-05-14 |
| npm | 10.x (bundled with Node 20) | Package manager; M2 L4 (`04-package-manager-npm.md`) teaches `npm install` / `npm run`; pnpm divergence noted in CHEATSHEET sidebar | 2026-05-14 |
| git | 2.40+ | Version control | 2026-05-08 |
| GitHub CLI (`gh`) | 2.50+ | Optional; convenient for Codespaces operations | 2026-05-08 |

## AI coding agents

| Tool | Pinned version | Path | Notes | Last verified |
|---|---|---|---|---|
| Claude Code | latest stable (auto-updates) | Path 1 / Path 3 | Treat keystrokes as ephemeral per the freshness model; M3 dual-agent transcripts (`modules/03-the-loop/01..04`) captured against this version on the Last-verified date | 2026-05-14 |
| Gemini CLI | latest stable (auto-updates) | Path 2 | M3 dual-agent transcripts captured against this version on the Last-verified date; ignore-file syntax = `.geminiignore` per D-38; install command `npm install -g @google/gemini-cli` requires Node 20+ | 2026-05-14 |

## Thread project stack (Phase 3 onward)

| Tool | Pinned version | Notes | Last verified |
|---|---|---|---|
| Next.js | 16.x (App Router) | Async `cookies()` / `headers()` / `params` is the breaking-change surface AI agents trained pre-2026 will get wrong | 2026-05-08 |
| TypeScript | 5.x | Used for thread project; AI agents use types as guardrails | 2026-05-08 |
| `@supabase/ssr` | ^0.5 | Use the new `sb_publishable_…` / `sb_secret_…` key naming from day one (legacy `anon`/`service_role` removed end-2026) | 2026-05-08 |
| Supabase CLI | latest stable | Migrations live under `supabase/migrations/` per Module 4 conventions | 2026-05-08 |
| Vercel CLI | latest stable | Deploy target | 2026-05-08 |
| `zod` | ^3.x | Form validation for thread project | 2026-05-08 |

## Course platform stack (Phase 01.1 onward — separate phase)

This row is for orientation only. Phase 01.1 owns the deployed course site at `https://shipyourfirstthing.com`. The pinned versions for the course-platform stack — Next.js + Postgres + Drizzle + Auth.js + Resend — will be added by Phase 01.1's plans.

## How to update this table

1. When you re-verify a tool against a new version, change its row's `Last verified` cell to the new date.
2. If the tool itself changed in a way that affects lessons, also update affected lessons' front-matter `updated:` field and add an entry to `WHAT-CHANGED.md`.
3. If a tool is deprecated or replaced, do NOT delete the row — strike it through and link to its replacement, so historical reading still makes sense.

See `CONTRIBUTING.md` for the quarterly smoke-test ritual that surfaces freshness issues.
