import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { AUTH_COPY } from "@/lib/copy";

export const metadata: Metadata = {
  title: AUTH_COPY.signInTitle,
};

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="px-6">
      <div className="mx-auto mt-16 mb-24 w-full max-w-sm rounded-lg border border-line p-8">
        <h1 className="font-serif text-2xl text-ink">
          {AUTH_COPY.signInTitle}
        </h1>
        <div className="mt-6">
          <AuthForm mode="signin" />
        </div>
        <p className="mt-6 text-sm text-ink-secondary">
          <Link
            href="/signup"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-ink"
          >
            {AUTH_COPY.toSignUp}
          </Link>
        </p>
      </div>
    </div>
  );
}
