import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Auth.js-compatible core tables (Phase 01.1 D-A3 shape) plus a passwordHash
// column for the credentials provider. Table names stay singular to match
// @auth/drizzle-adapter defaults so magic-link/OAuth can be added later
// without a schema migration.

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// Per-lesson completion, keyed (user_id, lesson_path) per PLATFORM-03.
// lessonPath is the repo-relative markdown path, e.g.
// "modules/01-mental-models/01-how-the-web-works.md" — canonical on both
// render surfaces (github.com and this site).

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonPath: text("lesson_path").notNull(),
    completedAt: timestamp("completed_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonPath] })],
);

// Cohorts: a group that moves through the course together with a live call
// per module — usually weekly, longer for complex modules. Self-paced study
// is always available outside any cohort; membership only adds the schedule.

export const cohorts = pgTable("cohort", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  startsOn: date("starts_on", { mode: "string" }).notNull(),
  isOpen: boolean("is_open").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const cohortSessions = pgTable("cohort_session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cohortId: text("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  weekNumber: integer("week_number").notNull(),
  moduleSlug: text("module_slug").notNull(),
  title: text("title").notNull(),
  scheduledAt: timestamp("scheduled_at", { mode: "date" }).notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  callUrl: text("call_url"),
  notes: text("notes"),
});

export const cohortMembers = pgTable(
  "cohort_member",
  {
    cohortId: text("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.cohortId, table.userId] })],
);
