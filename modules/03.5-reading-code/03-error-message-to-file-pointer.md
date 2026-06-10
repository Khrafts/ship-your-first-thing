---
title: "Error message to file pointer"
module: "03.5-reading-code"
lesson_number: 03
est_minutes: 35
prereqs: ["02-spotting-wrong-file-edits"]
updated: "2026-05-16"
deviations:
  - why-this-matters-extended
---

# Error message to file pointer

## Learning objective

By the end of this lesson, you will be able to look at any error message and find the file path of YOUR project's file that the error points at — without reading the dense list of function calls below it. The agent reads the rest; you find the pointer.

## Why this matters

You hand a contractor a long, dense invoice — say a hospital bill or a tax form — and at the top of the document, before all the unfamiliar codes and references, there's a small section that says "Item in question: page 4, line 14." You don't have to read the rest. You jump to page 4, line 14, and you see the specific line the dispute is about. Code errors are the same shape: a dense receipt with one circled line. This lesson teaches you to find the circled line — the file path and line number that points at YOUR code — and to ignore the rest until you need it.

## Core read

Picture the receipt again. The full invoice runs four pages; you don't have the vocabulary for most of it; you don't need to. Near the top, one line names exactly the page and line the question is about. You jump there. You read that one line. You make your call. Error messages publish the same kind of pointer every time, and the same jumping move is the whole skill.

When code fails, you get back an error message — usually a long one. The agent reads the whole thing; decoding every part is the agent's job. Your job is finding the one line that names a file you wrote, so your next ask can name that file precisely.

### Finding the line that names YOUR file

Scan the error message top to bottom. Skip lines whose paths start with `node_modules/`, `react-dom`, or `next` — those are library code the agent already knows about. The first line whose path starts with `./app/` (or wherever your project's source files live) is the file pointer. Open that file in your editor, paste the FULL error message back to your agent, and name the file pointer in your ask. The agent does the actual diagnosis and the fix; you just got it to the right file.

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

The first line whose path starts with `./app/` names `InteractiveButton.tsx`. Open `app/components/InteractiveButton.tsx` and paste the full error back to your agent: "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx`. Please fix." The trailing numbers after the file path are coordinates the agent reads; you do not need to.

**Error 2 (Module not found):**

```
Module not found: Can't resolve './components/StaticHeroo'
  ./app/page.tsx:1:1
```

The file pointer is `app/page.tsx`. The error description even tells you WHAT it cannot find (`StaticHeroo`). With the file pointer and the full error pasted to your agent, the steer is unambiguous: "I see this error: [paste full error]. The file pointer is `app/page.tsx`. Please fix."

**Error 3 (a longer one with a tricky word):**

```
Error: Hydration failed.
  at InteractiveButton (./app/components/InteractiveButton.tsx:8)
  at Page (./app/page.tsx:5)
  ...
```

The first line whose path starts with `./app/` names `InteractiveButton.tsx`. Open it, paste the full error to your agent: "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx`. Please fix." The word "hydration" is one you will see again in the next lesson as a symptom — for now, your ask just names the file pointer and pastes the error.

### What about the description?

The error DESCRIPTION at the top of the message — `TypeError`, `Module not found`, `Hydration failed`, similar — is often unfamiliar, and for this lesson that is fine. The agent reads error descriptions all day; pasting the FULL error message plus naming the file pointer gives the agent everything it needs. Your job is finding the pointer; the agent's job is reading the description.

### Two pitfalls worth recognizing

Two pitfalls worth recognizing — both are recognition patterns, not deep explanations.

First: errors sometimes have MULTIPLE "YOUR file" lines. Example: a `Page` calls `InteractiveButton`, and both error. Take the TOPMOST one (the highest line in the message that names a file you wrote). That is the closest pointer to where the error originated.

Second: errors sometimes mention paths that look like yours but are not. `./node_modules/your-library/` is library code, not your code, even though it has "your" in the path. Filter on `./app/` (or wherever your project's source root is).

### What you do NOT do in this lesson

You do not parse the dense list of function calls below the description. You do not analyze what each call did. You do not try to understand the error description from first principles. All of those are the agent's job — and the deeper "why" sits in Module 7's curiosity track. Finding the file pointer and pasting the error back to the agent is the floor, and it is enough.

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
Error: Hydration failed.
  at InteractiveButton (./app/components/InteractiveButton.tsx:8)
  at Page (./app/page.tsx:5)
  ...
```

3. **Compare with the answer key below.**

**Answer key (do not peek before tracing):**

- **Error A:** File pointer — `app/components/InteractiveButton.tsx`. Steer — "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx`. Please fix."
- **Error B:** File pointer — `app/page.tsx`. Steer — "I see this error: [paste full error]. The file pointer is `app/page.tsx`. Please fix."
- **Error C:** File pointer — `app/components/InteractiveButton.tsx` (the topmost "YOUR file" line). Steer — "I see this error: [paste full error]. The file pointer is `app/components/InteractiveButton.tsx`. Please fix."

If you traced all three correctly, the floor is there. If you missed one — especially Error C, where two of your own files appear — re-read the message top to bottom and circle the FIRST line that starts with `./app/`. That is the file pointer.

## Checkpoint

You've got this if you can:

1. Look at any error message and find the first line that mentions a file path you wrote (typically `./app/...`).
2. Write a steer ask that includes the full error AND names the file pointer.

## Going deeper

Optional, only if you are curious:

- **Module 7** ("where to go next") covers the deeper "why" behind error messages — what each part decodes to, what specific error types mean, where the bad state originated. None of it is required to direct the agent at the M3.5 floor; most errors are fixed by pasting them back to the agent with the pointer named.
- **The agent itself** is one ask away from decoding any error description. If `TypeError` or `Hydration failed` is unfamiliar, paste the full error and ask "what does this error mean in plain English?" — the answer plus the file pointer is usually enough to steer the fix.

## Loop check

> **Loop check — evaluate.** This lesson adds one more EVALUATE pattern: when an error shows up, find the file pointer first. That is enough for the next ask (the STEER step) to be precise. The loop step this lesson reinforces is **evaluate**.

## What you just did

You learned to scan an error message and find the first file pointer that is in your project. You wrote steer asks that name the file pointer explicitly. The next lesson is the last M3.5 lesson: `'use client'` — what it is, why some files have it, and the symptom that tells you one is missing.

## Navigation

[← Previous: Spotting wrong-file edits](./02-spotting-wrong-file-edits.md)
[Next: 'use client' and the server/client split →](./04-use-client-and-server-split.md)
