# Glossary

**Purpose:** Every domain and tool term used in the course is defined here, plainly, with a one-line definition and a short example. Lessons link into this file via the vocab callout pattern: `**term** (definition, [→ GLOSSARY](GLOSSARY.md#term))`. Each anchor below corresponds to a vocab callout used in a lesson.

**Structure:** Alphabetized within each section. Each entry has the format:

> ### term
> One-line plain-English definition. *Example or context.*
> Used in: `[→ source lesson](path/to/lesson.md)`.

**How to contribute:** See `CONTRIBUTING.md`. The norm is: when a lesson uses a term for the first time, the lesson author adds an entry here in the same PR. If you find a vocab callout in a lesson without a matching anchor here, file an issue or PR a fix.

---

## A

### agent-loop
The iterative cycle of intent → ask → evaluate → steer, repeated until the AI agent has produced what you wanted. *Example: every Module 3 lesson is one or more iterations of the agent loop.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

### ai-coding-agent
A program that reads your project files, plans changes, and writes code on your behalf — guided by a conversation with you. *Example: Claude Code and Gemini CLI are the two AI coding agents this course uses.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md).

### api
The contract between two programs about which questions can be asked and how the answers will look. *Example: "the Twitter API supports `GET /2/tweets/:id`."*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### api-key
A long string that identifies your account when a program calls a paid (or rate-limited) service on your behalf. Treat it like a password: never paste it into chat, never commit it to a public repo. *Example: a Gemini API key starts with `AI...`; an Anthropic API key starts with `sk-ant-...`.*
Used in: [Module 0 — Account creation](./modules/00-welcome/04-account-creation.md).

### app-router
The newer routing system in Next.js, where files in the `app/` folder define URL routes. The older system used a `pages/` folder; both still work, but App Router is the modern default. *Example: `app/page.tsx` is the home page; `app/about/page.tsx` is the `/about` page.*
Used in: [Module 3.5 — Reading a file tree](./modules/03.5-reading-code/01-reading-a-file-tree.md).

### ask
The "ask" step of the agent loop — writing a specific request the agent can act on, given the intent. *Example: turning the intent "I want today's date below the tagline" into the ask "Add today's date below the tagline in `modules/03-the-loop/scratch/index.html`."*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

### authentication
Confirming you are who you claim to be. Sometimes shortened to "authn." *Example: a password check, or clicking a magic link sent to your email.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### authorization
Deciding what an identified user is allowed to do. Sometimes shortened to "authz." *Example: a logged-in user can edit their own posts but not someone else's.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

## B

### branch
An independent line of commits in a git repository, used to try a change without affecting the main history. *Example: `git checkout -b add-login` creates and switches to a new branch named `add-login`; commits on that branch do not show up on `main` until you merge.*
Used in: [Module 2 — git and GitHub](./modules/02-toolchain/05-git-and-github.md).

### browser
A program on your computer that knows how to ask servers for webpages and render them. *Example: Chrome, Firefox, Safari.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## C

### ci-cd
Continuous integration / continuous deployment. The automated path from "I committed code" to "it's live on the internet." *Example: pushing to `main` triggers Vercel to build and deploy your Next.js app.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### claude-code
Anthropic's command-line AI coding agent; this course's recommended primary agent. *Example: install on macOS or Linux with `curl -fsSL https://claude.ai/install.sh | bash`; on Windows in PowerShell with `irm https://claude.ai/install.ps1 | iex`.*
Used in: [Module 2 — AI coding agents](./modules/02-toolchain/06-ai-coding-agents.md).

### client-component
A Next.js file that runs in the browser and supports interactivity — `useState`, `onClick`, forms, anything that responds to user input. Marked by `'use client'` on the first line. *Example: `app/components/InteractiveButton.tsx` in Module 3.5's sample-app uses `useState` and an `onClick` handler, so it's a Client Component.*
Used in: [Module 3.5 — 'use client' and the server/client split](./modules/03.5-reading-code/04-use-client-and-server-split.md).

