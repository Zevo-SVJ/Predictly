import { cn } from "@/lib/utils";

/**
 * Predictly mark: a rising step chart terminating in a signal dot. Reads as
 * forecasting rather than as a generic AI glyph, and stays legible at 20px.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        d="M2 19h20"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 15.5l4.5-4.5 3.5 3.5L20 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="6" r="2.75" fill="var(--color-cobalt)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <Logo />
      <span>Predictly</span>
    </span>
  );
}
