---
fixture: true
trips: whatchanged-entry-shape
---

# Fixture for check #10 (whatchanged-entry-shape)

This fixture intentionally trips check #10 (whatchanged-entry-shape) in `--self-test` mode.
Each violation below is labeled. Content under the boundary comment must NOT trip — it
proves the check stops at the boundary.

## A change without a date

**Change:** This heading has no date, so the heading-shape rule trips.
**If you're affected:** No learner action — internal change.
**Details:** None.

## 2026-06-13 — Entry missing its affected label

**Change:** This entry omits the affected label on purpose.
**Details:** None.

## 2026-06-13 — Entry with too many body lines

**Change:** This entry has more than six non-blank body lines.
**If you're affected:** No learner action — internal change.
**Details:** None.
Filler line one pushes the body over the cap.
Filler line two pushes the body over the cap.
Filler line three pushes the body over the cap.
Filler line four pushes the body over the cap.
Filler line five pushes the body over the cap.

## 2026-06-13 — This summary is deliberately far longer than the seventy-two character cap allows for an entry heading

**Change:** The heading above exceeds the summary length cap.
**If you're affected:** No learner action — internal change.
**Details:** None.

## 2026-06-13 — Entry with one giant line

**Change:** The Details line below is over three hundred characters long, which is the gameable-cap loophole this rule closes.
**If you're affected:** No learner action — internal change.
**Details:** This single line keeps going and going and going well past the three hundred character cap because a line-count cap on its own is trivially gameable by an author who simply writes one enormous paragraph-line instead of several short ones, which is exactly the growth pattern the freshness log showed before the thin-entry contract landed.

## 2026-06-13 — Entry leaking internal codenames

**Change:** Per D-27 and Wave 3, see .planning/ROADMAP.md for the full narrative.
**If you're affected:** No learner action — internal change.
**Details:** None.

<!-- voice-lint check #10 boundary: entries below this line predate the entry contract and are preserved verbatim. New entries go ABOVE this line. -->

## Legacy entry below the boundary with no date and no labels

This entry has no date, no labels, mentions D-99 and Wave 7 and .planning/STATE.md, and runs
long — none of which may trip, because it sits below the boundary comment. If this section
produces violations, the region bound has regressed.
