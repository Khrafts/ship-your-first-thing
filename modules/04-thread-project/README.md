# Module 4 — Designing & building the thread project

Module 4 is where you stop practicing and start shipping. Across nine lessons you build one real product — the thread project, a small social app where people sign in, keep a profile, write posts, follow each other, read a feed, comment, and like. The first lesson writes down what you're building; the eight after it build it, one feature chunk at a time, each ending in a working thing you can see and a saved version you can go back to. Your coding agent writes every line of code. You decide what gets built, check the running app against what you asked for, and say when to save.

Every build lesson runs the full loop you named in Module 3 — intent → ask → evaluate → steer — once per chunk. `evaluate` carries the most weight in this module, because every chunk ends with you opening the running app and comparing it against what you actually asked for.

Every ask in this module is written once and works in either taught app. You run only the app you picked in Module 0.

## What this module builds

By the end of this module you have a live social app at a public address that other people can open. Someone signs in with an email address and a password, sets a name and a bio and a photo, writes posts, follows other people, reads one feed of the newest posts from the people they follow plus their own, opens a post and comments on it, and likes it.

Done looks like this: you open the live link in two different browsers, sign in as two different people, and watch the two accounts behave correctly toward each other — one follows the other and shows up in the right list, each feed carries the right posts, each person can edit only their own words, and a signed-out visitor can read the public parts without being able to change anything.

Each lesson builds on the last:

