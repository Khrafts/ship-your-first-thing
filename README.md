<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/lockup-dark.png">
    <img src="assets/lockup-light.png" alt="Ship Your First Thing" width="440">
  </picture>
</p>

# Ship Your First Thing

An open-source, self-paced course that teaches non-technical people to ship a real, deployed product using AI coding tools — and recover when the AI gets it wrong.

## What this is

This repository is the canonical source of truth for the course: plain markdown files arranged into modules, each made of lessons that follow a single, locked anatomy. The same content is also wrapped by a Next.js platform (built, in `site/`) that adds accounts, per-lesson progress tracking, and cohort schedules; once it deploys to Railway it will serve at https://shipyourfirstthing.com. The lessons are identical on both surfaces, and this repository stays canonical — on day one of working through the course you only need this repository and a browser.

The course is designed to be picked up cold. A learner who has never written production code should be able to clone or open this repo, follow `SETUP.md`, and work through the modules in order without needing a workshop, a video, or a person to answer questions live. The "and recover when the AI gets it wrong" part is the differentiator: the modules teach the durable AI-coding loop alongside the toolchain, so by the end you can both ship a thing and get unstuck when the model produces something broken.

## Who this is for

- People who are comfortable using a computer
- People who have never written production code
- People who have used GitHub at most to view a page
- People who are curious about building real software but feel intimidated by code
- People who want to work at their own pace, without a class or workshop
- People who may or may not have budget for paid AI tools (the course supports both)

## How to use this course

1. Read `SETUP.md` and choose your cost path from `BUDGET.md`.
2. Open this repo in GitHub Codespaces (instructions in `SETUP.md`).
3. Work through Module 0, then Module 1, then Module 2 onward — in order.
4. When something breaks, check `COMMON-ISSUES.md`. When a page doesn't match what you see, check `WHAT-CHANGED.md`.

## Table of contents

**Modules**

- [Module 0 — Welcome](./modules/00-welcome/README.md)
- [Module 1 — Mental models](./modules/01-mental-models/README.md)
- [Module 2 — The developer toolchain](./modules/02-toolchain/README.md)
- [Module 3 — Working with an AI coding agent](./modules/03-the-loop/README.md)
- [Module 3.5 — Reading code, just enough](./modules/03.5-reading-code/README.md)
- Module 4 — Designing & building the thread project *Coming in later phases*
- Module 5 — Operating the build *Coming in later phases*
- Module 6 — After it's live *Coming in later phases*
- Module 7 — Where to go from here *Coming in later phases*

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

AI tools change every few months — model versions, CLI flags, default behavior, even what the tools are called. The course's loop (intent → ask → evaluate → steer) is durable; the keystrokes are not. If reality drifts from a page, check [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) before you assume the lesson is wrong.
