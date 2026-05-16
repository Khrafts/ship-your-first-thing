---
title: "Reading a file tree"
module: "03.5-reading-code"
lesson_number: 01
est_minutes: 35
prereqs: ["04-steering-and-recovery"]
updated: "2026-05-16"
deviations: []
---

# Reading a file tree

## Learning objective

By the end of this lesson, you will be able to open the file tree of a Next.js project, name what each top-level folder is for at a glance, and identify one smell that suggests something is wrong — without writing or running any code.

## Why this matters

Picture walking into an unfamiliar office building. The lobby has a directory on the wall — "Reception: floor 1; Accounting: floor 2; Engineering: floor 3; Storage: basement." You haven't walked into any of those offices, but at a glance you can tell which floor you'd visit to fix an invoice. When an AI agent works on your project, it shows you which files it changed; without a sense of the SHAPE of the project, you're standing in the lobby of an unfamiliar building, with no way to tell whether the agent went to the right floor. This lesson teaches you to read the lobby directory — the file tree — in about thirty minutes, no walking-into-offices required.

## Core read

Picture the lobby directory again. You haven't walked into any of the offices on those floors — you only read the signage. The signage gives you the building's SHAPE: what each floor is for, which floor you'd visit to fix what, and which floor is just storage. Code projects publish the same kind of lobby directory. It is called a file tree.

