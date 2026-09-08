# Module 4 — Designing & building the thread project

This is where you stop practicing and start shipping. Across nine lessons you build one real product — a small social app where people sign in, keep a profile, write posts, follow each other, read a feed, comment, and like. The first lesson writes down what you're building; the eight after it build it, one feature at a time. Each feature ends with something you can see in a browser and a saved version you can go back to.

Your coding agent writes every line of code, chooses every tool and service, and installs anything the project needs. You decide what gets built, look at the running app, try the things that should be refused, and say when to save. Every ask in this module is written once and works in whichever of the three apps you picked in Module 0.

## What this module builds

By the end you have a live social app at a public address. Someone signs in with an email address and a password, sets a name and a bio and a photo, writes posts, follows other people, reads one feed of the newest posts from the people they follow plus their own, opens a post and comments on it, and likes it.

Done looks like this: you open the live link in two different browsers, sign in as two different people, and watch the two accounts behave correctly toward each other — one follows the other and shows up in the right list, each feed carries the right posts, each person can edit only their own words, and a signed-out visitor can read the public parts without being able to change anything.

- **Lesson 0 — The plan:** write down with your agent what your app is, who it's for, and the eight features in build order, and give it the house rules it follows for the rest of the module.
- **Lesson 1 — Put your app online:** an empty app at a public address, checked from your phone.
- **Lesson 2 — Sign in:** an email address and a password; stays signed in across a reload; sign out.
- **Lesson 3 — The profile page:** name, bio, photo — anyone can look, only the owner can change.
- **Lesson 4 — Writing posts:** write, edit, and delete your own posts, with an optional picture; signed-out visitors can read them.
- **Lesson 5 — Follow and followers:** follow, unfollow, two lists — and following someone never makes them follow you back.
- **Lesson 6 — The feed:** the newest posts from the people you follow plus your own.
- **Lesson 7 — Comments:** a page for every post; signed-in people comment; only a comment's author can edit or delete it.
- **Lesson 8 — Likes, then live:** a like count that moves the instant you click, then the whole app checked at its public address with two accounts in two browsers.

## How this module works

**Your agent owns the code and the choices underneath it** — which services hold your accounts and data, where the app is hosted, how the data is shaped, the rules about who may see and change what, which files to touch, every error, and every tool that has to be installed. None of that is taught here, and you are never asked to write, read, or repair it.

**You own four things:**

1. **Saying what you want.** "Signed-out visitors should be able to read the posts on my profile but not write one." What, not how. Every ask starts from the plan you write in Lesson 0.
2. **Looking at the running app.** Open it, click things, sign out and look again, sign in as a second person in a second browser. Almost everything that goes wrong is visible from the outside. The running app is the copy your agent starts on your own computer — when nothing is open, say:

   ```prompt
   Start the app on my computer and open it in my browser.
   ```

   The live link is the other copy, rebuilt from each save that goes up. Both copies use the same database.
3. **Running each lesson's checks.** Short lists of things to try in the running app, and one question to ask before anything you can't take back. The two shapes are below.
4. **Saying when to save.** The moment a feature works:

   ```prompt
   Save this as a working version.
   ```

   Then ask for all three parts of the answer — saved on this computer, the copy went up, and the live copy rebuilt successfully — because each can fail while the others hold. The saved version on this computer is your way back the moment your agent confirms it. When your agent has been heading the wrong way for several turns, start a fresh conversation with the same folder selected and restart the chunk from that saved version.

**Nothing needs installing or setting up by you.** Assume this computer has none of the tools a web app needs. One of the house rules you give your agent in Lesson 0 is that whenever a step needs a tool, a service, or an account, it tells you what it's for, does the installing and setting up itself, and asks you only for the things only you can do — creating an account in your browser, typing a password into a sign-in window it names, or saying yes to spending money. You never type a command and never paste a password into the conversation. The house rules are an agreement, not a setting the app enforces — which is why every lesson keeps its checks.

**When your agent asks you a technical question**, it is asking you to make a choice it should make. Hand it back:

```prompt
You choose — pick the simplest option that's easy to change later, and tell me in one line what you picked. Only ask me about things that change what people see, what it costs, who can see what, or which accounts I need to sign in to.
```

Questions about *what the app does* are yours to answer in your own words. Questions about how it is built are not.

## What your checks look like

Two moves, and neither asks you to look at anything your agent wrote.

**Try the thing that should be refused.** In the running app, do what should NOT be allowed and confirm the app stops you. From Lesson 2 onward every chunk has at least one.

> **TRY THIS:** open a private browser window that has never signed in, read what should be public, then try to change something.
>
> **EXPECT:** reading works, and every way of changing anything is missing, switched off, or bounces you to the sign-in page.
>
> **IF IT WORKS,** hand it back in one sentence:

```prompt
While signed out I could delete a post. A signed-out visitor should only be able to read. Fix that.
```

**Ask before anything you can't take back.** Before your agent changes information that already exists in your project — and before anything it asks you to type or paste into a dashboard:

```prompt
Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today.
```

If a dashboard shows its own warning, and the warning matches the answer you got, continue. If the warning names something the answer didn't predict — or you never asked — press nothing, and hand the warning's words back to your agent.

**And one thing your agent does.** Every ask in this module ends with the short list of checks your agent must run and show you before it may say "done". If "done" arrives without that report:

```prompt
Run the checks we agreed on and show me the results first.
```

If it says it could not run one of the checks, that check is yours to run or ask about — never to count as passed.

## Lessons in this module

0. [`00-the-plan.md`](./00-the-plan.md) — what you're building, who it's for, and the order it gets built in
1. [`01-hello-world-deploy.md`](./01-hello-world-deploy.md) — an empty app at a public address
2. [`02-sign-in.md`](./02-sign-in.md) — sign in with an email and a password
3. [`03-profile.md`](./03-profile.md) — name, bio, photo
4. [`04-posts.md`](./04-posts.md) — write, edit, delete your own posts
5. [`05-follow.md`](./05-follow.md) — follow, unfollow, and two lists
6. [`06-feed.md`](./06-feed.md) — the people you follow, plus you, newest first
7. [`07-comments.md`](./07-comments.md) — a page per post, with its thread
8. [`08-likes-and-go-live.md`](./08-likes-and-go-live.md) — likes, then the whole app checked live

## Before you start

You need Module 0's build (Lesson 6), Module 2 Lesson 3, and Module 3 finished. Module 1 is the shape of a web product — read it if you like, or read each lesson the first time a chunk points at it.

## Navigation

[← Module 3 — The loop in depth](../03-the-loop/README.md)
[Next: Module 5 — Operating the build →](../05-operating/README.md)
