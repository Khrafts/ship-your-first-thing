# How it goes live — diagrams

Mermaid source for the Module 1 bundle 4 lesson at `modules/01-mental-models/04-how-it-goes-live.md` — deployment only. Created as part of the bundle 3 to bundle 3 + bundle 4 split per 01-CONTEXT.md D-06 amendment 2026-05-09 and Plan 01-7's simple-first convention.

## Diagram 1: Opening night (deployment pipeline)

### Simple form (analogy only)

```mermaid
flowchart LR
  Kitchen[Private kitchen] -->|recipes filed| Binder[Recipe binder]
  Binder -->|read by| PrepCooks[Prep cooks]
  PrepCooks -->|set up| Restaurant[Public restaurant]
  Restaurant -->|opens to| Public[Anyone walking in]
```

### Bridge to the real terms

```mermaid
flowchart LR
  Localhost["Localhost<br/>= private kitchen"] -->|git push| GitHub["GitHub<br/>= recipe binder"]
  GitHub -->|trigger| Build["Build server<br/>= prep cooks"]
  Build -->|deploy| Vercel["Vercel<br/>= public restaurant"]
  Vercel -->|public URL| Customers[Anyone on the internet]
```
