import { LogoOrb } from "./BrandLogo";
import type { BrandKey } from "./brandAssets";
import { cn, formatPercent } from "@/lib/utils";

export interface VisualOutcome {
  id: string;
  label: string;
  probability: number;
  brand?: BrandKey;
}

/**
 * A field of outcomes, drawn as an illustration rather than a table.
 *
 * No borders, no cells, no header row: the leading outcome is simply larger and
 * cobalt, the rest recede, and a hairline bar under each carries the share. It
 * should read as a page from the product, not as a spreadsheet of it.
 */
export function PredictionVisual({
  question,
  outcomes,
  className,
}: {
  question: string;
  outcomes: VisualOutcome[];
  className?: string;
}) {
  const ordered = [...outcomes].sort((a, b) => b.probability - a.probability);

  return (
    <div className={cn("w-full", className)}>
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {question}
      </p>

      <ul className="mt-8 space-y-5">
        {ordered.map((outcome, index) => {
          const lead = index === 0;
          return (
            <li key={outcome.id}>
              <div className="flex items-center gap-3">
                {outcome.brand ? (
                  <LogoOrb brand={outcome.brand} size="sm" delayMs={index * 70} />
                ) : (
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-border-strong"
                    aria-hidden
                  >
                    <span className="h-px w-3 bg-border-strong" />
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate">
                  <span
                    className={cn(
                      "text-[15px]",
                      lead ? "font-semibold text-ink" : "font-medium text-muted",
                    )}
                  >
                    {outcome.label}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 tabular-nums",
                    lead ? "text-[22px] font-semibold text-cobalt" : "text-[15px] text-muted",
                  )}
                >
                  {formatPercent(outcome.probability)}
                </span>
              </div>
              <span className="mt-2.5 ml-14 flex h-1 overflow-hidden rounded-full bg-canvas" aria-hidden>
                <span
                  className={cn("animate-bar-fill block h-full rounded-full", lead ? "bg-cobalt" : "bg-border-strong")}
                  style={{ width: `${Math.max(3, outcome.probability * 100)}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
