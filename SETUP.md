# Setup

## Pinned versions

This course is verified against the tool versions in [`VERSIONS.md`](./VERSIONS.md). `VERSIONS.md` is the source of truth and is updated on revision day. If a step on this page doesn't match what you see (button names, click paths, free-tier numbers), check [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) first — the page may have shifted since the verification date in `VERSIONS.md`.

## Required accounts

- **GitHub** — needed to host the repo, run Codespaces, and (later) deploy.

Your cost-path triage in Module 0 will tell you which AI-coding agent account to create — Anthropic for Claude Code Pro or the API, Google for Gemini CLI. See [`BUDGET.md`](./BUDGET.md) for the path comparison; do not create AI accounts until you've finished the cost-path lesson.

## Codespaces flow

You read the course in your browser (here on GitHub or on the course site); you do your work in your own copy of a small starter workspace. Set the workspace up once:

1. Make your own copy of the starter: go to [github.com/Khrafts/syft-starter](https://github.com/Khrafts/syft-starter), click `Use this template` → `Create a new repository`, and name it anything you like (`my-first-thing` works). This copy is yours, so your work can save into it.
2. On your new repository, click `Code` → `Codespaces` → `Create codespace on main`. Wait ~60–90 seconds for it to boot. Use the default 2-core machine type to stay inside GitHub's free monthly core-hours.
3. The Codespace opens VS Code in the browser, showing your workspace — `index.html`, a `sample-app` folder, and the file hygiene Module 2 covers. Keep the course open in a separate tab and start with `modules/00-welcome/README.md`.
4. Use `Ctrl+S` (or `Cmd+S` on Mac) to save edits as you work; commit and push your work back to your repository with the Source Control panel or the terminal.
5. When you're done for the day, close the browser tab. The Codespace will auto-stop after 30 minutes idle.

## Local install (appendix)

If you already have Node, git, and a code editor you prefer, see the local install steps below. Codespaces is the primary on-ramp for V1; local install is supported but not the default path.

### Local install steps

1. Make your own copy of the starter workspace at [github.com/Khrafts/syft-starter](https://github.com/Khrafts/syft-starter) (`Use this template` → `Create a new repository`), then clone your copy: `git clone <your-repo-url>`.
2. Confirm Node is at version 20 or higher: `node --version`.
3. Open the workspace folder in your editor of choice.
4. That's it for Module 0 and Module 1 — they are pure markdown you read in your browser. Module 2 and beyond add tool requirements (terminal, package manager, git CLI, AI coding agent), each introduced in the lesson where it first matters.

## Codespaces budget reality

GitHub Free includes 120 core-hours per month on a 2-core machine — that's 60 clock-hours of active editing time. The default auto-stop is 30 minutes idle, and the storage cap is 15 GB. Push your work to GitHub frequently so you don't lose anything if you delete a Codespace to free space. If you start to bump into either limit, the cost-path lesson in Module 0 explains the upgrade math.

## What's next

Open [`modules/00-welcome/README.md`](./modules/00-welcome/README.md) to begin Module 0.
