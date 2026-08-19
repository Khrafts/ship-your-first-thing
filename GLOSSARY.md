# Glossary

**Purpose:** Every domain and tool term used in the course is defined here, plainly, with a one-line definition and a short example. Lessons link into this file via the vocab callout pattern: `**term** (definition, [→ GLOSSARY](../../GLOSSARY.md#term))`. Each anchor below corresponds to a vocab callout used in a lesson.

**Structure:** Alphabetized within each section. Each entry has the format:

> ### term
> One-line plain-English definition. *Example or context.*
> Used in: `[→ source lesson](path/to/lesson.md)`.

**Reading the `Used in:` line.** It answers one question — where in the course does this word actually appear? — and it has two readings, told apart by the wording of the line itself. Most entries name the lessons that **link here through a vocab callout**; that link is the contract this file exists to keep. Some name a lesson that only **uses the word in passing**, with no callout and no link back. A few say no lesson uses the term at all.

**How to contribute:** See `CONTRIBUTING.md`. The norm is: when a lesson uses a term for the first time, the lesson author adds an entry here in the same PR. If you find a vocab callout in a lesson without a matching anchor here, file an issue or PR a fix.

**Scope note (re-cut 2026-08-19).** This file was re-cut for the shape the course has now: the learner works inside an agent app, approves what the agent proposes, and is never asked to open a terminal or type a command. Terms that existed only to describe hand-run tooling — the browser-hosted workspace, the package manager, the JavaScript runtime, the typed session commands — were removed rather than redefined, along with the terms belonging to the read-the-code module retired 2026-08-12 and to the free-path command-line agent retired the same day. No current lesson linked to any of them. Terms the learner still meets are defined here by what they **say** to the agent or **see** in the running app, never by the mechanics underneath.

---

## A

### agent-loop
The iterative cycle of intent → ask → evaluate → steer, repeated until the AI agent has produced what you wanted. *Example: every Module 3 lesson is one or more turns of the agent loop.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

### ai-coding-agent
A program that reads your project files, plans changes, and writes code on your behalf — guided by a conversation with you, from inside its own app window. *Example: Claude Code desktop (Path 1) and Codex inside the ChatGPT desktop app (Path 2) are the two AI coding agents this course teaches.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md), [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md), [Module 0 — Install your agent app](./modules/00-welcome/05-install-your-agent-app.md), [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md).

### api
The contract between two programs about which questions can be asked and how the answers will look. *Example: "the Twitter API supports `GET /2/tweets/:id`."*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### api-key
A long string that identifies your account when a program calls a paid (or rate-limited) service on your behalf. Treat it like a password: never paste it into a conversation you do not control, never let it into a public project. *Example: neither taught path asks you for one — you sign in to your agent app with a Claude account or a ChatGPT account, and the app carries your identity for you.*
Used in: no current lesson. The pay-per-use path that needed a key was retired 2026-08-12; [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md) records that retirement.

### ask
The "ask" step of the agent loop — writing a specific request the agent can act on, given the intent. *Example: turning the intent "I want today's date below the tagline" into the ask "Add today's date below the tagline."*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md), [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md), [Module 3 — Reading plans + recognizing wrong output](./modules/03-the-loop/03-reading-plans-recognizing-wrong.md), [Module 3 — Steering and recovery](./modules/03-the-loop/04-steering-and-recovery.md).

### authentication
Confirming you are who you claim to be. Sometimes shortened to "authn." *Example: a password check, or clicking a magic link sent to your email.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### authorization
Deciding what an identified user is allowed to do. Sometimes shortened to "authz." *Example: a logged-in user can edit their own posts but not someone else's.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

## B

### branch
A separate line of saved versions, used to try something without disturbing the version that already works. Your agent starts one and folds it back in; you ask in plain words and never operate it yourself. *Example: "try that on a separate line of work and leave the working version alone" is the whole of your side of it.*
Used in: no lesson calls it out; [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md) names it in passing, in the line about every push to the main branch going through the pipeline. Module 2's save system stops at saving and sending up.

### browser
A program on your computer that knows how to ask servers for webpages and render them. *Example: Chrome, Firefox, Safari.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## C

