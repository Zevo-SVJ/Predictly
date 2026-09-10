import { SourceLogoTile } from "./SourceLogo";
import { StanceChip } from "./StanceChip";
import type { DemoSource } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * A source row, as the research view shows it.
 *
 * Deliberately carries no headline and no link. In the demo that is a hard
 * requirement — inventing an article would be fabricating a citation — and in
 * the live product this is the compact form; the full linked source cards live
 * under the forecast where a reader has a reason to click out.
 *
 * `index` staggers the entrance so rows arrive one after another, which is what
 * research genuinely looks like as results come back.
 */
export function ResearchSource({
  source,
  index = 0,
  showScores = true,
  className,
}: {
  source: DemoSource;
  index?: number;
  showScores?: boolean;
  className?: string;
}) {
  return (
    <li
      className={cn("animate-row-in flex items-start gap-3 py-3", className)}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <SourceLogoTile brand={source.brand} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[14px] font-medium leading-tight text-ink">{source.name}</p>
          <span className="text-[11px] text-muted">{source.kind}</span>
          {/* On a phone the stance rides in the header row. Parked in a right
              column it would take a third of a 348px card and squeeze the beat
              below it into two truncated fragments. */}
          <StanceChip stance={source.stance} className="sm:hidden" />
        </div>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{source.beat}</p>
      </div>

      <div className="hidden shrink-0 flex-col items-end gap-1.5 pt-0.5 sm:flex">
        <StanceChip stance={source.stance} />
        {showScores ? (
          <span className="font-mono text-[10.5px] tabular-nums text-muted">
            REL {Math.round(source.reliability * 100)} · REV {Math.round(source.relevance * 100)}
          </span>
        ) : null}
      </div>
    </li>
  );
}
