# Licensing

## Summary

This repository ships under a dual-license model. Code is licensed under MIT (see `LICENSE`); course prose, lessons, exercises, and diagrams are licensed under Creative Commons Attribution 4.0 International — CC BY 4.0 (see `LICENSE-content`). Both licenses are permissive and reuse-friendly; the split exists so that downstream readers know which terms apply to which kind of artifact.

## What is under MIT (LICENSE)

- `.ts`, `.tsx`, `.js`, `.json` source files
- Shell scripts and other executable scripts
- Configuration files (e.g. `tsconfig.json`, `package.json`, `.eslintrc`, etc.)
- Anything inside `thread-project/` (the demo product, created in Phase 3)
- `.devcontainer.json` and Codespaces configuration if present

## What is under CC BY 4.0 (LICENSE-content)

- `.md` files inside `modules/` — every lesson body
- Root-level course documents that are pure prose (see Cross-cutting artifacts below for the mixed cases)
- Mermaid sources inside `diagrams/`
- Lesson exercises and core reads

## Cross-cutting artifacts (mixed)

These files mix prose with code references and we default to MIT for simplicity:

- `README.md`
- `SETUP.md`
- `CONTRIBUTING.md`
- `LICENSING.md` itself
- `BUDGET.md`
- `WHAT-CHANGED.md`
- `VERSIONS.md`
- `GLOSSARY.md`
- `CHEATSHEET.md`
- `COMMON-ISSUES.md`

These mix prose with code references; we default to MIT for simplicity. The substantive prose inside them is also reusable under CC BY 4.0 by request.

## Why dual-license

Code is meant to be reused freely (MIT). Course prose and diagrams are meant to be redistributed with attribution (CC BY 4.0). This split mirrors how OSS courses like *The Odin Project* handle the question and lets contributors and readers know exactly which terms apply when they reuse a piece of the work.

## Attribution example for prose

```
"Adapted from Ship Your First Thing (https://github.com/<owner>/<repo>) by <contributors>, used under CC BY 4.0."
```