### ci-cd
Continuous integration / continuous deployment. The automated path from "a new version was saved" to "it's live on the internet." *Example: your agent saves a working version to GitHub, and Vercel picks it up, builds it, and serves the result — nobody clicks a deploy button.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### claude-code
Anthropic's AI coding agent, opening in its own desktop app window; this course's Path 1, the paid track. *Example: after installing it and signing in with a Claude account, you select the app's Code tab, point it at a project folder, and start asking for changes in plain language.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md), [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md), [Module 0 — Account creation](./modules/00-welcome/04-account-creation.md), [Module 0 — Install your agent app](./modules/00-welcome/05-install-your-agent-app.md), [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md).

### code-editor
A program for reading and editing source files by hand, with niceties like syntax highlighting and search across files. This course never asks you to open one — your agent app is the whole working environment. *Example: Module 2 Lesson 1 names it only to say there is no editor standing between you and the work.*
Used in: [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md).

### codex
The AI coding agent that lives inside the ChatGPT desktop app; this course's Path 2, the free track. *Example: after signing in with a ChatGPT account, a switch next to the message box moves you from ordinary chat into Codex.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md), [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md), [Module 0 — Account creation](./modules/00-welcome/04-account-creation.md), [Module 0 — Install your agent app](./modules/00-welcome/05-install-your-agent-app.md), [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md).

### commit
One saved working version of a project, carrying a one-line note about what changed. Your agent creates one when you tell it to save a working version. *Example: after a feature works, you say "save this as a working version, with a one-line note about what changed" — the agent makes the commit and confirms in plain words.*
Used in: [Module 4 overview](./modules/04-thread-project/README.md).

### context-window
The amount of text an AI agent can see at once — your conversation history plus anything it has read. It is finite, and nothing announces when the older parts scroll out of it; what you feel from the outside is the agent answering about the wrong thing. *Example: replies deep into a long session stop matching what you asked for, so you start a fresh conversation and say what you want again in full.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### cookie
A small piece of data the browser stores and re-sends to the same site on every request. *Example: a session cookie tells the server "this is the same Alice who logged in 5 minutes ago."*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

## D

### database
A program that stores structured data in tables and answers queries about it. *Example: PostgreSQL, Supabase's database engine.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### definition-of-done
The checks the agent must run and show you, in plain words, before it is allowed to say a piece of work is finished. Also called a **test gate**. *Example: before reporting the sign-in work finished, the agent shows that a brand-new email can sign in, that refreshing the page keeps them signed in, and that a signed-out visitor cannot reach account pages.*
Used in: [Module 4 overview](./modules/04-thread-project/README.md), [Module 4 — The plan](./modules/04-thread-project/00-the-plan.md), and Lessons [1](./modules/04-thread-project/01-hello-world-deploy.md), [2](./modules/04-thread-project/02-sign-in.md), [3](./modules/04-thread-project/03-profile.md), [4](./modules/04-thread-project/04-posts.md), [5](./modules/04-thread-project/05-follow.md), [6](./modules/04-thread-project/06-feed.md), [7](./modules/04-thread-project/07-comments.md), [8](./modules/04-thread-project/08-likes-and-go-live.md).

### dependency
A package your app needs in order to run at all. Your agent adds them and keeps the list current; the list is never yours to edit. *Example: the thread project needs several before it will start, and getting that list right is the agent's job.*
Used in: no current lesson.

### deployment
The act of moving an app from the machine it was built on to a public server so anyone on the internet can reach it. *Example: your agent saves the working version to GitHub, and Vercel builds and hosts the result at a public web address.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md), [Module 4 overview](./modules/04-thread-project/README.md), [Module 4 — Hello-world deploy](./modules/04-thread-project/01-hello-world-deploy.md), [Module 4 — Likes, then live](./modules/04-thread-project/08-likes-and-go-live.md).

### dns
Domain Name System — the system that translates a human-readable URL into the IP address of the actual server. *Example: when you type `example.com`, DNS resolves it to `93.184.216.34` so the browser knows which server to ask.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### drift
When an AI agent loses the thread of what it agreed to do — usually after a long session, after several scope-changes, or after the conversation history fills up. The agent stays fluent and confident, but starts working against an outdated version of the plan. *Example: an hour into a session, the agent changes something you told it to leave alone, because the "leave it alone" instruction is no longer in its working memory. Smell-test: the latest reply is about something you didn't ask for — restate what you want, from the top. Module 3 Lesson 2 goes deeper; Module 3 Lesson 4 teaches the recovery move, a fresh conversation and a tighter restart.*
Used in: [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md), [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md), [Module 3 — Steering and recovery](./modules/03-the-loop/04-steering-and-recovery.md).

