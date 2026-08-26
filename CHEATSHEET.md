# Cheatsheet

> **Note:** Re-cut 2026-08-18 for the desktop-app course. The old command-line reference material — installing and running tools by hand — is gone: your agent does all of that machine-side work for you now, behind an approval prompt. What's left is what you actually say to your agent and where you click in its app.

**Purpose:** The one page to check when you've forgotten the exact wording of a locked phrase or a check this course teaches. Not a tutorial — a reference.

**Structure:** Four sections. Phrases you say to your agent, buttons you press in the app, checks you run, and conversation hygiene. Each entry is a tight one-liner with a "when to say it" or "when to run it" note and a link to the lesson that teaches it in full.

**Freshness:** If a phrase or button here doesn't match what you see in your app, check [`WHAT-CHANGED.md`](./WHAT-CHANGED.md) first — wording and app screens shift between course revisions, and the log records each change.

**How to contribute:** See `CONTRIBUTING.md`. When you author a lesson that introduces a new locked phrase or check, add it here in the same PR. Keep entries terse — this is a reference, not a tutorial.

---

## Phrases you say to your agent

| Phrase | Say it when | Taught in |
|---|---|---|
| *"Save this as a working version."* | The moment a feature works — before you move on to the next chunk. | [Module 4 Lesson 0](./modules/04-thread-project/00-the-plan.md) |
| *"Take us back to the last saved working version."* | A change made things worse, or you have lost the thread of what changed. You lose only what happened after your last save. | [Module 2 Lesson 3](./modules/02-toolchain/03-the-save-system.md) (it becomes the day-something-breaks move in [Module 5 Lesson 5](./modules/05-operating/05-the-day-something-breaks.md)) |
| *"Start a fresh conversation and begin this chunk again from your last saved version."* | Your agent keeps circling the same problem instead of fixing it. Don't keep arguing with it — restart instead. | [Module 4 Lesson 4](./modules/04-thread-project/04-posts.md) (the same line closes every chunk from Lesson 1 on) |
| *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."* | Before you approve anything that touches data you already have saved, and before you paste anything into a dashboard. | [Module 4 overview](./modules/04-thread-project/README.md) |
| *"Run the checks we agreed on and show me the results first."* | Your agent reports a chunk "done" without showing you the checks it ran. | [Module 4 Lesson 0](./modules/04-thread-project/00-the-plan.md) |
| Open your agent and point it at the next feature in your plan. | The start of every new chunk. Each lesson's opening ask names the feature's actual place in the plan you agreed on — "the first feature," "the second feature," and so on. | [Module 4 Lesson 1](./modules/04-thread-project/01-hello-world-deploy.md) (the pattern repeats, with the number changing, in every chunk lesson) |

## Buttons you press in the app

Both apps put the same three things within reach; only the location changes.

### Path 1: Claude Code desktop

- **The approval prompt.** Your agent proposes a change, the app stops and asks a plain question — something like "allow this change?" — with an approve choice and a reject choice. Nothing touches your files until you approve. [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md)
- **Starting a new conversation.** You start one in the same Code tab you've already been working in — there's no separate screen to find. [Module 3 Lesson 2](./modules/03-the-loop/02-planning-vs-execution.md)
- **Finding an old conversation.** Not yet verified for this app — see the note below.

### Path 2: Codex, inside the ChatGPT desktop app

- **The approval prompt.** Codex proposes a change, the app asks, and you approve or reject before anything happens on your machine. The exact question and where it appears are not yet verified for this app — see the note below. [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md)
- **Starting a new conversation.** The same new-chat move you already use in ChatGPT for anything else. [Module 3 Lesson 2](./modules/03-the-loop/02-planning-vs-execution.md)
- **Finding an old conversation.** Not yet verified for this app — see the note below.

> **Note:** This course hasn't confirmed exactly where either app keeps a list of past conversations you can reopen. If you need an old one back, ask your agent, or look near where you start a new conversation — that's usually where an app keeps the control for both. It also hasn't confirmed how the ChatGPT app words its approval question, so read the one on your own screen rather than expecting the Path 1 example above — what matters is that one choice approves and the other rejects.

## Checks you run

Two forms, and neither one asks you to look at anything your agent wrote. [Module 4 overview](./modules/04-thread-project/README.md#what-your-checks-look-like) has the worked examples for both.

**The refusal check.** In the running app, you try the thing that should NOT be allowed and confirm it is refused. If it goes through instead, you tell your agent exactly what you did and what should have stopped it.

**The pre-flight question.** Before any step you can't take back — anything pasted into a dashboard, anything run against data that already exists — you ask your agent the named question above and wait for the answer before continuing.

## Conversation hygiene

The re-cut of what this page used to call "token discipline" — the same goal, at the level you actually act on:

- **One feature per conversation.** Finished the thing you were working on and want to start a different one? That's a fresh conversation, not a continuation.
- **A fresh conversation per chunk.** Every chunk in Module 4 opens by pointing your agent at the plan; carrying an old chunk's back-and-forth into the next one is how a plan and a build quietly drift apart.
- **Tell your agent what you saw, not a wall of text.** "The button didn't hide the date" beats pasting in everything the app printed. Say what you saw and what should be different, and let your agent do the reading. [Module 3 Lesson 4](./modules/03-the-loop/04-steering-and-recovery.md)

**Three moves that act on the session, not on the work.** Each has conditions that select it, and none of them is a beginner phase you grow out of. [Module 7 Lesson 1](./modules/07-where-next/01-session-hygiene.md)

- **Start a fresh conversation** — when the problem is the conversation: something you ruled out has come back, or an instruction from earlier has quietly stopped applying.
- **Move to a different agent** — when a fresh conversation hit the same wall the same way twice, or your app is down or out of allowance for the day. Worth exactly one try. Skip it entirely when money, other people's information, or something that cannot be taken back is at stake — that goes straight to the next move.
- **Leave the keyboard** — either hand it to a person ([Module 6 Lesson 4](./modules/06-after-live/04-when-to-ask-a-person.md)), or stop for today: you cannot say in one plain sentence what you want, the rounds are getting shorter and sharper, or it is late and the thing waiting at the approval prompt is one you would rather be awake for. Say *"save this as a working version"* before you close the lid.
- **The rule that picks between them:** *a move you have already made twice is not the move.*
