import { ArrowDown, ArrowUp } from "lucide-react";
import { LogoOrb } from "./BrandLogo";
import type { BrandKey } from "./brandAssets";
import { cn, formatPercent } from "@/lib/utils";

/**
 * What moves a number, shown as an object rather than as a chart.
 *
 * No axes, no series, no grid — a probability that arrives on a plotted line
 * reads as a price, which is the one association this product cannot afford.
 * A figure, a cobalt pill, and two rows of marks pulling in opposite
 * directions says the same thing and says it in a second.
 */
export function EvidenceVisual({
  probability,
  verdict,
  supporting,
  against,
  className,
}: {
  probability: number;
  verdict: string;
  supporting: BrandKey[];
  against: BrandKey[];
  className?: string;
}) {
  const rows = [
    {
      id: "for",
      label: "Evidence supporting",
      icon: ArrowUp,
      tone: "text-supports bg-supports-soft",
      brands: supporting,
    },
    {
      id: "against",
      label: "Evidence against",
      icon: ArrowDown,
      tone: "text-counters bg-counters-soft",
      brands: against,
    },
  ];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <p className="text-[3.75rem] font-semibold leading-[0.82] tracking-[-0.05em] tabular-nums text-cobalt">
        {formatPercent(probability)}
      </p>
      <span className="mt-4 rounded-full bg-cobalt-soft px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-cobalt">
        {verdict}
      </span>

      <ul className="mt-9 w-full space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2.5">
              <span
                className={cn("flex size-6 items-center justify-center rounded-full", row.tone)}
                aria-hidden
              >
                <row.icon className="size-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-[13.5px] text-muted">{row.label}</span>
            </span>
            <span className="flex items-center gap-1.5">
              {row.brands.map((brand, index) => (
                <LogoOrb key={brand} brand={brand} size="sm" delayMs={index * 70} />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