## E

### environment-variable
A named setting the deployed app reads when it runs, kept outside the saved project — typically a secret or a per-environment value. *Example: `NEXT_PUBLIC_SUPABASE_URL` is listed as an environment variable on the Vercel settings screen; when the live site misbehaves but the app works on your own machine, the question to ask the agent is whether a setting is missing on the live site.*
Used in: [Module 4 — Likes, then live](./modules/04-thread-project/08-likes-and-go-live.md).

### evaluate
The "evaluate" step of the agent loop — reading the agent's output and deciding if it matches your intent. *Example: the agent says it added today's date; you open the page and confirm the date is there.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md), [Module 3 — Reading plans + recognizing wrong output](./modules/03-the-loop/03-reading-plans-recognizing-wrong.md).

### execution-conversation
An AI-agent session where you ask the agent to actually make the change. Distinct from a planning conversation (no code-writing) which often precedes it. *Example: "OK, please proceed with the plan" opens an execution conversation.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

## F

### foreign-key
A field in one row that points at the id of a row in another table. *Example: a `posts` row's `author_id` points at a row in the `users` table.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### free-tier
The portion of a paid service you can use at no cost — usually capped by hours, requests, or rate limits. *Example: Codex is included on ChatGPT's free tier, which OpenAI's own wording says is offered "for a limited time."*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

## G

### git
The save system underneath a project: machinery that records a complete working version every time the project is saved, so any earlier version can be returned to. Your AI coding agent operates it on your behalf; you never open it yourself. *Example: you tell your agent "save this as a working version" and git is what records it.*
Used in: [Module 0 — Install your agent app](./modules/00-welcome/05-install-your-agent-app.md), [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md), [Module 2 — The save system](./modules/02-toolchain/03-the-save-system.md), [Module 4 overview](./modules/04-thread-project/README.md), and Lessons [1](./modules/04-thread-project/01-hello-world-deploy.md), [2](./modules/04-thread-project/02-sign-in.md), [3](./modules/04-thread-project/03-profile.md), [4](./modules/04-thread-project/04-posts.md), [5](./modules/04-thread-project/05-follow.md), [6](./modules/04-thread-project/06-feed.md), [7](./modules/04-thread-project/07-comments.md), [8](./modules/04-thread-project/08-likes-and-go-live.md).

### github
A website that hosts code repositories — where a project's saved versions live, on a page of its own on the internet; Vercel and other deploy services watch GitHub for new code. *Example: this course lives in a GitHub repository at github.com.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md), [Module 0 — Account creation](./modules/00-welcome/04-account-creation.md), [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md), [Module 2 — The save system](./modules/02-toolchain/03-the-save-system.md).

## H

### hallucination
When an AI agent produces specific details that look correct but were invented — a file, a fact, a feature, a name it has no way of knowing. *Example: in Module 3 Lesson 3, both agents invented "favorite books" for a list, even though neither agent has any way of knowing the learner's actual favorites. Smell-test: it names something you never made or mentioned — ask "where did that come from?"*
Used in: [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md), [Module 3 — Reading plans + recognizing wrong output](./modules/03-the-loop/03-reading-plans-recognizing-wrong.md).

### html
The markup language that describes the structure of a webpage — a tree of elements like headings, paragraphs, links, and images. *Example: `<h1>Hello</h1>` is an HTML element.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### http
The protocol the web uses to send requests and responses between a browser and a server. *Example: clicking a link sends an `HTTP GET` request.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md), [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### http-method
The verb on an HTTP request — `GET`, `POST`, `PUT`, `DELETE` — that says what kind of operation you're asking for. *Example: `GET /posts` says "show me the posts"; `POST /posts` says "here's a new post; please save it."*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### http-status-code
A three-digit number summarizing how an HTTP request went. *Example: `200 OK` means success; `404 Not Found` means the resource doesn't exist; `500 Internal Server Error` means the server crashed.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## I

### intent
The "intent" step of the agent loop — knowing what you are trying to build before you start asking. *Example: "I want today's date below the tagline" is intent; "make the page nicer" is not.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

## L

### localhost
A web address that means "this same computer." Not reachable from the public internet — only the machine running the app can open it. *Example: while the app is running on your own machine it answers at a localhost address, and nobody else on the internet can reach it until it is deployed.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

## M

### markdown
A way of writing formatted documents using simple punctuation marks like `#` for headings, `*` for emphasis, and triple-backticks for code blocks. *Example: this course is written in markdown; you can read the source on github.com.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md).

