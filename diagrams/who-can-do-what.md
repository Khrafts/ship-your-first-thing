# Who can do what — diagrams

Mermaid source for the Module 1 bundle 3 lesson at `modules/01-mental-models/03-who-can-do-what.md` — auth only. The deployment diagram (formerly here) moved to `diagrams/how-it-goes-live.md` per the bundle 3 split decided in 01-CONTEXT.md D-06 amendment 2026-05-09.

## Diagram 1: The door staff (auth flow)

### Simple form (analogy only)

```mermaid
sequenceDiagram
  participant Visitor
  participant Door as Door staff
  participant Backroom as VIP backroom
  Visitor->>Door: Hi, I'm Alice. Here's my ID.
  Door->>Door: Checks the ID (real? photo matches?)
  Door->>Door: Checks the VIP list
  Door-->>Visitor: Stamps the hand
  Visitor->>Backroom: Shows the stamp
  Backroom-->>Visitor: Lets the visitor in
```

### Bridge to the real terms

```mermaid
sequenceDiagram
  participant Visitor
  participant Door as Door staff
  participant Backroom as VIP backroom
  Visitor->>Door: Hi, I'm Alice. Here's my ID.
  Door->>Door: Verify ID (authentication)
  Door->>Door: Check VIP list (authorization)
  Door-->>Visitor: Hand stamp (session token)
  Visitor->>Backroom: Hand stamp shown
  Backroom-->>Visitor: Access granted
```
