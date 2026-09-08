---
title: "Put your app online"
module: "04-thread-project"
lesson_number: 01
est_minutes: 55
prereqs: ["00-the-plan"]
updated: "2026-09-08"
deviations: []
---

# Put your app online

## What you'll have at the end

An empty app at a real public web address, with somewhere for its accounts and information to live, checked from your own phone — and everything the app needs installed and set up by your agent. It is the only one of the eight features that ends with nothing to look at, and that is the point: every later feature lands on ground already known to work in public, so when sign-in misbehaves you know the trouble is in sign-in.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

Three things have to be true at once: the app is live at an address anyone can open, the app has one place to keep accounts and information that the live copy and the copy on your computer both use, and the live copy is wired to that place — not only the copy on your machine.

Your agent does all of it: choosing the services, installing whatever this computer is missing, creating the empty app, connecting it to its storage, setting up the project's saved history, and getting it live. Two things are yours: accounts that only you can create, and one question before you copy anything off a dashboard.

## Before you ask

**Expect to create accounts.** A web app needs a service that holds its accounts and information, and a service that runs it on the public internet. Your agent picks them and tells you which accounts to create; you create them in your browser, because it cannot sign up on your behalf or click the confirmation link in your email. Before you create any account, ask what its free plan covers and what happens when the allowance runs out — free plans change, and the answer is part of what you are saying yes to.

When this chunk was really built, the agent used [Supabase](../../GLOSSARY.md#supabase) for accounts and information and [Vercel](../../GLOSSARY.md#vercel) to run the app in public; both free plans covered everything this module builds at the time. Your agent may choose the same two or different ones. The lessons that follow name those two where they describe what happened; read each mention as *the service your agent chose*.

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say:

```prompt
Read the plan and the house rules, and tell me where we are.
```

Then:

```prompt
Build the first feature on the plan, in this folder: start a brand-new app and get it live at a public web address I can open from my phone. No features yet, just an empty page that's really online — but set it up so that when we add sign-in and posts later, the accounts and the information have one place to live that the live copy and the copy on my computer both use. You choose the services; tell me in plain words what each one is for, what its free plan covers, and what happens when the allowance runs out. First check what this computer already has and install anything the app needs — tell me what each thing is for, ask me only for the approvals only I can give, and check each one works before you build. Tell me which accounts I need to create, and walk me through each one in my browser, one at a time. Tell me what you'll do, and what you need from me, before you write anything. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: the app opens at a public web address anyone with the link can reach; the page carries my project's name; the live page and the page on my own computer show the same thing; nothing labelled secret is anywhere a visitor to the live page could reach.
```

Read what comes back and check one thing: does its plan match what you asked for — tools installed first, an empty app, somewhere for accounts and information to live, live at a public address that works from a phone? If it has added a sign-in page or anything else further down your plan, say so in one sentence and have it cut back to the one feature. Then:

```prompt
That matches what I want. Go ahead. Tell me each time you need me to create an account, sign in somewhere, or copy something from a dashboard, and each time you're about to install something.
```

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c0); the install-first clause was added 2026-09-07 and the agent-chooses-the-services shape on 2026-09-08; neither has been run against any of the three apps. Presented in the desktop app's framing. -->

The run is a series of pauses. If your app is set to ask before it acts, each pause is an approval — nothing on your machine changes until you accept; if it is set to work inside the folder without asking, the pauses are the moments it needs you: an account to create, a sign-in window to type into, a key to copy. Expect the first pauses to be installs, each one named before it happens; then the accounts; then the empty app, its storage, the project's saved history and its home page online, then going live. At the end it hands you a link. When this chunk was really built, the agent finished by saying the app was live, giving the link, listing what it had done in plain words, and noting it had not needed anything copied from a dashboard that time — and that it would flag it clearly the moment a step did.

<!-- CODEX / OPENCODE VERIFICATION SLOT: verify wording and app behavior against a real run in each app — user-assisted evidence pass -->

## If your agent asks you to copy a key

A service's dashboard lists more than one key, each beside a label. One is safe to be seen; the other — the [secret key](../../GLOSSARY.md#publishable-key) — must never leave the dashboard.

