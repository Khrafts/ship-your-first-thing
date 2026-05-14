# Cheatsheet

**Purpose:** A one-page reference for the things you'll do most often. Common AI prompts, git basics, deploy commands, token discipline. The goal is "I forgot how to do X — let me grab it from one place." Lessons link here for re-discoverable commands.

**Structure:** Four sections. Each entry is a tight one-liner with a one-line "why" comment.

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

Lessons in this course teach **npm** (the default package manager for `create-next-app`; what Claude Code and Gemini CLI reach for by default). The deferred course platform (Phase 01.1, see ROADMAP) uses **pnpm** for security-cooling reasons. Both work. If you prefer pnpm for the thread project: `pnpm install` ↔ `npm install`; `pnpm add <pkg>` ↔ `npm install <pkg>`; `pnpm run dev` ↔ `npm run dev`. Lessons in M2/M3/M3.5 + the Phase 3 thread project use npm commands verbatim.
