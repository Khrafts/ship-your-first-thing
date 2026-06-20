import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { verifyCredentials } from "@/lib/auth/credentials";

// Two ways in: Google OAuth and email/password credentials. Sessions are
// stateless JWTs (required by the credentials provider), but the Drizzle
// adapter is wired so OAuth accounts/users persist and link. The config is an
// async factory because the adapter needs a RESOLVED db handle and getDb() is
// async; Auth.js v5 awaits a function config.

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

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const db = await getDb();
  return {
    adapter: DrizzleAdapter(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    }),
    session: { strategy: "jwt" },
    pages: { signIn: "/signin" },
    trustHost: true,
    secret,
    providers: [
      Google({
        // Safe here ONLY because Google sets email_verified: an existing
        // password account is reconciled with its Google sign-in by matching
        // the verified email. Never enable this for a provider that doesn't
        // verify email ownership.
        allowDangerousEmailAccountLinking: true,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            // Born verified — Google has already confirmed the address.
            emailVerified: profile.email_verified ? new Date() : null,
          };
        },
      }),
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email =
            typeof credentials?.email === "string" ? credentials.email : "";
          const password =
            typeof credentials?.password === "string"
              ? credentials.password
              : "";

          const result = await verifyCredentials(email, password);
          // No session for a wrong password OR an unconfirmed account. The
          // server action recomputes this to show the right message.
          if (!result.ok || !result.verified || !result.user) {
            return null;
          }
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          };
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
    events: {
      // Linking an OAuth account proves the user controls that verified email,
      // so confirm a previously-pending account at the moment of linking.
      async linkAccount({ user }) {
        if (user.id) {
          const linkDb = await getDb();
          await linkDb
            .update(schema.users)
            .set({ emailVerified: new Date() })
            .where(eq(schema.users.id, user.id));
        }
      },
    },
  };
});
