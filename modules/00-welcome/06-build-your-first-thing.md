---
title: "Build your first thing"
module: "00-welcome"
lesson_number: 06
est_minutes: 45
prereqs: ["05-install-your-agent-app"]
updated: "2026-09-08"
deviations: []
next_practical: "modules/02-toolchain/03-the-save-system.md"
---

# Build your first thing

## Learning objective

By the end of this lesson, you will have a small web page of your own — something you chose, built by your agent, open in your browser — that does one thing you can check. You'll have asked for one change, steered one mismatch, saved a working version your agent confirmed, and reopened the page without your agent.

## Why this matters

You have an installed app and an empty conversation, and this is the moment most people put the app down: nothing in it is yours yet. So this lesson makes something first — small, useful to you today, running in your browser inside the hour — and every lesson after it has something real to point back at.

> **Following along:** No sample conversation here, on purpose: your agent's words will be its own, and the page in your browser is what you check.

## Core read

### Do: pick your thing

One web page that does one thing you'd actually use. Yours to choose. Some shapes that fit in an hour:

- A checklist that remembers what you've ticked — packing for a trip, the weekly shop, the closing-up routine at work.
- A countdown to a date that matters to you.
- A tip or bill splitter you'd use at dinner.
- A recipe card that scales the amounts when you change how many people are eating.

The rule: it has to *do* something you can check, not just show something. "It remembers", "it calculates", "it counts down" — any of those. If you can't think of one, take the checklist; it's the example this lesson uses.

Before you type anything, write down four things: a title, what it does in one or two sentences, the one check you'll run to know it works ("I tick two items, close the page, open it again, and the ticks are still there"), and one change you'd want once you've seen it. Keep private details — addresses, passwords, medical notes — out of it. If the four things take more than two minutes, pick something smaller.

### Do: point your agent at a folder

Make a new, empty folder on your Desktop — `my-first-thing` is a fine name — then point your agent at it:

- **Claude Code desktop:** in the sidebar choose **Code**, then **New**. Choose **Local**, and pick your folder.
- **Codex in the ChatGPT desktop app:** switch to **Codex** at the top of the sidebar, choose **New chat**, then choose your folder and **Local**.
- **OpenCode desktop:** in the project picker below the message box choose **Add project** and pick your folder, then use the model button under the message box to pick one marked **Free**.

<!-- Tool claim source: the director's real-app captures and observed flows of 2026-09-08 (screenshots/m0/05-install-your-agent-app/*.png): Claude Code desktop sidebar Code → New, Local + folder picker above the prompt; ChatGPT app Codex mode → New chat, project + Local above the prompt; OpenCode project picker below the prompt → Add project → native folder chooser, model button under the prompt opening "Free models provided by OpenCode". -->

<!-- SCREENSHOT SLOT (director-owned): one annotated first-session capture per app — the folder step and the message box — from screenshots/m0/05-install-your-agent-app/. -->

