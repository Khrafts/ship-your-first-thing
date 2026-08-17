# Learner-project starter kit

This directory is the canonical source of the agent-contract templates that ship with every learner-built project.

## What's in this directory

- `CLAUDE.md` and `AGENTS.md` — identical twins, read by different AI agents (Claude Code, Codex, etc.) before the first prompt. These files configure how agents should work with the learner on the project.
- `PLAN.md` — a starter structure for the learner's project plan. The agent and the learner fill it in together during Module 4's first lesson.
- Support dotfiles — `.gitignore`, `.claudeignore`, and `.claude/settings.json` — configuration that ships with the kit to help agents work well in the learner's environment.

## Important

Changes made in this directory must be synchronized to the `syft-starter` repo (the learner's launch template). That sync is a manual step done at cutover, not something this task performs.

`CLAUDE.md` and `AGENTS.md` are authored for agents and are exempt from the audience-vocabulary tiers, per `docs/COURSE-AUTHORING.md` Part 14. `PLAN.md` is learner-visible, so it stays in plain, jargon-free language even though the tiers don't formally apply to this directory.
