---
title: "The package manager (npm)"
module: "02-toolchain"
lesson_number: 04
est_minutes: 35
prereqs: ["03-runtime-node"]
updated: "2026-05-16"
deviations: []
---

# The package manager (npm)

## Learning objective

By the end of this lesson, you will be able to read a small `package.json` file and explain what each `dependencies` row means, and you will know that `npm install` downloads those dependencies into a folder called `node_modules/`.

## Why this matters

You live in an apartment with a corner store on speed-dial: text the list — milk, eggs, soap — and someone shows up at your door with a bag containing exactly those items. Real web apps work the same way; almost no project writes everything from scratch, so each one keeps a short list of "things I need" and lets a tool fetch them. This lesson teaches you to read that list (`package.json`) and recognize the bags the delivery brings (`node_modules/`).

## Core read

You don't want to rewrite what others have written.

Picture it again. You live in an apartment with a corner store on speed-dial. Need milk, eggs, soap? You text the list, somebody shows up with a bag. You didn't drive across town; you didn't manufacture the soap. You wrote a list; somebody else fetched. The list stays short and tidy; the bags pile up by the door. The tool that does the fetching for a software project is a **package manager** (a tool that downloads and tracks the code your project depends on, [→ GLOSSARY](../../GLOSSARY.md#package-manager)).

Imagine you're building a small web app and you need to show a date in a friendly format — "May 14, 2026" instead of `2026-05-14T07:35:12.000Z`. You could write the conversion yourself: split the string apart, look up the month name from the number, pad the day with a leading zero where needed, handle the edge cases. Or you could pull in a tiny library someone else has already written, tested against thousands of edge cases, and shared with the world. The library is one function call away. The second path is faster, more correct, and easier to maintain. That's the everyday motivation behind every package manager: someone else has already solved the small problem, and reaching for their solution is the right move.

The thing that does the pulling-in for JavaScript code is **npm** (the standard package manager for JavaScript, bundled with Node, [→ GLOSSARY](../../GLOSSARY.md#npm)) — npm is the delivery service. The corner store itself is the npm registry, a central server with millions of items on the shelves, run at `registry.npmjs.org`. What npm actually moves around is a **package** (a bundled bit of reusable code, published to a registry so any project can pull it in, [→ GLOSSARY](../../GLOSSARY.md#package)) — a unit of code with a name, a version, and the code itself, ready to be installed. When your project says "I need this package to run," that named package is called a **dependency** (a package your project NEEDS to run, declared in `package.json`, [→ GLOSSARY](../../GLOSSARY.md#dependency)). Four words, one story: a package manager (npm) installs packages, and the packages your project lists as needed are its dependencies.

This file is the shopping list. Every JavaScript project that uses npm has a file called `package.json` at its root. The file lists the project's name, its own version, and the packages it depends on. Here's a real example from a tiny project this course ships in Module 3.5:

```json
{
  "name": "sample-app",
  "version": "0.0.1",
  "private": true,
  "description": "Reference scaffold for Module 3.5. DO NOT run npm install — see README.md.",
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.6",
    "react-dom": "19.2.6"
  }
}
```

Walk through the fields one by one. `name` is the project's name — `sample-app` is a deliberately boring placeholder. `version` is the project's own version (`0.0.1` is the convention for "first draft, nothing released yet"). `private: true` says "this project is not meant to be published to the npm registry; it's just for me." `description` is a one-line description, and this one warns Module 3.5 readers in advance not to install it (more on that warning below). The interesting field is `dependencies` — these are the items on the list. Three rows, each `package-name: version`. This project says "I need the package `next` at version 16.2.6, the package `react` at version 19.2.6, and the package `react-dom` at version 19.2.6." Those three are everything this project needs to run.

When you run `npm install` against a project, npm reads `package.json` and downloads exactly the packages listed in `dependencies` — plus every package those packages themselves depend on (and every package those packages depend on, and so on) — into a folder called `node_modules/` at the project root. The `node_modules/` folder is where the downloaded code actually lives once it lands on your machine. Picture the bags piling up by your front door after the delivery — that's `node_modules/`. Huge in volume; not something you carry with you.

A mental-model paragraph that's worth holding. Think of `package.json` as your project's shopping list: short, tidy, easy to read at a glance. Think of `node_modules/` as the pantry — where the groceries actually sit after npm has gone to the store and brought them home. The pantry can be huge (hundreds of megabytes; thousands of files), but the shopping list stays short. The shopping list gets tracked by the version-control tool you'll meet in the next lesson; the pantry doesn't — `node_modules/` shows up in nearly every project's ignore list. If you delete `node_modules/` and re-run `npm install`, npm rebuilds the pantry from the shopping list. That whole loop — list, install, rebuild — is the package manager's job.

Three npm commands you'll meet as you read project setup docs. You don't need to run any of these today; the exercise below is reading-only.

- `npm install` — with no arguments, reads `package.json` and downloads every dependency into `node_modules/`. The first command you run after cloning a fresh project that uses npm.
- `npm install <package-name>` — adds a new package to `dependencies` AND downloads it. Example shape: `npm install date-fns`. The library shows up in `node_modules/` AND a new row appears in `package.json`.
- `npm uninstall <package-name>` — removes the package's row from `dependencies` AND deletes it from `node_modules/`.

> **Note:** Do not run `npm install` against this course's `modules/03.5-reading-code/sample-app/` directory. The scaffold is read-only — Module 3.5's lessons ask you to OPEN and READ the files in there, not run them. If you accidentally run `npm install` there, no harm comes to your work, but the directory will fill with a fresh `node_modules/` and you'll need to delete that folder by hand to get back to a clean state. The first real `npm install` you'll run in this course is Phase 3, against a brand-new project you scaffold from scratch.

Where does `npm install date-fns` actually GET `date-fns` from? A central server called the npm registry, run at `registry.npmjs.org`. Anyone can publish a package to the registry; anyone can install one. The registry is also the source the AI coding agents you'll meet in the next two Module 2 lessons reach for when they suggest "I'll add the X package." You don't need to publish anything today — this course never asks you to publish to the registry — but knowing the registry exists explains where the downloads come from.

A practical safety note while we're on the subject of the registry. The downloading-and-running step in `npm install` is not zero-risk: a package can include setup code that runs the moment it's installed, and over the last few years that has occasionally been exploited by attackers who manage to publish or compromise a package. This course's lessons keep you on READING `package.json` files until the thread project in Phase 3, where the install you run is against a brand-new project with a tiny dependency list. The principle is: read the shopping list before you let anyone run to the store with it.

Two common confusions worth heading off. **First, npm and Node ship together but they're different tools.** Running `npm --version` and `node --version` returns different version numbers because they're separate programs that happen to install in the same step. Lesson three named Node; this lesson names npm. Same install, two tools. **Second, there's another package manager called pnpm** — faster, more efficient with disk space, otherwise the same shape. The lessons in this course use npm because that's what most AI coding agents reach for by default and what the project scaffold you'll build the thread project from defaults to. The CHEATSHEET has a one-line `npm ↔ pnpm` translation table at the bottom of the file if you've used pnpm before and want the mapping. Both work; either is a defensible choice for a real project.

## Exercise

Open `modules/03.5-reading-code/sample-app/package.json` in your code editor. (You can find it in the file panel on the left: expand `modules`, then `03.5-reading-code`, then `sample-app`, then click `package.json`.) Plan ten to fifteen minutes. **Don't run any commands.** This is a reading exercise — just open the file and look.

1. What's the project's `name` and its own `version`?
2. What's the `description` field warning you?
3. How many entries does the `dependencies` block have? (Count them.)
4. For each dependency, write down the package name and the pinned version.
5. (Thinking question, no need to write any code.) If a later lesson wanted this project to use a date-formatting library called `date-fns` at version `3.6.0`, what change would the lesson author make to `package.json`? Describe the change in one sentence. (Hint: one new row in the `dependencies` block.)

Save your answers to a scratch text file — right-click the file panel on the left, choose `New File`, and name it `m2-l4-scratch.txt`. Five short answers is enough. Confirm each answer by re-reading the `package.json` — every answer is a line you can point at in the file.

## Checkpoint

You've got this if you can:

1. Point at any line in a `package.json` and say whether it's a dependency, a metadata field, or something else.
2. Explain in one sentence what `node_modules/` is and why it's almost always kept out of version control.

## Going deeper

Optional, only if you're curious:

- **`package-lock.json`** is a sibling file you'll see in real projects (pnpm has the equivalent `pnpm-lock.yaml`). It records the EXACT version of every package — including the dependencies of dependencies — so that an `npm install` on someone else's machine produces the same result as on yours. You don't read it directly; npm writes and updates it for you. Knowing it exists is enough for now.
- **CHEATSHEET sidebar — `## npm vs pnpm note`** at the bottom of `CHEATSHEET.md` lays out the one-line translation between npm and pnpm commands for the cases where you've used pnpm before or want to try it on a future project. The thread project you build in Phase 3 uses npm; the cheatsheet has you covered if you want to switch.
- **The npm registry website** (`https://www.npmjs.com/`) lets you search for a package by name and see who maintains it, how popular it is, and when it was last updated — useful when an AI coding agent suggests a package and you want to glance at it before installing.

## Loop check

> **Loop check — intent.** Knowing that npm pulls in code other people wrote — that almost no project is built from scratch — changes the *intent* you'll bring to your asks in Module 3. When an AI coding agent says "I'll add the `date-fns` package," you'll know that's a `package.json` edit plus an `npm install`, not magic. The loop step this lesson reinforces is **intent**: knowing the shape of how a project is assembled before you ask for changes.

## What you just did

You learned that almost no software is built from scratch — every project leans on packages other people wrote and published. You read a real `package.json` line by line and understood every field. You named npm as the tool that bridges the shopping list (`package.json`) and the pantry (`node_modules/`). When you scaffold the thread project in Phase 3, the first `package.json` you'll see is the one the scaffold writes for you — and you'll already know how to read it.

## Navigation

[← Previous: The runtime (Node)](./03-runtime-node.md)
[Next: git and GitHub →](./05-git-and-github.md)
