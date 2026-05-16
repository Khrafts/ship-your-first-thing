---
title: "'use client' and the server/client split"
module: "03.5-reading-code"
lesson_number: 04
est_minutes: 45
prereqs: ["03-error-message-to-file-pointer"]
updated: "2026-05-14"
deviations: []
---

# 'use client' and the server/client split

## Learning objective

By the end of this lesson, you will be able to look at a Next.js file and recognize whether it needs `'use client'` at the top, name the symptom of a missing `'use client'`, and use the ask-the-agent skill to verify your understanding.

## Why this matters

Module 3.5 Lessons 1, 2, and 3 taught observational floors: file tree, wrong-file edits, error pointers. This last M3.5 lesson handles one more pattern that bites learners in Phase 3: a button that silently does not respond, or a "hydration failed" error in the browser console. Both are usually the same root cause — a file that needs `'use client'` on its first line is missing it. Naming the symptom plus knowing the steer turns that bug into a 30-second fix instead of an hour of confusion.

## Core read

Next.js (the framework you will use in Phase 3) splits every file into one of two categories. A **server component** (a one-line definition: a Next.js file that renders on the server before sending HTML to the browser; the default in App Router, [→ GLOSSARY](../../GLOSSARY.md#server-component)) handles static content — text, layouts, anything without interactivity. A **client component** (a one-line definition: a Next.js file that runs in the browser and supports interactivity like state, click handlers, and forms, [→ GLOSSARY](../../GLOSSARY.md#client-component)) handles the parts of the page that respond to user input. The two categories live in the same project but are rendered differently. The split matters because if you put interactivity inside a Server Component file, it silently does not work.

### How you mark a file as a Client Component

You tell Next.js which category a file is in via a one-line **directive** (a one-line definition: a special single line at the top of a file that changes how the file is treated by its framework, [→ GLOSSARY](../../GLOSSARY.md#directive)) on the very first line. The directive is **`'use client'`** (a one-line definition: a directive that flips a Next.js file from Server Component to Client Component; goes on line 1 of the file, above all imports, [→ GLOSSARY](../../GLOSSARY.md#use-client)). One line. Single quotes (or double — both work; this course uses single per the Next.js docs). Nothing else. If a file needs to be a Client Component, it has `'use client'` on the first line; otherwise, the directive is absent and the file stays a Server Component.

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

Both files render parts of a webpage, but they sit in different categories. `InteractiveButton` uses `useState` (state that holds a counter) and an `onClick` handler (the button responds to clicks). Both pieces are interactivity, and both require the file to be a Client Component — hence `'use client'` on line 1. `StaticHero` has no state and no event handlers. It is pure JSX: a heading and a paragraph. Next.js renders it on the server and sends the resulting HTML to the browser. The first line of the file determines which category it falls into.

### The symptom — what tells you a directive is missing

Here is how a missing `'use client'` shows up. If a file has an interactive element — a button, a form, a click handler — AND the file is missing `'use client'`, one of two things happens:

1. **The element silently does not respond.** You click the button; nothing happens. No error message. The page looks fine.
2. **A "hydration" error appears** in the browser console (or in a Next.js error overlay).

The technical name for the failure in case 2 is **hydration** (a one-line definition: in this lesson's floor, the symptom term for "the server-rendered HTML and the client-rendered HTML do not agree" — most often caused by a file that needs `'use client'` missing the directive, [→ GLOSSARY](../../GLOSSARY.md#hydration)). The deeper "why hydration exists" explanation belongs in Module 7's where-to-go-next track. For M3.5's floor, hydration is just the second of two symptoms of the same bug.

### The 30-second detection rule

Two-part rule, learnable in 30 seconds:

1. **If the file uses `useState`, `useEffect`, `onClick`, `onChange`, `onSubmit`, or any other DOM event handler** — `'use client'` must be on line 1.
2. **Otherwise** — leave the directive off; the file stays a Server Component.

You do not have to know what every one of those names does. The pattern match is "do any of those names appear in the file? If yes, line 1 should say `'use client'`. If no, line 1 should be something else."

### The steer when you spot the symptom

When the symptom appears — interactive element does not respond, OR hydration error in the browser console — the steer to the agent is:

> "The button is not responding. The file with the click handler probably needs `'use client'` on line 1. Please add it."

OR, if you have a hydration error with a file pointer from Lesson 3's skill:

> "I see this hydration error: [paste]. The file pointer is `app/components/InteractiveButton.tsx`. It probably needs `'use client'` on line 1. Please fix."

The agent does the work; you have just gotten it to the right diagnosis.

### What you do NOT do in this lesson

You do not learn why React Server Components exist or what trade-offs they were designed to solve. You do not learn what "rendering on the server" actually does inside Next.js, or how the bundler decides which files become client bundles versus server bundles. You do not learn what hydration does step-by-step inside the browser. You do not learn the partner directive `'use server'` (which marks Server Actions). All of those are deeper skills — they belong to Module 7's where-to-go-next track. The thread project in Phases 3 and 4 does not require any of them. Spotting the symptom and writing the steer is enough.

### What you just closed

This is the last M3.5 lesson and the last lesson of Phase 2. You now have four observational skills:

1. Reading a file tree at a glance (Lesson 1).
2. Spotting wrong-file edits via the diff summary (Lesson 2).
3. Tracing an error message back to a file pointer (Lesson 3).
4. Recognizing the `'use client'` symptom (this lesson).

Phase 3 (Module 4) starts the thread project — a real Next.js plus Supabase plus Vercel build. You will use all four observational skills daily. Together with the M3 loop, the four skills are the recovery toolkit.

## Exercise

Plan twenty to twenty-five minutes for this exercise. It uses your AI agent (Claude Code or Gemini CLI) as a tutor.

1. **Open both files in your IDE.** `modules/03.5-reading-code/sample-app/app/components/InteractiveButton.tsx` and `modules/03.5-reading-code/sample-app/app/components/StaticHero.tsx`. Read both top to bottom. They are short.

2. **Open your agent in a fresh session.** Use `/clear` if you were in the middle of something else.

3. **Ask the agent the exact question:**

   > "Open `modules/03.5-reading-code/sample-app/app/components/InteractiveButton.tsx` and `modules/03.5-reading-code/sample-app/app/components/StaticHero.tsx`. Explain in plain English why one has `'use client'` at the top and the other does not. Keep it short — three sentences."

4. **Read the agent's answer.** In a scratch file (`m3.5-l4-scratch.txt` at the repo root or a personal scratch folder — do not modify the sample-app), write down:
   - Anything in the agent's answer that sounds right to you.
   - Anything that sounds wrong, confusing, or that goes deeper than "the file uses interactivity, so it needs the directive."
   - One sentence summarizing the agent's explanation in your own words.

5. **Compare with the answer key below.** Note any meaningful difference between what the agent said and what the lesson says. If the agent added a first-principles React Server Components explanation, that is beyond M3.5's floor — not wrong, just deeper than this lesson needs.

**Answer key — read AFTER you have done step 4:**

`InteractiveButton.tsx` has `'use client'` on line 1 because it uses `useState` (state that holds a counter) and an `onClick` handler (the button responds to clicks). Both pieces of interactivity are client-only — they need to run in the browser. The `'use client'` directive tells Next.js: this file is a Client Component; ship its code to the browser.

`StaticHero.tsx` does not have `'use client'` because it has no state and no event handlers. It is pure JSX — a heading and a paragraph. Next.js renders it on the server before sending HTML to the browser; no browser-only code is involved. Leaving the directive off is the default; the file stays a Server Component.

**Why this matters:** if you ever see an interactive button that silently does not respond OR a "hydration failed" error in the browser console, the most common cause is a Client Component file that is missing `'use client'` on line 1.

## Checkpoint

You've got this if you can:

1. Look at a Next.js file and predict whether it needs `'use client'` based on whether the file uses interactivity (state, click handlers, forms).
2. Write a one-sentence steer that asks the agent to add `'use client'` to a file showing the symptom (button does not respond, OR hydration error).

## Going deeper

Optional, only if you are curious:

- **Module 7** ("where to go next") will eventually cover the architectural "why" of React Server Components, the partner directive `'use server'` (which marks Server Actions), and the bundler-level mechanics of how files become server bundles versus client bundles. For everything through Phase 5, the floor in this lesson plus the ask-the-agent skill is enough.
- **The agent itself** is one ask away from any framework-specific question you have. The pattern you used in this lesson — open the relevant files, ask "explain in plain English, three sentences max", compare with what you expected — works for any new piece of vocabulary the thread project throws at you.

## Loop check

> **Loop check — evaluate.** This lesson closes M3.5's evaluate-step toolkit. Spotting the `'use client'` symptom, asking the agent to explain the difference between two real files, and checking the agent's explanation against an answer key — three small moves that catch a common bug. The loop step this lesson reinforces is **evaluate**.

## What you just did

You closed Module 3.5 and Phase 2. You learned the symptom of a missing `'use client'` directive, asked your agent to explain the difference between an interactive file and a static one against two real example files, compared the agent's answer to a known-good answer key, and saw what a non-coder-grade detection floor looks like for framework-specific patterns. Phase 3 (Module 4) starts the thread project, where you will use the M3 loop plus the M3.5 observational floor every day.

## Navigation

[← Previous: Error message to file pointer](./03-error-message-to-file-pointer.md)
[Next: Course README — Module 4 lands in Phase 3 →](../../README.md)
