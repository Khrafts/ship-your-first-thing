---
title: "The plan: what you're building, and who with"
module: "04-thread-project"
lesson_number: 00
est_minutes: 40
prereqs: ["03-the-loop (all four lessons)"]
updated: "2026-09-08"
deviations: []
---

# The plan: what you're building, and who with

## What you'll have at the end

A written plan your agent keeps — what your app is, who it's for, and the eight features in build order — and a short set of house rules it works by for the rest of the module, both read back to you in your own words before anything gets built. This module runs for weeks; with nothing written down, the app you described on Monday quietly becomes a different app by Thursday.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What the plan holds

Four answers, in plain words, in one file your agent keeps and re-reads:

- **What is this app?** "A place where the people in my book club post what they're reading and see what everyone else is reading."
- **Who is it for?** "My book club to start. Anyone with the link can sign up." Sign-up is open in this build — that is what the sign-in feature does — so say who you *expect*, not who you will lock out. Invite-only is a later feature, and a fine thing to write down as not-building.
- **What gets built, in what order?** The eight features below, fixed, because every lesson from here is written against that order.
- **What are you deliberately not building?** "No invites, no direct messages, no notifications, no search." One sentence now instead of a correction later.

The app is a small social app of the kind Threads and Instagram are underneath: first online and empty, then sign-in, a profile, posts, follow, a feed, comments, likes. The subject on top is yours — a book club, a running group, a street of neighbours swapping tool loans.

## Do this

**1. Decide the subject before you open the app.** One sentence: what is your version of this app about, and who do you expect in it?

**2. Make a new, empty folder** — not the folder from Module 0 and not `loop-practice` from Module 3. Call it something like `thread-project`. Point your agent at it the way Module 0 showed you. Every fresh conversation from here starts by selecting this folder again.

**3. Send the house rules.** These are the terms you and your agent work by for the rest of the module. Your agent writes them into the file it reads on its own at the start of every conversation in this folder; it knows which file that is, and you never open it.

```prompt
Write yourself a short set of house rules for this project and put them in the file you read on your own at the start of every conversation in this folder. The rules: I'm not a programmer. I decide what gets built; you write all the code, choose every tool and service, and run everything that runs on this computer — never hand me something to type or run. Assume this computer has none of the tools a web app needs; when a step needs a tool, a service, or an account, say what it's for and what it costs, set it up yourself, and ask me only for what only I can do (creating an account in my browser, typing a password into the sign-in window you name, saying yes to spending). Never ask me to put a password or a sign-in code into this chat. For technical choices, pick the simplest option that's easy to change later and tell me in one line; ask me only about what people see, what it costs, who can see what, or which accounts I need. Talk in everyday words — no code, error text, or file names as explanations. Before anything that can't be undone, stop, say what could go wrong, and wait for my answer. Before saying "done", run the checks we agreed on and show me the results; if you can't run one, say so. When I say "save this as a working version", save it with a one-line note and tell me whether the copy went up and whether the live copy rebuilt. When I ask to see the app, start it on my computer and give me the address. When you're stuck, say so, with at most three options. At the start of every conversation, read the plan and these rules and open by saying where we are. Read them back to me in plain words when they're written.
```

**4. Send the product brief.** The eight features are fixed; everything else in the plan is yours.

```prompt
Now write the plan file. Ask me what the app is and who I expect to use it, one question at a time, and keep my words. Put these eight features in the plan, in this order, as what gets built: 1. Online and empty — a live web address anyone can open. 2. Sign in — anyone can create an account and sign in with an email address and a password. 3. Profile — name, photo, short bio. 4. Posts — write, edit, and delete your own. 5. Follow — follow and unfollow other people. 6. Feed — posts from the people you follow, plus your own. 7. Comments — anyone can read them, signed-in people can add one. 8. Likes, then the whole app checked live with two accounts in two browsers. Then ask me what I'm deliberately not building and write that down. Read the plan back to me in plain words, and stop — don't build anything yet.
```

Answer in your own voice; "people post what they're reading and everyone can see it" is a better line in a plan than anything with the word *platform* in it. If a sentence comes back nearly right, say what is off and what you want instead, in one sentence. Add at least two things you are not building.

<!-- Grounded in the shipped thread-project contract files (thread-project-template/PLAN.md and its house-rules twins), which the two asks above restate in learner words. Split into house rules + product brief and cut to roughly a third of the earlier single ask on 2026-09-08 (director review); the audience example was changed the same day so it no longer contradicts the open sign-up the fixed feature list implies. Not run against any of the three apps. The file each agent reads on its own: CLAUDE.md for Claude Code (code.claude.com/docs/en/desktop, fetched 2026-09-08), AGENTS.md for Codex (learn.chatgpt.com/docs/app, fetched 2026-09-08), AGENTS.md then CLAUDE.md for OpenCode (opencode.ai/docs/rules, fetched 2026-09-08). -->

<!-- CODEX / OPENCODE VERIFICATION SLOT: verify wording and app behavior against a real run in each app — user-assisted evidence pass -->

## Check it

The house rules are an agreement with your agent, not a setting the app enforces. Nothing guarantees it keeps them; you find out by testing, and this is the one time in the module you can test with nothing at stake.

**TRY THIS:** ask for both read-backs — the plan, then the rules with the name of the file they are in.

**EXPECT:** your app in your words, who you expect, eight features in your order, your not-building list; and rules that still say where a password goes and who makes technical choices.

**IF SOMETHING IS OFF**, say what, in one sentence, and ask for the read-back again:

```prompt
The bit about who it's for is wrong — it's my running club to start, not the whole street. Update the plan and read it back.
```

Then **start a fresh conversation** with the same folder selected and say nothing but hello.

**EXPECT:** it opens by telling you where you are — plan written, nothing built, the first feature next.

**IF IT ASKS WHAT THE PROJECT IS**, the rules did not take:

```prompt
Read the plan and the house rules in this folder, and tell me where we are. Then tell me why you didn't do that on your own, and fix the rules so you do next time.
```

Keep that first sentence; it is the opener for any conversation that starts lost.

## Save it

```prompt
Save this as a working version.
```

The folder is new, so this first save may be where your agent installs something and asks for an approval or two. If it offers to put a copy of the project online now, yes is a fine answer. If a step fails:

```prompt
That didn't work — tell me what you tried, and what my options are.
```

## What "done" means

1. The plan reads back in your words: what the app is, who you expect, the eight features in order, the not-building list.
2. The house rules read back from the file your agent reads on its own, and a fresh conversation opened knowing where it was.
3. Nothing has been built.

You're done when you can say, without opening the plan, what your app is, who it's for, and which feature gets built next. Next: the app online and empty.

## Navigation

[← Previous: Steering and recovery](../03-the-loop/04-steering-and-recovery.md)
[Next: Put your app online →](./01-hello-world-deploy.md)
