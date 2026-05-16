---
title: "Error message to file pointer"
module: "03.5-reading-code"
lesson_number: 03
est_minutes: 35
prereqs: ["02-spotting-wrong-file-edits"]
updated: "2026-05-14"
deviations: []
---

# Error message to file pointer

## Learning objective

By the end of this lesson, you will be able to look at any error message and find the file path plus line number of YOUR project's file that the error points at, without reading the full stack trace.

## Why this matters

When an AI agent's code fails — a typo, a missing import, a missing directive — your browser or terminal shows an error. The full error is long: dozens of lines, most of them inside libraries you did not write. The skill of this lesson is finding the ONE line that points back at your code, opening that file, and pasting the error back to the agent as a steer. Module 3 Lesson 4 covered feeding errors back to the agent generally; this lesson tightens the "find the file pointer first" step that makes the steer precise.

## Core read

When code fails, you get an error message. A long one. Most of the lines are a **stack trace** (a one-line definition: a list of every function call leading to an error, top to bottom — the most recent call at the top, [→ GLOSSARY](../../GLOSSARY.md#stack-trace)). Most of those calls are inside libraries — React, Next.js, the browser itself — that you did not write. The skill at this lesson's floor is NOT reading every line. It is finding the ONE LINE that points at YOUR file.

### The "first line that mentions YOUR file" rule

Errors have **error message anatomy** (a one-line definition: the structure of an error message — typically a description on top followed by a stack trace with file paths and line numbers, [→ GLOSSARY](../../GLOSSARY.md#error-message-anatomy)) that is mostly the same across runtimes and libraries. The pattern:

1. **Top of the message:** the error description (for example, `TypeError: Cannot read properties of undefined`).
2. **Stack trace, line by line:** each line mentions a function name plus a file path plus a line number.
3. **Most lines are library code** — paths starting with `node_modules/` (or `react-dom`, `next`, similar). Skip these.
4. **One or two lines mention YOUR files** — typically paths like `./app/...tsx` or `./app/components/...tsx`. THIS is the file pointer.

You open the file at the line number, AND you paste the entire error message back to your agent as a steer. The agent does the actual fix; you just got it to the right file.

### Three worked examples, against the sample-app

Here are three error messages you might see while debugging the sample-app (or any Next.js project). For each, find the first line that mentions one of YOUR files.

**Error 1 (runtime error):**

```
TypeError: Cannot read properties of undefined (reading 'name')
    at InteractiveButton (./app/components/InteractiveButton.tsx:5:18)
    at renderWithHooks (./node_modules/react-dom/cjs/react-dom.production.min.js:11:131)
    at mountIndeterminateComponent (./node_modules/react-dom/cjs/react-dom.production.min.js:163:289)
    ...
```

The first line mentioning YOUR file is `./app/components/InteractiveButton.tsx:5:18`. The file pointer is `app/components/InteractiveButton.tsx`, line 5. Open that file, then paste the error back to your agent: "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx:5`. Please fix."

**Error 2 (Module not found):**

```
Module not found: Can't resolve './components/StaticHeroo'
  ./app/page.tsx:1:1
```

The file pointer is `app/page.tsx`, line 1. Note: the error usually tells you WHAT it cannot find (`StaticHeroo`). With both the file pointer (where the bad import is) and the error description, the steer is unambiguous: "You misspelled `StaticHero` as `StaticHeroo`. Please fix the import on line 1 of `app/page.tsx`."

**Error 3 (a longer one with a tricky word):**

```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
  at InteractiveButton (./app/components/InteractiveButton.tsx:8)
  at Page (./app/page.tsx:5)
  ...
```

The first line mentioning YOUR file is `./app/components/InteractiveButton.tsx:8`. The file pointer is that file, line 8. Do not worry about what "hydration" means — Lesson 4 (next) covers it. For now, just open the file at the pointer and paste the full error to your agent.

### What about the description?

The error DESCRIPTION at the top of the message — `TypeError`, `Module not found`, `Hydration failed`, similar — is often unfamiliar, and for this lesson that is fine. The agent reads error descriptions all day; pasting the FULL error message plus naming the file pointer gives the agent everything it needs. Your job is finding the pointer; the agent's job is reading the description.

### Two pitfalls worth recognizing

Two pitfalls worth recognizing — both are recognition patterns, not deep explanations.

First: errors sometimes have MULTIPLE "YOUR file" lines. Example: a `Page` calls `InteractiveButton`, and both error. Take the TOPMOST one (the most-recent line in the stack trace). That is where the error originated.

Second: errors sometimes mention paths that look like yours but are not. `./node_modules/your-library/` is library code, not your code, even though it has "your" in the path. Filter on `./app/` (or wherever your project's source root is).

### What comes next

Lesson 4 (the last M3.5 lesson) covers the `'use client'` directive — what to do when an interactive button (like `InteractiveButton.tsx`) silently does not respond, or when the "hydration failed" error appears. Together, Lessons 1 through 4 of M3.5 cover four floor-level code-reading skills: file tree, wrong-file edits, error pointers, and the `'use client'` recognition. From there, Phase 3 starts the thread project, where you will use all four daily.

### What you do NOT do in this lesson

You do not read the stack trace line by line. You do not analyze what each function call did. You do not try to understand the error description from first principles. All of those are deeper skills — they belong to Module 7's "where to go next" track. The thread project in Phases 3 and 4 does not require them. Finding the file pointer and pasting the error back to the agent is the floor, and it is enough.

## Exercise

Plan twenty to twenty-five minutes for this exercise.

1. **Create a scratch file.** Outside the sample-app folder (the repo root or a personal scratch folder is fine), make a new file called `m3.5-l3-scratch.txt`. You do not want to modify the sample-app.

2. **For each error message below, write two things:** (a) the file path you would open (with a line number if visible), and (b) the steer ask you would send your agent. Write your answers in the scratch file before peeking at the answer key.

**Error A:**
```
TypeError: Cannot read properties of undefined (reading 'name')
    at InteractiveButton (./app/components/InteractiveButton.tsx:5:18)
    at renderWithHooks (./node_modules/react-dom/cjs/react-dom.production.min.js:11:131)
    ...
```

**Error B:**
```
Module not found: Can't resolve './components/StaticHeroo'
  ./app/page.tsx:1:1
```

**Error C:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
  at InteractiveButton (./app/components/InteractiveButton.tsx:8)
  at Page (./app/page.tsx:5)
  ...
```

3. **Compare with the answer key below.**

**Answer key (do not peek before tracing):**

- **Error A:** File pointer — `app/components/InteractiveButton.tsx`, line 5. Steer — "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx:5`. Please fix."
- **Error B:** File pointer — `app/page.tsx`, line 1. Steer — "You misspelled the import on line 1 of `app/page.tsx` — `StaticHeroo` should be `StaticHero`. Please fix."
- **Error C:** File pointer — `app/components/InteractiveButton.tsx`, line 8 (the topmost "YOUR file" line in the stack). Steer — "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx:8`. Please diagnose and fix."

If you traced all three correctly, the floor is there. If you missed one — especially Error C, where two of your own files appear in the stack — re-read the trace top to bottom and circle the FIRST line that starts with `./app/`. That is the file pointer.

## Checkpoint

You've got this if you can:

1. Look at any error message and find the first line that mentions a file path you wrote (typically `./app/...`).
2. Write a steer ask that includes the full error AND names the file pointer.

## Going deeper

Optional, only if you are curious:

- **Module 7** ("where to go next") will eventually cover reading the stack trace line by line — understanding what each function call did and where the bad state originated. For everything through Phase 5, the file-pointer floor is sufficient. Most errors are fixed by pasting them back to the agent with the pointer named; you rarely need to read the trace yourself.
- **The agent itself** is one ask away from decoding any error description. If `TypeError` or `Hydration failed` is unfamiliar, paste the full error and ask "what does this error mean in plain English?" — the answer plus the file pointer is usually enough to steer the fix.

## Loop check

> **Loop check — evaluate.** This lesson adds one more EVALUATE pattern: when an error shows up, find the file pointer first. That is enough for the next ask (the STEER step) to be precise. The loop step this lesson reinforces is **evaluate**.

## What you just did

You learned to scan an error message and find the first file pointer that is in your project. You wrote steer asks that name the file pointer explicitly. The next lesson is the last M3.5 lesson: `'use client'` — what it is, why some files have it, and the symptom that tells you one is missing.

## Navigation

[← Previous: Spotting wrong-file edits](./02-spotting-wrong-file-edits.md)
[Next: 'use client' and the server/client split →](./04-use-client-and-server-split.md)
