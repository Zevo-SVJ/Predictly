import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "../Reveal";
import { ProbabilityMeter } from "../product/ProbabilityMeter";
import { SourceOrb } from "../product/SourceOrb";
import { DEMO_APPLE } from "@/lib/demo";
import { cn, formatPercent } from "@/lib/utils";

/**
 * The second — and last — forecast on the page.
 *
 * A binary question, so it takes a different shape from the hero's four-way
 * field: two outcome blocks side by side, the subject's own mark carried at
 * full size. Two examples is the whole budget for the page; a grid of a dozen
 * would say "look how many categories we have" when the point is "look what one
 * answer contains".
 */
export function SecondaryForecast() {
  const yes = DEMO_APPLE.outcomes.find((outcome) => outcome.id === "yes");
  const no = DEMO_APPLE.outcomes.find((outcome) => outcome.id === "no");
  if (!yes || !no) return null;

  const outcomes = [
    { id: "yes", label: "Yes", value: yes.probability, lead: true },
    { id: "no", label: "No", value: no.probability, lead: false },
  ];

  return (
    <section className="section-y bg-canvas">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>A second question</SectionEyebrow>
          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            Same machine, any subject.
          </h2>
        </div>

        <Reveal className="mx-auto mt-14 max-w-2xl sm:mt-20">
          <div className="relative">
            <article className="surface px-6 pb-14 pt-8 sm:px-10 sm:pb-16 sm:pt-10">
              <div className="flex items-center gap-4">
                <SourceOrb brand="apple" size="lg" />
                <div className="min-w-0">
                  <p className="label">Technology</p>
                  <p className="mt-1.5 text-[13px] text-muted">{DEMO_APPLE.horizon}</p>
                </div>
              </div>

              <h3 className="mt-8 text-[23px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[29px]">
                {DEMO_APPLE.question}
              </h3>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
                {outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className={cn(
                      "rounded-[var(--radius-md)] border p-5 text-center sm:p-7",
                      outcome.lead
                        ? "border-cobalt-line bg-cobalt-soft"
                        : "border-border bg-canvas",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-[0.16em]",
                        outcome.lead ? "text-cobalt" : "text-muted",
                      )}
                    >
                      {outcome.label}
                    </p>
                    <p
                      className={cn(
                        "mt-3 text-[2.75rem] font-semibold leading-[0.85] tracking-[-0.05em] tabular-nums sm:text-[3.5rem]",
                        outcome.lead ? "text-cobalt" : "text-muted",
                      )}
                    >
                      {formatPercent(outcome.value)}
                    </p>
                  </div>
                ))}
              </div>

              <ProbabilityMeter probability={yes.probability} size="md" className="mt-8" />

              <div className="mt-10 border-t border-border pt-7">
                <p className="label">Read from</p>
                <ul className="mt-4 flex flex-wrap items-start gap-4 sm:gap-6">
                  {DEMO_APPLE.sources.map((source) => (
                    <li key={source.id}>
                      <SourceOrb brand={source.brand} size="sm" label={source.name} />
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted shadow-[var(--shadow-object)]">
              Example forecast
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