### merge
Folding the work from a separate line back into the version that works. Agent-performed. *Example: you ask for the experiment to be brought into the working version, and your agent does the folding.*
Used in: no current lesson.

### multi-account-testing
The ritual of testing the live app as two real people at once — signed in as alice in one browser and bob in a different browser (or a private/incognito window) — to catch what single-user testing can't. *Example: alice follows bob, then both windows are checked against each other — does bob's Followers list show alice? does alice's own page still offer herself a Follow button?*
Used in: [Module 5 — Two people, one app](./modules/05-operating/01-two-people-one-app.md).

## O

### opencode-desktop
A third AI-coding-agent desktop app — genuinely free and genuinely capable, but the least user-friendly of the three: its free models are trial models offered for a limited time that may learn from what you submit, this course hasn't verified how it saves your work, and it's the least polished of the three, still in beta. *Example: this course names it once so you know it exists, and does not walk you through it.*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md), [Module 0 — Install your agent app](./modules/00-welcome/05-install-your-agent-app.md), [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md).

### over-engineering
When an AI agent does MORE than asked — building or adding whole structures, extra styling, or content nobody mentioned for a small request, because nothing in the ask said where to stop. The fix is a scope-tightening steer that restates what you actually wanted and then puts an edge on it: "Nothing else." *Example: in Module 3 Lesson 4, the open-ended ask "make the list look like a real bookshelf" got the list rebuilt in place as upright spines standing on a plank, each spine carrying a label the agent invented — far more than the wooden background and the extra line spacing the learner actually wanted.*
Used in: [Module 3 — Steering and recovery](./modules/03-the-loop/04-steering-and-recovery.md).

## P

### package
A bundled piece of reusable code, published so any project can pull it in. Your agent adds them and keeps track of them. *Example: date formatting, image handling, sign-in — each usually arrives as a package somebody else already wrote.*
Used in: no current lesson.

### planning-conversation
An AI-agent session where you ask the agent to describe what it WOULD do without writing code yet. *Example: a prompt starting with "Plan:" and ending with "Don't make changes yet" opens a planning conversation.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### pre-flight-question
Before any irreversible step — anything pasted into a dashboard, anything run against data that already exists — a named question you ask the agent about consequences, and wait for the answer before continuing. *Example: before pasting a database file into the Supabase SQL Editor, asking "Does this remove or overwrite anything that is already in my database? List exactly what changes for data that exists today." and waiting for the answer.*
Used in: [Module 4 overview](./modules/04-thread-project/README.md) and Lessons [1](./modules/04-thread-project/01-hello-world-deploy.md), [3](./modules/04-thread-project/03-profile.md), [4](./modules/04-thread-project/04-posts.md), [5](./modules/04-thread-project/05-follow.md), [6](./modules/04-thread-project/06-feed.md), [7](./modules/04-thread-project/07-comments.md), [8](./modules/04-thread-project/08-likes-and-go-live.md).

### prompt
The specific text you send to an AI agent describing what you want. *Example: "Add today's date below the tagline" is a prompt; a series of prompts plus the agent's responses is a session.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

### publishable-key
The one of Supabase's two dashboard keys that is safe to be seen — you copy it off the dashboard when the agent asks for it. The other key, labelled secret, never leaves the dashboard. *Example: pasting the value labelled "publishable key" — it begins `sb_publishable_` — from the Supabase API settings screen into the agent's chat when it asks for it during the first deploy.*
Used in: [Module 4 — Hello-world deploy](./modules/04-thread-project/01-hello-world-deploy.md).

### pull
Bringing GitHub's saved state back down to the machine you are working on. Agent-performed. *Example: your agent does this before it starts work on a project whose newest saved version lives on GitHub.*
Used in: no current lesson.

