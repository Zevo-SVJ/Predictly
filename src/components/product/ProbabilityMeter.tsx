import { cn, formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * Predictly's probability, as an instrument rather than a chart.
 *
 * Segments, not a continuous bar: a filled track reads as a progress bar, and a
 * line on an axis reads as a price. Discrete ticks read as a measurement — which
 * is what this is — and they also make the value legible at a glance without
 * anyone having to compare two bar lengths.
 *
 * Nothing here animates on a loop. The fill runs once, on entrance.
 */
export function ProbabilityMeter({
  probability,
  segments,
  size = "md",
  className,
}: {
  probability: number;
  /** Defaults by size. More ticks read as an instrument; fewer read as Lego. */
  segments?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const ticks = segments ?? { sm: 28, md: 32, lg: 36 }[size];
  const filled = Math.round(probability * ticks);
  const height = { sm: "h-5", md: "h-7", lg: "h-9 sm:h-12" }[size];
  const gap = size === "sm" ? "gap-[2px]" : "gap-[3px]";

  return (
    <div
      className={cn("flex items-end", gap, height, className)}
      role="img"
      aria-label={`${formatPercent(probability)} — ${probabilityVerdict(probability)}`}
    >
      {Array.from({ length: ticks }, (_, index) => (
        <span
          key={index}
          className={cn(
            "flex-1 rounded-[1.5px]",
            // The last filled tick is full height and full strength: it is the
            // reading, and the eye should land on it rather than on the end of
            // a bar it would otherwise have to measure.
            index === filled - 1
              ? "h-full bg-cobalt"
              : index < filled
                ? "h-[62%] bg-cobalt/45"
                : "h-[38%] bg-border",
          )}
        />
      ))}
    </div>
  );
}
