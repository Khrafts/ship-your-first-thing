# Cheatsheet

**Purpose:** The one page to check when you've forgotten the exact wording of a sentence or a check this course teaches. Not a tutorial — a reference. Every sentence below is in a copyable block; on the course site each has a Copy button.

**Freshness:** If a button here doesn't match what you see in your app, the app moved and the sentence didn't. On the course site, the lesson chat can reconcile the difference.

**How to contribute:** See `CONTRIBUTING.md`. When you author a lesson that introduces a new locked sentence or check, add it here in the same PR. Keep entries terse.

---

## Sentences you say to your agent

### The house rule — start of any project

Say it once at the start of a project: it tells your agent to make the technical decisions itself. [Module 0 Lesson 6](./modules/00-welcome/06-build-your-first-thing.md)

```prompt
I'm new to this and I'll describe what I want in plain words. You make every technical decision: pick the simplest option that's easy to undo, and tell me in one line what you picked. Only ask me about things I can answer — how it should behave, what it might cost, who can see my information, and which accounts you need me to sign in to. If I need to do something myself, give me the exact steps. Tell me before you install anything, connect to anything on the internet, or delete anything.
```

### When it asks you a technical question anyway

[Module 2 Lesson 2](./modules/02-toolchain/02-the-engine-room.md)

```prompt
I don't have a preference. Choose the simplest option that's easy to change later, and tell me what you chose.
```

### Before you approve something you don't understand

[Module 2 Lesson 2](./modules/02-toolchain/02-the-engine-room.md)

```prompt
Explain what this does in everyday words before I say yes.
```

### Before anything that deletes, sends or spends

[Module 2 Lesson 1](./modules/02-toolchain/01-your-ai-coding-agent.md)

```prompt
What could go wrong if we do this?
```

### When it hands you the wrench — "open a terminal", "run this command"

[Module 2 Lesson 2](./modules/02-toolchain/02-the-engine-room.md)

```prompt
That's your job — do it yourself and tell me what happened in plain words.
```

### Before the first save in a new folder

Your agent checks for, explains, and installs anything saving needs. [Module 0 Lesson 6](./modules/00-welcome/06-build-your-first-thing.md)

```prompt
Before you save, check whether this computer has everything you need to save working versions. If something is missing, tell me in plain words what it is and why you need it, then help me install it. Tell me before anything needs my approval, and tell me when it's ready.
```

### The save sentence — the moment a feature works, before you move on

[Module 2 Lesson 3](./modules/02-toolchain/03-the-save-system.md)

```prompt
Save this as a working version, with a one-line note about what changed.
```

### Confirm a save happened

[Module 2 Lesson 3](./modules/02-toolchain/03-the-save-system.md)

```prompt
Confirm the working version is saved on this computer, and whether the copy on GitHub is up to date.
```

### Put the project on GitHub — the first time only

Create your GitHub account in your browser first. [Module 2 Lesson 3](./modules/02-toolchain/03-the-save-system.md)

```prompt
Put a copy of this project on GitHub, then save this as a working version with a one-line note about what changed.
```

### The way back — a change made things worse

You lose only what happened after your last save. [Module 2 Lesson 3](./modules/02-toolchain/03-the-save-system.md), rehearsed in [Module 3 Lesson 4](./modules/03-the-loop/04-steering-and-recovery.md)

```prompt
Take us back to the last saved working version.
```

### Plan before the work

[Module 3 Lesson 2](./modules/03-the-loop/02-planning-vs-execution.md)

```prompt
Plan: [what you want, in your own words]. Don't make changes yet — describe what you would do.
```

### When an install fails

Don't repeat it blindly. [Module 0 Lesson 6](./modules/00-welcome/06-build-your-first-thing.md)

```prompt
The install didn't work. Tell me in plain words what happened and what you'd try next.
```

### The pre-flight question — before anything that touches data you already have

Before you approve anything that runs against saved data, and before you paste anything into a dashboard. [Module 4 overview](./modules/04-thread-project/README.md)

```prompt
Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today.
```

### When "done" arrives without the checks

[Module 4 Lesson 0](./modules/04-thread-project/00-the-plan.md)

```prompt
Run the checks we agreed on and show me the results first.
```

### When your agent keeps circling

Don't keep arguing — restart in a fresh conversation. [Module 4 Lesson 4](./modules/04-thread-project/04-posts.md)

```prompt
Start a fresh conversation and begin this chunk again from your last saved version.
```

## Buttons you press in the app

All three apps put the same things within reach; only the location changes. [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md)

| | Claude Code desktop | Codex in the ChatGPT desktop app | OpenCode desktop |
|---|---|---|---|
| **Start a new conversation** | **Code** in the sidebar, then **New** | **Codex** at the top of the sidebar, then **New chat** | The **+** on the top bar (a new session) |
| **Point it at a folder** | **Local**, then the folder picker above the message box | Your project and **Local** above the message box | The project picker below the message box, then **Add project** |
| **How often it asks** | The permission selector below the message box — set it to **Manual** so it asks before each change | The permission setting below the message box ("Approve for me" is the one that asks least) | Read the setting in the app; when in doubt, the page is your check |
| **Which model** | Not a choice you need to make | Not a choice you need to make | The model button under the message box — pick one marked **Free** |

> **Note:** This course hasn't confirmed where each app keeps a list of past conversations you can reopen. If you need an old one back, ask your agent, or look near where you start a new conversation. What matters in any approval question is that one choice approves and the other rejects.

## Checks you run

Two forms, and neither one asks you to look at anything your agent wrote. [Module 4 overview](./modules/04-thread-project/README.md#what-your-checks-look-like) has the worked examples for both.

**The refusal check.** In the running app, you try the thing that should NOT be allowed and confirm it is refused. If it goes through instead, you tell your agent exactly what you did and what should have stopped it.

**The pre-flight question.** Before any step you can't take back — anything pasted into a dashboard, anything run against data that already exists — you ask the pre-flight question above and wait for the answer before continuing.

## Conversation hygiene

- **One feature per conversation.** Finished the thing you were working on and want to start a different one? That's a fresh conversation, not a continuation.
- **A fresh conversation per chunk.** Every chunk in Module 4 opens by pointing your agent at the plan; carrying an old chunk's back-and-forth into the next one is how a plan and a build quietly drift apart.
- **Tell your agent what you saw, not a wall of text.** "The button didn't hide the date" beats pasting in everything the app printed. [Module 3 Lesson 4](./modules/03-the-loop/04-steering-and-recovery.md)

**Three moves that act on the session, not on the work.** [Module 7 Lesson 1](./modules/07-where-next/01-session-hygiene.md)

- **Start a fresh conversation** — when the problem is the conversation: something you ruled out has come back, or an instruction from earlier has quietly stopped applying.
- **Move to a different agent** — when a fresh conversation hit the same wall the same way twice, or your app is down or out of allowance for the day. Worth exactly one try. Skip it entirely when money, other people's information, or something that cannot be taken back is at stake — that goes straight to the next move.
- **Leave the keyboard** — either hand it to a person ([Module 6 Lesson 4](./modules/06-after-live/04-when-to-ask-a-person.md)), or stop for today. Say the save sentence before you close the lid.
- **The rule that picks between them:** *a move you have already made twice is not the move.*