### push
Sending saved versions up from your computer to the project's home page on GitHub, so a copy survives even if your machine doesn't. Agent-performed — it's part of what "saved" means when your agent says it. *Example: after saving a working version, your agent sends it up, and that version appears on the project's home page on GitHub.*
Used in: no lesson calls it out; [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md) names it in passing, in the pipeline picture and again in its exercise. [Module 2 — The save system](./modules/02-toolchain/03-the-save-system.md) teaches the send-up without naming it.

## Q

### query
A written question asking the database for specific rows. *Example: a SQL query like `SELECT * FROM posts WHERE author_id = 7`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## R

### rate-limit
A cap on how many calls you can make to a service in a window of time, after which the service refuses or delays your calls until the window resets. *Example: on a free tier, once the day's allowance is used up the app asks you to wait before you can keep going.*
Used in: no current lesson. [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md) describes the free allowance running out without naming the cap.

### recovery-prompt
The message written after a check trips: saying exactly what was done and seen, then asking the agent to find and fix it — never fixing it yourself, never explaining the cause. *Example: "Signed in as bob, I edited a comment alice wrote, and the change stuck. Only a comment's author should be able to change it. Find out what allows this and fix it, then I'll run the same check again."*
Used in: [Module 5 — Two people, one app](./modules/05-operating/01-two-people-one-app.md), [Module 5 — The fence that was down](./modules/05-operating/02-the-fence-that-was-down.md), [Module 5 — The missing post](./modules/05-operating/03-the-missing-post.md).

### refusal-check
In the running app, trying the thing that should NOT be allowed and confirming it is refused; if it goes through, telling the agent exactly what you did and what should have stopped it. *Example: signing in as a second account and trying to edit a comment the first account wrote — the edit should be refused.*
Used in: [Module 4 overview](./modules/04-thread-project/README.md) and Lessons [2](./modules/04-thread-project/02-sign-in.md), [3](./modules/04-thread-project/03-profile.md), [4](./modules/04-thread-project/04-posts.md), [5](./modules/04-thread-project/05-follow.md), [6](./modules/04-thread-project/06-feed.md), [7](./modules/04-thread-project/07-comments.md), [8](./modules/04-thread-project/08-likes-and-go-live.md); [Module 5 — The fence that was down](./modules/05-operating/02-the-fence-that-was-down.md).

### regression
A working feature that breaks because of an unrelated change the agent made somewhere else. *Example: a fix to the feed accidentally breaks sign-in, so after any fix the checks that used to pass are re-run — not just the one thing that changed.*
Used in: no current lesson.

### repository
A project's full history of saved versions, tracked by git, with a home page of its own on GitHub. Often shortened to "repo." *Example: this course is one repository; the thread project becomes another one when your agent sets it up.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md), [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### request
A structured message asking a server for something — like a paper form handed to a receptionist. *Example: `GET /api/posts` is a request.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### response
A structured message replying to a request — like the receptionist's paper reply. *Example: a JSON array of posts is a response.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### risk-blindness
When an AI agent proposes something that cannot be undone — deleting work, wiping data, sending or spending — with the same calm as fixing a typo. The agent has no sense of stakes; every change reads the same to it. *Example: it proposes deleting the file that set up your database, to tidy up — routine-sounding to it, destructive to your project. Smell-test: any proposal that deletes something, sends something, or spends money gets one question first — "what could go wrong if we do this?" — and you wait for the answer before you approve. Module 5 puts you in the driver's seat for a real one.*
Used in: [Module 2 — Your AI coding agent](./modules/02-toolchain/01-your-ai-coding-agent.md), [Module 5 — The fence that was down](./modules/05-operating/02-the-fence-that-was-down.md).

### row
A single record in a database table — like one index card in a filing-cabinet drawer.
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## S

### schema
The fixed shape of fields in a database table. *Example: the `users` table's schema is `(id, email, display_name, created_at)`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### server
A program that runs continuously, waiting for requests, and sends back responses.
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md), [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md), [Module 4 overview](./modules/04-thread-project/README.md).

