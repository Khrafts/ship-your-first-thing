---
title: "The feed: the people you follow, plus you"
module: "04-thread-project"
lesson_number: 06
est_minutes: 50
prereqs: ["05-follow"]
updated: "2026-09-07"
deviations: []
---

# The feed: the people you follow, plus you

## What you'll have at the end

One home feed carrying your own posts and the posts of everyone you follow, newest first — and a ninety-second try that catches the failure no screen announces: a feed that quietly leaves your own posts out, on a page that otherwise looks completely correct.

> **Following along:** Build this lesson's chunk in the app you picked in Module 0. The asks are written out for you; your agent's exact words and plan will differ from any this lesson describes, and that is normal.

> **Last verified:** 2026-08-17. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## What this adds

The home page becomes a feed: every post by someone you follow, plus your own, newest at the top, in one stream. Each post shows who wrote it, with their name and photo linking to their profile, and an Edit link on the ones you wrote. The feed takes the names you follow, adds your own name to that handful, and shows every post by one of those names. "Add your own name" is the line that goes wrong — leave it out and nothing breaks, no error, no blank page, just a feed with a hole in it the size of everything you have ever written.

```mermaid
flowchart TD
  Follows["The names you follow"]
  Own["Your own name"]
  Names["One handful of names"]
  Cards["Every post by one of those names"]
  Feed["Laid out newest first"]
  Follows --> Names
  Own --> Names
  Names --> Cards
  Cards --> Feed
```

## The ask

Start a fresh conversation with your project folder selected. If your agent does not open by saying where you are in the plan, say: *"Read the plan and the house rules, and tell me where we are."* Then:

> Build me a home feed. When I'm signed in, it should show the newest posts from the people I follow, and it should also include my own posts, all mixed together with the newest first. Plan how you'll do this before writing any code. Before you say "done", run these checks and show me the results in plain words — if you can't run one, say so instead of guessing: the feed shows the newest posts from the people I follow and my own posts, newest first, in one stream; a person who follows nobody at all still sees their own posts on their feed; a new post from a followed account appears in the feed after a refresh.

Read the plan for two things: that it says your own posts are included, and that it names how you will be able to tell — in things you can see by clicking. If it does not name the case where you follow nobody at all, ask before you approve anything:

> Before you build: how will I be able to tell my own posts are in the feed if I follow nobody at all?

When the answer names a case you can produce by clicking:

> That's exactly what I want — my own posts included, newest first. Go ahead.

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c5); presented in the desktop app's framing. -->

No dashboard step this time — this chunk reads what is already there, under rules you already ran. Your agent may ask questions before it plans: when this chunk was really built it asked whether the feed and the profile page should show posts the same way, written once (recommended — say yes; it is why this chunk touches the profile page too), and it reported that two of the project's own instructions contradicted each other and asked which wins (following the patterns already working in the project is a fine answer). Its plan listed how it expected to be checked — your own posts on the home page even when you follow nobody; a followed account's posts mixed into yours; post, tap Home, and it is at the top — which is the mark of a plan worth approving. Then approve the steps as the app asks.

<!-- CODEX VERIFICATION SLOT: verify wording and UI behavior against a real Codex run — user-assisted evidence pass -->

If your agent does hand you a file for your database during this chunk, ask what it needs to change and why the feed needs it, *and* the usual question — *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."* — and wait for both answers before you paste anything.

## Check it

Open the running app — *"Start the app on my computer and open it in my browser"* if nothing is open. The first check is the one this chunk stands or falls on.

> **TRY THIS:** sign in as your second account — the one that follows nobody — write a post from its profile, and open its feed. Then sign in as your first account, the one that followed the second last chunk, post something of your own, and open its feed too.
>
> **EXPECT:** on the second account, the post is there on a feed belonging to somebody who follows no one at all. On the first account, your newest post is at or near the top with the followed account's posts mixed in around it, newest to oldest — one stream, not two blocks.
>
> **IF YOUR OWN POSTS ARE MISSING:** *"My own posts aren't in my feed — the feed is the people I follow PLUS me. Fix that."*

> **TRY THIS:** in a private window that has never signed in, open the home page. Then open a profile address directly and read the posts on it.
>
> **EXPECT:** the home page lands you on sign-in or refuses — a feed belongs to somebody — while the profile still reads fine, posts and all.
>
> **IF YOU GET STRAIGHT IN:** *"Signed out, I can still open the feed. That should need an account. Fix that."*

> **TRY THIS:** signed in as the account that does the following, find a post in its feed that the other account wrote, and try to edit or delete it from there.
>
> **EXPECT:** Edit shows on your own posts and on nobody else's — and after a refresh their post is unchanged.
>
> **IF IT WORKS:** *"As ⟨account B⟩ I could ⟨edit/delete⟩ ⟨account A⟩'s post from the feed. Only its owner should be able to. Fix that."*

<!-- Grounded in the real thread-project build run, 2026-07 (archived evidence m4-c5). -->

Why the first check is a try and not a question: when this chunk was really built, the agent was first *asked* what makes your own posts show up in the feed. The answer was fluent and specific, in words nothing in this course will teach you to grade — and it ended in a prediction: follow nobody, and the feed is exactly your own posts. A prediction about the running app is a thing you can prove wrong in ninety seconds, so that is what happened next. Signed in as Bob, following nobody, the feed read "Your feed is empty. Follow someone, or write your first post on your profile." He posted, tapped Home, and there it was, with an Edit link. Alice, who followed Bob, saw Bob's newer post at the top with no Edit link, and her own older post under it with its Edit link; she posted again and hers went to the top. Bob's byline read "Unnamed" because he never set up a profile.

An answer, however concrete, is a claim; the app doing what the claim predicts is what settles it. A feed that confidently leaves your own posts out is the second failure Module 5 walks you through on purpose. You already have the check — one account, one post, one look.

The agent also listed what it had deliberately not built — no box for writing a post on the feed itself, no paging past the newest fifty, no page for a single post (the next chunk) — and flagged that the way the feed collects posts will not scale to very large following lists, so that is the first place to look if the feed ever feels slow. File it; do not fix it today.

## If something is wrong

- *"I posted something and then opened my feed, and it's completely empty even though I can see the post on my profile. Find out why my own posts aren't in my feed and fix it."*
- *"I see posts from people I follow, but never my own. I want both in the feed. Find out why and fix it."*
- These are also the steers for when an explanation sounded fine and the app disagreed with it. Do not argue with the explanation; say what you saw.
- **Your agent keeps circling:** start a fresh conversation and begin this chunk again from your last saved version.

## Save it

The profile page changed in this chunk too, so open a profile first and confirm posts still look the way they did. Then: *"Save this as a working version."* Then ask it to confirm all three: saved on this computer, the copy went up, and the live copy rebuilt successfully.

## What "done" means

You wrote these into the ask. Before you accept "done", your agent shows you the results in plain words. If it could not run one, that check is yours to run or ask about — never to count as passed.

1. The feed shows the newest posts from the people the signed-in person follows and their own posts, newest first, in one stream.
2. A person who follows nobody at all still sees their own posts on their feed.
3. A new post from a followed account appears in the feed after a refresh.

If your agent says "done" without showing these, say: "Run the checks we agreed on and show me the results first."

You're done when an account that follows nobody writes a post and finds it on its own feed, and you have a saved version. Next: a page for every post, so people can reply.

## Navigation

[← Previous: Follow and followers: two lists that only go one way](./05-follow.md)
[Next: Comments: a page for every post, and a thread under it →](./07-comments.md)