### code-editor
A program that lets you read and edit source files with niceties like syntax highlighting, search across files, and integrated tools. *Example: Visual Studio Code (VS Code) is the editor a Codespace presents in your browser.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md).

### codespace
A development environment GitHub runs for you on a remote machine; you reach it from your browser, but the files and commands live on a computer GitHub manages. *Example: opening this course's repo and clicking `Create codespace on main` boots a Codespace with the editor and terminal ready.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md).

### commit
A saved snapshot of changes in a git repository, with a one-line description. *Example: `git commit -m "add login button"` creates a commit containing every file you previously staged with `git add`.*
Used in: [Module 2 — git and GitHub](./modules/02-toolchain/05-git-and-github.md).

### context-window
The amount of text an AI agent can see at once — your conversation history plus any file content it has loaded. Finite; as the conversation grows, older parts scroll out. *Example: Claude Code shows current usage via `/context`; Gemini CLI shows it via `/stats`.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### cookie
A small piece of data the browser stores and re-sends to the same site on every request. *Example: a session cookie tells the server "this is the same Alice who logged in 5 minutes ago."*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

## D

### database
A program that stores structured data in tables and answers queries about it. *Example: PostgreSQL, Supabase's database engine.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### dependency
A package your project NEEDS to run, listed under `dependencies` in `package.json`. *Example: the Module 3.5 sample-app's `package.json` lists `next`, `react`, and `react-dom` as dependencies.*
Used in: [Module 2 — The package manager (npm)](./modules/02-toolchain/04-package-manager-npm.md).

### deployment
The act of moving an app from a developer's laptop (localhost) to a public server so anyone on the internet can reach it. *Example: pushing to GitHub and letting Vercel build and host the result.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### diff-summary
A one-line per-file report from an AI coding agent showing the filename and the number of lines added or removed. *Example: `Modified: app/components/Footer.tsx (+1 line, -1 line)` — the filename plus the counts; you do not have to open the file to spot a wrong-file edit.*
Used in: [Module 3.5 — Spotting wrong-file edits](./modules/03.5-reading-code/02-spotting-wrong-file-edits.md).

### directive
A special single line at the top of a file that changes how the file is treated by its framework. *Example: `'use client'` is a directive that tells Next.js a file is a Client Component.*
Used in: [Module 3.5 — 'use client' and the server/client split](./modules/03.5-reading-code/04-use-client-and-server-split.md).

### dns
Domain Name System — the system that translates a human-readable URL into the IP address of the actual server. *Example: when you type `example.com`, DNS resolves it to `93.184.216.34` so the browser knows which server to ask.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### drift
When an AI agent loses the thread of what it agreed to do — usually after a long session, after several scope-changes, or after the conversation history fills up. The agent stays fluent and confident, but starts working against an outdated version of the plan. *Example: an hour into a session, the agent edits a file you told it to leave alone, because the "leave it alone" instruction is no longer in its working memory. Smell-test surface: Module 3 Lesson 2. Recovery move: `/clear` and a tighter restart, taught in Module 3 Lesson 4.*
Used in: [Module 2 — AI coding agents](./modules/02-toolchain/06-ai-coding-agents.md).

## E

### error-message-anatomy
The structure of a typical error message: a description on top followed by a stack trace listing file paths and line numbers. *Example: a `TypeError: Cannot read properties of undefined` with stack frames pointing at `app/components/InteractiveButton.tsx:5:18`.*
Used in: [Module 3.5 — Error message to file pointer](./modules/03.5-reading-code/03-error-message-to-file-pointer.md).

### evaluate
The "evaluate" step of the agent loop — reading the agent's output and deciding if it matches your intent. *Example: the agent says it added today's date; you check the page and confirm the date is there.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

### execution-conversation
An AI-agent session where you ask the agent to actually make the change. Distinct from a planning conversation (no code-writing) which often precedes it. *Example: "OK, please proceed with the plan" opens an execution conversation.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

## F

