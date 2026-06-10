---
title: "'use client' and the server/client split"
module: "03.5-reading-code"
lesson_number: 04
est_minutes: 45
prereqs: ["03-error-message-to-file-pointer"]
updated: "2026-05-16"
deviations:
  - why-this-matters-extended
---

# 'use client' and the server/client split

## Learning objective

By the end of this lesson, you will be able to look at a Next.js file and recognize whether it needs `'use client'` at the top, name the symptom of a missing `'use client'`, and use the ask-the-agent skill to verify your understanding.

## Why this matters

Picture an art gallery. On one wall, framed pictures — painted once, framed once, hung once; they sit there and they don't change while you're standing in front of them. Next to them, a touchscreen kiosk: visitors tap to scroll commentary, vote on their favorite, leave a note. Both belong; both do different jobs. In a real project, a button that silently does not respond — or a "hydration failed" error in the browser console — is usually the same root cause: a file that needs to be a touchscreen is being hung in a frame's slot. This lesson teaches you to spot which files are frames, which are touchscreens, and the one-line label (`'use client'`) that moves a file from one to the other — a 30-second fix instead of an hour of confusion.

## Core read

Picture the gallery wall once more. Framed pictures sit there, prepared once and unchanging. The touchscreen kiosk is alive — taps, scrolls, live commentary. Both belong on the wall; both do different work. In a project, every file is either a frame or a touchscreen. The skill is spotting which is which; the agent handles the rest.

