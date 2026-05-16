# thread-project template

Reference templates copied by Phase 3 Chunk 0 into the actual thread-project scaffold a learner will build. The files in this directory document the convention a learner's thread-project repo should follow from day one: which files to never commit (.gitignore), which paths AI agents should ignore (.claudeignore + .geminiignore + .claude/settings.json). Module 2 Lesson 6 (`modules/02-toolchain/06-ai-coding-agents.md`) walks through what each file does.

## What's in this directory

- `.gitignore` — paths git ignores: build artifacts, dependencies, secrets, OS cruft.
- `.claudeignore` — community-pattern file Claude Code does NOT natively support in May 2026 (see header comment in the file). Ships for two reasons: documents which paths a learner should NOT expose to Claude Code's context, and future-proofs against the day Claude Code adds native support (issue #29455 closed as duplicate; the feature is requested).
- `.geminiignore` — Gemini CLI's officially-supported ignore file (gitignore-style syntax).
- `.claude/settings.json` — Claude Code's officially-supported hard-enforcement mechanism via `permissions.deny` rules. This is what actually blocks reads in May 2026.

## How to use

When Phase 3 Chunk 0 scaffolds the thread project, copy every file in this directory into the new project's root (preserving the `.claude/` subdirectory). Then delete this template directory's contents from the new project — they should live at the project root, not inside `thread-project-template/`.

## Why two ignore files for Claude Code

Claude Code respects `.gitignore` by default. For HARD enforcement of additional paths (paths git tracks but you don't want Claude Code to read — internal planning docs in `.planning/`, cached node_modules), the canonical mechanism is `.claude/settings.json` with `permissions.deny` rules. That's what enforces today.

We also ship `.claudeignore` because (a) it matches the learner's mental model of "AI tools have their own ignore file, like git does", (b) community tooling and editors can pick it up, and (c) when Anthropic ships native `.claudeignore` support — the feature request is active — this file becomes the canonical mechanism. Cost of shipping both: nothing. Cost of shipping only one: a learner who reads about `.claudeignore` elsewhere and wonders where ours is.
