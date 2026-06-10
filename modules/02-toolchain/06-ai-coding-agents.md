---
title: "AI coding agents"
module: "02-toolchain"
lesson_number: 06
est_minutes: 40
prereqs: ["05-git-and-github"]
updated: "2026-05-16"
deviations:
  - why-this-matters-extended
---

# AI coding agents

## Learning objective

By the end of this lesson, you will be able to name the two AI coding agents this course supports (Claude Code and Gemini CLI), know which one you picked in Module 0, and explain why an AI agent needs an ignore-file to keep secrets out of its reach.

## Why this matters

Picture a junior teammate who started yesterday. They know the language, they type fast, they're not afraid of work — but they don't know your project, your priorities, or your judgment yet, so before every task you brief them on what to do and what to skip. They go work; they come back with a result; you read what they did. Sometimes they nailed it; sometimes they "improved" something you didn't ask them to touch. This lesson introduces the two AI coding agents this course teaches as that junior teammate, installs the one you picked in Module 0, and puts the file-hygiene in place so the briefing-and-checking rhythm has somewhere safe to land.

## Core read

You want to delegate the writing.

Picture that junior teammate from a moment ago. They know the language, they type fast, they're not afraid of work — but they don't know your project, your priorities, or your judgment yet. Before each task you brief them: this is the file. This is what I want the output to look like. Here's what to skip. They go work; they come back with a result; you read what they did. Sometimes they nailed it. Sometimes they took an unexpected turn — they "improved" something you didn't ask them to touch, or "fixed" a thing that wasn't broken. Your job is to direct them and check their work, every time. That brief → check → re-brief rhythm IS the working day with an AI coding agent.

You can write code yourself — and by Module 4 you will be reading enough code to recognize when the agent is wrong. But writing it line by line, from scratch, is slow, and most of the code in a real project is the same sort of glue most projects need. An AI coding agent reads your files, drafts the changes, runs your tests when you have them, and shows you what changed. You stay in the seat of decisions — what should this do? did it work? what next? — and the teammate moves the keyboard.

The category is one you have already met. Module 0's welcome lesson named **AI coding agent** as a program that reads your project files, plans changes, and writes code on your behalf, guided by a conversation with you. This lesson names the two specific agents this course uses. The first is **Claude Code** (Anthropic's command-line AI coding agent; this course's recommended primary agent, [→ GLOSSARY](../../GLOSSARY.md#claude-code)). The second is **Gemini CLI** (Google's open-source command-line AI coding agent; this course's genuinely-free path, [→ GLOSSARY](../../GLOSSARY.md#gemini-cli)). Both run in the same terminal panel you met in Module 2 Lesson 2. Both read your files. Both edit your files. They differ in the cost ceiling and in some keystroke names — both important enough that the course teaches the durable loop on both surfaces.

You picked one of these agents back in Module 0's cost-path triage. You only need to install the one you picked. Module 3 will show both agents side by side for every step of the loop, but the loop you actually run is on YOUR chosen agent. The other agent's transcript is reference, not homework. The course is designed this way on purpose: the loop is durable; the keystrokes are not. If Anthropic changes Claude Code, or Google changes Gemini CLI, or a third agent appears next year, you will carry the loop forward and re-bind the keystrokes — not relearn the whole skill.

### Three things agents get wrong

