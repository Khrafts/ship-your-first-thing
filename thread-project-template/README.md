# Learner-project agent contract (template)

This directory is the canonical wording of the agent contract and plan shape that every learner-built thread project carries. Nothing ships it; the learner dictates it (see below).

## What's in this directory

- `CLAUDE.md` and `AGENTS.md` — identical twins, read by different AI agents at the start of every conversation in the project folder: Claude Code reads `CLAUDE.md`; Codex reads `AGENTS.md`; OpenCode reads `AGENTS.md` first and falls back to `CLAUDE.md` (per their official docs, fetched 2026-09-08). They are the canonical wording of the house rules.
- `PLAN.md` — the shape of the learner's project plan: the eight features in build order, and the "how we work" lines.
- Support dotfiles — `.gitignore`, `.claudeignore`, and `.claude/settings.json` — configuration that helps agents work well in the learner's environment.

## How these reach a learner's project

Nothing copies this directory into a learner's folder, and no lesson links to it. The learner's agent never reads the course. The delivery path is the setup ask in `modules/04-thread-project/00-the-plan.md`: the learner says the eight features in order and the house rules in their own words, and tells the agent to write the rules into "the file you read on your own at the start of every conversation" — the ask no longer names the file; each agent knows its own (`CLAUDE.md` or `AGENTS.md`) — and the plan into the plan file. The lesson's read-back check and its fresh-conversation test are how the learner confirms the rules took.

So this directory and those asks must say the same things — but they are not copies of each other. Lesson 0 splits them since 2026-09-08: one `prompt` fence carries the house rules in the learner's own voice, a second carries the product brief with the eight features; `CLAUDE.md` / `AGENTS.md` carry the same rules written for the agent, one section each. The eight feature lines in `PLAN.md` are meant to match the product-brief ask's numbered list in order and meaning (the ask's lines are the shortened form of these as of 2026-09-08; the lesson is edited more often than this directory, so check rather than assume). The earlier delivery path — a launch repository synced from this directory — is retired with the sandbox; do not reintroduce it.

When you change a rule here, change the house-rules ask in Lesson 0 (and the `## How we work` lines in `PLAN.md`) in the same commit, and the other way round. The sync check, in either direction:

- Same eight features, same order, same meaning, in `PLAN.md` and the product-brief ask.
- Every rule the ask states has a section here: the learner isn't a programmer and is never handed anything to type or run; the agent chooses every tool and service; tools, services and accounts are set up only when a step first needs them, with the learner doing only what only they can do (creating an account in the browser, typing into a sign-in window the agent names, saying yes to spending), checked before going on, and a failed step stops with what was tried and what the learner can do next; a technical choice gets the simplest reversible default and a one-line report, and the learner is asked only about behaviour, cost, privacy and account access; any administrator password or account sign-in is typed into the installer or official sign-in window the agent names, never into the chat; plain words, never code, error text, or file names as an explanation; stop and ask before anything that can't be undone; run the agreed checks and show results before "done"; on "save this as a working version", save with a one-line note and report whether the copy went up and whether the live copy rebuilt; start the app and give the address when asked to see it; say "I'm stuck" with at most three options; read the plan and the rules at the start of every conversation and open by saying where we are.
- `CLAUDE.md` and `AGENTS.md` stay byte-identical (`cmp` them).

`CLAUDE.md` and `AGENTS.md` are authored for agents and are exempt from the audience-vocabulary tiers, per `docs/COURSE-AUTHORING.md` Part 14. `PLAN.md` is learner-visible, so it stays in plain, jargon-free language even though the tiers don't formally apply to this directory.
