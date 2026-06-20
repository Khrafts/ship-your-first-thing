import type { Metadata } from "next";
import { confirmEmailAction } from "@/lib/actions/auth";
import { AUTH_COPY } from "@/lib/copy";

export const metadata: Metadata = {
  title: AUTH_COPY.confirmEmailTitle,
};

// A confirmation landing page rather than a one-click GET: activation happens
// on the button's POST (confirmEmailAction). Email-gateway link scanners
// (Safe Links, Proofpoint, …) issue a GET to every link, which would otherwise
// consume the single-use token before the human ever clicks. Rendering the
// page is side-effect-free; only the POST consumes the token.
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="px-6">
      <div className="mx-auto mt-16 mb-24 w-full max-w-sm space-y-4 rounded-lg border border-line p-8">
        <h1 className="font-serif text-2xl text-ink">
          {AUTH_COPY.confirmEmailTitle}
        </h1>
        <p className="text-sm text-ink-secondary">{AUTH_COPY.confirmEmailBody}</p>
        <form action={confirmEmailAction}>
          <input type="hidden" name="token" value={token ?? ""} />
          <button
            type="submit"
            className="h-11 w-full cursor-pointer rounded-md bg-ink px-5 font-sans text-sm font-medium text-paper transition-colors duration-150 hover:bg-ink-secondary"
          >
            {AUTH_COPY.confirmEmailButton}
          </button>
        </form>
      </div>
    </div>
  );
}