> **BEFORE YOU COPY** anything: look at the label next to it. The only key you ever copy is the one labelled as safe to be seen — on Supabase it is the [publishable key](../../GLOSSARY.md#publishable-key), whose value begins `sb_publishable_`.
>
> **IF YOUR AGENT ASKS FOR THE SECRET ONE,** ask and wait for the answer:

```prompt
Why does this step need the secret key, and where exactly will it live?
```

Find the row with the right label, copy what sits next to it, hand it over. There is nothing in it to read.

Your agent can ask for that key by an older name, in the same certain voice it uses for everything else. What tells you is the label on your own screen not matching the words in the chat:

```prompt
The key on my dashboard is labelled publishable and starts with sb_publishable_. Are you reaching for an out-of-date name?
```

## Check it

> **TRY THIS:** open the live link on your phone, on your own data connection — not your home wifi, and not the computer that built it.
>
> **EXPECT:** the page loads. Something plain, carrying your project's name, with nothing on it to do.
>
> **IF IT DOESN'T:**

```prompt
The live link doesn't load on my phone. On my computer the page loads. I want both to behave the same — find out why and fix it.
```

The phone is not a formality. The most common way a first deploy looks finished and is not: the app runs on the machine that built it, where all the connection settings already live, and the live site was never told about any of them — so it works for you and fails for everyone else. Your own computer cannot catch that. Your phone can. An error screen, or a page that spins forever, is a fail. Plain and empty is a pass.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c0). -->

When this chunk was really built, the live page came up at a real public address: a near-black page with one line of centred text reading "thread project — online", and a second line saying the pipeline was live. Two lines of text — and a success, because they travelled from a database, through a hosting service, onto a screen that had nothing to do with the machine that made them.

## Two places your app runs from now on

The copy on your own computer: your agent starts it, it is alive only while it runs, and it is where every change lands first. The live link: the copy rebuilt from each save that goes up. Knowing which one you are looking at is half of every check in this module. Two sentences to keep:

```prompt
Start the app on my computer and open it in my browser.
```

```prompt
Stop the app and start it again, then tell me what you see.
```

Say the first whenever there is nothing to look at — after a fresh conversation, after you closed the agent app, when a tab shows nothing or says it cannot connect. Say the second when a repair looks like it did nothing. A blank tab at home is usually an app that is not running, not a broken app. Every lesson's checks run on your own computer; the live link is checked here, on your phone, and again in the last lesson with two accounts.

Your accounts and information are in neither place. They live in the service your agent chose — one place that both copies use. An account you make at home is an account on the live link; a setting you change on that service's dashboard is changed for both. Until the last lesson, that is fine, for one reason: everything in this app is test accounts with made-up addresses and made-up posts. Keep it that way.

## If something is wrong

- **Works at home, not on the phone:**

  ```prompt
  On my computer the page loads, but the public link is blank or shows an error. I want both to behave the same. Find out why and fix it.
  ```

- **An install or a setup step fails:** do not try to fix it yourself.

  ```prompt
  That step didn't work — tell me what you tried, and what my options are.
  ```

  Pick one of its options.

- **Your agent keeps circling** — reworking the same thing, losing the thread of what you asked: start a fresh conversation and begin this chunk again from your last saved version.
- **The blocker is outside the app.** When this chunk was really built, the first attempt to go live failed because the hosting account had been suspended over a billing problem. Once the account was sorted out, the fix was one message:

  ```prompt
  Earlier we set this app up and connected it to its storage, but getting it live failed because my hosting account was suspended. I've fixed it now — it's on the free plan. Pick up where we left off: get the app live at a public web address I can open from my phone, and give me the link.
  ```

  Fix the outside thing, then tell your agent to resume — and say where you left off, because it will not remember.

<!-- The outside-blocker paragraph is grounded in the real thread-project build run, 2026-07 (archived evidence m4-c0). -->

## Save it

The moment the live link loads on your phone:

```prompt
Save this as a working version.
```

Your agent does every part of what that involves and never decides on its own that something is worth keeping.

From now on a save is four things in a row, and only the first two happen on your computer. The files change as your agent works. A save keeps a version of them on this computer, with a note. The copy goes up to the project's home page online — when the sending works. And the hosting service rebuilds the public copy from what went up — when the rebuild works. So the live link shows the last version whose rebuild succeeded: usually your last save, not guaranteed, and never the half-finished middle of a chunk.

The saved version on this computer is real the moment your agent confirms it — your way back whether or not the copy went up or the public copy rebuilt. So when it says "saved":

```prompt
Confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully.
```

Three answers, because any one can fail while the others hold. If the upload or the rebuild failed, you still have your saved version; say what you saw and let your agent find out why. The last answer is the one to wait for before you show anyone the live link.

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed.

1. The app opens at a public web address that anyone with the link can reach.
2. The page carries your project's name.
3. The live page and the page running on your own machine show the same thing.
4. Nothing labelled secret is anywhere a visitor to your live page could reach.

If your agent says "done" without showing these:

```prompt
Run the checks we agreed on and show me the results first.
```

You're done when the live link loads on your phone and you have a saved version. Next: a front door, so people can sign in with an email address and a password.

## Navigation

[← Previous: The plan: what you're building, and who with](./00-the-plan.md)
[Next: Sign in with an email and a password →](./02-sign-in.md)
