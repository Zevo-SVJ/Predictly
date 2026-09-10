import { cn, formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * The output of the whole pipeline.
 *
 * Cobalt, tabular, and the largest type on any surface it appears on — this is
 * the one place the accent is allowed to dominate, because the number is the
 * product. The plain-language verdict sits beside it so the figure is never the
 * only reading available.
 */
export function ProbabilityValue({
  probability,
  size = "md",
  verdict = true,
  className,
}: {
  probability: number;
  size?: "sm" | "md" | "lg";
  verdict?: boolean;
  className?: string;
}) {
  const scale = {
    sm: "text-[2rem]",
    md: "text-[3.25rem] sm:text-[4rem]",
    lg: "text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem]",
  }[size];

  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span
        className={cn(
          "font-semibold leading-[0.85] tracking-[-0.045em] tabular-nums text-cobalt",
          scale,
        )}
      >
        {formatPercent(probability)}
      </span>
      {verdict ? (
        <span
          className={cn(
            "font-medium text-muted",
            size === "lg" ? "text-base sm:text-lg" : "text-[13px]",
          )}
        >
          {probabilityVerdict(probability)}
        </span>
      ) : null}
    </div>
  );
}
