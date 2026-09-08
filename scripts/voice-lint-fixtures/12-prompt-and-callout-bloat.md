---
fixture: true
trips: prompt-bloat
---

# Voice-lint fixture: prompt-and-callout bloat (check #12)

This fixture trips arm 12a once and arm 12b twice (one top-level fence, one indented inside a list item), and carries one clean prompt that must not warn.

Arm 12a — the legacy parenthetical callout shape. A lesson that writes **gizmo** (a one-line definition of a gizmo that interrupts the sentence, [→ GLOSSARY](../../GLOSSARY.md#git)) is using the retired form; the required form is a direct link like [gizmo](../../GLOSSARY.md#git).

Arm 12b — a technology chore inside a fenced prompt. The prompt below dictates tooling instead of describing behaviour:

```prompt
Open a terminal, run npm install, then write the SQL migration for the posts table.
```

The same arm must see a fence that is indented inside a list item:

- A step with a prompt under it:

  ```prompt
  Open a terminal and run npm install first.
  ```

This prompt is clean and must NOT warn:

```prompt
I want people to write short posts that anyone can read. Plan it, tell me what you need from me, and run the checks we agreed on before you say done.
```

This file is not a real lesson.