### session
A remembered "yes, you're you" so an app doesn't re-check identity on every request. Lives between authentication and the next sign-out. *Example: after you log in, the app remembers you for the next 24 hours.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### session-token
A string the browser sends with each request to prove "I'm the same person who just authenticated." Often delivered as a cookie. *Example: a JWT or an opaque session id.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### slash-command
A typed instruction starting with `/` inside an agent app, aimed at the session itself rather than at the work. *Example: this course teaches none of them — the session move it teaches is starting a fresh conversation, said in plain words. Typed session commands were retired from the course 2026-08-16.*
Used in: no current lesson.

### smell-test
A check you can run without reading a line of code — you try something and watch what the app does. It is a try, not a decode: never something you read or judge in the agent's changes, always something you do in the running app. It takes exactly two shapes: a **refusal check** (try the thing that should not be allowed and confirm it is refused) or a **pre-flight question** (before an irreversible step, ask the agent a named question about consequences and wait for the answer). *Example: signing in as a second account, trying to edit a comment the first account wrote, and telling the agent exactly what you did if the edit goes through.*
Used in: [Module 4 overview](./modules/04-thread-project/README.md) and Lessons [1](./modules/04-thread-project/01-hello-world-deploy.md), [2](./modules/04-thread-project/02-sign-in.md), [3](./modules/04-thread-project/03-profile.md), [4](./modules/04-thread-project/04-posts.md), [5](./modules/04-thread-project/05-follow.md), [6](./modules/04-thread-project/06-feed.md), [7](./modules/04-thread-project/07-comments.md), [8](./modules/04-thread-project/08-likes-and-go-live.md).

### sql
Structured Query Language — the standard way to ask a relational database for rows. *Example: `SELECT * FROM posts ORDER BY created_at DESC`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### steer
The "steer" step of the agent loop — course-correcting when the agent's output does not match your intent. *Example: "The date appeared above the tagline; please put it below" is a steer.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md), [Module 3 — Reading plans + recognizing wrong output](./modules/03-the-loop/03-reading-plans-recognizing-wrong.md), [Module 3 — Steering and recovery](./modules/03-the-loop/04-steering-and-recovery.md).

### supabase
The service that gives the thread project an account system, a database, and file storage in one. You say its name in prompts to the agent and operate its dashboard — the SQL Editor, the key-copy screens — without learning its internals. *Example: the first deploy connects the empty app to a Supabase database before any feature exists.*
Used in: Module 4 Lessons [1](./modules/04-thread-project/01-hello-world-deploy.md), [2](./modules/04-thread-project/02-sign-in.md), [3](./modules/04-thread-project/03-profile.md), [4](./modules/04-thread-project/04-posts.md), [5](./modules/04-thread-project/05-follow.md), [6](./modules/04-thread-project/06-feed.md), [7](./modules/04-thread-project/07-comments.md), [8](./modules/04-thread-project/08-likes-and-go-live.md).

## T

### token-discipline
The habits that keep agent sessions cheap and clear-headed — on a flat monthly plan and inside a free allowance alike. *Example: Module 3 teaches one of them and only one — start a fresh conversation between unrelated tasks, and again whenever a long one has gone muddy. The typed commands the course used to teach for the rest were retired 2026-08-16.*
Used in: no current lesson names the phrase. [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md) teaches the habit.

## U

### url
The address that names what you're asking for on the web. *Example: `https://example.com/about`.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## V

### vercel
A service that runs your code on the public internet. It watches a GitHub repository, builds the code each time a new saved version arrives, and serves the result at a public web address. *Example: the thread project goes live on Vercel in Module 4.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md), [Module 4 — Hello-world deploy](./modules/04-thread-project/01-hello-world-deploy.md), [Module 4 — Likes, then live](./modules/04-thread-project/08-likes-and-go-live.md).

## W

### watch-it-fail-walkthrough
A narrated scenario where the agent fails on a specific known-bad pattern, followed by the learner practicing the recovery — first watched happening in someone else's build, then checked against their own live app. *Example: the fence-that-was-down walkthrough narrates bob successfully editing alice's comment when he shouldn't be able to, then has the learner run the same refusal check on their own app.*
Used in: [Module 5 — The fence that was down](./modules/05-operating/02-the-fence-that-was-down.md), [Module 5 — The missing post](./modules/05-operating/03-the-missing-post.md).
