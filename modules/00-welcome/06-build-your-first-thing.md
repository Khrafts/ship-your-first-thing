---
title: "Build your first thing"
module: "00-welcome"
lesson_number: 06
est_minutes: 45
prereqs: ["05-install-your-agent-app"]
updated: "2026-09-07"
deviations: []
next_practical: "modules/02-toolchain/03-the-save-system.md"
---

# Build your first thing

## Learning objective

By the end of this lesson, you will have a checklist page of your own — your items, built by your agent, open in your browser — that remembers what you've ticked when you close it and open it again. You'll have asked for one change, steered one mismatch, saved a working version your agent confirmed, and reopened the page without your agent.

## Why this matters

You have an installed app and an empty conversation, and this is the moment most people put the app down: nothing in it is yours yet. So this lesson makes something first — small, useful to you today, running in your browser inside the hour — and every lesson after it has something real to point back at.

> **Following along:** This lesson runs in the app you installed in Lesson 5. It shows no sample conversation, on purpose: your agent's words will be its own, and the page in your browser is what you check. Plan thirty to forty-five minutes once your app is open. That number is a guess, not a measurement — this course hasn't yet timed real learners on this lesson.

## Core read

### Do: pick your list

A checklist. One page, a title, and five to eight items you actually use — what to pack for a trip you take often, the weekly shop, the closing-up routine at work. You tick items off, and the page remembers which are ticked when you close it and open it again. That memory is the useful part.

Before you type anything, write down the title, the items, and one change you'd want once you've seen it (a missing item, a better title, a button that clears every tick). Keep private details — addresses, passwords, medical notes — out of it. If the three things take more than two minutes, pick a smaller list.

### Do: point your agent at a folder

