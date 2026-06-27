# sample-app/ — Module 3.5 reference scaffold

> **DO NOT run `npm install` against this directory.** This is a READ-ONLY reference scaffold. Module 3.5 lessons ask you to OPEN files and READ them — you never run them, install them, or modify them. The `package.json` exists to declare which Next.js + React versions this scaffold was authored against (so future contributors know what shape to maintain), not to be installed.

## Why this exists

Module 3.5 teaches the pattern-recognition floor for non-coders: reading a file tree, spotting when the AI edited the wrong file, reading an error message back to a file pointer, and reasoning about when `'use client'` is missing. Each of those skills needs a small piece of real-shaped Next.js code to point at. This is that piece.

## File map

- `app/layout.tsx` — root Server Component layout. No `'use client'` needed (no interactivity).
- `app/page.tsx` — home page Server Component. Imports the three components and renders them.
- `app/components/StaticHero.tsx` — pure-JSX Server Component. Shows what a non-interactive component looks like; no `'use client'`.
- `app/components/InteractiveButton.tsx` — Client Component with `useState` + `onClick`. Has `'use client'` on the first line; uses React hooks; Module 3.5 Lesson 4 reads this against `StaticHero.tsx` to explain the rule.
- `app/components/Footer.tsx` — pure-JSX Server Component. Another no-`'use client'` example.
- `package.json` — declares Next.js 16.2.6 + React 19.2.6 peer-dep versions for future contributors. NOT for `npm install` use.
- `tsconfig.json` — minimal Next.js-recommended TypeScript config; Module 3.5 doesn't teach `tsconfig.json` — file exists for realism.

## Module 3.5 lesson map

- L1 (reading a file tree) → `app/` directory + `app/components/` subdirectory + everything in `app/`.
- L2 (spotting wrong-file edits) → uses every file as a candidate target for the three (intent, diff-summary) pairs.
- L3 (error → file pointer) → uses every file as a candidate target for the three error messages traced back to files.
- L4 (`'use client'`) → reads `app/components/InteractiveButton.tsx` and `app/components/StaticHero.tsx`; asks the agent to explain why one has the directive and the other doesn't.

## Freshness

This scaffold is verified against Next.js 16.2.6 + React 19.2.6 as of 2026-05-14 (see [`VERSIONS.md`](../../../VERSIONS.md)). If `'use client'` semantics or App Router file conventions change, expect Module 3.5's lessons to be updated alongside this scaffold, with the change recorded in [`WHAT-CHANGED.md`](../../../WHAT-CHANGED.md). The scaffold is regression-only: if a learner reads an outdated version, the floor (detection skill) still transfers.
