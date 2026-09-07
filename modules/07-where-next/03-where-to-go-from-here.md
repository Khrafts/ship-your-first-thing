---
title: "Where to go from here"
module: "07-where-next"
lesson_number: "03"
est_minutes: 25
prereqs: ["02-the-loop-on-other-agents"]
updated: "2026-09-07"
deviations: []
---

# Where to go from here

By the end of this lesson you can tell which topics you can safely decline to learn, and pick from five next topics the ones that match what you are actually going to do, including none.

> **Last verified:** 2026-08-21. If your agent behaves differently from what this lesson describes, open the lesson chat on the course site ("Ask about this lesson") and tell it what you see. Change log: [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

Nothing in this module runs, and nothing touches your app. This lesson is a list and a decision.

## Two kinds of topic you can decline

**The work you spent six modules handing over.** What your agent really does underneath the word "save". What happens between a saved version and the page being live. The machinery behind the parts of a page that answer a click. None of it gives you a move you do not already have. The one thing it would buy you is checking your agent's work by reading it, and that is the one form of checking this course refuses, because it makes you feel safer without making you safer.

**The screens and commands you never sit in front of.** A panel listing every file in a project. Version numbers in a settings file. A window where you type instructions to a computer one line at a time. Your work has lived in the agent app, your browser, and your phone; none of those topics lives in any of them.

One question sorts anything you feel behind on: **if I learned this, what could I then do that I cannot do now?** If the honest answer is "check what my agent wrote" or "work somewhere I never work", put it down.

## Five pointers

Each names a topic, says who should follow it and who should skip it, and links to a page this course does not control. None of the five teaches its topic. Each link carries the date somebody last opened it and confirmed it still reaches what the line says.

> **If a link is dead:** nothing here touches your app. On the course site, open the lesson chat ("Ask about this lesson"), say which pointer you were following, and it can tell you what to search for instead.

**1. The rules about who can see and change what.** Your app already has them: Module 4 put them in, and Module 5 had you sign in as a second person and try to break one. Their name is **Row Level Security** (the rules deciding, one record at a time, who may read a thing and who may change it, [→ GLOSSARY](../../GLOSSARY.md#row-level-security)). The other half of the same question is how an app keeps knowing it is still you after you signed in. **Follow this if** you are about to let other people into this app, or it holds anything a person would mind a stranger reading. **Skip it if** the app stays yours alone.

- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — Supabase's own page on those rules, with worked examples including the one your app already lives under. **Link last verified: 2026-08-21.**
- [User sessions](https://supabase.com/docs/guides/auth/sessions) — Supabase's own page on what "still signed in" is made of, how long it lasts, and what ends it. **Link last verified: 2026-08-21.**

**2. What the app is built out of, and why parts of it run in two places.** Your app is built with **Next.js** (the name printed on your own project screen, [→ GLOSSARY](../../GLOSSARY.md#nextjs)), which is built on **React** (the larger thing underneath it, and the name most answers on the internet are really about, [→ GLOSSARY](../../GLOSSARY.md#react)). Some of your page is finished before it reaches the person looking at it; the rest comes alive once it arrives in their browser. The first kind is called **Server Components** (the parts of a page put together before being sent, as opposed to the parts that wake up after they arrive, [→ GLOSSARY](../../GLOSSARY.md#server-components)), and which side a piece lands on decides whether it can answer a click. **Follow this if** you keep asking for things that answer a click, or you will search the internet for help with your app or describe it to another person; these are the words those conversations use. **Skip it if** you are finished building.

- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Next.js's own page on the split and the reasons a piece goes on one side rather than the other. **Link last verified: 2026-08-21.**

**3. What happens when text somebody else wrote reaches the agent.** Module 6 stood you in front of this: you pasted something a stranger wrote, work you never asked for turned up, and you declined it. The move is in [When what you paste isn't yours](../06-after-live/03-when-what-you-paste-isnt-yours.md). Beyond it is the catalogue of every shape this takes. **Follow this if** outside words will reach your agent regularly: bug reports, things your users typed, anything from someone else. **Skip it if** the only words your agent gets are yours. Reading the catalogue does not change the move.

- [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — a security industry group's catalogue of the shapes this takes and the defences against them, written for people building these systems. **Link last verified: 2026-08-21.**

**4. Checks that run themselves.** Since Module 4 your agent has shown you its checks before saying done. This is the same checks written down once, so they can be re-run on demand. Such a check is called an **automated test** (a check written down in a form your agent can run again and report on, [→ GLOSSARY](../../GLOSSARY.md#automated-test)). You ask for them the way you ask for anything: *"Write tests for what we just built, run them, and show me the results."* You say what should be true; your agent writes and runs them; what comes back is passes and failures in plain words. **Follow this if** you will still be changing this app in six months and are tired of clicking through the same five things by hand. **Skip it if** the app is finished.

- [Testing](https://nextjs.org/docs/app/guides/testing) — Next.js's own page on the ways of doing this for an app built like yours. A page to hand your agent, not one to work from. **Link last verified: 2026-08-21.**

**5. The keys, and the day one leaks.** Two of the values your app runs on are keys, and in Module 4 you copied one off a dashboard yourself: one of the pair is meant to be seen, the other never leaves the dashboard. The topic is the day you think one has gone somewhere it should not have. This lesson does not write down what to do that day, because both companies keep the procedure on their own pages and those pages change. **Follow this if** your app holds anything belonging to other people, or you have any reason to think a key has been somewhere it should not. **Skip it if** your app has no accounts and no data but your own.

- [Understanding API keys](https://supabase.com/docs/guides/api/api-keys) — Supabase's own page on the two keys: which is safe to be seen, which is not, and what its dashboard offers when one has to be replaced. **Link last verified: 2026-08-21.**
- [Rotating environment variables](https://vercel.com/docs/environment-variables/rotating-secrets) — Vercel's own page on swapping a value your live site runs on without the site going down. **Link last verified: 2026-08-21.**

## What to do with five

The honest number to take from this list is one, or none. Nothing you build later stands on any of it. The one worth your afternoon is the one whose "follow this if" describes something you are actually about to do. If none does, you have finished, and the right response to this page is to close it.

## Your turn

Nothing runs. A few lines at the bottom of the card you have kept since Lesson 1. About ten minutes.

1. Go down the five and write one word beside each: now, later, or no. One "now" is a normal sheet; five "no"s is a finished one.
2. Write the sentence that decided it: "the next thing I actually want to do with this app is ___." If you cannot finish it, the answer to all five is "no".
3. Take one topic you feel behind on that is not on the list and ask: if I learned this, what could I then do that I cannot do now? If the answer is "check what my agent wrote" or "work somewhere I never work", write **declined** beside it.
4. Keep it with the cards from Lessons 1 and 2.

What you are left with is not a reading list. It is an app you built, put in front of other people, held steady when it broke, and changed while it was live. The course ends here. The app does not.

## Navigation

[← Previous: The loop on other agents](./02-the-loop-on-other-agents.md)

This is the last lesson. There is no Module 8.
