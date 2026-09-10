import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { ForecastHeader } from "./ForecastHeader";
import { OutcomeRow } from "./OutcomeRow";
import { SourceLogo } from "./SourceLogo";
import type { DemoForecast } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * The product, in one object.
 *
 * Question at the top, the distribution in the middle, the sources it was built
 * from at the bottom — the same order the pipeline runs in, so the card reads
 * as a summary of work rather than as a claim. It is a real component at every
 * width: the outcome rows restack, the source strip wraps, nothing is a bitmap.
 */
export function ForecastCard({
  forecast,
  example = true,
  className,
}: {
  forecast: DemoForecast;
  example?: boolean;
  className?: string;
}) {
  const ordered = [...forecast.outcomes].sort((a, b) => b.probability - a.probability);
  const metaById = new Map(forecast.outcomeMeta.map((meta) => [meta.id, meta]));

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white",
        "shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="p-5 sm:p-6">
        <ForecastHeader
          question={forecast.question}
          category={forecast.category}
          horizon={forecast.horizon}
          outcomes={forecast.outcomes.length}
          sources={forecast.sources.length}
          example={example}
        />
      </div>

      <ul className="border-t border-border px-5 py-1 sm:px-6">
        {ordered.map((outcome, index) => {
          const meta = metaById.get(outcome.id);
          return (
            <OutcomeRow
              key={outcome.id}
              label={outcome.label}
              detail={meta?.detail}
              brand={meta?.brand}
              probability={outcome.probability}
              leading={index === 0}
              className={index > 0 ? "border-t border-border/70" : undefined}
            />
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-canvas px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="eyebrow">Researched from</p>
          {/* Mark plus name, always. A row of bare logos is a recognition
              test the reader can fail; the name makes the mark a reinforcement
              rather than the only clue. */}
          <ul className="mt-2 flex flex-wrap items-center gap-1.5">
            {forecast.sources.map((source) => (
              <li
                key={source.id}
                className="flex items-center gap-1.5 rounded-full border border-border bg-white py-1 pl-2 pr-2.5"
              >
                <SourceLogo brand={source.brand} size={12} />
                <span className="text-[11.5px] text-muted">{source.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <ConfidenceIndicator confidence={forecast.confidence} />
      </div>
    </article>
  );
}
