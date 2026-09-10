import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { ProbabilityMeter } from "./ProbabilityMeter";
import { SourceOrb } from "./SourceOrb";
import type { DemoForecast } from "@/lib/demo";
import { cn, formatPercent } from "@/lib/utils";

/**
 * The page's centrepiece: one forecast, at full size.
 *
 * Composed as an editorial object rather than a dashboard — the number is the
 * only large thing, everything else is quiet, and the card is mostly air. A
 * denser version of this exists (`ForecastCard`) for places where a forecast is
 * one element among several; this is for the two places where the forecast *is*
 * the section.
 *
 * The "example forecast" pill hangs off the bottom edge on purpose: it is the
 * most visually distinctive spot on the card, so the label travels with any
 * screenshot of it.
 */
export function ForecastShowcase({
  forecast,
  as: Heading = "h2",
  className,
}: {
  forecast: DemoForecast;
  /** Where this object sits in the outline: beside the page h1, or under a section h2. */
  as?: "h2" | "h3";
  className?: string;
}) {
  const ordered = [...forecast.outcomes].sort((a, b) => b.probability - a.probability);
  const metaById = new Map(forecast.outcomeMeta.map((meta) => [meta.id, meta]));
  const headline = ordered[0];
  const rest = ordered.slice(1);
  if (!headline) return null;

  const headlineMeta = metaById.get(headline.id);

  return (
    <div className={cn("relative", className)}>
      <article className="surface px-6 pb-14 pt-8 sm:px-10 sm:pb-16 sm:pt-10">
        <p className="label">Predictly forecast</p>

        <Heading className="mt-4 text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[27px]">
          {forecast.question}
        </Heading>

        {/* --- the number --------------------------------------------- */}
        <div className="mt-10 text-center sm:mt-14">
          <p className="text-[5rem] font-semibold leading-[0.82] tracking-[-0.055em] tabular-nums text-cobalt sm:text-[7rem]">
            {formatPercent(headline.probability)}
          </p>
          <p className="mt-5 text-[19px] font-semibold tracking-[-0.02em] text-ink sm:text-[23px]">
            {headline.label}
          </p>
          {headlineMeta?.detail ? (
            <p className="mt-1 text-[14px] text-muted">{headlineMeta.detail}</p>
          ) : null}

          <ProbabilityMeter
            probability={headline.probability}
            size="lg"
            className="mx-auto mt-8 max-w-sm"
          />
        </div>

        {/* --- the field ----------------------------------------------- */}
        <ul className="mt-10 divide-y divide-border border-t border-border sm:mt-12">
          {rest.map((outcome) => (
            <li key={outcome.id} className="flex items-baseline justify-between gap-4 py-3.5">
              <span className="min-w-0 truncate text-[15px] text-ink">{outcome.label}</span>
              <span className="shrink-0 text-[15px] font-medium tabular-nums text-muted">
                {formatPercent(outcome.probability)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-7">
          <ConfidenceIndicator confidence={forecast.confidence} />
        </div>

        <ul className="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
          {forecast.sources.map((source) => (
            <li key={source.id}>
              <SourceOrb brand={source.brand} size="sm" />
              <span className="sr-only">{source.name}</span>
            </li>
          ))}
        </ul>
      </article>

      {/* Hangs off the bottom edge, the way a caption sits on a printed plate. */}
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted shadow-[var(--shadow-object)]">
        Example forecast
      </span>
    </div>
  );
}
