# Setup

## What you install, and when

Start with the agent app for the path you pick in [Module 0 Lesson 3](./modules/00-welcome/03-cost-path-triage.md). [Module 0 Lesson 5](./modules/00-welcome/05-install-your-agent-app.md) installs it with the official download for your computer, and [Module 0 Lesson 6](./modules/00-welcome/06-build-your-first-thing.md) has you use it for real before you read anything else.

| Path | App | Cost | Account | Runs on |
|---|---|---|---|---|
| 1 | Claude Code desktop — [code.claude.com/docs/en/desktop-quickstart](https://code.claude.com/docs/en/desktop-quickstart) | $20/month | Claude | Mac, Windows, Linux (beta) |
| 2 | Codex, inside the ChatGPT desktop app — [learn.chatgpt.com/docs/app](https://learn.chatgpt.com/docs/app) | $0 to start | ChatGPT | Mac, Windows, Linux |
| 3 | OpenCode desktop — [opencode.ai/download](https://opencode.ai/download) | $0, free models | None to start | Mac, Windows, Linux |

The same build-and-check approach works in all three. To switch, install the other app, sign in if needed, and open your existing project folder.

## Three names, and who handles them

Your agent handles the development tools. You handle account sign-ins and any installer steps it cannot complete.

- **Git** — the save machinery on your computer. It records every working version of your project so you can go back to one. Your agent installs it the first time you ask for a save, and operates it from then on. One exception: Claude Code desktop on Windows needs Git before it can open a folder, so Lesson 5 links the installer ([git-scm.com/downloads/win](https://git-scm.com/downloads/win)) for that case only.
- **GitHub** — a website that keeps a copy of those saved versions online. You create the account yourself, in your browser, in [Module 2 Lesson 3](./modules/02-toolchain/03-the-save-system.md) — the first lesson that needs it. Your agent sets up the project and uploads your saves, asking for sign-in or approval when needed.
- [Node.js](./GLOSSARY.md#nodejs) — the engine that runs your app's code on your computer while you build it. Your first page doesn't need it. Your agent installs it if a later project needs it.

Anything an installer asks you for — your computer's administrator password, a click-through — goes into the installer's own window, never into the chat.

## When your agent asks you a technical question

It will, sometimes: "Should I use version control?", "Which framework?", "Which language?" You don't have to know. The house rule in Module 0 Lesson 6 tells your agent to make those choices itself; if it asks anyway:

```prompt
I don't have a preference. Choose the simplest option that's easy to change later, and tell me what you chose.
```

The questions you do answer are about your app, not about technology: how it should behave, what it may cost, who can see your information, and which accounts you're willing to sign in to.

## Pinned versions

This course is verified against the tools in [`VERSIONS.md`](./VERSIONS.md). If a step doesn't match what you see (button names, click paths, free-tier numbers), the app moved since that row's date; on the course site, the lesson chat can reconcile the difference.

## The accounts your build needs

The recorded Module 4 build uses Supabase and Vercel. Your agent chooses suitable services and guides you through any accounts when they are needed.

## What's next

Open [`modules/00-welcome/README.md`](./modules/00-welcome/README.md) to begin Module 0.
