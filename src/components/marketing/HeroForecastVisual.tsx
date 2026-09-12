import { LogoOrbit } from "./LogoOrbit";
import { DEMO_RACE } from "@/lib/demo";
import { cn, formatPercent } from "@/lib/utils";

/**
 * The hero's product object, and the page's whole argument in one frame:
 * a question, the sources gathered around it, and the forecast that comes out.
 *
 * Two zones in one card rather than two cards, because the point is that these
 * are the same act. The orbit above supplies the evidence; the strip below is
 * what the evidence produced.
 *
 * Everything is DOM and SVG — no screenshot, no exported image — so it stays
 * crisp at any density and the numbers stay real.
 */
export function HeroForecastVisual({ className }: { className?: string }) {
  const ordered = [...DEMO_RACE.outcomes].sort((a, b) => b.probability - a.probability);
  const metaById = new Map(DEMO_RACE.outcomeMeta.map((meta) => [meta.id, meta]));
  const headline = ordered[0];
  const rest = ordered.slice(1);
  if (!headline) return null;

  const headlineMeta = metaById.get(headline.id);

  return (
    <div className={cn("relative", className)}>
      <div className="surface grid overflow-hidden lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 px-5 pb-4 pt-8 sm:px-8 sm:pb-6 sm:pt-10 lg:flex lg:items-center lg:py-10">
          <LogoOrbit question={DEMO_RACE.question} className="lg:max-w-none" />
        </div>

        {/* --- what came out of it ---------------------------------------- */}
        <div className="min-w-0 border-t border-border bg-raised px-6 py-7 sm:px-9 sm:py-9 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:py-12">
          <p className="label">Forecast</p>

          <p className="mt-4 text-[3.75rem] font-semibold leading-[0.82] tracking-[-0.055em] tabular-nums text-cobalt sm:text-[4.5rem]">
            {formatPercent(headline.probability)}
          </p>
          <p className="mt-4 flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em] text-ink sm:text-[20px]">
            {headline.label}
            {headlineMeta?.detail ? (
              <span className="text-[14px] font-normal text-muted">{headlineMeta.detail}</span>
            ) : null}
          </p>

          <span className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-border" aria-hidden>
            <span
              className="animate-bar-fill block h-full rounded-full bg-cobalt"
              style={{ width: `${headline.probability * 100}%` }}
            />
          </span>

          <ul className="mt-8 space-y-4">
            {rest.map((outcome) => (
              <li key={outcome.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0 truncate text-[14.5px] text-ink">{outcome.label}</span>
                  <span className="shrink-0 text-[14.5px] font-medium tabular-nums text-muted">
                    {formatPercent(outcome.probability)}
                  </span>
                </div>
                <span className="mt-2 flex h-[3px] overflow-hidden rounded-full bg-border" aria-hidden>
                  <span
                    className="animate-bar-fill block h-full rounded-full bg-border-strong"
                    style={{ width: `${Math.max(4, outcome.probability * 100)}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
            <span className="text-[13px] text-muted">
              Confidence <span className="font-semibold text-ink">High</span>
            </span>
            <span className="text-[13px] text-muted">
              {DEMO_RACE.sources.length} sources read
            </span>
          </div>
        </div>
      </div>

      {/* Hangs off the bottom edge, the way a caption sits on a printed plate. */}
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted shadow-[var(--shadow-object)]">
        Example forecast
      </span>
    </div>
  );
}
