import { SourceLogo } from "./SourceLogo";
import { StanceChip } from "./StanceChip";
import { ProbabilityBar } from "./ProbabilityBar";
import type { DemoSource } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * A source after it has been weighed, rather than merely collected.
 *
 * This is the component that carries the product's central claim: a source is
 * not a link, it is four scores. Relevance and reliability are shown as bars
 * because the point is that they are quantities the probability actually
 * depends on, not badges.
 */
export function EvidenceItem({
  source,
  index = 0,
  className,
}: {
  source: DemoSource;
  index?: number;
  className?: string;
}) {
  const scores = [
    { label: "Relevance", value: source.relevance },
    { label: "Reliability", value: source.reliability },
  ];

  return (
    <li
      className={cn(
        "animate-row-in rounded-[var(--radius-md)] border border-border bg-white p-4",
        className,
      )}
      style={{ animationDelay: `${index * 110}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <SourceLogo brand={source.brand} size={15} className="text-ink" />
          <p className="truncate text-[14px] font-medium text-ink">{source.name}</p>
        </div>
        <StanceChip stance={source.stance} />
      </div>

      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{source.beat}</p>

      <dl className="mt-3.5 space-y-2">
        {scores.map((score) => (
          <div key={score.label} className="flex items-center gap-3">
            <dt className="w-[4.75rem] shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {score.label}
            </dt>
            <dd className="flex min-w-0 flex-1 items-center gap-2.5">
              <ProbabilityBar probability={score.value} leading />
              <span className="w-7 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">
                {Math.round(score.value * 100)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
