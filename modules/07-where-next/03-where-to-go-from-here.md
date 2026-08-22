---
title: "Where to go from here"
module: "07-where-next"
lesson_number: "03"
est_minutes: 25
prereqs: ["02-the-loop-on-other-agents"]
updated: "2026-08-21"
deviations:
  - long-core-read
---

# Where to go from here

## Learning objective

By the end of this lesson, you will be able to name the two shapes of topic you can decline to learn without it ever costing you, test any topic you feel behind on against them, and pick from a short list of five the ones that match what you are actually going to do next — including deciding that none of them do.

## Why this matters

Lesson 2 left you with a loop that travels, which turns the last page of a course into a question: point it at what? The reflex at this moment is to answer with everything you noticed you did not understand on the way here, and there was plenty of it — six modules of an agent doing work you directed rather than performed. That reflex produces a list where every line is a debt, and a list like that is why people finish something and never open it again. What is missing at the end of a course is not more topics. It is somebody saying plainly which of them you are allowed to walk past.

> **Following along:** Nothing in this module runs — no build, no repair and no check — and nothing here touches your app. The app you finished Module 6 with is the app you keep, exactly as you left it. This lesson is a list and a decision: there is nothing to install, nothing to open, and nothing to have running beside you.

> **Last verified:** 2026-08-21. Seeing your agent behave differently from what this lesson shows? On the course site, open the lesson chat ("Ask about this lesson") and tell it what you see versus what the lesson says — it can help you reconcile the difference against this exact lesson. For the full record of changes, see [`WHAT-CHANGED.md`](../../WHAT-CHANGED.md).

## Core read

> **Deviation note:** This read runs longer than most in the course. Five topics each have to carry both halves of "is this for you?" — who it is for and who should walk past it — and the permission half has to come first and at full length, or it reads as a courtesy rather than as the point. Cutting either half turns the page back into a reading list, which is the one thing it exists not to be.

Start with the half nobody writes down, because it decides whether the other half is any use.

### Two shapes you can decline

Nearly everything you could go and learn from here falls into one of two shapes, and both of them you can leave where they are.

**The first shape is the work you spent six modules handing over.** What your agent is really doing underneath the word "save". What happens in the minutes between a saved version and the page being live. The machinery behind the parts of a page that answer a click. The rules the code follows about what kind of thing each value is allowed to be. All of it is real, all of it is knowable, and none of it gives you a move you do not already have. The one thing it would buy you is the ability to look over your agent's shoulder and check its work by reading it — and that is the single form of checking this course refuses, because it makes you feel safer without making you safer. What replaced it is what you already run: try the thing that should be refused and see whether it is refused, and ask what a step costs before you take one nobody can take back.

**The second shape is the screens and commands you never sit in front of.** A panel listing every file in a project. The version numbers written into a settings file. A window where you type instructions to a computer one line at a time. This course has kept your work in three places — the agent app, your browser, and your phone — and not one of those topics lives in any of them. A subject whose only home is a screen you do not operate is not a gap in your knowledge. It is furniture from somebody else's job.

Both shapes collapse into one question you can ask of anything you feel behind on: **if I learned this, what could I then do that I cannot do now?** If the honest answer is "check what my agent wrote" or "work somewhere I never work", it belongs on this page's other list, and you can put it down.

That is most of it. Which leaves five.

### The five, and what a pointer is

