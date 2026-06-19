import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_NAME, TAGLINE } from "@/lib/copy";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";
import "@/styles/site.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: TAGLINE,
};

// Matches the mobile browser chrome to the page background per OS preference.
// This follows the system setting (not the in-page toggle), which is the
// standard, JS-free approach; values mirror --paper in app/globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the pre-paint script below sets the `dark` class
    // and color-scheme on <html> before React hydrates, so the client markup
    // intentionally differs from the server's. This is the sanctioned use of
    // the escape hatch and is scoped to <html> only.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* No-flash theme init. Runs before first paint so the saved (or OS)
            theme is applied before anything renders. The injected string is a
            static, developer-authored constant from src/lib/theme.ts — no user
            or request data flows into it, so there is no XSS surface. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
