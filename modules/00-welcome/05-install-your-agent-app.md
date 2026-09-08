---
title: "Install your agent app"
module: "00-welcome"
lesson_number: 05
est_minutes: 20
prereqs: ["04-account-creation"]
updated: "2026-09-08"
deviations: []
---

# Install your agent app

## Learning objective

By the end of this lesson, you will have installed the agent app for the path you picked, signed in if it needs a sign-in, opened a first conversation, and found the setting that decides how often it asks before acting.

## Why this matters

You picked a path and created its account. This lesson turns that into a real, open window on your screen. The [AI coding agent](../../GLOSSARY.md#ai-coding-agent) you install here is where the rest of this course happens, with your browser open beside it. Get comfortable with its window now, before there's anything at stake in it.

## Core read

Start by installing the desktop app for your path. Windows users choosing Claude also need Git, as shown below. Follow your path's section, then the two sections that apply to everyone.

### Path 1 — Claude Code desktop

**Download.** Go to [code.claude.com/docs/en/desktop-quickstart](https://code.claude.com/docs/en/desktop-quickstart) and use the download button for your computer: Mac, Windows, or Linux (beta). Open the downloaded file and follow the install steps like any app.

**On Windows, install Git first.** Claude Code desktop needs one helper program, [Git](../../GLOSSARY.md#git), before it can open a folder on your computer. Windows computers don't have it; most Macs do. Download and run the installer from [git-scm.com/downloads/win](https://git-scm.com/downloads/win), accept its defaults, then start Claude Code desktop. You never open Git yourself; your agent uses it later to save your work.

**Sign in.** Launch the app and sign in with the Claude account from the last lesson. If the **Code** tab asks you to upgrade, buy the plan from Lesson 3 first.

**First conversation.** Choose **Code** in the sidebar, then **New**. Above the message box choose **Local**, then pick a folder. Type what you want in the message box. The permission selector sits below the message box.

![Claude Code desktop: two cropped areas of the app. Left, the sidebar with New highlighted. Right, the session view with Local and a folder picker above the message box, the message box reading "Describe a task or ask a question", and the permission-mode control below it. Numbered labels: 1 choose Code then New; 2 choose Local and your project folder; 3 describe what you want; 4 the permission mode controls when the agent asks.](../../screenshots/m0/05-install-your-agent-app/claude-first-session.png)

*Claude Code desktop on a Mac, 8 September 2026, project name blurred. Your window may differ.*

<!-- Tool claim source: code.claude.com/docs/en/desktop-quickstart, fetched 2026-09-08 ("Download for macOS … Universal build for Intel and Apple Silicon"; "Download for Windows … For x64 processors"; "Get Claude for Linux (beta)"; "On Windows, Git must be installed for local sessions to work. Most Macs include Git by default."; "Click the Code tab … If clicking Code prompts you to upgrade, you need to subscribe to a paid plan first"; "Select Local … Click Select folder"; "The desktop app includes Claude Code. You don't need to install Node.js or the command-line tool separately."). Sidebar Code → New and the selector position: director's capture, 2026-09-08. -->

### Path 2 — Codex, inside the ChatGPT desktop app

**Download.** Go to [learn.chatgpt.com/docs/app](https://learn.chatgpt.com/docs/app) — the official page for the ChatGPT desktop app — and download it for your computer: Mac, Windows, or Linux. Open the downloaded file and follow the install steps.

**Sign in** with the ChatGPT account from the last lesson.

**Switch to Codex.** The app opens in ordinary chat. Codex is a mode inside it: switch to **Codex** at the top of the sidebar, then choose **New chat**. Above the message box choose your project and **Local**, and pick a folder. Type what you want in the message box. The permission setting sits below it.

![Codex inside the ChatGPT desktop app: two cropped areas. Left, the sidebar with Codex selected at the top and New chat below it. Right, the task view with the project and Local above the message box, the message box reading "Do anything", and a permission setting labelled "Approve for me" below it. Numbered labels: 1 use Codex mode then New chat; 2 choose your project and Local; 3 describe what you want; 4 review the permission setting.](../../screenshots/m0/05-install-your-agent-app/codex-first-session.png)

*The ChatGPT desktop app in Codex mode on a Mac, 8 September 2026, project name blurred. Your window may differ.*

<!-- Tool claim source: learn.chatgpt.com/docs/app, fetched 2026-09-08 (page title "ChatGPT desktop app"; "macOS, Windows, and Linux"; "In Codex, start with New chat"; "Start a chat, create a project, or open a folder"). developers.openai.com/codex/app redirects to that page (director, 2026-09-08), so the ChatGPT desktop app is the download, not a separate Codex app. Sidebar Codex mode → New chat, project + Local, "Approve for me": director's capture, 2026-09-08. chatgpt.com/download returns 403 to automated fetch and is not linked. -->

### Path 3 — OpenCode desktop

**Download.** Go to [opencode.ai/download](https://opencode.ai/download) and use the desktop download for your computer: Mac (Apple Silicon or Intel), Windows, or Linux. Open the downloaded file and follow the install steps. The desktop app is labelled a beta.

**No sign-in needed.** Open the app; the free models work without an account.

**First conversation.** In the project picker below the message box choose **Add project** and pick a folder. Click the model button under the message box and pick any model marked **Free**. Type what you want in the message box. The **+** on the top bar starts a new conversation.

![OpenCode desktop: the session view with the message box reading "Ask anything", a model button showing "Big Pickle" under it, and the project picker at the bottom showing a blurred folder name next to "No Git". Numbered labels: 1 choose your project folder; 2 choose a Free model; 3 describe what you want.](../../screenshots/m0/05-install-your-agent-app/opencode-first-session.png)

![OpenCode's Select model dialog. Under "Free models provided by OpenCode" a list of models each tagged Free, with Big Pickle ticked. Below it, "Add more models from popular providers" with OpenCode Zen, OpenCode Go, OpenAI, Anthropic, Google and GitHub Copilot buttons.](../../screenshots/m0/05-install-your-agent-app/opencode-free-models.png)

*OpenCode desktop on a Mac, 8 September 2026, project name blurred. The free models on offer change; pick any marked Free. The provider buttons below them are optional and not part of this course. "No Git" next to your folder means the folder has no Git history yet — normal for a new project.*

<!-- Tool claim source: opencode.ai/download, fetched 2026-09-08 (macOS Apple Silicon and Intel .dmg, Windows x64, Linux .deb and .rpm); opencode.ai, fetched 2026-09-08 ("Download the desktop beta now"; "Free models included"). Project picker below the prompt → Add project → native folder chooser; Free picker requires no Zen sign-in; New session is the + on the top bar; "No Git" label: director's observations and captures, 2026-09-08. -->

### The setting that decides how often it asks

Your agent proposes a change, and the app can stop and ask you before it happens — a plain question like "allow this change?" with an approve and a reject choice. This is the control that matters more than any button or menu.

**How often the app asks is a setting, not a guarantee, and the three apps set it differently.**

- **Claude Code desktop:** the selector below the message box. On the plan this course uses it starts in **Auto**, where the app makes changes on its own while a background check watches for risky ones. Switch it to **Manual** so it asks before each change. That's the setting this course assumes.
- **Codex in the ChatGPT app:** the permission setting below the message box. Its usual setting lets Codex work inside the one folder you've chosen without asking, and asks before it reaches outside that folder or out to the internet.
- **OpenCode desktop:** by default it edits files and runs its own steps in your folder without asking. The page in your browser is your check, and *"What did you just change, in everyday words?"* is always available.

What matters is that you know which one you're looking at, so silence never reads as "nothing happened." Your control doesn't depend on the question appearing: whether the app asked or not, you look at the result and say what should be different. The next lesson has you do exactly that on a page of your own.

<!-- Tool claim source: code.claude.com/docs/en/desktop-quickstart, fetched 2026-09-08 ("Auto: a classifier reviews actions in the background and blocks the risky ones instead of asking you"; "Manual: Claude asks before editing files or running commands"; "the permission mode shown in the selector next to the send button") and code.claude.com/docs/en/permission-modes, fetched 2026-09-07 ("On Pro, Max, and Team plans, the built-in starting permission mode is auto mode"). learn.chatgpt.com/docs/agent-approvals-security, fetched 2026-09-07 ("lets ChatGPT work within the current workspace and pauses before reaching beyond that boundary"). opencode.ai/docs/permissions/, fetched 2026-09-08 ("Most permissions default to allow"). -->

### If the app can't open your folder

If any app says a program is missing before it will open a folder, your agent can't install it for you — it isn't running yet. Follow the official installer for the program the message names: for Git, [git-scm.com/downloads](https://git-scm.com/downloads). Accept the defaults. If the installer asks for your computer's administrator password, type it into the installer's own window, never into any chat. Then close and reopen the app and try the folder again. If you're unsure what the message means, the lesson chat on the course site, or the app's ordinary chat, can walk you through it one step at a time. Anything else your project needs later, your agent installs when it's needed.

### What you will never be asked to do

Not in this lesson, not anywhere in this course: open a terminal, type a command, or edit a file by hand. If a website or search result tells you to do one of those things, you're off this course's path — close it and come back. What this course does ask of you: plain requests in the agent app, approvals, checks in your browser, and the occasional click through an installer window.

## Exercise

1. Install the app for your path and sign in if it needs a sign-in.
2. Open a first conversation the way your path's section shows: a new conversation, pointed at any folder (an empty one on your Desktop is fine), with a model marked Free if you're on Path 3.
3. Find the setting that controls how often the app asks. Claude Code desktop: set it to **Manual**. ChatGPT app: read what the setting below the message box says. OpenCode: know that it won't ask, and that the page is your check.
4. Close the app, then reopen it. Confirm you're still signed in (Paths 1 and 2).

## Checkpoint

You've got this if you can:

- Open your agent app to a new conversation pointed at a folder.
- Say, in one sentence, what the approval prompt does — and why silence from it doesn't mean nothing happened.
- Say what you do if the app says a program is missing before it will open a folder.
- Name the one thing this course will never ask you to do (open a terminal or type a command).

## What you just did

You went from a picked path to an open app window with a conversation in it — the window every remaining lesson happens inside. The next lesson is the reason you installed it: in one sitting, your agent builds a page that's yours, and you check it, change it, and save it.

## Navigation

[← Previous: Account creation](./04-account-creation.md)
[Next: Build your first thing →](./06-build-your-first-thing.md)
