# Contributing

Thank you for considering contributing to Ship Your First Thing. This is an open-source course. The best contributions are usually small, factual, and aimed at making the next learner's experience smoother.

## What we want most

In rough priority order:

1. **`COMMON-ISSUES.md` entries** — you hit something that broke; you fixed it; the fix is reproducible. PR it.
2. **`WHAT-CHANGED.md` updates** — a tool released a new version that affects a lesson. Note it.
3. **Freshness fixes** — a screenshot, command, or version reference is stale. PR a correction.
4. **Vocab/glossary fills** — a lesson uses a term that isn't yet in `GLOSSARY.md`. PR an entry.
5. **Voice fixes** — you spotted tutorial fiction (the *frictionless-clicks* trope where reality has ten steps and bureaucracy) or filler (the *fast-paced-world* opener that says nothing). PR a rewrite.

## What we do NOT want yet

- New module content. The course's V1 scope is locked (see `.planning/REQUIREMENTS.md`). Out-of-scope feature ideas live in `.planning/ROADMAP.md` Out of Scope.
- Style/grammar bikeshedding. Fix factual errors, not voice opinions.
- New static-site-generator integrations. The course is plain markdown for V1; the deployed course platform at `https://shipyourfirstthing.com` is owned by Phase 01.1 and not contributor-facing.

## How to PR

1. Fork this repo.
2. Make your change on a topic branch (`git checkout -b common-issues/codespaces-port`).
3. Run any verification commands from the affected lesson's `## Checkpoint` section.
4. PR against `main`. Include in the PR description:
   - **What you changed** (one sentence)
   - **Why** (one sentence)
   - **Tested how** (the command you ran or the lesson section you re-read)

## Issue tags

- `freshness` — a tool, version, or upstream behavior changed and a lesson is now stale. The maintainer triages these in the quarterly smoke-test (below).
- `common-issues` — you hit a reproducible issue. Maintainer or you can convert this into a `COMMON-ISSUES.md` entry.
- `voice` — tutorial fiction or filler was spotted in a lesson. Editorial pass treats this as a hard fix.
- `vocab` — a term is used without a `GLOSSARY.md` anchor. Editorial pass.

## Quarterly smoke-test ritual

Phase 1 ships the *documented ritual* in CONTRIBUTING.md; Phase 5 OPS-02 ships the *first dry-run* of it. The ritual is the same in both phases — the formal OPS-02 acceptance is the dry-run, not the documentation.

Once per quarter, the maintainer (or any willing contributor) does this:

1. Open a fresh GitHub Codespace from `main`.
2. Walk through Module 0 → Module 4 Chunk 1 (the Auth chunk in the thread project; lands in Phase 3).
3. Note any deviation between what's written and what actually happens.
4. For each deviation, file an issue tagged `freshness` with:
   - The lesson path (e.g., `modules/01-mental-models/02-where-data-lives.md`)
   - What's stale
   - What you saw instead
5. The maintainer batches these into a revision pass; updates `VERSIONS.md`, `WHAT-CHANGED.md`, and the affected lessons.

The first dry-run of this ritual happens before Phase 5 closes.

## License of contributions

By contributing prose to this repo (lessons, glossary entries, common-issues entries, etc.) you agree to license your contribution under CC BY 4.0 (see `LICENSE-content`). By contributing code (TypeScript, scripts, configuration), you agree to MIT (see `LICENSE`). See `LICENSING.md` for the full split.

## Where to ask questions

Open a GitHub Discussion (or an issue tagged `question` until Discussions are enabled). The course is self-paced and async by design; do not expect same-day replies, but expect replies eventually.
