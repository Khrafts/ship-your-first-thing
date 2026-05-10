# Glossary

**Purpose:** Every domain and tool term used in the course is defined here, plainly, with a one-line definition and a short example. Lessons link into this file via the vocab callout pattern: `**term** (definition, [→ GLOSSARY](GLOSSARY.md#term))`. Each anchor below corresponds to a vocab callout used in a lesson.

**Structure:** Alphabetized within each section. Each entry has the format:

> ### term
> One-line plain-English definition. *Example or context.*
> Used in: `[→ source lesson](path/to/lesson.md)`.

**How to contribute:** See `CONTRIBUTING.md`. The norm is: when a lesson uses a term for the first time, the lesson author adds an entry here in the same PR. If you find a vocab callout in a lesson without a matching anchor here, file an issue or PR a fix.

---

## A

### ai-coding-agent
A program that reads your project files, plans changes, and writes code on your behalf — guided by a conversation with you. *Example: Claude Code and Gemini CLI are the two AI coding agents this course uses.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md).

### api
The contract between two programs about which questions can be asked and how the answers will look. *Example: "the Twitter API supports `GET /2/tweets/:id`."*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### api-key
A long string that identifies your account when a program calls a paid (or rate-limited) service on your behalf. Treat it like a password: never paste it into chat, never commit it to a public repo. *Example: a Gemini API key starts with `AI...`; an Anthropic API key starts with `sk-ant-...`.*
Used in: [Module 0 — Account creation](./modules/00-welcome/04-account-creation.md).

### authentication
Confirming you are who you claim to be. Sometimes shortened to "authn." *Example: a password check, or clicking a magic link sent to your email.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### authorization
Deciding what an identified user is allowed to do. Sometimes shortened to "authz." *Example: a logged-in user can edit their own posts but not someone else's.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

## B

### browser
A program on your computer that knows how to ask servers for webpages and render them. *Example: Chrome, Firefox, Safari.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## C

### ci-cd
Continuous integration / continuous deployment. The automated path from "I committed code" to "it's live on the internet." *Example: pushing to `main` triggers Vercel to build and deploy your Next.js app.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### code-editor
A program that lets you read and edit source files with niceties like syntax highlighting, search across files, and integrated tools. *Example: Visual Studio Code (VS Code) is the editor a Codespace presents in your browser.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md).

### codespace
A development environment GitHub runs for you on a remote machine; you reach it from your browser, but the files and commands live on a computer GitHub manages. *Example: opening this course's repo and clicking `Create codespace on main` boots a Codespace with the editor and terminal ready.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md).

### cookie
A small piece of data the browser stores and re-sends to the same site on every request. *Example: a session cookie tells the server "this is the same Alice who logged in 5 minutes ago."*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

## D

### database
A program that stores structured data in tables and answers queries about it. *Example: PostgreSQL, Supabase's database engine.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### deployment
The act of moving an app from a developer's laptop (localhost) to a public server so anyone on the internet can reach it. *Example: pushing to GitHub and letting Vercel build and host the result.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### dns
Domain Name System — the system that translates a human-readable URL into the IP address of the actual server. *Example: when you type `example.com`, DNS resolves it to `93.184.216.34` so the browser knows which server to ask.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## F

### foreign-key
A field in one row that points at the id of a row in another table. *Example: a `posts` row's `author_id` points at a row in the `users` table.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### free-tier
The portion of a paid service you can use at no cost — usually capped by hours, requests, or rate limits. *Example: GitHub Codespaces' free tier covers 120 core-hours per month before billing kicks in.*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

## G

### git
A tool that tracks every version of every file in a project. Used to commit changes locally and push them to GitHub. *Example: `git commit -m "add login button"`.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

### github
A website that hosts code repositories and runs developer tools (like Codespaces) on top of them; Vercel and other deploy services watch GitHub for new code. *Example: this course lives in a GitHub repository at github.com.*
Used in: [Module 0 — Welcome](./modules/00-welcome/01-welcome.md), [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

## H

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

## L

### localhost
A URL that means "this same computer." Not visible from the public internet — only the laptop running the dev server can reach it. *Example: `localhost:3000` while running `npm run dev`.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).

## M

### markdown
A way of writing formatted documents using simple punctuation marks like `#` for headings, `*` for emphasis, and triple-backticks for code blocks. *Example: this course is written in markdown; you can read the source on github.com.*
Used in: [Module 0 — Hardware check](./modules/00-welcome/02-hardware-check.md).

## Q

### query
A written question asking the database for specific rows. *Example: a SQL query like `SELECT * FROM posts WHERE author_id = 7`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## R

### rate-limit
A cap on how many calls you can make to a service in a window of time, after which the service refuses or delays your calls until the window resets. *Example: the Gemini CLI free tier enforces daily caps on requests-per-minute and requests-per-day.*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

### request
A structured message asking a server for something — like a paper form handed to a receptionist. *Example: `GET /api/posts` is a request.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### response
A structured message replying to a request — like the receptionist's paper reply. *Example: a JSON array of posts is a response.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### row
A single record in a database table — like one index card in a filing-cabinet drawer.
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## S

### schema
The fixed shape of fields in a database table. *Example: the `users` table's schema is `(id, email, display_name, created_at)`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### server
A program that runs continuously, waiting for requests, and sends back responses.
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md), [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

### session
A remembered "yes, you're you" so an app doesn't re-check identity on every request. Lives between authentication and the next sign-out. *Example: after you log in, the app remembers you for the next 24 hours.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### session-token
A string the browser sends with each request to prove "I'm the same person who just authenticated." Often delivered as a cookie. *Example: a JWT or an opaque session id.*
Used in: [Module 1 — Who can do what](./modules/01-mental-models/03-who-can-do-what.md).

### sql
Structured Query Language — the standard way to ask a relational database for rows. *Example: `SELECT * FROM posts ORDER BY created_at DESC`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## T

### terminal
The text panel inside a code editor (or as a standalone app) where you type commands and the computer types replies. *Example: in a Codespace, the terminal is the panel at the bottom; pressing `` Ctrl+` `` toggles it.*
Used in: [Module 0 — Codespaces walkthrough](./modules/00-welcome/05-codespaces-walkthrough.md).

### token-discipline
The set of habits that keep AI-coding sessions cheap on pay-per-token plans: clearing context between unrelated tasks, watching the running token count, summarizing long histories, and choosing the smaller model when the bigger one isn't needed. *Example: Module 3 teaches `/clear`, `/compact`, and `/tokens` as the three core moves.*
Used in: [Module 0 — Cost-path triage](./modules/00-welcome/03-cost-path-triage.md).

## U

### url
The address that names what you're asking for on the web. *Example: `https://example.com/about`.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## V

### vercel
A service that runs your code on the public internet. Watches a GitHub repository, builds the code on every push, and serves it at a public URL. *Example: the course platform deploys to Vercel at `https://shipyourfirstthing.com`.*
Used in: [Module 1 — How it goes live](./modules/01-mental-models/04-how-it-goes-live.md).
