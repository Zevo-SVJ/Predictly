import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "../Reveal";
import { ProbabilityMeter } from "../product/ProbabilityMeter";
import { SourceOrb } from "../product/SourceOrb";
import { StanceChip } from "../product/StanceChip";
import { DEMO_APPLE } from "@/lib/demo";
import { formatPercent } from "@/lib/utils";

/**
 * One card, one idea: this is what a forecast is built on.
 *
 * The source rows are the section — not a grid of source cards, not a feature
 * list about research. Each row is a real mark, what that outlet actually
 * covers, and which way it pushes the number that sits underneath them all.
 *
 * Nothing here quotes anyone. Inventing a headline or a link for a real
 * publication would be fabricating a citation, which is the one thing a
 * research product cannot do, so the rows carry a beat and a stance and stop.
 */
export function Evidence() {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>The evidence</SectionEyebrow>
          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            See what the forecast is built on.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
            Every source Predictly reads is scored on its own before any number
            exists — how relevant it is, how much the publisher is worth, and
            which way it points.
          </p>
        </div>

        <Reveal className="mx-auto mt-14 max-w-2xl sm:mt-20">
          <div className="relative">
            <div className="surface px-6 pb-14 pt-8 sm:px-10 sm:pb-16 sm:pt-10">
              <p className="label">Research</p>
              <h3 className="mt-4 text-[21px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[25px]">
                {DEMO_APPLE.question}
              </h3>

              <ul className="mt-9 divide-y divide-border border-y border-border">
                {DEMO_APPLE.sources.map((source) => (
                  <li key={source.id} className="flex items-start gap-4 py-5">
                    <SourceOrb brand={source.brand} size="md" />
                    {/* The stance rides in the name row rather than in a third
                        column: parked on the right it takes a quarter of a
                        326px card and squeezes the beat into three fragments. */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="min-w-0 truncate text-[15px] font-medium text-ink">
                          {source.name}
                        </p>
                        <StanceChip stance={source.stance} className="shrink-0" />
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-snug text-muted">{source.beat}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-center">
                <p className="label">Which becomes</p>
                <p className="mt-4 text-[4rem] font-semibold leading-[0.82] tracking-[-0.05em] tabular-nums text-cobalt sm:text-[5rem]">
                  {formatPercent(DEMO_APPLE.probability)}
                </p>
                <ProbabilityMeter
                  probability={DEMO_APPLE.probability}
                  size="md"
                  className="mx-auto mt-7 max-w-xs"
                />
              </div>
            </div>

            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted shadow-[var(--shadow-object)]">
              Example forecast
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
