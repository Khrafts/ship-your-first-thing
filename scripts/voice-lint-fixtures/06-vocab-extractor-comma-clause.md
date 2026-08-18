---
fixture: true
trips: jargon-density-vocab-extractor
---

# Voice-lint fixture: vocab term extractor (check #6 sub-check)

This fixture is NOT a lesson. It mimics the bullet shape of `docs/audience-vocabulary.md` so
`extract_vocab_terms()` can be exercised directly (via its optional file-path override) against a
bold-led bullet whose definition text contains a comma clause — the exact shape that produced the
"a database" phantom term from the real M4 Supabase entry ("an account system, a database, and
file storage in one"). The self-test asserts the clean term is extracted and the comma-clause
fragment is not.

## Module Fixture (MF)

### Requires-callout (D-04 pattern on first use)

- **Widget** — introduce as "the gadget that gives the fixture an alarm clock, a widget, and a gizmo in one." The learner never treats the fixture's definition prose (the *fake* parenthetical annotation) as if it were a term.
