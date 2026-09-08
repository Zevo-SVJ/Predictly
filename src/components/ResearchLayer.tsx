import { Reveal } from "./Reveal";

/**
 * The differentiator, shown as the shape of the work rather than claimed.
 *
 * These rows are the actual fields Predictly records for every source —
 * publisher, date, relevance, stance, credibility — laid out the way the
 * engine reasons about them. The entries describe KINDS of source rather than
 * naming publications: inventing plausible headlines, outlets and dates to
 * dress this section would be the exact fabrication the product exists to
 * avoid. A real forecast fills these rows with real citations.
 */
const ROWS = [
  { kind: "Official announcement", age: "2 days", relevance: 0.95, credibility: 0.95, stance: "supports" },
  { kind: "Established reporting, named sourcing", age: "4 days", relevance: 0.9, credibility: 0.78, stance: "supports" },
  { kind: "Primary filing or statement", age: "1 week", relevance: 0.82, credibility: 0.92, stance: "opposes" },
  { kind: "Specialist publication", age: "2 weeks", relevance: 0.7, credibility: 0.68, stance: "supports" },
  { kind: "Syndicated wire copy (deduplicated)", age: "4 days", relevance: 0.55, credibility: 0.6, stance: "neutral" },
  { kind: "Unattributed rumour, no corroboration", age: "3 days", relevance: 0.4, credibility: 0.18, stance: "supports" },
] as const;

const STANCE = {
  supports: { mark: "+", className: "text-yes" },
  opposes: { mark: "−", className: "text-no" },
  neutral: { mark: "·", className: "text-faint" },
} as const;

export function ResearchLayer() {
  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="container-canvas">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">The research layer</p>
              <h2
                className="mt-4 font-semibold leading-[0.92] tracking-[-0.045em]"
                style={{ fontSize: "var(--text-h2)" }}
              >
                A forecast is only as good as the evidence behind it.
              </h2>
              <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-muted">
                Every source is scored before it counts: how directly it bears
                on the question, how much it should move a forecaster, and
                whether the publisher earned that weight. Duplicated coverage
                collapses, so ten copies of one story count once.
              </p>
              <p className="mt-6 max-w-[40ch] text-[12.5px] leading-relaxed text-faint">
                Illustrative. The rows below are the fields Predictly records;
                a real forecast fills them with real citations.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line pb-3 sm:grid-cols-[1fr_5rem_7rem_2rem]">
                <span className="eyebrow">Source</span>
                <span className="eyebrow hidden sm:block">Age</span>
                <span className="eyebrow hidden sm:block">Relevance</span>
                <span className="eyebrow text-right">Dir</span>
              </div>

              <ul>
                {ROWS.map((row) => (
                  <li
                    key={row.kind}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line py-4 sm:grid-cols-[1fr_5rem_7rem_2rem]"
                  >
                    <span className="min-w-0">
                      <span className="block text-[14.5px] leading-snug text-fg">{row.kind}</span>
                      <span className="mt-1 block text-[12px] text-faint sm:hidden">
                        {row.age} · relevance {Math.round(row.relevance * 100)}
                      </span>
                    </span>

                    <span className="hidden font-mono text-[12px] tabular-nums text-muted sm:block">
                      {row.age}
                    </span>

                    <span className="hidden items-center gap-2 sm:flex">
                      <span className="h-px flex-1 bg-elevated">
                        <span
                          className="block h-px bg-muted"
                          style={{ width: `${row.relevance * 100}%` }}
                        />
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-faint">
                        {Math.round(row.relevance * 100)}
                      </span>
                    </span>

                    <span
                      className={`text-right font-mono text-[15px] ${STANCE[row.stance].className}`}
                      title={row.stance}
                    >
                      {STANCE[row.stance].mark}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-[12.5px] leading-relaxed text-faint">
                Weight is <span className="text-muted">relevance × credibility × recency</span>,
                aggregated against a base rate. Weak or stale sources barely move
                the number — that is the point.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
