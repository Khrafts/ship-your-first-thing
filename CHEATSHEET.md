# Cheatsheet

**Purpose:** A one-page reference for the things you'll do most often. Common AI prompts, git basics, deploy commands, token discipline. The goal is "I forgot how to do X — let me grab it from one place." Lessons link here for re-discoverable commands.

**Structure:** Four sections. Each entry is a tight one-liner with a one-line "why" comment.

**Freshness:** If a command here doesn't work in your session, check [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) first — command names change over time, and the log records each change.

**How to contribute:** See `CONTRIBUTING.md`. When you author a lesson that introduces a re-usable command or prompt, add it here in the same PR. Keep entries terse — this is a reference, not a tutorial.

---

## AI prompts

```
Plan: I want to {feature}. The constraints are {list}. The current state is in {files}. Don't write code yet.
```
*Use to start a planning conversation. Module 3 covers the four-step prompt template (intent / constraints / context / ask) in depth.*

```
/clear
```
*Reset Claude Code or Gemini CLI conversation history. Use between unrelated tasks; cuts token cost on the next prompt.*

```
/context
```
*Show how much of your context window is in use (Claude Code). Watch this when you're on Path 2 (Gemini CLI free tier — use `/stats` there) or Path 3 (Anthropic API token-careful) — see `BUDGET.md`.*

```
/cost
```
*Show running session spend (Claude Code). Path 3 learners check this regularly.*

## AI agent install + hygiene

```bash
curl -fsSL https://claude.ai/install.sh | bash
```
*Install Claude Code on macOS or Linux. Re-check `VERSIONS.md` for the latest verified command.*

```powershell
irm https://claude.ai/install.ps1 | iex
```
*Install Claude Code on Windows (PowerShell).*

```bash
npm install -g @google/gemini-cli
```
*Install Gemini CLI on any platform with Node 20 or newer.*

```bash
claude --version
```
*Confirm Claude Code installed (Path 1 or Path 3).*

```bash
gemini --version
```
*Confirm Gemini CLI installed (Path 2).*

Hygiene templates ship at `thread-project-template/` — copy into a new project so AI agents skip secrets, planning notes, and dependency folders by default. See Module 2 Lesson 6.

## Terminal basics

```bash
pwd
```
*Print working directory — where am I? Run this when you've been `cd`-ing around and lost track.*

```bash
ls
```
*List files in the current directory. Add a path to peek into a folder without `cd`-ing into it: `ls modules`.*

```bash
cd <directory>
```
*Change into a directory. `cd ..` moves up one level; `cd` alone goes home.*

```bash
clear
```
*Wipe the visible terminal output. Cosmetic — your command history is still there (up arrow).*

```bash
mkdir <name>
```
*Make a new (empty) directory. Errors if the directory already exists.*

```bash
rmdir <name>
```
*Remove an EMPTY directory. Safer than `rm -rf` for cleanup; errors if the directory isn't empty.*

## Runtime + tooling

```bash
node --version
```
*Print the installed Node version. Sanity check after opening a fresh Codespace; this course pins Node 20.x LTS (see `VERSIONS.md`).*

```bash
node
```
*Open Node's REPL (interactive prompt). Type JavaScript expressions and see results; `.exit` to leave.*

```bash
node <file.js>
```
*Run a JavaScript file directly with Node. Module 4 onward, you'll mostly use `npm run dev` instead — the project scaffold wires this up for you.*

## Package management

```bash
npm --version
```
*Print the installed npm version. Sanity check after opening a fresh Codespace — npm and Node ship together but are separate tools, so their version numbers differ. This course pins npm 10.x (bundled with Node 20.x LTS, see `VERSIONS.md`).*

```bash
npm install
```
*Read `package.json` and download every dependency into `node_modules/`. The first command to run after cloning a fresh project that uses npm.*

```bash
npm install <package-name>
```
*Add a new package to `dependencies` AND download it. Example: `npm install date-fns`.*

```bash
npm uninstall <package-name>
```
*Remove a package from `dependencies` AND delete it from `node_modules/`.*

```bash
npm run dev
```
*Start the development server defined in `package.json`'s `scripts.dev`. Module 4 onward, you'll run this every day to see your app live in the browser preview.*

## Git basics

```bash
git status
```
*Show what's changed but not committed. Run before every commit.*

```bash
git add . && git commit -m "describe what changed"
```
*Stage and commit everything. Default rhythm in Codespaces.*

```bash
git push
```
*Send your commits to GitHub. Push frequently — Codespaces lose your work if you delete them without pushing first.*

```bash
git pull
```
*Fetch commits from a remote host (like GitHub) and merge them into your local copy. Codespaces usually run this automatically when you open them; outside Codespaces, run it at the start of each session if you commit from more than one machine.*

```bash
git reset --hard HEAD
```
*Throw away ALL uncommitted changes back to your last commit. Use after a bad AI session that broke things. Module 3 covers this as "the undo button when the AI breaks things."*

## Deploy commands

*Phases 3 onward. Phase 1 seeds the section structure; Phase 3 fills in `vercel`, `npx vercel --prod`, env-var checklist commands.*

## Token discipline

```
/clear
```
*See above — single biggest cost reducer.*

```
/compact
```
*Compress conversation history without losing the gist. Use when context is large but you don't want to lose continuity.*

```
/drop {filename}
```
*Remove a file from the AI's context. Use when the AI keeps editing the wrong file.*

```
/context
```
*Show how much of your context window is in use (Claude Code). Module 3 lesson covers when to act on the number.*

```
/cost
```
*Show running session spend (Claude Code). Path 3 learners check this regularly.*

```
/compress
```
*Gemini CLI's equivalent of Claude Code's `/compact` — compresses conversation history without losing the gist. Same purpose, different keystroke.*

```
/stats
```
*Gemini CLI's equivalent of Claude Code's `/context` — show conversation stats including token usage in the current session.*

## npm vs pnpm note (D-21)

Lessons in this course teach **npm** (the default package manager for `create-next-app`; what Claude Code and Gemini CLI reach for by default). The course platform at `site/` uses **pnpm** for security-cooling reasons. Both work. If you prefer pnpm for the thread project: `pnpm install` ↔ `npm install`; `pnpm add <pkg>` ↔ `npm install <pkg>`; `pnpm run dev` ↔ `npm run dev`. Lessons in M2/M3/M3.5 + the Phase 3 thread project use npm commands verbatim.
