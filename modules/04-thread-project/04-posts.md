---
title: "Posts: write, edit, and delete your own"
module: "04-thread-project"
lesson_number: 04
est_minutes: 50
prereqs: ["03-profile"]
updated: "2026-09-08"
deviations: []
---

# Posts: write, edit, and delete your own

## What you'll have at the end

Posts a signed-in person writes, edits, and deletes on their own profile, with an optional picture, that anyone can read without signing in — and proof, by trying rather than by reading, that a post cannot end up under somebody else's name. Posts are the first thing other people come to the app to read, and the first thing carrying a claim the app has to keep true even when somebody leans on it: who wrote this.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

A signed-in person writes a short post, attaches one picture if they want, and it appears on their profile where the empty area was. They can edit or delete their own posts and nobody else's. Anyone can read posts on a profile, signed in or not. The thing to spot: a post that lies about who wrote it — somebody editing a post that was never theirs, or changing their own so it looks like yours. An app with those rules loose looks exactly like an app with them tight. The only way to tell is to try.

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say:

```prompt
Read the plan and the house rules, and tell me where we are.
```

Then:

```prompt
I want signed-in people to write a short text post, with an optional picture, that appears on their profile. They should be able to edit or delete their own posts, but nobody else's. And anyone, even signed-out visitors, should be able to read posts on a profile. Plan this out before you write any code, and tell me how you'll make sure one person can't edit a post to make it look like someone else wrote it. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: a signed-in person can write, edit, and delete their own post, with an optional picture; the post still shows the right author after an edit; a signed-out visitor can read posts and has no way to write, edit, or delete one; a signed-out attempt to store a post under somebody else's name is refused — tell me that in plain words, not as output for me to read.
```

Check the plan against what you asked for — write, edit, delete, your own only, an optional picture, readable by anyone — and that the last part came back as something specific rather than a reassurance. You are not grading how; you need the answer to exist. Then:

```prompt
That matches what I want. Go ahead and build it.
```

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c3); presented in the desktop app's framing. -->

Your agent may raise something first. When this chunk was really built, it pointed out that display names are not unique — two people can both call themselves Alice — and offered chosen handles as a fix, calling it a product decision rather than a fault. That one *is* yours: it changes what people see. "Leave handles for another time" was the answer. Say yes or say later; do not skip past it. Then approve the steps as the app asks.

<!-- CODEX / OPENCODE VERIFICATION SLOT: verify wording and app behavior against a real run in each app — user-assisted evidence pass -->

## Before anything touches your database

Posts need somewhere to live, so your database changes shape again. Your database has your profile in it now, so this is the first time the question is asked of something you could lose. Before you approve the change:

```prompt
Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today.
```

If your agent hands you something to paste instead of making the change itself, do it the way [Lesson 3](./03-profile.md) showed: the screen it names, the whole file, and the dashboard's warning held against the answer you got. If the warning names something the answer did not predict, press nothing and hand its words back.

## Check it

Open the running app — if nothing is open:

```prompt
Start the app on my computer and open it in my browser.
```

In order: write a post (it appears on your profile with its date); write a second one with a picture; edit the first; delete one and reload.

> **TRY THIS:** edit one of your own posts and save it.
>
> **EXPECT:** the edit lands, and the post still shows you as its author.
>
> **IF THE AUTHOR LINE CHANGES, OR THE EDIT SILENTLY VANISHES:**

```prompt
I edited my post and ⟨what you saw⟩. An edit should change the words, never whose post it is. Find out why and fix it.
```

> **TRY THIS:** open a private window that has never signed in, and open a profile with posts on it. Read them. Then look for any way to write, edit, or delete one.
>
> **EXPECT:** every post readable, pictures loading — and no box to write in, no Edit link, no Delete anywhere.
>
> **IF IT WORKS:**

```prompt
While signed out I could ⟨what you did⟩. A signed-out visitor should only be able to read. Fix that.
```

> **TRY THIS:** sign in as your second account, find a post the first account wrote, and try to edit or delete it — including by typing that post's editing address straight into the address bar.
>
> **EXPECT:** no controls, or refusal — and after a refresh the post is unchanged.
>
> **IF IT WORKS:**

```prompt
As ⟨account B⟩ I could ⟨edit/delete⟩ ⟨account A⟩'s post. Only its owner should be able to. Fix that.
```

One push nobody can make by clicking: storing a post with somebody else's name on it from outside the app entirely. That one your agent attempts, and you ask for:

```prompt
With nobody signed in at all, try storing a post with someone else's name on it as the author, and tell me in plain words what came back.
```

You want one thing back: refused rather than stored. If it came back stored, stop and use the first steer below.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c3). -->

When this chunk was really built, the agent made that attempt itself before anyone had clicked anything, and the database refused it; with nobody signed in, asking for the posts came back with an empty list rather than an error. In the app: the first post appeared with its date and an Edit link; the picture post showed its picture; editing changed the text, left the author alone, and added a small "· edited ·" marker; deleting removed the post and its picture. Signed out, the profile showed the remaining post with nothing to write, edit, or delete with. Signed in as the second person, opening the first person's editing address directly landed on a page-not-found — the agent's own note: *"the page 404s if the post isn't yours, but that's only tidiness — the lock is in the database."* The missing page is a courtesy. The refusal is the lock.

Your agent will describe the fences it built in the same calm tone whether or not they hold; Module 5's first walkthrough shows a build where this exact fence is down. The move that settles it is the one you just made: try to touch what is not yours, and expect refusal.

## If something is wrong

```prompt
I edited my post and the author name changed to someone else — that should never be possible. Find out why and fix it so a post always keeps its real author.
```

```prompt
I signed out, opened a profile, and the posts were gone or it made me sign in. Anyone should be able to read posts. Find out why and fix it.
```

- **A page says something does not exist** — "table not found" or wording close to it: the database change never went in. Say so, and your agent goes back to that step.
- **Your agent keeps circling:** start a fresh conversation and begin this chunk again from your last saved version.

## Save it

Look first, say the sentence second. Once you have clicked through it and it holds:

```prompt
Save this as a working version.
```

```prompt
Confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully.
```

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed.

1. A signed-in person can write, edit, and delete their own post, with an optional picture.
2. The post still shows the right author after an edit.
3. A signed-out visitor can read posts and has no way to write, edit, or delete one.
4. The signed-out attempt to store a post under somebody else's name was refused — reported in plain words, not as output for you to read.

If your agent says "done" without showing these:

```prompt
Run the checks we agreed on and show me the results first.
```

You're done when a signed-out window can read your posts and change nothing, your own edit keeps your name on the post, the second account is refused, and you have a saved version. Every profile is still an island; next you let one person follow another.

## Navigation

[← Previous: The profile page: name, bio, and photo](./03-profile.md)
[Next: Follow and followers: two lists that only go one way →](./05-follow.md)
