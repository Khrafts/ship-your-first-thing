---
fixture: true
trips: debugging-framing
---

# Fixture for check #9 (debugging-framing; historically named m35-diagnostic-framing — filename kept to avoid renumber churn)

This fixture intentionally violates CLAUDE.md hard rule 12 (Agent-Responsibility Boundary) by teaching diagnostic framing at the M3.5 audience floor. Check #9 now scans all of `modules/`, not just M3.5, but this fixture's content is unchanged. Check #9 must emit at least 3 WARN lines against this file.

## Section that fails Q1 / Q2 / Q3

The four-part anatomy of an error message is: top description, stack trace line by line, library frames you skip, and the file pointer.

To debug a hydration error, look at the stack trace — common mistakes include missing the directive. If you see a "Module not found" error, check the import on line 1.

When you read the error at `./app/page.tsx:5:18`, the line and column tell you where to look. You diagnose the cause from there.

Note: rendering happens on the server before sending HTML to the browser; that is why a server component cannot use state.