### file-panel
The editor's source-control or file-tree panel showing which files have just changed, often with an `M` marker or color highlight. *Example: when an AI coding agent edits `app/components/Footer.tsx` inside a Codespace, VS Code's source-control panel shows that file with an `M` marker so you can spot the change at a glance.*
Used in: [Module 3.5 — Spotting wrong-file edits](./modules/03.5-reading-code/02-spotting-wrong-file-edits.md).

### file-tree
The hierarchical structure of files and folders in a project, displayed as an indented list in an editor's left panel. *Example: a Next.js project's file tree shows `app/`, `app/components/`, `package.json`, and `tsconfig.json` at a glance.*
Used in: [Module 3.5 — Reading a file tree](./modules/03.5-reading-code/01-reading-a-file-tree.md).

### foreign-key
A field in one row that points at the id of a row in another table. *Example: a `posts` row's `author_id` points at a row in the `users` table.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### free-tier
The portion of a paid service you can use at no cost — usually capped by hours, requests, or rate limits. *Example: GitHub Codespaces' free tier covers 120 core-hours per month before billing kicks in.*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

## G

### gemini-cli
Google's open-source command-line AI coding agent; this course's genuinely-free path (Path 2 in `BUDGET.md`). *Example: install via `npm install -g @google/gemini-cli` on any platform with Node 20 or newer.*
Used in: [Module 2 — AI coding agents](./modules/02-toolchain/06-ai-coding-agents.md).

### git
A tool that tracks every version of every file in a project. Used to commit changes locally and push them to GitHub. *Example: `git commit -m "add login button"`.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### github
A website that hosts code repositories and runs developer tools (like Codespaces) on top of them; Vercel and other deploy services watch GitHub for new code. *Example: this course lives in a GitHub repository at github.com.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md), [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

## H

### hallucination
When an AI agent produces specific details that look correct but were invented — book titles, function names, API endpoints, file paths the agent has no way of knowing. *Example: in Module 3 Lesson 3, both agents invented "favorite books" for a list, even though neither agent has any way of knowing the learner's actual favorites.*
Used in: [Module 3 — Reading plans + recognizing wrong output](./modules/03-the-loop/03-reading-plans-recognizing-wrong.md).

### html
The markup language that describes the structure of a webpage — a tree of elements like headings, paragraphs, links, and images. *Example: `<h1>Hello</h1>` is an HTML element.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### http
The protocol the web uses to send requests and responses between a browser and a server. *Example: clicking a link sends an `HTTP GET` request.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md), [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### http-method
The verb on an HTTP request — `GET`, `POST`, `PUT`, `DELETE` — that says what kind of operation you're asking for. *Example: `GET /posts` says "show me the posts"; `POST /posts` says "here's a new post; please save it."*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### http-status-code
A three-digit number summarizing how an HTTP request went. *Example: `200 OK` means success; `404 Not Found` means the resource doesn't exist; `500 Internal Server Error` means the server crashed.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### hydration
SYMPTOM-only at the M3.5 floor: a message in the browser console meaning "the page does not agree." Treat as a synonym for "a touchscreen file (one with interactivity) is missing the `'use client'` label on line 1." The deeper mechanic — how the framework reconciles server-rendered and client-rendered output — is the agent's job and Module 7's curiosity track. *Example: a "Hydration failed" error in the browser console is usually a touchscreen file missing `'use client'`.*
Used in: [Module 3.5 — 'use client' and the server/client split](./modules/03.5-reading-code/04-use-client-and-server-split.md).

## I

### ide
An editor that bundles a text editor, a file browser, a terminal, and language-aware tooling into one program. The "I" is for "integrated." *Example: Visual Studio Code (VS Code), the editor inside your Codespace, is the IDE this course uses.*
Used in: [Module 2 — The IDE](./modules/02-toolchain/01-ide.md).

### intent
The "intent" step of the agent loop — knowing what you are trying to build before you start asking. *Example: "I want today's date below the tagline" is intent; "make the page nicer" is not.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

## J

### jsx
The HTML-like syntax inside React component files. JSX lets you write `<Button />` directly in code; the React runtime turns it into the actual button element in the browser. Files containing JSX usually end in `.tsx` (TypeScript + JSX) or `.jsx` (plain JavaScript + JSX). *Example: `<h1>Hello</h1>` inside a `.tsx` file is JSX.*
Used in: [Module 3.5 — Reading a file tree](./modules/03.5-reading-code/01-reading-a-file-tree.md).

## L

### localhost
A URL that means "this same computer." Not visible from the public internet — only the laptop running the dev server can reach it. *Example: `localhost:3000` while running `npm run dev`.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

## M

### markdown
A way of writing formatted documents using simple punctuation marks like `#` for headings, `*` for emphasis, and triple-backticks for code blocks. *Example: this course is written in markdown; you can read the source on github.com.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md).

