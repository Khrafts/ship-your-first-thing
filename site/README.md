# Ship Your First Thing — course platform

The web platform for the course in this repository. It renders the same
markdown that lives in `../modules/` (the canonical source — every lesson must
keep working on github.com), and adds the things a flat repo can't: accounts,
per-lesson progress, a learner dashboard, and cohort schedules.

Stack: Next.js (App Router) + Postgres + Drizzle + Auth.js — deliberately
different from the Supabase stack the course itself teaches (see the footer
on any page for why).

## Run it locally

Requires Node 22+ and pnpm 11 (`corepack enable`). No database server is
needed: without a `DATABASE_URL` the app uses an embedded PGlite database
under `.data/`.

```bash
cd site
pnpm install
pnpm db:migrate   # create tables
pnpm db:seed      # demo cohort + schedule
pnpm dev          # http://localhost:3000
```

## Tests

```bash
pnpm test       # vitest — content pipeline contract tests
pnpm e2e:full   # production build + Playwright end-to-end suite
```

The e2e suite builds the app, migrates and seeds a throwaway PGlite database,
and walks sign-up, lesson rendering (including Mermaid inside collapsed
`<details>`), progress tracking, and cohort join flows.

## Environment

See `.env.example`. In production set `DATABASE_URL` (Postgres) and a real
`AUTH_SECRET`; `AUTH_TRUST_HOST=true` is required behind a proxy.

## Deploy (Railway)

The repo-root `railway.json` builds `site/Dockerfile` with the repo root as
context so the course markdown ships inside the image. The container start
command runs migrations, seeds an initial cohort if the database is empty,
then starts the server on `$PORT`. Provision a Railway Postgres service and
reference its `DATABASE_URL` in the app service variables.

## Layout

- `src/lib/content/` — reads and renders the course markdown (frontmatter,
  GFM, Mermaid fences kept for client-side rendering, `../../GLOSSARY.md#x`
  links rewritten to `/glossary#x`)
- `src/db/` — Drizzle schema and driver selection (Postgres or PGlite)
- `src/lib/actions/` — server actions: auth, progress toggling, cohort join
- `src/app/` — routes: home, `/modules/*`, `/glossary`, `/docs/*`,
  `/dashboard`, `/cohorts`, `/signin`, `/signup`
- `e2e/` — Playwright suite
