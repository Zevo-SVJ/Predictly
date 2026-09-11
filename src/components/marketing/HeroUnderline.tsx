"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The cobalt rule under the emphasised phrase of the hero headline.
 *
 * Straight, and deliberately so — an earlier version curved, which read as a
 * doodle rather than as a mark the brand owns. What keeps it from looking like
 * `text-decoration` is everything around the straightness: it is thicker than a
 * text rule, it has round caps, it sits below the descenders rather than on the
 * baseline, and a highlight crosses it every few seconds.
 *
 * The wrapper is `inline-block` around the phrase, so the bar measures itself
 * against the real rendered text and rewraps with it. `preserveAspectRatio`
 * is off, so it stretches to the phrase; apparent thickness is governed by the
 * vertical scale, pinned in `em`, and therefore holds at every breakpoint.
 */
export function HeroUnderline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Unique per instance so two underlines on one page cannot share a gradient.
  const id = useId();
  const shineId = `shine-${id}`;
  const clipId = `clip-${id}`;

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.07em] h-[0.15em] w-full"
      >
        <defs>
          <linearGradient id={shineId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* Clips the highlight to the bar, so it never paints past the ends. */}
          <clipPath id={clipId}>
            <rect x="0" y="0" width="200" height="10" rx="5" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="200" height="10" rx="5" fill="var(--color-cobalt)" />
          <rect
            className="animate-shine"
            x="0"
            y="0"
            width="55"
            height="10"
            fill={`url(#${shineId})`}
          />
        </g>
      </svg>
    </span>
  );
}
