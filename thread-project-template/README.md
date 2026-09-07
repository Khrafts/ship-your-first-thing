# Learner-project agent contract (template)

This directory is the canonical wording of the agent contract and plan shape that every learner-built thread project carries. Nothing ships it; the learner dictates it (see below).

## What's in this directory

- `CLAUDE.md` and `AGENTS.md` — identical twins, read by different AI agents (Claude Code reads `CLAUDE.md`, Codex reads `AGENTS.md`) at the start of every conversation in the project folder. They are the canonical wording of the house rules.
- `PLAN.md` — the shape of the learner's project plan: the eight features in build order, and the "how we work" lines.
- Support dotfiles — `.gitignore`, `.claudeignore`, and `.claude/settings.json` — configuration that helps agents work well in the learner's environment.

## How these reach a learner's project

Nothing copies this directory into a learner's folder, and no lesson links to it. The learner's agent never reads the course. The delivery path is the setup ask in `modules/04-thread-project/00-the-plan.md`: the learner says the eight features in order and the house rules in their own words, and tells the agent to write the rules into the file it reads on its own (`CLAUDE.md` or `AGENTS.md`, named in the ask) and the plan into the plan file. The lesson's read-back check and its fresh-conversation test are how the learner confirms the rules took.

So this directory and that ask must say the same things. When you change a rule here, change the ask in Lesson 0 (and the `## How we work` lines in `PLAN.md`) in the same commit, and the other way round. The eight feature lines in `PLAN.md` are the ones the ask enumerates, word for word. The earlier delivery path — a launch repository synced from this directory — is retired with the sandbox; do not reintroduce it.

`CLAUDE.md` and `AGENTS.md` are authored for agents and are exempt from the audience-vocabulary tiers, per `docs/COURSE-AUTHORING.md` Part 14. `PLAN.md` is learner-visible, so it stays in plain, jargon-free language even though the tiers don't formally apply to this directory.