What follows is not curriculum. Each line names a topic, says who should follow it, says who should skip it, and sends you somewhere that goes into it properly — that is the whole of what a pointer is, and none of these five teaches its topic. They are **curated resources** (a short, dated set of pages this course does not control, picked because the people who own them keep them right, [→ GLOSSARY](../../GLOSSARY.md#curated-resources)) rather than more lessons wearing a link.

Every link carries a date, and the date means one thing: that is the day somebody opened it and confirmed it still reaches what the line says it reaches. Not the day it was added.

> **If one of these links is dead:** nothing here touches your app and there is nothing you need to fix — on the course site, open the lesson chat ("Ask about this lesson"), tell it which pointer you were following, and it can tell you what that pointer was about and what to search for instead.

**1. The rules about who can see and change what.** Your app already has them: Module 4 put them in, and Module 5 had you sign in as a second person and try to break one. Their name is **Row Level Security** (the rules deciding, one record at a time, who is allowed to read a thing and who is allowed to change it, [→ GLOSSARY](../../GLOSSARY.md#row-level-security)), and the other half of the same question is how an app goes on knowing it is still you long after you signed in. **Follow this if you are about to let other people into this app, or if it holds anything a person would mind a stranger reading.** **Skip it if the app stays yours alone** — nothing later depends on it, and the check you already run catches the case that matters.

- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — Supabase's own page on those rules, with worked examples of the ordinary cases, including the one your app is already living under. **Link last verified: 2026-08-21.**
- [User sessions](https://supabase.com/docs/guides/auth/sessions) — Supabase's own page on what "still signed in" is made of, how long it lasts, and what ends it. **Link last verified: 2026-08-21.**

**2. What the app is built out of, and why parts of it run in two places.** Your app has a name for what it is made of: **Next.js** (what the app is built with — the name printed on your own project screen, [→ GLOSSARY](../../GLOSSARY.md#nextjs)), which is itself built on **React** (the older and much larger thing underneath it, and the name most of the answers you find on the internet are really about, [→ GLOSSARY](../../GLOSSARY.md#react)). The part worth knowing exists, rather than knowing in detail: some of your page is finished before it ever reaches the person looking at it, and the rest of it only comes alive once it has arrived in their browser. The first kind has a name — **Server Components** (the parts of a page that are put together and finished before being sent, as opposed to the parts that wake up after they arrive, [→ GLOSSARY](../../GLOSSARY.md#server-components)) — and which side a piece lands on is what settles whether it can answer a click at all. **Follow this if you keep asking for things that answer a click, or if you are going to search the internet for help with your own app or describe it to another person** — these are the words those conversations happen in. **Skip it if you are finished building.** The app runs whether or not you can name any of it, and your agent has been choosing the sides for you since Module 4.

- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Next.js's own page on the split, with the reasons a piece goes on one side rather than the other. **Link last verified: 2026-08-21.**

**3. What happens when text somebody else wrote reaches the agent.** Module 6 stood you in front of this one: you pasted something a stranger had written, work you never asked for turned up in what came back, and you declined it. You already have the move — the question you ask before approving, and the three things you do after it, are in [When what you paste isn't yours](../06-after-live/03-when-what-you-paste-isnt-yours.md), and that lesson, not this line, is where you were armed. What sits beyond it is the catalogue: every shape this takes when people who study it professionally go looking, which is longer and stranger than the one you met. **Follow this if outside words are going to reach your agent regularly — bug reports, things your own users typed, anything that arrived from someone else.** **Skip it if the only words your agent ever gets are yours, describing what you want.** Reading the catalogue does not change the move; the move is already the move.

- [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — a security industry group's own catalogue of the shapes this takes and the defences raised against them, written for people building these systems rather than for people working with one. **Link last verified: 2026-08-21.**

**4. Checks that run themselves.** Since Module 4 you have made your agent show you a list of checks before it was allowed to call anything done. This is that same habit with the checks written down once instead of re-agreed each time. A check recorded that way is an **automated test** (a check written down in a form your agent can run again on demand and report back on, [→ GLOSSARY](../../GLOSSARY.md#automated-test)), and you ask for them the way you ask for everything else: "write tests for what we just built, run them, and show me the results." "Run themselves" means they do the clicking for you — not that anything happens without you asking. Your side of the line does not move: you say what should be true, your agent writes them and runs them, and what comes back is passes and failures in plain words. **Follow this if you will still be changing this app in six months and you are tired of clicking through the same five things by hand every time.** **Skip it if the app is finished** — written-down checks earn their keep by being re-run, and a project that has stopped changing has nothing to re-run them against. The definition of done you already insist on covers that case.

- [Testing](https://nextjs.org/docs/app/guides/testing) — Next.js's own page on the ways of doing this for an app built like yours. It is a page to hand your agent, not one to work from. **Link last verified: 2026-08-21.**

**5. The keys, and the day one leaks.** Two of the values your app runs on are keys, and in Module 4 you copied one of them off a dashboard with your own hands: one of the pair is meant to be seen, the other never leaves the dashboard. The topic is that pair, and the one afternoon they matter — the day you think one of them has gone somewhere it should not have. This lesson does not write down what to do on that day, deliberately. Both companies keep that procedure on their own pages, those pages change when the products change, and a copy sitting here would be the version that quietly goes wrong. **Follow this if your app holds anything belonging to other people, or if you have any reason to think a key has been somewhere it should not.** **Skip it if your app has no accounts and no data but your own** — there is nothing behind that door yet.

- [Understanding API keys](https://supabase.com/docs/guides/api/api-keys) — Supabase's own page on the two keys: which one is safe to be seen, which one is not, and what its dashboard offers when one has to be replaced. **Link last verified: 2026-08-21.**
- [Rotating environment variables](https://vercel.com/docs/environment-variables/rotating-secrets) — Vercel's own page on swapping a value your live site runs on without the site going down while you do it. **Link last verified: 2026-08-21.**

### What to do with five

Five is short on purpose. A longer list would have been easier to write and would have read as a syllabus, and a syllabus at the end of a course is a bill.

So the honest number to take from it is one, or none. Every one of the five is written to be declined by most people who read it, and the skip halves are not politeness — they say what is true, which is that nothing you build later stands on any of this. The one that is worth your afternoon is the one whose "follow this if" describes a thing you are actually about to do. If none of them does, you have finished, and the correct response to this page is to close it.

## Exercise

Nothing runs and nothing changes. The deliverable is a few lines at the bottom of the card you have been keeping since Lesson 1. About ten minutes.

1. **Go down the five and write one word beside each: now, later, or no.** Be honest rather than generous. A sheet with one "now" on it is a normal sheet, and a sheet with five "no"s is a finished one.
2. **Write the sentence that decided it.** One line: "the next thing I actually want to do with this app is ___." If you cannot finish that sentence, that is your answer to all five, and it is "no".
3. **Take one topic you have been feeling behind on that is not on the list** — there will be one — and put it through the question from earlier: if I learned this, what could I then do that I cannot do now? Write the answer down in your own words. If it comes out as "check what my agent wrote" or "work somewhere I never work", write **declined** beside it, and mean it.
4. **Keep it with the cards from Lessons 1 and 2.** Three short cards in one findable place is the whole of what this module leaves in writing.

## Checkpoint

You've got this if you can do both:

1. Name the two shapes of topic you can decline, and run the one-question test on something you had been feeling behind on — out loud, to yourself, with a verdict at the end.
2. Take any one of the five and say both halves: who should follow it, and who should skip it. Then say which one you picked for yourself, "none" included.

## Going deeper

Optional, only if you're curious:

- The dates on those lines are the honest part of the list rather than decoration. Each one says somebody opened that page on that day and confirmed it still reached what the line claims. A page can move the week after, and no date can prevent that — what the date gives you is how much weight the line will bear, which is more than most reading lists ever tell you.
- The two-shape test outlives this list. Most "should I learn this?" questions answer themselves once you ask what new thing you could do afterwards, and notice how often the honest answer is that you would be able to check somebody else's work, or to stand somewhere you have never needed to stand.

## Loop check

> **Loop check — intent.** This page is **intent**, at the widest the course ever asks for it. Every ask you have written ran downhill from an intent — a small one, held for one change, for one afternoon. The same move at this size is choosing what the next months are for, and it is still the move that lives in you rather than in a conversation: nothing on this page asks the agent for anything, and there is no check on it either, because a check needs something running and nothing here runs. What you are deciding is where to point a loop that already works. That is where the course started, and it is a reasonable place for it to stop.

## What you just did

You went down five topics and wrote one word beside each of them, said in one sentence what you actually want to do next, and took something you had been carrying as a debt and declined it out loud. That is the last thing this course asks of you, and it is deliberately the smallest.

What you are left with is not a reading list. It is an app you built, put in front of other people, held steady when it broke, and changed while it was live — plus three moves for the session, a loop that survives the tool it was learned in, and a short honest account of what is not worth your time. The course ends here. The app does not.

## Navigation

[← Previous: The loop on other agents](./02-the-loop-on-other-agents.md)

This is the last lesson of the course. There is no Module 8 — what comes next is your own app, and whichever of those five, if any, you decided was worth an afternoon.
