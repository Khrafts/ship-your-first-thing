---
title: "Codespaces walkthrough"
module: "00-welcome"
lesson_number: 05
est_minutes: 15
prereqs: ["04-account-creation"]
updated: "2026-05-08"
deviations: []
---

# Codespaces walkthrough

## Learning objective

By the end of this lesson, you will have opened a Codespace from this course's repo and confirmed you can navigate to and read Module 1.

## Why this matters

The first time you open a Codespace, the experience is "wait, where am I?" — a code editor in a browser tab on a machine you can't see. This lesson makes that first encounter unsurprising. You'll be in and out in fifteen minutes. After that, the Codespace is just a tab you reopen.

## Core read

A Codespace is a development environment that lives on a remote machine. You access it through your browser, but it looks and feels like VS Code running on your laptop. For Module 0 and Module 1 (which are pure markdown), you don't strictly need it — you could read the lessons on github.com directly. But starting in Module 2 (toolchain) you'll be running commands and editing code, and the Codespace is where that happens.

The walkthrough below assumes you picked Codespaces in lesson 02. If you picked the local install path instead, follow [`SETUP.md` § "Local install"](../../SETUP.md) instead and skip the rest of this core read.

**Step 1 — Open the repo on GitHub.**
Go to this course's GitHub URL (you have it from the README). Click the green `Code` button. Click the `Codespaces` tab. Click `Create codespace on main`.

**Step 2 — Wait ~60–90 seconds.**
The Codespace boots. You'll see a progress indicator. The first boot is slowest; subsequent reopens are fast.

**Step 3 — The editor opens.**
You'll see a VS Code interface with this repo's files in the left sidebar. The editor area in the middle is empty until you open a file.

**Step 4 — Open the README.**
In the file explorer, click `README.md`. The Markdown source opens. You can right-click the tab and choose "Open Preview" to see the rendered version side-by-side.

**Step 5 — Navigate to Module 1.**
In the file explorer, expand `modules/`, then `01-mental-models/`. Click `README.md`. You're now looking at Module 1's index.

**Step 6 — Confirm the terminal works.**
Press `` Ctrl+` `` (backtick) or open the Terminal menu → `New Terminal`. A shell opens at the bottom. Type:

```bash
ls modules/01-mental-models/
```

You should see `02-where-data-lives.md` (the exemplar lesson shipped in Plan 01-1) and `README.md`. (Bundles 1 and 3 — `01-how-the-web-works.md` and `03-who-can-do-what.md` — land in Plan 01-4. If they're not there yet, that's the current state of the repo.)

**Step 7 — Stop the Codespace when you're done.**
Close the browser tab. The Codespace will auto-stop after 30 minutes idle. To delete the Codespace and free storage, go to [github.com/codespaces](https://github.com/codespaces) and click the trash icon. (Don't delete unless you've pushed any work — see Module 2 for the `git push` habit.)

### Things that confuse beginners on first run

- **`localhost:3000` does not work from your laptop browser.** When you run a dev server in Codespaces (later), it forwards a port to a Codespaces-issued URL, not to your laptop's localhost. The terminal will show you the right URL — click it from the terminal. (`COMMON-ISSUES.md` covers this if you forget.)
- **The Codespace may "feel slow" on first boot.** It's not your computer; it's the remote machine warming up. The first boot can take a couple of minutes. Subsequent boots are fast.
- **Saving works as expected.** `Ctrl+S` (or `Cmd+S` on Mac) saves files. Saved files survive auto-stop. Files survive Codespace deletion only if you've committed and pushed them — `git push` is taught in Module 2.

## Exercise

1. Open a Codespace from this repo per Steps 1–3 above.
2. Open `README.md`, then `modules/01-mental-models/README.md`, then `modules/01-mental-models/02-where-data-lives.md` (the exemplar lesson). Read the front-matter at the top.
3. Open the terminal and run `ls modules/`. Confirm you see `00-welcome/` and `01-mental-models/`.
4. Close the browser tab. Wait 30+ minutes. Reopen [github.com/codespaces](https://github.com/codespaces) and start the same Codespace again. Confirm your editor state is preserved.
5. (Optional, if you have time:) explore the file explorer. Open `BUDGET.md`, `VERSIONS.md`, `lesson-template.md`. Get the lay of the land.

## Checkpoint

You've got this if you can:

- Open a Codespace from this repo and reach `modules/01-mental-models/02-where-data-lives.md` in under 2 minutes.
- Run `ls` in the integrated terminal.
- Tell a friend what auto-stop does.

## What you just did

You took your environment from "an idea that exists in a browser tab" to "a place you've actually been." The first time you do this is the highest-friction it'll ever be. Every subsequent time is just clicking a tab and waiting 10 seconds. From here, Module 1 is pure reading and diagramming. No more setup until Module 2.

## Navigation

[← Previous: Account creation](./04-account-creation.md)
[Next: Module 1 — Mental models →](../01-mental-models/README.md)
