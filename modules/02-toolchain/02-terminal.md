---
title: "The terminal"
module: "02-toolchain"
lesson_number: 02
est_minutes: 30
prereqs: ["01-ide"]
updated: "2026-05-14"
deviations: []
---

# The terminal

## Learning objective

By the end of this lesson, you will be able to use five basic terminal commands (`pwd`, `ls`, `cd`, `clear`, `mkdir`) in your Codespace and describe what each one does.

## Why this matters

The terminal is where every later Module 2 lesson does its work. You've already seen the panel at the bottom of your Codespace — Module 0 toggled it open during the Codespaces walkthrough, and the previous lesson named it as one of the three things an IDE bundles into the same window. This lesson is where you stop just noticing the panel and start typing into it. Once five commands feel non-scary, the rest of the module's terminal-driven work is just five more of the same shape.

## Core read

You need to make the computer DO things.

Until now you've been clicking — files in the file list on the left, links in the browser, buttons in the editor. Clicking is fine when there's a button for what you want. The terminal is for when there isn't. You type a command; the computer runs it; the result prints back; the prompt appears again, ready for the next command. That's the entire surface.

A **command** is a single word the terminal recognizes, optionally followed by **arguments** — extra inputs that tell the command what to operate on. `cd modules` is the command `cd` with the argument `modules`. The terminal reads the line you typed, runs the command, prints any output, and shows the prompt again. The rhythm is always the same.

Here are the five commands worth knowing first. Each one is small, safe, and works the same way in your Codespace as it does on a Mac's Terminal app or any Linux machine. None of them change anything you can't undo.

**`pwd` — print working directory.** When you open the terminal in a Codespace, you're already inside some folder — by default, the root of the repository you opened the Codespace on. `pwd` tells you which folder. The output is a path like `/workspaces/ship-your-first-thing`. Useful when you've been moving around with `cd` and lost track of where you are.

**`ls` — list files.** Run `ls` and you'll see the files and folders in your current location. Folders usually appear in a different color from files, or are shown with a trailing `/`. You can also peek into a folder without entering it — `ls modules` lists what's inside `modules/` from wherever you are.

**`cd <directory>` — change directory.** `cd modules` moves you into the `modules/` folder. `cd ..` moves you one level up — the two dots mean "the folder that contains this one." `cd` with no argument returns you to your home directory. After every `cd`, running `pwd` confirms where you ended up.

**`clear` — clear the screen.** After a few commands, the terminal panel fills up with old output. `clear` wipes the visible text. Your command history is still there — press the up arrow to scroll through what you've typed before. `clear` is cosmetic; it doesn't delete any files or affect anything outside the panel.

**`mkdir <name>` — make a new directory.** `mkdir scratch` creates a new folder called `scratch` in whatever folder you're currently in. If a folder with that name already exists, `mkdir` errors out instead of overwriting — it's strictly for new folders.

Two things trip people up early. First: the terminal is **case-sensitive**. `ls Modules` is not the same as `ls modules`; in a Codespace the actual folder is lowercase, so the capitalized form returns an error. Second: spaces in arguments confuse the terminal unless you quote them. `cd My Folder` reads as "the `cd` command with the argument `My` and some extra noise called `Folder`." Quote it: `cd 'My Folder'`. We'll avoid spaces in folder names throughout this course, which sidesteps the problem.

One reflex to build early: do not paste `rm -rf` from a blog post. That command removes files and directories recursively without asking and without a recycle bin. Learners sometimes paste it to "clean up" after a bad experiment; in a Codespace with uncommitted work, that's how you lose an afternoon. Safer cleanup tools exist (we'll meet `rmdir` in the exercise — it only removes empty folders, so it refuses to delete anything that still contains your work). The AI coding agents introduced in lesson six can also suggest cleanup steps, and the rule there is: read what they suggest, type it in yourself, do not auto-approve the destructive ones.

Every later Module 2 lesson runs commands in this same panel. Lesson three has you check a tool's installed version. Lesson four has you install something. Lesson five has you check what files have changed and save a snapshot. Lesson six has you launch an AI coding agent from the same prompt. The pattern is always identical: a single word, optionally with arguments, followed by Enter, followed by output. You're already a long way to fluency just by knowing the rhythm.

## Exercise

Open your Codespace's terminal — press `` Ctrl+` `` if the panel at the bottom isn't already visible. Run the following commands in order. After each step, write one short note about what you saw.

1. `pwd` — write down the path it printed.
2. `ls` — write down two folder names you can see.
3. `cd modules` — move into the `modules/` folder. Then run `pwd` again to confirm you're inside it.
4. `ls` — now you're inside `modules/`; note one of the lesson-folder names you see.
5. `cd ..` — back up one level. Run `pwd` again; you should be back at the repository root.
6. `clear` — notice the screen wipes. Your command history is still in the up-arrow stack.
7. `mkdir scratch-test` — creates a new empty folder. Then `ls` to confirm it appears. Then `cd scratch-test`; then `pwd` to confirm you moved into it.
8. `cd ..` — back to the repository root. Then `rmdir scratch-test` — removes the empty folder. (`rmdir` only removes empty folders, which is why we created and then emptied this one. It's safer than `rm -rf` for cleanup.)

Save your notes in a scratch text file — right-click the file list on the left, choose `New File`, and name it `m2-l2-scratch.txt`. Do not commit it; it is just for your notes.

Budget fifteen to twenty minutes.

## Checkpoint

You've got this if you can:

1. Type `pwd` and explain what its output means in one sentence.
2. Move into the `modules/01-mental-models/` folder with one `cd` command and confirm you're there with `pwd`.

## Going deeper

Optional, only if you're curious:

- A Codespace runs on a Linux machine (specifically Ubuntu). Commands like `cat`, `head`, `tail`, `grep`, and `find` are all available — you'll meet them as needed in later modules.
- A non-technical overview of the Linux command line that doesn't drown you in detail: the first few sections of [The Linux Command Line](https://linuxcommand.org/tlcl.php) by William Shotts (free PDF). Optional.

## Loop check

> **Loop check — intent.** Module 2 is still pre-loop — the loop lands in Module 3 — but knowing the terminal is the surface for telling the computer to DO things changes the *intent* you'll bring to your first AI-coding session. When the agent says "run this command," you'll know that means typing it into this panel and pressing Enter, not clicking a button somewhere. The loop step this lesson reinforces is **intent**: knowing the shape of where work happens before you ask.

## What you just did

You typed your first commands into a Codespace's terminal and saw the computer talk back. You moved between folders, listed files, created a new folder, and cleaned it up. Five commands, all transferable to every later Module 2 lesson — and to every Module 3 and Module 4 AI-coding session, because every command an AI coding agent suggests is one you type into this same panel.

## Navigation

[← Previous: The IDE](./01-ide.md)
[Next: The runtime →](./03-runtime-node.md)