A **file tree** (a one-line definition: the hierarchical structure of files and folders in a project, displayed as an indented list in your editor's left panel, [→ GLOSSARY](../../GLOSSARY.md#file-tree)) is the first thing you see when you open a project. At a glance, it tells you the project's shape — what kind of app it is, where the pages live, where the reusable pieces live, what is configuration and what is content. This lesson teaches reading the shape without going into the contents.

The point of the skill is detection, not explanation. You do NOT need to understand the syntax inside any file to spot that a Next.js project is laid out the way a Next.js project should be laid out — and you do not need to understand the syntax to spot that something looks off. That is the floor Module 3.5 holds throughout: pattern recognition first, deeper reading later (or never, for many of these patterns).

### The Next.js shape, walked through against the sample-app

Open `modules/03.5-reading-code/sample-app/` in your editor's file tree. (Right-click the folder, or click the chevron next to it to expand it.) Here is the layout you will see:

```
modules/03.5-reading-code/sample-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│       ├── InteractiveButton.tsx
│       ├── StaticHero.tsx
│       └── Footer.tsx
├── package.json
├── tsconfig.json
└── README.md
```

Walk through each entry in plain prose.

`app/` is the Next.js App Router folder. Pages live here; routing happens here. If a project has an `app/` folder, it is a Next.js app using the modern App Router shape (you will meet this shape again in Module 4 when you scaffold the thread project). Inside `app/`, the two files at the top — `layout.tsx` (a layout wrapper that sits around every page) and `page.tsx` (the home page) — are the minimum Next.js needs to render a site. Bigger projects have more pages inside `app/`, organized by URL path.

`app/components/` is a convention. It is not a special Next.js folder; it is where developers PUT reusable UI pieces — buttons, headers, footers. Three files live here in this scaffold: `InteractiveButton.tsx`, `StaticHero.tsx`, `Footer.tsx`. The names tell you what each one is (a button, a hero section, a footer). The `.tsx` extension says they are TypeScript files that include some HTML-like syntax. You do not have to know how `.tsx` differs from `.ts` to spot the shape — a file that ends in `.tsx` is "a UI piece written in TypeScript."

`package.json` is the dependency list from Module 2 Lesson 4. You read it. You do NOT run anything against this one — open `modules/03.5-reading-code/sample-app/README.md` and you will see the bold warning: "DO NOT run `npm install`." This scaffold is reference-only.

`tsconfig.json` is the TypeScript configuration. You will see it in every TypeScript project. You do not edit it; tooling (the TypeScript compiler) reads it. For a non-coder, the right relationship to `tsconfig.json` is: notice it exists, do not worry about it, leave it alone.

`README.md` is the project's own explainer. In this scaffold, it warns "DO NOT run `npm install`"; in your thread project (Phase 3), the README will describe how to run the project. Always open the README first when you encounter a new repo.

### The one smell to recognize

Here is one smell to recognize at a glance: **a Next.js project that has BOTH a `pages/` folder AND an `app/` folder at the top level.** Next.js has two routing systems — an older one (in a `pages/` folder) and a newer one (in an `app/` folder). Almost no real project intentionally uses both. If an AI agent has added a `pages/` folder to a project that already had `app/`, it has probably mixed up which routing system to use. The smell is just "both folders exist" — you do not need to know HOW they differ to spot that they should not both be there.

That is the whole detection: open the tree, look at the top level, see whether `pages/` and `app/` are both present. If they are, name it in your next ask to the agent.

### Why this skill is so powerful

Imagine you ask an agent in Phase 3 to add a sign-in button. The agent says it is done. You look at the file tree — and you see the agent created `pages/signin.tsx` instead of `app/signin/page.tsx`. WITHOUT reading any code, you have already caught the wrong-routing-system mistake. The fix is a steer: "Use the App Router shape — files go inside `app/`, not `pages/`." Module 3.5 Lesson 2 unpacks this "wrong file" detection more broadly.

The same shape-reading skill catches other agent missteps. An agent that creates a `src/` folder inside a project that uses `app/` at the root has duplicated the layout. An agent that drops a `db/migrations/` folder into a project with no database is pulling in scaffolding the project does not need. You will not always know what every folder is for — but you will start to notice when a NEW folder appears that does not fit the rest of the tree's shape.

### What you do NOT need to know yet

You do not need to know how the App Router differs from the older `pages/` system. You do not need to know what JSX is (the HTML-like syntax inside `.tsx` files). You do not need to know what `tsconfig.json` actually controls. The detection skill is purely about shape — the tree LOOKS like a Next.js app; the tree has a smell; a new folder showed up that does not match the rest. The deeper "why" is optional Module 7 reading; the shape is the floor.

This is the design of Module 3.5 in one sentence: detection first, explanation never required. If you ever want to go deeper, the agent itself is one ask away from explaining any of these conventions. The floor is just being able to recognize that something is worth asking about.

## Exercise

Plan twenty to twenty-five minutes for this exercise.

1. **Open the sample-app tree.** In your editor's file panel, navigate to `modules/03.5-reading-code/sample-app/` and expand the folder. Expand `app/` and `app/components/` so every file is visible.

2. **Create a scratch file.** Right-click in the file panel, choose `New File`, and name it `m3.5-l1-scratch.txt` somewhere outside the sample-app (the repo root or a personal scratch folder is fine — you do not want to modify the sample-app).

3. **Write your guesses.** Without opening any of the files, write ONE sentence per entry below explaining what you think it is for. React to the names and the position in the tree. There is no penalty for being wrong; the point is to calibrate how much the shape alone tells you.

   1. `app/` — your guess?
   2. `app/layout.tsx` — your guess?
   3. `app/page.tsx` — your guess?
   4. `app/components/` — your guess?
   5. `app/components/InteractiveButton.tsx` — your guess?
   6. `app/components/StaticHero.tsx` — your guess?
   7. `app/components/Footer.tsx` — your guess?
   8. `package.json` — your guess?
   9. `tsconfig.json` — your guess?
   10. `README.md` — your guess?

4. **Compare with the answer key below.** Mark each guess as "right shape" / "wrong shape" / "had no idea." This is calibration; nobody scores it.

**Answer key (do not peek before guessing):**

1. `app/` — the Next.js App Router folder; pages and routing live here.
2. `app/layout.tsx` — the root layout wrapper that every page sits inside.
3. `app/page.tsx` — the home page (URL `/`).
4. `app/components/` — a convention folder for reusable UI pieces.
5. `app/components/InteractiveButton.tsx` — a button component that responds to clicks (Lesson 4 unpacks why this one is treated differently from the others).
6. `app/components/StaticHero.tsx` — a hero section with no interactivity.
7. `app/components/Footer.tsx` — the footer (no interactivity).
8. `package.json` — the dependency list (Module 2 Lesson 4 covered this; the sample-app's README repeats the "do NOT run `npm install`" warning).
9. `tsconfig.json` — TypeScript configuration; tooling reads it; you do not edit it.
10. `README.md` — the scaffold's own explainer; warns "DO NOT run `npm install`."

If most of your guesses were "right shape," the floor is already there. If most were "had no idea," that is fine too — the answer key IS the lesson; reading through it once is the practice.

## Checkpoint

You've got this if you can:

1. Open any Next.js project's file tree and recognize the `app/` folder pattern.
2. Identify one smell (a `pages/` folder AND an `app/` folder both present at the top level) without reading any code.

## Going deeper

Optional, only if you are curious:

- **Module 7** ("where to go next") will eventually cover the App Router vs `pages/` routing split in depth, plus other Next.js conventions (`app/api/` for backend routes, dynamic routes like `app/[id]/page.tsx`, route groups). For now, recognizing the shape is the floor; the deeper explanations are optional Phase 3+ material.
- **The agent itself** can explain any convention you spot. "What is `tsconfig.json` for?" produces a usable answer in one ask. Reading the tree builds the queue of questions you might want to ask later — it does not require you to answer them yourself.

## Loop check

> **Loop check — evaluate.** Module 3.5 Lesson 1 sharpens the *evaluate* step of the agent loop with one more observation pattern — reading the file tree. When an agent says "I added the file," you now look at the tree first to confirm the file is in the right place. The loop step this lesson reinforces is **evaluate**.

## What you just did

You opened a Next.js file tree and named what each folder is for at a glance. You learned one smell (a `pages/` folder AND an `app/` folder both present) that catches a common AI agent mistake. You did all of this without reading a single line of code inside any of the files. The next lesson teaches a tighter version of this skill: spotting when the agent says it edited one file but the file panel shows it touched a different one.

## Navigation

[← Previous: Steering and recovery](../03-the-loop/04-steering-and-recovery.md)
[Next: Spotting wrong-file edits →](./02-spotting-wrong-file-edits.md)
