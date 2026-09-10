import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The cobalt stroke under the last phrase of the hero headline.
 *
 * Not `text-decoration`, not a border: those are straight, uniform and sit at
 * the font's own baseline offset, which is exactly what makes them read as
 * markup rather than as a mark someone made. This is a single SVG path with
 * uneven curvature and round caps — it dips, lifts and overshoots the word
 * slightly, the way a pen would.
 *
 * Mechanics that matter:
 *
 * - The wrapper is `inline-block` around the phrase, so the stroke measures
 *   itself against the real rendered text at any width. If the headline rewraps
 *   at 375px the stroke rewraps with it.
 * - `preserveAspectRatio="none"` lets the path stretch horizontally to whatever
 *   the phrase happens to be. Apparent thickness is governed by the vertical
 *   scale, which is pinned to the font size in `em`, so the stroke stays the
 *   same weight relative to the type at every breakpoint.
 * - The draw-on animation is a dash offset over the path's own length, and the
 *   reduced-motion rule in `globals.css` renders it already drawn rather than
 *   hiding it — the mark is part of the wordmark, not an effect.
 */

/** Path length in user units, comfortably over the real length so the dash covers it. */
const LENGTH = 215;

export function HeroUnderline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.1em] h-[0.26em] w-full overflow-visible"
      >
        <path
          d="M2.5 8.6C26 4.2 52.5 2.3 84 3.1c31.5.8 58 3.6 78 6.2 12 1.6 22.5 1.9 35.5-1.4"
          fill="none"
          stroke="var(--color-cobalt)"
          strokeWidth="3.4"
          strokeLinecap="round"
          className="animate-underline"
          style={{ "--underline-length": LENGTH } as React.CSSProperties}
        />
      </svg>
    </span>
  );
}
