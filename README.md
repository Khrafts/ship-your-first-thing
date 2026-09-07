<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/lockup-dark.png">
    <img src="assets/lockup-light.png" alt="Ship Your First Thing" width="440">
  </picture>
</p>

# Ship Your First Thing

An open-source, self-paced course that teaches non-technical people to ship a real, deployed product using AI coding tools — and recover when the AI gets it wrong.

## What this is

This repository is the canonical source of truth for the course: plain markdown files arranged into modules, each made of lessons. The same content is also wrapped by a Next.js platform (built, in `site/`) that adds accounts, per-lesson progress tracking, and cohort schedules; once it deploys to Railway it will serve at https://shipyourfirstthing.com. The lessons are identical on both surfaces, and this repository stays canonical — on day one you only need a browser to read it. The hands-on modules run inside a desktop agent app — Claude Code desktop or Codex in the ChatGPT desktop app — and Module 0 walks you through choosing and installing yours. An ordinary fresh computer is fine: once the app is running, your agent installs each tool a step needs the first time it needs it, with your approval, and you never type a command.

The course is designed to be picked up cold. A learner who has never written production code should be able to open this course in a browser, start at Module 0, and follow the practical route below without needing a workshop, a video, or a person to answer questions live. The "and recover when the AI gets it wrong" part is the differentiator: the modules teach the durable AI-coding loop alongside the agent that does the building, so by the end you can both ship a thing and get unstuck when the model produces something broken.

## Who this is for

- People who are comfortable using a computer
- People who have never written production code
- People who have used GitHub at most to view a page
- People who are curious about building real software but feel intimidated by code
- People who want to work at their own pace, without a class or workshop
- People who may or may not have budget for paid AI tools (the course supports both)

## How to use this course

1. Start with [Module 0 — Welcome](./modules/00-welcome/README.md). It checks your hardware, helps you choose a cost path before you create any accounts, gets your agent app installed — and then, in the same sitting, has that agent [build your first thing](./modules/00-welcome/06-build-your-first-thing.md): a checklist page that's yours, checked in your browser, changed once, and saved.
2. Then follow the practical route: [Module 2, Lesson 3 — the save system](./modules/02-toolchain/03-the-save-system.md) → [Module 3 — the loop](./modules/03-the-loop/README.md) → [Module 4 — the thread project](./modules/04-thread-project/README.md), then Modules 5 to 7. Module 1 and the first two lessons of Module 2 are theory you read on demand; each Module 4 build lesson names the Module 1 lesson whose picture it uses. On the course site, Module 0 is open without an account and the on-demand lessons never lock anything.
3. You don't need developer tools before you start. Module 0, Lesson 5 installs the agent app; Claude Code desktop needs one helper program (Git) before it can open a folder — Windows computers don't have it, most Macs do — and that lesson walks you through the official installer and what to do if the app says a program is missing; the agent can't install that one for you, because it isn't running yet. Everything a later step needs, your agent installs the first time it's needed, explaining what and why in plain words; you give the approval. Any administrator password or account sign-in goes straight into the system's installer or the official sign-in window, never into the agent chat. If an install fails, the lesson tells you what to say next.
4. When something breaks, check [`COMMON-ISSUES.md`](./COMMON-ISSUES.md). When a page doesn't match what you see, the Fast answers table in [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) (a record kept up to 2026-08-22) is the quickest route; on the course site, the lesson chat is the live one.

## Table of contents

**Modules** — eight modules, 38 lessons

- [Module 0 — Welcome](./modules/00-welcome/README.md)
- [Module 1 — How software works (mental models)](./modules/01-mental-models/README.md)
- [Module 2 — Your agent and the machinery it drives](./modules/02-toolchain/README.md)
- [Module 3 — The loop in depth](./modules/03-the-loop/README.md)
- [Module 4 — Designing & building the thread project](./modules/04-thread-project/README.md)
- [Module 5 — Operating the build](./modules/05-operating/README.md)
- [Module 6 — After it's live](./modules/06-after-live/README.md)
- [Module 7 — Where to go from here](./modules/07-where-next/README.md)

**Cross-cutting docs**

- [SETUP.md](./SETUP.md)
- [GLOSSARY.md](./GLOSSARY.md)
- [CHEATSHEET.md](./CHEATSHEET.md)
- [COMMON-ISSUES.md](./COMMON-ISSUES.md)
- [BUDGET.md](./BUDGET.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [WHAT-CHANGED.md](./WHAT-CHANGED.md)
- [VERSIONS.md](./VERSIONS.md)

**Templates**

- [lesson-template.md](./lesson-template.md)
- [lesson-template-m0.md](./lesson-template-m0.md)

**Licensing**

- [LICENSE](./LICENSE) (MIT)
- [LICENSE-content](./LICENSE-content) (CC BY 4.0)
- [LICENSING.md](./LICENSING.md)

## License

This repository ships under a dual-license model: code under MIT (`LICENSE`) and course prose, exercises, and diagrams under Creative Commons Attribution 4.0 International (`LICENSE-content`). See [`LICENSING.md`](./LICENSING.md) for which files fall under which license.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## A note on freshness

AI tools change every few months — model versions, app behavior, default settings, even what the tools are called. The course's loop (intent → ask → evaluate → steer) is durable; the keystrokes are not. If reality drifts from a page, check the Fast answers in [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) — a record kept up to 2026-08-22 — or ask the lesson chat on the course site, before you assume the lesson is wrong.
