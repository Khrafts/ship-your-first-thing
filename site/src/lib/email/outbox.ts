// In-memory capture of "sent" emails for local dev and the e2e suite, where
// no SMTP service is configured. Never used in production (a configured
// SMTP_HOST routes mail to the real transport instead).
//
// The store is anchored on globalThis, not a plain module-level array, on
// purpose: a Next.js production build bundles server actions and route handlers
// into separate module graphs, so a module-level array would be instantiated
// twice in the same process — the action that records the email and the
// /api/test/outbox route that reads it would see different arrays. A
// Symbol.for-keyed slot on globalThis is a true per-process singleton shared
// across every bundle chunk.

export interface SentEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  sentAt: number;
}

const OUTBOX_KEY = Symbol.for("ship-your-first-thing.email.outbox");

type GlobalWithOutbox = typeof globalThis & {
  [OUTBOX_KEY]?: SentEmail[];
};

function store(): SentEmail[] {
  const g = globalThis as GlobalWithOutbox;
  if (!g[OUTBOX_KEY]) {
    g[OUTBOX_KEY] = [];
  }
  return g[OUTBOX_KEY];
}

export function recordEmail(email: SentEmail): void {
  store().push(email);
}

export function getOutbox(): SentEmail[] {
  return [...store()];
}

export function clearOutbox(): void {
  store().length = 0;
}

/** Most recent captured message to a given address, or undefined. */
export function latestEmailTo(to: string): SentEmail | undefined {
  const box = store();
  for (let i = box.length - 1; i >= 0; i -= 1) {
    if (box[i].to === to) {
      return box[i];
    }
  }
  return undefined;
}
