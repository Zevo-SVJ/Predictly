import { cn } from "@/lib/utils";
import type { Confidence } from "@/lib/types";

const LEVELS: Record<Confidence, { label: string; filled: number }> = {
  low: { label: "Low", filled: 1 },
  medium: { label: "Medium", filled: 2 },
  high: { label: "High", filled: 3 },
};

/**
 * Confidence in the forecast, not in the event.
 *
 * Three bars plus the word, so the level survives greyscale, colour blindness
 * and a screenshot — the shape carries the meaning and the colour only
 * reinforces it.
 */
export function ConfidenceIndicator({
  confidence,
  className,
}: {
  confidence: Confidence;
  className?: string;
}) {
  const level = LEVELS[confidence];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex items-end gap-0.5" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "w-1 rounded-[1px]",
              index === 0 ? "h-1.5" : index === 1 ? "h-2.5" : "h-3.5",
              index < level.filled ? "bg-cobalt" : "bg-border-strong",
            )}
          />
        ))}
      </span>
      <span className="text-[12px] text-muted">
        <span className="text-faint">Confidence</span>{" "}
        <span className="font-medium text-ink">{level.label}</span>
      </span>
    </span>
  );
}