### merge
The act of combining the commits from one git branch into another. *Example: `git merge add-login` brings the commits from the `add-login` branch into whichever branch you are currently on.*
Used in: [Module 2 — git and GitHub](./modules/02-toolchain/05-git-and-github.md).

## N

### next-js
A popular framework for building web apps. Bundles React, routing, and server-rendering into one tool. The framework the thread project in Phase 3 uses. *Example: the read-only scaffold at `modules/03.5-reading-code/sample-app/` is a tiny Next.js project shown for reading practice.*
Used in: [Module 3.5 — Reading a file tree](./modules/03.5-reading-code/01-reading-a-file-tree.md).

### node
The standard runtime for JavaScript code outside the browser. *Example: `node --version` in a Codespace prints the installed Node version; this course pins Node 20.x LTS in `VERSIONS.md`.*
Used in: [Module 2 — The runtime (Node)](./modules/02-toolchain/03-runtime-node.md).

### npm
The standard package manager for JavaScript code; bundled with Node. *Example: `npm install` downloads everything listed in `package.json` into a `node_modules/` folder.*
Used in: [Module 2 — The package manager (npm)](./modules/02-toolchain/04-package-manager-npm.md).

## O

### over-engineering
When an AI agent does MORE than asked — suggesting frameworks, libraries, image lookups, or fancy designs for a small request. The fix is a scope-tightening steer that names the limit ("no frameworks", "inline CSS only", "nothing else"). *Example: in Module 3 Lesson 4, the open-ended ask "make the list look like a real bookshelf" prompted both agents to suggest CSS frameworks and image lookups — over-engineering compared to the simple inline-CSS solution the learner wanted.*
Used in: [Module 3 — Steering and recovery](./modules/03-the-loop/04-steering-and-recovery.md).

## P

### package
A bundled bit of reusable code, published to a registry so any project can pull it in. *Example: `date-fns` is a package that handles date formatting; `next` is a package that provides the Next.js framework.*
Used in: [Module 2 — The package manager (npm)](./modules/02-toolchain/04-package-manager-npm.md).

### package-manager
A tool that downloads and tracks the code your project depends on. *Example: npm is the package manager this course uses; pnpm is an alternative the deferred course platform uses.*
Used in: [Module 2 — The package manager (npm)](./modules/02-toolchain/04-package-manager-npm.md).

### planning-conversation
An AI-agent session where you ask the agent to describe what it WOULD do without writing code yet. *Example: a prompt starting with "Plan:" and ending with "don't write code yet" opens a planning conversation.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### prompt
The specific text you send to an AI agent describing what you want. *Example: "Add today's date below the tagline" is a prompt; a series of prompts plus the agent's responses is a session.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

### pull
Fetch commits from a remote git host (like GitHub) and merge them into your local copy. *Example: `git pull` at the start of a coding session brings down any commits you (or someone else) pushed from another machine.*
Used in: [Module 2 — git and GitHub](./modules/02-toolchain/05-git-and-github.md).

### push
Send commits from your computer to a remote git host. *Example: `git push` after a commit makes the snapshot visible on GitHub to anyone with access to the repository.*
Used in: [Module 2 — git and GitHub](./modules/02-toolchain/05-git-and-github.md).

## Q

