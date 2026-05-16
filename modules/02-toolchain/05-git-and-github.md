---
title: "git and GitHub"
module: "02-toolchain"
lesson_number: 05
est_minutes: 45
prereqs: ["04-package-manager-npm"]
updated: "2026-05-14"
deviations: []
---

# git and GitHub

## Learning objective

By the end of this lesson, you will be able to run the four-command daily rhythm — `git status` → `git add` → `git commit -m "…"` → `git push` — in your Codespace and explain in one sentence what each command does.

## Why this matters

Module 1's deployment lesson named GitHub as the recipe binder — the place where the recipes (your code) live so Vercel can pick them up and turn them into a live site. That lesson named git briefly: the recipes get committed to git and pushed to GitHub. This lesson is where you actually do it. Every later module — the thread project in Phase 3, the deploy work in Phase 5, the bug-fixing work in Phase 6 — assumes you can save your work as a snapshot and send that snapshot to GitHub. Five minutes here saves you hours later.

## Core read

You need to save versions and share them.

You have been editing files. You have saved them with `Ctrl+S` (or `Cmd+S` on macOS). So in one sense, your work IS saved — the latest version sits on disk where the editor put it. But what about the version from an hour ago, before you tried something that did not work? What about giving someone else your changes? `Ctrl+S` does neither. It overwrites the last save with the current state, and the current state sits on one machine only. git handles both problems: it saves SNAPSHOTS (versions you can return to whenever you want) and it lets you SHARE those snapshots with other places — like GitHub.

Module 1's deployment lesson used the recipe-binder analogy. GitHub is where the recipes live so Vercel can pick them up. The way recipes GET into the binder is git. Picture it: you write a recipe. You decide it is ready to file. You write a one-line description of what is new ("added the salt step to the bread recipe"). You file it. The binder now has a new version of that recipe stamped with the description. Tomorrow, when you change the recipe again, you file ANOTHER version, with a fresh description ("clarified the rest time"). The binder remembers every version you ever filed; you can always flip back to last month's bread recipe if today's experiment goes sideways.

A category distinction worth holding clean. git is the TOOL — it runs on your computer (or in your Codespace) and tracks versions locally. GitHub is one HOSTING SERVICE for git — a place where you push your local versions so they live somewhere safe and other people can see them. Other hosts exist (GitLab, Bitbucket, Gitea); GitHub happens to be the most popular and the one this course uses. You can use git without GitHub (your versions sit on your own machine). You cannot really use GitHub without git (GitHub IS a host for git). So you will learn both at once.

The daily rhythm has four commands. Run them in this order, every time.

