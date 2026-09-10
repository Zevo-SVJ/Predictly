import { Reveal } from "../Reveal";
import { ConfidenceIndicator } from "../product/ConfidenceIndicator";
import { EventMeta } from "../product/EventMeta";
import { ExampleBadge, ExampleDisclosure } from "../product/ExampleBadge";
import { OutcomeRow } from "../product/OutcomeRow";
import { ProbabilityValue } from "../product/ProbabilityValue";
import { SourceLogoTile } from "../product/SourceLogo";
import { StanceChip } from "../product/StanceChip";
import { DEMO_RACE } from "@/lib/demo";

/**
 * The hero's card, delivered in full.
 *
 * The hero teases this question with the distribution alone; here it arrives
 * with the event frame, the constructor marks, the sources and the confidence
 * behind it. Motorsport is the example because it is one of the few domains
 * where every entity in the answer has a real, licensed mark — the interface is
 * visually alive without a single decorative illustration.
 */
export function InAction() {
  const ordered = [...DEMO_RACE.outcomes].sort((a, b) => b.probability - a.probability);
  const metaById = new Map(DEMO_RACE.outcomeMeta.map((meta) => [meta.id, meta]));
  const headline = ordered[0];
  const runnerUp = ordered[1];

  return (
    <section className="section-y">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">Predictly in action</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            A real event, a real distribution.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            Not a single number in isolation. Every outcome gets its share, and
            the ones Predictly rejected are as visible as the one it picked.
          </p>
        </div>

        <Reveal className="mt-10 sm:mt-14">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-lift)]">
            <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />

            <div className="relative border-b border-border p-5 sm:p-7">
              <ExampleBadge />
              <h3 className="mt-3 text-[22px] font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[30px]">
                {DEMO_RACE.question}
              </h3>
              <EventMeta
                horizon={DEMO_RACE.horizon}
                outcomes={DEMO_RACE.outcomes.length}
                sources={DEMO_RACE.sources.length}
                className="mt-4"
              />
            </div>

            <div className="relative grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <ul className="min-w-0 border-b border-border px-5 py-2 sm:px-7 lg:border-b-0 lg:border-r">
                {ordered.map((outcome, index) => {
                  const meta = metaById.get(outcome.id);
                  return (
                    <OutcomeRow
                      key={outcome.id}
                      label={outcome.label}
                      detail={meta?.detail}
                      brand={meta?.brand}
                      probability={outcome.probability}
                      leading={index === 0}
                      className={index > 0 ? "border-t border-border/70" : undefined}
                    />
                  );
                })}
              </ul>

              <div className="min-w-0 bg-raised/70 p-5 sm:p-7">
                {headline ? (
                  <>
                    <p className="eyebrow">Most likely</p>
                    <ProbabilityValue
                      probability={headline.probability}
                      size="md"
                      verdict={false}
                      className="mt-2"
                    />
                    <p className="mt-2 text-[15px] font-medium text-ink">{headline.label}</p>
                    {runnerUp ? (
                      <p className="mt-1 text-[13px] text-muted">
                        Ahead of {runnerUp.label} by{" "}
                        {Math.round((headline.probability - runnerUp.probability) * 100)} points
                      </p>
                    ) : null}
                  </>
                ) : null}

                <ConfidenceIndicator confidence={DEMO_RACE.confidence} className="mt-5" />

                <h4 className="eyebrow mt-7">Sources</h4>
                <ul className="mt-2.5 space-y-2.5">
                  {DEMO_RACE.sources.map((source) => (
                    <li key={source.id} className="flex items-center gap-2.5">
                      <SourceLogoTile brand={source.brand} className="size-8" />
                      <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                        {source.name}
                      </span>
                      <StanceChip stance={source.stance} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <ExampleDisclosure className="mt-4 max-w-2xl" />
      </div>
    </section>
  );
}