Every new teammate has weak spots. With an AI coding agent, three patterns show up often enough that they have names — and naming them now, even briefly, means you will recognize the shape when it shows up later. The three you will see most: **hallucination** (the agent confidently writes something that doesn't exist, [→ GLOSSARY](../../GLOSSARY.md#hallucination)), **drift** (the agent loses the thread of what it agreed to do, [→ GLOSSARY](../../GLOSSARY.md#drift)), and **risk-blindness** (the agent suggests something dangerous with the same calm as fixing a typo, [→ GLOSSARY](../../GLOSSARY.md#risk-blindness)). You will not learn the smell-tests in this lesson — those land where they are useful, in Module 3 and Module 5. For now, just notice the names.

> **Heads up — you'll meet this again.** **Hallucination** is when the teammate confidently writes a function name, file path, or library that doesn't exist. The smell-test for catching it lives in M3 L3; for now, just notice the name.

> **Heads up — you'll meet this again.** **Drift** is when the teammate loses the thread mid-conversation. The smell-test lives in M3 L2; the recovery move is in M3 L4.

> **Heads up — you'll meet this again.** **Risk-blindness** is when the teammate suggests something dangerous with the same calm as fixing a typo. M5's watch-it-fail walkthroughs put you in the driver's seat.

These three are not the whole list of ways agents fail — they are the three that show up early enough, and often enough, to be worth a name on day one. Module 3 names a fourth (the context-window filling up) when it lands in the lesson where the smell-test fits.

Before the install commands, a small honesty banner.

> **Last verified:** 2026-05-14. These install commands worked on this date. Newer commands may exist; check `VERSIONS.md` for the most recent verified versions and `WHAT-CHANGED.md` for revisions.

The install commands depend on which agent you picked. **Run only the one for your path.**

For Claude Code on macOS or Linux:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

For Claude Code on Windows (run in PowerShell, not the regular Command Prompt):

```powershell
irm https://claude.ai/install.ps1 | iex
```

For Gemini CLI on any platform with Node 20 or newer:

```bash
npm install -g @google/gemini-cli
```

After install, you run the agent the same way you ran `node` or `git` in earlier lessons — by typing its name in the terminal. Claude Code starts with `claude` (optionally followed by what you want it to do). Gemini CLI starts with `gemini`. Both open a conversational session inside your terminal. When you type `claude` or `gemini`, you're at the briefing window — the cursor is waiting for your first instruction. Module 3 walks the first session step by step. For now, the entry point is the realization that the agent is a CLI tool — same kind of program as `npm`, `node`, `git` — runnable from the same terminal you opened in Lesson 2.

Inside the agent's session, you can type ordinary requests like "add today's date below the tagline" and the agent works on them. You can ALSO type **slash commands** (short keywords starting with `/` that control the session itself rather than asking the agent to do work, [→ GLOSSARY](../../GLOSSARY.md#slash-command)) — things for clearing the conversation, compressing the running history, or checking your spend. Even a teammate needs a "reset" button: the slash commands are how you tell the agent "forget what we just talked about" or "compress what we've said so far." `CHEATSHEET.md` already lists the ones this course teaches. Module 3 covers when to reach for each one; this lesson just names the category so the word "slash command" is not a surprise when it shows up.

AI agents need to READ your project files to be useful. Most of the time that is exactly what you want — they need to see `app/page.tsx` to edit it. Sometimes you do NOT want them to see something: a `.env` file with secret API keys, internal notes in a `.planning/` folder, the thousands of files inside `node_modules/` that confuse rather than help. That is what an ignore-file is for: a list of paths the agent should skip.

This course ships templates for this at the repository root in `thread-project-template/`. You will not copy them into a real project until Phase 3 — when you scaffold the thread project. Open the directory now in your IDE to see what is there:

- `.gitignore` — paths git ignores (`node_modules/`, `.env*`, build folders).
- `.claudeignore` — a community-pattern file for Claude Code. Heads up: as of May 2026, Claude Code does NOT natively respect this file yet; the comment header inside the file explains why we ship one anyway (it future-proofs against the day Claude Code adds native support, and it documents the convention).
- `.claude/settings.json` — the file Claude Code DOES respect today. It uses `permissions.deny` rules to hard-block reads of `.env`, `.planning/`, and other sensitive paths.
- `.geminiignore` — Gemini CLI's officially-supported ignore-file, written in the same shape as `.gitignore`.

Knowing these files exist now means Module 3's first session can assume the hygiene is in place when the thread project starts in Phase 3.

A quick cost-path reminder so the install above made sense. Path 1 (Claude Code Pro, around $17 to $20 a month) and Path 3 (Anthropic API, pay-per-token) both use Claude Code as the install. Path 2 (Gemini CLI free) uses Gemini CLI. Whichever path you picked in Module 0, install ONLY that one. `BUDGET.md` has the full breakdown if you need a refresher.

## Exercise

In your Codespace's terminal, install the agent you picked in Module 0 and read the ignore-file templates. Plan ten to fifteen minutes.

1. **Open the terminal.** Press `` Ctrl+` `` if the panel at the bottom is not already visible.
2. **Install the agent you picked in Module 0.** Run the command above that matches your path. If you picked Path 1 or Path 3, run the Claude Code install. If you picked Path 2, run the Gemini CLI install. Do not install both — only the one you will actually use.
3. **Confirm the install.** Run `claude --version` (Path 1 or Path 3) or `gemini --version` (Path 2). Each agent prints its version on a single line. If the command is "not found," scroll up in the install output for a message about needing to reload the terminal or update your `PATH`; close the terminal panel and reopen it, then try again.
4. **Open `thread-project-template/` in your IDE.** Click the folder in the file list on the left. Open the `README.md` and read it. Then open `.claudeignore`, `.geminiignore`, and `.claude/settings.json` side by side.
5. **Write one sentence per file** in a scratch note (any plain-text file or a sticky note): what does this file exclude, and why is it that way? You should be able to do this from the comments at the top of each file plus the `README.md`.
6. **Do NOT run the agent yet.** Module 3 Lesson 1 walks you through your first session deliberately. The goal of this lesson is install plus understanding the hygiene model — that is enough for one sitting.

## Checkpoint

You've got this if you can:

1. Name which agent you picked in Module 0 AND why (cost, friction tolerance, or both).
2. Explain in one sentence why an AI agent needs to be told which files to ignore.

## Going deeper

Optional, only if you're curious:

- **Other AI coding agents you may see named in industry.** Cursor is an IDE with a built-in agent. Cline and Continue are VS Code extensions. OpenCode is a community-maintained open-source option. Aider is the agent this course used before May 2026, when the project switched to Gemini CLI for the free path. All teach the same loop; only the keystrokes differ. Module 7 has a translation table for moving the loop between surfaces.
- **Claude Code's documentation** at `https://docs.claude.com/en/docs/claude-code/`. Skim the install and slash-command pages; do not try to absorb the configuration details — Module 3 lands the ones you actually need.
- **Gemini CLI's repository** at `https://github.com/google-gemini/gemini-cli`. The README has the install and first-run instructions; same advice — skim, do not memorize.

## Loop check

> **Loop check — intent.** Knowing the agent is a CLI tool — same kind of program as `git` or `npm`, runnable from the terminal — changes the *intent* you bring to Module 3's first session. You are not "using AI"; you are delegating WRITING to a program that reads your files and responds in your terminal. The loop step this lesson reinforces is **intent**: knowing the shape of the partner you are working with before you ask the first question.

## What you just did

You named the two AI coding agents this course supports. You installed the one you picked in Module 0. You read the four files of hygiene at `thread-project-template/` that will keep secrets out of the agent's reach when you scaffold the thread project in Phase 3. Module 3 (next module) teaches you what to actually DO with the agent — the loop, in depth, on both agents in parallel.

## Navigation

[← Previous: git and GitHub](./05-git-and-github.md)
[Next: Module 3 — The loop in depth →](../03-the-loop/README.md)
