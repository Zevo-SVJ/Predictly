import { ProbabilityBar } from "./ProbabilityBar";
import { SourceLogoTile } from "./SourceLogo";
import type { BrandKey } from "@/lib/demo";
import { cn, formatPercent } from "@/lib/utils";

/**
 * One candidate answer, its share, and the mark that identifies it.
 *
 * On a phone the bar drops beneath the label rather than competing with it for
 * a 375px line — a percentage squeezed against a truncated name is the exact
 * failure mode of a desktop table pushed onto mobile.
 */
export function OutcomeRow({
  label,
  detail,
  probability,
  brand,
  leading = false,
  className,
}: {
  label: string;
  detail?: string;
  probability: number;
  brand?: BrandKey;
  leading?: boolean;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 py-3 sm:gap-4",
        leading && "sm:-mx-3 sm:rounded-[var(--radius-sm)] sm:bg-cobalt-soft/60 sm:px-3",
        className,
      )}
    >
      {brand ? <SourceLogoTile brand={brand} tone="brand" /> : <span className="w-9 shrink-0" />}

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate text-[15px] leading-tight",
                leading ? "font-semibold text-ink" : "font-medium text-ink",
              )}
            >
              {label}
            </span>
            {detail ? (
              <span className="mt-0.5 block truncate text-[12px] text-muted">{detail}</span>
            ) : null}
          </span>

          <span
            className={cn(
              "shrink-0 font-semibold tabular-nums",
              leading ? "text-[19px] text-cobalt" : "text-[15px] text-muted",
            )}
          >
            {formatPercent(probability)}
          </span>
        </span>

        <ProbabilityBar probability={probability} leading={leading} className="mt-2" />
      </span>
    </li>
  );
}
