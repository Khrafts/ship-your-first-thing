# How the web works — diagrams

Mermaid sources for the Module 1 bundle 1 lesson at `modules/01-mental-models/01-how-the-web-works.md`. Each technical diagram is preceded by its simple-form analogy-only sibling per the simple-first convention introduced in Plan 01-7.

## Diagram 1: The restaurant (client / server)

### Simple form (analogy only)

```mermaid
flowchart LR
  Customer[Customer]
  Waiter[Waiter]
  Kitchen[Kitchen]
  Customer -->|orders| Waiter
  Waiter -->|delivers| Customer
  Waiter -->|brings ticket| Kitchen
  Kitchen -->|cooks| Waiter
```

### Bridge to the real terms

```mermaid
flowchart LR
  Customer["Customer<br/>= browser"]
  Waiter["Waiter<br/>= HTTP request/response"]
  Kitchen["Kitchen<br/>= server"]
  Customer -->|orders| Waiter
  Waiter -->|delivers| Customer
  Waiter -->|brings ticket| Kitchen
  Kitchen -->|prepares dish| Waiter
```

## Diagram 2: What happens when you type a URL

### Simple form (analogy only)

```mermaid
sequenceDiagram
  participant Customer
  participant Waiter
  participant Kitchen
  Customer->>Waiter: orders the main dish
  Waiter->>Kitchen: brings the ticket
  Kitchen-->>Waiter: hands over the dish
  Waiter-->>Customer: delivers the dish
  Note over Customer: dish has parts; customer<br/>asks waiter for each
  Customer->>Waiter: orders the side dish
  Waiter->>Kitchen: brings the side ticket
  Kitchen-->>Waiter: hands over the side
  Waiter-->>Customer: delivers the side
```

### Bridge to the real terms

```mermaid
sequenceDiagram
  participant Browser
  participant DNS
  participant Server
  Browser->>DNS: What's the IP for example.com?
  DNS-->>Browser: 93.184.216.34
  Browser->>Server: GET / HTTP/1.1, Host: example.com
  Server-->>Browser: 200 OK + HTML
  Browser->>Browser: Parses HTML, finds CSS + JS, requests them
  Browser->>Server: GET /style.css
  Server-->>Browser: 200 OK + CSS
  Browser->>Browser: Renders the page
```

## Diagram 3: HTTP methods as ticket types

This diagram is technical-only — it names the four HTTP methods directly. The lesson's analogy framing ("a `GET` ticket says 'show me the menu'; a `POST` ticket says 'place an order'") provides the simple form in prose, so a separate Mermaid simple form is not added.

```mermaid
flowchart LR
  GET["GET<br/>show me the menu"] --> Server
  POST["POST<br/>place an order"] --> Server
  PUT["PUT<br/>change my order"] --> Server
  DELETE["DELETE<br/>cancel my order"] --> Server
```
