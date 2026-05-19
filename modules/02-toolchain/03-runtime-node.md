---
title: "The runtime (Node)"
module: "02-toolchain"
lesson_number: 03
est_minutes: 35
prereqs: ["02-terminal"]
updated: "2026-05-16"
deviations: []
---

# The runtime (Node)

## Learning objective

By the end of this lesson, you will be able to explain in your own words what a runtime is, name Node as the runtime for JavaScript code, and verify your Codespace has Node installed with one command.

## Why this matters

Picture a piece of sheet music on a stand — paper, dots, lines. Until a musician picks up an instrument and plays it, no sound exists in the room. Code is the same kind of thing: text in a file, inert until something reads it and DOES what it says. The category name for that something is a runtime, and this lesson teaches the one JavaScript uses by default: Node.

## Core read

Your code is just text until something runs it.

Picture the sheet music again. Paper, dots, lines. Quiet, until a musician picks up an instrument and plays what's written. Code is sheet music. The thing that reads it and produces action is the musician — and the category name for the musician is what this lesson is here to give you.

If you open a markdown file in your IDE, you see text — paragraphs of words and punctuation. The browser shows it as a webpage because GitHub's renderer turns the markdown text into HTML; HTML, in turn, is text the browser knows how to display. JavaScript is the same: a file ending in `.js` is text. Until something reads that text and DOES what it says, the file is inert.

The thing that reads code and does what it says is called a **runtime** (one-line definition: a program that reads source code and executes it, [→ GLOSSARY](../../GLOSSARY.md#runtime)). The musician, in the analogy. Different compositions, different instruments: Python has its interpreter, Ruby has Ruby. JavaScript's most common musician — the one this course uses — is **Node** (one-line definition: the standard runtime for JavaScript outside the browser, [→ GLOSSARY](../../GLOSSARY.md#node)).

JavaScript runs in two places, which means it has two musicians who can play the same composition. JavaScript started life inside the browser. Browsers have a built-in JavaScript runtime — one musician, on staff inside the browser; that is what makes the buttons on a webpage do things when you click them. Node is a second musician — one who plays from outside the concert hall. Node took the same kind of runtime out of the browser and made it runnable from the terminal. When you write a `.js` file and tell Node to run it, Node reads the text and executes the instructions. No browser involved. Same notes, different player.

Your Codespace has Node pre-installed. You can prove it by typing `node --version` in the terminal — Node prints the version it is running. This course pins Node 20.x LTS (see `VERSIONS.md` for the exact version verified at each course revision). "LTS" means "long-term support" — the steady version, not the bleeding edge. The lesson does not teach you how to install Node yourself, because in a Codespace you do not have to.

A brief word on the language. JavaScript has a sibling called **TypeScript**. In Phase 3, when you build the thread project, you'll see files ending in `.ts` and `.tsx` instead of `.js`. Those are TypeScript files — they carry extra labels the agent reads to work more carefully. You don't write the labels yourself; the agent handles that. The musician still reads the music; the music just has a few more annotations on it. For now, just hold the shape: **runtime runs code**, **Node is JavaScript's runtime**.

Two confusions are worth heading off here.

**First, the browser also has a JavaScript runtime — a different one from Node.** When code runs "in the browser" (a button on a web page that responds to a click), it is running in the browser's runtime, not Node's. When code runs "on the server" (the clerk answering requests), it is running in Node. Module 3.5 names this server-side vs browser-side split with the specific code-marker that lives at the boundary. For now, just know there are two places JavaScript can run, and Node is one of them.

**Second, Node is sometimes confused with the tool you will meet in the next lesson — the one that installs other people's code.** They are different things. Node runs code; the next-lesson tool installs other people's code so Node has something to run. They ship together (the install tool is bundled with Node), which is why beginners often see them as one thing. Lesson four pulls them apart and gives the install tool its own name.

## Exercise

Open your Codespace's terminal — press `` Ctrl+` `` if the panel at the bottom isn't already visible. Plan ten to fifteen minutes.

1. Type `node --version` and press Enter. Write down the version Node prints. It should start with `v20.` if your Codespace matches the pin in `VERSIONS.md`.
2. Type `node` (nothing else — just the word `node` and Enter). The prompt changes from a `$` to a `>`. You are now inside Node's REPL — an interactive prompt where you can type JavaScript and see the result of each line immediately.
3. At the `>` prompt, type `1 + 1` and press Enter. Note that Node prints `2`. You just hummed three notes at the musician, and the musician played them back: you handed Node a tiny piece of JavaScript and it answered.
4. At the `>` prompt, type `Date()` (with the parentheses) and press Enter. Note that Node prints the current date and time. That is JavaScript's built-in way of asking the runtime "what time is it right now?", and the runtime answers.
5. Type `.exit` (with the leading dot) and press Enter to leave the REPL. The prompt changes back to `$` — you are out of Node and back in the regular terminal.

Save your notes in a scratch text file — right-click the file list on the left, choose `New File`, and name it `m2-l3-scratch.txt`. Two sentences are enough. The point is what you just saw: Node executed three small pieces of JavaScript text and printed the result. That is what a runtime does.

## Checkpoint

You've got this if you can:

1. Explain in one sentence the difference between code (text in a file) and the runtime (the thing that runs the code).
2. Verify your Codespace has Node installed by running one command in the terminal.

## Going deeper

Optional, only if you're curious:

- Node has alternatives. **Deno** and **Bun** are the two most-discussed modern competitors; both also run JavaScript. They are Module 7 "where to go next" material. Do not switch from Node for this course — the project scaffold you will meet in Module 4 reaches for Node by default, and AI coding agents are trained on the Node shape.
- The [Node.js docs' "About Node.js"](https://nodejs.org/en/about) page is a short, plain-English explanation of what Node is and what it is not. The rest of the Node docs are reference material; you do not need them for this course.

## Loop check

> **Loop check — intent.** Module 2 is still pre-loop — the loop lands in Module 3 — but knowing the runtime is a CATEGORY (separate from the code it runs) changes the *intent* you will bring to debugging in Module 3. If an AI-coding session produces code that runs in the browser but you expected it to run on the server (or the other way around), you will know which runtime is the missing piece. The loop step this lesson reinforces is **intent**: knowing the shape of where work happens before you ask.

## What you just did

You named the category that turns code-as-text into code-as-action. You met Node — the JavaScript runtime your Codespace ships with — and watched it execute three tiny pieces of JavaScript in real time. Every later lesson in this course assumes Node is running somewhere; you have now seen it run.

## Navigation

[← Previous: The terminal](./02-terminal.md)
[Next: The package manager →](./04-package-manager-npm.md)