### query
A written question asking the database for specific rows. *Example: a SQL query like `SELECT * FROM posts WHERE author_id = 7`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## R

### rate-limit
A cap on how many calls you can make to a service in a window of time, after which the service refuses or delays your calls until the window resets. *Example: the Gemini CLI free tier enforces daily caps on requests-per-minute and requests-per-day.*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

### react
The JavaScript UI library Next.js is built on. React components are reusable pieces of UI (buttons, headers, sections) written as files. *Example: `app/components/InteractiveButton.tsx` in Module 3.5's sample-app is a React component.*
Used in: [Module 3.5 — Error message to file pointer](./modules/03.5-reading-code/03-error-message-to-file-pointer.md).

### react-server-components
An architectural model in React for components that render entirely on the server before being sent to the browser; the default in Next.js App Router. The deeper "why" behind the server/client split that `'use client'` toggles; covered in depth in Module 7's where-to-go-next track. *Example: a `StaticHero.tsx` file with no `'use client'` directive is a React Server Component.*
Used in: [Module 3.5 — 'use client' and the server/client split](./modules/03.5-reading-code/04-use-client-and-server-split.md).

### repository
A project's full history of commits, tracked by git. Often shortened to "repo." *Example: this course is one git repository; you can clone the whole history to your computer with `git clone`.*
Used in: [Module 2 — git and GitHub](./modules/02-toolchain/05-git-and-github.md).

### request
A structured message asking a server for something — like a paper form handed to a receptionist. *Example: `GET /api/posts` is a request.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### response
A structured message replying to a request — like the receptionist's paper reply. *Example: a JSON array of posts is a response.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### risk-blindness
When an AI agent suggests something dangerous — overwriting working code, dropping a database table, force-pushing to a branch, hardcoding a secret — with the same calm as fixing a typo. The agent has no sense of stakes; it weighs all changes by token-level fit, not by impact on your project. *Example: in Module 5's watch-it-fail walkthroughs, the agent proposes deleting a migration file to "clean up" — the operation reads as routine to it but is destructive to the project. The smell-test pattern is taught in those walkthroughs.*
Used in: [Module 2 — AI coding agents](./modules/02-toolchain/06-ai-coding-agents.md).

### row
A single record in a database table — like one index card in a filing-cabinet drawer.
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### runtime
A program that reads source code and executes it. Every language has at least one. *Example: Node is the runtime for JavaScript outside the browser; the browser itself has its own JavaScript runtime built in.*
Used in: [Module 2 — The runtime (Node)](./modules/02-toolchain/03-runtime-node.md).

## S

