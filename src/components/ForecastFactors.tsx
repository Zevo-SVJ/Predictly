import { TrendingDown, TrendingUp } from "lucide-react";
import type { ForecastFactor } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * What is pushing the number in each direction. Both columns are always
 * populated — a forecast with nothing on the downside isn't a forecast.
 */
export function ForecastFactors({
  up,
  down,
}: {
  up: ForecastFactor[];
  down: ForecastFactor[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
      <FactorColumn
        title="Pushing the probability up"
        icon={<TrendingUp className="size-4 text-yes" aria-hidden />}
        factors={up}
        barClass="bg-yes"
      />
      <FactorColumn
        title="Pushing it down"
        icon={<TrendingDown className="size-4 text-no" aria-hidden />}
        factors={down}
        barClass="bg-no"
      />
    </div>
  );
}

function FactorColumn({
  title,
  icon,
  factors,
  barClass,
}: {
  title: string;
  icon: React.ReactNode;
  factors: ForecastFactor[];
  barClass: string;
}) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-sm font-medium text-fg">
        {icon}
        {title}
      </h3>
      <ul className="mt-4 space-y-3.5">
        {factors.map((factor, index) => (
          <li key={index} className="space-y-2.5">
            <p className="text-sm leading-relaxed text-muted">{factor.text}</p>
            {/* Short, fixed-width meter — a full-width bar under a paragraph
                reads as an underline rather than as a weight. */}
            <div
              className="h-1 w-24 overflow-hidden rounded-full bg-elevated"
              role="img"
              aria-label={`Weight: ${Math.round(factor.weight * 100)} out of 100`}
            >
              <span
                className={cn("block h-full rounded-full opacity-80", barClass)}
                style={{ width: `${Math.max(12, Math.round(factor.weight * 100))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
