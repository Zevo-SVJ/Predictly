import { Logo } from "./Logo";
import type { ForecastResult } from "@/lib/types";
import { formatDate, formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * Screenshot-optimised forecast card.
 *
 * DOM-based on purpose: it renders identically in the share sheet and in an OG
 * image route, with no image-generation pipeline to maintain for the MVP.
 */
export function ShareCard({ forecast }: { forecast: ForecastResult }) {
  const headline =
    forecast.outcomes.find((o) => o.id === forecast.headlineOutcomeId) ?? forecast.outcomes[0];

  return (
    <div className="edge-lit relative aspect-[1200/630] w-full overflow-hidden rounded-card border border-line-strong bg-ink">
      <div className="grid-field absolute inset-0" aria-hidden />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-8">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-lime sm:text-xs">
          <Logo className="size-4" />
          Predictly
        </div>

        <div className="space-y-3 sm:space-y-5">
          <p className="line-clamp-2 text-base font-medium leading-snug text-fg sm:text-2xl">
            {forecast.question}
          </p>

          <div className="flex items-end gap-3 sm:gap-4">
            <p className="text-5xl font-semibold leading-none tracking-tighter tabular-nums text-lime sm:text-7xl">
              {formatPercent(forecast.probability)}
            </p>
            <div className="pb-1">
              <p className="text-sm font-semibold uppercase leading-none tracking-wide text-fg sm:text-lg">
                {headline?.label}
              </p>
              <p className="mt-1 text-[11px] text-muted sm:text-sm">
                {probabilityVerdict(forecast.probability)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between text-[10px] text-faint sm:text-xs">
          <span>Forecast made {formatDate(forecast.researchedAt)}</span>
          <span className="font-medium text-muted">predictly.app</span>
        </div>
      </div>
    </div>
  );
}
