import type { MetadataRoute } from "next";
import { SITE_NAME, TAGLINE } from "@/lib/copy";

// Web app manifest. Next.js serves this at /manifest.webmanifest and injects
// the <link rel="manifest"> automatically — no layout wiring needed. Icons are
// the PWA PNGs in /public; theme/background match the design tokens in
// globals.css (--ink #09090b, --paper #ffffff).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Ship First",
    description: TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#09090b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