A **server component** (a one-line definition: the symptom-level name for a file in the "framed picture" category — static content, no interactivity, [→ GLOSSARY](../../GLOSSARY.md#server-component)) is the framed picture: text, layouts, anything that does not respond to clicks. A **client component** (a one-line definition: the symptom-level name for a file in the "touchscreen" category — interactivity, state, click handlers, [→ GLOSSARY](../../GLOSSARY.md#client-component)) is the touchscreen: it responds to user input. Both live in the same project. If a file with interactivity is left as a server component — a touchscreen hung in a frame's slot — the interactivity silently does not work.

### How you mark a file as a Client Component

You tell the framework which category a file is in via a one-line **directive** (a one-line definition: a special single line at the top of a file that changes how the file is treated by its framework, [→ GLOSSARY](../../GLOSSARY.md#directive)) on the very first line. The directive is **`'use client'`** (a one-line definition: the label that marks a file as a touchscreen — a Client Component; goes on line 1 of the file, [→ GLOSSARY](../../GLOSSARY.md#use-client)). On the gallery wall, `'use client'` is the label that moves a file from "frame" to "touchscreen." One line. Single quotes (or double — both work; this course uses single). Nothing else. If a file needs to be a touchscreen, it has `'use client'` on the first line; otherwise, the directive is absent and the file stays a frame.

### Two real files, side by side

Open `modules/03.5-reading-code/sample-app/app/components/InteractiveButton.tsx`. The first line is `'use client'`:

```tsx
'use client'

import { useState } from 'react'

export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

Now open `modules/03.5-reading-code/sample-app/app/components/StaticHero.tsx`. The first line is NOT `'use client'`:

```tsx
export default function StaticHero() {
  return (
    <section>
      <h1>Hello from a Server Component</h1>
      <p>This file is a Server Component because it has no interactivity.</p>
    </section>
  )
}
```

Both files render parts of a webpage, but they sit in different categories. `InteractiveButton` uses `useState` (a counter) and an `onClick` handler (responds to clicks). Both are interactivity, so this file is a touchscreen — `'use client'` on line 1. `StaticHero` has no state and no event handlers — just a heading and a paragraph. It stays a framed picture. The first line of the file decides which category it falls into.

### The symptom — what tells you a directive is missing

Here is how a missing `'use client'` shows up. If a file has an interactive element — a button, a form, a click handler — AND the file is missing `'use client'`, one of two things happens:

1. **The element silently does not respond.** You click the button; nothing happens. No error message. The page looks fine.
2. **A "hydration" error appears** in the browser console (or in a Next.js error overlay).

The second symptom is a "hydration" error in the browser console. **hydration** (a one-line definition: a SYMPTOM-only term meaning "browser console said the page does not agree" — usually a file that needs `'use client'` missing the directive, [→ GLOSSARY](../../GLOSSARY.md#hydration)) is the term you will see in the error text. When you see a hydration error, treat it as a synonym for "this file needs `'use client'`." On the gallery wall: a touchscreen hung in a frame's slot with no power — looks the part but does not respond to taps. The agent owns the underlying mechanic; you own the pattern match.

### The 30-second detection rule

Two-part rule, learnable in 30 seconds:

1. **If the file contains an interactivity name** (e.g., `useState`, `onClick`, or anything that looks like a click / type / submit handler) — `'use client'` must be on line 1.
2. **Otherwise** — leave the directive off; the file stays a Server Component.

You do not have to know what those names do. The pattern match is "does the file contain an interactivity name? If yes, line 1 should say `'use client'`. If no, line 1 should be something else."

### The steer when you spot the symptom

When the symptom appears — interactive element does not respond, OR hydration error in the browser console — the steer to the agent is:

> "The button is not responding. The file with the click handler probably needs `'use client'` on line 1. Please add it."

OR, if you have a hydration error with a file pointer from Lesson 3's skill:

> "I see this hydration error: [paste]. The file pointer is `app/components/InteractiveButton.tsx`. It probably needs `'use client'` on line 1. Please fix."

The agent does the work; you have just gotten it to the right diagnosis.

### What you do NOT do in this lesson

The deeper mechanics — why the split exists, what the bundler does, the partner directive `'use server'`, how hydration works under the hood — are the agent's job and Module 7's curiosity track. The thread project does not require any of them. Spotting the symptom and writing the steer is the floor.

## Exercise

Plan twenty to twenty-five minutes for this exercise. It uses your AI agent (Claude Code or Gemini CLI) as a tutor.

> **Before you start:** if the agent's explanation includes terms like `reconciliation`, `virtual DOM`, or `render phases`, ask it to simplify — that's beyond M3.5's floor and you don't need to learn it here.

1. **Open both files in your IDE.** `modules/03.5-reading-code/sample-app/app/components/InteractiveButton.tsx` and `modules/03.5-reading-code/sample-app/app/components/StaticHero.tsx`. Read both top to bottom. They are short.

2. **Open your agent in a fresh session.** Use `/clear` if you were in the middle of something else.

3. **Ask the agent the exact question:**

   > "Open `modules/03.5-reading-code/sample-app/app/components/InteractiveButton.tsx` and `modules/03.5-reading-code/sample-app/app/components/StaticHero.tsx`. Explain in plain English why one has `'use client'` at the top and the other does not. Keep it short — three sentences."

4. **Read the agent's answer.** In a scratch file (`m3.5-l4-scratch.txt` at the repo root or a personal scratch folder — do not modify the sample-app), write down:
   - Anything in the agent's answer that sounds right to you.
   - Anything that sounds wrong, confusing, or that goes deeper than "the file uses interactivity, so it needs the directive."
   - One sentence summarizing the agent's explanation in your own words.

5. **Compare with the answer key below.** Note any meaningful difference between what the agent said and what the lesson says. If the agent added a first-principles framework-internals explanation, that is beyond M3.5's floor — not wrong, just deeper than this lesson needs.

**Answer key — read AFTER you have done step 4:**

`InteractiveButton.tsx` has `'use client'` on line 1 because it uses `useState` (a counter) and an `onClick` handler (responds to clicks). Interactivity makes the file a touchscreen — `'use client'` is the label that puts it in the touchscreen category.

`StaticHero.tsx` does not have `'use client'` because it has no state and no event handlers — just a heading and a paragraph. With no interactivity, the file stays a framed picture (the default category). Leaving the directive off is correct.

**Why this matters:** if you ever see an interactive button that silently does not respond OR a "hydration failed" error in the browser console, the most common cause is a touchscreen file that is missing `'use client'` on line 1.

## Checkpoint

You've got this if you can:

1. Look at a Next.js file and predict whether it needs `'use client'` based on whether the file uses interactivity (state, click handlers, forms).
2. Write a one-sentence steer that asks the agent to add `'use client'` to a file showing the symptom (button does not respond, OR hydration error).

## Going deeper

Optional, only if you are curious:

- **Module 7** ("where to go next") covers the deeper "why" behind the server/client split — the architectural model, the partner directive `'use server'`, and the bundler mechanics that decide which files end up where. None of it is required to direct the agent at the M3.5 floor.
- **The agent itself** is one ask away from any framework-specific question you have. The pattern you used in this lesson — open the relevant files, ask "explain in plain English, three sentences max", compare with what you expected — works for any new piece of vocabulary the thread project throws at you.

## Loop check

> **Loop check — evaluate.** This lesson closes M3.5's evaluate-step toolkit. Spotting the `'use client'` symptom, asking the agent to explain the difference between two real files, and checking the agent's explanation against an answer key — three small moves that catch a common bug. The loop step this lesson reinforces is **evaluate**.

## What you just did

You closed Module 3.5 and Phase 2. You learned the symptom of a missing `'use client'` directive (interactive element silently does not respond, OR a hydration error in the browser console), asked your agent to explain the difference between an interactive file and a static one against two real example files, and compared the agent's answer to a known-good answer key. Together with file-tree reading (L1), wrong-file detection (L2), and error-to-file-pointer tracing (L3), you now have the four M3.5 observational skills. Phase 3 starts the thread project, where you will use the M3 loop plus the M3.5 floor every day.

## Navigation

[← Previous: Error message to file pointer](./03-error-message-to-file-pointer.md)
[Next: Course README — Module 4 lands in Phase 3 →](../../README.md)
