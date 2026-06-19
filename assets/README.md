# Brand assets

Canonical source kit for the "Ship Your First Thing" brand. These files are the
single source of truth; the copies wired into the site (below) are derived from
them. Re-export from here if the brand changes.

Brand colors match the site design tokens: ink `#09090b`, paper `#ffffff`.

## Files

| File | What it is |
|------|------------|
| `mark.svg` | The mark on a transparent background (outlined). |
| `mark-filled.svg` | The mark knocked out of a filled ink square. |
| `app-icon.svg` | Full-bleed app/launcher icon (white mark on ink). |
| `mark-256.png`, `mark-filled-256.png` | Raster marks at 256 px. |
| `lockup-light.png`, `lockup-dark.png` | Wordmark lockup for light / dark backgrounds (1028×424). |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | Favicon source rasters. |
| `apple-touch-icon-180.png` | iOS home-screen icon (180 px). |
| `icon-192.png`, `icon-512.png` | PWA icons (`purpose: any`). |
| `icon-maskable-512.png` | PWA icon with safe-zone padding (`purpose: maskable`). |

## Where they're wired

The site (`site/`) is a Next.js App Router app, which discovers icons by
filename. The derived copies live where the framework expects them:

| Source here | Lands at | Surface |
|-------------|----------|---------|
| `app-icon.svg` | `site/src/app/icon.svg` | SVG favicon (modern browsers) |
| `favicon-16/32/48.png` | `site/src/app/favicon.ico` (packed) | Legacy / `/favicon.ico` |
| `apple-touch-icon-180.png` | `site/src/app/apple-icon.png` | iOS home screen |
| `icon-192/512/maskable.png` | `site/public/` + `site/src/app/manifest.ts` | PWA / install |
| `lockup-light.png` | `site/public/brand/` → `site/src/components/site-header.tsx` | Site navbar |
| `lockup-light.png`, `lockup-dark.png` | `README.md` banner (`<picture>`) | github.com |

`mark.svg`, `mark-filled.svg`, `mark-256.png`, and `mark-filled-256.png` are
icon-only marks kept in the kit for future use (social avatars, favicons,
compact placements); none are wired into the site today.
