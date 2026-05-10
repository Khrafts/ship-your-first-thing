# Where data lives, how programs talk — diagrams

Mermaid sources for the Module 1 bundle 2 exemplar lesson at `modules/01-mental-models/02-where-data-lives.md`. Simple-first convention per Plan 01-7.

## Diagram 1: The filing cabinet (database)

A relational database modeled as filing cabinet drawers (tables) holding index cards (rows).

### Simple form (analogy only)

```mermaid
flowchart TB
  subgraph Cabinet[Filing cabinet]
    direction LR
    UsersDrawer["Drawer: users"]
    PostsDrawer["Drawer: posts"]
    UsersDrawer -.->|each post card<br/>names a user card| PostsDrawer
  end
```

### Bridge to the real terms

```mermaid
flowchart TB
  subgraph DB[Filing cabinet — database]
    direction LR
    Users["Drawer: users<br/>id | email | display_name"]
    Posts["Drawer: posts<br/>id | author_id | body"]
    Users -.->|author_id references users.id| Posts
  end
```

## Diagram 2: Inter-office mail (HTTP request/response)

A program asks another program for index cards via HTTP. The "mail" is the request; the reply is the response.

### Simple form (analogy only)

```mermaid
sequenceDiagram
  participant Customer as Customer
  participant Receptionist as Receptionist
  participant Cabinet as Filing cabinet
  Customer->>Receptionist: hands over a form:<br/>"what posts has Alice written?"
  Receptionist->>Cabinet: opens the posts drawer,<br/>finds Alice's cards
  Cabinet-->>Receptionist: hands over the cards
  Receptionist-->>Customer: hands back a paper:<br/>"here are Alice's posts"
```

### Bridge to the real terms

```mermaid
sequenceDiagram
  participant Browser as Your browser
  participant Server as Server (the API)
  participant DB as Database
  Browser->>Server: GET /api/posts (HTTP request)
  Server->>DB: SELECT * FROM posts ORDER BY created_at DESC
  DB-->>Server: rows
  Server-->>Browser: JSON [{ id, author_id, body }, ...]
```
