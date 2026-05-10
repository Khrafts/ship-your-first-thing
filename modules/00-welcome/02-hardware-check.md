---
title: "Hardware check"
module: "00-welcome"
lesson_number: 02
est_minutes: 10
prereqs: ["01-welcome"]
updated: "2026-05-09"
deviations: []
---

# Hardware check

## Learning objective

By the end of this lesson, you will know whether you're using GitHub Codespaces (recommended for V1) or a local install, and what either choice costs you in time and money.

## Why this matters

This is the cheapest decision you'll make in the course, and getting it wrong is the most expensive way to start. Codespaces removes a category of "my computer is set up wrong" problems that cost beginners days. Local installs are faster once they work, but the working part is itself a learning project. Pick once, in this lesson, before you create any accounts.

## Core read

Two paths.

**Path A: GitHub Codespaces (recommended for V1).**
A **Codespace** (a development environment GitHub runs for you on a remote machine; you reach it from your browser, but the files and commands live on a computer GitHub manages, [→ GLOSSARY](../../GLOSSARY.md#codespace)) lets you work on this course without installing anything on your laptop. You open it from your browser, edit text in a **code editor** (a program that lets you read and edit source files with niceties like syntax highlighting and integrated tools, [→ GLOSSARY](../../GLOSSARY.md#code-editor)) that looks and feels like VS Code, and use a panel where you type commands when later modules need them. Your laptop just needs a modern browser.

What this gets you:

- No local install for Module 0 or Module 1: those modules are written in plain text — specifically, **markdown** (a way of writing formatted documents using simple punctuation marks like `#` for headings and triple-backticks for code blocks, [→ GLOSSARY](../../GLOSSARY.md#markdown)). Open the repo in your browser; you're done.
- For Module 2 onward (toolchain, AI agents, the thread project), the Codespace already has the tools later modules will need pre-installed and configured.
- A consistent environment. The course is verified against the specific Codespace setup listed in `VERSIONS.md`. If it works for one learner, it works for all.

What it costs:

- The GitHub **free tier** (the portion of a paid service you can use at no cost — usually capped by hours, requests, or rate limits, [→ GLOSSARY](../../GLOSSARY.md#free-tier)) includes **120 core-hours per month** on a 2-core machine, which is **60 clock-hours per month**. Enough for a focused learner doing a few hours per week. Not enough for binge-watching every weekend.
- Default auto-stop is **30 minutes idle** — leave a tab open and walk away, the Codespace pauses on its own.
- Storage cap is **15 GB**. Delete unused Codespaces to free space.
- If you blow past 120 core-hours, GitHub bills $0.18 per core-hour. Most learners don't hit this.

**Path B: Local install (appendix path).**
If you already have a code editor you prefer (and you're comfortable troubleshooting your own environment), see the local install appendix in [`SETUP.md`](../../SETUP.md). That appendix names the tools Module 2+ teaches you to install — those tools come pre-installed in Codespaces but require manual setup if you go this route. Use this path if your free Codespace hours run out, or if you really prefer your own editor.

What it costs:

- Time. Setting up the Module 2+ toolchain on Windows is the rabbit hole this course's primary path was designed to avoid.
- Self-troubleshooting. If your local install hits a "can't find this program" error, that's your problem to solve, not the course's.

**Which to pick:**

- If you've never written production code: **Codespaces**. No exceptions.
- If you've already got a working development setup and you read code well enough to debug environment issues: either is fine.

If you pick Codespaces and later want to switch to local, you can — the course works the same way on both surfaces, and `SETUP.md` covers the switch. If you start on local and hit an environment issue you can't solve in 30 minutes, switch to Codespaces.

## Exercise

This is a 5-minute decision exercise. Answer these out loud or on paper:

1. Do I have a modern browser on a computer I'll be using consistently? *(If yes, Codespaces will work. If no, this course has a hard prerequisite you're missing.)*
2. Do I already have the Module 2+ toolchain installed? *(If no, pick Codespaces. If yes, you can pick either.)*
3. Have I ever spent more than 30 minutes troubleshooting why a development tool wouldn't run on my computer? *(If you don't know, pick Codespaces. If yes and the experience was frustrating, pick Codespaces. If yes and you enjoyed it, you can pick either.)*

Your answer to question 2 or 3 picks your path.

## Checkpoint

You've got this if you can:

- State your chosen path in one sentence.
- Name the free-tier cap on Codespaces (120 core-hours, 60 clock-hours on a 2-core machine).
- Find the local install appendix in `SETUP.md` without re-reading this lesson.

## What you just did

You picked your environment based on a 5-question triage instead of installing things and discovering the cost later. The next lesson does the same triage for AI tooling cost. The pattern — triage before install — is the most expensive bug-prevention you'll do all course.

## Navigation

[← Previous: Welcome](./01-welcome.md)
[Next: Cost-path triage →](./03-cost-path-triage.md)