### schema
The fixed shape of fields in a database table. *Example: the `users` table's schema is `(id, email, display_name, created_at)`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### server
A program that runs continuously, waiting for requests, and sends back responses.
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md), [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### server-component
A Next.js file that renders on the server before sending HTML to the browser; the default in App Router. No `'use client'` directive needed. *Example: `app/components/StaticHero.tsx` in Module 3.5's sample-app is pure JSX with no interactivity, so it stays a Server Component.*
Used in: [Module 3.5 — 'use client' and the server/client split](./modules/03.5-reading-code/04-use-client-and-server-split.md).

### session
A remembered "yes, you're you" so an app doesn't re-check identity on every request. Lives between authentication and the next sign-out. *Example: after you log in, the app remembers you for the next 24 hours.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### session-token
A string the browser sends with each request to prove "I'm the same person who just authenticated." Often delivered as a cookie. *Example: a JWT or an opaque session id.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### slash-command
A short keyword starting with `/` typed inside an AI agent's session to control the session itself rather than asking the agent to do work. *Example: `/clear` resets conversation history; `/context` shows context-window usage on Claude Code; `/stats` is Gemini CLI's equivalent.*
Used in: [Module 2 — AI coding agents](./modules/02-toolchain/06-ai-coding-agents.md).

### slash-clear
The `/clear` slash command — reset the conversation history; start a fresh session inside the same agent invocation. Same keystroke on Claude Code AND Gemini CLI. *Example: type `/clear` between unrelated tasks.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### slash-compact
The `/compact` slash command (Claude Code) — compress conversation history without losing the gist. Gemini CLI's equivalent is `/compress`. *Example: use mid-session when context-window usage is high but you do not want to `/clear` and lose recent context.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### slash-compress
The `/compress` slash command (Gemini CLI) — Gemini CLI's equivalent of Claude Code's `/compact`. Same purpose, different keystroke. *Example: Path 2 learners use this whenever Claude Code learners would use `/compact`.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### slash-context
The `/context` slash command (Claude Code) — shows how much of the context window is currently in use. Gemini CLI's equivalent is `/stats`. *Example: type `/context` to see usage as a percentage or a tokens-used / tokens-remaining pair.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### slash-cost
The `/cost` slash command (Claude Code) — shows running session spend in dollars. Most relevant to Path 3 (Anthropic API token-careful) learners. *Example: type `/cost` to see spend so far this session.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### slash-stats
The `/stats` slash command (Gemini CLI) — Gemini CLI's equivalent of Claude Code's `/context`. Shows conversation statistics including token usage. *Example: Path 2 learners use this whenever Claude Code learners would use `/context`.*
Used in: [Module 3 — Planning vs execution conversations](./modules/03-the-loop/02-planning-vs-execution.md).

### sql
Structured Query Language — the standard way to ask a relational database for rows. *Example: `SELECT * FROM posts ORDER BY created_at DESC`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### stack-trace
A list of every function call leading to an error, top to bottom — the most recent call at the top. Most lines mention library code; one or two lines mention YOUR files. *Example: Module 3.5 Lesson 3 teaches finding the first line that mentions a file from your project as the file pointer.*
Used in: [Module 3.5 — Error message to file pointer](./modules/03.5-reading-code/03-error-message-to-file-pointer.md).

### steer
The "steer" step of the agent loop — course-correcting when the agent's output does not match your intent. *Example: "The date appeared above the tagline; please put it below" is a steer.*
Used in: [Module 3 — Introducing the loop](./modules/03-the-loop/01-introducing-the-loop.md).

## T

### terminal
The text panel inside a code editor (or as a standalone app) where you type commands and the computer types replies. *Example: in a Codespace, the terminal is the panel at the bottom; pressing `` Ctrl+` `` toggles it.*
Used in: [Module 0 — Codespaces walkthrough](./modules/00-welcome/05-codespaces-walkthrough.md).

### token-discipline
The set of habits that keep AI-coding sessions cheap on pay-per-token plans: clearing context between unrelated tasks, watching the running token count, summarizing long histories, and choosing the smaller model when the bigger one isn't needed. *Example: Module 3 teaches `/clear`, `/compact`, `/context` (window usage), and `/cost` (spend) on Claude Code, and `/clear`, `/compress`, `/stats` as the Gemini CLI equivalents.*
Used in: [Module 3 — Planning vs execution](./modules/03-the-loop/02-planning-vs-execution.md).

### typescript
A version of JavaScript with extra type information. TypeScript files end in `.ts`; TypeScript files that include React JSX end in `.tsx`. A separate tool (the TypeScript compiler) checks the types before the runtime runs the code. *Example: every file inside Module 3.5's sample-app is a TypeScript file (`.tsx`).*
Used in: [Module 3.5 — Reading a file tree](./modules/03.5-reading-code/01-reading-a-file-tree.md).
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

## U

### url
The address that names what you're asking for on the web. *Example: `https://example.com/about`.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### use-client
A Next.js directive — `'use client'` on the first line of a file — that flips the file from Server Component to Client Component. *Example: a file using `useState`, `onClick`, or any other React hook or DOM event handler needs `'use client'` on line 1.*
Used in: [Module 3.5 — 'use client' and the server/client split](./modules/03.5-reading-code/04-use-client-and-server-split.md).

## V

### vercel
A service that runs your code on the public internet. Watches a GitHub repository, builds the code on every push, and serves it at a public URL. *Example: the course platform deploys to Vercel at `https://shipyourfirstthing.com`.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).
