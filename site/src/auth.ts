import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

// Credentials auth over the Drizzle users table. Sessions are stateless JWTs
// (no adapter needed for the credentials flow); the session callback copies
// the token subject onto session.user.id so server code can key queries.

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// The JWT secret is the whole trust boundary for stateless sessions. In
// production there is deliberately NO fallback: when AUTH_SECRET is missing,
// the secret stays undefined and Auth.js throws MissingSecret instead of
// signing forgeable sessions with a known string. The dev fallback keeps
// local flows working (the e2e suite sets AUTH_SECRET explicitly anyway).
const secret =
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "production"
    ? undefined
    : "dev-insecure-secret-local-only");

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  trustHost: true,
  secret,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";
        if (email.length === 0 || password.length === 0) {
          return null;
        }

        const db = await getDb();
        const user = await db.query.users.findFirst({
          where: eq(schema.users.email, email),
        });
        if (!user || !user.passwordHash) {
          return null;
        }

        const matches = await bcrypt.compare(password, user.passwordHash);
        if (!matches) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