- **Lesson 0 — The plan:** co-write, with your agent, what your app is, who it's for, and the eight features in the order they get built → sets up Lesson 1 by giving every later ask a written thing to point back at.
- **Lesson 1 — Hello-world deploy:** get an empty app onto a public address — your first **deploy** (a one-line definition: moving an app off your own machine to a public address anyone on the internet can reach, [→ GLOSSARY](../../GLOSSARY.md#deployment)) — the first feature on the plan's list, and the only one with nothing on it to look at, so every later chunk ships onto something already known to work → sets up Lesson 2 with a live app nobody can sign in to yet.
- **Lesson 2 — Sign in with an email and a password:** people sign up and sign in with an email address and a password, stay signed in when the page reloads, and can sign out → sets up Lesson 3 with a signed-in person who has nothing to their name yet.
- **Lesson 3 — The profile page:** a name, a bio, and a photo — anyone can look at a profile, only its owner can change it → sets up Lesson 4 by leaving an empty space on the profile where posts will go.
- **Lesson 4 — Writing posts:** write, edit, and delete your own posts, with an optional image, and let signed-out visitors read them → sets up Lesson 5 with every profile still an island, because nobody can follow anybody.
- **Lesson 5 — Follow and followers:** follow another person, unfollow them, and see both lists on a profile — following someone does not make them follow you back → sets up Lesson 6 with a set of people whose posts now need somewhere to land.
- **Lesson 6 — The feed:** one page carrying the newest posts from the people you follow and your own, newest first → sets up Lesson 7 by putting posts in front of readers who want to reply.
- **Lesson 7 — Comments:** every post gets a page anyone can open and read; signed-in people can comment, and only a comment's author can edit or delete it → sets up Lesson 8 with one reaction still missing.
- **Lesson 8 — Likes, then live:** a like count that moves the instant you click, then the whole app re-checked live with two real accounts → sets up Module 5, where you operate what you shipped.

The thread that ties it together: one app grows across eight chunks and never stops working. Each chunk ends with a feature you can see in a browser and a saved version you can return to, so you are never more than one chunk away from something that worked.

## How this module works

You are not writing this code. Your agent is. The split is the same in every lesson, and no lesson crosses it.

**The agent owns the code.** How the data is shaped. How the rules about who may see and change what get written. What happens between a click in your browser and the **server** (a one-line definition: a program that runs continuously, waiting for requests, [→ GLOSSARY](../../GLOSSARY.md#server)) that answers it. Which files to touch, and every error that shows up along the way. None of that is taught here, and you are never asked to write, read, or repair it.

**You own four things:**

1. **Stating intent at the feature level.** "Signed-out visitors should be able to read the posts on my profile but not write one." What, not how. Every lesson starts here, and every lesson's ask starts from the plan you wrote in Lesson 0.
2. **Observing the running app.** Open it. Click things. Sign out and look again. Sign in as a second person in a second browser and watch how the two accounts see each other. Almost everything that goes wrong in this module is visible from the outside.
3. **Running the chunk's checks.** Each lesson hands you a short list of things to try in the running app, and the questions to ask before anything you can't take back. They are described below.
4. **Saying when to save.** The moment a feature works, you tell your agent to save it: *"Save this as a working version."* Your agent handles every part of what that involves — **git** (a one-line definition: the tool from Module 2 that keeps every version of your project so you can go back to one, [→ GLOSSARY](../../GLOSSARY.md#git)), the project's home page online, all of it — and it never decides on its own that something is worth keeping. That saved version — a **commit** (a one-line definition: one saved snapshot of the project, with a one-line note about what changed, [→ GLOSSARY](../../GLOSSARY.md#commit)) — is your way back when the next chunk goes sideways. And when your agent has been heading the wrong way for several turns, start a fresh conversation and restart the chunk from that saved version — the same recovery move you learned in Module 3.

### What your checks look like

A **smell-test** (a one-line definition: a check you run without reading a line of code — you try something and watch what the app does, [→ GLOSSARY](../../GLOSSARY.md#smell-test)) in this module is always one of exactly two moves. Neither of them asks you to look at anything your agent wrote.

**The refusal check.** A **refusal check** (a one-line definition: in the running app, you try the thing that should not be allowed and confirm the app turns you down, [→ GLOSSARY](../../GLOSSARY.md#refusal-check)) is how you test a fence by walking into it. From Lesson 2 onward, every chunk carries at least one.

> **TRY THIS:** open a private browser window that has never signed in, read what should be public, then try to change something.
>
> **EXPECT:** reading works, and every way of changing anything is missing, switched off, or bounces you to the sign-in page.
>
> **IF IT WORKS:** hand it back in one sentence — *"While signed out I could delete a post. A signed-out visitor should only be able to read. Fix that."*

**The pre-flight question.** A **pre-flight question** (a one-line definition: before a step you can't take back, you ask your agent a named question about what it changes, and wait for the answer, [→ GLOSSARY](../../GLOSSARY.md#pre-flight-question)) comes before, never after. It is due ahead of anything you paste into a dashboard, and ahead of anything that runs against information already in your project.

> **BEFORE YOU PASTE:** *"Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today."*
>
> **THEN:** if the dashboard's own warning matches the answer you got, continue. If the warning names something the answer didn't predict — or you never asked — press nothing, and hand the warning's words back to your agent.

**And the third layer, which is your agent's job, not yours.** Every chunk ends with a **definition of done** (a one-line definition: the checks your agent must run and show you, in plain words, before it may say a piece of work is finished, [→ GLOSSARY](../../GLOSSARY.md#definition-of-done)) — agreed before the work starts, run by your agent, reported to you in plain words. Your side is one sentence: when "done" arrives without the report, say *"Run the checks we agreed on and show me the results first."*

## Lessons in this module

All nine lessons are published — every link below is live. The filenames and their order are fixed, so this is the sequence you will work through:

0. [`00-the-plan.md`](./00-the-plan.md) — what you're building, who it's for, and the order it gets built in
1. [`01-hello-world-deploy.md`](./01-hello-world-deploy.md) — an empty app at a public address, before there is anything on it to see
2. [`02-sign-in.md`](./02-sign-in.md) — sign in with an email and a password, and stay signed in across a reload
3. [`03-profile.md`](./03-profile.md) — name, bio, photo: anyone looks, only the owner changes
4. [`04-posts.md`](./04-posts.md) — write, edit, delete your own posts; signed-out visitors can read them
5. [`05-follow.md`](./05-follow.md) — follow, unfollow, and two lists that stay one-directional
6. [`06-feed.md`](./06-feed.md) — the people you follow, plus you, newest first
7. [`07-comments.md`](./07-comments.md) — a page per post; signed-in people reply, authors edit their own
8. [`08-likes-and-go-live.md`](./08-likes-and-go-live.md) — a count that moves on click, then the whole app re-checked live

## Before you start

You need Modules 0 through 3 finished, all of them. Module 0 got your accounts and your agent app running; Module 1 gave you the shape of a web product; Module 2 gave you the machinery your agent drives; Module 3 gave you the loop. This module uses all four of them, in every chunk.

## Navigation

[← Module 3 — The loop](../03-the-loop/README.md)
[Next: Module 5 — Operating the build →](../05-operating/README.md)
