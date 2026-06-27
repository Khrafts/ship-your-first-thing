// The brand mark — the "»" glyph in a rounded square, drawn from the canonical
// assets/mark.svg in the brand kit. Rendered inline (not as an <img>) so the
// strokes use `currentColor`: it follows the surrounding text color and so
// themes for free in dark mode, with no separate asset or `dark:invert` filter.
// Size it with a className that sets height/width (the artwork is square).

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
      focusable="false"
    >
      <rect x="3.2" y="3.2" width="249.6" height="249.6" rx="52.5" strokeWidth="6.4" />
      <g strokeWidth="7.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="98.2,93.9 132.3,128 98.2,162.1" />
        <polyline points="128.1,93.9 162.2,128 128.1,162.1" />
      </g>
    </svg>
  );
}