If the app says it needs a program before it can open the folder, [Lesson 5](./05-install-your-agent-app.md#if-the-app-cant-open-your-folder) says what to do.

Lesson 5 also showed you the setting that decides how often the app asks before it acts. Two rules either way: when the app asks, approve what's about making or changing this page or opening it in your browser, and for anything else — an account, an install, the internet, deleting something — ask first:

```prompt
What does this do, and why do you need it for this page?
```

When the app doesn't ask, the page is still your check, one step later.

### Do: set the house rule, then ask

Your first message tells your agent how to work with you, so that technical decisions stay on its side of the table.

```prompt
I'm new to this and I'll describe what I want in plain words. You make every technical decision: pick the simplest option that's easy to undo, and tell me in one line what you picked. Only ask me about things I can answer — how it should behave, what it might cost, who can see my information, and which accounts you need me to sign in to. If I need to do something myself, give me the exact steps. Tell me before you install anything, connect to anything on the internet, or delete anything.
```

Then the ask, with your four things filled in:

```prompt
Make me one self-contained web page called "[your title]". It [what it does, in one or two sentences]. The important part: [the one check, as a sentence — for example: when I tick an item, close the page, and open it again, the ticks should still be there]. One file, in this folder, that opens in my browser when I double-click it. Don't install anything, don't connect to anything on the internet, and don't ask me for any account. When it's ready, open it in my browser.
```

Your agent says what it will do, maybe asks a question, does the work, and reports done. Its "done" is a claim. The page is the proof. If it asks you something technical anyway — which format, which technique — hand it back:

```prompt
I don't have a preference. Choose the simplest option that's easy to change later, and tell me what you chose.
```

### See: open the page

If it didn't open by itself:

```prompt
Tell me where the page is and how to open it.
```

Then open your folder and double-click the file. In Claude Code desktop, clicking the page's name in the conversation also opens it inside the app.

<!-- Tool claim source: code.claude.com/docs/en/desktop ("The Browser pane can also open static HTML files … Click an HTML … path in the chat to open it there"), fetched 2026-09-07. -->

### Check: behavior, not looks

1. **Is it yours?** The title, the wording, the items — anything missing, reworded, or added is a mismatch.
2. **Does it do the thing?** Run the one check you wrote down. Close the tab, open the page again, and run it once more.
3. **Anything broken?** Blank space, red text, half a page. Don't work out what it means — say it:

   ```prompt
   The page is blank below the title.
   ```


Check 2 is the one that matters: a page can fail it while looking perfect. If it fails, say exactly what you did and what should have happened:

```prompt
I [what you did], and [what happened]. It should [what you wanted].
```

What you saw, then what should be different — that's the whole skill of this course in miniature. Stop when the behavior works. The page doesn't have to be pretty.

### Do: ask for one change, and steer if it misses

Now the change you wrote down, in one sentence. Look again the same way: is it there, does it work, does the one check still pass?

![A checklist page open in a browser, titled "Library visit". Six items with tick boxes: "Library card" and "Water bottle" are ticked and struck through; "Books to return", "Notebook", "Pen" and "Tote bag" are not. Below the last item is a button labelled "Clear all ticks".](../../screenshots/m0/06-build-your-first-thing/checklist-example.png)

*One possible example — a checklist with a clear-all button added as its one change. Your page will differ.*

When it isn't what you meant, say what you saw and what should be different, and nothing about how:

```prompt
The button ended up at the top. Put it at the bottom, below the last item, and change nothing else.
```

If your agent says done and the page looks the same, refresh the page first, then say so. If two tries miss:

```prompt
Start over on this change: [your one sentence].
```

### Do: save it

The page needed nothing installed. Saving is different: it's the first thing in this course that may need a helper program your computer doesn't have yet, and your agent is the one who checks and installs it. Say:

```prompt
Before you save, check whether this computer has everything you need to save working versions. If something is missing, tell me in plain words what it is and why you need it, then help me install it. Tell me before anything needs my approval, and tell me when it's ready.
```

Approve what it explains is about saving in this folder. It may open an installer window for you to click through; that's normal. If that installer asks for your computer's administrator password, type it into the installer's own window, never into the chat. It may ask for a name and an email to label your saves: any email you'll keep using. If it says an install didn't work, don't repeat it blindly:

```prompt
The install didn't work. Tell me in plain words what happened and what you'd try next.
```

If two tries don't land, stop here: your page is still in its folder, and you can come back to this step in a fresh conversation later.

When it says it's ready, say the sentence you'll say for the rest of the course:

```prompt
Save this as a working version, with a one-line note about what changed.
```

Then:

```prompt
Confirm the working version is saved, and tell me what the note says.
```

A save is real when your agent confirms it. What that save is: the page's file, kept, so that *"take us back to the last saved working version"* can bring the file back if a later change goes wrong. What it isn't: anything the page remembers — ticks, a name you typed — lives in your browser, not in the file. And it's on this computer only — if your agent offers to put a copy online or connect an account, say "Not yet." Module 2 adds that half.

### See: reopen it without your agent

Close the tab and the agent app. Open your folder and double-click the page. Run your one check. That's the difference between having read about a tool and having one.

### Where it lives

In that one folder, on this computer, not on the internet — putting a thing where other people can visit it is Module 4's job. Keep it: Module 2 saves it properly.

## Exercise

The core read is the exercise; this is the list to tick.

1. **Write the four things** — title, what it does, the one check, one change — with nothing private in them.
2. **Make the folder and point your agent at it.**
3. **Send the house rule, then the ask** with your four things filled in.
4. **Open the page** in your browser.
5. **Run the three checks,** your own check first. Steer if anything misses.
6. **Ask for your one change,** then check again.
7. **Check first, then save.** Send the check-first sentence; approve what's about saving in this folder; if an install fails twice, stop and come back later. Then the save sentence, then the confirm sentence.
8. **Close everything and reopen the page from the folder.**

Your deliverable: a page that does the thing you chose, one change you asked for, and a saved working version your agent confirmed.

## Checkpoint

You've got this if you can:

- Open your page from its folder, without your agent, and watch it do the thing you chose.
- Say the two-sentence shape for when the page isn't what you meant: what you saw, then what should be different.
- Say what you do when your agent asks you a technical question: hand it back, and ask only about behavior, cost, privacy and accounts.
- Say what you do when saving needs something installed: ask your agent to check, explain, install and confirm — you approve, you never type commands.

## Where to go next

You've now done, once, what this course teaches. The practical route from here:

1. **[Module 2, Lesson 3 — the save system](../02-toolchain/03-the-save-system.md).** Go there next: it adds the half today's save is missing, a copy of your page somewhere safer than one computer. Module 2's first two lessons are short optional reads.
2. **Module 3 — the loop.** The four moves you made today, one lesson each, on a throwaway page.
3. **Module 4 — the next useful build,** and the first other people can visit: a small social app, from an empty folder to a public address, one chunk at a time.

**Module 1 is on demand.** It explains what's underneath a page like yours. Each Module 4 build lesson names the Module 1 lesson whose picture it uses; read it then. On the course site it never locks anything.

## What you just did

You made a page that does something useful for you, in a folder on your own computer, by saying what you wanted rather than learning how it's built. You also met the two facts that shape every later lesson: your agent's "done" is a claim you check against the page, and the app's asking is a setting, not a guarantee. The practical next step is the save system in Module 2, Lesson 3 — the half of today's save that survives this computer.

## Navigation

[← Previous: Install your agent app](./05-install-your-agent-app.md)
**[Practical next: The save system (Module 2, Lesson 3) →](../02-toolchain/03-the-save-system.md)**
[Reading order: Module 1 — How software works (mental models) →](../01-mental-models/README.md)