Make a new, empty folder on your Desktop called `my-first-thing`, then point your agent at it. In **Claude Code desktop** (the paid-track agent app, opening in its own window on your computer, [→ GLOSSARY](../../GLOSSARY.md#claude-code)): open the **Code** tab, choose **Local**, click **Select folder**, and pick it. In the ChatGPT desktop app, using **Codex** (the coding agent inside the free-track ChatGPT desktop app, [→ GLOSSARY](../../GLOSSARY.md#codex)): choose Codex instead of ordinary chat, then open a folder and pick it.

<!-- Tool claim source: code.claude.com/docs/en/desktop-quickstart ("Select Local … Click Select folder and choose your project directory"), fetched 2026-09-07; learn.chatgpt.com/docs/quickstart ("Select Codex from the ChatGPT dropdown"; "Start a chat, create a project, or open a folder"), fetched 2026-09-07. Control names inside the ChatGPT desktop app were not confirmed on a live install; the sentence names the action, not a button. -->

Lesson 5 showed you the setting that decides how often the app asks before it acts. In Claude Code desktop, set the selector next to the send button to **Manual** before your first ask. In the ChatGPT app with Codex, expect it to work inside your folder without asking. Two rules either way: when the app asks, approve what's about making or changing this page or opening it in your browser, and for anything else — an account, an install, the internet, deleting something — ask *"What does this do, and why do you need it for the checklist?"* first. When the app doesn't ask, the page is still your check, one step later.

### Do: ask for it

Type this, with your list filled in:

> Make me one self-contained web page called "[your title]" — a checklist I can tick items off. The items are: [your items]. When I tick an item, close the page, and open it again, the ticks should still be there. One file, in this folder, that opens in my browser when I double-click it. Don't install anything, don't connect to anything on the internet, and don't ask me for any account. When it's ready, open it in my browser.

Your agent says what it will do, maybe asks a question, does the work, and reports done. Its "done" is a claim. The page is the proof.

### See: open the page

If it didn't open by itself, say: *"Tell me where the page is and how to open it."* Then open `my-first-thing` and double-click the file. In Claude Code desktop, clicking the page's name in the conversation also opens it inside the app.

<!-- Tool claim source: code.claude.com/docs/en/desktop ("The Browser pane can also open static HTML files … Click an HTML … path in the chat to open it there"), fetched 2026-09-07. -->

### Check: behavior, not looks

1. **Your items?** Read the list. Anything missing, reworded, or added is a mismatch.
2. **Do ticks stick?** Tick two items. Close the tab. Open the page again. Same two ticked?
3. **Anything broken?** Blank space, red text, half a page. Don't work out what it means — say it: *"The page is blank below the title."*

Check 2 is the one that matters: a page can fail it while looking perfect. If the ticks vanish, say exactly that: *"I ticked two items, closed the tab, opened the page again, and the ticks were gone. They should still be there."* What you saw, then what should be different — that's the whole skill of this course in miniature.

Stop when the behavior works. The page doesn't have to be pretty.

### Do: ask for one change, and steer if it misses

Now the change you wrote down, in one sentence: *"Add a button at the bottom that clears all the ticks."* Look again the same way: is it there, does it work, do ticks still stick?

When it isn't what you meant — the button is at the top, an item got reworded — say what you saw and what should be different, and nothing about how: *"The button ended up at the top. Put it at the bottom, below the last item, and change nothing else."* If your agent says done and the page looks the same, refresh the page first, then say so. If two tries miss, say: *"Start over on this change: [your sentence]."*

### Do: save it

When the checklist works and your change is in, say — word for word, because you'll say it for the rest of the course:

> Save this as a working version, with a one-line note about what changed.

Your agent does everything underneath. It may set something up in the folder first and, depending on your setting, the app may ask you to approve that — it's about this folder, so approve it. Then ask: *"Confirm the working version is saved, and tell me what the note says."* A save is real when your agent confirms it.

What that save is: the page's file, kept, so that *"take us back to the last saved working version"* can bring the file back if a later change goes wrong. What it isn't: it doesn't keep your ticks. Those live in your browser's memory for this page, not in the file, and clearing your browser's stored data clears them. And it's on this computer only — if your agent offers to put a copy online or connect an account, say *"Not yet."* Module 2 adds that half.

### See: reopen it without your agent

Close the tab and the agent app. Open `my-first-thing` and double-click the page. Ticks still there? That's the difference between having read about a tool and having one.

### Where it lives

In that one folder, on this computer. It isn't on the internet, and nobody reaches it through a web address — putting a thing where other people can visit it is a separate step, and Module 4 starts there. (If your Desktop syncs to a cloud service, the folder may be copied to your other devices the way any folder there is.) Keep it: Module 2 saves it properly, and it's yours to change afterwards.

## Exercise

The core read is the exercise; this is the list to tick.

1. **Write the three things** — title, five to eight items, one change — with nothing private in them.
2. **Make the folder** `my-first-thing` and **point your agent at it.** Claude Code desktop: set Manual first.
3. **Ask** with the sentence above, your items filled in.
4. **Open the page** in your browser; ask *"Tell me where the page is and how to open it"* if it didn't open.
5. **Run the three checks,** ticks-stick first. Steer if anything misses.
6. **Ask for your one change,** then check again.
7. **Save,** and ask your agent to confirm the save and read you the note.
8. **Close everything and reopen the page from the folder.**

Your deliverable: a checklist page with your items, ticks that survive closing and reopening, one change you asked for, and a saved working version your agent confirmed.

## Checkpoint

You've got this if you can:

- Open your checklist from its folder, without your agent, and see your ticks where you left them.
- Say the two-sentence shape for when the page isn't what you meant: what you saw, then what should be different.
- Say what the saved version keeps (the page's file) and what it doesn't (your ticks).

## Where to go next

You've now done, once, what this course teaches: knew what you wanted, asked, checked, said what should be different, saved when it worked. The practical route from here:

1. **[Module 2, Lesson 3 — the save system](../02-toolchain/03-the-save-system.md).** Go there next. It takes today's save and adds the half it's missing: a copy of your checklist somewhere safer than one computer, and the sentence that brings a version back. It's the safety net for everything after it. Module 2's first two lessons are short optional reads on how your agent goes wrong and what it runs for you — read them when you want them.
2. **Module 3 — the loop.** The four moves you made today, one lesson each, on a separate throwaway page, so the first time you steer on purpose there's nothing you care about underneath.
3. **Module 4 — the next useful build,** and the first other people can visit: a small social app, from an empty folder to a public address, one chunk at a time.

**Module 1 is on demand.** It explains what's underneath a page like yours — where the page comes from, where information is kept, who's allowed in, how a thing goes public. Each Module 4 build lesson names the Module 1 lesson whose picture it uses, so you can read it the first time a build needs it; you don't have to read it first, and on the course site it never locks anything. The drawing exercises there are optional for you. Nothing on the site checks your exercises: a lesson you've read and decided to move past, you mark complete and move past.

## What you just did

You made a page that does something useful for you, in a folder on your own computer, by saying what you wanted rather than learning how it's built. You also met the two facts that shape every later lesson: your agent's "done" is a claim you check against the page, and the app's asking is a setting, not a guarantee. Module 1 sits next in the reading order and waits until a build needs it; the practical next step is the save system in Module 2, Lesson 3 — the half of today's save that survives this computer.

## Navigation

[← Previous: Install your agent app](./05-install-your-agent-app.md)
**[Practical next: The save system (Module 2, Lesson 3) →](../02-toolchain/03-the-save-system.md)**
[Reading order: Module 1 — How software works (mental models) →](../01-mental-models/README.md)
