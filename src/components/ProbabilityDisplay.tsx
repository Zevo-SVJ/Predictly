import type { Outcome } from "@/lib/types";
import { cn, formatPercent, probabilityVerdict } from "@/lib/utils";

interface ProbabilityDisplayProps {
  outcomes: Outcome[];
  headlineOutcomeId: string;
  /** Compact variant for cards and lists. */
  compact?: boolean;
  className?: string;
}

/**
 * The number is the product. It gets the largest type on the page, the verdict
 * sits beside it in plain language, and every competing outcome is shown so the
 * headline figure is never mistaken for a certainty.
 *
 * Entrance animations are CSS classes, so this renders identically on the
 * server and the client and the figure is readable even without JavaScript.
 */
export function ProbabilityDisplay({
  outcomes,
  headlineOutcomeId,
  compact = false,
  className,
}: ProbabilityDisplayProps) {
  const headline = outcomes.find((o) => o.id === headlineOutcomeId) ?? outcomes[0];
  if (!headline) return null;

  const others = outcomes.filter((o) => o.id !== headline.id);
  const tone = toneFor(headline.id, headline.probability);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-end gap-4">
        <p
          className={cn(
            "animate-rise-in font-semibold leading-none tracking-tighter tabular-nums text-lime",
            compact ? "text-5xl" : "text-6xl sm:text-8xl",
          )}
        >
          {formatPercent(headline.probability)}
        </p>

        <div className="pb-1.5 sm:pb-2.5">
          <p
            className={cn(
              "font-semibold uppercase leading-none tracking-wide",
              tone.text,
              compact ? "text-base" : "text-xl sm:text-2xl",
            )}
          >
            {headline.label}
          </p>
          <p className={cn("mt-1.5 text-muted", compact ? "text-xs" : "text-sm")}>
            {probabilityVerdict(headline.probability)}
          </p>
        </div>
      </div>

      <div>
        <div
          className="flex h-1.5 w-full overflow-hidden rounded-full bg-elevated"
          role="img"
          aria-label={outcomes
            .map((o) => `${o.label}: ${formatPercent(o.probability)}`)
            .join(", ")}
        >
          <span
            className={cn("animate-bar-reveal block h-full rounded-full", tone.bar)}
            style={{ width: `${headline.probability * 100}%` }}
          />
        </div>

        {others.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {others.map((outcome) => (
              <li key={outcome.id} className="text-sm text-faint">
                <span className="tabular-nums text-muted">{formatPercent(outcome.probability)}</span>{" "}
                {outcome.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The percentage itself is always lime — it is the brand's number, and a
 * seven-figure red "78%" reads as an alarm rather than a forecast. Semantic
 * colour is carried by the outcome label and the bar, where it means something:
 * green for a yes-leaning call, red for a no-leaning one, amber for a genuine
 * toss-up, lime for anything that isn't binary.
 */
function toneFor(outcomeId: string, probability: number) {
  if (probability < 0.55) return { text: "text-hedge", bar: "bg-hedge" };
  if (outcomeId === "yes") return { text: "text-yes", bar: "bg-yes" };
  if (outcomeId === "no") return { text: "text-no", bar: "bg-no" };
  return { text: "text-lime", bar: "bg-lime" };
}
