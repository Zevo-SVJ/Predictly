import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { LogoOrb } from "./BrandLogo";
import { DEMO_APPLE_LADDER } from "@/lib/demo";
import { cn, formatPercent } from "@/lib/utils";

/**
 * The number, moving.
 *
 * Not an illustration of the idea that evidence changes a forecast — these are
 * the engine's own outputs, recomputed after each source is folded in. Which is
 * why the fourth row goes *down*: the New York Times is the one source pointing
 * the other way, and it takes six points off. No invented sequence would have
 * produced that, and it is the most convincing thing on the card.
 *
 * Deliberately not a line chart. A probability plotted against time reads as a
 * price, which is the one association this product cannot afford.
 */
export function EvidenceLadder({ className }: { className?: string }) {
  const [base, ...steps] = DEMO_APPLE_LADDER;
  if (!base) return null;

  const final = steps[steps.length - 1];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label">Base rate</span>
        <span className="text-[17px] font-medium tabular-nums text-muted">
          {formatPercent(base.probability)}
        </span>
      </div>

      <ul className="mt-4 space-y-2.5 border-t border-border pt-4">
        {steps.map((step) => {
          if (!step.source) return null;
          const up = step.delta > 0;
          const flat = step.delta === 0;
          const Icon = flat ? Minus : up ? ArrowUp : ArrowDown;

          return (
            <li key={step.source.id} className="flex items-center gap-3">
              <LogoOrb brand={step.source.brand} size="sm" />
              <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">
                {step.source.name}
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums",
                  flat
                    ? "bg-canvas text-muted"
                    : up
                      ? "bg-supports-soft text-supports"
                      : "bg-counters-soft text-counters",
                )}
              >
                <Icon className="size-3" strokeWidth={2.6} aria-hidden />
                {flat ? "0" : `${up ? "+" : ""}${step.delta}`}
              </span>
              <span className="w-11 shrink-0 text-right text-[13.5px] tabular-nums text-muted">
                {formatPercent(step.probability)}
              </span>
            </li>
          );
        })}
      </ul>

      {final ? (
        <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-border pt-5">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cobalt">
            Forecast
          </span>
          <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-cobalt">
            {formatPercent(final.probability)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
