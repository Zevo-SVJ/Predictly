import { ProbabilityValue } from "./ProbabilityValue";
import { ProbabilityBar } from "./ProbabilityBar";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import type { DemoForecast } from "@/lib/demo";
import { cn, formatPercent } from "@/lib/utils";

/**
 * The result, stated as large as it will ever be stated.
 *
 * No card, no border, no shadow: this sits directly on the page so the figure
 * reads as the page's own conclusion rather than as one more tile. The
 * complement is always shown next to it, because a probability that hides its
 * other side is a headline, not a forecast.
 */
export function ForecastSummary({
  forecast,
  className,
}: {
  forecast: DemoForecast;
  className?: string;
}) {
  const ordered = [...forecast.outcomes].sort((a, b) => b.probability - a.probability);
  const headline = ordered[0];
  const rest = ordered.slice(1);
  const metaById = new Map(forecast.outcomeMeta.map((meta) => [meta.id, meta]));
  if (!headline) return null;

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="eyebrow">Forecast</p>
        <ProbabilityValue
          probability={headline.probability}
          size="lg"
          // "Toss-up", "Likely" and the rest read the number against 50%,
          // which only means anything when there are two ways for it to go.
          verdict={forecast.outcomes.length === 2}
          className="mt-3"
        />
        <p className="mt-3 text-[17px] font-medium text-ink sm:text-xl">
          {headline.label}
          {metaById.get(headline.id)?.detail ? (
            <span className="ml-2 text-[14px] font-normal text-muted">
              {metaById.get(headline.id)?.detail}
            </span>
          ) : null}
        </p>
      </div>

      <ProbabilityBar probability={headline.probability} leading />

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {rest.map((outcome) => (
          <li key={outcome.id} className="flex items-baseline gap-2">
            <span className="font-mono text-[13px] tabular-nums text-muted">
              {formatPercent(outcome.probability)}
            </span>
            <span className="text-[13px] text-muted">{outcome.label}</span>
          </li>
        ))}
      </ul>

      <ConfidenceIndicator confidence={forecast.confidence} />
    </div>
  );
}