1. `git status` — show what has changed since the last save. Always start here. The output is the safest thing in git: it shows information and changes nothing.
2. `git add .` — STAGE the changes (mark them ready to save). The `.` means "every changed file in the current folder and below." A **commit** (one-line definition: a saved snapshot of staged changes with a one-line description, [→ GLOSSARY](../../GLOSSARY.md#commit)) needs files staged first; staging is the "I am ready to file these" step.
3. `git commit -m "describe what changed"` — save the staged changes as a commit. The `-m` flag attaches a one-line message describing what is new. After this, the snapshot is in your local git history; you can return to it later, even if you keep editing.
4. `git push` — **push** (one-line definition: send commits from your computer to a remote host, [→ GLOSSARY](../../GLOSSARY.md#push)) the commits to GitHub. After this, the snapshot is on GitHub's servers; anyone with access to the **repository** (one-line definition: a project's full history of commits, tracked by git, [→ GLOSSARY](../../GLOSSARY.md#repository)) can see it. Vercel watches the repository — when a new commit arrives, Vercel rebuilds and redeploys.

The four-step rhythm runs in the opposite direction too. When someone else has pushed commits you do not have yet — or when you have made commits on one machine and you are working on another — you need to pull their work down to your machine. **`git pull`** (one-line definition: fetch commits from a remote host and merge them into your local copy, [→ GLOSSARY](../../GLOSSARY.md#pull)) does that. The Codespace usually runs `git pull` automatically when you open it; outside Codespaces, you would run it at the start of each session.

Two more terms you will meet later, named briefly here so they are not surprising the first time they show up. A **branch** (one-line definition: an independent line of commits, used to try something without affecting the main history, [→ GLOSSARY](../../GLOSSARY.md#branch)) lets you experiment in isolation: you make some commits on a branch, decide they are good, and bring them back into the main line. The bringing-back step is **merge** (one-line definition: combine the commits from one branch into another, [→ GLOSSARY](../../GLOSSARY.md#merge)). This course's main line is called `main` (older projects sometimes call it `master`). For Module 2 and Module 3, you will work directly on `main` and not branch. Phase 3 may introduce branches if the planning conversation suggests they help.

Three confusions trip beginners and naming them now saves you time. **First, `git status` is the safest command in git.** It only shows information; it changes nothing. Run it constantly — before staging, after staging, after committing, after pushing. The output is short and surprisingly readable; if something looks wrong, git's response usually tells you what to do next. **Second, commit messages matter more than you think.** Future-you (or the AI coding agents you will meet in Module 3, which read git history) needs to know what each commit did. "update" is a useless message; "add login button to home page" is useful. Treat the one-line message as a note to your future self. **Third, `git push` after every commit is fine, but not required.** You can make five commits locally, then push once. The push is the "share" step; the commits are already saved locally after the commit step.

When things break, do not panic and do not reach for `git reset --hard`. The cheatsheet has `git reset --hard HEAD` listed because it exists, but it THROWS AWAY all uncommitted changes — only run it when you are sure you want to. The safer first move when stuck is to type `git status` and read the message. git is unusually good at explaining what state you are in and suggesting what to try next. Module 3 will teach how to ask an AI coding agent to help you out of a stuck state; for now, knowing that `git status` answers most "what just happened?" questions is enough.

The full set of git commands you will use daily is in `CHEATSHEET.md` under `## Git basics` — go look at it now in another tab. There are only four entries; you will recognize all four by the end of the exercise.

## Exercise

In your Codespace, save a quick scratch file and walk it through the daily rhythm. Plan fifteen to twenty minutes.

1. Open the terminal — press `` Ctrl+` `` if the panel at the bottom is not already visible. Type `git status` and press Enter. Most likely the output says something like "nothing to commit, working tree clean" (your repository is in a fresh state). If it shows files left over from earlier exercises, that is fine — git is just telling you the truth about what is on disk.
2. Create a new scratch file. Right-click the file list on the left, choose `New File`, and name it `m2-l5-scratch.txt`. Open it and type one line: `My first commit on YYYY-MM-DD` — fill in today's date.
3. Save the file (`Ctrl+S` or `Cmd+S`).
4. Back in the terminal, run `git status` again. Note that the new file now appears under "Untracked files." That label means git knows the file exists but is not yet tracking it.
5. Run `git add m2-l5-scratch.txt` (note the specific filename — not `git add .`). Run `git status` again. Note that the file has moved from "Untracked files" to "Changes to be committed." That is what staging does.
6. Run `git commit -m "Add m2-l5 scratch file"`. Read git's response — it confirms the commit by hash, by message, and by a one-line summary of what changed.
7. Run `git push`. If this is the first push from this Codespace, GitHub may ask you to authenticate via a one-click flow in the browser — follow the prompt. Once the push finishes, your commit is on GitHub.
8. Open your repository on github.com in another browser tab. Refresh the page. Your new file is there. Click it; the content matches what you typed in your Codespace.

Bonus (optional): back in the terminal, run `git log --oneline`. You will see a short list of recent commits, with yours at the top and the message you typed alongside.

## Checkpoint

You've got this if you can:

1. Run `git status` and explain in one sentence what the output is telling you.
2. Save a small change as a commit and push it to GitHub in under two minutes.

## Going deeper

Optional, only if you're curious:

- **The [Pro Git book](https://git-scm.com/book/en/v2), chapters 1 and 2.** Free online. The canonical short introduction; the rest of the book is reference material you do not need for this course.
- **[learngitbranching.js.org](https://learngitbranching.js.org/).** An interactive sandbox for feeling branches and merges without breaking a real repository. Skip until you actually need branches; for Module 2 and Module 3, the four-command rhythm is enough.
- **GitHub's own docs on the [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) flow.** Pull requests are how teams review each other's changes; you will not need them for the thread project (Phase 3 is a solo build) but you will see them once you start contributing to other people's repositories.

## Loop check

> **Loop check — intent.** The daily rhythm — status → add → commit → push — is the rhythm an AI coding agent in Module 3 will work alongside. When you ask the agent to "add a button to the home page," you will commit BEFORE the agent starts (a clean save you can return to), commit AFTER the agent finishes (the snapshot of the agent's work), and push when the page looks right. Knowing that rhythm is your *intent* for every Module 3 session: I am going to make small changes, commit each one, and push when the result is what I wanted. The loop step this lesson reinforces is **intent**: knowing how you will save and share work before you start asking for help.

## What you just did

You ran the daily git rhythm end-to-end: status → add → commit → push. You watched a file you created in your Codespace appear on github.com in a different browser tab a moment later. Every later module assumes you can do this without thinking about it. You can.

## Navigation

[← Previous: The package manager (npm)](./04-package-manager-npm.md)
[Next: AI coding agents →](./06-ai-coding-agents.md)
