import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { AUTH_COPY } from "@/lib/copy";

export const metadata: Metadata = {
  title: AUTH_COPY.signInTitle,
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  // Banners set by the /verify-email redirect.
  const params = await searchParams;
  const verified = params.verified === "1";
  const verificationError = params.error === "verification";

  return (
    <div className="px-6">
      <div className="mx-auto mt-16 mb-24 w-full max-w-sm rounded-lg border border-line p-8">
        <h1 className="font-serif text-2xl text-ink">
          {AUTH_COPY.signInTitle}
        </h1>

        {verified && (
          <p
            role="status"
            className="mt-4 rounded-md border border-line-strong bg-surface-raised px-3 py-2 text-sm font-medium text-ink"
          >
            {AUTH_COPY.verifiedBanner}
          </p>
        )}
        {verificationError && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-line-strong bg-surface-raised px-3 py-2 text-sm font-medium text-ink"
          >
            {AUTH_COPY.verificationError}
          </p>
        )}

        <div className="mt-6">
          <AuthForm mode="signin" />
        </div>
        <p className="mt-8 border-t border-line pt-6 text-sm text-ink-secondary">
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
