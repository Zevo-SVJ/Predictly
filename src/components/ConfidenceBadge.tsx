import { cn } from "@/lib/utils";
import type { Confidence } from "@/lib/types";

const STYLES: Record<Confidence, { label: string; dot: string; text: string }> = {
  low: { label: "Low", dot: "bg-no", text: "text-no" },
  medium: { label: "Medium", dot: "bg-hedge", text: "text-hedge" },
  high: { label: "High", dot: "bg-yes", text: "text-yes" },
};

/**
 * Confidence in the forecast — how much the evidence supports making any call.
 * Distinct from the event probability, and always labelled as such.
 */
export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: Confidence;
  className?: string;
}) {
  const style = STYLES[confidence];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      <span className="text-faint">Forecast confidence</span>
      <span className={style.text}>{style.label}</span>
    </span>
  );
}
