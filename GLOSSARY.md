# Glossary

**Purpose:** Every domain and tool term used in the course is defined here, plainly, with a one-line definition and a short example. Lessons link into this file via the vocab callout pattern: `**term** (definition, [→ GLOSSARY](GLOSSARY.md#term))`. Each anchor below corresponds to a vocab callout used in a lesson.

**Structure:** Alphabetized within each section. Each entry has the format:

> ### term
> One-line plain-English definition. *Example or context.*
> Used in: `[→ source lesson](path/to/lesson.md)`.

**How to contribute:** See `CONTRIBUTING.md`. The norm is: when a lesson uses a term for the first time, the lesson author adds an entry here in the same PR. If you find a vocab callout in a lesson without a matching anchor here, file an issue or PR a fix.

---

## A

### api
The contract between two programs about which questions can be asked and how the answers will look. *Example: "the Twitter API supports `GET /2/tweets/:id`."*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### authentication
Confirming you are who you claim to be. Sometimes shortened to "authn." *Example: a password check, or clicking a magic link sent to your email.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

### authorization
Deciding what an identified user is allowed to do. Sometimes shortened to "authz." *Example: a logged-in user can edit their own posts but not someone else's.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

## B

### browser
A program on your computer that knows how to ask servers for webpages and render them. *Example: Chrome, Firefox, Safari.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## C

### ci-cd
Continuous integration / continuous deployment. The automated path from "I committed code" to "it's live on the internet." *Example: pushing to `main` triggers Vercel to build and deploy your Next.js app.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

### cookie
A small piece of data the browser stores and re-sends to the same site on every request. *Example: a session cookie tells the server "this is the same Alice who logged in 5 minutes ago."*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

## D

### database
A program that stores structured data in tables and answers queries about it. *Example: PostgreSQL, Supabase's database engine.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

### deployment
The act of moving an app from a developer's laptop (localhost) to a public server so anyone on the internet can reach it. *Example: pushing to GitHub and letting Vercel build and host the result.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

### dns
Domain Name System — the system that translates a human-readable URL into the IP address of the actual server. *Example: when you type `example.com`, DNS resolves it to `93.184.216.34` so the browser knows which server to ask.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## F

### foreign-key
A field in one row that points at the id of a row in another table. *Example: a `posts` row's `author_id` points at a row in the `users` table.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## G

### git
A tool that tracks every version of every file in a project. Used to commit changes locally and push them to GitHub. *Example: `git commit -m "add login button"`.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

### github
A website that hosts git repositories — both for collaboration (you and contributors) and for downstream tools like Vercel that watch the repo for new code. *Example: this course's repository.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

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
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

## Q

### query
A written question asking the database for specific rows. *Example: a SQL query like `SELECT * FROM posts WHERE author_id = 7`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## R

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
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

### session-token
A string the browser sends with each request to prove "I'm the same person who just authenticated." Often delivered as a cookie. *Example: a JWT or an opaque session id.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).

### sql
Structured Query Language — the standard way to ask a relational database for rows. *Example: `SELECT * FROM posts ORDER BY created_at DESC`.*
Used in: [Module 1 — Where data lives, how programs talk](./modules/01-mental-models/02-where-data-lives.md).

## U

### url
The address that names what you're asking for on the web. *Example: `https://example.com/about`.*
Used in: [Module 1 — How the web works](./modules/01-mental-models/01-how-the-web-works.md).

## V

### vercel
A service that runs your code on the public internet. Watches a GitHub repository, builds the code on every push, and serves it at a public URL. *Example: the course platform deploys to Vercel at `https://shipyourfirstthing.com`.*
Used in: [Module 1 — Who can do what, how it goes live](./modules/01-mental-models/03-who-can-do-what.md).
