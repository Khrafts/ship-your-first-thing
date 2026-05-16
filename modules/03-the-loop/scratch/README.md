# scratch/ — Module 3 worked-example

Single self-contained `index.html` opened in Codespaces' preview tab (via VS Code's Live Preview extension, `ms-vscode.live-server`). Module 3 lessons (1 through 4) progress this file across iterations. Lesson 1 asks an AI agent to add today's date below the tagline; Lesson 2 adds a button that shows/hides the date; Lesson 3 asks for "a list of 3 favorite books" (deliberately under-specified — the agent will hallucinate); Lesson 4 asks "make the list look like a real bookshelf" (open-ended — the agent will over-engineer). Each iteration is real captured behavior per D-28.

## Why one file with no build step

Module 3 teaches the loop, not the framework. A single `index.html` opened in the browser preview tab makes every iteration visible immediately — no compile, no install, no dev server. The loop's payoff is "I asked the agent for X; the page changed (or didn't)". Anything more sophisticated (Next.js, React, a build tool) gets in the way of seeing the loop.

Phase 3 (Module 4 onward) is where you'll meet the framework stack. The scratch directory is throwaway: M3 Lesson 4 ends with "you can delete the scratch directory now — your real project starts in Module 4." Don't grow this file into your real project; start fresh.

## How to open it

- In Codespaces, install the **VS Code Live Preview** extension (`ms-vscode.live-server`) if it isn't already; one-click from the Extensions tab.
- Right-click `index.html` in the file tree → `Show Preview`. Codespaces forwards the Live Preview port automatically.
- Without Live Preview: you can also open the raw file via the file panel — but interactivity (like a button responding to clicks) won't work until you use the preview server.
