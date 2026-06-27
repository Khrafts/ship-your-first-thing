# Module 1 — How software works (mental models)

Module 1 is four bundled mental-model lessons covering the durable shape of any web product: how the browser talks to the server, how the server talks to the database, how access is gated, and how code goes live on the internet. Each bundle has its own analogy: a restaurant for the web, a filing cabinet plus inter-office mail for data, door staff plus a VIP list for auth, opening night plus prep cooks for deployment.

This module is pre-loop. Every Loop check in Module 1 names `intent` — knowing the shape of what you want is the first step of the AI-coding loop, and Module 1 is where you build the intuition for shape.

## What this module builds

By the end of this module, you can sketch — in plain language, on paper — the durable shape of any web product: where each piece sits, how the pieces ask each other for things, who's allowed to do what, and how the whole thing reaches the public.

Each lesson builds on the last:

- **Lesson 1 — How the web works:** you can trace what travels between a browser and a server when a page loads → sets up Lesson 2 by leaving one question open — once the server gets the order, where does the answer actually come from?
- **Lesson 2 — Where data lives:** you can place any piece of a feature in one of three rooms — screen, server, or the cabinet where the data is filed — and show how a question and answer pass between them → sets up Lesson 3 by raising the next question — anyone could walk up and ask, so who's actually allowed to?
- **Lesson 3 — Who can do what:** you can separate "are you who you say you are?" from "are you allowed to do this?", and name the stamp that keeps you recognized after the door waves you through → sets up Lesson 4 by leaving the app still locked inside one private building.
- **Lesson 4 — How it goes live:** you can trace the path from an app on a private laptop to a public address anyone on the internet can reach → sets up Module 2, where you stop describing the shape and start setting up the tools to build it.

The thread that ties it together: one picture grows across all four lessons. A restaurant (a browser ordering from a kitchen) gains a filing cabinet in the back (where the data is kept), then door staff and a guest list at the entrance (who gets in and what they can touch), and finally an opening night that turns the private kitchen into a public restaurant via a recipe binder anyone's prep cooks can read.

## Lessons in this module

1. [01-how-the-web-works.md](./01-how-the-web-works.md) — Client/server + browsers (restaurant analogy)
2. [02-where-data-lives.md](./02-where-data-lives.md) — Databases + APIs (filing cabinet + inter-office mail)
3. [03-who-can-do-what.md](./03-who-can-do-what.md) — Authn / authz / session (door staff + VIP list + hand stamp)
4. [04-how-it-goes-live.md](./04-how-it-goes-live.md) — Deployment (opening night: private kitchen → recipe binder → prep cooks → public restaurant)

## Navigation

[← Module 0 — Welcome](../00-welcome/README.md)
[Next: Module 2 — Toolchain →](../../README.md)
