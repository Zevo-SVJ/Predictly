import { cn } from "@/lib/utils";

/**
 * One outcome's share of the distribution.
 *
 * Width is inline and the fill is a scaleX animation, so nothing reflows while
 * it runs. The leading outcome is cobalt; the rest are grey, because if every
 * bar were the accent colour the accent would stop meaning "this is the call".
 */
export function ProbabilityBar({
  probability,
  leading = false,
  className,
}: {
  probability: number;
  leading?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("block h-1.5 w-full overflow-hidden rounded-full bg-canvas", className)}
      aria-hidden
    >
      <span
        className={cn(
          "animate-bar-fill block h-full rounded-full",
          leading ? "bg-cobalt" : "bg-border-strong",
        )}
        style={{ width: `${Math.max(2, probability * 100)}%` }}
      />
    </span>
  );
}
